import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Package, Users, ShoppingCart, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    {
      label: 'Total Products',
      value: '1,234',
      icon: Package,
      color: 'bg-blue-500/10 text-blue-600',
    },
    {
      label: 'Total Users',
      value: '567',
      icon: Users,
      color: 'bg-green-500/10 text-green-600',
    },
    {
      label: 'Total Orders',
      value: '890',
      icon: ShoppingCart,
      color: 'bg-purple-500/10 text-purple-600',
    },
    {
      label: 'Revenue',
      value: '$45,231',
      icon: TrendingUp,
      color: 'bg-yellow-500/10 text-yellow-600',
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts placeholder */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Chart placeholder</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Chart placeholder</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
