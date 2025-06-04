import { motion } from 'framer-motion'
import ApperIcon from '../ApperIcon'

const FeatureIcon = ({ name, className = '' }) => (
  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
    <ApperIcon name={name} className={`w-6 h-6 sm:w-8 sm:h-8 text-white ${className}`} />
  </div>
)

export default FeatureIcon