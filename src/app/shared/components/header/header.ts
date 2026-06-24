import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private readonly authService = inject(AuthService);
    
  protected readonly isMenuOpen = signal(false);
  protected readonly isAuthenticated = this.authService.isAuthenticated;

  protected toggleMenu(): void {
    this.isMenuOpen.update((currentValue) => !currentValue);
  }

  protected closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  protected logout(): void {
    this.authService.logout();
    this.closeMenu();
  }
}