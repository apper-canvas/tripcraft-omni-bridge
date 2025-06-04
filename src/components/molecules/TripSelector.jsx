import { motion } from 'framer-motion'
import { format } from 'date-fns'

const TripSelector = ({ trips, selectedTrip, onSelectTrip }) => (
  <div className="flex overflow-x-auto scrollbar-hide gap-2 mb-6 pb-2">
    {trips.map((trip, index) => (
      <motion.button
        key={trip.id}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onSelectTrip(trip)}
        className={`flex-shrink-0 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
          selectedTrip?.id === trip.id
            ? 'border-primary bg-primary text-white shadow-travel'
            : 'border-surface-200 bg-white dark:bg-surface-800 text-surface-700 dark:text-surface-300 hover:border-primary/50'
        }`}
      >
        <div className="text-sm font-medium">{trip.name}</div>
        <div className="text-xs opacity-75">
          {trip.startDate && format(new Date(trip.startDate), 'MMM dd, yyyy')}
        </div>
      </motion.button>
    ))}
  </div>
)

export default TripSelector