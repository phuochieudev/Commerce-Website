import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@store/auth.store';
import { useCart, useClearCart } from '@hooks/useCart';
import { useAddresses } from '@hooks/useAddresses';
import { useCreateOrder } from '@hooks/useOrders';
import { couponService } from '@services/coupon.service';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Separator } from '@components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select';
import { CheckCircle2, ImageOff, Loader2, MapPin, X } from 'lucide-react';
import { formatPrice } from '@utils/format';
import { toast } from 'sonner';
import type { CreateOrderInput, ShippingMethod, PaymentMethod } from '../types/order';
import type { UserAddress } from '../types/address';
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

function getErrorMessage(err: any, fallback: string) {
  return err?.response?.data?.message || fallback;
}

const newAddressSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().min(8, 'A valid phone number is required'),
  email: z.union([z.string().email('Invalid email address'), z.literal('')]).optional(),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
});

type NewAddressFormData = z.infer<typeof newAddressSchema>;

export default function CheckoutPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const passedCouponCode = (location.state as { couponCode?: string } | null)?.couponCode;

  const { data: cartItems, isLoading: isCartLoading } = useCart();
  const { data: addresses, isLoading: isAddressesLoading } = useAddresses(!!user);
  const createOrder = useCreateOrder();
  const clearCart = useClearCart();

  const [selectedAddressId, setSelectedAddressId] = useState<string>('new');
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>('free');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [couponCode, setCouponCode] = useState(passedCouponCode ?? '');
  const [appliedCoupon, setAppliedCoupon] = useState<ValidateCouponResult | null>(null);
  const [couponError, setCouponError] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [warnedInvalidItems, setWarnedInvalidItems] = useState(false);

  const {
    register,
    handleSubmit: handleNewAddressSubmit,
    formState: { errors: addressErrors },
  } = useForm<NewAddressFormData>({
    resolver: zodResolver(newAddressSchema),
    defaultValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      phone: user?.phone ?? '',
      email: user?.email ?? '',
      address: '',
      city: '',
    },
  });

  const items = cartItems ?? [];
  const validItems = useMemo(() => items.filter((item) => !!item.product), [items]);
  const invalidItemCount = items.length - validItems.length;

  const subtotal = useMemo(
    () =>
      validItems.reduce((sum, item) => {
        const price = item.product!.salePrice ?? item.product!.price;
        return sum + price * item.quantity;
      }, 0),
    [validItems]
  );

  useEffect(() => {
    if (invalidItemCount > 0 && !warnedInvalidItems) {
      toast.warning(`${invalidItemCount} item(s) in your cart are no longer available and were excluded.`);
      setWarnedInvalidItems(true);
    }
  }, [invalidItemCount, warnedInvalidItems]);

  useEffect(() => {
    if (!isAddressesLoading && addresses && addresses.length > 0 && selectedAddressId === 'new') {
      const defaultAddress = addresses.find((a) => a.isDefault) ?? addresses[0];
      setSelectedAddressId(defaultAddress.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAddressesLoading, addresses]);

  const revalidateCoupon = async (code: string) => {
    if (!code.trim() || subtotal <= 0) return;
    setIsApplyingCoupon(true);
    setCouponError('');
    try {
      const result = await couponService.validate(code.trim(), subtotal);
      setAppliedCoupon(result);
    } catch (err: any) {
      setAppliedCoupon(null);
      setCouponError(getErrorMessage(err, 'Invalid or expired coupon code'));
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  useEffect(() => {
    if (passedCouponCode && subtotal > 0) {
      revalidateCoupon(passedCouponCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subtotal > 0]);

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  const discountAmount = appliedCoupon?.discountAmount ?? 0;
  const total = Math.max(subtotal - discountAmount, 0);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="mx-auto max-w-md">
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <p className="text-lg font-semibold">Please log in to check out</p>
            <Button onClick={() => navigate('/login')}>Log In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const buildRecipientFromAddress = (addr: UserAddress) => {
    const parts = addr.recipientName.trim().split(/\s+/);
    const firstName = parts[0] || addr.recipientName;
    const lastName = parts.slice(1).join(' ') || addr.recipientName;
    return {
      recipientFirstName: firstName,
      recipientLastName: lastName,
      recipientPhone: addr.phone,
      recipientEmail: undefined,
      shippingAddress: addr.address,
      shippingCity: addr.city,
    };
  };

  const submitOrder = async (recipient: {
    recipientFirstName: string;
    recipientLastName: string;
    recipientPhone: string;
    recipientEmail?: string;
    shippingAddress: string;
    shippingCity: string;
  }) => {
    if (validItems.length === 0) {
      toast.error('There are no valid items in your cart to check out');
      return;
    }

    const payload: CreateOrderInput = {
      ...recipient,
      shippingMethod,
      paymentMethod,
      couponCode: appliedCoupon?.coupon.code,
      items: validItems.map((item) => ({
        productId: item.productId,
        attribute: item.attribute,
        quantity: item.quantity,
      })),
    };

    setIsSubmitting(true);
    try {
      const orderId = await createOrder.mutateAsync(payload);
      try {
        await clearCart.mutateAsync(items);
      } catch {
        // non-fatal: order succeeded even if clearing the cart fails
      }
      toast.success(`Order placed successfully! Total: ${formatPrice(total)}`);
      navigate(`/orders/${orderId}`);
    } catch (err: any) {
      toast.error(getErrorMessage(err, 'Failed to place order. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const onPlaceOrder = handleNewAddressSubmit(
    async (data) => {
      if (selectedAddressId !== 'new') {
        const addr = addresses?.find((a) => a.id === selectedAddressId);
        if (!addr) {
          toast.error('Please select a shipping address');
          return;
        }
        await submitOrder(buildRecipientFromAddress(addr));
        return;
      }

      await submitOrder({
        recipientFirstName: data.firstName,
        recipientLastName: data.lastName,
        recipientPhone: data.phone,
        recipientEmail: data.email || undefined,
        shippingAddress: data.address,
        shippingCity: data.city,
      });
    },
    () => {
      if (selectedAddressId !== 'new') return;
      toast.error('Please fill in the required shipping information');
    }
  );

  const handlePlaceOrderClick = () => {
    if (selectedAddressId !== 'new') {
      const addr = addresses?.find((a) => a.id === selectedAddressId);
      if (!addr) {
        toast.error('Please select a shipping address');
        return;
      }
      submitOrder(buildRecipientFromAddress(addr));
      return;
    }
    onPlaceOrder();
  };

  const isLoading = isCartLoading || isAddressesLoading;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Checkout</h1>

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : validItems.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <p className="text-lg font-semibold">Your cart is empty</p>
            <Button onClick={() => navigate('/products')}>Browse Products</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {addresses?.map((addr) => (
                  <button
                    type="button"
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`flex w-full items-start gap-3 rounded-md border p-4 text-left transition-colors ${
                      selectedAddressId === addr.id ? 'border-primary bg-primary/5' : 'border-input'
                    }`}
                  >
                    <div
                      className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                        selectedAddressId === addr.id ? 'border-primary' : 'border-muted-foreground'
                      }`}
                    >
                      {selectedAddressId === addr.id && <div className="h-2 w-2 rounded-full bg-primary" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{addr.title}</span>
                        {addr.isDefault && <span className="text-xs text-primary">(Default)</span>}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {addr.recipientName} · {addr.phone}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {addr.address}, {addr.city}
                      </p>
                    </div>
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setSelectedAddressId('new')}
                  className={`flex w-full items-center gap-3 rounded-md border p-4 text-left transition-colors ${
                    selectedAddressId === 'new' ? 'border-primary bg-primary/5' : 'border-input'
                  }`}
                >
                  <div
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                      selectedAddressId === 'new' ? 'border-primary' : 'border-muted-foreground'
                    }`}
                  >
                    {selectedAddressId === 'new' && <div className="h-2 w-2 rounded-full bg-primary" />}
                  </div>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Use a new address</span>
                </button>

                {selectedAddressId === 'new' && (
                  <div className="grid gap-4 pt-2 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" {...register('firstName')} />
                      {addressErrors.firstName && (
                        <p className="text-xs text-destructive">{addressErrors.firstName.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" {...register('lastName')} />
                      {addressErrors.lastName && (
                        <p className="text-xs text-destructive">{addressErrors.lastName.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" {...register('phone')} />
                      {addressErrors.phone && <p className="text-xs text-destructive">{addressErrors.phone.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email (Optional)</Label>
                      <Input id="email" type="email" {...register('email')} />
                      {addressErrors.email && <p className="text-xs text-destructive">{addressErrors.email.message}</p>}
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" {...register('address')} />
                      {addressErrors.address && (
                        <p className="text-xs text-destructive">{addressErrors.address.message}</p>
                      )}
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" {...register('city')} />
                      {addressErrors.city && <p className="text-xs text-destructive">{addressErrors.city.message}</p>}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Shipping & Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Shipping & Payment</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Shipping Method</Label>
                  <Select value={shippingMethod} onValueChange={(v) => setShippingMethod(v as ShippingMethod)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free Shipping</SelectItem>
                      <SelectItem value="standard">Standard Shipping</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cod">Cash on Delivery</SelectItem>
                      <SelectItem value="zalo">ZaloPay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Items Review */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items ({validItems.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {validItems.map((item) => {
                  const product = item.product!;
                  const price = product.salePrice ?? product.price;
                  const image = product.images?.[0];
                  return (
                    <div key={item.id} className="flex items-center gap-3">
                      {image ? (
                        <img src={image} alt={product.name} className="h-16 w-16 rounded-md object-cover" />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-md bg-muted">
                          <ImageOff className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="truncate font-medium">{product.name}</p>
                        {item.attribute && (
                          <p className="text-xs text-muted-foreground">{formatAttribute(item.attribute)}</p>
                        )}
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">{formatPrice(price * item.quantity)}</p>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Coupon Code</Label>
                  {appliedCoupon ? (
                    <div className="mt-2 flex items-center justify-between rounded-md border border-primary/40 bg-primary/5 px-3 py-2">
                      <span className="flex items-center gap-1 text-sm font-medium">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        {appliedCoupon.coupon.code}
                      </span>
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
                      <Button
                        variant="outline"
                        onClick={() => revalidateCoupon(couponCode)}
                        disabled={isApplyingCoupon || !couponCode.trim()}
                      >
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
                  <span>{shippingMethod === 'free' ? 'Free' : 'Standard'}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <Button className="w-full" size="lg" disabled={isSubmitting} onClick={handlePlaceOrderClick}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
