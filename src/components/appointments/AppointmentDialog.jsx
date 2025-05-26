import React, { useState, useEffect } from "react";
import { format, parseISO, isAfter, isBefore, addMinutes } from "date-fns";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    AlertTriangle,
    Calendar as CalendarIcon,
    Clock,
    MapPin,
    Trash,
    Check,
    AlertCircle,
    X,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../ui/loader";
import DeleteConfirmation from "../calendar/DeleteConfirmation";
import { setDeleteAppointmentModal } from "@/store/slices/appointmentsSlice";
import { useToast } from "../ui/use-toast";

/**
 * AppointmentDialog component for creating and editing appointments.
 *
 * @component
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the dialog is open.
 * @param {Function} props.onClose - Callback to close the dialog.
 * @param {Object} [props.appointment] - The appointment object to edit (if editing).
 * @param {boolean} props.isNew - Whether this dialog is for creating a new appointment.
 * @param {Array<Object>} props.participants - List of all possible participants.
 * @param {Array<Object>} props.appointments - List of all existing appointments (for conflict checking).
 * @param {Function} props.onSave - Callback to save the appointment. Receives the appointment data.
 * @param {Function} props.onDelete - Callback to delete the appointment. Receives the appointment id.
 * @param {Date} [props.selectedDate] - The initially selected date for a new appointment.
 * @param {string|string[]} [props.selectedTime] - The initially selected time or time range for a new appointment.
 *
 * @returns {JSX.Element}
 */

const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minute = (i % 2) * 30;
    return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
});

const COLORS = [
    "#6366f1", // Indigo
    "#ec4899", // Pink
    "#8b5cf6", // Purple
    "#14b8a6", // Teal
    "#f59e0b", // Amber
    "#ef4444", // Red
    "#22c55e", // Green
    "#06b6d4", // Cyan
];

