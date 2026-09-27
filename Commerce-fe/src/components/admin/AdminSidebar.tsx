import { Link, useLocation } from 'react-router-dom';
import { Button } from '@components/ui/button';
import { BarChart3, ShoppingBag, Package, Users, LogOut, FolderTree, ClipboardList, Ticket } from 'lucide-react';
import { useAuthStore } from '@store/auth.store';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const { logout } = useAuthStore();

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: BarChart3 },
    { path: '/admin/products', label: 'Products', icon: Package },
    { path: '/admin/brands', label: 'Brands', icon: ShoppingBag },
    { path: '/admin/categories', label: 'Categories', icon: FolderTree },
    { path: '/admin/orders', label: 'Orders', icon: ClipboardList },
    { path: '/admin/coupons', label: 'Coupons', icon: Ticket },
    { path: '/admin/users', label: 'Users', icon: Users },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 z-40 h-screen w-64 bg-background border-r transition-transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      } md:sticky md:top-0`}
    >
      <div className="p-6">
        <Link to="/admin" className="flex items-center space-x-2">
          <BarChart3 className="h-6 w-6" />
          <span className="text-xl font-bold">Admin</span>
        </Link>
      </div>

      <nav className="space-y-2 px-4">
        {menuItems.map((item) => (
          <Link key={item.path} to={item.path}>
            <Button
              variant={isActive(item.path) ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={onClose}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 border-t p-4">
        <Button variant="destructive" className="w-full" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
