import {
  HttpInterceptorFn,
} from '@angular/common/http';

import { inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { TokenStorageService } from '../../features/auth/services/token-storage.service';


export const authInterceptor: HttpInterceptorFn = (
  request,
  next,
) => {
  const storage = inject(TokenStorageService);
  const accessToken = storage.getAccessToken();

  const isBackendRequest =
    request.url.startsWith(environment.apiUrl);

  if (!accessToken || !isBackendRequest) {
    return next(request);
  }

  const authenticatedRequest = request.clone({
    setHeaders: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return next(authenticatedRequest);
};