import { useState } from 'react'
import { motion } from 'framer-motion'
import FormField from '../molecules/FormField'
import Button from '../atoms/Button'
import ApperIcon from '../ApperIcon'

const TripCreationForm = ({ onSubmit, onClose }) => {
  const [newTrip, setNewTrip] = useState({
    name: '',
    startDate: '',
    endDate: '',
    destinations: ['']
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setNewTrip(prev => ({ ...prev, [name]: value }))
  }

  const handleDestinationChange = (index, value) => {
    const updated = [...newTrip.destinations]
    updated[index] = value
    setNewTrip(prev => ({ ...prev, destinations: updated }))
  }

  const addDestination = () => {
    setNewTrip(prev => ({ ...prev, destinations: [...prev.destinations, ''] }))
  }

  const removeDestination = (index) => {
    const updated = newTrip.destinations.filter((_, i) => i !== index)
    setNewTrip(prev => ({ ...prev, destinations: updated }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!newTrip.name || !newTrip.startDate || !newTrip.endDate) {
      // toast error handled by MainFeatureSection
      return
    }

    const tripData = {
      ...newTrip,
      destinations: newTrip.destinations.filter(dest => dest.trim() !== ''),
      collaborators: [{ id: 1, name: "You", avatar: "👤" }],
      coverImage: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=400&fit=crop"
    }
    
    onSubmit(tripData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField
        label="Trip Name"
        id="tripName"
        name="name"
        type="text"
        value={newTrip.name}
        onChange={handleChange}
        placeholder="Amazing Europe Adventure"
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Start Date"
          id="startDate"
          name="startDate"
          type="date"
          value={newTrip.startDate}
          onChange={handleChange}
          required
        />
        <FormField
          label="End Date"
          id="endDate"
          name="endDate"
          type="date"
          value={newTrip.endDate}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
          Destinations
        </label>
        {newTrip.destinations.map((dest, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <FormField
              id={`destination-${index}`}
              type="text"
              value={dest}
              onChange={(e) => handleDestinationChange(index, e.target.value)}
              placeholder="Paris, France"
              className="flex-1"
              labelClassName="sr-only" // Hide label for individual inputs if multiple
            />
            {index > 0 && (
              <Button
                variant="danger"
                onClick={() => removeDestination(index)}
                icon={ApperIcon} iconProps={{ name: "X" }}
                className="w-12 h-12 rounded-xl"
              />
            )}
          </div>
        ))}
        
        <Button
          variant="ghost"
          onClick={addDestination}
          icon={ApperIcon} iconProps={{ name: "Plus" }}
          className="text-sm"
        >
          Add Destination
        </Button>
      </div>

      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" className="flex-1">
          Create Trip
        </Button>
      </div>
    </form>
  )
}

export default TripCreationForm