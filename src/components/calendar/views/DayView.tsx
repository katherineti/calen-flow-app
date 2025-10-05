import { useCalendar } from '@/contexts/CalendarContext';
import { format, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { CalendarEvent } from '@/types/calendar';

export const DayView = () => {
  const { currentDate, events, calendars } = useCalendar();

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventsForHour = (hour: number): CalendarEvent[] => {
    const enabledCalendarIds = calendars.filter((c) => c.enabled).map((c) => c.id);
    return events.filter((event) => {
      if (!enabledCalendarIds.includes(event.calendarId)) return false;
      if (!isSameDay(event.start, currentDate)) return false;

      const eventHour = event.start.getHours();
      return eventHour === hour;
    });
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="flex border-b">
          <div className="w-20 text-xs text-right pr-2 py-2 text-muted-foreground">GMT-04</div>
          <div className="flex-1 text-center border-l py-2">
            <div className="text-xs text-muted-foreground uppercase">
              {format(currentDate, 'EEEE', { locale: es })}
            </div>
            <div className="text-4xl font-normal">
              {format(currentDate, 'd')}
            </div>
          </div>
        </div>
      </div>

      {/* Time grid */}
      <div className="flex-1">
        {hours.map((hour) => {
          const hourEvents = getEventsForHour(hour);
          return (
            <div key={hour} className="flex border-b" style={{ minHeight: '60px' }}>
              <div className="w-20 text-xs text-right pr-2 pt-1 text-muted-foreground">
                {format(new Date().setHours(hour, 0), 'h a', { locale: es }).toUpperCase()}
              </div>
              <div className="flex-1 border-l relative p-2">
                {hourEvents.map((event) => (
                  <div
                    key={event.id}
                    className={cn(
                      'text-sm px-3 py-2 rounded mb-2 cursor-pointer',
                      `bg-calendar-event-${event.color}/80 text-white`,
                      `border-l-4 border-calendar-event-${event.color}`
                    )}
                    title={event.title}
                  >
                    <div className="font-medium">{event.title}</div>
                    <div className="text-xs opacity-90">
                      {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
