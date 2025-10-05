import { useCalendar } from '@/contexts/CalendarContext';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday,
} from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export const YearView = () => {
  const { currentDate, setCurrentDate } = useCalendar();

  const year = currentDate.getFullYear();
  const months = Array.from({ length: 12 }, (_, i) => new Date(year, i, 1));

  const weekDays = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];

  const renderMonth = (monthDate: Date) => {
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    return (
      <div className="border rounded-lg p-3 bg-background">
        <h3 className="text-sm font-medium text-center mb-2 capitalize">
          {format(monthDate, 'MMMM', { locale: es })}
        </h3>

        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((day) => (
            <div key={day} className="text-[10px] text-center text-muted-foreground font-medium">
              {day}
            </div>
          ))}
          {days.map((day) => {
            const isCurrentMonth = isSameMonth(day, monthDate);
            const isTodayDate = isToday(day);

            return (
              <button
                key={day.toString()}
                onClick={() => setCurrentDate(day)}
                className={cn(
                  'aspect-square text-[11px] rounded-full hover:bg-accent transition-colors flex items-center justify-center',
                  !isCurrentMonth && 'text-muted-foreground',
                  isTodayDate && 'bg-calendar-today text-white font-medium hover:bg-calendar-today/90'
                )}
              >
                {format(day, 'd')}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 overflow-auto h-full bg-background">
      <div className="grid grid-cols-4 gap-4 max-w-6xl mx-auto">
        {months.map((month) => (
          <div key={month.toString()}>{renderMonth(month)}</div>
        ))}
      </div>
    </div>
  );
};
