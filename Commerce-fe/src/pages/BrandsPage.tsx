import { useBrands } from '@hooks/useBrands';
import BrandCard from '@components/brands/BrandCard';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo } from 'react';

export default function BrandsPage() {
  const [page, setPage] = useState(1);
  const limit = 12;
  const { data, isLoading } = useBrands(page, limit);

  const totalPages = useMemo(() => {
    return data ? Math.ceil(data.paging.total / limit) : 0;
  }, [data]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold">Brands</h1>
        <p className="text-muted-foreground mt-2">
          Explore top brands and find your favorite products
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : data && data.data.length > 0 ? (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {data.data.map((brand) => (
              <BrandCard key={brand.id} brand={brand} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Previous
              </Button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <Button
                    key={i}
                    variant={page === i + 1 ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">No brands found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
