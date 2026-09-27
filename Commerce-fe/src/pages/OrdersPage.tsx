import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@store/auth.store';
import { useCancelOrder, useOrders } from '@hooks/useOrders';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Badge } from '@components/ui/badge';
import { Loader2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@components/ui/pagination';
import { formatPrice, formatDate } from '@utils/format';
import type { Order, OrderStatus } from '../types/order';

const PAGE_LIMIT = 10;

function getStatusVariant(status: OrderStatus): 'success' | 'warning' | 'destructive' | 'secondary' {
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
    default:
      return 'secondary';
  }
}

function statusLabel(status: OrderStatus) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function isCancellable(status: OrderStatus) {
  return status === 'pending' || status === 'confirmed';
}

export default function OrdersPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useOrders(page, PAGE_LIMIT);
  const cancelOrder = useCancelOrder();

  if (!user) {
    navigate('/login');
    return null;
  }

  const totalPages = data ? Math.max(1, Math.ceil(data.paging.total / data.paging.limit)) : 1;

  const handleCancel = (order: Order) => {
    if (!window.confirm(`Cancel order #${order.id.substring(0, 8)}?`)) return;
    cancelOrder.mutate(order.id);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">My Orders</h1>

      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data && data.data.length > 0 ? (
                    data.data.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono">{order.id.substring(0, 8)}</TableCell>
                        <TableCell>{formatDate(order.createdAt)}</TableCell>
                        <TableCell>
                          {order.recipientFirstName} {order.recipientLastName}
                        </TableCell>
                        <TableCell>{formatPrice(order.totalAmount)}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(order.status)}>{statusLabel(order.status)}</Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          {isCancellable(order.status) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              disabled={cancelOrder.isPending}
                              onClick={() => handleCancel(order)}
                            >
                              Cancel
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => navigate(`/orders/${order.id}`)}>
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No orders yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <Pagination className="mt-6">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => page > 1 && setPage(page - 1)}
                        className={page <= 1 ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <PaginationItem key={p}>
                        <PaginationLink isActive={p === page} onClick={() => setPage(p)}>
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => page < totalPages && setPage(page + 1)}
                        className={page >= totalPages ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
