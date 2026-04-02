# Commerce Frontend

A modern, full-featured e-commerce frontend built with React, TypeScript, and Tailwind CSS.

## Features

✅ **User Management**
- User registration and login
- Profile management
- Order history

✅ **Product Catalog**
- Browse products with pagination
- Product search and filtering
- Detailed product pages with images
- Product ratings and reviews

✅ **Shopping Cart**
- Add/remove products
- Update quantities
- View cart summary

✅ **Admin Dashboard**
- Product management
- Brand management
- Category management
- User management
- Order tracking
- Sales analytics

✅ **Modern Tech Stack**
- React 18 with TypeScript
- Tailwind CSS for styling
- shadcn/ui components
- React Router v6 for routing
- Zustand for state management
- TanStack Query (React Query) for data fetching
- React Hook Form + Zod for form validation
- Axios for API requests
- Lucide React for icons

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Environment Variables

Create a `.env` file (or modify `.env.example`):

```env
VITE_API_BASE_URL=http://localhost:3000/v1
VITE_APP_NAME=Commerce
```

## Project Structure

```
src/
├── components/        # Reusable React components
│   ├── ui/           # Base UI components (Button, Input, Card, etc.)
│   ├── layout/       # Header, Footer, Layout
│   ├── products/     # Product-related components
│   ├── admin/        # Admin dashboard components
│   └── auth/         # Auth components (ProtectedRoute)
├── pages/            # Page components
│   ├── HomePage.tsx
│   ├── ProductsPage.tsx
│   ├── LoginPage.tsx
│   ├── CartPage.tsx
│   └── admin/        # Admin pages
├── hooks/            # Custom React hooks
│   ├── useProducts.ts
│   ├── useBrands.ts
│   └── useCategories.ts
├── services/         # API service handlers
│   ├── api.ts        # Axios interceptors
│   ├── product.service.ts
│   ├── auth.service.ts
│   ├── cart.service.ts
│   └── order.service.ts
├── store/            # Zustand state stores
│   ├── auth.store.ts
│   └── cart.store.ts
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
│   ├── cn.ts         # Class name merger
│   ├── format.ts     # Format helpers
│   └── validations.ts # Zod schemas
├── layouts/          # Layout components
├── config/           # Configuration
├── App.tsx           # Main app component with routing
├── main.tsx          # Entry point
└── index.css         # Global styles
```

## Key Components

### Authentication
- **Protected Routes**: Restrict access based on user role
- **Auth Store**: Zustand store for user state
- **Login/Register Pages**: Full authentication flows

### Product Management
- **Product Service**: API integration
- **Product Hooks**: React Query hooks for data fetching
- **Product Card**: Reusable product display component
- **Admin Management**: CRUD operations for products

### Shopping
- **Cart Store**: Zustand for cart state
- **Cart Service**: API integration
- **Product Detail**: Large product view with images
- **Checkout**: Order placement flow (expandable)

### Admin Dashboard
- **Sidebar Navigation**: Admin menu
- **Dashboard**: Stats and analytics overview
- **Product Management**: List, create, edit, delete
- **Brand Management**: Full CRUD operations
- **User Management**: View and manage users

## API Integration

All services use axios with automatic:
- ✅ JWT token injection in headers
- ✅ 401 response handling (auto-redirect to login)
- ✅ Error handling with toast notifications

### Available Services

```typescript
// Products
productService.getAll(page, limit)
productService.getById(id)
productService.search(keyword, page, limit)
productService.create(data)
productService.update(id, data)
productService.delete(id)

// Brands
brandService.getAll(page, limit)
brandService.getById(id)
brandService.create(data)
brandService.update(id, data)
brandService.delete(id)

// Categories
categoryService.getAll()
categoryService.getById(id)
categoryService.create(data)
categoryService.update(id, data)
categoryService.delete(id)

// Cart
cartService.getCart()
cartService.addItem(productId, quantity, variantId)
cartService.updateItem(cartItemId, quantity)
cartService.removeItem(cartItemId)

// Orders
orderService.getAll(page, limit)
orderService.getById(id)
orderService.create(data)
orderService.updateStatus(id, status)
orderService.cancel(id)

// Auth
authService.login(credentials)
authService.register(credentials)
authService.getProfile()
authService.updateProfile(data)
```

## Forms & Validation

Using React Hook Form + Zod:

```typescript
// Schemas
LoginSchema
RegisterSchema
ProductSchema
BrandSchema
CategorySchema

// Form Usage
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(LoginSchema),
});
```

## State Management

### Zustand Stores

```typescript
// Auth Store
useAuthStore((state) => ({
  user, token, isLoading, error,
  login, register, logout, setUser, setToken
}))

// Cart Store
useCartStore((state) => ({
  cart, setCart, addItem, removeItem, clearCart
}))
```

## React Query Hooks

```typescript
// Products
useProducts(page, limit)
useProduct(id)
useSearchProducts(keyword, page, limit)
useCreateProduct()
useUpdateProduct()
useDeleteProduct()

// Similar hooks available for brands and categories
```

## Styling

- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Pre-built component library
- **Custom tokens**: Colors, spacing, radius defined in tailwind config
- **Dark mode**: Built-in dark mode support (optional)

## Next Steps to Complete

- [ ] Implement checkout flow
- [ ] Add payment gateway integration
- [ ] Implement product reviews and ratings
- [ ] Add wishlist functionality
- [ ] Implement coupon system
- [ ] Add user address management
- [ ] Implement order tracking
- [ ] Add notification system
- [ ] Implement analytics dashboard
- [ ] Add image upload functionality
- [ ] Implement search filters
- [ ] Add category-based filtering

## Performance Optimizations

- ✅ Code splitting with React Router
- ✅ Image lazy loading
- ✅ React Query caching
- ✅ Memoization where needed
- ✅ Vite for fast builds

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## License

ISC
