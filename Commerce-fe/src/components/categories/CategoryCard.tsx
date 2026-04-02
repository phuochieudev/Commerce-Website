import { Card, CardContent } from '@components/ui/card';
import type { Category } from '../../types/category';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg hover:scale-105 transition-all cursor-pointer">
      <CardContent className="p-6">
        {category.image && (
          <img
            src={category.image}
            alt={category.name}
            className="mb-4 h-32 w-full object-cover rounded"
          />
        )}
        <h3 className="font-semibold text-lg text-center">{category.name}</h3>
        {category.description && (
          <p className="text-xs text-muted-foreground text-center mt-2 line-clamp-2">
            {category.description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
