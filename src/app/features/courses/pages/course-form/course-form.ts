import { Component, DestroyRef, computed, inject, OnInit, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, EMPTY, finalize, forkJoin, map, min, of, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Category, Course, CoursePayload } from '../../models/course.model';
import { CoursesApiService } from '../../services/courses-api.service';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './course-form.html',
  styleUrl: './course-form.css',
})
export class CourseForm implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly coursesApi = inject(CoursesApiService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly categories = signal<Category[]>([]);
  protected readonly courseId = signal<string | null>(null);

  protected readonly loading = signal(false);
  protected readonly saving = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly isEditMode = computed(() =>
    Boolean(this.courseId()),
  );

  protected readonly pageTitle = computed(() =>
    this.isEditMode()
      ? 'Edit Course'
      : 'Add New Course',
  );

  protected readonly submitText = computed(() =>
    this.isEditMode()
      ? 'Update Course'
      : 'Create Course',
  );

  protected readonly form = this.fb.group({
    title: ['', [ Validators.required, Validators.minLength(3) ]],
    instructor: ['', [ Validators.required, Validators.minLength(3) ]],
    category: ['', [ Validators.required ]],
    duration: [0, [ Validators.required, Validators.min(1) ]],
    price: [0, [ Validators.required, Validators.min(0)]],
    status: ['active' as CoursePayload['status'], [ Validators.required ]],
    description: ['', [Validators.maxLength(500)]],
  });

  ngOnInit(): void {
  this.route.paramMap
    .pipe(
      map((params) => params.get('id')),

      tap((id) => {
        this.courseId.set(id);
        this.errorMessage.set(null);
        this.loading.set(true);

        this.form.reset({
          title: '',
          instructor: '',
          category: '',
          duration: 1,
          price: 0,
          status: 'active',
          description: '',
        });
      }),

      switchMap((id) => {
        const categories$ =
          this.coursesApi.getAllCategories();

        const course$ = id
          ? this.coursesApi.getCourseById(id)
          : of(null);

        return forkJoin({
          categories: categories$,
          course: course$,
        }).pipe(
          catchError((error: unknown) => {
            console.error(
              'Failed to load form data:',
              error,
            );

            this.errorMessage.set(
              'Unable to load course form data.',
            );

            return EMPTY;
          }),

          finalize(() => {
            this.loading.set(false);
          }),
        );
      }),

      takeUntilDestroyed(this.destroyRef),
    )
    .subscribe({
      next: ({ categories, course }) => {
        this.categories.set(categories);

        if (course) {
          this.patchForm(course);
        }
      },
    });
}

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.getRawValue();

    this.saving.set(true);
    this.errorMessage.set(null);

    const request$ = this.isEditMode()
      ? this.coursesApi.updateCourse(
          this.courseId()!,
          payload,
        )
      : this.coursesApi.createCourse(
          payload,
        );

    request$
      .pipe(
        finalize(() => {
          this.saving.set(false);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (course) => {
          void this.router.navigate([
            '/courses',
            course.id,
          ]);
        },

        error: (error: unknown) => {
          console.error(
            'Failed to save course:',
            error,
          );

          this.errorMessage.set(
            'Unable to save course. Please try again.',
          );
        },
      });
  }

  protected hasError(
    controlName: keyof typeof this.form.controls,
    errorName: string,
  ): boolean {
    const control = this.form.controls[controlName];

    return control.touched && control.hasError(errorName);
  }

  private patchForm(course: Course): void {
    this.form.patchValue({
      title: course.title,
      instructor: course.instructor,
      category: course.category,
      duration: course.duration,
      price: course.price,
      status: course.status as CoursePayload['status'],
      description: course.description ?? '',
    });
  }
}