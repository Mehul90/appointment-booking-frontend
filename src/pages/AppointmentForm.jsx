import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import AppointmentDialog from '../components/appointments/AppointmentDialog';
import { useDispatch } from 'react-redux';
import { createAppointment } from '@/store/slices/appointmentsSlice';
import { useGetData } from '@/hooks/useGetData';

export default function AppointmentForm() {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { participants, appointments } = useGetData();

  
  /**
   * Handles saving an appointment by dispatching the createAppointment action.
   * Navigates to the Calendar page and closes the modal upon success or failure.
   *
   * @async
   * @function handleSaveAppointment
   * @param {Object} appointmentData - The data for the appointment to be created.
   * @returns {Promise<void>} Resolves when the appointment is saved and navigation is complete.
   */
  const handleSaveAppointment = async (appointmentData) => {
    try {

      dispatch(createAppointment(appointmentData))
          .then((response) => {
              navigate(createPageUrl("Calendar"));
              setIsOpen(false);
          })
          .catch(() => {
              navigate(createPageUrl("Calendar"));
              setIsOpen(false);
          });

    } catch (error) {
      console.error('Error saving appointment:', error);
    }
  };

  const handleCloseDialog = () => {
    navigate(createPageUrl('Calendar'));
  };

  return (
    <AppointmentDialog
      isOpen={isOpen}
      onClose={handleCloseDialog}
      appointment={null}
      isNew={true}
      participants={participants}
      appointments={appointments}
      onSave={handleSaveAppointment}
      onDelete={() => {}}
      selectedDate={new Date()}
      selectedTime="09:00"
    />
  );
}