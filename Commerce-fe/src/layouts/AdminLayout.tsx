import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '@components/admin/AdminSidebar';
import { Menu, X } from 'lucide-react';
import { Button } from '@components/ui/button';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b bg-background">
          <div className="flex h-16 items-center justify-between px-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden"
            >
              {sidebarOpen ? <X /> : <Menu />}
            </Button>
            <div className="flex-1" />
            <div className="flex items-center gap-4">
              {/* TODO: Add admin user profile */}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
