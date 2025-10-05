export type CalendarView = 'month' | 'week' | 'day' | 'year' | 'agenda';

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color: 'blue' | 'green' | 'red' | 'purple' | 'orange';
  calendarId: string;
  allDay?: boolean;
}

export interface Calendar {
  id: string;
  name: string;
  color: 'blue' | 'green' | 'red' | 'purple' | 'orange';
  enabled: boolean;
}
