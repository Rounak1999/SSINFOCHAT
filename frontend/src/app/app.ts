import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './features/auth/auth.service';
import { LoaderComponent } from './shared/ui/loader/loader.component';
import { ToastContainerComponent } from './shared/ui/toast-container/toast-container.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LoaderComponent, ToastContainerComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly authService = inject(AuthService);

  protected readonly user = this.authService.currentUser;
  protected readonly isAuthenticated = computed(() => this.authService.hasToken());

  constructor() {
    this.authService.bootstrap();
  }

  protected logout(): void {
    this.authService.logout();
  }
}
