import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GlobalSpinner } from './shared/components/global-spinner/global-spinner';
import { GlobalToast } from './shared/components/global-toast/global-toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, GlobalSpinner, GlobalToast],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Ecommerce');
}
