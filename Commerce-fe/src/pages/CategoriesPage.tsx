import { useCategories } from '@hooks/useCategories';
import CategoryCard from '@components/categories/CategoryCard';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@components/ui/card';

export default function CategoriesPage() {
  const { data, isLoading } = useCategories();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold">Categories</h1>
        <p className="text-muted-foreground mt-2">
          Browse our product categories
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : data && data.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {data.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">No categories found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
