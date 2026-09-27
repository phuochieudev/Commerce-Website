import { useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '@hooks/useCategories';
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
import { FolderTree, ImageOff, Loader2, Plus, Edit, Trash2 } from 'lucide-react';
import { CategorySchema, CategoryFormData } from '@utils/validations';
import { Category } from '@/types/category';

const NONE_PARENT = '__none__';

interface FlatCategory {
  id: string;
  name: string;
  depth: number;
  category: Category;
}

function flattenCategories(categories: Category[], depth = 0): FlatCategory[] {
  return categories.flatMap((cat) => [
    { id: cat.id, name: cat.name, depth, category: cat },
    ...(cat.children && cat.children.length > 0 ? flattenCategories(cat.children, depth + 1) : []),
  ]);
}

function collectDescendantIds(category: Category): string[] {
  const children = category.children ?? [];
  return children.flatMap((child) => [child.id, ...collectDescendantIds(child)]);
}

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
  parentOptions: FlatCategory[];
  onSubmit: (data: CategoryFormData) => void;
  isSubmitting: boolean;
}

function CategoryFormDialog({
  open,
  onOpenChange,
  category,
  parentOptions,
  onSubmit,
  isSubmitting,
}: CategoryFormDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(CategorySchema),
    defaultValues: { name: '', image: '', description: '', parentId: NONE_PARENT },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: category?.name ?? '',
        image: category?.image ?? '',
        description: category?.description ?? '',
        parentId: category?.parentId ?? NONE_PARENT,
      });
    }
  }, [open, category, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{category ? 'Edit Category' : 'Add Category'}</DialogTitle>
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
            <Label htmlFor="parentId">Parent Category</Label>
            <Controller
              control={control}
              name="parentId"
              render={({ field }) => (
                <Select value={field.value ?? NONE_PARENT} onValueChange={field.onChange}>
                  <SelectTrigger id="parentId">
                    <SelectValue placeholder="None (top-level)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NONE_PARENT}>None (top-level)</SelectItem>
                    {parentOptions.map((opt) => (
                      <SelectItem key={opt.id} value={opt.id}>
                        {'  '.repeat(opt.depth)}
                        {opt.depth > 0 ? '↳ ' : ''}
                        {opt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
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
              {category ? 'Save Changes' : 'Create Category'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminCategoriesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  const { data, isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const flatCategories = useMemo(() => flattenCategories(data ?? []), [data]);
  const isSubmitting = createCategory.isPending || updateCategory.isPending;

  const parentOptions = useMemo(() => {
    if (!editingCategory) return flatCategories;
    const excluded = new Set([editingCategory.id, ...collectDescendantIds(editingCategory)]);
    return flatCategories.filter((c) => !excluded.has(c.id));
  }, [flatCategories, editingCategory]);

  const openCreateDialog = () => {
    setEditingCategory(null);
    setDialogOpen(true);
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setDialogOpen(true);
  };

  const handleSubmit = (formData: CategoryFormData) => {
    const payload = {
      name: formData.name,
      image: formData.image || undefined,
      description: formData.description || undefined,
      parentId: formData.parentId && formData.parentId !== NONE_PARENT ? formData.parentId : null,
    };

    if (editingCategory) {
      updateCategory.mutate({ id: editingCategory.id, data: payload }, { onSuccess: () => setDialogOpen(false) });
    } else {
      createCategory.mutate(payload, { onSuccess: () => setDialogOpen(false) });
    }
  };

  const confirmDelete = () => {
    if (!deletingCategory) return;
    deleteCategory.mutate(deletingCategory.id, {
      onSuccess: () => setDeletingCategory(null),
      onError: () => toast.error('Failed to delete category'),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Categories Management</h1>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Categories Tree</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : flatCategories.length > 0 ? (
            <div className="divide-y">
              {flatCategories.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 py-3"
                  style={{ paddingLeft: `${item.depth * 24}px` }}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    {item.category.image ? (
                      <img
                        src={item.category.image}
                        alt={item.name}
                        className="h-9 w-9 shrink-0 rounded-md object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted ${item.category.image ? 'hidden' : ''}`}
                    >
                      {item.depth > 0 ? (
                        <FolderTree className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ImageOff className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium truncate">
                        {item.depth > 0 && <span className="text-muted-foreground">↳ </span>}
                        {item.name}
                      </p>
                      {item.category.description && (
                        <p className="text-xs text-muted-foreground truncate">{item.category.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Badge variant={item.category.status === 'active' ? 'success' : 'secondary'}>
                      {item.category.status}
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={() => openEditDialog(item.category)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() => setDeletingCategory(item.category)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No categories found</p>
          )}
        </CardContent>
      </Card>

      <CategoryFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={editingCategory}
        parentOptions={parentOptions}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />

      <Dialog open={!!deletingCategory} onOpenChange={(open) => !open && setDeletingCategory(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete{' '}
            <span className="font-medium text-foreground">{deletingCategory?.name}</span>? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingCategory(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleteCategory.isPending}>
              {deleteCategory.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
