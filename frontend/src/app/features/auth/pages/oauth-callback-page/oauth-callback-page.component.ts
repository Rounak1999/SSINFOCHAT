import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-oauth-callback-page',
  imports: [CommonModule, RouterLink],
  templateUrl: './oauth-callback-page.component.html'
})
export class OAuthCallbackPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);

  protected error = '';

  constructor() {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.error = 'Authentication token missing from callback.';
      return;
    }

    this.authService.completeGoogleLogin(token).catch(() => {
      this.error = 'Unable to finish sign-in. Please try again.';
    });
  }
}
