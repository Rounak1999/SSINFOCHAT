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

    const session = await firstValueFrom(
      this.http.get<CometChatSession>(`${environment.apiBaseUrl}/auth/chat-token`)
    );

    const settings = new UIKitSettingsBuilder()
      .setAppId(session.appId)
      .setRegion(session.region)
      .setAutoEstablishSocketConnection(true)
      .subscribePresenceForAllUsers()
      .build();

    await CometChatUIKit.init(settings);
    await CometChatUIKit.login({
      uid: session.uid,
      authToken: session.authToken
    });

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
