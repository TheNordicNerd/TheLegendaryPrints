/**
 * POST /api/shopify/cart/add-lines
 * Adds items to cart
 * Body: { cartId: string, lines: Array<{ merchandiseId: string, quantity: number }> }
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

  try {
    const data = await shopifyFetch({
      query: gql,
      variables: {
        cartId,
        lines,
      },
    });

    if (data.cartLinesAdd.userErrors.length > 0) {
      throw createError({
        statusCode: 400,
        message: data.cartLinesAdd.userErrors[0].message,
      });
    }

    return data.cartLinesAdd.cart;
  } catch (error: any) {
    if (error.statusCode) throw error;

    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to add items to cart',
    });
  }
});
