import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '@hooks/useProducts';
import { useCategories } from '@hooks/useCategories';
import { useBrands } from '@hooks/useBrands';
import ProductCard from '@components/products/ProductCard';
import { Button } from '@components/ui/button';
import { Card, CardContent } from '@components/ui/card';
import { Checkbox } from '@components/ui/checkbox';
import { Slider } from '@components/ui/slider';
import { Skeleton } from '@components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@components/ui/sheet';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@components/ui/pagination';
import { PackageSearch, SlidersHorizontal } from 'lucide-react';
import { formatPrice } from '@utils/format';
import type { Category } from '../types/category';
import type { ProductFilter, ProductGender, ProductSort } from '../types/product';

const PRICE_MIN = 0;
const PRICE_MAX = 5000000;
const PAGE_SIZE = 12;

const sortOptions: { value: ProductSort; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating_desc', label: 'Highest Rated' },
];

const genderOptions: { value: ProductGender; label: string }[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'unisex', label: 'Unisex' },
];

interface FlatCategory {
  id: string;
  name: string;
  depth: number;
}

function flattenCategories(categories: Category[], depth = 0): FlatCategory[] {
  return categories.flatMap((category) => [
    { id: category.id, name: category.name, depth },
    ...(category.children && category.children.length > 0
      ? flattenCategories(category.children, depth + 1)
      : []),
  ]);
}

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const page = Number(searchParams.get('page')) || 1;
  const search = searchParams.get('search') ?? '';
  const categoryId = searchParams.get('categoryId') ?? '';
  const brandId = searchParams.get('brandId') ?? '';
  const gender = (searchParams.get('gender') as ProductGender | null) ?? undefined;
  const sort = (searchParams.get('sort') as ProductSort | null) ?? 'newest';
  const priceMin = Number(searchParams.get('priceMin')) || PRICE_MIN;
  const priceMax = Number(searchParams.get('priceMax')) || PRICE_MAX;

  const [priceRange, setPriceRange] = useState<[number, number]>([priceMin, priceMax]);

  useEffect(() => {
    setPriceRange([priceMin, priceMax]);
  }, [priceMin, priceMax]);

  const filter: ProductFilter = useMemo(() => {
    const f: ProductFilter = { sort };
    if (search) f.name = search;
    if (categoryId) f.categoryId = categoryId;
    if (brandId) f.brandId = brandId;
    if (gender) f.gender = gender;
    if (priceMin > PRICE_MIN) f.priceMin = priceMin;
    if (priceMax < PRICE_MAX) f.priceMax = priceMax;
    return f;
  }, [search, categoryId, brandId, gender, sort, priceMin, priceMax]);

  const { data, isLoading, error } = useProducts(page, PAGE_SIZE, filter);
  const { data: categories, isLoading: loadingCategories } = useCategories();
  const { data: brandsData, isLoading: loadingBrands } = useBrands(1, 100);

  const flatCategories = useMemo(() => flattenCategories(categories ?? []), [categories]);

  const totalPages = data ? Math.max(1, Math.ceil(data.paging.total / PAGE_SIZE)) : 1;

  const updateParams = (updates: Record<string, string | null>, resetPage = true) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        next.delete(key);
      } else {
        next.set(key, value);
      }
    });
    if (resetPage) next.delete('page');
    setSearchParams(next);
  };

  const handleCategoryToggle = (id: string) => {
    updateParams({ categoryId: categoryId === id ? null : id });
  };

  const handleBrandToggle = (id: string) => {
    updateParams({ brandId: brandId === id ? null : id });
  };

  const handleGenderChange = (value: string) => {
    updateParams({ gender: value === 'all' ? null : value });
  };

  const handleSortChange = (value: string) => {
    updateParams({ sort: value }, false);
  };

  const applyPriceFilter = () => {
    updateParams({
      priceMin: priceRange[0] > PRICE_MIN ? String(priceRange[0]) : null,
      priceMax: priceRange[1] < PRICE_MAX ? String(priceRange[1]) : null,
    });
  };

  const clearFilters = () => {
    setPriceRange([PRICE_MIN, PRICE_MAX]);
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = Boolean(
    search || categoryId || brandId || gender || priceMin > PRICE_MIN || priceMax < PRICE_MAX
  );

  const goToPage = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages) return;
    const next = new URLSearchParams(searchParams);
    next.set('page', String(nextPage));
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filtersContent = (
    <div className="space-y-8">
      <div>
        <h3 className="mb-3 text-sm font-semibold">Category</h3>
        {loadingCategories ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-5 w-full" />
            ))}
          </div>
        ) : (
          <div className="max-h-56 space-y-1 overflow-y-auto pr-1">
            <button
              type="button"
              onClick={() => handleCategoryToggle('')}
              className={`block w-full rounded px-2 py-1 text-left text-sm ${
                !categoryId ? 'bg-primary/10 font-medium text-primary' : 'text-muted-foreground hover:bg-accent'
              }`}
            >
              All Categories
            </button>
            {flatCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => handleCategoryToggle(category.id)}
                style={{ paddingLeft: `${8 + category.depth * 16}px` }}
                className={`block w-full rounded py-1 text-left text-sm ${
                  categoryId === category.id
                    ? 'bg-primary/10 font-medium text-primary'
                    : 'text-muted-foreground hover:bg-accent'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold">Brand</h3>
        {loadingBrands ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-5 w-full" />
            ))}
          </div>
        ) : (
          <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
            {(brandsData?.data ?? []).map((brand) => (
              <label key={brand.id} className="flex cursor-pointer items-center gap-2 text-sm">
                <Checkbox
                  checked={brandId === brand.id}
                  onCheckedChange={() => handleBrandToggle(brand.id)}
                />
                <span>{brand.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold">Gender</h3>
        <Select value={gender ?? 'all'} onValueChange={handleGenderChange}>
          <SelectTrigger>
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {genderOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold">Price Range</h3>
        <Slider
          value={priceRange}
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={50000}
          onValueChange={(value) => setPriceRange(value as [number, number])}
          onValueCommit={applyPriceFilter}
        />
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>{formatPrice(priceRange[0])}</span>
          <span>{formatPrice(priceRange[1])}</span>
        </div>
      </div>

      {hasActiveFilters && (
        <Button variant="outline" size="sm" className="w-full" onClick={clearFilters}>
          Clear Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold sm:text-4xl">
            {search ? `Search results for "${search}"` : 'All Products'}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {data ? `${data.paging.total} products found` : 'Explore our wide range of products'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="lg:hidden">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6">{filtersContent}</div>
            </SheetContent>
          </Sheet>

          <Select value={sort} onValueChange={handleSortChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <Card>
            <CardContent className="pt-6">{filtersContent}</CardContent>
          </Card>
        </aside>

        <div>
          {error && (
            <Card className="mb-6 border-destructive bg-destructive/10">
              <CardContent className="pt-6">
                <p className="text-destructive">Failed to load products. Please try again.</p>
              </CardContent>
            </Card>
          )}

          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <Skeleton key={i} className="h-80 rounded-xl" />
              ))}
            </div>
          ) : data && data.data.length > 0 ? (
            <>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {data.data.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {totalPages > 1 && (
                <Pagination className="mt-12">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => goToPage(page - 1)}
                        className={page === 1 ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }).map((_, i) => {
                      const pageNumber = i + 1;
                      const isEdge = pageNumber === 1 || pageNumber === totalPages;
                      const isNearCurrent = Math.abs(pageNumber - page) <= 2;
                      if (totalPages > 7 && !isEdge && !isNearCurrent) {
                        if (pageNumber === 2 || pageNumber === totalPages - 1) {
                          return (
                            <PaginationItem key={pageNumber}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        }
                        return null;
                      }
                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink
                            isActive={page === pageNumber}
                            onClick={() => goToPage(pageNumber)}
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => goToPage(page + 1)}
                        className={page === totalPages ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                <PackageSearch className="h-12 w-12 text-muted-foreground" />
                <p className="font-medium">No products found</p>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your filters or search terms.
                </p>
                {hasActiveFilters && (
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
