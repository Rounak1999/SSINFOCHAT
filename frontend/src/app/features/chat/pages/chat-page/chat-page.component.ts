import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CometChatUsersWithMessages } from '@cometchat/chat-uikit-angular';
import { AuthService } from '../../../auth/auth.service';
import { ChatService } from '../../chat.service';

@Component({
  selector: 'app-chat-page',
  imports: [CommonModule, FormsModule, CometChatUsersWithMessages],
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.scss'
})
export class ChatPageComponent {
  private readonly authService = inject(AuthService);
  protected readonly chatService = inject(ChatService);

  protected readonly users = this.authService.directoryUsers;
  protected readonly metadataHistory = this.chatService.metadataHistory;
  protected readonly selectedPeerId = this.chatService.selectedPeerId;
  protected draftMessage = '';
  protected chatReady = false;
  protected chatError = '';

  constructor() {
    this.chatService.initialize().then(() => {
      this.chatReady = true;
    }).catch((err) => {
      console.error('[CometChat] Init failed:', err);
      this.chatError = err?.message || 'CometChat failed to initialize';
    });
  }

  protected async selectUser(userId: number): Promise<void> {
    await this.chatService.selectPeer(userId);
  }

  protected async saveMetadataMessage(): Promise<void> {
    const receiverId = this.selectedPeerId();
    const message = this.draftMessage.trim();

    if (!receiverId || !message) {
      return;
    }

    await this.chatService.storeMetadataMessage(receiverId, message);
    this.draftMessage = '';
  }
}
