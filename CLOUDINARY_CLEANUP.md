# Cloudinary Image Cleanup Strategy

## The Problem

When customers upload images but don't complete their order, those images remain in Cloudinary indefinitely. This wastes storage and could eventually exceed free tier limits.

## Solution Options

### Option 1: Time-Based Cleanup (Current Implementation) ⭐

**How it works:**
- Automatically deletes images older than 7 days from the `sticker-designs` folder
- Runs via a scheduled job (cron, Netlify scheduled function, or manual trigger)
- Simple, no database required

**Setup:**

1. **Manual Cleanup** (test it first):
   ```bash
   # Call the cleanup endpoint manually
   curl -X POST https://your-site.com/api/cleanup/orphaned-images
   ```

2. **Automated Cleanup** (choose one):

   **Option A: Netlify Scheduled Functions**
   ```toml
   # Add to netlify.toml
   [[functions]]
   name = "cleanup-images"
   schedule = "0 2 * * *"  # Run at 2 AM daily
   ```

   **Option B: GitHub Actions**
   ```yaml
   # .github/workflows/cleanup.yml
   name: Cleanup Orphaned Images
   on:
     schedule:
       - cron: '0 2 * * *'  # Run at 2 AM daily

   jobs:
     cleanup:
       runs-on: ubuntu-latest
       steps:
         - name: Trigger cleanup
           run: |
             curl -X POST https://your-site.com/api/cleanup/orphaned-images
   ```

   **Option C: Cron Job (if you have a server)**
   ```bash
   # Add to crontab
   0 2 * * * curl -X POST https://your-site.com/api/cleanup/orphaned-images
   ```

**Pros:**
- ✅ Simple implementation
- ✅ No database required
- ✅ Works with current setup

**Cons:**
- ⚠️ Might delete images from pending carts if users take >7 days
- ⚠️ No way to know which images belong to completed orders

---

### Option 2: Database Tracking (Recommended for Production)

**How it works:**
1. Store image metadata in a database when uploaded
2. Mark images as "used" when order is completed
3. Delete unused images after X days

**Implementation:**

```typescript
// Example database schema (PostgreSQL, MySQL, etc.)
CREATE TABLE uploaded_images (
  id SERIAL PRIMARY KEY,
  public_id VARCHAR(255) UNIQUE NOT NULL,
  cloudinary_url TEXT NOT NULL,
  uploaded_at TIMESTAMP DEFAULT NOW(),
  used_in_order BOOLEAN DEFAULT FALSE,
  order_id VARCHAR(255),
  expires_at TIMESTAMP  -- Auto-delete after 7 days if not used
);
```

Then modify the upload/cleanup flow:
1. **On upload**: Insert record with `expires_at = NOW() + 7 days`
2. **On order completion**: Set `used_in_order = true`, clear `expires_at`
3. **Cleanup job**: Delete images where `used_in_order = false` AND `expires_at < NOW()`

**Pros:**
- ✅ Never deletes images from completed orders
- ✅ Can extend time for pending carts
- ✅ Better analytics (know which images were actually ordered)

**Cons:**
- ⚠️ Requires database setup
- ⚠️ More complex implementation

---

### Option 3: Hybrid Approach

Use **Option 1** now (time-based), then migrate to **Option 2** when you:
- Have multiple customers using the site
- Need better order tracking
- Want to extend cart expiry beyond 7 days

---

## Current Implementation

We've implemented **Option 1** (Time-Based Cleanup).

### Files Created:
- `/server/api/cleanup/orphaned-images.post.ts` - Cleanup endpoint

### Configuration:
- **Default retention**: 7 days
- **Folder**: `sticker-designs/`
- **Max images per cleanup**: 500

### To Use:

**Test the cleanup manually:**
```bash
curl -X POST http://localhost:3000/api/cleanup/orphaned-images
```

**Response:**
```json
{
  "success": true,
  "message": "Cleanup complete. Deleted 12 images.",
  "deletedCount": 12,
  "deletedImages": ["sticker-designs/abc123", "..."],
  "errors": []  // Only present if there were errors
}
```

### Security Recommendations:

1. **Protect the endpoint** - Add authentication:
   ```typescript
   // Add to the cleanup endpoint
   const authHeader = getHeader(event, 'authorization');
   if (authHeader !== `Bearer ${config.cleanupApiKey}`) {
     throw createError({ statusCode: 401, message: 'Unauthorized' });
   }
   ```

2. **Add to .env**:
   ```env
   CLEANUP_API_KEY=your-secret-key-here
   ```

3. **Use the key in cron jobs**:
   ```bash
   curl -X POST https://your-site.com/api/cleanup/orphaned-images \
     -H "Authorization: Bearer your-secret-key-here"
   ```

---

## Adjusting Retention Period

To change from 7 days to a different period, edit `/server/api/cleanup/orphaned-images.post.ts`:

```typescript
// Change this line:
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);  // Change 7 to your desired days
```

---

## Monitoring

You can check Cloudinary usage in your [dashboard](https://console.cloudinary.com/console):
- **Storage**: See how much space is used
- **Bandwidth**: Track monthly transfer
- **Transformations**: Monitor API usage

If you're approaching limits, reduce the retention period or implement Option 2.

---

## FAQ

**Q: What if someone has items in their cart for more than 7 days?**
A: Their images will be deleted. Consider extending to 14 or 30 days, or implement Option 2.

**Q: How often should I run cleanup?**
A: Daily at a low-traffic time (e.g., 2 AM) is recommended.

**Q: What happens if cleanup fails?**
A: The endpoint returns errors in the response. Check logs and retry.

**Q: Can I manually delete specific images?**
A: Yes, use the existing DELETE endpoint:
```bash
curl -X DELETE http://localhost:3000/api/upload/image \
  -H "Content-Type: application/json" \
  -d '{"publicId": "sticker-designs/abc123"}'
```

**Q: Will this delete images from completed Shopify orders?**
A: Not from the Shopify order itself (the URL is stored there), but it will delete the actual file from Cloudinary. To prevent this, implement Option 2.
