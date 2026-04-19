import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateCalendarEventPayload } from '../../shared/models/calendar.models';

@Injectable({ providedIn: 'root' })
export class CalendarService {
  private readonly http = inject(HttpClient);

  createEvent(payload: CreateCalendarEventPayload): Promise<unknown> {
    return firstValueFrom(
      this.http.post(`${environment.apiBaseUrl}/calendar/create-event`, payload)
    );
  }
}
