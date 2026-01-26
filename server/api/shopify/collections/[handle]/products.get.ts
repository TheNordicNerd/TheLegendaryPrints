/**
 * GET /api/shopify/collections/:handle/products
 * Fetches products from a specific collection by handle
 */

export default defineEventHandler(async (event) => {
  const handle = getRouterParam(event, "handle");
  const query = getQuery(event);
  const limit = Math.min(Number(query.limit) || 20, 250);

  if (!handle) {
    throw createError({
      statusCode: 400,
      message: "Collection handle is required",
    });
  }

  const gql = `{
    collection(handle: "${handle}") {
      id
      title
      handle
      descriptionHtml
      products(first: ${limit}) {
        edges {
          node {
            id
            title
            handle
            descriptionHtml
            tags
            availableForSale
            featuredImage {
              url
              altText
              width
              height
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
        }
      }
    }
  }`;

  try {
    const data = await shopifyFetch({ query: gql });

    if (!data.collection) {
      throw createError({
        statusCode: 404,
        message: `Collection "${handle}" not found`,
      });
    }

    const products = data.collection.products.edges.map((edge: any) => edge.node);

    return {
      collection: {
        id: data.collection.id,
        title: data.collection.title,
        handle: data.collection.handle,
        description: data.collection.descriptionHtml,
      },
      products,
      count: products.length,
    };
  } catch (error: any) {
    if (error.statusCode) throw error;

    throw createError({
      statusCode: 500,
      message: error.message || "Failed to fetch collection products",
    });
  }
});
