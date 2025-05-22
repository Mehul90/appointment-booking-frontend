import React, { useState, useEffect } from 'react';
import { Participant, Appointment } from '@/api/entities';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import AppointmentDialog from '../components/appointments/AppointmentDialog';

export default function AppointmentForm() {
  const [participants, setParticipants] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [participantsData, appointmentsData] = await Promise.all([
        Participant.list(),
        Appointment.list()
      ]);
      setParticipants(participantsData);
      setAppointments(appointmentsData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setIsLoading(false);
  };

  const handleSaveAppointment = async (appointmentData) => {
    try {
      await Appointment.create(appointmentData);
      navigate(createPageUrl('Calendar'));
    } catch (error) {
      console.error('Error saving appointment:', error);
    }
  };

  const handleCloseDialog = () => {
    navigate(createPageUrl('Calendar'));
  };

  return (
    <AppointmentDialog
      isOpen={true}
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