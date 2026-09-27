export interface DashboardStats {
  totalProducts: number;
  totalUsers: number;
  totalOrders: number;
  totalCategories: number;
  totalBrands: number;
  totalRevenue: number;
  ordersByStatus: { status: string; count: number }[];
  revenueByDay: { date: string; revenue: number }[];
  recentOrders: {
    id: string;
    recipientFirstName: string;
    recipientLastName: string;
    totalAmount: number;
    status: string;
    createdAt: string;
  }[];
  topProducts: { id: string; name: string; totalSold: number; price: number }[];
}
