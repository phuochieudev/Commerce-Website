import { ReactNode } from 'react';

export interface LayoutProps {
  children: ReactNode;
}

export interface PageProps {
  params?: Record<string, string>;
  searchParams?: Record<string, string | string[]>;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  total?: number;
  page?: number;
  limit?: number;
}

export interface ColumnDef<T> {
  accessorKey?: string;
  header?: string;
  cell?: (row: T) => ReactNode;
  sortable?: boolean;
}
