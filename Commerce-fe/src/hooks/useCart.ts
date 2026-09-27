import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService } from '@services/cart.service';
import { CartItem } from '../types/cart';
import { toast } from 'sonner';

export const useCart = () => {
  return useQuery({
    queryKey: ['cart'],
    queryFn: () => cartService.getCart(),
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, attribute, quantity }: { productId: string; attribute: string; quantity: number }) =>
      cartService.addItem(productId, attribute, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Đã thêm vào giỏ hàng');
    },
    onError: () => {
      toast.error('Không thể thêm vào giỏ hàng');
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, quantity }: any) =>
      cartService.updateItem(itemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: () => {
      toast.error('Failed to update cart');
    },
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string) => cartService.removeItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Removed from cart');
    },
    onError: () => {
      toast.error('Failed to remove item');
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (items: CartItem[]) => cartService.clearCart(items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: () => {
      toast.error('Không thể xóa giỏ hàng');
    },
  });
};
