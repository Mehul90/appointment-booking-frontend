import { useState } from 'react'
import { format, getUnixTime, parse } from 'date-fns'
import { Button } from '@/components/ui/button'
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
import { useDispatch } from 'react-redux'
import { createAppointment, deleteAppointment,resetSeeMoreAppointments, setDeleteAppointmentModal, updateAppointment } from '@/store/slices/appointmentsSlice'
import SeeMore from '@/components/calendar/SeeMore'
import { useGetData } from '@/hooks/useGetData'


/**
 * Calendar page component for displaying and managing appointments.
 */
export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false)
  const [currentAppointment, setCurrentAppointment] = useState(null)
  const [isNewAppointment, setIsNewAppointment] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const { toast } = useToast()

  const dispatch = useDispatch();

  const { isLoading, participants, appointments, isSeeMoreAppointments } = useGetData();

  /**
   * Handles the event when an appointment is clicked.
   * Sets the current appointment, marks the dialog as editing an existing appointment,
   * and opens the appointment dialog.
   *
   * @param {Object} appointment - The appointment object that was clicked.
   */
  const handleAppointmentClick = (appointment) => {
    setCurrentAppointment(appointment)
    setIsNewAppointment(false)
    setIsAppointmentDialogOpen(true)
  }

  /**
   * Handles the event when a user clicks on a time slot in the calendar.
   *
   * Sets the selected date and time, resets the current appointment,
   * marks the action as creating a new appointment, and opens the appointment dialog.
   *
   * @param {string|Date} date - The date of the selected time slot.
   * @param {string} time - The time of the selected time slot.
   */
  const handleTimeSlotClick = (date, time) => {
    setSelectedDate(date)
    setSelectedTime(time)
    setCurrentAppointment(null)
    setIsNewAppointment(true)
    setIsAppointmentDialogOpen(true)
  }

  /**
   * Initializes the state for creating a new appointment.
   * - Resets the current appointment.
   * - Sets the flag to indicate a new appointment is being created.
   * - Sets the selected date to the current date.
   * - Sets the selected time to 09:00.
   * - Opens the appointment dialog.
   */
  const handleCreateAppointment = () => {
    setCurrentAppointment(null)
    setIsNewAppointment(true)
    setSelectedDate(new Date())
    setSelectedTime('09:00')
    setIsAppointmentDialogOpen(true)
  }

  /**
   * Handles saving an appointment by either creating a new appointment or updating an existing one.
   * Dispatches the appropriate Redux action based on whether the appointment is new or existing.
   * Shows toast notifications for success or error states and closes the appointment dialog accordingly.
   *
   * @async
   * @function
   * @param {Object} appointmentData - The data for the appointment to be saved.
   * @returns {Promise<void>}
   */
  const handleSaveAppointment = async (appointmentData) => {
    try {
      const {date, start_time, end_time, ...rest } = appointmentData;

      const startTimeEpoch = parse(
          `${date} ${start_time}`,
          "yyyy-MM-dd HH:mm",
          new Date()
      );
      const endTimeEpoch = parse(
          `${date} ${end_time}`,
          "yyyy-MM-dd HH:mm",
          new Date()
      );


      const newAppointmentData = {
        ...rest,
        date: date,
        start_time, 
        end_time,
        startTimeEpoch: getUnixTime(startTimeEpoch),
        endTimeEpoch: getUnixTime(endTimeEpoch),
      }

      if (isNewAppointment) {
        dispatch(createAppointment(newAppointmentData)).then((response) => {
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
        dispatch(updateAppointment({ id: currentAppointment.id, data: newAppointmentData })).then(() => {
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

  /**
   * Handles the deletion of an appointment by its ID.
   * Dispatches the deleteAppointment action and manages UI state and notifications based on the result.
   *
   * @async
   * @function
   * @param {string|number} appointmentId - The unique identifier of the appointment to delete.
   * @returns {Promise<void>}
   */
  const handleDeleteAppointment = async (appointmentId) => {
      try {
        dispatch(deleteAppointment(appointmentId)).then(() => {
          setIsAppointmentDialogOpen(false)
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
  }

  /**
   * Filters the list of appointments based on the search query.
   *
   * An appointment is included if:
   * - The search query is empty, or
   * - The appointment's title, description, or location contains the search query (case-insensitive), or
   * - Any participant's name contains the search query (case-insensitive).
   */
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
