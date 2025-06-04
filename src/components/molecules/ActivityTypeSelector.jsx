import { motion } from 'framer-motion'
import ApperIcon from '../ApperIcon'
import Label from '../atoms/Label'

const ActivityTypeSelector = ({ selectedType, onSelect, activityTypes }) => {
  return (
    <div>
      <Label>Activity Type</Label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {activityTypes.map((type) => (
          <motion.button
            key={type.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => onSelect(type.id)}
            className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all duration-200 ${
              selectedType === type.id
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
  )
}

export default ActivityTypeSelector