import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';

import {
  LoadingService,
} from '../../../core/services/loading.service';

@Component({
  selector: 'app-global-spinner',
  templateUrl: './global-spinner.html',
  styleUrl: './global-spinner.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalSpinner {
  protected readonly isLoading =
    inject(LoadingService).isLoading;
}