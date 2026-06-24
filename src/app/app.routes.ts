import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./core/layouts/main-layout/main-layout').then(
        (m) => m.MainLayout,
      ),
    children: [
      {
        path: '',
        redirectTo: 'courses',
        pathMatch: 'full',
      },
      {
        path: 'courses',
        loadChildren: () =>
          import('./features/courses/course.routes').then(
            (m) => m.COURSES_ROUTES,
          ),
          canActivate: [authGuard]
      },
    ],
  },
  {
    path: 'auth',
    loadComponent: () =>
      import('./core/layouts/auth-layout/auth-layout').then(
        (m) => m.AuthLayout,
      ),
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./features/auth/auth.routes').then(
            (m) => m.authRoutes,
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'products',
  },
];