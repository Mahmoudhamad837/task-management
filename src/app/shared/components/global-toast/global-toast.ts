import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';

import {
  ToastService,
} from '../../../core/services/toast.service';

@Component({
  selector: 'app-global-toast',
  templateUrl: './global-toast.html',
  styleUrl: './global-toast.css',
  changeDetection:
    ChangeDetectionStrategy.OnPush,
})
export class GlobalToast {
  private readonly toastService =
    inject(ToastService);

  protected readonly toast =
    this.toastService.toast;

  protected dismiss(): void {
    this.toastService.dismiss();
  }
}