import { useState } from 'react';
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
import { EventDialog } from '../EventDialog';

export const MonthView = () => {
  const { currentDate, events, calendars, addEvent } = useCalendar();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewEvent, setPreviewEvent] = useState<{ date: Date; id: string } | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekDays = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];

  const getEventsForDay = (day: Date): CalendarEvent[] => {
    const enabledCalendarIds = calendars.filter((c) => c.enabled).map((c) => c.id);
    const dayEvents = events.filter(
      (event) =>
        enabledCalendarIds.includes(event.calendarId) &&
        isSameDay(event.start, day)
    );

    // Add preview event if exists for this day
    if (previewEvent && isSameDay(previewEvent.date, day)) {
      dayEvents.push({
        id: previewEvent.id,
        title: '(Sin título)',
        start: day,
        end: day,
        color: 'blue',
        calendarId: calendars[0]?.id || '1',
        allDay: true,
      });
    }

    return dayEvents;
  };

  const handleDayClick = (day: Date) => {
    if (!isSameMonth(day, currentDate)) return;
    
    const dayEvents = events.filter(event => isSameDay(event.start, day));
    if (dayEvents.length === 0) {
      // Show preview event
      const previewId = `preview-${Date.now()}`;
      setPreviewEvent({ date: day, id: previewId });
      setSelectedDate(day);
      setDialogOpen(true);
    }
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setPreviewEvent(null);
      setSelectedDate(null);
    }
  };

  const handleSaveEvent = (event: Omit<CalendarEvent, 'id'>) => {
    addEvent(event);
    setPreviewEvent(null);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Week days header */}
      <div className="grid grid-cols-7 border-b sticky top-0 bg-background z-10">
        {weekDays.map((day, index) => (
          <div
            key={day}
            className="text-center text-[10px] sm:text-xs font-medium text-muted-foreground py-2 sm:py-3 border-r last:border-r-0"
          >
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{['D', 'L', 'M', 'X', 'J', 'V', 'S'][index]}</span>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="flex-1 grid grid-cols-7 auto-rows-fr overflow-auto">
        {days.map((day, index) => {
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isTodayDate = isToday(day);
          const dayEvents = getEventsForDay(day);
          const isWeekend = day.getDay() === 0 || day.getDay() === 6;

          return (
            <div
              key={day.toString()}
              onClick={() => handleDayClick(day)}
              className={cn(
                'border-r border-b last:border-r-0 p-1 sm:p-2 min-h-[60px] sm:min-h-[100px] md:min-h-[120px] overflow-hidden cursor-pointer hover:bg-accent/50 transition-colors touch-manipulation active:bg-accent',
                !isCurrentMonth && 'bg-muted/30 text-muted-foreground',
                isWeekend && isCurrentMonth && 'bg-calendar-weekend'
              )}
            >
              <div className="flex items-center justify-center mb-0.5 sm:mb-1">
                <span
                  className={cn(
                    'text-xs sm:text-sm font-normal w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full',
                    isTodayDate && 'bg-calendar-today text-white font-medium'
                  )}
                >
                  {format(day, 'd')}
                </span>
              </div>

              <div className="space-y-0.5 sm:space-y-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className={cn(
                      'text-[10px] sm:text-xs px-1 sm:px-2 py-0.5 sm:py-1 rounded truncate cursor-pointer touch-manipulation active:opacity-80',
                      `bg-calendar-event-${event.color}/20 text-calendar-event-${event.color}`,
                      `border-l-2 sm:border-l-4 border-calendar-event-${event.color}`,
                      previewEvent?.id === event.id && 'opacity-60'
                    )}
                    title={event.title}
                    onClick={(e) => {
                      if (previewEvent?.id !== event.id) {
                        e.stopPropagation();
                      }
                    }}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-[10px] sm:text-xs text-muted-foreground px-1 sm:px-2">
                    +{dayEvents.length - 3} más
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <EventDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        selectedDate={selectedDate}
        onSave={handleSaveEvent}
        calendarId={calendars.find(c => c.enabled)?.id || '1'}
        calendars={calendars}
      />
    </div>
  );
};
