import { useCalendar } from '@/contexts/CalendarContext';
import { MonthView } from './views/MonthView';
import { WeekView } from './views/WeekView';
import { DayView } from './views/DayView';
import { YearView } from './views/YearView';

export const CalendarMain = () => {
  const { view } = useCalendar();

  const renderView = () => {
    switch (view) {
      case 'month':
        return <MonthView />;
      case 'week':
        return <WeekView />;
      case 'day':
        return <DayView />;
      case 'year':
        return <YearView />;
      case 'agenda':
        return <MonthView />; // For now, show month view
      default:
        return <MonthView />;
    }
  };

  return <div className="flex-1 overflow-hidden">{renderView()}</div>;
};
