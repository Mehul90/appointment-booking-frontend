import React, { useState, useEffect } from 'react'
import { format, addDays, isSameDay } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  PlusCircle,
  Search,
  Filter,
  Calendar as CalendarIcon,
  Loader2,
} from 'lucide-react'
import CalendarGrid from '../components/calendar/CalendarGrid'
import AppointmentDialog from '../components/appointments/AppointmentDialog'
import { useToast } from '@/components/ui/use-toast'
import { useDispatch, useSelector } from 'react-redux'
import { createAppointment, deleteAppointment, getAppointments, resetSeeMoreAppointments, setDeleteAppointmentModal, updateAppointment } from '@/store/slices/appointmentsSlice'
import { getAllParticipants } from '@/store/slices/participantsSlice'
import SeeMore from '@/components/calendar/SeeMore'

export default function Calendar() {
  const [appointments, setAppointments] = useState([])
  const [participants, setParticipants] = useState([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false)
  const [currentAppointment, setCurrentAppointment] = useState(null)
  const [isNewAppointment, setIsNewAppointment] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const dispatch = useDispatch();

  const { appointmentsList, isSeeMoreAppointments } = useSelector(
    (state) => state.appointments
  )
  const { participantsList } = useSelector(
    (state) => state.participants
  )

  useEffect(() => {
    loadData()
  }, [])


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
    setIsLoading(true)
    try {
      await Promise.all([
        dispatch(getAppointments()),
        dispatch(getAllParticipants()),
      ])
    } catch (error) {
      console.error('Error loading data:', error)
      toast({
        title: 'Error',
        description: 'Failed to load calendar data. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAppointmentClick = (appointment) => {
    setCurrentAppointment(appointment)
    setIsNewAppointment(false)
    setIsAppointmentDialogOpen(true)
  }

  const handleTimeSlotClick = (date, time) => {
    setSelectedDate(date)
    setSelectedTime(time)
    setCurrentAppointment(null)
    setIsNewAppointment(true)
    setIsAppointmentDialogOpen(true)
  }

  const handleCreateAppointment = () => {
    setCurrentAppointment(null)
    setIsNewAppointment(true)
    setSelectedDate(new Date())
    setSelectedTime('09:00')
    setIsAppointmentDialogOpen(true)
  }

  const handleSaveAppointment = async (appointmentData) => {
    try {
      if (isNewAppointment) {
        // await Appointment.create(appointmentData)

        dispatch(createAppointment(appointmentData)).then((response) => {
          toast({
            title: 'Success',
            description: 'Appointment created successfully',
          })

          setIsAppointmentDialogOpen(false)
          
        }).catch(() => {
          toast({
            title: 'Error',
            description: 'Failed to create appointment. Please try again.',
          })

          setIsAppointmentDialogOpen(false)
          
        })

      } else {
        // await Appointment.update(currentAppointment.id, appointmentData)
        dispatch(updateAppointment({ id: currentAppointment.id, data: appointmentData })).then(() => {
          setIsAppointmentDialogOpen(false)
          toast({
            title: 'Success',
            description: 'Appointment updated successfully',
          })
        }).catch(() => {
          toast({
            title: 'Error',
            description: 'Failed to update appointment. Please try again.',
          })
          setIsAppointmentDialogOpen(false)
        })
      }

      
    } catch (error) {
      console.error('Error saving appointment:', error)
      toast({
        title: 'Error',
        description: 'Failed to save appointment. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteAppointment = async (appointmentId) => {
    // if (confirm('Are you sure you want to delete this appointment?')) {
      try {
        // await Appointment.delete(appointmentId)

        dispatch(deleteAppointment(appointmentId)).then(() => {
          setIsAppointmentDialogOpen(false)
          // loadData()
          toast({
            title: 'Success',
            description: 'Appointment deleted successfully',
          })

          dispatch(setDeleteAppointmentModal({ open: false }))

        }).catch(() => {
          dispatch(setDeleteAppointmentModal({ open: false }))
          toast({
          title: 'Error',
          description: 'Failed to delete appointment. Please try again.',
          variant: 'destructive',
        })
        })

      } catch (error) {
        dispatch(setDeleteAppointmentModal({ open: false }))
        console.error('Error deleting appointment:', error)
        toast({
          title: 'Error',
          description: 'Failed to delete appointment. Please try again.',
          variant: 'destructive',
        })
      }
    // }
  }

  const filteredAppointments = appointments.filter((appointment) => {
    if (!searchQuery) return true

    const query = searchQuery.toLowerCase()

    // Check if the appointment title or description matches
    if (
      appointment.title?.toLowerCase().includes(query) ||
      appointment.description?.toLowerCase().includes(query) ||
      appointment.location?.toLowerCase().includes(query)
    ) {
      return true
    }

    // Check if any participant name matches
    return appointment.participants.some((participantId) => {
      const participant = participants.find((p) => p.id === participantId)
      return participant && participant.name.toLowerCase().includes(query)
    })
  })

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='flex flex-col items-center gap-2'>
          <Loader2 className='h-8 w-8 animate-spin text-gray-500' />
          <p className='text-gray-500'>Loading calendar...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='flex flex-col h-screen'>
      <div className='p-6 border-b bg-white'>
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>Calendar</h1>
            <p className='text-gray-500'>{format(currentDate, 'MMMM yyyy')}</p>
          </div>

          <div className='flex flex-col sm:flex-row gap-3 w-full sm:w-auto'>
            <Button
              className='bg-indigo-600 hover:bg-indigo-700 w-full sm:w-auto'
              onClick={handleCreateAppointment}
            >
              <PlusCircle className='h-5 w-5 mr-2' />
              New Appointment
            </Button>
          </div>
        </div>
      </div>

      <div className='flex-1 overflow-auto'>
        <CalendarGrid
          currentDate={currentDate}
          appointments={filteredAppointments}
          participants={participants}
          onDateChange={setCurrentDate}
          onAppointmentClick={handleAppointmentClick}
          onTimeSlotClick={handleTimeSlotClick}
        />
      </div>

      <AppointmentDialog
        isOpen={isAppointmentDialogOpen}
        onClose={() => setIsAppointmentDialogOpen(false)}
        appointment={currentAppointment}
        isNew={isNewAppointment}
        participants={participants}
        appointments={appointments}
        onSave={handleSaveAppointment}
        onDelete={handleDeleteAppointment}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
      />

      <SeeMore 
        isOpen={isSeeMoreAppointments}
        onClose={() => dispatch(resetSeeMoreAppointments())}
        onAppointmentClick={handleAppointmentClick}
      />

    </div>
  )
}
