import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialog {
  title = input<string>('Are you sure?');

  message = input<string>('This action cannot be undone.');

  warningMessage = input<string>('');

  confirmText = input<string>('Confirm');

  cancelText = input<string>('Cancel');

  loading = input<boolean>(false);

  danger = input<boolean>(true);

  confirmed = output<void>();

  cancelled = output<void>();

  protected onConfirm(): void {
    if (this.loading()) {
      return;
    }

    this.confirmed.emit();
  }

  protected onCancel(): void {
    if (this.loading()) {
      return;
    }

    this.cancelled.emit();
  }

  protected stopPropagation(event: MouseEvent): void {
    event.stopPropagation();
  }
}