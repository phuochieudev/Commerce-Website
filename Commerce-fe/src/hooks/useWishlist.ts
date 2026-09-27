import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wishlistService } from '@services/wishlist.service';
import { toast } from 'sonner';

export const useLikeStatus = (productId: string, enabled: boolean) => {
  return useQuery({
    queryKey: ['like-status', productId],
    queryFn: () => wishlistService.getStatus(productId),
    enabled: enabled && !!productId,
  });
};

export const useMyWishlist = (enabled: boolean) => {
  return useQuery({
    queryKey: ['wishlist'],
    queryFn: () => wishlistService.getMyWishlist(),
    enabled,
  });
};

export const useToggleLike = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, liked }: { productId: string; liked: boolean }) =>
      liked ? wishlistService.unlike(productId) : wishlistService.like(productId),
    onSuccess: (_, { productId, liked }) => {
      queryClient.invalidateQueries({ queryKey: ['like-status', productId] });
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success(liked ? 'Đã bỏ thích sản phẩm' : 'Đã thêm vào yêu thích');
    },
    onError: () => {
      toast.error('Vui lòng đăng nhập để sử dụng tính năng này');
    },
  });
};
