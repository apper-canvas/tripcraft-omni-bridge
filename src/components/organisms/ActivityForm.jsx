import { useState } from 'react'
import { motion } from 'framer-motion'
import FormField from '../molecules/FormField'
import ActivityTypeSelector from '../molecules/ActivityTypeSelector'
import Button from '../atoms/Button'
import ApperIcon from '../ApperIcon'

const ActivityForm = ({ onSubmit, onClose }) => {
  const [newActivity, setNewActivity] = useState({
    name: '',
    type: 'sightseeing',
    startTime: '',
    endTime: '',
    location: { name: '', coordinates: { lat: 0, lng: 0 } },
    cost: 0,
    notes: ''
  })

  const activityTypes = [
    { id: 'transport', name: 'Transport', icon: 'Plane', color: 'from-blue-500 to-blue-600' },
    { id: 'accommodation', name: 'Hotel', icon: 'Building', color: 'from-purple-500 to-purple-600' },
    { id: 'dining', name: 'Dining', icon: 'UtensilsCrossed', color: 'from-orange-500 to-orange-600' },
    { id: 'sightseeing', name: 'Sightseeing', icon: 'Camera', color: 'from-emerald-500 to-emerald-600' },
    { id: 'activity', name: 'Activity', icon: 'Zap', color: 'from-pink-500 to-pink-600' }
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'locationName') {
      setNewActivity(prev => ({
        ...prev,
        location: { ...prev.location, name: value }
      }))
    } else {
      setNewActivity(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(newActivity)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField
        label="Activity Name"
        id="activityName"
        name="name"
        type="text"
        value={newActivity.name}
        onChange={handleChange}
        placeholder="Visit Eiffel Tower"
        required
      />

      <ActivityTypeSelector
        selectedType={newActivity.type}
        onSelect={(type) => setNewActivity({ ...newActivity, type })}
        activityTypes={activityTypes}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Start Time"
          id="startTime"
          name="startTime"
          type="time"
          value={newActivity.startTime}
          onChange={handleChange}
          required
        />
        <FormField
          label="End Time"
          id="endTime"
          name="endTime"
          type="time"
          value={newActivity.endTime}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Location"
          id="locationName"
          name="locationName"
          type="text"
          value={newActivity.location.name}
          onChange={handleChange}
          placeholder="Champ de Mars, Paris"
        />
        <FormField
          label="Cost ($)"
          id="cost"
          name="cost"
          type="number"
          value={newActivity.cost}
          onChange={handleChange}
          placeholder="0"
          min="0"
        />
      </div>

      <FormField
        label="Notes"
        id="notes"
        name="notes"
        type="textarea"
        value={newActivity.notes}
        onChange={handleChange}
        rows="3"
        placeholder="Additional details, reservations, or reminders..."
      />

      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" className="flex-1">
          Add Activity
        </Button>
      </div>
    </form>
  )
}

export default ActivityForm