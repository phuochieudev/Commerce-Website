import { Sequelize } from 'sequelize';
import { IQueryHandler } from '../../../share/interface';

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

export class GetDashboardStatsQueryHandler implements IQueryHandler<{}, DashboardStats> {
  constructor(private readonly sequelize: Sequelize) {}

  async query(): Promise<DashboardStats> {
    const s = this.sequelize;

    const [productRows, userRows, orderRows, categoryRows, brandRows, revenueRows] =
      await Promise.all([
        s.query("SELECT COUNT(*) as c FROM products WHERE status != 'deleted'"),
        s.query("SELECT COUNT(*) as c FROM users WHERE status != 'deleted'"),
        s.query('SELECT COUNT(*) as c FROM orders'),
        s.query("SELECT COUNT(*) as c FROM categories WHERE status != 'deleted'"),
        s.query("SELECT COUNT(*) as c FROM brands WHERE status != 'deleted'"),
        s.query("SELECT COALESCE(SUM(total_amount), 0) as revenue FROM orders WHERE status != 'cancelled'"),
      ]) as any[];

    const productCount = (productRows[0] as any[])[0];
    const userCount = (userRows[0] as any[])[0];
    const orderCount = (orderRows[0] as any[])[0];
    const categoryCount = (categoryRows[0] as any[])[0];
    const brandCount = (brandRows[0] as any[])[0];
    const revenueRow = (revenueRows[0] as any[])[0];

    const [ordersByStatusRows] = (await s.query(
      'SELECT status, COUNT(*) as count FROM orders GROUP BY status'
    )) as any;

    const [revenueByDayRows] = (await s.query(
      `SELECT DATE(created_at) as date, COALESCE(SUM(total_amount), 0) as revenue
       FROM orders
       WHERE status != 'cancelled' AND created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
       GROUP BY DATE(created_at)
       ORDER BY date ASC`
    )) as any;

    const [recentOrdersRows] = (await s.query(
      `SELECT id, recipient_first_name as recipientFirstName, recipient_last_name as recipientLastName,
              total_amount as totalAmount, status, created_at as createdAt
       FROM orders
       ORDER BY created_at DESC
       LIMIT 5`
    )) as any;

    const [topProductsRows] = (await s.query(
      `SELECT p.id, p.name, p.price, COALESCE(SUM(oi.quantity), 0) as totalSold
       FROM products p
       LEFT JOIN order_items oi ON oi.product_id = p.id
       WHERE p.status != 'deleted'
       GROUP BY p.id, p.name, p.price
       ORDER BY totalSold DESC
       LIMIT 5`
    )) as any;

    return {
      totalProducts: parseInt(productCount.c, 10),
      totalUsers: parseInt(userCount.c, 10),
      totalOrders: parseInt(orderCount.c, 10),
      totalCategories: parseInt(categoryCount.c, 10),
      totalBrands: parseInt(brandCount.c, 10),
      totalRevenue: parseFloat(revenueRow.revenue),
      ordersByStatus: ordersByStatusRows.map((r: any) => ({ status: r.status, count: parseInt(r.count, 10) })),
      revenueByDay: revenueByDayRows.map((r: any) => ({ date: r.date, revenue: parseFloat(r.revenue) })),
      recentOrders: recentOrdersRows.map((r: any) => ({ ...r, totalAmount: parseFloat(r.totalAmount) })),
      topProducts: topProductsRows.map((r: any) => ({
        ...r,
        price: parseFloat(r.price),
        totalSold: parseInt(r.totalSold, 10),
      })),
    };
  }
}
