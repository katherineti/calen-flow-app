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

interface EventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date | null;
  onSave: (event: Omit<CalendarEvent, 'id'>) => void;
  calendarId: string;
}

export const EventDialog = ({
  open,
  onOpenChange,
  selectedDate,
  onSave,
  calendarId,
}: EventDialogProps) => {
  const [title, setTitle] = useState('');
  const [allDay, setAllDay] = useState(true);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [showMoreOptions, setShowMoreOptions] = useState(false);

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
    setShowMoreOptions(false);
    onOpenChange(false);
  };

  const timeOptions = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minute = i % 2 === 0 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${minute}`;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0">
        <DialogHeader className="p-4 pb-3 border-b">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 h-8 w-8"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="p-6 space-y-4">
          <Input
            placeholder="Agregar título y horario"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-2xl border-0 border-b rounded-none px-0 focus-visible:ring-0"
          />

          <div className="flex items-center gap-4">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1 flex items-center gap-2">
              <div className="text-sm">
                {selectedDate && format(selectedDate, "EEEE, d 'de' MMMM", { locale: es })}
              </div>
              {!allDay && (
                <>
                  <Select value={startTime} onValueChange={setStartTime}>
                    <SelectTrigger className="w-[100px] h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-muted-foreground">-</span>
                  <Select value={endTime} onValueChange={setEndTime}>
                    <SelectTrigger className="w-[100px] h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="all-day"
              checked={allDay}
              onCheckedChange={(checked) => setAllDay(checked as boolean)}
            />
            <Label htmlFor="all-day" className="text-sm cursor-pointer">
              Todo el día
            </Label>
          </div>

          {showMoreOptions && (
            <div className="space-y-3 pt-2">
              <div className="text-sm text-muted-foreground">
                Más opciones disponibles próximamente...
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 p-4 border-t">
          <Button
            variant="ghost"
            onClick={() => setShowMoreOptions(!showMoreOptions)}
          >
            Más opciones
          </Button>
          <Button onClick={handleSave} disabled={!title.trim()}>
            Guardar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
