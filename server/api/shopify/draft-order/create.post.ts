/**
 * Create a Shopify Draft Order with custom pricing
 *
 * This endpoint uses the Admin API to create a draft order with custom line items and prices.
 * The customer is then redirected to the invoice URL to complete payment.
 */

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  const SHOPIFY_STORE_DOMAIN = config.shopifyStoreDomain;
  const SHOPIFY_ADMIN_ACCESS_TOKEN = config.shopifyAdminAccessToken;

  if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_ADMIN_ACCESS_TOKEN) {
    throw createError({
      statusCode: 500,
      message: 'Shopify Admin API credentials not configured',
    });
  }

  const { lineItems, customerEmail, shippingAddress, note } = body;

  if (!lineItems || !Array.isArray(lineItems) || lineItems.length === 0) {
    throw createError({
      statusCode: 400,
      message: 'Line items are required',
    });
  }

  try {
    // Create draft order using Admin API
    const url = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2026-01/draft_orders.json`;

    const draftOrder = {
      draft_order: {
        line_items: lineItems.map((item: any) => ({
          title: item.title,
          price: item.price.toString(),
          quantity: item.quantity || 1,
          properties: item.properties || [],
          taxable: item.taxable !== false,
        })),
        customer: customerEmail ? { email: customerEmail } : undefined,
        shipping_address: shippingAddress,
        note: note || 'Custom order created via frontend',
        use_customer_default_address: false,
        tags: ['custom-pricing', 'frontend-order'],
      },
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ADMIN_ACCESS_TOKEN,
      },
      body: JSON.stringify(draftOrder),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Shopify Admin API error:', response.status, errorText);
      throw createError({
        statusCode: response.status,
        message: `Failed to create draft order: ${response.statusText}`,
      });
    }

    const data = await response.json();

    // Return the invoice URL for checkout
    return {
      success: true,
      draftOrder: {
        id: data.draft_order.id,
        name: data.draft_order.name,
        invoiceUrl: data.draft_order.invoice_url,
        totalPrice: data.draft_order.total_price,
      },
    };
  } catch (error: any) {
    console.error('Draft order creation error:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to create draft order',
    });
  }
});
