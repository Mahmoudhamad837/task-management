import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { Category, Course } from '../../models/course.model';
import { CourseFilters } from '../../models/course-filter.model';
import { CoursesApiService, CoursesQuery } from '../../services/courses-api.service';

import { CourseFilter } from '../../components/course-filter/course-filter';

import { Pagination } from '../../../../shared/components/pagination/pagination';
import { TableComponent } from '../../../../shared/components/table/table';
import { TableAction, TableActionEvent, TableColumn, TableSort } from '../../../../shared/components/table/table.models';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { Button } from "../../../../shared/components/button/button";

@Component({
  selector: 'app-course-list',
  imports: [
    CourseFilter,
    Pagination,
    TableComponent,
    ConfirmDialog,
    RouterLink,
    Button
],
  templateUrl: './course-list.html',
  styleUrl: './course-list.css',
})
export class CourseList implements OnInit {
  private readonly coursesApi = inject(CoursesApiService);
  private readonly destroyRef = inject(DestroyRef);
   private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly courses = signal<Course[]>([]);
  protected readonly categories = signal<Category[]>([]);
  protected readonly totalItems = signal(0);
  protected readonly loading = signal(false);
  protected readonly deleting = signal(false);

  protected readonly selectedCourseToDelete = signal<Course | null>(null);

  columns: TableColumn<Course>[] = [
    {
      key: 'title',
      header: 'Course Name',
      sortable: true,
    },
    {
      key: 'instructor',
      header: 'Instructor Name',
      sortable: true,
    },
    {
      key: 'category',
      header: 'Category',
      sortable: true,
    },
    {
      key: 'duration',
      header: 'Duration',
      sortable: true,
    },
    {
      key: 'price',
      header: 'Price',
      align: 'right',
      sortable: true,
      cell: (course) => `${course.price} EGP`,
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      cell: (course) => (course.status),
    },
    {
      key: 'createdDate',
      header: 'Created Date',
      align: 'center',
      cell: (course) => (course.createdDate),
    },
  ];

  actions: TableAction<Course>[] = [
    {
      key: 'view',
      label: 'View',
      variant: 'ghost',
    },
    {
      key: 'edit',
      label: 'Edit',
      variant: 'primary',
    },
    {
      key: 'delete',
      label: 'Delete',
      variant: 'danger'
    },
  ];

  protected readonly query =
    signal<CoursesQuery>({
      page: 1,
      pageSize: 12,
    });

  protected readonly errorMessage =
    signal<string | null>(null);

  ngOnInit(): void {
    this.loadCategories();
    this.loadCourses();
  }

  protected applyFilters(filters: CourseFilters): void {
    this.query.update((currentQuery) => ({
        ...currentQuery,
        ...filters,
        page: 1,
      }),
    );

    this.loadCourses();
  }

  protected changePage(
    page: number,
  ): void {
    this.query.update(
      (
        currentQuery,
      ) => ({
        ...currentQuery,
        page,
      }),
    );

    this.loadCourses();

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  protected loadCategories(): void {
    this.coursesApi
      .getAllCategories()
      .pipe(
        takeUntilDestroyed(
          this.destroyRef,
        ),
      )
      .subscribe({
        next: (
          categories,
        ) => {
          this.categories.set(categories);
        },

        error: (
          error: unknown,
        ) => {
          console.error(
            'Failed to load categories:',
            error,
          );
        },
      });
  }

  protected loadCourses(): void {
    this.errorMessage.set(null);
    this.loading.set(true);

    this.coursesApi.getCourses(this.query())
      .pipe(
        takeUntilDestroyed(
          this.destroyRef,
        ),
        finalize(() => {
          this.loading.set(false);
        }),
      )
      .subscribe({
        next: (response) => {
          this.courses.set(response.data);
          this.totalItems.set(response.total);
        },

        error: (
          error: unknown,
        ) => {
          console.error('Failed to load courses:', error);
          this.errorMessage.set('Unable to load courses. Please try again.');
        },
      });
  }

  onSort(sort: TableSort<Course>): void {
    this.query.update((currentQuery) => ({
        ...currentQuery,
        sortBy: String(sort.key),
        sortDirection: sort.direction,
        page: 1,
      }),
    );

    this.loadCourses();
  }

  onAction(event: TableActionEvent<Course>): void {
  const { action, row } = event;

  switch (action.key) {
    case 'view':
      this.viewCourse(row);
      break;

    case 'edit':
      this.editCourse(row);
      break;

    case 'delete':
      this.openDeleteDialog(row);
      break;
  }
}

private viewCourse(course: Course): void {
  void this.router.navigate(
    [course.id],
    {
      relativeTo: this.route,
    },
  );
}

private editCourse(course: Course): void {
  void this.router.navigate(
    [course.id, 'edit'],
    {
      relativeTo: this.route,
    },
  );
}

protected openDeleteDialog(course: Course): void {
  this.selectedCourseToDelete.set(course);
}

protected closeDeleteDialog(): void {
  if (this.deleting()) {
    return;
  }

  this.selectedCourseToDelete.set(null);
}

protected confirmDeleteCourse(): void {
  const course = this.selectedCourseToDelete();

  if (!course || this.deleting()) {
    return;
  }

  this.deleting.set(true);

  this.coursesApi
    .deleteCourse(course.id)
    .pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => {
        this.deleting.set(false);
      }),
    )
    .subscribe({
      next: () => {
        this.courses.update((currentCourses) =>
          currentCourses.filter(
            (currentCourse) => currentCourse.id !== course.id,
          ),
        );

        this.totalItems.update((total) =>
          Math.max(total - 1, 0),
        );

        this.selectedCourseToDelete.set(null);
      },

      error: (error: unknown) => {
        console.error(
          'Failed to delete course:',
          error,
        );

        this.errorMessage.set(
          'Unable to delete course. Please try again.',
        );
      },
    });
}

  onRowClick(course: Course): void {
    console.log('Clicked row:', course);
  }

  trackCourse(course: Course): number {
    return course.id;
  }
}