import {
  computed,
  inject,
  Injectable,
  signal,
} from '@angular/core';

import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

import {
  AuthResponse,
  AuthUser,
  LoginRequest
} from '../models/auth.models';

import { AuthApiService } from './auth-api.service';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly api = inject(AuthApiService);
  private readonly storage = inject(TokenStorageService);
  private readonly router = inject(Router);

  private readonly currentUserState =
    signal<AuthUser | null>(null);

  private readonly accessTokenState =
    signal<string | null>(
      this.storage.getAccessToken(),
    );

  readonly currentUser =
    this.currentUserState.asReadonly();

  readonly isAuthenticated = computed(
    () => this.accessTokenState() !== null,
  );

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.api.login(request).pipe(
      tap((response) => {
        this.saveSession(response);
      }),
    );
  }

  logout(): void {
    this.storage.clear();
    this.accessTokenState.set(null);
    this.currentUserState.set(null);

    void this.router.navigateByUrl('/auth/login');
  }

  private saveSession(response: AuthResponse): void {
    this.storage.setAccessToken(response.accessToken);
    this.accessTokenState.set(response.accessToken);
    this.currentUserState.set(response.user);
  }
}