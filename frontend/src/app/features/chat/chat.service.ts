import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { CometChatUsersWithMessages, CometChatUIKit } from '@cometchat/chat-uikit-angular';
import { UIKitSettingsBuilder } from '@cometchat/uikit-shared';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ChatMetadataMessage, CometChatSession } from '../../shared/models/chat.models';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly http = inject(HttpClient);
  private initialized = false;

  readonly metadataHistory = signal<ChatMetadataMessage[]>([]);
  readonly selectedPeerId = signal<number | null>(null);
  readonly chatModule = CometChatUsersWithMessages;

  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    console.log('[CometChat] Fetching session...');
    const session = await firstValueFrom(
      this.http.get<CometChatSession>(`${environment.apiBaseUrl}/auth/chat-token`)
    );
    console.log('[CometChat] Session received, appId:', session.appId, 'uid:', session.uid);

    const settings = new UIKitSettingsBuilder()
      .setAppId(session.appId)
      .setRegion(session.region)
      .setAuthKey(session.authKey)
      .setAutoEstablishSocketConnection(true)
      .subscribePresenceForAllUsers()
      .build();

    console.log('[CometChat] Initializing UIKit...');
    await CometChatUIKit.init(settings);
    console.log('[CometChat] UIKit initialized, logging in...');
    await CometChatUIKit.login({
      uid: session.uid,
      authToken: session.authToken
    });
    console.log('[CometChat] Logged in successfully');

    this.initialized = true;
  }

  async selectPeer(peerId: number): Promise<void> {
    this.selectedPeerId.set(peerId);

    const messages = await firstValueFrom(
      this.http.get<ChatMetadataMessage[]>(`${environment.apiBaseUrl}/chat/history`, {
        params: { peerId }
      })
    );

    this.metadataHistory.set(messages);
  }

  async storeMetadataMessage(receiverId: number, message: string): Promise<void> {
    await firstValueFrom(
      this.http.post(`${environment.apiBaseUrl}/chat/send`, {
        receiverId,
        message
      })
    );

    await this.selectPeer(receiverId);
  }
}
