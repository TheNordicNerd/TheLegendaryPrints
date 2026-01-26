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

  const gql = `{
    products(first: ${limit}) {
      edges {
        node {
          id
          title
          handle
          description
          descriptionHtml
          tags
          availableForSale
          featuredImage {
            url
            altText
          }
          images(first: 10) {
            edges {
              node {
                url
                altText
              }
            }
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          variants(first: 50) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                availableForSale
              }
            }
          }
        }
      }
    }
  }`;

  try {
    const data = await shopifyFetch({
      query: gql,
    });

    const products = data.products.edges.map((edge: any) => edge.node);

    return {
      products,
      count: products.length,
    };
  } catch (error: any) {
    console.error("Shopify products API error:", error);
    throw createError({
      statusCode: 500,
      message: error.message || "Failed to fetch products",
    });
  }
});
