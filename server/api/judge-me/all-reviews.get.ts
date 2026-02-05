export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query = getQuery(event);

  const { page = 1, perPage = 10 } = query;

  try {
    // Ensure page and perPage are numbers
    const pageNum = Number(page) || 1;
    const perPageNum = Number(perPage) || 10;

    // Build Judge.me API URL - get all reviews for the shop
    const params = new URLSearchParams({
      api_token: config.judgeMePrivateToken,
      shop_domain: config.public.shopifyShop,
      page: pageNum.toString(),
      per_page: perPageNum.toString(),
    });

    const judgeMeUrl = `https://judge.me/api/v1/reviews?${params.toString()}`;

    const response = await fetch(judgeMeUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Judge.me API error:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });
      throw new Error(`Judge.me API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    return {
      success: true,
      reviews: data.reviews || [],
      rating: data.rating || 0,
      reviewCount: data.review_count || 0,
      pagination: {
        currentPage: data.current_page || 1,
        totalPages: data.total_pages || 1,
        perPage: data.per_page || 10,
      },
    };
  } catch (error: any) {
    console.error("Error fetching Judge.me reviews:", error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Failed to fetch reviews",
    });
  }
});
