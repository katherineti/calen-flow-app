import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, X } from 'lucide-react';
import { CalendarEvent } from '@/types/calendar';
import { EventDialogFull } from './EventDialogFull';

interface EventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date | null;
  onSave: (event: Omit<CalendarEvent, 'id'>) => void;
  calendarId: string;
  calendars: Array<{ id: string; name: string; color: string; enabled: boolean }>;
}

export const EventDialog = ({
  open,
  onOpenChange,
  selectedDate,
  onSave,
  calendarId,
  calendars,
}: EventDialogProps) => {
  const [title, setTitle] = useState('');
  const [allDay, setAllDay] = useState(true);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [showFullDialog, setShowFullDialog] = useState(false);

  const handleSave = () => {
    if (!title.trim() || !selectedDate) return;

    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    const start = new Date(selectedDate);
    const end = new Date(selectedDate);

    if (!allDay) {
      start.setHours(startHour, startMinute);
      end.setHours(endHour, endMinute);
    }

    onSave({
      title,
      start,
      end,
      color: 'blue',
      calendarId,
      allDay,
    });

    // Reset form
    setTitle('');
    setAllDay(true);
    setStartTime('09:00');
    setEndTime('10:00');
    onOpenChange(false);
  };

  const handleMoreOptions = () => {
    onOpenChange(false);
    setShowFullDialog(true);
  };

  const timeOptions = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minute = i % 2 === 0 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${minute}`;
  });

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[95vw] sm:max-w-[600px] p-0 gap-0">
          <DialogHeader className="p-3 sm:p-4 pb-3 border-b">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-3 sm:right-4 top-3 sm:top-4 h-8 w-8 touch-manipulation"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>

        <div className="p-4 sm:p-6 space-y-4">
          <Input
            placeholder="Agregar título y horario"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xl sm:text-2xl border-0 border-b rounded-none px-0 focus-visible:ring-0 touch-manipulation"
          />

          <div className="flex items-start sm:items-center gap-3 sm:gap-4">
            <Clock className="h-5 w-5 text-muted-foreground mt-1 sm:mt-0 shrink-0" />
            <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="text-sm">
                {selectedDate && format(selectedDate, "EEEE, d 'de' MMMM", { locale: es })}
              </div>
              {!allDay && (
                <div className="flex items-center gap-2 flex-wrap">
                  <Select value={startTime} onValueChange={setStartTime}>
                    <SelectTrigger className="w-[90px] sm:w-[100px] h-9 sm:h-8 touch-manipulation">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px] bg-background z-50">
                      {timeOptions.map((time) => (
                        <SelectItem key={time} value={time} className="touch-manipulation">
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-muted-foreground">-</span>
                  <Select value={endTime} onValueChange={setEndTime}>
                    <SelectTrigger className="w-[90px] sm:w-[100px] h-9 sm:h-8 touch-manipulation">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px] bg-background z-50">
                      {timeOptions.map((time) => (
                        <SelectItem key={time} value={time} className="touch-manipulation">
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3 py-1">
            <Checkbox
              id="all-day"
              checked={allDay}
              onCheckedChange={(checked) => setAllDay(checked as boolean)}
              className="h-5 w-5 touch-manipulation"
            />
            <Label htmlFor="all-day" className="text-sm cursor-pointer">
              Todo el día
            </Label>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 p-3 sm:p-4 border-t">
          <Button
            variant="ghost"
            onClick={handleMoreOptions}
            className="h-10 sm:h-9 touch-manipulation"
          >
            Más opciones
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!title.trim()}
            className="h-10 sm:h-9 touch-manipulation"
          >
            Guardar
          </Button>
        </div>
        </DialogContent>
      </Dialog>

      <EventDialogFull
        open={showFullDialog}
        onOpenChange={setShowFullDialog}
        selectedDate={selectedDate}
        onSave={onSave}
        calendarId={calendarId}
        calendars={calendars}
      />
    </>
  );
};
