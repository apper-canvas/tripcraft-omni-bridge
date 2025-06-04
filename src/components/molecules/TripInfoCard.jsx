import { format } from 'date-fns'
import ApperIcon from '../ApperIcon'
import Text from '../atoms/Text'

const TripInfoCard = ({ trip }) => (
  <div className="flex-1">
    <div className="flex items-center space-x-3 mb-4">
      <img
        src={trip.coverImage}
        alt={trip.name}
        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shadow-card"
      />
      <div>
        <Text type="h4">{trip.name}</Text>
        <Text type="p">
          {trip.startDate && trip.endDate && (
            `${format(new Date(trip.startDate), 'MMM dd')} - ${format(new Date(trip.endDate), 'MMM dd, yyyy')}`
          )}
        </Text>
      </div>
    </div>
    
    {trip.destinations?.length > 0 && (
      <div className="flex flex-wrap gap-2">
        {trip.destinations.map((dest, index) => (
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
)

export default TripInfoCard