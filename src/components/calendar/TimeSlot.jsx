import React from "react";
import { format, parseISO } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useDispatch } from "react-redux";
import { handleSeeMoreAppontments } from "@/store/slices/appointmentsSlice";


/**
 * TimeSlot component displays a single time slot in the calendar, showing appointments and allowing creation of new ones.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.date - The date for the time slot (ISO string or Date).
 * @param {string} props.time - The time for the time slot (e.g., "09:00").
 * @param {Array<Object>} props.appointments - List of appointments overlapping with this time slot.
 * @param {function} props.getParticipantById - Function to retrieve a participant object by their ID.
 * @param {function} props.onAppointmentClick - Callback when an appointment card is clicked. Receives the appointment object.
 * @param {function} props.onTimeSlotClick - Callback when an empty time slot is clicked. Receives the date and time.
 *
 * @returns {JSX.Element} The rendered time slot component.
 */
export default function TimeSlot({
    date,
    time,
    appointments,
    getParticipantById,
    onAppointmentClick,
    onTimeSlotClick,
}) {
    const dispatch = useDispatch();

    /**
     * Handles the click event for a time slot.
     * Compares the provided slot date with today's date (ignoring time).
     * If the slot date is today or in the future, triggers the onTimeSlotClick callback.
     * Prevents creating appointments in the past.
     *
     * @function
     * @returns {void}
     */
    const handleClick = () => {
        const today = new Date();
        const slotDate = new Date(date);
        // Zero out time for both dates
        today.setHours(0, 0, 0, 0);
        slotDate.setHours(0, 0, 0, 0);

        if (slotDate >= today) {
            onTimeSlotClick(date, time);
        }
        return; // Do not allow creating appointments in the past
    };

    /**
     * Returns the initials of a participant's name.
     *
     * @param {Object} participant - The participant object.
     * @param {string} participant.name - The full name of the participant.
     * @returns {string} The uppercase initials of the participant's name.
     */
    const getParticipantInitials = (participant) => {
        return participant.name
            .split(" ")
            .map((name) => name[0])
            .join("")
            .toUpperCase();
    };

    // Determine if this slot is genuinely empty based on ALL overlapping appointments.
    // This is used for styling and click behavior for creating new appointments.
    const isSlotActuallyEmpty = appointments.length === 0;

    return (
        <div
            className={`h-[100px] border-b relative ${
                // Added relative positioning for potential future absolute positioning of events
                isSlotActuallyEmpty ? "hover:bg-gray-50 cursor-pointer" : "bg-gray-50" // Slightly change bg for busy slots
            }`}
            onClick={isSlotActuallyEmpty ? handleClick : undefined}
        >
            {appointments.slice(0, 1).map((appointment) => {
                // Only render the visual card for an appointment if this time slot is its start_time.
                if (time.includes(appointment.start_time)) {
                    return (
                        <div
                            key={appointment.id}
                            className="mx-1 my-0.5 p-2 rounded-lg overflow-hidden bg-white shadow-sm border-l-4 hover:shadow-md transition-shadow cursor-pointer absolute top-0.5 left-0.5 right-0.5"
                            style={{
                                borderLeftColor: appointment.color || "#6366f1",
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                onAppointmentClick(appointment);
                            }}
                        >
                            <div className="text-xs font-medium truncate">{appointment.title}</div>
                            <div className="text-xs text-gray-500 truncate">
                                {appointment.start_time} - {appointment.end_time}
                            </div>
                            {appointment.participants && appointment.participants.length > 0 && (
                                <div className="flex -space-x-1 mt-1 overflow-hidden">
                                    {appointment.participants.slice(0, 3).map((participantId) => {
                                        const participant = getParticipantById(participantId);
                                        return (
                                            <Avatar
                                                key={participantId}
                                                className="h-6 w-6 border-2 border-white"
                                            >
                                                <AvatarFallback
                                                    style={{ backgroundColor: participant.color }}
                                                    className="text-[10px] text-white"
                                                >
                                                    {getParticipantInitials(participant)}
                                                </AvatarFallback>
                                            </Avatar>
                                        );
                                    })}
                                    {appointment.participants.length > 3 && (
                                        <Avatar className="h-6 w-6 border-2 border-white">
                                            <AvatarFallback className="bg-gray-400 text-[10px] text-white">
                                                +{appointment.participants.length - 3}
                                            </AvatarFallback>
                                        </Avatar>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                }

                return null; // If this isn't the start_time slot for this appointment, don't render its card here.
            })}
            {appointments.length > 1 && time.includes(appointments[0].start_time) && (
                <button
                    className="absolute bottom-0 right-0 text-xs text-blue-600 hover:text-blue-800 font-medium"
                    onClick={(e) => {
                        e.stopPropagation();
                        dispatch(handleSeeMoreAppontments({ open: true, appointments }));
                    }}
                >
                    See {appointments.length - 1} more
                </button>
            )}
        </div>
    );
}
