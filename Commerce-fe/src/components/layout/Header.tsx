import { Link } from 'react-router-dom';
import { useAuthStore } from '@store/auth.store';
import { Button } from '@components/ui/button';
import { ShoppingCart, BarChart3, LogOut } from 'lucide-react';

export default function Header() {
  const { user, logout } = useAuthStore();

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <BarChart3 className="h-6 w-6" />
          <span className="text-xl font-bold">Commerce</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden space-x-8 md:flex">
          <Link to="/products" className="text-sm font-medium hover:text-primary">
            Products
          </Link>
          <Link to="/brands" className="text-sm font-medium hover:text-primary">
            Brands
          </Link>
          <Link to="/categories" className="text-sm font-medium hover:text-primary">
            Categories
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center space-x-4">
          <Link to="/cart" className="relative">
            <ShoppingCart className="h-6 w-6" />
            <span className="absolute -right-2 -top-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
              0
            </span>
          </Link>

          {user ? (
            <div className="flex items-center space-x-4">
              <Link to="/profile" className="text-sm font-medium">
                {user.fullName}
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="space-x-2">
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
