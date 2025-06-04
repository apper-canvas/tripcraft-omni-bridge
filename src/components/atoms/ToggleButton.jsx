import { motion } from 'framer-motion'
import ApperIcon from '../ApperIcon'

const ToggleButton = ({ isActive, onClick, activeIcon, inactiveIcon, label, className = '' }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`flex items-center space-x-2 bg-white/60 backdrop-blur-sm text-surface-700 px-4 py-2 rounded-lg border border-surface-200/50 hover:bg-white/80 transition-all duration-200 ${className}`}
  >
    <ApperIcon name={isActive ? activeIcon : inactiveIcon} className="w-4 h-4" />
    {label && <span className="hidden sm:inline">{label}</span>}
  </motion.button>
)

export default ToggleButton