import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CalendarService } from '../../calendar.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-calendar-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './calendar-page.component.html',
  styleUrl: './calendar-page.component.scss'
})
export class CalendarPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly calendarService = inject(CalendarService);
  private readonly toastService = inject(ToastService);

  protected readonly form = this.fb.group({
    title: ['', Validators.required],
    dateTime: ['', Validators.required]
  });

  protected async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dateTime = new Date(this.form.value.dateTime as string);
    const endDateTime = new Date(dateTime.getTime() + 60 * 60 * 1000);

    await this.calendarService.createEvent({
      title: this.form.value.title as string,
      startDateTime: dateTime.toISOString(),
      endDateTime: endDateTime.toISOString()
    });

    this.toastService.show('Calendar event created successfully.', 'success');
    this.form.reset();
  }
}
