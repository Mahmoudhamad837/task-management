import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  output,
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';

import {
  debounceTime,
  distinctUntilChanged,
  map,
} from 'rxjs';

import {
  takeUntilDestroyed,
} from '@angular/core/rxjs-interop';

import {
  DEFAULT_COURSE_FILTERS,
  CourseFilters,
} from '../../models/course-filter.model';
import { Category } from '../../models/course.model';

@Component({
  selector: 'app-course-filter',
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './course-filter.html',
  styleUrl: './course-filter.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseFilter {
  private readonly formBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  readonly categories = input<Category[]>([]);

  readonly filtersChange = output<CourseFilters>();

  protected readonly form =
    this.formBuilder.nonNullable.group({
      search: [DEFAULT_COURSE_FILTERS.search],
      category: [DEFAULT_COURSE_FILTERS.category],
      status:[DEFAULT_COURSE_FILTERS.status]
    });

  constructor() {
    this.form.valueChanges
      .pipe(
        debounceTime(350),

        map((): CourseFilters => {
          const values = this.form.getRawValue();

          return {
            search: values.search.trim(),
            category: values.category,
            status: values.status
          };
        }),

        distinctUntilChanged(
          (previous, current) =>
            JSON.stringify(previous) ===
            JSON.stringify(current),
        ),

        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((filters) => {
        this.filtersChange.emit(filters);
      });
  }

  protected clearSearch(): void {
    this.form.controls.search.setValue('');
  }

  protected resetFilters(): void {
    this.form.reset(DEFAULT_COURSE_FILTERS);

    this.filtersChange.emit({
      ...DEFAULT_COURSE_FILTERS,
    });
  }
}