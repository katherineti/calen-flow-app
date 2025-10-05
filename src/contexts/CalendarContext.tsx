import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CalendarView, CalendarEvent, Calendar } from '@/types/calendar';
import { startOfMonth, endOfMonth, addDays } from 'date-fns';

interface CalendarContextType {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  view: CalendarView;
  setView: (view: CalendarView) => void;
  events: CalendarEvent[];
  calendars: Calendar[];
  toggleCalendar: (id: string) => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

const sampleCalendars: Calendar[] = [
  { id: '1', name: 'Personal', color: 'blue', enabled: true },
  { id: '2', name: 'Cumpleaños', color: 'green', enabled: true },
  { id: '3', name: 'Tareas', color: 'red', enabled: true },
];

const sampleEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Día de la Resistencia Indígena',
    start: new Date(2025, 9, 12),
    end: new Date(2025, 9, 13),
    color: 'green',
    calendarId: '1',
    allDay: true,
  },
  {
    id: '2',
    title: 'Día de la Raza',
    start: new Date(2025, 9, 13),
    end: new Date(2025, 9, 14),
    color: 'green',
    calendarId: '1',
    allDay: true,
  },
  {
    id: '3',
    title: 'Día del Dr. José Gregorio Hernández',
    start: new Date(2025, 9, 26),
    end: new Date(2025, 9, 27),
    color: 'green',
    calendarId: '1',
    allDay: true,
  },
  {
    id: '4',
    title: 'Halloween',
    start: new Date(2025, 9, 31),
    end: new Date(2025, 10, 1),
    color: 'green',
    calendarId: '2',
    allDay: true,
  },
  {
    id: '5',
    title: 'Día de Todos los Santos',
    start: new Date(2025, 10, 1),
    end: new Date(2025, 10, 2),
    color: 'green',
    calendarId: '1',
    allDay: true,
  },
  {
    id: '6',
    title: 'Reunión de equipo',
    start: new Date(2025, 9, 5, 14, 0),
    end: new Date(2025, 9, 5, 15, 0),
    color: 'blue',
    calendarId: '1',
  },
  {
    id: '7',
    title: 'Cancelled: 45-Minute 5',
    start: new Date(2025, 9, 8, 2, 0),
    end: new Date(2025, 9, 8, 2, 45),
    color: 'blue',
    calendarId: '1',
  },
];

export const CalendarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 9, 5)); // October 5, 2025
  const [view, setView] = useState<CalendarView>('month');
  const [calendars, setCalendars] = useState<Calendar[]>(sampleCalendars);
  const [events] = useState<CalendarEvent[]>(sampleEvents);

  const toggleCalendar = (id: string) => {
    setCalendars(prev =>
      prev.map(cal => (cal.id === id ? { ...cal, enabled: !cal.enabled } : cal))
    );
  };

  return (
    <CalendarContext.Provider
      value={{
        currentDate,
        setCurrentDate,
        view,
        setView,
        events,
        calendars,
        toggleCalendar,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
};
