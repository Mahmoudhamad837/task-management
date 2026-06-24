// src/app/shared/components/data-table/data-table.models.ts

export type TableAlign = 'left' | 'center' | 'right';

export type TableSortDirection = 'asc' | 'desc';

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;

  width?: string;
  align?: TableAlign;

  sortable?: boolean;

  /**
   * Use this when the displayed value is not a direct property.
   * Example:
   * cell: (product) => `${product.price} EGP`
   */
  cell?: (row: T) => unknown;
}

export interface TableAction<T> {
  key: string;
  label: string;

  variant: 'primary'| 'secondary' | 'outline' | 'danger' | 'ghost';

  visible?: (row: T) => boolean;
  disabled?: (row: T) => boolean;
}

export interface TableSort<T> {
  key: keyof T | string;
  direction: TableSortDirection;
}

export interface TableActionEvent<T> {
  action: TableAction<T>;
  row: T;
}