/**
 * POST /api/shopify/cart/update-lines
 * Updates cart line quantities
 * Body: { cartId: string, lines: Array<{ id: string, quantity: number }> }
 */

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { cartId, lines } = body;

  if (!cartId || !lines || !Array.isArray(lines)) {
    throw createError({
      statusCode: 400,
      message: 'Cart ID and lines array are required',
    });
  }

  const gql = `
    ${CART_FRAGMENT}

    mutation UpdateCartLines($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
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

  try {
    const data = await shopifyFetch({
      query: gql,
      variables: {
        cartId,
        lines,
      },
    });

    if (data.cartLinesUpdate.userErrors.length > 0) {
      throw createError({
        statusCode: 400,
        message: data.cartLinesUpdate.userErrors[0].message,
      });
    }

    return data.cartLinesUpdate.cart;
  } catch (error: any) {
    if (error.statusCode) throw error;

    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to update cart lines',
    });
  }
});
