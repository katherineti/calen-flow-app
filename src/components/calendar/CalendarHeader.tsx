import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCalendar } from '@/contexts/CalendarContext';
import { CalendarView } from '@/types/calendar';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Settings,
  Grid3x3,
  Plus,
  Menu,
} from 'lucide-react';
import { format, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays, addYears, subYears } from 'date-fns';
import { es } from 'date-fns/locale';

interface CalendarHeaderProps {
  onMenuClick: () => void;
}

export const CalendarHeader = ({ onMenuClick }: CalendarHeaderProps) => {
  const { currentDate, setCurrentDate, view, setView } = useCalendar();

  const handlePrevious = () => {
    switch (view) {
      case 'month':
        setCurrentDate(subMonths(currentDate, 1));
        break;
      case 'week':
        setCurrentDate(subWeeks(currentDate, 1));
        break;
      case 'day':
        setCurrentDate(subDays(currentDate, 1));
        break;
      case 'year':
        setCurrentDate(subYears(currentDate, 1));
        break;
    }
  };

  const handleNext = () => {
    switch (view) {
      case 'month':
        setCurrentDate(addMonths(currentDate, 1));
        break;
      case 'week':
        setCurrentDate(addWeeks(currentDate, 1));
        break;
      case 'day':
        setCurrentDate(addDays(currentDate, 1));
        break;
      case 'year':
        setCurrentDate(addYears(currentDate, 1));
        break;
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date(2025, 9, 5)); // October 5, 2025
  };

  const getDateTitle = () => {
    switch (view) {
      case 'month':
        return format(currentDate, 'MMMM yyyy', { locale: es });
      case 'week':
        return format(currentDate, 'MMMM yyyy', { locale: es });
      case 'day':
        return format(currentDate, 'd MMMM yyyy', { locale: es });
      case 'year':
        return format(currentDate, 'yyyy', { locale: es });
      default:
        return format(currentDate, 'MMMM yyyy', { locale: es });
    }
  };

  const viewLabels: Record<CalendarView, string> = {
    day: 'Día',
    week: 'Semana',
    month: 'Mes',
    year: 'Año',
    agenda: 'Agenda',
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b bg-background">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-10 h-10 bg-primary rounded flex items-center justify-center">
              <span className="text-white text-lg font-semibold">C</span>
            </div>
            <span className="text-xl font-normal text-muted-foreground ml-1">Calendario</span>
          </div>
        </div>

        <Button variant="outline" onClick={handleToday} className="ml-4">
          Hoy
        </Button>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={handlePrevious}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleNext}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        <h1 className="text-xl font-normal capitalize">{getDateTitle()}</h1>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Search className="h-5 w-5" />
        </Button>
        
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              {viewLabels[view]}
              <ChevronRight className="h-4 w-4 rotate-90" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => setView('day')}>
              Día <span className="ml-auto text-xs text-muted-foreground">D</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setView('week')}>
              Semana <span className="ml-auto text-xs text-muted-foreground">W</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setView('month')}>
              Mes <span className="ml-auto text-xs text-muted-foreground">M</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setView('year')}>
              Año <span className="ml-auto text-xs text-muted-foreground">Y</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setView('agenda')}>
              Agenda <span className="ml-auto text-xs text-muted-foreground">A</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon">
          <Grid3x3 className="h-5 w-5" />
        </Button>

        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium cursor-pointer">
          K
        </div>
      </div>
    </header>
  );
};
