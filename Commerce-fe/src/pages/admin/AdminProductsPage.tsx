import { useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from '@hooks/useProducts';
import { useBrands } from '@hooks/useBrands';
import { useCategories } from '@hooks/useCategories';
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@components/ui/pagination';
import { ImageOff, Loader2, Plus, Edit, Trash2, Search } from 'lucide-react';
import { formatPrice } from '@utils/format';
import { ProductSchema, ProductFormData } from '@utils/validations';
import { Product } from '@/types/product';
import { Category } from '@/types/category';

const LIMIT = 10;

function flattenCategories(categories: Category[], depth = 0): { id: string; name: string; depth: number }[] {
  return categories.flatMap((cat) => [
    { id: cat.id, name: cat.name, depth },
    ...(cat.children && cat.children.length > 0 ? flattenCategories(cat.children, depth + 1) : []),
  ]);
}

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  brands: { id: string; name: string }[];
  categories: { id: string; name: string; depth: number }[];
  onSubmit: (data: ProductFormData) => void;
  isSubmitting: boolean;
}

function ProductFormDialog({
  open,
  onOpenChange,
  product,
  brands,
  categories,
  onSubmit,
  isSubmitting,
}: ProductFormDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name: '',
      gender: 'unisex',
      price: 0,
      salePrice: undefined,
      colors: '',
      quantity: 0,
      brandId: '',
      categoryId: '',
      content: '',
      description: '',
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: product?.name ?? '',
        gender: product?.gender ?? 'unisex',
        price: product?.price ?? 0,
        salePrice: product?.salePrice ?? undefined,
        colors: product?.colors ?? '',
        quantity: product?.quantity ?? 0,
        brandId: product?.brandId ?? '',
        categoryId: product?.categoryId ?? '',
        content: product?.content ?? '',
        description: product?.description ?? '',
      });
    }
  }, [open, product, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? 'Edit Product' : 'Add Product'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register('name')} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Controller
                control={control}
                name="gender"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="unisex">Unisex</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.gender && <p className="text-xs text-destructive">{errors.gender.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="colors">Colors</Label>
              <Input id="colors" placeholder="e.g. red, blue, black" {...register('colors')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input id="price" type="number" step="1000" {...register('price')} />
              {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="salePrice">Sale Price (optional)</Label>
              <Input id="salePrice" type="number" step="1000" {...register('salePrice')} />
              {errors.salePrice && <p className="text-xs text-destructive">{errors.salePrice.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input id="quantity" type="number" {...register('quantity')} />
              {errors.quantity && <p className="text-xs text-destructive">{errors.quantity.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="brandId">Brand</Label>
              <Controller
                control={control}
                name="brandId"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="brandId">
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.brandId && <p className="text-xs text-destructive">{errors.brandId.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoryId">Category</Label>
              <Controller
                control={control}
                name="categoryId"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="categoryId">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {'  '.repeat(cat.depth)}
                          {cat.depth > 0 ? '↳ ' : ''}
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.categoryId && <p className="text-xs text-destructive">{errors.categoryId.message}</p>}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" rows={2} {...register('description')} />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="content">Content</Label>
              <Textarea id="content" rows={4} {...register('content')} />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {product ? 'Save Changes' : 'Create Product'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminProductsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading } = useProducts(page, LIMIT, debouncedSearch ? { name: debouncedSearch } : {});
  const { data: brandsData } = useBrands(1, 100);
  const { data: categoriesData } = useCategories();

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const brands = useMemo(() => brandsData?.data ?? [], [brandsData]);
  const brandMap = useMemo(() => new Map(brands.map((b) => [b.id, b.name])), [brands]);

  const flatCategories = useMemo(() => flattenCategories(categoriesData ?? []), [categoriesData]);
  const categoryMap = useMemo(() => new Map(flatCategories.map((c) => [c.id, c.name])), [flatCategories]);

  const totalPages = data ? Math.ceil(data.paging.total / LIMIT) : 0;
  const isSubmitting = createProduct.isPending || updateProduct.isPending;

  const openCreateDialog = () => {
    setEditingProduct(null);
    setDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setDialogOpen(true);
  };

  const handleSubmit = (formData: ProductFormData) => {
    const payload = {
      name: formData.name,
      gender: formData.gender,
      price: formData.price,
      salePrice: formData.salePrice ?? null,
      colors: formData.colors || null,
      quantity: formData.quantity,
      brandId: formData.brandId,
      categoryId: formData.categoryId,
      content: formData.content || undefined,
      description: formData.description || undefined,
    };

    if (editingProduct) {
      updateProduct.mutate(
        { id: editingProduct.id, data: payload },
        { onSuccess: () => setDialogOpen(false) }
      );
    } else {
      createProduct.mutate(payload, { onSuccess: () => setDialogOpen(false) });
    }
  };

  const confirmDelete = () => {
    if (!deletingProduct) return;
    deleteProduct.mutate(deletingProduct.id, {
      onSuccess: () => setDeletingProduct(null),
      onError: () => toast.error('Failed to delete product'),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold">Products Management</h1>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Products List</CardTitle>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name..."
              className="pl-9"
            />
          </div>
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
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data && data.data.length > 0 ? (
                    data.data.map((product) => {
                      const image = product.images?.[0];
                      return (
                        <TableRow key={product.id}>
                          <TableCell>
                            {image ? (
                              <img
                                src={image}
                                alt={product.name}
                                className="h-10 w-10 rounded-md object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                  (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                }}
                              />
                            ) : null}
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-md bg-muted ${image ? 'hidden' : ''}`}
                            >
                              <ImageOff className="h-4 w-4 text-muted-foreground" />
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{brandMap.get(product.brandId) ?? '—'}</TableCell>
                          <TableCell>{categoryMap.get(product.categoryId) ?? '—'}</TableCell>
                          <TableCell>
                            {product.salePrice ? (
                              <div>
                                <span className="text-destructive font-medium">{formatPrice(product.salePrice)}</span>
                                <span className="ml-2 text-xs text-muted-foreground line-through">
                                  {formatPrice(product.price)}
                                </span>
                              </div>
                            ) : (
                              formatPrice(product.price)
                            )}
                          </TableCell>
                          <TableCell>{product.quantity}</TableCell>
                          <TableCell>
                            <Badge variant={product.status === 'active' ? 'success' : 'secondary'}>
                              {product.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => openEditDialog(product)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive"
                              onClick={() => setDeletingProduct(product)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                        No products found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => page > 1 && setPage(page - 1)}
                        className={page === 1 ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink isActive={page === i + 1} onClick={() => setPage(i + 1)}>
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => page < totalPages && setPage(page + 1)}
                        className={page === totalPages ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <ProductFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        product={editingProduct}
        brands={brands}
        categories={flatCategories}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />

      <Dialog open={!!deletingProduct} onOpenChange={(open) => !open && setDeletingProduct(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete <span className="font-medium text-foreground">{deletingProduct?.name}</span>?
            This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingProduct(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleteProduct.isPending}>
              {deleteProduct.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
