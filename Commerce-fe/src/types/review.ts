export interface Review {
  userId: string;
  productId: string;
  rating: number;
  content?: string | null;
  createdAt?: string | null;
  updated?: string | null;
  user?: { firstName: string; lastName: string; avatar?: string } | null;
}

export interface ReviewListResponse {
  data: Review[];
  paging: { page: number; limit: number; total: number };
}
