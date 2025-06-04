import { motion } from 'framer-motion'
import ApperIcon from '../ApperIcon'

const IconWrapper = ({
  iconName,
  onClick,
  className = '',
  buttonClasses = 'w-10 h-10 rounded-lg bg-white/60 backdrop-blur-sm border border-surface-200/50 flex items-center justify-center hover:bg-white/80 transition-all duration-200',
  iconClasses = 'w-5 h-5 text-surface-600',
  whileHover = { scale: 1.1 },
  whileTap = { scale: 0.95 },
}) => {
  return (
    <motion.button
      whileHover={whileHover}
      whileTap={whileTap}
      onClick={onClick}
      className={`${buttonClasses} ${className}`}
    >
      <ApperIcon name={iconName} className={iconClasses} />
    </motion.button>
  )
}

export default IconWrapper