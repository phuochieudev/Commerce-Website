import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import queryClient from '@services/queryClient';
import Layout from '@components/layout/Layout';
import AdminLayout from '@/layouts/AdminLayout';
import ProtectedRoute from '@components/auth/ProtectedRoute';

// Pages
import HomePage from '@pages/HomePage';
import ProductsPage from '@pages/ProductsPage';
import ProductDetailPage from '@pages/ProductDetailPage';
import LoginPage from '@pages/LoginPage';
import RegisterPage from '@pages/RegisterPage';
import CartPage from '@pages/CartPage';
import ProfilePage from '@pages/ProfilePage';
import OrdersPage from '@pages/OrdersPage';
import BrandsPage from '@pages/BrandsPage';
import CategoriesPage from '@pages/CategoriesPage';

// Admin Pages
import AdminDashboard from '@pages/admin/AdminDashboard';
import AdminProductsPage from '@pages/admin/AdminProductsPage';
import AdminBrandsPage from '@pages/admin/AdminBrandsPage';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Customer Routes */}
          <Route element={<Layout>{null}</Layout>}>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/brands" element={<BrandsPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <OrdersPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="brands" element={<AdminBrandsPage />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="bottom-right" />
    </QueryClientProvider>
  );
}
