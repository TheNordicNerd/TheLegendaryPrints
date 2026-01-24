/**
 * POST /api/shopify/cart/get
 * Fetches cart by ID (using POST to avoid URL encoding issues)
 */

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { cartId } = body;

  if (!cartId) {
    throw createError({
      statusCode: 400,
      message: 'Cart ID is required',
    });
  }

  const gql = `
    ${CART_FRAGMENT}

    query GetCart($id: ID!) {
      cart(id: $id) {
        ...CartFields
      }
    }
  `;

  try {
    const data = await shopifyFetch({
      query: gql,
      variables: { id: cartId },
    });

    if (!data.cart) {
      throw createError({
        statusCode: 404,
        message: 'Cart not found',
      });
    }

    return data.cart;
  } catch (error: any) {
    if (error.statusCode) throw error;

    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to fetch cart',
    });
  }
});
