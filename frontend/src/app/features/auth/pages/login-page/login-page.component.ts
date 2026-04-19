import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login-page',
  imports: [CommonModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  private readonly authService = inject(AuthService);

  protected login(): void {
    this.authService.loginWithGoogle();
  }
}
