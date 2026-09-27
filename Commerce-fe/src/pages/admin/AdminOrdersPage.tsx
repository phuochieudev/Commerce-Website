import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useOrders, useUpdateOrderStatus } from '@hooks/useOrders';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Badge } from '@components/ui/badge';
import { Skeleton } from '@components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@components/ui/table';
import { Loader2, Settings } from 'lucide-react';
import { formatPrice, formatDate } from '@utils/format';
import { Order, OrderStatus, PaymentStatus } from '@/types/order';

const LIMIT = 10;

const STATUS_OPTIONS: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipping', 'delivered', 'cancelled'];
const PAYMENT_STATUS_OPTIONS: PaymentStatus[] = ['pending', 'paid', 'failed'];

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipping: 'Shipping',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const PAYMENT_LABELS: Record<PaymentStatus, string> = {
  pending: 'Pending',
  paid: 'Paid',
  failed: 'Failed',
};

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'success' | 'warning';

function statusBadgeVariant(status: OrderStatus): BadgeVariant {
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

function paymentBadgeVariant(status: PaymentStatus): BadgeVariant {
  switch (status) {
    case 'paid':
      return 'success';
    case 'failed':
      return 'destructive';
    default:
      return 'warning';
  }
}

interface OrderDetailsFormData {
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  trackingNumber: string;
}

interface OrderDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
  onSubmit: (data: OrderDetailsFormData) => void;
  isSubmitting: boolean;
}

function OrderDetailsDialog({ open, onOpenChange, order, onSubmit, isSubmitting }: OrderDetailsDialogProps) {
  const { register, handleSubmit, control, reset } = useForm<OrderDetailsFormData>({
    defaultValues: { status: 'pending', paymentStatus: 'pending', trackingNumber: '' },
  });

  useEffect(() => {
    if (open && order) {
      reset({
        status: order.status,
        paymentStatus: order.paymentStatus,
        trackingNumber: order.trackingNumber ?? '',
      });
    }
  }, [open, order, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Order</DialogTitle>
        </DialogHeader>

        {order && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Customer: <span className="font-medium text-foreground">{order.recipientFirstName} {order.recipientLastName}</span>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Order Status</Label>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((s) => (
                        <SelectItem key={s} value={s}>
                          {STATUS_LABELS[s]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentStatus">Payment Status</Label>
              <Controller
                control={control}
                name="paymentStatus"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="paymentStatus">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PAYMENT_STATUS_OPTIONS.map((s) => (
                        <SelectItem key={s} value={s}>
                          {PAYMENT_LABELS[s]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="trackingNumber">Tracking Number</Label>
              <Input id="trackingNumber" {...register('trackingNumber')} />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function AdminOrdersPage() {
  const [page, setPage] = useState(1);
  const [managingOrder, setManagingOrder] = useState<Order | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data, isLoading } = useOrders(page, LIMIT);
  const updateStatus = useUpdateOrderStatus();

  const totalPages = data ? Math.ceil(data.paging.total / LIMIT) : 0;

  const openManageDialog = (order: Order) => {
    setManagingOrder(order);
    setDialogOpen(true);
  };

  const handleQuickStatusChange = (order: Order, status: OrderStatus) => {
    updateStatus.mutate({ id: order.id, status, paymentStatus: order.paymentStatus, trackingNumber: order.trackingNumber ?? undefined });
  };

  const handleDetailsSubmit = (formData: OrderDetailsFormData) => {
    if (!managingOrder) return;
    updateStatus.mutate(
      {
        id: managingOrder.id,
        status: formData.status,
        paymentStatus: formData.paymentStatus,
        trackingNumber: formData.trackingNumber || undefined,
      },
      { onSuccess: () => setDialogOpen(false) }
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Orders Management</h1>

      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data && data.data.length > 0 ? (
                    data.data.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-xs">#{order.id.slice(0, 8)}</TableCell>
                        <TableCell className="font-medium">
                          {order.recipientFirstName} {order.recipientLastName}
                        </TableCell>
                        <TableCell>{formatPrice(order.totalAmount)}</TableCell>
                        <TableCell>
                          <Badge variant={paymentBadgeVariant(order.paymentStatus)}>
                            {PAYMENT_LABELS[order.paymentStatus]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={order.status}
                            onValueChange={(value) => handleQuickStatusChange(order, value as OrderStatus)}
                          >
                            <SelectTrigger className="h-8 w-[140px]">
                              <SelectValue>
                                <Badge variant={statusBadgeVariant(order.status)}>{STATUS_LABELS[order.status]}</Badge>
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {STATUS_OPTIONS.map((s) => (
                                <SelectItem key={s} value={s}>
                                  {STATUS_LABELS[s]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{formatDate(order.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => openManageDialog(order)}>
                            <Settings className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        No orders found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <OrderDetailsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        order={managingOrder}
        onSubmit={handleDetailsSubmit}
        isSubmitting={updateStatus.isPending}
      />
    </div>
  );
}
