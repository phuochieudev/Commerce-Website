import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@store/auth.store';
import { useCart, useRemoveFromCart, useUpdateCartItem } from '@hooks/useCart';
import { couponService } from '@services/coupon.service';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Separator } from '@components/ui/separator';
import { ImageOff, Loader2, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { formatPrice } from '@utils/format';
import { toast } from 'sonner';
import type { ValidateCouponResult } from '../types/coupon';

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
      <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-md bg-muted">
        <ImageOff className="h-6 w-6 text-muted-foreground" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setError(true)}
      className="h-24 w-24 shrink-0 rounded-md object-cover"
    />
  );
}

export default function CartPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { data: cartItems, isLoading } = useCart();
  const updateCartItem = useUpdateCartItem();
  const removeFromCart = useRemoveFromCart();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<ValidateCouponResult | null>(null);
  const [couponError, setCouponError] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="mx-auto max-w-md">
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            <div>
              <p className="text-lg font-semibold">Please log in to view your cart</p>
              <p className="text-sm text-muted-foreground">You need an account to add items and check out.</p>
            </div>
            <Button onClick={() => navigate('/login')}>Log In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const items = cartItems ?? [];
  const validItems = items.filter((item) => !!item.product);

  const subtotal = validItems.reduce((sum, item) => {
    const price = item.product!.salePrice ?? item.product!.price;
    return sum + price * item.quantity;
  }, 0);

  const discountAmount = appliedCoupon?.discountAmount ?? 0;
  const total = Math.max(subtotal - discountAmount, 0);

  const handleQuantityChange = (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    updateCartItem.mutate({ itemId, quantity });
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsApplyingCoupon(true);
    setCouponError('');
    try {
      const result = await couponService.validate(couponCode.trim(), subtotal);
      setAppliedCoupon(result);
      toast.success(`Coupon applied: -${formatPrice(result.discountAmount)}`);
    } catch (err: any) {
      setAppliedCoupon(null);
      setCouponError(err?.response?.data?.message || 'Invalid or expired coupon code');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  const handleCheckout = () => {
    navigate('/checkout', {
      state: appliedCoupon ? { couponCode: appliedCoupon.coupon.code } : undefined,
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-12">Shopping Cart</h1>

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            <p className="text-lg font-semibold">Your cart is empty</p>
            <Link to="/products">
              <Button>Continue Shopping</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const product = item.product;
              const price = product ? product.salePrice ?? product.price : 0;
              const lineTotal = price * item.quantity;

              return (
                <Card key={item.id}>
                  <CardContent className="flex items-start gap-4 pt-6">
                    <ItemThumbnail src={product?.images?.[0]} alt={product?.name ?? 'Product'} />

                    <div className="flex-1 min-w-0">
                      {product ? (
                        <h3 className="font-semibold truncate">{product.name}</h3>
                      ) : (
                        <h3 className="font-semibold text-muted-foreground">Product no longer available</h3>
                      )}
                      {item.attribute && (
                        <p className="mt-1 text-sm text-muted-foreground">{formatAttribute(item.attribute)}</p>
                      )}

                      <div className="mt-3 flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          disabled={!product || item.quantity <= 1 || updateCartItem.isPending}
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          disabled={!product || updateCartItem.isPending}
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="font-bold">{formatPrice(lineTotal)}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 text-destructive hover:text-destructive"
                        disabled={removeFromCart.isPending}
                        onClick={() => removeFromCart.mutate(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Coupon Code</label>
                  {appliedCoupon ? (
                    <div className="mt-2 flex items-center justify-between rounded-md border border-primary/40 bg-primary/5 px-3 py-2">
                      <span className="text-sm font-medium">{appliedCoupon.coupon.code}</span>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="text-muted-foreground hover:text-destructive"
                        aria-label="Remove coupon"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="mt-2 flex gap-2">
                      <Input
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter coupon code"
                        disabled={isApplyingCoupon}
                      />
                      <Button variant="outline" onClick={handleApplyCoupon} disabled={isApplyingCoupon || !couponCode.trim()}>
                        {isApplyingCoupon ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Apply'}
                      </Button>
                    </div>
                  )}
                  {couponError && <p className="mt-1 text-xs text-destructive">{couponError}</p>}
                </div>

                <Separator />

                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-primary">
                    <span>Discount</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span className="text-muted-foreground">Calculated at checkout</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <Button className="w-full" size="lg" disabled={validItems.length === 0} onClick={handleCheckout}>
                  Proceed to Checkout
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
