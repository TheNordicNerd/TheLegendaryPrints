# Shopify Image Handling Guide

How to handle product images and user-uploaded custom designs with Shopify integration.

---

## Product Images (Static Product Photos)

### Automatic from Shopify

When you create products in Shopify Admin and add images, they're automatically included in the API response:

```typescript
const { getProduct } = useShopify();
const product = await getProduct('die-cut-stickers');

// Product images are already available
console.log(product.featuredImage.url);
// → "https://cdn.shopify.com/s/files/1/0123/4567/products/sticker.jpg"

console.log(product.images.edges);
// → Array of all product images with URLs
```

**No transfer needed** - just use the Shopify CDN URLs directly in your Vue components.

---

## User-Uploaded Custom Designs

This is more complex because Shopify carts don't natively store custom uploaded files. Here are three solutions:

### **Option 1: Cart Attributes + Cloud Storage (Recommended)**

Store uploaded images in your own cloud storage and pass the URL to Shopify as a cart line item attribute.

#### How It Works:

```
1. User uploads design image
   ↓
2. Upload to S3/Cloudinary/your server
   ↓
3. Get permanent URL for the image
   ↓
4. Add to Shopify cart with custom attributes
   ↓
5. Shopify stores the image URL (not the file)
   ↓
6. Your fulfillment team downloads from URL when processing order
```

#### Implementation:

##### 1. Set up image upload server route

```typescript
// server/api/upload-design.post.ts
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export default defineEventHandler(async (event) => {
  const form = await readMultipartFormData(event);
  const file = form?.find(f => f.name === 'image');

  if (!file) {
    throw createError({ statusCode: 400, message: 'No file uploaded' });
  }

  // Generate unique filename
  const filename = `${uuidv4()}-${file.filename}`;
  const filepath = join(process.cwd(), 'public', 'uploads', filename);

  // Save file
  await writeFile(filepath, file.data);

  // Return public URL
  const config = useRuntimeConfig();
  const url = `${config.public.siteUrl}/uploads/${filename}`;

  return { url, filename };
});
```

##### 2. Update Shopify cart mutation to include attributes

```typescript
// server/api/shopify/cart/add-lines.post.ts
const gql = `
  ${CART_FRAGMENT}

  mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// Lines now include attributes
