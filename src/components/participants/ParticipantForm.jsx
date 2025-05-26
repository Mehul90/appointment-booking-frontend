import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Trash } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../ui/loader'
import { setDeleteParticipantsModal } from '@/store/slices/participantsSlice'

const AVATAR_COLORS = [
  '#6366f1', // Indigo
  '#ec4899', // Pink
  '#8b5cf6', // Purple
  '#14b8a6', // Teal
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#22c55e', // Green
  '#06b6d4', // Cyan
]


/**
 * ParticipantForm component for adding or editing a participant.
 */
export default function ParticipantForm({
  isOpen,
  onClose,
  participant,
  isNew,
  onSave,
  onDelete,
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    color: AVATAR_COLORS[0],
  })
  const [errors, setErrors] = useState({})

  const dispatch = useDispatch()

  const { isLoading: participantInProgress } = useSelector(
    (state) => state.participants
  )

  /**
   * useEffect hook to initialize form data when the modal opens or when a participant is provided.
   * If creating a new participant, it sets default values.
   * If editing an existing participant, it populates the form with the participant's data.
   *
   * Resets errors when the modal opens.
   *
   * @returns {void}
   */
  useEffect(() => {
    if (isNew) {
      setFormData({
        name: '',
        email: '',
        phone: '',
        color:
          AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],

      })
    } else if (participant) {
      setFormData({ ...participant })
    }

    setErrors({})
  }, [isOpen, participant, isNew])

  /**
   * Handles changes to form input fields by updating the form data state and clearing any existing error for the changed field.
   *
   * @param {string} field - The name of the form field being updated.
   * @param {*} value - The new value for the specified form field.
   */
  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
    setErrors({ ...errors, [field]: undefined })
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /**
   * Handles the form submission event.
   * Validates the form data before proceeding.
   * If validation passes, invokes the onSave callback with the current form data.
   *
   * @function
   * @returns {void}
   */
  const handleSubmit = () => {
    if (!validateForm()) return
    onSave(formData)
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle className='text-xl'>
            {isNew ? 'Add New Participant' : 'Edit Participant'}
          </DialogTitle>
          {isNew && (
            <DialogDescription>
              Add a new participant to schedule appointments with.
            </DialogDescription>
          )}
        </DialogHeader>

        <div className='grid gap-4 py-4'>
          <div className='grid gap-2'>
            <Label className="required" htmlFor='name'>Name</Label>
            <Input
              id='name'
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder='Full name'
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className='text-sm text-red-500'>{errors.name}</p>
            )}
          </div>

          <div className='grid gap-2'>
            <Label className="required" htmlFor='email'>Email</Label>
            <Input
              id='email'
              type='email'
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder='email@example.com'
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className='text-sm text-red-500'>{errors.email}</p>
            )}
          </div>

          <div className='grid gap-2'>
            <Label htmlFor='phone'>Phone (Optional)</Label>
            <Input
              id='phone'
              value={formData.phone || ''}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder='(123) 456-7890'
            />
          </div>

          <div className='grid gap-2'>
            <Label>Avatar Color</Label>
            <div className='flex flex-wrap gap-2'>
              {AVATAR_COLORS.map((color) => (
                <div
                  key={color}
                  className={`w-6 h-6 rounded-full cursor-pointer ${
                    formData.color === color
                      ? 'ring-2 ring-offset-2 ring-black'
                      : ''
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleInputChange('color', color)}
                />
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className='flex gap-2'>
          {!isNew && (
            <Button
              variant='outline'
              onClick={() => dispatch(setDeleteParticipantsModal({ open: true, participantId: participant.id }))}
              className='mr-auto text-red-500 hover:text-red-700 hover:bg-red-50'
            >
              <Trash className='h-4 w-4 mr-2' />
              Delete
            </Button>
          )}
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="w-[132px]">
            { participantInProgress ? <Loader /> :  isNew ? 'Add Participant' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
