import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  useBrands,
  useCreateBrand,
  useUpdateBrand,
  useDeleteBrand,
} from '@hooks/useBrands';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Textarea } from '@components/ui/textarea';
import { Badge } from '@components/ui/badge';
import { Skeleton } from '@components/ui/skeleton';
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
import { Building2, Loader2, Plus, Edit, Trash2 } from 'lucide-react';
import { BrandSchema, BrandFormData } from '@utils/validations';
import { Brand } from '@/types/brand';

interface BrandFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brand: Brand | null;
  onSubmit: (data: BrandFormData) => void;
  isSubmitting: boolean;
}

function BrandFormDialog({ open, onOpenChange, brand, onSubmit, isSubmitting }: BrandFormDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BrandFormData>({
    resolver: zodResolver(BrandSchema),
    defaultValues: { name: '', image: '', description: '', tagLine: '' },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: brand?.name ?? '',
        image: brand?.image ?? '',
        description: brand?.description ?? '',
        tagLine: brand?.tagLine ?? '',
      });
    }
  }, [open, brand, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{brand ? 'Edit Brand' : 'Add Brand'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register('name')} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input id="image" placeholder="https://..." {...register('image')} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tagLine">Tag Line</Label>
            <Input id="tagLine" {...register('tagLine')} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={3} {...register('description')} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {brand ? 'Save Changes' : 'Create Brand'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminBrandsPage() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [deletingBrand, setDeletingBrand] = useState<Brand | null>(null);

  const { data, isLoading } = useBrands(page, limit);
  const createBrand = useCreateBrand();
  const updateBrand = useUpdateBrand();
  const deleteBrand = useDeleteBrand();

  const totalPages = data ? Math.ceil(data.paging.total / limit) : 0;
  const isSubmitting = createBrand.isPending || updateBrand.isPending;

  const openCreateDialog = () => {
    setEditingBrand(null);
    setDialogOpen(true);
  };

  const openEditDialog = (brand: Brand) => {
    setEditingBrand(brand);
    setDialogOpen(true);
  };

  const handleSubmit = (formData: BrandFormData) => {
    const payload = {
      name: formData.name,
      image: formData.image || undefined,
      description: formData.description || undefined,
      tagLine: formData.tagLine || undefined,
    };

    if (editingBrand) {
      updateBrand.mutate({ id: editingBrand.id, data: payload }, { onSuccess: () => setDialogOpen(false) });
    } else {
      createBrand.mutate(payload, { onSuccess: () => setDialogOpen(false) });
    }
  };

  const confirmDelete = () => {
    if (!deletingBrand) return;
    deleteBrand.mutate(deletingBrand.id, {
      onSuccess: () => setDeletingBrand(null),
      onError: () => toast.error('Failed to delete brand'),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Brands Management</h1>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add Brand
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Brands List</CardTitle>
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
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Tag Line</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data && data.data.length > 0 ? (
                    data.data.map((brand) => (
                      <TableRow key={brand.id}>
                        <TableCell>
                          {brand.image ? (
                            <img
                              src={brand.image}
                              alt={brand.name}
                              className="h-10 w-10 rounded-md object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                                (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                          ) : null}
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-md bg-muted ${brand.image ? 'hidden' : ''}`}
                          >
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{brand.name}</TableCell>
                        <TableCell>{brand.tagLine || '-'}</TableCell>
                        <TableCell className="max-w-xs truncate">{brand.description || '-'}</TableCell>
                        <TableCell>
                          <Badge variant={brand.status === 'active' ? 'success' : 'secondary'}>{brand.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => openEditDialog(brand)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                            onClick={() => setDeletingBrand(brand)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No brands found
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

      <BrandFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        brand={editingBrand}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />

      <Dialog open={!!deletingBrand} onOpenChange={(open) => !open && setDeletingBrand(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Brand</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete <span className="font-medium text-foreground">{deletingBrand?.name}</span>? This
            action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingBrand(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleteBrand.isPending}>
              {deleteBrand.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
