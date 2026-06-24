import {
  Injectable,
  signal,
} from '@angular/core';

export type ToastType =
  | 'error'
  | 'success'
  | 'info';

export interface ToastMessage {
  type: ToastType;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly toastState =
    signal<ToastMessage | null>(null);

  private timeoutId?: ReturnType<
    typeof setTimeout
  >;

  readonly toast =
    this.toastState.asReadonly();

  show(
    message: string,
    type: ToastType = 'info',
    duration = 4000,
  ): void {
    this.clearTimer();

    this.toastState.set({
      type,
      message,
    });

    this.timeoutId = setTimeout(
      () => {
        this.dismiss();
      },
      duration,
    );
  }

  error(
    message: string,
    duration = 4500,
  ): void {
    this.show(
      message,
      'error',
      duration,
    );
  }

  success(
    message: string,
    duration = 3500,
  ): void {
    this.show(
      message,
      'success',
      duration,
    );
  }

  info(
    message: string,
    duration = 3500,
  ): void {
    this.show(
      message,
      'info',
      duration,
    );
  }

  dismiss(): void {
    this.clearTimer();
    this.toastState.set(null);
  }

  private clearTimer(): void {
    if (!this.timeoutId) {
      return;
    }

    clearTimeout(this.timeoutId);
    this.timeoutId = undefined;
  }
}