import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { couponService } from '@services/coupon.service';
import { Coupon } from '../types/coupon';
import { toast } from 'sonner';

export const useCoupons = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['coupons', page, limit],
    queryFn: () => couponService.getAll(page, limit),
  });
};

export const useCreateCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Coupon>) => couponService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      toast.success('Đã tạo mã giảm giá');
    },
    onError: (error: any) => toast.error(error?.response?.data?.message || 'Không thể tạo mã giảm giá'),
  });
};

export const useUpdateCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Coupon> }) => couponService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      toast.success('Đã cập nhật mã giảm giá');
    },
    onError: () => toast.error('Không thể cập nhật mã giảm giá'),
  });
};

export const useDeleteCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => couponService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      toast.success('Đã xóa mã giảm giá');
    },
    onError: () => toast.error('Không thể xóa mã giảm giá'),
  });
};
