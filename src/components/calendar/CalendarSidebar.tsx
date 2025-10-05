import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useCalendar } from '@/contexts/CalendarContext';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, isToday } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export const CalendarSidebar = () => {
  const { currentDate, setCurrentDate, calendars, toggleCalendar } = useCalendar();
  const [miniCalendarDate, setMiniCalendarDate] = useState(currentDate);

  const monthStart = startOfMonth(miniCalendarDate);
  const monthEnd = endOfMonth(miniCalendarDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const firstDayOfWeek = monthStart.getDay();
  const emptyDays = Array(firstDayOfWeek).fill(null);

  const handlePrevMonth = () => {
    const newDate = new Date(miniCalendarDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setMiniCalendarDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(miniCalendarDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setMiniCalendarDate(newDate);
  };

  const handleDayClick = (day: Date) => {
    setCurrentDate(day);
  };

  const weekDays = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];

  return (
    <aside className="w-64 border-r bg-background flex flex-col h-full">
      <div className="p-4">
        <Button className="w-full justify-start gap-2 shadow-md" size="lg">
          <Plus className="h-5 w-5" />
          Crear
        </Button>
      </div>

      {/* Mini Calendar */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium capitalize">
            {format(miniCalendarDate, 'MMMM yyyy', { locale: es })}
          </span>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handlePrevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {weekDays.map((day) => (
            <div key={day} className="text-xs text-muted-foreground font-medium py-1">
              {day}
            </div>
          ))}
          {emptyDays.map((_, index) => (
            <div key={`empty-${index}`} className="aspect-square" />
          ))}
          {days.map((day) => {
            const isCurrentDay = isSameDay(day, currentDate);
            const isCurrentMonth = isSameMonth(day, miniCalendarDate);
            const isTodayDate = isToday(day);

            return (
              <button
                key={day.toString()}
                onClick={() => handleDayClick(day)}
                className={cn(
                  'aspect-square text-sm rounded-full hover:bg-accent transition-colors',
                  !isCurrentMonth && 'text-muted-foreground',
                  isTodayDate && 'bg-calendar-today text-white font-medium hover:bg-calendar-today/90',
                  isCurrentDay && !isTodayDate && 'bg-accent',
                )}
              >
                {format(day, 'd')}
              </button>
            );
          })}
        </div>
      </div>

      {/* Calendars List */}
      <div className="flex-1 overflow-y-auto px-4">
        <h3 className="text-sm font-semibold mb-2">Mis calendarios</h3>
        <div className="space-y-2">
          {calendars.map((calendar) => (
            <div key={calendar.id} className="flex items-center gap-2">
              <Checkbox
                id={calendar.id}
                checked={calendar.enabled}
                onCheckedChange={() => toggleCalendar(calendar.id)}
                className={cn(
                  'data-[state=checked]:bg-calendar-event-' + calendar.color,
                  'data-[state=checked]:border-calendar-event-' + calendar.color
                )}
              />
              <label
                htmlFor={calendar.id}
                className="text-sm font-normal cursor-pointer flex-1"
              >
                {calendar.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 border-t">
        <Button variant="ghost" className="w-full justify-start text-sm">
          Más estadísticas
        </Button>
      </div>
    </aside>
  );
};
