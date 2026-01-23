/**
 * POST /api/shopify/cart/remove-lines
 * Removes items from cart
 * Body: { cartId: string, lineIds: Array<string> }
 */

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { cartId, lineIds } = body;

  if (!cartId || !lineIds || !Array.isArray(lineIds)) {
    throw createError({
      statusCode: 400,
      message: 'Cart ID and line IDs array are required',
    });
  }

  const gql = `
    ${CART_FRAGMENT}

    mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
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
        lineIds,
      },
    });

    if (data.cartLinesRemove.userErrors.length > 0) {
      throw createError({
        statusCode: 400,
        message: data.cartLinesRemove.userErrors[0].message,
      });
    }

    return data.cartLinesRemove.cart;
  } catch (error: any) {
    if (error.statusCode) throw error;

    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to remove cart lines',
    });
  }
});
