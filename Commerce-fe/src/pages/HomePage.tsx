import { Link } from 'react-router-dom';
import { Button } from '@components/ui/button';
import { Card, CardContent } from '@components/ui/card';
import { ShoppingCart, Sparkles, Truck, Shield } from 'lucide-react';
import { useProducts } from '@hooks/useProducts';
import ProductCard from '@components/products/ProductCard';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const { data, isLoading } = useProducts(1, 8);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-4">Welcome to Commerce</h1>
            <p className="text-xl text-white/90 mb-8">
              Discover millions of products from trusted brands. Shop now and enjoy amazing deals!
            </p>
            <div className="flex gap-4">
              <Link to="/products">
                <Button size="lg" variant="secondary">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Start Shopping
                </Button>
              </Link>
              <Link to="/products">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                  Explore Collections
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="bg-background">
              <CardContent className="pt-6">
                <Truck className="h-12 w-12 text-primary mb-4" />
                <h3 className="font-bold text-lg">Free Shipping</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Free shipping on orders over $50. Fast and reliable delivery.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-background">
              <CardContent className="pt-6">
                <Shield className="h-12 w-12 text-primary mb-4" />
                <h3 className="font-bold text-lg">Secure Payment</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Your payment information is secure and encrypted with SSL.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-background">
              <CardContent className="pt-6">
                <Sparkles className="h-12 w-12 text-primary mb-4" />
                <h3 className="font-bold text-lg">Quality Assured</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  All products are quality checked before shipping.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-12">
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <p className="text-muted-foreground mt-2">
            Check out our latest and most popular products
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : data && data.data.length > 0 ? (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {data.data.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link to="/products">
                <Button size="lg" variant="outline">
                  View All Products
                </Button>
              </Link>
            </div>
          </>
        ) : null}
      </section>

      {/* Newsletter */}
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold">Subscribe to Our Newsletter</h2>
          <p className="text-white/90 mt-2">
            Get exclusive deals and updates delivered to your inbox
          </p>
          <div className="mt-6 flex max-w-md gap-2 mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded px-4 py-2 text-black"
            />
            <Button variant="secondary">Subscribe</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
