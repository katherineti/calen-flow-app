import { useCalendar } from '@/contexts/CalendarContext';
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameDay,
  isToday,
  addHours,
  isSameHour,
  isWithinInterval,
} from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { CalendarEvent } from '@/types/calendar';

export const WeekView = () => {
  const { currentDate, events, calendars } = useCalendar();

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventsForDayAndHour = (day: Date, hour: number): CalendarEvent[] => {
    const enabledCalendarIds = calendars.filter((c) => c.enabled).map((c) => c.id);
    return events.filter((event) => {
      if (!enabledCalendarIds.includes(event.calendarId)) return false;
      if (!isSameDay(event.start, day)) return false;

      const eventHour = event.start.getHours();
      return eventHour === hour;
    });
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      {/* Header with days */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="grid grid-cols-8 border-b min-w-[640px]">
          <div className="text-[10px] sm:text-xs text-right pr-1 sm:pr-2 py-2 text-muted-foreground">GMT-04</div>
          {days.map((day) => {
            const isTodayDate = isToday(day);
            return (
              <div key={day.toString()} className="text-center border-l py-1 sm:py-2">
                <div className="text-[10px] sm:text-xs text-muted-foreground uppercase">
                  {format(day, 'EEE', { locale: es })}
                </div>
                <div
                  className={cn(
                    'text-lg sm:text-2xl font-normal inline-flex w-8 h-8 sm:w-12 sm:h-12 items-center justify-center rounded-full',
                    isTodayDate && 'bg-calendar-today text-white'
                  )}
                >
                  {format(day, 'd')}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Time grid - scrollable horizontally on mobile */}
      <div className="flex-1 overflow-auto">
        <div className="min-w-[640px]">
          {hours.map((hour) => (
            <div key={hour} className="grid grid-cols-8 border-b" style={{ minHeight: '48px' }}>
              <div className="text-[10px] sm:text-xs text-right pr-1 sm:pr-2 pt-1 text-muted-foreground">
                {format(new Date().setHours(hour, 0), 'h a', { locale: es }).toUpperCase()}
              </div>
              {days.map((day) => {
                const dayEvents = getEventsForDayAndHour(day, hour);
                return (
                  <div key={day.toString() + hour} className="border-l relative p-1">
                    {dayEvents.map((event) => (
                      <div
                        key={event.id}
                        className={cn(
                          'text-[10px] sm:text-xs px-1 sm:px-2 py-1 rounded mb-1 cursor-pointer touch-manipulation active:opacity-80',
                          `bg-calendar-event-${event.color}/80 text-white`,
                          `border-l-2 sm:border-l-4 border-calendar-event-${event.color}`
                        )}
                        title={event.title}
                      >
                        <div className="font-medium truncate">{event.title}</div>
                        <div className="text-[9px] sm:text-[10px] opacity-90">
                          {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
