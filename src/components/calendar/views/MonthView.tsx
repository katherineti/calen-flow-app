import { useCalendar } from '@/contexts/CalendarContext';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { CalendarEvent } from '@/types/calendar';

export const MonthView = () => {
  const { currentDate, events, calendars } = useCalendar();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekDays = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];

  const getEventsForDay = (day: Date): CalendarEvent[] => {
    const enabledCalendarIds = calendars.filter((c) => c.enabled).map((c) => c.id);
    return events.filter(
      (event) =>
        enabledCalendarIds.includes(event.calendarId) &&
        isSameDay(event.start, day)
    );
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Week days header */}
      <div className="grid grid-cols-7 border-b">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-muted-foreground py-2 border-r last:border-r-0"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="flex-1 grid grid-cols-7 auto-rows-fr">
        {days.map((day, index) => {
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isTodayDate = isToday(day);
          const dayEvents = getEventsForDay(day);
          const isWeekend = day.getDay() === 0 || day.getDay() === 6;

          return (
            <div
              key={day.toString()}
              className={cn(
                'border-r border-b last:border-r-0 p-2 min-h-[120px] overflow-hidden',
                !isCurrentMonth && 'bg-muted/30 text-muted-foreground',
                isWeekend && isCurrentMonth && 'bg-calendar-weekend'
              )}
            >
              <div className="flex items-center justify-center mb-1">
                <span
                  className={cn(
                    'text-sm font-normal w-7 h-7 flex items-center justify-center rounded-full',
                    isTodayDate && 'bg-calendar-today text-white font-medium'
                  )}
                >
                  {format(day, 'd')}
                </span>
              </div>

              <div className="space-y-1">
                {dayEvents.map((event) => (
                  <div
                    key={event.id}
                    className={cn(
                      'text-xs px-2 py-1 rounded truncate cursor-pointer',
                      `bg-calendar-event-${event.color}/20 text-calendar-event-${event.color}`,
                      `border-l-4 border-calendar-event-${event.color}`
                    )}
                    title={event.title}
                  >
                    {event.title}
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
