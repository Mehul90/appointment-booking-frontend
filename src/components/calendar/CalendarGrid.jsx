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
  const appointmentsByDayAndTime = days.map(day => {
    return {
      date: day,
      timeSlots: TIME_SLOTS.map(timeSlot => {
        const [hours, minutes] = timeSlot.split(':');
        const slotStartDateTime = new Date(day);
        slotStartDateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
        const slotEndDateTime = addMinutes(slotStartDateTime, 30);
        
        // Find appointments that overlap with this time slot
        const overlappingAppointments = appointments.filter(appointment => {
          const appointmentDate = parseISO(appointment.date);
          
          if (!isSameDay(appointmentDate, day)) return false;
          
          const [startHour, startMinute] = appointment.start_time.split(':');
          const [endHour, endMinute] = appointment.end_time.split(':');
          
          const appointmentStart = new Date(appointmentDate);
          appointmentStart.setHours(parseInt(startHour, 10), parseInt(startMinute, 10), 0, 0);
          
          const appointmentEnd = new Date(appointmentDate);
          appointmentEnd.setHours(parseInt(endHour, 10), parseInt(endMinute, 10), 0, 0);
          
          // Corrected overlap condition:
          // An appointment overlaps with the current time slot if:
          // The appointment starts before the slot ends, AND
          // The appointment ends after the slot starts.
          return appointmentStart < slotEndDateTime && appointmentEnd > slotStartDateTime;
        });

        return {
          time: timeSlot,
          appointments: overlappingAppointments
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
                key={`${format(dayData.date, 'yyyy-MM-dd')}-${slot.time}`}
                date={dayData.date}
                time={slot.time}
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