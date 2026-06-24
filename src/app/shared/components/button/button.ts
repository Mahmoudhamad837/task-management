import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'danger'
  | 'ghost';

export type ButtonSize =
  | 'small'
  | 'medium'
  | 'large';

export type NativeButtonType =
  | 'button'
  | 'submit'
  | 'reset';

@Component({
  selector: 'app-button',
  templateUrl: './button.html',
  styleUrl: './button.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Button {
  readonly type = input<NativeButtonType>('button');
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('medium');
  readonly ariaLabel = input<string | null>(null);
  readonly disabled = input(false, {
    transform: booleanAttribute,
  });
  readonly loading = input(false, {
    transform: booleanAttribute,
  });

  readonly fullWidth = input(false, {
    transform: booleanAttribute,
  });

  readonly buttonClick = output<MouseEvent>();

  protected handleClick(event: MouseEvent): void {
    if (this.disabled() || this.loading()) {
      event.preventDefault();
      return;
    }

    this.buttonClick.emit(event);
  }
}