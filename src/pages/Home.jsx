import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'
import MainFeature from '../components/MainFeature'
import tripService from '../services/api/tripService'
import { format } from 'date-fns'

const Home = () => {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedTrip, setSelectedTrip] = useState(null)
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const loadTrips = async () => {
      setLoading(true)
      try {
        const result = await tripService.getAll()
        setTrips(result || [])
        if (result?.length > 0) {
          setSelectedTrip(result[0])
        }
      } catch (err) {
        setError(err.message)
        toast.error("Failed to load trips")
      } finally {
        setLoading(false)
      }
    }
    loadTrips()
  }, [])

  const handleCreateTrip = async (tripData) => {
    try {
      const newTrip = await tripService.create(tripData)
      setTrips(prevTrips => [...(prevTrips || []), newTrip])
      setSelectedTrip(newTrip)
      toast.success("Trip created successfully!")
    } catch (err) {
      toast.error("Failed to create trip")
    }
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className={`min-h-screen transition-all duration-300 ${darkMode ? 'dark bg-surface-900' : 'bg-gradient-to-br from-blue-50 via-white to-emerald-50'}`}>
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-morphism sticky top-0 z-50 border-b border-surface-200/50"
      >
        <div className="container">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-travel">
                <ApperIcon name="MapPin" className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-heading font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                TripCraft
              </h1>
            </motion.div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              {selectedTrip && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="hidden sm:flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-lg px-3 py-2 border border-surface-200/50"
                >
                  <ApperIcon name="Calendar" className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-surface-700">
                    {selectedTrip.name}
                  </span>
                </motion.div>
              )}
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleDarkMode}
                className="w-10 h-10 rounded-lg bg-white/60 backdrop-blur-sm border border-surface-200/50 flex items-center justify-center hover:bg-white/80 transition-all duration-200"
              >
                <ApperIcon name={darkMode ? "Sun" : "Moon"} className="w-5 h-5 text-surface-600" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative py-12 sm:py-20 lg:py-24 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
        <div className="container relative">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl sm:text-4xl lg:text-6xl font-heading font-bold text-surface-900 dark:text-white mb-4 sm:mb-6"
            >
              Plan Your
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"> Perfect Journey</span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg sm:text-xl text-surface-600 dark:text-surface-300 mb-8 sm:mb-12 max-w-2xl mx-auto"
            >
              Create detailed itineraries, collaborate with travel companions, and turn your dream trips into unforgettable experiences.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16"
            >
              {[
                { icon: "MapPin", title: "Interactive Maps", desc: "Visualize your journey" },
                { icon: "Users", title: "Collaborate", desc: "Plan with friends" },
                { icon: "Calendar", title: "Timeline View", desc: "Day-by-day planning" }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="glass-morphism p-6 sm:p-8 rounded-2xl shadow-travel hover:shadow-activity transition-all duration-300 group"
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                    <ApperIcon name={feature.icon} className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-heading font-semibold text-surface-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-surface-600 dark:text-surface-300 text-sm sm:text-base">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Main Feature */}
      <MainFeature
        trips={trips || []}
        selectedTrip={selectedTrip}
        onTripSelect={setSelectedTrip}
        onCreateTrip={handleCreateTrip}
        darkMode={darkMode}
      />

      {/* Trip Stats */}
      {trips?.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="py-12 sm:py-16"
        >
          <div className="container">
            <div className="glass-morphism rounded-3xl p-6 sm:p-8 lg:p-12 shadow-travel">
              <h3 className="text-2xl sm:text-3xl font-heading font-bold text-center text-surface-900 dark:text-white mb-8 sm:mb-12">
                Your Travel Statistics
              </h3>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                {[
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
                ].map((stat) => (
                  <motion.div
                    key={stat.label}
                    whileHover={{ scale: 1.05 }}
                    className="text-center"
                  >
                    <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg`}>
                      <ApperIcon name={stat.icon} className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-heading font-bold text-surface-900 dark:text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm sm:text-base text-surface-600 dark:text-surface-300">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="py-8 sm:py-12 border-t border-surface-200/50 dark:border-surface-700/50"
      >
        <div className="container">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-travel">
                <ApperIcon name="MapPin" className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-heading font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                TripCraft
              </span>
            </div>
            <p className="text-surface-600 dark:text-surface-400 text-sm sm:text-base">
              Crafting unforgettable journeys, one itinerary at a time.
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}

export default Home