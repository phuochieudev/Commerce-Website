import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  useCoupons,
  useCreateCoupon,
  useUpdateCoupon,
  useDeleteCoupon,
} from '@hooks/useCoupons';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Textarea } from '@components/ui/textarea';
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
import { Loader2, Plus, Edit, Trash2 } from 'lucide-react';
import { formatDate, formatPrice } from '@utils/format';
import { CouponSchema, CouponFormData } from '@utils/validations';
import { Coupon } from '@/types/coupon';

interface CouponFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coupon: Coupon | null;
  onSubmit: (data: CouponFormData) => void;
  isSubmitting: boolean;
}

function toDateInputValue(value?: string) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
}

function CouponFormDialog({ open, onOpenChange, coupon, onSubmit, isSubmitting }: CouponFormDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CouponFormData>({
    resolver: zodResolver(CouponSchema),
    defaultValues: {
      code: '',
      description: '',
      type: 'percent',
      value: 0,
      minOrderValue: undefined,
      maxDiscount: undefined,
      usageLimit: undefined,
      startDate: '',
      endDate: '',
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        code: coupon?.code ?? '',
        description: coupon?.description ?? '',
        type: coupon?.type ?? 'percent',
        value: coupon?.value ?? 0,
        minOrderValue: coupon?.minOrderValue ?? undefined,
        maxDiscount: coupon?.maxDiscount ?? undefined,
        usageLimit: coupon?.usageLimit ?? undefined,
        startDate: toDateInputValue(coupon?.startDate),
        endDate: toDateInputValue(coupon?.endDate),
      });
    }
  }, [open, coupon, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{coupon ? 'Edit Coupon' : 'Add Coupon'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="code">Code</Label>
              <Input id="code" placeholder="e.g. SALE20" {...register('code')} />
              {errors.code && <p className="text-xs text-destructive">{errors.code.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percent">Percent (%)</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="value">Value</Label>
              <Input id="value" type="number" {...register('value')} />
              {errors.value && <p className="text-xs text-destructive">{errors.value.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="minOrderValue">Min Order Value</Label>
              <Input id="minOrderValue" type="number" {...register('minOrderValue')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxDiscount">Max Discount (optional)</Label>
              <Input id="maxDiscount" type="number" {...register('maxDiscount')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="usageLimit">Usage Limit (optional)</Label>
              <Input id="usageLimit" type="number" {...register('usageLimit')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input id="startDate" type="date" {...register('startDate')} />
              {errors.startDate && <p className="text-xs text-destructive">{errors.startDate.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input id="endDate" type="date" {...register('endDate')} />
              {errors.endDate && <p className="text-xs text-destructive">{errors.endDate.message}</p>}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" rows={2} {...register('description')} />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {coupon ? 'Save Changes' : 'Create Coupon'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminCouponsPage() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [deletingCoupon, setDeletingCoupon] = useState<Coupon | null>(null);

  const { data, isLoading } = useCoupons(page, limit);
  const createCoupon = useCreateCoupon();
  const updateCoupon = useUpdateCoupon();
  const deleteCoupon = useDeleteCoupon();

  const totalPages = data ? Math.ceil(data.paging.total / limit) : 0;
  const isSubmitting = createCoupon.isPending || updateCoupon.isPending;

  const openCreateDialog = () => {
    setEditingCoupon(null);
    setDialogOpen(true);
  };

  const openEditDialog = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setDialogOpen(true);
  };

  const handleSubmit = (formData: CouponFormData) => {
    const payload = {
      code: formData.code,
      description: formData.description || undefined,
      type: formData.type,
      value: formData.value,
      minOrderValue: formData.minOrderValue ?? 0,
      maxDiscount: formData.maxDiscount ?? null,
      usageLimit: formData.usageLimit ?? null,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
    };

    if (editingCoupon) {
      updateCoupon.mutate({ id: editingCoupon.id, data: payload }, { onSuccess: () => setDialogOpen(false) });
    } else {
      createCoupon.mutate(payload, { onSuccess: () => setDialogOpen(false) });
    }
  };

  const confirmDelete = () => {
    if (!deletingCoupon) return;
    deleteCoupon.mutate(deletingCoupon.id, {
      onSuccess: () => setDeletingCoupon(null),
      onError: () => toast.error('Failed to delete coupon'),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Coupons Management</h1>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add Coupon
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coupons List</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Start</TableHead>
                    <TableHead>End</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data && data.data.length > 0 ? (
                    data.data.map((coupon) => (
                      <TableRow key={coupon.id}>
                        <TableCell className="font-mono font-medium">{coupon.code}</TableCell>
                        <TableCell className="capitalize">{coupon.type}</TableCell>
                        <TableCell>{coupon.type === 'percent' ? `${coupon.value}%` : formatPrice(coupon.value)}</TableCell>
                        <TableCell>
                          {coupon.usageCount}
                          {coupon.usageLimit ? ` / ${coupon.usageLimit}` : ''}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{formatDate(coupon.startDate)}</TableCell>
                        <TableCell className="text-muted-foreground">{formatDate(coupon.endDate)}</TableCell>
                        <TableCell>
                          <Badge variant={coupon.status === 'active' ? 'success' : 'secondary'}>{coupon.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => openEditDialog(coupon)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                            onClick={() => setDeletingCoupon(coupon)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                        No coupons found
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

      <CouponFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        coupon={editingCoupon}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />

      <Dialog open={!!deletingCoupon} onOpenChange={(open) => !open && setDeletingCoupon(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Coupon</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete{' '}
            <span className="font-medium text-foreground">{deletingCoupon?.code}</span>? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingCoupon(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleteCoupon.isPending}>
              {deleteCoupon.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
