import { Link } from 'react-router-dom';
import { Separator } from '@components/ui/separator';
import { Facebook, Headphones, Instagram, Package, ShieldCheck, Truck, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t bg-slate-950 text-slate-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Package className="h-5 w-5" />
              </span>
              Commerce
            </Link>
            <p className="mt-4 max-w-sm text-sm text-slate-400">
              Your trusted destination for quality products from top brands, delivered fast and
              securely.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 transition-colors hover:bg-primary"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 transition-colors hover:bg-primary"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 transition-colors hover:bg-primary"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Shop</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link to="/products" className="text-slate-400 transition-colors hover:text-primary">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/brands" className="text-slate-400 transition-colors hover:text-primary">
                  Brands
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-slate-400 transition-colors hover:text-primary">
                  Categories
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Support</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a href="#" className="text-slate-400 transition-colors hover:text-primary">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 transition-colors hover:text-primary">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 transition-colors hover:text-primary">
                  Shipping Info
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Company</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a href="#" className="text-slate-400 transition-colors hover:text-primary">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 transition-colors hover:text-primary">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 transition-colors hover:text-primary">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-10 bg-slate-800" />

        <div className="grid gap-6 sm:grid-cols-3">
          <div className="flex items-center gap-3">
            <Truck className="h-6 w-6 text-primary" />
            <span className="text-sm text-slate-300">Free shipping over 500,000₫</span>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <span className="text-sm text-slate-300">Secure payment</span>
          </div>
          <div className="flex items-center gap-3">
            <Headphones className="h-6 w-6 text-primary" />
            <span className="text-sm text-slate-300">24/7 customer support</span>
          </div>
        </div>

        <Separator className="my-10 bg-slate-800" />

        <p className="text-center text-xs text-slate-500">
          &copy; {new Date().getFullYear()} Commerce. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
