import {
  computed,
  Injectable,
  signal,
} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private readonly activeRequests = signal(0);

  readonly isLoading = computed(
    () => this.activeRequests() > 0,
  );

  show(): void {
    this.activeRequests.update(
      (currentCount) => currentCount + 1,
    );
  }

  hide(): void {
    this.activeRequests.update(
      (currentCount) =>
        Math.max(currentCount - 1, 0),
    );
  }

  reset(): void {
    this.activeRequests.set(0);
  }
}