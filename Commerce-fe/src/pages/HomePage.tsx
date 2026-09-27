import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@components/ui/button';
import { Skeleton } from '@components/ui/skeleton';
import { ArrowRight, ImageOff, ShieldCheck, ShoppingBag, Sparkles, Star, Truck } from 'lucide-react';
import { useProducts } from '@hooks/useProducts';
import { useCategories } from '@hooks/useCategories';
import ProductCard from '@components/products/ProductCard';

function CategoryImage({ src, alt }: { src?: string; alt: string }) {
  const [error, setError] = useState(false);
  if (!src || error) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-muted">
        <ImageOff className="h-8 w-8 text-muted-foreground" />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      onError={() => setError(true)}
      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
    />
  );
}

export default function HomePage() {
  const { data: newestData, isLoading: loadingNewest } = useProducts(1, 8, { sort: 'newest' });
  const { data: topRatedData, isLoading: loadingTopRated } = useProducts(1, 8, {
    sort: 'rating_desc',
  });
  const { data: categories, isLoading: loadingCategories } = useCategories();

  const topCategories = (categories ?? []).filter((c) => !c.parentId).slice(0, 6);

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-blue-700 text-white">
        <div className="container relative mx-auto px-4 py-24">
          <div className="max-w-2xl">
            <span className="inline-block rounded-full bg-white/15 px-4 py-1 text-sm font-medium backdrop-blur">
              New arrivals every week
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Shop smarter, live better.
            </h1>
            <p className="mt-6 text-lg text-white/90">
              Discover thousands of curated products from trusted brands, with fast delivery and
              secure checkout every time.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/products">
                <Button size="lg" variant="secondary" className="font-semibold">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Shop Now
                </Button>
              </Link>
              <Link to="/categories">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/60 bg-transparent text-white hover:bg-white/10"
                >
                  Browse Categories
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 right-1/4 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      </section>

      {/* Trust badges */}
      <section className="border-b bg-muted/40 py-10">
        <div className="container mx-auto grid gap-6 px-4 sm:grid-cols-3">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold">Fast Shipping</p>
              <p className="text-sm text-muted-foreground">Delivered to your door quickly</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold">Secure Payment</p>
              <p className="text-sm text-muted-foreground">Your data is always protected</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold">Quality Assured</p>
              <p className="text-sm text-muted-foreground">Every product is verified</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured categories */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold">Shop by Category</h2>
            <p className="mt-2 text-muted-foreground">Find exactly what you're looking for</p>
          </div>
          <Link
            to="/categories"
            className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:flex"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loadingCategories ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        ) : topCategories.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {topCategories.map((category) => (
              <Link
                key={category.id}
                to={`/products?categoryId=${category.id}`}
                className="group overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-lg"
              >
                <div className="aspect-square overflow-hidden">
                  <CategoryImage src={category.image} alt={category.name} />
                </div>
                <div className="p-3 text-center">
                  <p className="truncate text-sm font-medium">{category.name}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No categories available yet.</p>
        )}
      </section>

      {/* Featured products */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold">New Arrivals</h2>
              <p className="mt-2 text-muted-foreground">The latest additions to our catalog</p>
            </div>
            <Link
              to="/products?sort=newest"
              className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:flex"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loadingNewest ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-80 rounded-xl" />
              ))}
            </div>
          ) : newestData && newestData.data.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {newestData.data.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No products available yet.</p>
          )}
        </div>
      </section>

      {/* Top rated */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-3xl font-bold">
              <Star className="h-7 w-7 fill-amber-400 text-amber-400" />
              Top Rated
            </h2>
            <p className="mt-2 text-muted-foreground">Loved by our customers</p>
          </div>
          <Link
            to="/products?sort=rating_desc"
            className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:flex"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loadingTopRated ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-xl" />
            ))}
          </div>
        ) : topRatedData && topRatedData.data.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {topRatedData.data.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No products available yet.</p>
        )}
      </section>

      {/* CTA banner */}
      <section className="bg-gradient-to-r from-primary to-blue-700 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold">Ready to start shopping?</h2>
          <p className="mt-2 text-white/90">
            Browse our full catalog and find your next favorite thing.
          </p>
          <Link to="/products">
            <Button size="lg" variant="secondary" className="mt-6 font-semibold">
              Explore Products
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
