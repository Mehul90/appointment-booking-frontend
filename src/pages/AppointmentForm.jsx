import React, { useState, useEffect } from 'react';
import { Participant, Appointment } from '@/api/entities';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import AppointmentDialog from '../components/appointments/AppointmentDialog';
import { useDispatch, useSelector } from 'react-redux';
import { createAppointment, getAppointments } from '@/store/slices/appointmentsSlice';
import { getAllParticipants } from '@/store/slices/participantsSlice';

export default function AppointmentForm() {
  const [participants, setParticipants] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { appointmentsList } = useSelector(
    (state) => state.appointments
  )
  const { participantsList } = useSelector(
    (state) => state.participants
  )

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
        setAppointments(() => {
            return appointmentsList.map((appointment) => {
                return {
                    ...appointment,
                    start_time: appointment.startTime,
                    end_time: appointment.endTime,
                    participants: appointment.appointmentParticipants.map((participant) => participant.participant.id),
                };
            });
        });
    }, [appointmentsList]);
  
    useEffect(() => {
        setParticipants(participantsList);
    }, [participantsList]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [participantsData, appointmentsData] = await Promise.all([
        dispatch(getAppointments()),
        dispatch(getAllParticipants()),
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setIsLoading(false);
  };

  const handleSaveAppointment = async (appointmentData) => {
    try {
      // await Appointment.create(appointmentData);
      // navigate(createPageUrl('Calendar'));

      dispatch(createAppointment(appointmentData))
          .then((response) => {
              navigate(createPageUrl("Calendar"));
              setIsOpen(false);
          })
          .catch(() => {
              navigate(createPageUrl("Calendar"));
              setIsOpen
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