const lines = body.lines.map((line: any) => ({
  merchandiseId: line.merchandiseId,
  quantity: line.quantity,
  attributes: line.attributes || [], // Custom attributes
}));
```

##### 3. Pass image URL as cart line attribute

```typescript
// In your product page
const handleAddToCart = async () => {
  // Upload image first
  const formData = new FormData();
  formData.append('image', uploadedImageFile);

  const uploadResult = await $fetch('/api/upload-design', {
    method: 'POST',
    body: formData,
  });

  // Add to Shopify cart with image URL as attribute
  await cart.addItem({
    merchandiseId: variantId,
    quantity: effectiveQuantity,
    attributes: [
      { key: 'Custom Design URL', value: uploadResult.url },
      { key: 'Design Filename', value: uploadResult.filename },
      { key: 'Custom Size', value: `${effectiveSize}\"` },
    ],
  });
};
```

##### 4. View in Shopify Admin

When the order comes in, you'll see:

```
Order #1234
Items:
  - Die Cut Stickers (3" / Vinyl) × 100
    Custom Design URL: https://yoursite.com/uploads/abc-123-design.png
    Design Filename: abc-123-design.png
    Custom Size: 3"
```

**Pros:**
- ✅ Works with Shopify checkout
- ✅ Images stored on your infrastructure
- ✅ Full control over file storage
- ✅ Can use CDN for performance

**Cons:**
- ❌ Need to manage file storage
- ❌ Need to ensure files persist
- ❌ Fulfillment team downloads from URL

---

### **Option 2: Email Attachment After Order**

Simpler approach - collect the image but send it separately via email.

#### How It Works:

```
1. User uploads design (stored temporarily)
   ↓
2. Add to cart with note "Custom design will be emailed"
   ↓
3. Checkout on Shopify (no image attached)
   ↓
4. After order placed, send email with attachment
   ↓
5. Your team receives design separately
```

#### Implementation:

```typescript
// After successful Shopify order
const handleOrderComplete = async (orderId: string, uploadedImage: File) => {
  // Send email with design attachment
  await $fetch('/api/send-design-email', {
    method: 'POST',
    body: {
      orderId,
      customerEmail,
      designFile: uploadedImage,
    },
  });
};
```

**Pros:**
- ✅ Very simple implementation
- ✅ No extra file storage needed
- ✅ Standard email attachment

**Cons:**
- ❌ Design and order are separate
- ❌ Manual matching required
- ❌ Risk of emails being missed

---

### **Option 3: Shopify Draft Orders API**

Use Shopify's Draft Orders to attach custom data before checkout.

#### How It Works:

```
1. User adds items and uploads design
   ↓
2. Create Draft Order in Shopify (server-side)
   ↓
3. Upload design to Shopify Files API
   ↓
4. Attach file reference to Draft Order
   ↓
5. Send customer invoice link
   ↓
6. Customer completes payment
```

**Pros:**
- ✅ Everything in Shopify
- ✅ Design attached to order
- ✅ Professional workflow

**Cons:**
- ❌ More complex implementation
- ❌ Requires Admin API (not Storefront API)
- ❌ Different checkout flow
- ❌ Need server-side Draft Order creation

---

## Recommended Approach: Option 1 with Cloudinary

Use **Option 1** with Cloudinary for best results:

### Setup Cloudinary

```bash
npm install cloudinary
```

```env
# .env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Upload Endpoint

```typescript
// server/api/upload-design.post.ts
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default defineEventHandler(async (event) => {
  const form = await readMultipartFormData(event);
  const file = form?.find(f => f.name === 'image');

  if (!file) {
    throw createError({ statusCode: 400, message: 'No file uploaded' });
  }

  // Upload to Cloudinary
  const uploadResult = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'customer-designs' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(file.data);
  });

  return {
    url: uploadResult.secure_url,
    publicId: uploadResult.public_id,
  };
});
```

### Benefits of Cloudinary:
- ✅ Automatic image optimization
- ✅ CDN delivery
- ✅ Transformations (resize, format, quality)
- ✅ Reliable cloud storage
- ✅ No server disk space needed

---

## Updated Cart Line Structure

### Mock Mode (Current)
```typescript
{
  productId: 'die-cut-stickers',
  uploadedImage: 'data:image/png;base64,...', // Base64 string
  uploadedFileName: 'my-design.png',
}
```

### Shopify Mode (With Attributes)
```typescript
{
  merchandiseId: 'gid://shopify/ProductVariant/123',
  quantity: 100,
  attributes: [
    { key: 'Custom Design URL', value: 'https://res.cloudinary.com/...' },
    { key: 'Design Filename', value: 'my-design.png' },
    { key: 'Custom Size', value: '3"' },
    { key: 'Custom Quantity', value: '5000' },
  ],
}
```

---

## Implementation Checklist

For **Option 1** (Cart Attributes + Cloud Storage):

- [ ] Set up Cloudinary account
- [ ] Add Cloudinary credentials to `.env`
- [ ] Create `/api/upload-design` endpoint
- [ ] Update `addItem()` to upload image first
- [ ] Pass image URL as cart line attribute
- [ ] Update Shopify cart mutations to include attributes
- [ ] Test full flow: upload → cart → checkout
- [ ] Document for fulfillment team

---

## Viewing Custom Designs in Orders

### In Shopify Admin:

1. Go to **Orders**
2. Click on an order
3. Scroll to line items
4. Click "View more" on item
5. See **Custom attributes** section:
   ```
   Custom Design URL: https://res.cloudinary.com/your-cloud/designs/abc123.png
   Design Filename: my-logo.png
   Custom Size: 3"
   ```
6. Click URL to download design

### Via Shopify Admin API:

```graphql
{
  order(id: "gid://shopify/Order/123") {
    lineItems(first: 10) {
      edges {
        node {
          title
          customAttributes {
            key
            value
          }
        }
      }
    }
  }
}
```

---

## Storage Costs Comparison

| Solution | Storage Cost | Bandwidth | Complexity |
|----------|--------------|-----------|------------|
| Local Server | Disk space | Your bandwidth | Low |
| Cloudinary | ~$0.10/GB | Included | Low |
| AWS S3 | ~$0.023/GB | ~$0.09/GB | Medium |
| Shopify Files | Included | Included | High |

**Recommendation:** Cloudinary for simplicity and performance.

---

## Security Considerations

1. **Validate file types** - Only allow images
2. **Limit file size** - Max 10MB per upload
3. **Scan for malware** - Use Cloudinary's moderation
4. **Use signed URLs** - Prevent unauthorized access
5. **Set expiration** - Auto-delete after 90 days if needed

---

## Need Help?

- See [CART_SYSTEMS.md](./CART_SYSTEMS.md) for cart mode documentation
- See [SHOPIFY_PRODUCT_SETUP.md](./SHOPIFY_PRODUCT_SETUP.md) for product configuration
- Check [Cloudinary docs](https://cloudinary.com/documentation) for upload details
- Check [Shopify Cart Attributes](https://shopify.dev/api/storefront/2024-01/mutations/cartLinesAdd#argument-cartlinesadd-lines) docs
