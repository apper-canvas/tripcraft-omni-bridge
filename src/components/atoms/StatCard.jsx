import { motion } from 'framer-motion'
import ApperIcon from '../ApperIcon'

const StatCard = ({ icon, value, label, color }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="text-center"
  >
    <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg`}>
      <ApperIcon name={icon} className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
    </div>
    <div className="text-2xl sm:text-3xl font-heading font-bold text-surface-900 dark:text-white mb-1">
      {value}
    </div>
    <div className="text-sm sm:text-base text-surface-600 dark:text-surface-300">
      {label}
    </div>
  </motion.div>
)

export default StatCard