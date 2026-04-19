import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthMeResponse, DirectoryUser } from '../../shared/models/auth.models';
import { StorageService } from '../../shared/services/storage.service';

const TOKEN_KEY = 'ssinfochat.token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly storage = inject(StorageService);

  private readonly tokenState = signal<string | null>(this.storage.get(TOKEN_KEY));
  private readonly currentUserState = signal<AuthMeResponse['user'] | null>(null);
  private readonly directoryState = signal<DirectoryUser[]>([]);

  readonly currentUser = computed(() => this.currentUserState());
  readonly directoryUsers = computed(() => this.directoryState());

  bootstrap(): void {
    if (this.hasToken() && !this.currentUserState()) {
      this.loadProfile().catch(() => this.clearSession());
    }
  }

  token(): string | null {
    return this.tokenState();
  }

  hasToken(): boolean {
    return !!this.tokenState();
  }

  loginWithGoogle(): void {
    window.location.assign(`${environment.apiBaseUrl}/auth/google`);
  }

  async completeGoogleLogin(token: string): Promise<void> {
    this.storage.set(TOKEN_KEY, token);
    this.tokenState.set(token);
    await this.loadProfile();
    await this.router.navigateByUrl('/chat');
  }

  async loadProfile(): Promise<void> {
    const response = await firstValueFrom(
      this.http.get<AuthMeResponse>(`${environment.apiBaseUrl}/auth/me`)
    );

    this.currentUserState.set(response.user);
    this.directoryState.set(response.users);
  }

  async logout(): Promise<void> {
    try {
      await firstValueFrom(this.http.get(`${environment.apiBaseUrl}/auth/logout`));
    } catch {
      // Best effort logout is enough because the app uses stateless JWTs.
    }

    this.clearSession();
    await this.router.navigateByUrl('/login');
  }

  private clearSession(): void {
    this.storage.remove(TOKEN_KEY);
    this.tokenState.set(null);
    this.currentUserState.set(null);
    this.directoryState.set([]);
  }
}
