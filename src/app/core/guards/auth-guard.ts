import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenStorageService } from '../../features/auth/services/token-storage.service';

export const authGuard: CanActivateFn = (
  _route,
  state,
) => {
  const storage = inject(TokenStorageService);
  const router = inject(Router);

  if (storage.getAccessToken()) {
    return true;
  }

  return router.createUrlTree(
    ['/auth/login'],
    {
      queryParams: {
        returnUrl: state.url,
      },
    },
  );
};