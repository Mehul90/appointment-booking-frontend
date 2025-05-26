import { getAppointments } from "@/store/slices/appointmentsSlice";
import { getAllParticipants } from "@/store/slices/participantsSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
/**
 * Custom React hook to fetch and manage appointments and participants data.
 *
 * This hook dispatches Redux actions to load appointments and participants,
 * manages loading state, and transforms the appointments data for use in components.
 *
 * @returns {Object} An object containing:
 *   - {boolean} isLoading - Indicates if the data is currently loading.
 *   - {Array} participants - The list of participants.
 *   - {Array} appointments - The transformed list of appointments.
 *   - {boolean} isSeeMoreAppointments - Flag indicating if there are more appointments to see.
 */

export const useGetData = () => {
    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(true);
    const [participants, setParticipants] = useState([]);
    const [appointments, setAppointments] = useState([]);

    const { appointmentsList, isSeeMoreAppointments } = useSelector((state) => state.appointments);
    const { participantsList } = useSelector((state) => state.participants);

    // Function to load appointments and participants data
    const loadData = async () => {
        setIsLoading(true);
        try {
            await Promise.all([
                dispatch(getAppointments()),
                dispatch(getAllParticipants()),
            ]);
        } catch (error) {
            console.error("Error loading data:", error);
        }
        setIsLoading(false);
    };

    // Load data when the component mounts
    useEffect(() => {
        loadData();
    }, []);

    // Transform appointments data to match the expected format
    useEffect(() => {
        setAppointments(() => {
            return appointmentsList.map((appointment) => {
                return {
                    ...appointment,
                    start_time: appointment.startTime,
                    end_time: appointment.endTime,
                    participants: appointment.appointmentParticipants.map(
                        (participant) => participant.participant.id
                    ),
                };
            });
        });
    }, [appointmentsList]);

    // Update participants state when participantsList changes
    useEffect(() => {
        setParticipants(participantsList);
    }, [participantsList]);

    // Return the data and loading state
    return {
        isLoading,
        participants,
        appointments,
        isSeeMoreAppointments
    };

};
