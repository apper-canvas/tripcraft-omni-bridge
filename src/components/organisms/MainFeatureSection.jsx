import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, addDays, differenceInDays } from 'date-fns'

import itineraryService from '../../services/api/itineraryService'
import activityService from '../../services/api/activityService'

import ApperIcon from '../ApperIcon'
import Button from '../atoms/Button'
import Loader from '../atoms/Loader'
import Text from '../atoms/Text'
import TripInfoCard from '../molecules/TripInfoCard'
import TripOverviewStats from '../molecules/TripOverviewStats'
import ActivityCard from '../molecules/ActivityCard'
import TripCreationForm from './TripCreationForm'
import ActivityForm from './ActivityForm'

const activityTypes = [
  { id: 'transport', name: 'Transport', icon: 'Plane', color: 'from-blue-500 to-blue-600' },
  { id: 'accommodation', name: 'Hotel', icon: 'Building', color: 'from-purple-500 to-purple-600' },
  { id: 'dining', name: 'Dining', icon: 'UtensilsCrossed', color: 'from-orange-500 to-orange-600' },
  { id: 'sightseeing', name: 'Sightseeing', icon: 'Camera', color: 'from-emerald-500 to-emerald-600' },
  { id: 'activity', name: 'Activity', icon: 'Zap', color: 'from-pink-500 to-pink-600' }
]

