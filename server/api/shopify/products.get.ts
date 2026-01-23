/**
 * GET /api/shopify/products
 * Fetches all products from Shopify
 * Query params:
 *  - limit: number (default 20, max 250)
 *  - query: string (search query)
 *  - sortKey: string (TITLE, PRICE, CREATED_AT, etc.)
 *  - reverse: boolean
 */

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const limit = Math.min(Number(query.limit) || 20, 250);
  const searchQuery = query.query as string | undefined;
  const sortKey = (query.sortKey as string) || 'CREATED_AT';
  const reverse = query.reverse === 'true';

  const gql = `
    ${PRODUCT_FRAGMENT}

    query GetProducts($first: Int!, $query: String, $sortKey: ProductSortKeys, $reverse: Boolean) {
      products(first: $first, query: $query, sortKey: $sortKey, reverse: $reverse) {
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
        edges {
          cursor
          node {
            ...ProductFields
          }
        }
      }
    }
  `;

  try {
    const data = await shopifyFetch({
      query: gql,
      variables: {
        first: limit,
        query: searchQuery,
        sortKey,
        reverse,
      },
    });

    const products = data.products.edges.map((edge: any) => edge.node);
    const pageInfo = data.products.pageInfo;

    return {
      products,
      pageInfo,
      count: products.length,
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to fetch products',
    });
  }
});
