import {
    HttpErrorResponse,
    HttpInterceptorFn,
} from '@angular/common/http';

import {
    SKIP_GLOBAL_ERROR_TOAST,
} from '../tokens/http-context.tokens';

import {
    inject,
} from '@angular/core';

import {
    Router,
} from '@angular/router';

import {
    catchError,
    throwError,
} from 'rxjs';

import {
    TokenStorageService,
} from '../../features/auth/services/token-storage.service';

import {
    ToastService,
} from '../services/toast.service';

export const errorInterceptor:
    HttpInterceptorFn = (
        request,
        next,
    ) => {
        const toastService =
            inject(ToastService);

        const tokenStorage =
            inject(TokenStorageService);

        const router =
            inject(Router);

        return next(request).pipe(
            catchError(
                (
                    error: HttpErrorResponse,
                ) => {
                    const isLoginRequest =
                        request.url.includes(
                            '/auth/login',
                        );

                    const isRegisterRequest =
                        request.url.includes(
                            '/auth/register',
                        );

                    const isPublicAuthRequest =
                        isLoginRequest ||
                        isRegisterRequest;

                    const shouldSkipToast =
                        request.context.get(
                            SKIP_GLOBAL_ERROR_TOAST,
                        );

                    if (shouldSkipToast) {
                        return throwError(
                            () => error,
                        );
                    }

                    switch (error.status) {
                        case 0:
                            toastService.error(
                                'Unable to connect to the server. Check your internet connection and try again.',
                            );
                            break;

                        case 400:
                            toastService.error(
                                getBackendMessage(
                                    error,
                                    'The submitted data is invalid.',
                                ),
                            );
                            break;

                        case 401:
                            if (isPublicAuthRequest) {
                                toastService.error(
                                    getBackendMessage(
                                        error,
                                        'Invalid email or password.',
                                    ),
                                );

                                break;
                            }

                            tokenStorage.clear();

                            toastService.error(
                                'Your session has expired. Please log in again.',
                            );

                            void router.navigate(
                                ['/auth/login'],
                                {
                                    queryParams: {
                                        returnUrl:
                                            router.url,
                                    },
                                },
                            );

                            break;

                        case 403:
                            toastService.error(
                                'You do not have permission to perform this action.',
                            );
                            break;

                        case 404:
                            toastService.error(
                                getBackendMessage(
                                    error,
                                    'The requested resource was not found.',
                                ),
                            );
                            break;

                        case 409:
                            toastService.error(
                                getBackendMessage(
                                    error,
                                    'The request conflicts with existing data.',
                                ),
                            );
                            break;

                        case 422:
                            toastService.error(
                                getBackendMessage(
                                    error,
                                    'Some submitted values are invalid.',
                                ),
                            );
                            break;

                        case 500:
                            toastService.error(
                                'An internal server error occurred. Please try again later.',
                            );
                            break;

                        case 502:
                        case 503:
                        case 504:
                            toastService.error(
                                'The service is temporarily unavailable. Please try again shortly.',
                            );
                            break;

                        default:
                            toastService.error(
                                getBackendMessage(
                                    error,
                                    'Something went wrong. Please try again.',
                                ),
                            );
                    }

                    return throwError(
                        () => error,
                    );
                },
            ),
        );
    };

function getBackendMessage(
    error: HttpErrorResponse,
    fallbackMessage: string,
): string {
    const responseBody =
        error.error as unknown;

    if (
        typeof responseBody ===
        'string'
    ) {
        return (
            responseBody.trim() ||
            fallbackMessage
        );
    }

    if (
        !responseBody ||
        typeof responseBody !==
        'object'
    ) {
        return fallbackMessage;
    }

    if (
        'message' in responseBody &&
        typeof responseBody.message ===
        'string'
    ) {
        return (
            responseBody.message.trim() ||
            fallbackMessage
        );
    }

    return fallbackMessage;
}