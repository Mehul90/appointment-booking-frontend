import React, { useState, useEffect } from 'react';
import { Participant, Appointment } from '@/api/entities';
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

export default function Participants() {
  const [participants, setParticipants] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentParticipant, setCurrentParticipant] = useState(null);
  const [isNewParticipant, setIsNewParticipant] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name_asc');

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

  const handleAddParticipant = () => {
    setCurrentParticipant(null);
    setIsNewParticipant(true);
    setIsFormOpen(true);
  };

  const handleEditParticipant = (participant) => {
    setCurrentParticipant(participant);
    setIsNewParticipant(false);
    setIsFormOpen(true);
  };

  const handleSaveParticipant = async (participantData) => {
    try {
      if (isNewParticipant) {
        await Participant.create(participantData);
      } else {
        await Participant.update(currentParticipant.id, participantData);
      }
      
      setIsFormOpen(false);
      loadData();
    } catch (error) {
      console.error('Error saving participant:', error);
    }
  };

  const handleDeleteParticipant = async (participantId) => {
    if (confirm('Are you sure you want to delete this participant? This will not delete any appointments.')) {
      try {
        await Participant.delete(participantId);
        setIsFormOpen(false);
        loadData();
      } catch (error) {
        console.error('Error deleting participant:', error);
      }
    }
  };

  const handleViewAppointments = (participant) => {
    // Navigate to Calendar page with filter
    // In a real implementation, you would filter the calendar to show only this participant's appointments
    alert(`Viewing appointments for ${participant.name}`);
  };

  const getAppointmentsCountForParticipant = (participantId) => {
    return appointments.filter(appointment => 
      appointment.participants.includes(participantId)
    ).length;
  };

  const getDepartments = () => {
    const departments = new Set();
    participants.forEach(participant => {
      if (participant.department) {
        departments.add(participant.department);
      }
    });
    return Array.from(departments);
  };

  const filterAndSortParticipants = () => {
    return participants
      .filter(participant => {
        // Apply search filter
        const matchesSearch = searchQuery === '' || 
          participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          participant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (participant.department && participant.department.toLowerCase().includes(searchQuery.toLowerCase()));
        
        // Apply department filter
        const matchesDepartment = departmentFilter === 'all' || 
          participant.department === departmentFilter;
        
        return matchesSearch && matchesDepartment;
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
  const departments = getDepartments();

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
              value={departmentFilter}
              onValueChange={setDepartmentFilter}
            >
              <SelectTrigger className="w-full sm:w-40">
                <div className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  <span>Department</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
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
            
            {(searchQuery || departmentFilter !== 'all') && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  setSearchQuery('');
                  setDepartmentFilter('all');
                }}
                title="Clear filters"
              >
                <FilterX className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {departmentFilter !== 'all' && (
          <div className="mt-3">
            <Badge variant="secondary" className="text-xs">
              Department: {departmentFilter}
              <button 
                className="ml-1"
                onClick={() => setDepartmentFilter('all')}
              >
                ×
              </button>
            </Badge>
          </div>
        )}
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
            {searchQuery || departmentFilter !== 'all'
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
              onDelete={handleDeleteParticipant}
              onViewAppointments={handleViewAppointments}
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
        onDelete={handleDeleteParticipant}
      />
    </div>
  );
}