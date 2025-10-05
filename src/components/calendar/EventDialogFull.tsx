import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { 
  X, 
  Clock, 
  Video, 
  MapPin, 
  AlignLeft, 
  Bell,
  Calendar as CalendarIcon,
  Lock,
  Briefcase,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link,
  Type
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CalendarEvent } from '@/types/calendar';

interface EventDialogFullProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date | null;
  onSave: (event: Omit<CalendarEvent, 'id'>) => void;
  calendarId: string;
  calendars: Array<{ id: string; name: string; color: string; enabled: boolean }>;
}

export const EventDialogFull = ({
  open,
  onOpenChange,
  selectedDate,
  onSave,
  calendarId: defaultCalendarId,
  calendars,
}: EventDialogFullProps) => {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(selectedDate || undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(selectedDate || undefined);
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('10:30');
  const [allDay, setAllDay] = useState(true);
  const [recurrence, setRecurrence] = useState('no-repeat');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [notification, setNotification] = useState('10');
  const [notificationUnit, setNotificationUnit] = useState('minutos');
  const [selectedCalendar, setSelectedCalendar] = useState(defaultCalendarId);
  const [availability, setAvailability] = useState('Ocupado');
  const [visibility, setVisibility] = useState('predeterminada');
  const [selectedColor, setSelectedColor] = useState<string>('blue');
  const [activeTab, setActiveTab] = useState('details');
  
  // Guest permissions
  const [canModify, setCanModify] = useState(false);
  const [canInvite, setCanInvite] = useState(true);
  const [canSeeGuestList, setCanSeeGuestList] = useState(true);

  const handleSave = () => {
    if (!title.trim() || !startDate) return;

    const start = new Date(startDate);
    const end = new Date(endDate || startDate);

    if (!allDay) {
      const [startHour, startMinute] = startTime.split(':').map(Number);
      const [endHour, endMinute] = endTime.split(':').map(Number);
      start.setHours(startHour, startMinute);
      end.setHours(endHour, endMinute);
    }

    onSave({
      title,
      start,
      end,
      color: selectedColor as any,
      calendarId: selectedCalendar,
      allDay,
    });

    // Reset form
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setTitle('');
    setAllDay(true);
    setStartTime('10:00');
    setEndTime('10:30');
    setRecurrence('no-repeat');
    setLocation('');
    setDescription('');
  };

  const timeOptions = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minute = i % 2 === 0 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${minute}`;
  });

  const colors = [
    { name: 'red', value: 'red' },
    { name: 'orange', value: 'orange' },
    { name: 'yellow', value: '#F59E0B' },
    { name: 'green', value: 'green' },
    { name: 'teal', value: '#14B8A6' },
    { name: 'blue', value: 'blue' },
    { name: 'indigo', value: '#6366F1' },
    { name: 'purple', value: 'purple' },
    { name: 'pink', value: '#EC4899' },
    { name: 'gray', value: '#6B7280' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1200px] h-[90vh] p-0 gap-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
          <Button onClick={handleSave} disabled={!title.trim()}>
            Guardar
          </Button>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="p-6 max-w-4xl mx-auto">
            {/* Title */}
            <Input
              placeholder="Agregar título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-2xl border-0 border-b rounded-none px-0 focus-visible:ring-0 mb-6"
            />

            {/* Date and Time */}
            <div className="flex items-start gap-4 mb-4">
              <Clock className="h-5 w-5 text-muted-foreground mt-2" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-[140px] justify-start">
                        {startDate ? format(startDate, 'd MMM yyyy', { locale: es }) : 'Fecha'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>

                  {!allDay && (
                    <>
                      <Select value={startTime} onValueChange={setStartTime}>
                        <SelectTrigger className="w-[100px]">
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
                      <span>a</span>
                      <Select value={endTime} onValueChange={setEndTime}>
                        <SelectTrigger className="w-[100px]">
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

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-[140px] justify-start">
                        {endDate ? format(endDate, 'd MMM yyyy', { locale: es }) : 'Fecha'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>

                  <Button variant="link" size="sm">
                    Zona horaria
                  </Button>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="all-day-full"
                      checked={allDay}
                      onCheckedChange={(checked) => setAllDay(checked as boolean)}
                    />
                    <Label htmlFor="all-day-full" className="text-sm cursor-pointer">
                      Todo el día
                    </Label>
                  </div>

                  <Select value={recurrence} onValueChange={setRecurrence}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no-repeat">No se repite</SelectItem>
                      <SelectItem value="daily">Todos los días</SelectItem>
                      <SelectItem value="weekly">Cada semana, el domingo</SelectItem>
                      <SelectItem value="monthly">Todos los meses, el primer domingo</SelectItem>
                      <SelectItem value="yearly">Anualmente, el 5 de octubre</SelectItem>
                      <SelectItem value="weekdays">Todos los días hábiles (de lunes a viernes)</SelectItem>
                      <SelectItem value="custom">Personalizado...</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList>
                <TabsTrigger value="details">Detalles del evento</TabsTrigger>
                <TabsTrigger value="schedule">Ver horarios disponibles</TabsTrigger>
                <TabsTrigger value="guests">Invitados</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4 mt-4">
                {/* Google Meet */}
                <div className="flex items-center gap-4">
                  <Video className="h-5 w-5 text-muted-foreground" />
                  <Button variant="ghost" className="justify-start px-0">
                    Agregar una videoconferencia de Google Meet
                  </Button>
                </div>

                {/* Location */}
                <div className="flex items-center gap-4">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Agregar ubicación"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="flex-1"
                  />
                </div>

                {/* Notification */}
                <div className="flex items-center gap-4">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <div className="flex items-center gap-2">
                    <Select value={notification} onValueChange={setNotification}>
                      <SelectTrigger className="w-[100px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="15">15</SelectItem>
                        <SelectItem value="30">30</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={notificationUnit} onValueChange={setNotificationUnit}>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minutos">minutos</SelectItem>
                        <SelectItem value="horas">horas</SelectItem>
                        <SelectItem value="días">días</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" size="icon">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Button variant="link" className="px-0">
                  Agregar notificación
                </Button>

                {/* Calendar Selection */}
                <div className="flex items-center gap-4">
                  <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                  <div className="flex items-center gap-2">
                    <Select value={selectedCalendar} onValueChange={setSelectedCalendar}>
                      <SelectTrigger className="w-[250px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {calendars.map((cal) => (
                          <SelectItem key={cal.id} value={cal.id}>
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full bg-calendar-event-${cal.color}`} />
                              {cal.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm">
                          + Agregar una etiqueta
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-2">
                        <div className="grid grid-cols-5 gap-2">
                          {colors.map((color) => (
                            <button
                              key={color.name}
                              onClick={() => setSelectedColor(color.name)}
                              className={cn(
                                'w-6 h-6 rounded-full',
                                `bg-calendar-event-${color.name}`,
                                selectedColor === color.name && 'ring-2 ring-offset-2 ring-primary'
                              )}
                            />
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Availability */}
                <div className="flex items-center gap-4">
                  <Briefcase className="h-5 w-5 text-muted-foreground" />
                  <Select value={availability} onValueChange={setAvailability}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ocupado">Ocupado</SelectItem>
                      <SelectItem value="Disponible">Disponible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Visibility */}
                <div className="flex items-center gap-4">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                  <Select value={visibility} onValueChange={setVisibility}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="predeterminada">Visibilidad predeterminada</SelectItem>
                      <SelectItem value="publico">Público</SelectItem>
                      <SelectItem value="privado">Privado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Description */}
                <div className="flex items-start gap-4">
                  <AlignLeft className="h-5 w-5 text-muted-foreground mt-2" />
                  <div className="flex-1">
                    <div className="border rounded-lg">
                      <div className="flex items-center gap-1 p-2 border-b">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Type className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Bold className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Italic className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Underline className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <List className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <ListOrdered className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Link className="h-4 w-4" />
                        </Button>
                      </div>
                      <Textarea
                        placeholder="Agregar descripción"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="border-0 min-h-[100px] resize-none focus-visible:ring-0"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="schedule" className="mt-4">
                <div className="text-center py-8 text-muted-foreground">
                  Vista de horarios disponibles próximamente...
                </div>
              </TabsContent>

              <TabsContent value="guests" className="mt-4 space-y-4">
                <Input placeholder="Agregar invitados" />
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Permisos de los invitados</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="can-modify"
                        checked={canModify}
                        onCheckedChange={(checked) => setCanModify(checked as boolean)}
                      />
                      <Label htmlFor="can-modify" className="text-sm cursor-pointer">
                        Modificar el evento
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="can-invite"
                        checked={canInvite}
                        onCheckedChange={(checked) => setCanInvite(checked as boolean)}
                      />
                      <Label htmlFor="can-invite" className="text-sm cursor-pointer">
                        Invitar a otras personas
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="can-see-guests"
                        checked={canSeeGuestList}
                        onCheckedChange={(checked) => setCanSeeGuestList(checked as boolean)}
                      />
                      <Label htmlFor="can-see-guests" className="text-sm cursor-pointer">
                        Ver la lista de invitados
                      </Label>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
