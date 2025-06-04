import { motion } from 'framer-motion'
import { format } from 'date-fns'
import ApperIcon from '../ApperIcon'
import ActivityCardIcon from '../atoms/ActivityCardIcon'
import Text from '../atoms/Text'

const ActivityCard = ({ activity, activityType, onDragStart }) => (
  <motion.div
    key={activity.id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    drag
    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
    onDragStart={() => onDragStart(activity)}
    className="activity-card-hover bg-white dark:bg-surface-800 rounded-xl p-4 shadow-card border border-surface-200 dark:border-surface-700 cursor-grab active:cursor-grabbing group"
  >
    <div className="flex items-start space-x-4">
      <ActivityCardIcon typeColor={activityType.color} iconName={activityType.icon} />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-2">
          <Text type="h6" className="truncate">{activity.name}</Text>
          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Text type="span" className="text-sm font-medium text-accent">
              ${activity.cost || 0}
            </Text>
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
          <Text type="p" className="text-sm line-clamp-2">
            {activity.notes}
          </Text>
        )}
      </div>
    </div>
  </motion.div>
)

export default ActivityCard