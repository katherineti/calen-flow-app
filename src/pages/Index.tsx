import { useState } from 'react';
import { CalendarProvider } from '@/contexts/CalendarContext';
import { CalendarHeader } from '@/components/calendar/CalendarHeader';
import { CalendarSidebar } from '@/components/calendar/CalendarSidebar';
import { CalendarMain } from '@/components/calendar/CalendarMain';
import { cn } from '@/lib/utils';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <CalendarProvider>
      <div className="flex flex-col h-screen w-full overflow-hidden">
        <CalendarHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <div className="flex flex-1 overflow-hidden">
          <div
            className={cn(
              'transition-all duration-300 ease-in-out overflow-hidden',
              sidebarOpen ? 'w-64' : 'w-0'
            )}
          >
            {sidebarOpen && <CalendarSidebar />}
          </div>
          
          <CalendarMain />
        </div>
      </div>
    </CalendarProvider>
  );
};

export default Index;
