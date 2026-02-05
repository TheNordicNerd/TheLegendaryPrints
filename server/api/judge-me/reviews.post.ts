export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  const {
    email,
    name,
    title,
    body: reviewBody,
    rating,
    productHandle,
    productId,
    pictures,
  } = body;

  // Validation
  if (!email || !name || !reviewBody || !rating) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing required fields: email, name, body, and rating are required",
    });
  }

  if (!productHandle && !productId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Either productHandle or productId is required",
    });
  }

  if (rating < 1 || rating > 5) {
    throw createError({
      statusCode: 400,
      statusMessage: "Rating must be between 1 and 5",
    });
  }

  try {
    // Build Judge.me API request
    // Note: shop_domain should be the full myshopify.com domain
    const shopDomain = config.public.shopifyShop;

    console.log("Submitting review to Judge.me:", {
      shop_domain: shopDomain,
      productHandle,
      productId,
      rating,
    });

    const reviewData: any = {
      api_token: config.judgeMePrivateToken,
      shop_domain: shopDomain,
      email,
      name,
      rating,
      body: reviewBody,
    };

    if (title) {
      reviewData.title = title;
    }

    if (productHandle) {
      reviewData.product_handle = productHandle;
    } else if (productId) {
      reviewData.product_id = productId;
    }

    // Add pictures if provided
    if (pictures && Array.isArray(pictures) && pictures.length > 0) {
      reviewData.pictures = pictures;
    }

    const judgeMeUrl = "https://judge.me/api/v1/reviews";

    const response = await fetch(judgeMeUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ review: reviewData }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Judge.me API error response:", {
        status: response.status,
        statusText: response.statusText,
        errorData,
      });
      throw new Error(
        errorData.message || `Judge.me API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("Judge.me API success response:", data);

    return {
      success: true,
      review: data.review,
      message: "Review submitted successfully! It will appear after moderation.",
    };
  } catch (error: any) {
    console.error("Error submitting Judge.me review:", error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Failed to submit review",
    });
  }
});
