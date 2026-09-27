import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { addressService } from '@services/address.service';
import { UserAddress } from '../types/address';
import { toast } from 'sonner';

export const useAddresses = (enabled = true) => {
  return useQuery({
    queryKey: ['addresses'],
    queryFn: () => addressService.getAll(),
    enabled,
  });
};

export const useCreateAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<UserAddress>) => addressService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Đã thêm địa chỉ');
    },
    onError: () => toast.error('Không thể thêm địa chỉ'),
  });
};

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<UserAddress> }) => addressService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Đã cập nhật địa chỉ');
    },
    onError: () => toast.error('Không thể cập nhật địa chỉ'),
  });
};

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => addressService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Đã xóa địa chỉ');
    },
    onError: () => toast.error('Không thể xóa địa chỉ'),
  });
};

export const useSetDefaultAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => addressService.setDefault(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });
};
