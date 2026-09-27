import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Skeleton } from '@components/ui/skeleton';
import { Badge } from '@components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@components/ui/table';
import { useAdminStats } from '@hooks/useAdminStats';
import { formatPrice, formatDate } from '@utils/format';
import { Package, Users, ShoppingCart, FolderTree, ShoppingBag, TrendingUp } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const STATUS_COLORS: Record<string, string> = {
  pending: '#f59e0b',
  confirmed: '#3b82f6',
  processing: '#8b5cf6',
  shipping: '#06b6d4',
  delivered: '#22c55e',
  cancelled: '#ef4444',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipping: 'Shipping',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'success' | 'warning';

function statusBadgeVariant(status: string): BadgeVariant {
  switch (status) {
    case 'delivered':
      return 'success';
    case 'pending':
    case 'processing':
      return 'warning';
    case 'cancelled':
      return 'destructive';
    case 'confirmed':
    case 'shipping':
      return 'secondary';
    default:
      return 'default';
  }
}

function formatShortDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export default function AdminDashboard() {
  const { data: stats, isLoading } = useAdminStats();

  const statCards = useMemo(
    () => [
      { label: 'Total Products', value: stats?.totalProducts ?? 0, icon: Package, color: 'bg-blue-500/10 text-blue-600' },
      { label: 'Total Users', value: stats?.totalUsers ?? 0, icon: Users, color: 'bg-green-500/10 text-green-600' },
      { label: 'Total Orders', value: stats?.totalOrders ?? 0, icon: ShoppingCart, color: 'bg-purple-500/10 text-purple-600' },
      { label: 'Total Categories', value: stats?.totalCategories ?? 0, icon: FolderTree, color: 'bg-cyan-500/10 text-cyan-600' },
      { label: 'Total Brands', value: stats?.totalBrands ?? 0, icon: ShoppingBag, color: 'bg-amber-500/10 text-amber-600' },
    ],
    [stats]
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-48" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value.toLocaleString('vi-VN')}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold mt-1">{formatPrice(stats?.totalRevenue ?? 0)}</p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10 text-primary">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={stats?.revenueByDay ?? []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => formatShortDate(String(value))}
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(value) => formatPrice(Number(value))}
                  width={90}
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value) => [formatPrice(Number(value)), 'Revenue']}
                  labelFormatter={(label) => formatShortDate(String(label))}
                />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Orders by Status</CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.ordersByStatus && stats.ordersByStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={stats.ordersByStatus}
                    dataKey="count"
                    nameKey="status"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={2}
                  >
                    {stats.ordersByStatus.map((entry) => (
                      <Cell key={entry.status} fill={STATUS_COLORS[entry.status] ?? '#94a3b8'} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [value, STATUS_LABELS[String(name)] ?? String(name)]} />
                  <Legend formatter={(value) => STATUS_LABELS[String(value)] ?? String(value)} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground py-12 text-center">No order data</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders & Top Products */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                  stats.recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        {order.recipientFirstName} {order.recipientLastName}
                      </TableCell>
                      <TableCell>{formatPrice(order.totalAmount)}</TableCell>
                      <TableCell>
                        <Badge variant={statusBadgeVariant(order.status)}>
                          {STATUS_LABELS[order.status] ?? order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(order.createdAt)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      No recent orders
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Sold</TableHead>
                  <TableHead>Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats?.topProducts && stats.topProducts.length > 0 ? (
                  stats.topProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.totalSold}</TableCell>
                      <TableCell>{formatPrice(product.price)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                      No product data
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
