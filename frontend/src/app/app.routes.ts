import { Routes } from '@angular/router';
import { authGuard } from './features/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'chat'
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/login-page/login-page.component').then(
        (m) => m.LoginPageComponent
      )
  },
  {
    path: 'auth/callback',
    loadComponent: () =>
      import('./features/auth/pages/oauth-callback-page/oauth-callback-page.component').then(
        (m) => m.OAuthCallbackPageComponent
      )
  },
  {
    path: 'chat',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/chat/pages/chat-page/chat-page.component').then(
        (m) => m.ChatPageComponent
      )
  },
  {
    path: 'calendar',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/calendar/pages/calendar-page/calendar-page.component').then(
        (m) => m.CalendarPageComponent
      )
  },
  {
    path: '**',
    redirectTo: 'chat'
  }
];
