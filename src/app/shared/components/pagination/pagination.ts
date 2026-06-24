import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.html',
  styleUrl: './pagination.css',
  changeDetection:
    ChangeDetectionStrategy.OnPush,
})
export class Pagination {
  readonly currentPage =
    input.required<number>();

  readonly totalItems =
    input.required<number>();

  readonly pageSize =
    input.required<number>();

  readonly pageChange =
    output<number>();

  protected readonly totalPages =
    computed(() =>
      Math.max(
        Math.ceil(
          this.totalItems() /
            this.pageSize(),
        ),
        1,
      ),
    );

  protected readonly visiblePages =
    computed(() => {
      const currentPage =
        this.currentPage();

      const totalPages =
        this.totalPages();

      const startPage =
        Math.max(
          currentPage - 2,
          1,
        );

      const endPage =
        Math.min(
          startPage + 4,
          totalPages,
        );

      const adjustedStartPage =
        Math.max(
          endPage - 4,
          1,
        );

      return Array.from(
        {
          length:
            endPage -
            adjustedStartPage +
            1,
        },
        (
          _,
          index,
        ) =>
          adjustedStartPage +
          index,
      );
    });

  protected goToPage(
    page: number,
  ): void {
    if (
      page < 1 ||
      page >
        this.totalPages() ||
      page ===
        this.currentPage()
    ) {
      return;
    }

    this.pageChange.emit(page);
  }
}