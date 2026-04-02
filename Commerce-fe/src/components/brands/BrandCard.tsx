import { Card, CardContent } from '@components/ui/card';
import type { Brand } from '../../types/brand';

interface BrandCardProps {
  brand: Brand;
}

export default function BrandCard({ brand }: BrandCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        {brand.image && (
          <img
            src={brand.image}
            alt={brand.name}
            className="mb-4 h-24 w-full object-cover rounded"
          />
        )}
        <h3 className="font-semibold text-lg">{brand.name}</h3>
        {brand.tagLine && <p className="text-sm text-muted-foreground mt-1">{brand.tagLine}</p>}
        {brand.description && (
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{brand.description}</p>
        )}
      </CardContent>
    </Card>
  );
}
