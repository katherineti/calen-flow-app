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
  sidebarOpen: boolean;
}

export const CalendarHeader = ({ onMenuClick, sidebarOpen }: CalendarHeaderProps) => {
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
    <header className="flex items-center justify-between px-2 sm:px-4 py-2 sm:py-3 border-b bg-background">
      <div className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0">
        <Button variant="ghost" size="icon" onClick={onMenuClick} className="shrink-0">
          <Menu className="h-5 w-5" />
        </Button>
        
        {/* Logo - hidden on small screens */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded flex items-center justify-center">
              <span className="text-white text-base sm:text-lg font-semibold">C</span>
            </div>
            <span className="text-lg sm:text-xl font-normal text-muted-foreground ml-1">Calendario</span>
          </div>
        </div>

        <Button 
          variant="outline" 
          onClick={handleToday} 
          className="ml-1 sm:ml-2 shrink-0 text-xs sm:text-sm px-2 sm:px-4"
          size="sm"
        >
          Hoy
        </Button>

        <div className="flex items-center gap-0 shrink-0">
          <Button variant="ghost" size="icon" onClick={handlePrevious} className="h-8 w-8">
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleNext} className="h-8 w-8">
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>

        <h1 className="text-sm sm:text-lg md:text-xl font-normal capitalize truncate min-w-0">
          {getDateTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {/* Hide search and settings on mobile */}
        <Button variant="ghost" size="icon" className="hidden sm:flex h-8 w-8 sm:h-10 sm:w-10">
          <Search className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
        
        <Button variant="ghost" size="icon" className="hidden sm:flex h-8 w-8 sm:h-10 sm:w-10">
          <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4" size="sm">
              <span className="hidden sm:inline">{viewLabels[view]}</span>
              <span className="sm:hidden">{viewLabels[view].charAt(0)}</span>
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 rotate-90" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32 sm:w-40 bg-background z-50">
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

        {/* Profile icon - hidden on small screens */}
        <div className="hidden sm:flex w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary text-primary-foreground items-center justify-center font-medium cursor-pointer text-xs sm:text-sm">
          K
        </div>
      </div>
    </header>
  );
};
