import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  PlusCircle, 
  Search, 
  Filter, 
  Users, 
  CalendarIcon, 
  Loader2,
  FilterX,
  ArrowUpDown
} from 'lucide-react';
import ParticipantForm from '../components/participants/ParticipantForm';
import ParticipantCard from '../components/participants/ParticipantCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useDispatch, useSelector } from 'react-redux';
import { createParticipants, deleteParticipants, setDeleteParticipantsModal, updateParticipants } from '@/store/slices/participantsSlice';
import { useToast } from '@/components/ui/use-toast';
import DeleteConfirmation from '@/components/calendar/DeleteConfirmation';
import { useGetData } from '@/hooks/useGetData';

/**
 * Participants page component for managing appointment participants.
 */
export default function Participants() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentParticipant, setCurrentParticipant] = useState(null);
  const [isNewParticipant, setIsNewParticipant] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name_asc');

  const dispatch = useDispatch();
  const { toast } = useToast()

  const { isLoading, participants, appointments } = useGetData();

  const { deleteParticipantsModal, participantId } = useSelector(
    (state) => state.participants
  )

  
  /**
   * Handles the action of adding a new participant.
   * Resets the current participant, marks the form as new, and opens the participant form modal.
   */
  const handleAddParticipant = () => {
    setCurrentParticipant(null);
    setIsNewParticipant(true);
    setIsFormOpen(true);
  };

  /**
   * Handles the editing of a participant.
   * Sets the current participant to be edited, marks the form as editing (not new),
   * and opens the participant form modal/dialog.
   *
   * @param {Object} participant - The participant object to edit.
   */
  const handleEditParticipant = (participant) => {
    setCurrentParticipant(participant);
    setIsNewParticipant(false);
    setIsFormOpen(true);
  };

  /**
   * Handles saving a participant by either creating a new participant or updating an existing one.
   * Dispatches the appropriate Redux action based on whether the participant is new.
   * Displays a toast notification if an error occurs during the operation.
   * Closes the participant form after the operation completes.
   *
   * @async
   * @function handleSaveParticipant
   * @param {Object} participantData - The data of the participant to be saved.
   * @returns {Promise<void>}
   */
  const handleSaveParticipant = async (participantData) => {
    try {
      if (isNewParticipant) {
        dispatch(createParticipants(participantData)).then((response) => {
          if(response.payload.error) {
            toast({
              title: 'Error',
              description: response.payload.message,
              variant: 'destructive',
          })
          }
          
          setIsFormOpen(false);
        }).catch((error) => {
          setIsFormOpen(false);
        });
      } else {
        // await Participant.update(currentParticipant.id, participantData);
        dispatch(updateParticipants({id: currentParticipant.id, participantData})).then((response) => {
          setIsFormOpen(false);
          // loadData();
          if(response.payload.error) {
            toast({
              title: 'Error',
              description: response.payload.message,
              variant: 'destructive',
          })
          }
        })
      }
      
    } catch (error) {
      console.error('Error saving participant:', error);
    }
  };

  /**
   * Handles the deletion of a participant.
   * Dispatches the deleteParticipants action with the given participantId.
   * Closes the form and the delete participants modal upon completion.
   * Handles both success and error cases by closing the form and modal.
   * Logs errors to the console if an exception occurs.
   *
   * @async
   * @function handleDeleteParticipant
   * @returns {Promise<void>} Resolves when the participant has been deleted and UI updated.
   */
  const handleDeleteParticipant = async () => {
    // if (confirm('Are you sure you want to delete this participant? This will not delete any appointments.')) {
      try {
        dispatch(deleteParticipants(participantId)).then(() => {
          setIsFormOpen(false);
          dispatch(setDeleteParticipantsModal({ open: false }))
          // loadData();
          
        }).catch((error) => {
          setIsFormOpen(false);
          dispatch(setDeleteParticipantsModal({ open: false }))
          // loadData();
        });
      } catch (error) {
        console.error('Error deleting participant:', error);
      }
    // }
  };

  /**
   * Returns the number of appointments that include the specified participant.
   *
   * @param {string|number} participantId - The unique identifier of the participant.
   * @returns {number} The count of appointments the participant is involved in.
   */
  const getAppointmentsCountForParticipant = (participantId) => {
    return appointments.filter(appointment => 
      appointment.participants.includes(participantId)
    ).length;
  };

  /**
   * Filters and sorts the list of participants based on the current search query and sort criteria.
   *
   * - Filters participants whose name or email includes the search query (case-insensitive).
   * - Sorts participants by name (ascending/descending) or by the number of appointments (ascending/descending).
   *
   * @returns {Array<Object>} The filtered and sorted array of participant objects.
   */
  const filterAndSortParticipants = () => {
    return participants
      .filter(participant => {
        // Apply search filter
        const matchesSearch = searchQuery === '' || 
          participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          participant.email.toLowerCase().includes(searchQuery.toLowerCase())
        
        return matchesSearch;
      })
      .sort((a, b) => {
        switch(sortBy) {
          case 'name_asc':
            return a.name.localeCompare(b.name);
          case 'name_desc':
            return b.name.localeCompare(a.name);
          case 'appointments_asc':
            return getAppointmentsCountForParticipant(a.id) - getAppointmentsCountForParticipant(b.id);
          case 'appointments_desc':
            return getAppointmentsCountForParticipant(b.id) - getAppointmentsCountForParticipant(a.id);
          default:
            return 0;
        }
      });
  };

  const filteredParticipants = filterAndSortParticipants();

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Participants</h1>
          <p className="text-gray-500">
            Manage participants for appointments
          </p>
        </div>
        
        <Button 
          className="bg-indigo-600 hover:bg-indigo-700 w-full sm:w-auto"
          onClick={handleAddParticipant}
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Add Participant
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search participants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-3">
            
            <Select
              value={sortBy}
              onValueChange={setSortBy}
            >
              <SelectTrigger className="w-full sm:w-44">
                <div className="flex items-center">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  <span>Sort By</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name_asc">Name (A-Z)</SelectItem>
                <SelectItem value="name_desc">Name (Z-A)</SelectItem>
                <SelectItem value="appointments_asc">Appointments (Low-High)</SelectItem>
                <SelectItem value="appointments_desc">Appointments (High-Low)</SelectItem>
              </SelectContent>
            </Select>
            
            {searchQuery && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  setSearchQuery('');
                }}
                title="Clear filters"
              >
                <FilterX className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      ) : filteredParticipants.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-lg border">
          <Users className="h-12 w-12 mx-auto text-gray-300 mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No participants found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery
              ? "Try adjusting your search filters"
              : "Get started by adding your first participant"}
          </p>
          <Button onClick={handleAddParticipant}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Participant
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredParticipants.map(participant => (
            <ParticipantCard
              key={participant.id}
              participant={participant}
              appointmentsCount={getAppointmentsCountForParticipant(participant.id)}
              onEdit={handleEditParticipant}
              onDelete={() => dispatch(setDeleteParticipantsModal({ open: true, participantId: participant.id }))}
              // onViewAppointments={handleViewAppointments}
            />
          ))}
        </div>
      )}
      
      <ParticipantForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        participant={currentParticipant}
        isNew={isNewParticipant}
        onSave={handleSaveParticipant}
      />

      <DeleteConfirmation
          isOpen={deleteParticipantsModal}
          onClose={() => dispatch(setDeleteParticipantsModal({ open: false }))}
          onDelete={() => handleDeleteParticipant()}
          title="Delete Participant"
          description="Are you sure you want to delete this participant? This will not delete any appointments."
      />

    </div>
  );
}