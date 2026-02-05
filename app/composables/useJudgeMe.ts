export interface JudgeMeReview {
  id: number;
  title: string;
  body: string;
  rating: number;
  reviewer: {
    name: string;
    email?: string;
  };
  created_at: string;
  verified_buyer: boolean;
  pictures: Array<{
    urls: {
      original: string;
      small: string;
      compact: string;
    };
  }>;
}

export interface JudgeMeResponse {
  success: boolean;
  reviews: JudgeMeReview[];
  rating: number;
  reviewCount: number;
  pagination: {
    currentPage: number;
    totalPages: number;
    perPage: number;
  };
}

export interface SubmitReviewData {
  email: string;
  name: string;
  title?: string;
  body: string;
  rating: number;
  productHandle?: string;
  productId?: string;
  pictures?: string[];
}

export interface SubmitReviewResponse {
  success: boolean;
  review?: any;
  message: string;
}

export const useJudgeMe = () => {
  const fetchReviews = async (
    productHandle?: string,
    productId?: string,
    page: number = 1,
    perPage: number = 10
  ): Promise<JudgeMeResponse | null> => {
    try {
      const params = new URLSearchParams();

      if (productHandle) params.append("productHandle", productHandle);
      if (productId) params.append("productId", productId);
      params.append("page", page.toString());
      params.append("perPage", perPage.toString());

      const response = await $fetch<JudgeMeResponse>(`/api/judge-me/reviews?${params.toString()}`);

      return response;
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => i < rating);
  };

  const fetchAllReviews = async (
    page: number = 1,
    perPage: number = 10
  ): Promise<JudgeMeResponse | null> => {
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("perPage", perPage.toString());

      const response = await $fetch<JudgeMeResponse>(
        `/api/judge-me/all-reviews?${params.toString()}`
      );

      return response;
    } catch (error) {
      console.error("Error fetching all reviews:", error);
      return null;
    }
  };

  const submitReview = async (reviewData: SubmitReviewData): Promise<SubmitReviewResponse> => {
    try {
      const response = await $fetch<SubmitReviewResponse>("/api/judge-me/reviews", {
        method: "POST",
        body: reviewData,
      });

      return response;
    } catch (error: any) {
      console.error("Error submitting review:", error);
      throw new Error(error.data?.statusMessage || error.message || "Failed to submit review");
    }
  };

  return {
    fetchReviews,
    fetchAllReviews,
    submitReview,
    formatDate,
    renderStars,
  };
};
