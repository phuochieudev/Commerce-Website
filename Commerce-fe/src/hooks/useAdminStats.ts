import { useQuery } from '@tanstack/react-query';
import { adminService } from '@services/admin.service';

export const useAdminStats = () => {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => adminService.getStats(),
  });
};
