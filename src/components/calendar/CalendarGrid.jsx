import React from 'react';
import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  addDays, 
  isSameDay, 
  parseISO,
  addMinutes
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TimeSlot from './TimeSlot';

const HOURS = Array.from({ length: 13 }, (_, i) => i + 7); // 7 AM to 7 PM
const TIME_SLOTS = HOURS.flatMap(hour => [
  `${hour.toString().padStart(2, '0')}:00`,
  `${hour.toString().padStart(2, '0')}:30`
]);

export default function CalendarGrid({ 
  currentDate, 
  appointments, 
  participants,
  onDateChange, 
  onAppointmentClick, 
  onTimeSlotClick 
}) {
  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 }); // Start from Monday
  const endDate = endOfWeek(currentDate, { weekStartsOn: 1 }); // End on Sunday
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  // Group appointments by day and time
  // Map each day to its time slots, and for each slot, filter only appointments that start within that slot
  const appointmentsByDayAndTime = days.map(day => {
    // Group TIME_SLOTS into chunks of 5
    const chunkedTimeSlots = [];
    for (let i = 0; i < TIME_SLOTS.length; i += 5) {
      chunkedTimeSlots.push(TIME_SLOTS.slice(i, i + 5));
    }

    return {
      date: day,
      timeSlots: chunkedTimeSlots.map((slotGroup) => {
      // slotGroup is an array of 5 time strings
      const slotStart = slotGroup[0];
      const slotEnd = slotGroup[slotGroup.length - 1];

      // Calculate start and end Date objects for the slot group
      const [startHour, startMinute] = slotStart.split(':');
      const slotGroupStartDateTime = new Date(day);
      slotGroupStartDateTime.setHours(parseInt(startHour, 10), parseInt(startMinute, 10), 0, 0);

      const [endHour, endMinute] = slotEnd.split(':');
      const slotGroupEndDateTime = new Date(day);
      // Each slot is 30 min, so add 30 min to the last slot's end
      slotGroupEndDateTime.setHours(parseInt(endHour, 10), parseInt(endMinute, 10) + 30, 0, 0);

      // Merge appointments that start within this slot group
      const relevantAppointments = appointments.filter(appointment => {
        const appointmentDate = parseISO(appointment.date);
        if (!isSameDay(appointmentDate, day)) return false;

        const [appHour, appMinute] = appointment.start_time.split(':');
        const appointmentStart = new Date(appointmentDate);
        appointmentStart.setHours(parseInt(appHour, 10), parseInt(appMinute, 10), 0, 0);

        return appointmentStart >= slotGroupStartDateTime && appointmentStart < slotGroupEndDateTime;
      });

      return {
        timeSlots: slotGroup, // array of 5 time strings
        appointments: relevantAppointments
      };
      })
    };
  });

  const getParticipantById = (id) => {
    return participants.find(p => p.id === id) || { name: 'Unknown', color: '#ccc' };
  };

  return (
    <div className="flex flex-col h-full">
      {/* Calendar header with navigation */}
      <div className="flex items-center justify-between py-4 px-6 border-b">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-semibold text-gray-800">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => onDateChange(addDays(currentDate, -7))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            onClick={() => onDateChange(new Date())}
            className="px-3"
          >
            Today
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => onDateChange(addDays(currentDate, 7))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Days header */}
      <div className="flex border-b">
        <div className="w-20 border-r bg-gray-50 flex items-center justify-center px-2 py-3">
          <span className="text-sm font-medium text-gray-500">Time</span>
        </div>
        {days.map((day) => (
          <div
            key={day.toString()}
            className="flex-1 text-center px-2 py-3"
          >
            <p className="text-sm font-semibold">{format(day, 'EEE')}</p>
            <p 
              className={`text-sm ${
                isSameDay(day, new Date()) 
                  ? 'text-white bg-indigo-600 rounded-full w-7 h-7 flex items-center justify-center mx-auto'
                  : 'text-gray-500'
              }`}
            >
              {format(day, 'd')}
            </p>
          </div>
        ))}
      </div>

      {/* Time grid */}
      <div className="flex flex-1 overflow-y-auto">
        {/* Time labels */}
        <div className="w-20 border-r bg-gray-50 flex flex-col">
          {TIME_SLOTS.map((time) => (
            <div
              key={time}
              className="flex items-center justify-center h-20 border-b text-xs text-gray-500 font-medium"
            >
              {time}
            </div>
          ))}
        </div>

        {/* Day columns */}
        {appointmentsByDayAndTime.map((dayData) => (
          <div key={dayData.date.toString()} className="flex-1 border-r">
            {dayData.timeSlots.map((slot) => (
              <TimeSlot
                key={`${format(dayData.date, 'yyyy-MM-dd')}-${slot.timeSlots[0]}`}
                date={dayData.date}
                time={slot.timeSlots}
                appointments={slot.appointments}
                getParticipantById={getParticipantById}
                onAppointmentClick={onAppointmentClick}
                onTimeSlotClick={onTimeSlotClick}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}