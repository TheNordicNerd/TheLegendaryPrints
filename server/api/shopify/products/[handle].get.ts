/**
 * GET /api/shopify/products/:handle
 * Fetches a single product by handle
 */

export default defineEventHandler(async (event) => {
  const handle = getRouterParam(event, 'handle');

  if (!handle) {
    throw createError({
      statusCode: 400,
      message: 'Product handle is required',
    });
  }

  const gql = `
    ${PRODUCT_FRAGMENT}

    query GetProductByHandle($handle: String!) {
      product(handle: $handle) {
        ...ProductFields
      }
    }
  `;

  try {
    const data = await shopifyFetch({
      query: gql,
      variables: { handle },
    });

    if (!data.product) {
      throw createError({
        statusCode: 404,
        message: `Product "${handle}" not found`,
      });
    }

    return data.product;
  } catch (error: any) {
    if (error.statusCode) throw error;

    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to fetch product',
    });
  }
});
