import ApperIcon from '../ApperIcon'

const ActivityCardIcon = ({ typeColor, iconName }) => (
  <div className={`w-12 h-12 bg-gradient-to-br ${typeColor} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
    <ApperIcon name={iconName} className="w-6 h-6 text-white" />
  </div>
)

export default ActivityCardIcon