export default function AppointmentDialog({
    isOpen,
    onClose,
    appointment,
    isNew,
    participants,
    appointments,
    onSave,
    onDelete,
    selectedDate,
    selectedTime,
}) {
    const dispatch = useDispatch();
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: new Date(),
        start_time: "09:00",
        end_time: "10:00",
        participants: [],
        location: "",
        color: COLORS[0],
    });
    const [errors, setErrors] = useState({});
    const [conflicts, setConflicts] = useState([]);

    const { isLoading: appointmentInProgress, deleteAppointmentModal } = useSelector(
        (state) => state.appointments
    );

    //   * Effect to initialize form data when dialog opens or appointment changes
    useEffect(() => {
        if (isNew) {
            setFormData({
                title: "",
                description: "",
                date: selectedDate || new Date(),
                start_time:
                    Array.isArray(selectedTime)
                        ? selectedTime[0]
                        : "09:00",
                end_time: calculateEndTime(selectedTime || "09:00", 60),
                participants: [],
                location: "",
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
            });
        } else if (appointment) {
            setFormData({
                ...appointment,
                date: parseISO(appointment.date),
            });
        }

        setErrors({});
        setConflicts([]);
    }, [isOpen, appointment, isNew, selectedDate, selectedTime]);

    /**
     * Calculates the end time based on a given start time and duration in minutes.
     *
     * @param {string|string[]} startTimeInput - The start time as a string in "HH:mm" format or an array with the first element as the start time string.
     * @param {number} durationMinutes - The duration in minutes to add to the start time.
     * @returns {string} The calculated end time in "HH:mm" format.
     */
    const calculateEndTime = (startTimeInput, durationMinutes) => {
        const startTime = Array.isArray(startTimeInput) ? startTimeInput[0] : startTimeInput;

        if (!startTime) return "10:00";

        const [hours, minutes] = startTime.split(":").map(Number);
        const startDate = new Date();
        startDate.setHours(hours, minutes, 0, 0);

        const endDate = addMinutes(startDate, durationMinutes);
        return `${endDate.getHours().toString().padStart(2, "0")}:${endDate
            .getMinutes()
            .toString()
            .padStart(2, "0")}`;
    };

    /**
     * Handles changes to form input fields by updating form data and errors state.
     * - Updates the corresponding field in formData.
     * - Clears any existing error for the changed field.
     * - If the start time is changed, automatically adjusts the end time to maintain a 1-hour duration.
     * - Rechecks for appointment conflicts when participants, date, start time, or end time are changed.
     *
     * @param {string} field - The name of the form field being changed.
     * @param {*} value - The new value for the specified field.
     */
    const handleInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
        setErrors({ ...errors, [field]: undefined });

        // If changing start time, adjust end time to maintain a 1-hour duration
        if (field === "start_time") {
            setFormData((prev) => ({
                ...prev,
                start_time: value,
                end_time: calculateEndTime(value, 60),
            }));
        }

        // Recheck conflicts when participants or times change
        if (["participants", "date", "start_time", "end_time"].includes(field)) {
            checkConflicts({ ...formData, [field]: value });
        }
    };

    /**
     * Returns an array of participant objects whose IDs are included in the formData's participants list.
     *
     * @returns {Array<Object>} The selected participant objects.
     */
    const getSelectedParticipants = () => {
        return participants.filter((p) => formData.participants.includes(p.id));
    };

    /**
     * Combines a date string and a time string into a single Date object.
     *
     * @param {string} dateStr - The date string (e.g., "2024-06-10").
     * @param {string} timeStr - The time string in "HH:mm" format (e.g., "14:30").
     * @returns {Date} A Date object representing the combined date and time.
     */
    const convertTimeToDate = (dateStr, timeStr) => {
        const date = new Date(dateStr);
        const [hours, minutes] = timeStr.split(":").map(Number);
        date.setHours(hours, minutes, 0, 0);
        return date;
    };

    /**
     * Checks for scheduling conflicts among selected participants for a given appointment.
     *
     * This function verifies if any of the selected participants have overlapping appointments
     * with the specified date and time range. It updates the conflicts state with any found conflicts.
     * Also validates that the end time is after the start time and sets errors accordingly.
     *
     * @param {Object} data - The appointment data to check for conflicts.
     * @param {string|Date} data.date - The date of the appointment.
     * @param {string} data.start_time - The start time of the appointment (e.g., "14:00").
     * @param {string} data.end_time - The end time of the appointment (e.g., "15:00").
     * @param {Array<string|number>} data.participants - Array of participant IDs involved in the appointment.
     *
     * @returns {void}
     */
    const checkConflicts = (data) => {
        if (!data.participants || data.participants.length === 0) {
            setConflicts([]);
            return;
        }

        const startDateTime = convertTimeToDate(data.date, data.start_time);
        const endDateTime = convertTimeToDate(data.date, data.end_time);

        // Check if end time is after start time
        if (!isAfter(endDateTime, startDateTime)) {
            setErrors({
                ...errors,
                end_time: "End time must be after start time",
            });
            return;
        }

        const newConflicts = [];

        data.participants.forEach((participantId) => {
            // Find appointments for this participant, excluding the current one being edited
            const participantAppointments = appointments.filter(
                (a) =>
                    a.participants.includes(participantId) &&
                    (!appointment || a.id !== appointment.id)
            );

            participantAppointments.forEach((appt) => {
                const apptDate = parseISO(appt.date);
                const apptStartDateTime = convertTimeToDate(apptDate, appt.start_time);
                const apptEndDateTime = convertTimeToDate(apptDate, appt.end_time);

                // Check for overlap
                if (
                    (isAfter(apptEndDateTime, startDateTime) &&
                        isBefore(apptStartDateTime, endDateTime)) ||
                    (isAfter(endDateTime, apptStartDateTime) &&
                        isBefore(startDateTime, apptEndDateTime))
                ) {
                    const conflictingParticipant = participants.find((p) => p.id === participantId);
                    newConflicts.push({
                        participant: conflictingParticipant,
                        appointment: appt,
                    });
                }
            });
        });

        setConflicts(newConflicts);
    };

    /**
     * Validates the appointment form data and sets error messages for invalid fields.
     *
     * Checks for required fields (title, date, start time, end time, participants),
     * ensures at least one participant is selected, and verifies that the end time
     * is after the start time. Updates the errors state accordingly.
     *
     * @returns {boolean} Returns true if the form is valid (no errors), otherwise false.
     */
    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = "Title is required";
        }

        if (!formData.date) {
            newErrors.date = "Date is required";
        }

        if (!formData.start_time) {
            newErrors.start_time = "Start time is required";
        }

        if (!formData.end_time) {
            newErrors.end_time = "End time is required";
        }

        if (formData.participants.length === 0) {
            newErrors.participants = "At least one participant is required";
        }

        const startDateTime = convertTimeToDate(formData.date, formData.start_time);
        const endDateTime = convertTimeToDate(formData.date, formData.end_time);

        if (!isAfter(endDateTime, startDateTime)) {
            newErrors.end_time = "End time must be after start time";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /**
     * Handles the submission of the appointment form.
     *
     * - Validates the form data using `validateForm()`.
     * - If there are scheduling conflicts, displays an error toast and aborts submission.
     * - If validation passes and there are no conflicts, calls `onSave` with the form data,
     *   formatting the date as 'yyyy-MM-dd'.
     *
     * @function
     */
    const handleSubmit = () => {
        if (!validateForm()) return;

        if (conflicts.length > 0) {
            // Show toast or alert for conflicts
            toast({
                title: "Error",
                description: "There are scheduling conflicts.",
                variant: "destructive",
            });
            return;
        }

        onSave({
            ...formData,
            date: format(formData.date, "yyyy-MM-dd"),
        });
    };

    return (
        <>
            <Dialog
                open={isOpen}
                onOpenChange={(open) => {
                    if (!open) onClose();
                }}
            >
                <DialogContent className="sm:max-w-[535px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl">
                            {isNew ? "Create New Appointment" : "Edit Appointment"}
                        </DialogTitle>
                        {isNew && (
                            <DialogDescription>
                                Schedule a new appointment by filling out the details below.
                            </DialogDescription>
                        )}
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label className="required" htmlFor="title">
                                Title
                            </Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => handleInputChange("title", e.target.value)}
                                placeholder="Meeting title"
                                className={errors.title ? "border-red-500" : ""}
                            />
                            {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Description (Optional)</Label>
                            <Textarea
                                id="description"
                                value={formData.description || ""}
                                onChange={(e) => handleInputChange("description", e.target.value)}
                                placeholder="Meeting agenda or notes"
                                rows={3}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label className="required">Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={`justify-start text-left font-normal ${
                                                errors.date ? "border-red-500" : ""
                                            }`}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {formData.date
                                                ? format(formData.date, "PPP")
                                                : "Select date"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={formData.date}
                                            onSelect={(date) => handleInputChange("date", date)}
                                            initialFocus
                                            disabled={(date) =>
                                                date < new Date(new Date().setHours(0, 0, 0, 0))
                                            }
                                        />
                                    </PopoverContent>
                                </Popover>
                                {errors.date && (
                                    <p className="text-sm text-red-500">{errors.date}</p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label>Color</Label>
                                <div className="flex flex-wrap gap-2">
                                    {COLORS.map((color) => (
                                        <div
                                            key={color}
                                            className={`w-6 h-6 rounded-full cursor-pointer ${
                                                formData.color === color
                                                    ? "ring-2 ring-offset-2 ring-black"
                                                    : ""
                                            }`}
                                            style={{ backgroundColor: color }}
                                            onClick={() => handleInputChange("color", color)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label className="required" htmlFor="start_time">Start Time</Label>
                                <Select
                                    value={formData.start_time}
                                    onValueChange={(value) =>
                                        handleInputChange("start_time", value)
                                    }
                                >
                                    <SelectTrigger
                                        className={errors.start_time ? "border-red-500" : ""}
                                        id="start_time"
                                    >
                                        <SelectValue placeholder="Select start time" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {TIME_OPTIONS.map((time) => (
                                                <SelectItem key={`start-${time}`} value={time}>
                                                    {time}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {errors.start_time && (
                                    <p className="text-sm text-red-500">{errors.start_time}</p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label className="required" htmlFor="end_time">End Time</Label>
                                <Select
                                    value={formData.end_time}
                                    onValueChange={(value) => handleInputChange("end_time", value)}
                                >
                                    <SelectTrigger
                                        className={errors.end_time ? "border-red-500" : ""}
                                        id="end_time"
                                    >
                                        <SelectValue placeholder="Select end time" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {TIME_OPTIONS.map((time) => (
                                                <SelectItem key={`end-${time}`} value={time}>
                                                    {time}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {errors.end_time && (
                                    <p className="text-sm text-red-500">{errors.end_time}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="location">Location (Optional)</Label>
                            <div className="flex">
                                <div className="flex items-center px-3 bg-gray-50 border border-r-0 rounded-l-md">
                                    <MapPin className="h-4 w-4 text-gray-500" />
                                </div>
                                <Input
                                    id="location"
                                    value={formData.location || ""}
                                    onChange={(e) => handleInputChange("location", e.target.value)}
                                    placeholder="Conference room, Zoom link, etc."
                                    className="rounded-l-none"
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <div className="flex justify-between items-center">
                                <Label className="required" htmlFor="participants">
                                    Participants
                                </Label>
                                {getSelectedParticipants().length > 0 && (
                                    <Badge variant="outline" className="text-xs">
                                        {getSelectedParticipants().length} selected
                                    </Badge>
                                )}
                            </div>

                            <Select
                                value="placeholder"
                                onValueChange={(value) => {
                                    const updatedParticipants = formData.participants.includes(
                                        value
                                    )
                                        ? formData.participants.filter((id) => id !== value)
                                        : [...formData.participants, value];

                                    handleInputChange("participants", updatedParticipants);
                                }}
                            >
                                <SelectTrigger
                                    className={`${errors.participants ? "border-red-500" : ""}`}
                                    id="participants"
                                >
                                    <SelectValue placeholder="Select participants" />
                                </SelectTrigger>
                                <SelectContent>
                                    {participants.map((participant) => (
                                        <SelectItem
                                            key={participant.id}
                                            value={participant.id}
                                            className="flex items-center"
                                        >
                                            <div className="flex items-center cursor-pointer">
                                                {formData.participants.includes(participant.id) && (
                                                    <Check className="h-4 w-4 mr-2 text-green-500" />
                                                )}
                                                {participant.name}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.participants && (
                                <p className="text-sm text-red-500">{errors.participants}</p>
                            )}

                            {getSelectedParticipants().length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {getSelectedParticipants().map((participant) => (
                                        <Badge
                                            key={participant.id}
                                            variant="secondary"
                                            className="flex items-center gap-1 pl-1"
                                        >
                                            <Avatar className="h-5 w-5">
                                                <AvatarFallback
                                                    style={{ backgroundColor: participant.color }}
                                                    className="text-[10px] text-white"
                                                >
                                                    {participant.name
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("")
                                                        .toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span>{participant.name}</span>
                                            <button
                                                className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
                                                onClick={() =>
                                                    handleInputChange(
                                                        "participants",
                                                        formData.participants.filter(
                                                            (id) => id !== participant.id
                                                        )
                                                    )
                                                }
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>

                        {conflicts.length > 0 && (
                            <Alert variant="destructive" className="mt-2">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>
                                    <div className="text-sm font-semibold mb-1">
                                        Scheduling conflicts detected:
                                    </div>
                                    <ul className="text-xs space-y-1 list-disc pl-4">
                                        {conflicts.map((conflict, index) => (
                                            <li key={index}>
                                                {conflict.participant.name} has "
                                                {conflict.appointment.title}" at{" "}
                                                {conflict.appointment.start_time}-
                                                {conflict.appointment.end_time}
                                            </li>
                                        ))}
                                    </ul>
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>

                    <DialogFooter className="flex gap-2">
                        {!isNew && (
                            <Button
                                variant="outline"
                                onClick={() => dispatch(setDeleteAppointmentModal({ open: true }))}
                                className="mr-auto text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                                <Trash className="h-4 w-4 mr-2" />
                                Delete
                            </Button>
                        )}
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={conflicts.length}
                            className="w-[165px]"
                        >
                            {appointmentInProgress ? (
                                <Loader />
                            ) : isNew ? (
                                "Create Appointment"
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <DeleteConfirmation
                isOpen={deleteAppointmentModal}
                onClose={() => dispatch(setDeleteAppointmentModal({ open: false }))}
                onDelete={() => onDelete(appointment.id)}
                title="Delete Appointment"
                description="Are you sure you want to delete this appointment? This action cannot be undone."
            />
        </>
    );
}
