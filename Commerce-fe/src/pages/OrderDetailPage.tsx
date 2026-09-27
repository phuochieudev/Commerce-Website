import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useCancelOrder, useOrder } from '@hooks/useOrders';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Badge } from '@components/ui/badge';
import { Separator } from '@components/ui/separator';
import { ArrowLeft, ImageOff, Loader2 } from 'lucide-react';
import { formatPrice, formatDate } from '@utils/format';
import type { OrderStatus } from '../types/order';

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

function statusLabel(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function isCancellable(status: OrderStatus) {
  return status === 'pending' || status === 'confirmed';
}

function formatAttribute(attribute: string) {
  if (!attribute) return '';
  return attribute
    .split(',')
    .map((pair) => {
      const [key, value] = pair.split(':');
      if (!value) return pair.trim();
      const normalized = key.trim().toLowerCase();
      const label = normalized === 'color' ? 'Color' : normalized === 'size' ? 'Size' : key.trim();
      return `${label}: ${value.trim()}`;
    })
    .join(', ');
}

function ItemThumbnail({ src, alt }: { src?: string | null; alt: string }) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md bg-muted">
        <ImageOff className="h-5 w-5 text-muted-foreground" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setError(true)}
      className="h-16 w-16 shrink-0 rounded-md object-cover"
    />
  );
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: order, isLoading } = useOrder(id ?? '');
  const cancelOrder = useCancelOrder();

  const handleCancel = async () => {
    if (!order) return;
    if (!window.confirm(`Cancel order #${order.id.substring(0, 8)}?`)) return;
    await cancelOrder.mutateAsync(order.id);
    queryClient.invalidateQueries({ queryKey: ['order', order.id] });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto flex items-center justify-center px-4 py-24">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <p className="text-lg font-semibold">Order not found</p>
            <Button onClick={() => navigate('/orders')}>Back to Orders</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const itemsSubtotal = (order.items ?? []).reduce((sum, item) => sum + item.price * item.quantity, 0);

  const shippingMethodLabel = order.shippingMethod === 'free' ? 'Free Shipping' : 'Standard Shipping';
  const paymentMethodLabel = order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'ZaloPay';

  return (
    <div className="container mx-auto px-4 py-12">
      <Button variant="ghost" size="sm" className="mb-4" onClick={() => navigate('/orders')}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Orders
      </Button>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Order #{order.id.substring(0, 8)}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={getStatusVariant(order.status)} className="text-sm">
            {statusLabel(order.status)}
          </Badge>
          {isCancellable(order.status) && (
            <Button
              variant="outline"
              className="text-destructive hover:text-destructive"
              disabled={cancelOrder.isPending}
              onClick={handleCancel}
            >
              {cancelOrder.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Cancel Order'}
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(order.items ?? []).map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <ItemThumbnail src={item.image} alt={item.name ?? 'Product'} />
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium">{item.name ?? 'Product'}</p>
                    {item.attribute && (
                      <p className="text-xs text-muted-foreground">{formatAttribute(item.attribute)}</p>
                    )}
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Recipient:</span> {order.recipientFirstName} {order.recipientLastName}
              </p>
              <p>
                <span className="font-medium">Phone:</span> {order.recipientPhone}
              </p>
              {order.recipientEmail && (
                <p>
                  <span className="font-medium">Email:</span> {order.recipientEmail}
                </p>
              )}
              <p>
                <span className="font-medium">Address:</span> {order.shippingAddress}, {order.shippingCity}
              </p>
              <p>
                <span className="font-medium">Shipping Method:</span> {shippingMethodLabel}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Method:</span> {paymentMethodLabel}
              </p>
              <p>
                <span className="font-medium">Status:</span>{' '}
                <span className="capitalize">{order.paymentStatus}</span>
              </p>
              {order.trackingNumber && (
                <p>
                  <span className="font-medium">Tracking Number:</span> {order.trackingNumber}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatPrice(itemsSubtotal)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-sm text-primary">
                  <span>Discount</span>
                  <span>-{formatPrice(order.discountAmount)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{formatPrice(order.totalAmount)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
