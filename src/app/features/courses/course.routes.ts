import { Routes } from '@angular/router';

export const COURSES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/course-list/course-list').then(
        (m) => m.CourseList,
      ),
  },
  {
    path: 'add',
    loadComponent: () =>
      import('./pages/course-form/course-form')
        .then((m) => m.CourseForm),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/course-details/course-details').then(
        (m) => m.CourseDetails,
      ),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./pages/course-form/course-form')
        .then((m) => m.CourseForm),
  },
];