import { motion } from 'framer-motion'
import ApperIcon from '../ApperIcon'

const AppLogo = ({ textClass = '', iconClass = 'w-5 h-5 sm:w-6 sm:h-6' }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="flex items-center space-x-3"
  >
    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-travel">
      <ApperIcon name="MapPin" className={`text-white ${iconClass}`} />
    </div>
    <h1 className={`text-xl sm:text-2xl font-heading font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent ${textClass}`}>
      TripCraft
    </h1>
  </motion.div>
)

export default AppLogo