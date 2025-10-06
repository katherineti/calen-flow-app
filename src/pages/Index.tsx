import { useState } from 'react';
import { CalendarProvider } from '@/contexts/CalendarContext';
import { CalendarHeader } from '@/components/calendar/CalendarHeader';
import { CalendarSidebar } from '@/components/calendar/CalendarSidebar';
import { CalendarMain } from '@/components/calendar/CalendarMain';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent } from '@/components/ui/sheet';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <CalendarProvider>
      <div className="flex flex-col h-screen w-full overflow-hidden">
        <CalendarHeader 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />
        
        <div className="flex flex-1 overflow-hidden">
          {/* Desktop sidebar */}
          <div
            className={cn(
              'hidden lg:block transition-all duration-300 ease-in-out overflow-hidden',
              sidebarOpen ? 'w-64' : 'w-0'
            )}
          >
            {sidebarOpen && <CalendarSidebar />}
          </div>

          {/* Mobile drawer */}
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetContent side="left" className="w-64 p-0 lg:hidden">
              <CalendarSidebar onClose={() => setSidebarOpen(false)} />
            </SheetContent>
          </Sheet>
          
          <CalendarMain />
        </div>
      </div>
    </CalendarProvider>
  );
};

export default Index;
