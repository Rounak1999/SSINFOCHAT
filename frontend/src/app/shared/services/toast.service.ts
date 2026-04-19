import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: number;
  tone: 'success' | 'danger' | 'info';
  text: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 1;
  readonly messages = signal<ToastMessage[]>([]);

  show(text: string, tone: ToastMessage['tone'] = 'info'): void {
    const id = this.nextId++;
    this.messages.update((value) => [...value, { id, text, tone }]);
    window.setTimeout(() => this.dismiss(id), 3500);
  }

  dismiss(id: number): void {
    this.messages.update((value) => value.filter((message) => message.id !== id));
  }
}
