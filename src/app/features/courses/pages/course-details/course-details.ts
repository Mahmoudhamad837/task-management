import { CurrencyPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, EMPTY, map, switchMap, tap } from 'rxjs';
import {CoursesApiService} from '../../services/courses-api.service';
import {Course} from '../../models/course.model';
import {Button} from '../../../../shared/components/button/button';

@Component({
  selector: 'app-course-details',
  imports: [
    RouterLink,
    CurrencyPipe,
    Button,
  ],
  templateUrl: './course-details.html',
  styleUrl: './course-details.css',
})
export class CourseDetails implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly coursesApi = inject(CoursesApiService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly course = signal<Course | null>(null);
  protected readonly quantity = signal(1);
  protected readonly errorMessage = signal<string | null>(null);


  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map((params) => params.get('id')),

        tap(() => {
          this.errorMessage.set(null);
          this.course.set(null);
          this.quantity.set(1);
        }),

        switchMap((id) => {
          if (!id) {
            this.errorMessage.set(
              'Course ID is missing.',
            );

            return EMPTY;
          }

          return this.coursesApi
            .getCourseById(id)
            .pipe(
              tap((course) => {
                this.course.set(course);
              }),

              catchError((error: unknown) => {
                console.error(
                  'Failed to load course:',
                  error,
                );

                this.errorMessage.set(
                  'Unable to load this course. It may not exist.',
                );

                return EMPTY;
              })
            );
        }),

        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
}