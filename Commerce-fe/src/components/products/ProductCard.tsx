import { useState, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Card, CardContent } from '@components/ui/card';
import { Badge } from '@components/ui/badge';
import { ImageOff, Heart, Star } from 'lucide-react';
import { formatPrice } from '@utils/format';
import { useAuthStore } from '@store/auth.store';
import { useLikeStatus, useToggleLike } from '@hooks/useWishlist';
import type { Product } from '../../types/product';

interface ProductCardProps {
  product: Product;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i < Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'
          }`}
        />
      ))}
    </div>
  );
}

export default function ProductCard({ product }: ProductCardProps) {
  const { user } = useAuthStore();
  const [imageError, setImageError] = useState(false);
  const image = product.images?.[0];

  const { data: likeStatus } = useLikeStatus(product.id, !!user);
  const toggleLike = useToggleLike();

  const hasSale = product.salePrice != null && product.salePrice < product.price;
  const discountPercent = hasSale
    ? Math.round((1 - (product.salePrice as number) / product.price) * 100)
    : 0;

  const handleToggleLike = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.info('Please log in to save items to your wishlist');
      return;
    }
    toggleLike.mutate({ productId: product.id, liked: likeStatus?.liked ?? false });
  };

  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
      <Link to={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          {image && !imageError ? (
            <img
              src={image}
              alt={product.name}
              onError={() => setImageError(true)}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <ImageOff className="h-10 w-10 text-muted-foreground" />
            </div>
          )}

          {hasSale && (
            <Badge variant="destructive" className="absolute left-2 top-2">
              -{discountPercent}%
            </Badge>
          )}

          <button
            type="button"
            onClick={handleToggleLike}
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-background/90 shadow transition-colors hover:bg-background"
            aria-label="Toggle wishlist"
          >
            <Heart
              className={`h-4 w-4 ${likeStatus?.liked ? 'fill-destructive text-destructive' : 'text-foreground'}`}
            />
          </button>
        </div>
      </Link>

      <CardContent className="p-4">
        <Link to={`/products/${product.id}`}>
          <h3 className="line-clamp-2 text-sm font-medium leading-snug hover:text-primary sm:text-base">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2">
          <StarRating rating={product.rating} />
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          {hasSale ? (
            <>
              <span className="text-lg font-bold text-primary">
                {formatPrice(product.salePrice as number)}
              </span>
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.price)}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold">{formatPrice(product.price)}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
