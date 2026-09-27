import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useProduct } from '@hooks/useProducts';
import { useCreateReview, useReviews } from '@hooks/useReviews';
import { useAddToCart } from '@hooks/useCart';
import { useLikeStatus, useToggleLike } from '@hooks/useWishlist';
import { useAuthStore } from '@store/auth.store';
import { Button } from '@components/ui/button';
import { Card, CardContent } from '@components/ui/card';
import { Badge } from '@components/ui/badge';
import { Skeleton } from '@components/ui/skeleton';
import { Separator } from '@components/ui/separator';
import { Textarea } from '@components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';
import { Heart, ImageOff, Minus, PackageX, Plus, ShoppingCart, Star } from 'lucide-react';
import { formatDate, formatPrice } from '@utils/format';
import { cn } from '@utils/cn';

const SIZE_OPTIONS = ['S', 'M', 'L', 'XL', 'XXL'];

function StarRating({ rating, size = 'h-4 w-4' }: { rating: number; size?: string }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            size,
            i < Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'
          )}
        />
      ))}
    </div>
  );
}

function ProductImage({
  src,
  alt,
  className,
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  const [error, setError] = useState(false);
  if (!src || error) {
    return (
      <div className={cn('flex items-center justify-center bg-muted', className)}>
        <ImageOff className="h-10 w-10 text-muted-foreground" />
      </div>
    );
  }
  return (
    <img src={src} alt={alt} onError={() => setError(true)} className={cn('object-cover', className)} />
  );
}

function StarPicker({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const starValue = i + 1;
        return (
          <button
            key={i}
            type="button"
            onClick={() => onChange(starValue)}
            aria-label={`Rate ${starValue} stars`}
          >
            <Star
              className={cn(
                'h-6 w-6 transition-colors',
                starValue <= value ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const { data: product, isLoading, error } = useProduct(id ?? '');
  const { data: reviewsData, isLoading: loadingReviews } = useReviews(id ?? '');
  const createReview = useCreateReview();
  const addToCart = useAddToCart();
  const { data: likeStatus } = useLikeStatus(id ?? '', !!user && !!id);
  const toggleLike = useToggleLike();

  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewContent, setReviewContent] = useState('');

  const colors = useMemo(
    () =>
      product?.colors
        ? product.colors
            .split(',')
            .map((c) => c.trim())
            .filter(Boolean)
        : [],
    [product?.colors]
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2">
          <Skeleton className="aspect-square rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center gap-4 px-4 py-24 text-center">
        <PackageX className="h-16 w-16 text-muted-foreground" />
        <h1 className="text-2xl font-bold">Product not found</h1>
        <p className="text-muted-foreground">
          This product may have been removed or the link is incorrect.
        </p>
        <Link to="/products">
          <Button>Back to Products</Button>
        </Link>
      </div>
    );
  }

  const images = product.images ?? [];
  const hasSale = product.salePrice != null && product.salePrice < product.price;
  const discountPercent = hasSale
    ? Math.round((1 - (product.salePrice as number) / product.price) * 100)
    : 0;
  const inStock = product.quantity > 0;
  const reviewCount = reviewsData?.paging.total ?? 0;

  const handleToggleLike = () => {
    if (!user) {
      toast.info('Please log in to save items to your wishlist');
      return;
    }
    toggleLike.mutate({ productId: product.id, liked: likeStatus?.liked ?? false });
  };

  const handleAddToCart = () => {
    if (!inStock) return;
    const attributeParts: string[] = [];
    if (selectedColor) attributeParts.push(`color:${selectedColor}`);
    if (selectedSize) attributeParts.push(`size:${selectedSize}`);
    const attribute = attributeParts.join(',');
    addToCart.mutate({ productId: product.id, attribute, quantity });
  };

  const handleSubmitReview = () => {
    if (!id) return;
    if (reviewRating === 0) {
      toast.error('Please select a star rating');
      return;
    }
    createReview.mutate(
      { productId: id, rating: reviewRating, content: reviewContent },
      {
        onSuccess: () => {
          setReviewRating(0);
          setReviewContent('');
        },
      }
    );
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid gap-10 md:grid-cols-2">
        {/* Gallery */}
        <div>
          <ProductImage
            src={images[activeImage] ?? images[0]}
            alt={product.name}
            className="aspect-square w-full rounded-xl"
          />
          {images.length > 1 && (
            <div className="mt-4 grid grid-cols-5 gap-2">
              {images.slice(0, 5).map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    'overflow-hidden rounded-lg border-2 transition-colors',
                    activeImage === i ? 'border-primary' : 'border-transparent'
                  )}
                >
                  <ProductImage src={img} alt={`${product.name} ${i + 1}`} className="aspect-square w-full" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold sm:text-4xl">{product.name}</h1>
            <div className="mt-3 flex items-center gap-3">
              <StarRating rating={product.rating} />
              <span className="text-sm text-muted-foreground">
                {product.rating.toFixed(1)} ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-baseline gap-3">
              {hasSale ? (
                <>
                  <span className="text-3xl font-bold text-primary">
                    {formatPrice(product.salePrice as number)}
                  </span>
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(product.price)}
                  </span>
                  <Badge variant="destructive">-{discountPercent}%</Badge>
                </>
              ) : (
                <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
              )}
            </div>
            <p className={cn('mt-2 text-sm font-medium', inStock ? 'text-green-600' : 'text-destructive')}>
              {inStock ? `In Stock (${product.quantity} available)` : 'Out of Stock'}
            </p>
          </div>

          <Separator />

          {colors.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-semibold">Color</h3>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      'rounded-full border px-4 py-1.5 text-sm transition-colors',
                      selectedColor === color
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-input hover:border-primary'
                    )}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="mb-2 text-sm font-semibold">Size</h3>
            <div className="flex flex-wrap gap-2">
              {SIZE_OPTIONS.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    'h-10 w-10 rounded-md border text-sm font-medium transition-colors',
                    selectedSize === size
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-input hover:border-primary'
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-semibold">Quantity</h3>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-10 text-center text-lg font-medium">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity((q) => Math.min(product.quantity, q + 1))}
                disabled={quantity >= product.quantity}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              size="lg"
              className="flex-1"
              disabled={!inStock || addToCart.isPending}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            <Button variant="outline" size="lg" onClick={handleToggleLike}>
              <Heart className={cn('h-5 w-5', likeStatus?.liked ? 'fill-destructive text-destructive' : '')} />
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-16">
        <Tabs defaultValue="description">
          <TabsList>
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({reviewCount})</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <p className="whitespace-pre-line text-muted-foreground">
                  {product.content || product.description || 'No description available for this product.'}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6 space-y-6">
            {user ? (
              <Card>
                <CardContent className="space-y-4 pt-6">
                  <h3 className="font-semibold">Write a Review</h3>
                  <StarPicker value={reviewRating} onChange={setReviewRating} />
                  <Textarea
                    placeholder="Share your thoughts about this product..."
                    value={reviewContent}
                    onChange={(e) => setReviewContent(e.target.value)}
                  />
                  <Button onClick={handleSubmitReview} disabled={createReview.isPending}>
                    Submit Review
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-between pt-6">
                  <p className="text-muted-foreground">Log in to write a review.</p>
                  <Link to="/login">
                    <Button variant="outline">Log In</Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {loadingReviews ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : reviewsData && reviewsData.data.length > 0 ? (
              <div className="space-y-4">
                {reviewsData.data.map((review, i) => (
                  <Card key={`${review.userId}-${i}`}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">
                            {review.user ? `${review.user.firstName} ${review.user.lastName}` : 'Customer'}
                          </p>
                          <StarRating rating={review.rating} size="h-3.5 w-3.5" />
                        </div>
                        {review.createdAt && (
                          <span className="text-xs text-muted-foreground">
                            {formatDate(review.createdAt)}
                          </span>
                        )}
                      </div>
                      {review.content && (
                        <p className="mt-3 text-sm text-muted-foreground">{review.content}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-muted-foreground">
                No reviews yet. Be the first to review this product!
              </p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
