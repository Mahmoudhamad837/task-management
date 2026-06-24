import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';

import {
  TableAction,
  TableActionEvent,
  TableColumn,
  TableSort,
  TableSortDirection,
} from './table.models';
import { Button } from '../button/button';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports:[
    Button
  ],
  templateUrl: './table.html',
  styleUrl: './table.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent<T extends object> {
  title = input<string>('');

  rows = input.required<readonly T[]>();

  columns = input.required<readonly TableColumn<T>[]>();

  actions = input<readonly TableAction<T>[]>([]);

  loading = input<boolean>(false);

  emptyMessage = input<string>('No data found.');

  showIndex = input<boolean>(false);

  trackBy = input<(row: T, index: number) => string | number>(
    (_row, index) => index,
  );

  rowClicked = output<T>();

  sortChanged = output<TableSort<T>>();

  actionClicked = output<TableActionEvent<T>>();

  protected sortKey = signal<keyof T | string | null>(null);

  protected sortDirection = signal<TableSortDirection>('asc');

  protected onRowClick(row: T): void {
    this.rowClicked.emit(row);
  }

  protected onSort(column: TableColumn<T>): void {
    if (!column.sortable) {
      return;
    }

    const currentKey = this.sortKey();
    const nextDirection: TableSortDirection =
      currentKey === column.key && this.sortDirection() === 'asc'
        ? 'desc'
        : 'asc';

    this.sortKey.set(column.key);
    this.sortDirection.set(nextDirection);

    this.sortChanged.emit({
      key: column.key,
      direction: nextDirection,
    });
  }

  protected onActionClick(
    event: MouseEvent,
    action: TableAction<T>,
    row: T,
  ): void {
    event.stopPropagation();

    if (this.isActionDisabled(action, row)) {
      return;
    }

    this.actionClicked.emit({
      action,
      row,
    });
  }

  protected getCellValue(row: T, column: TableColumn<T>): unknown {
    if (column.cell) {
      return column.cell(row);
    }

    return this.getValueByPath(row, String(column.key));
  }

  protected isActionVisible(action: TableAction<T>, row: T): boolean {
    return action.visible ? action.visible(row) : true;
  }

  protected isActionDisabled(action: TableAction<T>, row: T): boolean {
    return action.disabled ? action.disabled(row) : false;
  }

  protected getSortIcon(column: TableColumn<T>): string {
    if (!column.sortable) {
      return '';
    }

    if (this.sortKey() !== column.key) {
      return '↕';
    }

    return this.sortDirection() === 'asc' ? '↑' : '↓';
  }

  protected trackRow(row: T, index: number): string | number {
    return this.trackBy()(row, index);
  }

  private getValueByPath(row: T, path: string): unknown {
    return path.split('.').reduce<unknown>((value, key) => {
      if (value && typeof value === 'object') {
        return (value as Record<string, unknown>)[key];
      }

      return undefined;
    }, row);
  }
}