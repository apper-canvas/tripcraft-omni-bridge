import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'
import itineraryService from '../services/api/itineraryService'
import activityService from '../services/api/activityService'
import { format, addDays, differenceInDays } from 'date-fns'

const MainFeature = ({ trips, selectedTrip, onTripSelect, onCreateTrip, darkMode }) => {
  const [activeView, setActiveView] = useState('timeline')
  const [itinerary, setItinerary] = useState(null)
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedDay, setSelectedDay] = useState(0)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showActivityModal, setShowActivityModal] = useState(false)
  const [draggedActivity, setDraggedActivity] = useState(null)
  const [newTrip, setNewTrip] = useState({
    name: '',
    startDate: '',
    endDate: '',
    destinations: ['']
  })
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

  useEffect(() => {
    if (selectedTrip) {
      loadItinerary()
    }
  }, [selectedTrip])

  const loadItinerary = async () => {
    if (!selectedTrip) return
    
    setLoading(true)
    try {
      const itineraries = await itineraryService.getAll()
      const tripItinerary = itineraries?.find(it => it.tripId === selectedTrip.id)
      
      if (tripItinerary) {
        setItinerary(tripItinerary)
        const allActivities = await activityService.getAll()
        const tripActivities = allActivities?.filter(activity => 
          tripItinerary.days?.some(day => day.activities?.includes(activity.id))
        ) || []
        setActivities(tripActivities)
      } else {
        // Create default itinerary
        const days = []
        if (selectedTrip.startDate && selectedTrip.endDate) {
          const start = new Date(selectedTrip.startDate)
          const end = new Date(selectedTrip.endDate)
          const dayCount = differenceInDays(end, start) + 1
          
          for (let i = 0; i < dayCount; i++) {
            days.push({
              date: format(addDays(start, i), 'yyyy-MM-dd'),
              activities: []
            })
          }
        }
        
        const newItinerary = await itineraryService.create({
          tripId: selectedTrip.id,
          days,
          totalBudget: 0
        })
        setItinerary(newItinerary)
        setActivities([])
      }
    } catch (err) {
      setError(err.message)
      toast.error("Failed to load itinerary")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTrip = async (e) => {
    e.preventDefault()
    
    if (!newTrip.name || !newTrip.startDate || !newTrip.endDate) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      const tripData = {
        ...newTrip,
        destinations: newTrip.destinations.filter(dest => dest.trim() !== ''),
        collaborators: [{ id: 1, name: "You", avatar: "👤" }],
        coverImage: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=400&fit=crop"
      }
      
      await onCreateTrip(tripData)
      setShowCreateModal(false)
      setNewTrip({ name: '', startDate: '', endDate: '', destinations: [''] })
      toast.success("Trip created successfully!")
    } catch (err) {
      toast.error("Failed to create trip")
    }
  }

  const handleCreateActivity = async (e) => {
    e.preventDefault()
    
    if (!newActivity.name || !newActivity.startTime) {
      toast.error("Please fill in required fields")
      return
    }

    try {
      const activityData = {
        ...newActivity,
        startTime: `${itinerary?.days[selectedDay]?.date}T${newActivity.startTime}`,
        endTime: newActivity.endTime ? `${itinerary?.days[selectedDay]?.date}T${newActivity.endTime}` : null,
        location: newActivity.location.name ? newActivity.location : { name: 'TBD', coordinates: { lat: 0, lng: 0 } }
      }

      const createdActivity = await activityService.create(activityData)
      setActivities(prev => [...(prev || []), createdActivity])
      
      // Update itinerary
      const updatedItinerary = {
        ...itinerary,
        days: itinerary.days.map((day, index) => 
          index === selectedDay 
            ? { ...day, activities: [...(day.activities || []), createdActivity.id] }
            : day
        )
      }
      
      const savedItinerary = await itineraryService.update(itinerary.id, updatedItinerary)
      setItinerary(savedItinerary)
      
      setShowActivityModal(false)
      setNewActivity({
        name: '',
        type: 'sightseeing',
        startTime: '',
        endTime: '',
        location: { name: '', coordinates: { lat: 0, lng: 0 } },
        cost: 0,
        notes: ''
      })
      toast.success("Activity added successfully!")
    } catch (err) {
      toast.error("Failed to create activity")
    }
  }

  const handleDragStart = (activity) => {
    setDraggedActivity(activity)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = async (e, targetDayIndex) => {
    e.preventDefault()
    
    if (!draggedActivity) return

    try {
      // Remove from current day
      const updatedItinerary = {
        ...itinerary,
        days: itinerary.days.map(day => ({
          ...day,
          activities: (day.activities || []).filter(id => id !== draggedActivity.id)
        }))
      }

      // Add to target day
      updatedItinerary.days[targetDayIndex].activities = [
        ...(updatedItinerary.days[targetDayIndex].activities || []),
        draggedActivity.id
      ]

      const savedItinerary = await itineraryService.update(itinerary.id, updatedItinerary)
      setItinerary(savedItinerary)
      setDraggedActivity(null)
      toast.success("Activity moved successfully!")
    } catch (err) {
      toast.error("Failed to move activity")
    }
  }

  const getDayActivities = (dayIndex) => {
    const day = itinerary?.days[dayIndex]
    if (!day?.activities) return []
    
    return activities?.filter(activity => day.activities.includes(activity.id)) || []
  }

  const getActivityType = (type) => {
    return activityTypes.find(t => t.id === type) || activityTypes[0]
  }

  const getTotalCost = () => {
    return activities?.reduce((total, activity) => total + (activity.cost || 0), 0) || 0
  }

  if (loading) {
    return (
      <div className="container py-12">
        <div className="glass-morphism rounded-3xl p-8 shadow-travel">
          <div className="flex items-center justify-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <section className="py-12 sm:py-16">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-morphism rounded-3xl shadow-travel overflow-hidden"
        >
          {/* Header */}
          <div className="border-b border-surface-200/50 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-2xl sm:text-3xl font-heading font-bold text-surface-900 dark:text-white mb-2">
                  Trip Planner
                </h3>
                <p className="text-surface-600 dark:text-surface-300">
                  Create and manage your travel itineraries
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                {!selectedTrip && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center justify-center space-x-2 bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-xl font-semibold shadow-travel hover:shadow-activity transition-all duration-300"
                  >
                    <ApperIcon name="Plus" className="w-5 h-5" />
                    <span>Create Trip</span>
                  </motion.button>
                )}
                
                {selectedTrip && (
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveView(activeView === 'timeline' ? 'map' : 'timeline')}
                      className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm text-surface-700 px-4 py-2 rounded-lg border border-surface-200/50 hover:bg-white/80 transition-all duration-200"
                    >
                      <ApperIcon name={activeView === 'timeline' ? "Map" : "Calendar"} className="w-4 h-4" />
                      <span className="hidden sm:inline">{activeView === 'timeline' ? 'Map View' : 'Timeline'}</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowActivityModal(true)}
                      className="flex items-center space-x-2 bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-lg font-medium shadow-travel hover:shadow-activity transition-all duration-300"
                    >
                      <ApperIcon name="Plus" className="w-4 h-4" />
                      <span className="hidden sm:inline">Add Activity</span>
                    </motion.button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8">
            {!selectedTrip ? (
              <div className="text-center py-12 sm:py-16">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center mb-6 mx-auto"
                >
                  <ApperIcon name="MapPin" className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
                </motion.div>
                
                <h4 className="text-xl sm:text-2xl font-heading font-semibold text-surface-900 dark:text-white mb-4">
                  Ready to Plan Your Next Adventure?
                </h4>
                <p className="text-surface-600 dark:text-surface-300 mb-8 max-w-md mx-auto">
                  Create your first trip to get started with detailed itinerary planning.
                </p>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-xl font-semibold shadow-travel hover:shadow-activity transition-all duration-300"
                >
                  <ApperIcon name="Plus" className="w-5 h-5" />
                  <span>Create Your First Trip</span>
                </motion.button>
              </div>
            ) : (
              <div>
                {/* Trip Header */}
                <div className="flex flex-col lg:flex-row gap-6 mb-8">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-4">
                      <img
                        src={selectedTrip.coverImage}
                        alt={selectedTrip.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shadow-card"
                      />
                      <div>
                        <h4 className="text-xl sm:text-2xl font-heading font-bold text-surface-900 dark:text-white">
                          {selectedTrip.name}
                        </h4>
                        <p className="text-surface-600 dark:text-surface-300">
                          {selectedTrip.startDate && selectedTrip.endDate && (
                            `${format(new Date(selectedTrip.startDate), 'MMM dd')} - ${format(new Date(selectedTrip.endDate), 'MMM dd, yyyy')}`
                          )}
                        </p>
                      </div>
                    </div>
                    
                    {selectedTrip.destinations?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {selectedTrip.destinations.map((dest, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center space-x-1 bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 px-3 py-1 rounded-lg text-sm"
                          >
                            <ApperIcon name="MapPin" className="w-3 h-3" />
                            <span>{dest}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="lg:w-80">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-surface-50 dark:bg-surface-800/50 rounded-xl p-4 text-center">
                        <div className="text-2xl font-heading font-bold text-primary mb-1">
                          {itinerary?.days?.length || 0}
                        </div>
                        <div className="text-sm text-surface-600 dark:text-surface-400">Days</div>
                      </div>
                      <div className="bg-surface-50 dark:bg-surface-800/50 rounded-xl p-4 text-center">
                        <div className="text-2xl font-heading font-bold text-secondary mb-1">
                          {activities?.length || 0}
                        </div>
                        <div className="text-sm text-surface-600 dark:text-surface-400">Activities</div>
                      </div>
                      <div className="bg-surface-50 dark:bg-surface-800/50 rounded-xl p-4 text-center">
                        <div className="text-2xl font-heading font-bold text-accent mb-1">
                          ${getTotalCost()}
                        </div>
                        <div className="text-sm text-surface-600 dark:text-surface-400">Budget</div>
                      </div>
                      <div className="bg-surface-50 dark:bg-surface-800/50 rounded-xl p-4 text-center">
                        <div className="text-2xl font-heading font-bold text-pink-500 mb-1">
                          {selectedTrip.collaborators?.length || 0}
                        </div>
                        <div className="text-sm text-surface-600 dark:text-surface-400">Travelers</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline View */}
                {activeView === 'timeline' && itinerary?.days && (
                  <div>
                    {/* Day Tabs */}
                    <div className="flex overflow-x-auto scrollbar-hide gap-2 mb-6 pb-2">
                      {itinerary.days.map((day, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedDay(index)}
                          className={`flex-shrink-0 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                            selectedDay === index
                              ? 'border-primary bg-primary text-white shadow-travel'
                              : 'border-surface-200 bg-white dark:bg-surface-800 text-surface-700 dark:text-surface-300 hover:border-primary/50'
                          }`}
                        >
                          <div className="text-sm font-medium">Day {index + 1}</div>
                          <div className="text-xs opacity-75">
                            {format(new Date(day.date), 'MMM dd')}
                          </div>
                        </motion.button>
                      ))}
                    </div>

                    {/* Activities Timeline */}
                    <div
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, selectedDay)}
                      className="min-h-[400px] bg-surface-50/50 dark:bg-surface-800/20 rounded-2xl p-6 border-2 border-dashed border-surface-200 dark:border-surface-700"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <h5 className="text-lg font-heading font-semibold text-surface-900 dark:text-white">
                          {format(new Date(itinerary.days[selectedDay].date), 'EEEE, MMMM dd')}
                        </h5>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setShowActivityModal(true)}
                          className="flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-lg hover:bg-primary/20 transition-colors duration-200"
                        >
                          <ApperIcon name="Plus" className="w-4 h-4" />
                          <span>Add Activity</span>
                        </motion.button>
                      </div>

                      <div className="space-y-4">
                        <AnimatePresence>
                          {getDayActivities(selectedDay).map((activity) => {
                            const activityType = getActivityType(activity.type)
                            return (
                              <motion.div
                                key={activity.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                drag
                                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                                onDragStart={() => handleDragStart(activity)}
                                className="activity-card-hover bg-white dark:bg-surface-800 rounded-xl p-4 shadow-card border border-surface-200 dark:border-surface-700 cursor-grab active:cursor-grabbing group"
                              >
                                <div className="flex items-start space-x-4">
                                  <div className={`w-12 h-12 bg-gradient-to-br ${activityType.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                                    <ApperIcon name={activityType.icon} className="w-6 h-6 text-white" />
                                  </div>
                                  
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-2">
                                      <h6 className="font-semibold text-surface-900 dark:text-white truncate">
                                        {activity.name}
                                      </h6>
                                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-sm font-medium text-accent">
                                          ${activity.cost || 0}
                                        </span>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center space-x-4 text-sm text-surface-600 dark:text-surface-400 mb-2">
                                      <div className="flex items-center space-x-1">
                                        <ApperIcon name="Clock" className="w-4 h-4" />
                                        <span>
                                          {activity.startTime && format(new Date(activity.startTime), 'HH:mm')}
                                          {activity.endTime && ` - ${format(new Date(activity.endTime), 'HH:mm')}`}
                                        </span>
                                      </div>
                                      
                                      {activity.location?.name && (
                                        <div className="flex items-center space-x-1">
                                          <ApperIcon name="MapPin" className="w-4 h-4" />
                                          <span className="truncate">{activity.location.name}</span>
                                        </div>
                                      )}
                                    </div>
                                    
                                    {activity.notes && (
                                      <p className="text-sm text-surface-600 dark:text-surface-400 line-clamp-2">
                                        {activity.notes}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            )
                          })}
                        </AnimatePresence>
                        
                        {getDayActivities(selectedDay).length === 0 && (
                          <div className="text-center py-12">
                            <ApperIcon name="Calendar" className="w-12 h-12 text-surface-400 mx-auto mb-4" />
                            <p className="text-surface-500 dark:text-surface-400 mb-4">
                              No activities planned for this day
                            </p>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setShowActivityModal(true)}
                              className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-xl font-medium shadow-travel hover:shadow-activity transition-all duration-300"
                            >
                              <ApperIcon name="Plus" className="w-5 h-5" />
                              <span>Add First Activity</span>
                            </motion.button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Map View Placeholder */}
                {activeView === 'map' && (
                  <div className="bg-surface-50 dark:bg-surface-800/20 rounded-2xl p-8 text-center border-2 border-dashed border-surface-200 dark:border-surface-700">
                    <ApperIcon name="Map" className="w-16 h-16 text-surface-400 mx-auto mb-4" />
                    <h5 className="text-xl font-heading font-semibold text-surface-900 dark:text-white mb-2">
                      Interactive Map Coming Soon
                    </h5>
                    <p className="text-surface-600 dark:text-surface-400">
                      Visualize your trip route and activity locations on an interactive map.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Create Trip Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-surface-800 rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-travel"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-2xl font-heading font-bold text-surface-900 dark:text-white">
                  Create New Trip
                </h4>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowCreateModal(false)}
                  className="w-10 h-10 rounded-full bg-surface-100 dark:bg-surface-700 flex items-center justify-center hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </motion.button>
              </div>

              <form onSubmit={handleCreateTrip} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Trip Name *
                  </label>
                  <input
                    type="text"
                    value={newTrip.name}
                    onChange={(e) => setNewTrip({ ...newTrip, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-surface-200 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                    placeholder="Amazing Europe Adventure"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      value={newTrip.startDate}
                      onChange={(e) => setNewTrip({ ...newTrip, startDate: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-surface-200 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      End Date *
                    </label>
                    <input
                      type="date"
                      value={newTrip.endDate}
                      onChange={(e) => setNewTrip({ ...newTrip, endDate: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-surface-200 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Destinations
                  </label>
                  {newTrip.destinations.map((dest, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={dest}
                        onChange={(e) => {
                          const updated = [...newTrip.destinations]
                          updated[index] = e.target.value
                          setNewTrip({ ...newTrip, destinations: updated })
                        }}
                        className="flex-1 px-4 py-3 rounded-xl border border-surface-200 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                        placeholder="Paris, France"
                      />
                      {index > 0 && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          type="button"
                          onClick={() => {
                            const updated = newTrip.destinations.filter((_, i) => i !== index)
                            setNewTrip({ ...newTrip, destinations: updated })
                          }}
                          className="w-12 h-12 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors flex items-center justify-center"
                        >
                          <ApperIcon name="X" className="w-5 h-5" />
                        </motion.button>
                      )}
                    </div>
                  ))}
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setNewTrip({ ...newTrip, destinations: [...newTrip.destinations, ''] })}
                    className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors text-sm"
                  >
                    <ApperIcon name="Plus" className="w-4 h-4" />
                    <span>Add Destination</span>
                  </motion.button>
                </div>

                <div className="flex gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-6 py-3 rounded-xl border border-surface-200 dark:border-surface-600 text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700 transition-all duration-200"
                  >
                    Cancel
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-travel hover:shadow-activity transition-all duration-300"
                  >
                    Create Trip
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Activity Modal */}
      <AnimatePresence>
        {showActivityModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowActivityModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-surface-800 rounded-2xl p-6 sm:p-8 w-full max-w-lg shadow-travel max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-2xl font-heading font-bold text-surface-900 dark:text-white">
                  Add Activity
                </h4>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowActivityModal(false)}
                  className="w-10 h-10 rounded-full bg-surface-100 dark:bg-surface-700 flex items-center justify-center hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </motion.button>
              </div>

              <form onSubmit={handleCreateActivity} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Activity Name *
                  </label>
                  <input
                    type="text"
                    value={newActivity.name}
                    onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-surface-200 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                    placeholder="Visit Eiffel Tower"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Activity Type
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {activityTypes.map((type) => (
                      <motion.button
                        key={type.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => setNewActivity({ ...newActivity, type: type.id })}
                        className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all duration-200 ${
                          newActivity.type === type.id
                            ? 'border-primary bg-primary/10'
                            : 'border-surface-200 dark:border-surface-600 hover:border-primary/50'
                        }`}
                      >
                        <div className={`w-8 h-8 bg-gradient-to-br ${type.color} rounded-lg flex items-center justify-center mb-2`}>
                          <ApperIcon name={type.icon} className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-xs font-medium text-surface-700 dark:text-surface-300">
                          {type.name}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Start Time *
                    </label>
                    <input
                      type="time"
                      value={newActivity.startTime}
                      onChange={(e) => setNewActivity({ ...newActivity, startTime: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-surface-200 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={newActivity.endTime}
                      onChange={(e) => setNewActivity({ ...newActivity, endTime: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-surface-200 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={newActivity.location.name}
                      onChange={(e) => setNewActivity({ 
                        ...newActivity, 
                        location: { ...newActivity.location, name: e.target.value }
                      })}
                      className="w-full px-4 py-3 rounded-xl border border-surface-200 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                      placeholder="Champ de Mars, Paris"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Cost ($)
                    </label>
                    <input
                      type="number"
                      value={newActivity.cost}
                      onChange={(e) => setNewActivity({ ...newActivity, cost: Number(e.target.value) })}
                      className="w-full px-4 py-3 rounded-xl border border-surface-200 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={newActivity.notes}
                    onChange={(e) => setNewActivity({ ...newActivity, notes: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-surface-200 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none"
                    rows="3"
                    placeholder="Additional details, reservations, or reminders..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setShowActivityModal(false)}
                    className="flex-1 px-6 py-3 rounded-xl border border-surface-200 dark:border-surface-600 text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700 transition-all duration-200"
                  >
                    Cancel
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-travel hover:shadow-activity transition-all duration-300"
                  >
                    Add Activity
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default MainFeature