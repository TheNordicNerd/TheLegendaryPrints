/**
 * POST /api/shopify/cart/create
 * Creates a new cart
 * Body: { lines?: Array<{ merchandiseId: string, quantity: number }> }
 */

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const lines = body.lines || [];

  const gql = `
    ${CART_FRAGMENT}

    mutation CreateCart($input: CartInput!) {
      cartCreate(input: $input) {
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
        input: {
          lines,
        },
      },
    });

    if (data.cartCreate.userErrors.length > 0) {
      throw createError({
        statusCode: 400,
        message: data.cartCreate.userErrors[0].message,
      });
    }

    return data.cartCreate.cart;
  } catch (error: any) {
    if (error.statusCode) throw error;

    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to create cart',
    });
  }
});
