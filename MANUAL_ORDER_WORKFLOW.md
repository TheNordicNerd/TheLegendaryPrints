# Manual Order Processing Workflow

## Overview

Since Shopify Storefront API doesn't support custom pricing, we've implemented a manual order capture system that allows customers to submit orders with custom prices. You'll then process these orders manually and send payment links.

## How It Works

### Customer Flow

1. **Product Selection**: Customer selects size, quantity, and uploads design
2. **Cart**: Cart displays correct custom-calculated prices
3. **Checkout**: Instead of Shopify checkout, customer clicks "Proceed to Checkout" and goes to manual checkout form
4. **Order Submission**: Customer enters contact info and submits order
5. **Confirmation**: Customer sees confirmation page and receives email (when you set up email)

### Admin Flow (Your Process)

1. **Receive Order**: Order details sent to your system (currently returns success, needs email setup)
2. **Review Order**: Check design, pricing, and order details
3. **Create Invoice**: Manually create Shopify invoice or use payment processor (Stripe, PayPal, etc.)
4. **Send Payment Link**: Email customer the payment link
5. **Process Order**: After payment, fulfill order through Shopify

## Files Created

- `/server/api/orders/submit.post.ts` - API endpoint to capture orders
- `/app/pages/checkout-manual.vue` - Manual checkout form
- `/app/pages/order-confirmation.vue` - Confirmation page

## Current Limitations

❌ **No email notifications** (needs setup)
❌ **No database storage** (orders not saved)
❌ **Manual payment link creation** (not automated)

## Next Steps to Complete

### 1. Set Up Email Notifications

Add email service (Resend, SendGrid, etc.) to send:
- Order confirmation to customer
- Order notification to admin with details

### 2. Add Database Storage

Store orders in database (Supabase, MongoDB, etc.) so you can:
- Track orders
- View order history
- Manage order status

### 3. Payment Integration Options

**Option A: Stripe Payment Links**
- Create Stripe payment link for each order
- Send to customer
- Webhook confirms payment
- Fulfill order

**Option B: PayPal Invoicing**
- Create PayPal invoice
- Send to customer
- Customer pays through PayPal
- Fulfill order

**Option C: Shopify Manual Order**
- Create manual order in Shopify admin with custom prices
- Use Shopify's payment request feature
- Customer pays through Shopify

### 4. Order Management Dashboard (Optional)

Build admin dashboard to:
- View pending orders
- Create payment links
- Track order status
- Manage fulfillment

## Advantages

✅ Full control over pricing
✅ No Shopify Admin API needed
✅ Custom pricing per order
✅ Works with existing products
✅ Can still use Shopify for fulfillment

## Disadvantages

❌ Manual work required
❌ Not fully automated
❌ Slower than direct checkout
❌ Requires payment link creation

## Alternative: Get Shopify Admin API Access

If you can get Admin API access, you can automate this entire process with Draft Orders. See [PRICING_ISSUE.md](./PRICING_ISSUE.md) for details.

## Testing the Flow

1. Add product to cart
2. Go to cart page
3. Click "Proceed to Checkout"
4. Fill out manual checkout form
5. Submit order
6. See confirmation page

The order data will be logged to console (currently). You'll need to add email/database to actually capture orders.
