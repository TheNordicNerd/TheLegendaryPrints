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

  const gql = `{
    product(handle: "${handle}") {
      id
      title
      handle
      description
      variants(first: 250) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            availableForSale
            selectedOptions {
              name
              value
            }
          }
        }
      }
    }
  }`;

  try {
    const data = await shopifyFetch({ query: gql });

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