const MainFeatureSection = ({ trips, selectedTrip, onTripSelect, onCreateTrip }) => {
  const [activeView, setActiveView] = useState('timeline')
  const [itinerary, setItinerary] = useState(null)
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedDay, setSelectedDay] = useState(0)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showActivityModal, setShowActivityModal] = useState(false)
  const [draggedActivity, setDraggedActivity] = useState(null)

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
      toast.error("Failed to load itinerary")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTripSubmit = async (tripData) => {
    try {
      await onCreateTrip(tripData)
      setShowCreateModal(false)
      toast.success("Trip created successfully!")
    } catch (err) {
      toast.error("Failed to create trip")
    }
  }

  const handleCreateActivitySubmit = async (newActivityData) => {
    if (!newActivityData.name || !newActivityData.startTime) {
      toast.error("Please fill in required fields")
      return
    }

    try {
      const activityData = {
        ...newActivityData,
        startTime: `${itinerary?.days[selectedDay]?.date}T${newActivityData.startTime}`,
        endTime: newActivityData.endTime ? `${itinerary?.days[selectedDay]?.date}T${newActivityData.endTime}` : null,
        location: newActivityData.location.name ? newActivityData.location : { name: 'TBD', coordinates: { lat: 0, lng: 0 } }
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

  const tripStats = [
    { icon: "Plane", value: trips.length, label: "Total Trips", color: "from-blue-500 to-blue-600" },
    { icon: "MapPin", value: trips.reduce((acc, trip) => acc + (trip.destinations?.length || 0), 0), label: "Destinations", color: "from-emerald-500 to-emerald-600" },
    { icon: "Calendar", value: trips.reduce((acc, trip) => {
      if (trip.startDate && trip.endDate) {
        const start = new Date(trip.startDate)
        const end = new Date(trip.endDate)
        return acc + Math.ceil((end - start) / (1000 * 60 * 60 * 24))
      }
      return acc
    }, 0), label: "Total Days", color: "from-amber-500 to-amber-600" },
    { icon: "Heart", value: trips.filter(trip => trip.collaborators?.length > 1).length, label: "Group Trips", color: "from-pink-500 to-pink-600" }
  ]

  if (loading) {
    return (
      <div className="container py-12">
        <div className="glass-morphism rounded-3xl p-8 shadow-travel">
          <div className="flex items-center justify-center h-64">
            <Loader />
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
                <Text type="h3" className="mb-2">Trip Planner</Text>
                <Text type="p">
                  Create and manage your travel itineraries
                </Text>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                {!selectedTrip ? (
                  <Button onClick={() => setShowCreateModal(true)} icon={ApperIcon} iconProps={{ name: "Plus" }} size="lg">
                    Create Trip
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => setActiveView(activeView === 'timeline' ? 'map' : 'timeline')}
                      icon={ApperIcon} iconProps={{ name: activeView === 'timeline' ? "Map" : "Calendar" }}
                    >
                      {activeView === 'timeline' ? 'Map View' : 'Timeline'}
                    </Button>
                    
                    <Button onClick={() => setShowActivityModal(true)} icon={ApperIcon} iconProps={{ name: "Plus" }}>
                      Add Activity
                    </Button>
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
                
                <Text type="h4" className="mb-4">Ready to Plan Your Next Adventure?</Text>
                <Text type="p" className="mb-8 max-w-md mx-auto">
                  Create your first trip to get started with detailed itinerary planning.
                </Text>
                
                <Button onClick={() => setShowCreateModal(true)} icon={ApperIcon} iconProps={{ name: "Plus" }} size="xl">
                  Create Your First Trip
                </Button>
              </div>
            ) : (
              <div>
                {/* Trip Header */}
                <div className="flex flex-col lg:flex-row gap-6 mb-8">
                  <TripInfoCard trip={selectedTrip} />
                  <TripOverviewStats stats={[
                    { icon: "Calendar", value: itinerary?.days?.length || 0, label: "Days", color: "text-primary" },
                    { icon: "Zap", value: activities?.length || 0, label: "Activities", color: "text-secondary" },
                    { icon: "DollarSign", value: getTotalCost(), label: "Budget", color: "text-accent" },
                    { icon: "Users", value: selectedTrip.collaborators?.length || 0, label: "Travelers", color: "text-pink-500" }
                  ].map(stat => ({
                    ...stat,
                    color: stat.color === 'text-primary' ? 'from-primary to-primary' : // This is a placeholder for actual gradient classes
                            stat.color === 'text-secondary' ? 'from-secondary to-secondary' :
                            stat.color === 'text-accent' ? 'from-accent to-accent' :
                            stat.color === 'text-pink-500' ? 'from-pink-500 to-pink-500' : stat.color
                  }))} />
                </div>

                {/* Timeline View */}
                {activeView === 'timeline' && itinerary?.days && (
                  <div>
                    {/* Day Tabs */}
                    <div className="flex overflow-x-auto scrollbar-hide gap-2 mb-6 pb-2">
                      {itinerary.days.map((day, index) => (
                        <Button
                          key={index}
                          onClick={() => setSelectedDay(index)}
                          variant={selectedDay === index ? 'primary' : 'outline'}
                          className="flex-shrink-0"
                        >
                          <div className="text-sm font-medium">Day {index + 1}</div>
                          <div className="text-xs opacity-75">
                            {format(new Date(day.date), 'MMM dd')}
                          </div>
                        </Button>
                      ))}
                    </div>

                    {/* Activities Timeline */}
                    <div
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, selectedDay)}
                      className="min-h-[400px] bg-surface-50/50 dark:bg-surface-800/20 rounded-2xl p-6 border-2 border-dashed border-surface-200 dark:border-surface-700"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <Text type="h5">
                          {format(new Date(itinerary.days[selectedDay].date), 'EEEE, MMMM dd')}
                        </Text>
                        <Button
                          variant="ghost"
                          onClick={() => setShowActivityModal(true)}
                          icon={ApperIcon} iconProps={{ name: "Plus" }}
                        >
                          Add Activity
                        </Button>
                      </div>

                      <div className="space-y-4">
                        <AnimatePresence>
                          {getDayActivities(selectedDay).map((activity) => (
                            <ActivityCard
                              key={activity.id}
                              activity={activity}
                              activityType={getActivityType(activity.type)}
                              onDragStart={handleDragStart}
                            />
                          ))}
                        </AnimatePresence>
                        
                        {getDayActivities(selectedDay).length === 0 && (
                          <div className="text-center py-12">
                            <ApperIcon name="Calendar" className="w-12 h-12 text-surface-400 mx-auto mb-4" />
                            <Text type="p" className="mb-4">
                              No activities planned for this day
                            </Text>
                            <Button onClick={() => setShowActivityModal(true)} icon={ApperIcon} iconProps={{ name: "Plus" }} size="lg">
                              Add First Activity
                            </Button>
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
                    <Text type="h5" className="mb-2">Interactive Map Coming Soon</Text>
                    <Text type="p">
                      Visualize your trip route and activity locations on an interactive map.
                    </Text>
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
                <Text type="h4">Create New Trip</Text>
                <Button variant="ghost" onClick={() => setShowCreateModal(false)} icon={ApperIcon} iconProps={{ name: "X" }} className="w-10 h-10 rounded-full bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600" />
              </div>
              <TripCreationForm onSubmit={handleCreateTripSubmit} onClose={() => setShowCreateModal(false)} />
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
                <Text type="h4">Add Activity</Text>
                <Button variant="ghost" onClick={() => setShowActivityModal(false)} icon={ApperIcon} iconProps={{ name: "X" }} className="w-10 h-10 rounded-full bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600" />
              </div>
              <ActivityForm onSubmit={handleCreateActivitySubmit} onClose={() => setShowActivityModal(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default MainFeatureSection