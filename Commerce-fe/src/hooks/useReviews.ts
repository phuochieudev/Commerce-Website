import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '@services/review.service';
import { toast } from 'sonner';

export const useReviews = (productId: string) => {
  return useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => reviewService.list(productId, 1, 50),
    enabled: !!productId,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, rating, content }: { productId: string; rating: number; content: string }) =>
      reviewService.create(productId, rating, content),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      toast.success('Cảm ơn bạn đã đánh giá sản phẩm!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Không thể gửi đánh giá');
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) => reviewService.delete(productId),
    onSuccess: (_, productId) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      toast.success('Đã xóa đánh giá');
    },
  });
};
