import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSelector } from "react-redux";



/**
 * SeeMore component displays a dialog listing additional appointments for a selected time slot.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {boolean} props.isOpen - Controls whether the dialog is open.
 * @param {Function} props.onClose - Callback function to close the dialog.
 * @param {Function} props.onAppointmentClick - Callback when an appointment is clicked, receives the appointment object.
 *
 * @returns {JSX.Element} Dialog containing a list of appointments with participant avatars.
 */
const SeeMore = ({ isOpen, onClose, onAppointmentClick }) => {
    const { seeMoreAppointsments} = useSelector(
        (state) => state.appointments
    );

    const { participantsList } = useSelector((state) => state.participants);

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

    /**
     * Retrieves a participant object from the participants list by their ID.
     *
     * @param {string|number} id - The unique identifier of the participant.
     * @returns {{ name: string, color: string }} The participant object if found, otherwise a default object with name "Unknown" and color "#ccc".
     */
    const getParticipantById = (id) => {
        return participantsList.find((p) => p.id === id) || { name: "Unknown", color: "#ccc" };
    };

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) onClose();
            }}
        >
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-xl">Appointments List</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {seeMoreAppointsments.map((appointment) => {
                        // Only render the visual card for an appointment if this time slot is its start_time.
                        return (
                            <div
                                key={appointment.id}
                                className="mx-1 my-0.5 p-2 rounded-lg bg-white shadow-sm border-l-4 hover:shadow-md transition-shadow cursor-pointer"
                                style={{
                                    borderLeftColor: appointment.color || "#6366f1",
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onAppointmentClick(appointment);
                                }}
                            >
                                <div className="text-xs font-medium truncate">
                                    {appointment.title}
                                </div>
                                <div className="text-xs text-gray-500 truncate">
                                    {appointment.start_time} - {appointment.end_time}
                                </div>
                                {appointment.participants &&
                                    appointment.participants.length > 0 && (
                                        <div className="flex -space-x-1 mt-1 overflow-hidden">
                                            {appointment.participants
                                                .slice(0, 3)
                                                .map((participantId) => {
                                                    const participant =
                                                        getParticipantById(participantId);
                                                    return (
                                                        <Avatar
                                                            key={participantId}
                                                            className="h-6 w-6 border-2 border-white"
                                                        >
                                                            <AvatarFallback
                                                                style={{
                                                                    backgroundColor:
                                                                        participant.color,
                                                                }}
                                                                className="text-[10px] text-white"
                                                            >
                                                                {getParticipantInitials(
                                                                    participant
                                                                )}
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
                    })}
                </div>

            </DialogContent>
        </Dialog>
    );
};

export default SeeMore;
