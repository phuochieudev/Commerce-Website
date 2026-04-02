import { useParams } from 'react-router-dom';
import { useProduct } from '@hooks/useProducts';
import { Card, CardContent } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Loader2, ShoppingCart, Heart, Share2 } from 'lucide-react';
import { formatPrice } from '@utils/format';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading, error } = useProduct(id || '');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="pt-6">
            <p className="text-destructive">Product not found or failed to load</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Product Image */}
        <div>
          <div className="overflow-hidden rounded-lg bg-muted">
            <img
              src={product.image || 'https://via.placeholder.com/500x500?text=Product'}
              alt={product.name}
              className="h-96 w-full object-cover"
            />
          </div>

          {/* Additional Images */}
          {product.images && product.images.length > 0 && (
            <div className="mt-4 grid grid-cols-5 gap-2">
              {product.images.slice(0, 5).map((img, i) => (
                <div key={i} className="overflow-hidden rounded bg-muted">
                  <img src={img} alt={`View ${i + 1}`} className="h-20 w-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div>
          <div className="space-y-4">
            <div>
              <h1 className="text-4xl font-bold">{product.name}</h1>
              {product.rating && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-lg font-semibold text-yellow-500">⭐ {product.rating.toFixed(1)}</span>
                  <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
                </div>
              )}
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold">{formatPrice(product.price)}</span>
                {product.cost && (
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(product.cost)}
                  </span>
                )}
                {product.discount && (
                  <span className="inline-block rounded bg-destructive px-2 py-1 text-xs font-semibold text-white">
                    Save {product.discount}%
                  </span>
                )}
              </div>
              {product.quantity > 0 ? (
                <p className="text-sm text-green-600 font-semibold">In Stock ({product.quantity} available)</p>
              ) : (
                <p className="text-sm text-destructive font-semibold">Out of Stock</p>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold">Description</h3>
              <p className="mt-2 text-muted-foreground">{product.description}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-6">
              <Button size="lg" className="flex-1" disabled={product.quantity === 0}>
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button variant="outline" size="lg">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Meta Info */}
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="grid gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">SKU</p>
                    <p className="font-mono text-sm">{product.sku}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="text-sm">{product.categoryId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Brand</p>
                    <p className="text-sm">{product.brandId}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
