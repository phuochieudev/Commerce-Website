import { Card, CardContent, CardDescription, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { ShoppingCart, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatPrice } from '@utils/format';
import type { Product } from '../../types/product';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/products/${product.id}`}>
        <div className="relative overflow-hidden bg-muted">
          <img
            src={product.image || 'https://via.placeholder.com/300x300?text=No+Image'}
            alt={product.name}
            className="h-48 w-full object-cover hover:scale-105 transition-transform"
          />
          {product.discount && (
            <div className="absolute right-2 top-2 bg-destructive px-2 py-1 text-xs font-semibold text-white rounded">
              -{product.discount}%
            </div>
          )}
        </div>
      </Link>

      <CardContent className="p-4">
        <Link to={`/products/${product.id}`}>
          <CardTitle className="line-clamp-2 text-lg hover:text-primary transition-colors">
            {product.name}
          </CardTitle>
        </Link>
        <CardDescription className="mt-2 line-clamp-2">
          {product.description}
        </CardDescription>

        <div className="mt-4 flex items-baseline justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold">{formatPrice(product.price)}</span>
            {product.cost && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.cost)}
              </span>
            )}
          </div>
          {product.rating && (
            <span className="text-xs font-semibold text-yellow-500">
              ⭐ {product.rating.toFixed(1)}
            </span>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          <Button className="flex-1" size="sm">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add
          </Button>
          <Button variant="outline" size="sm" className="px-3">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
