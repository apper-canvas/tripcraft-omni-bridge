import { motion } from 'framer-motion'
import ApperIcon from '../ApperIcon'
import IconWrapper from '../atoms/IconWrapper'
import ToggleButton from '../atoms/ToggleButton'
import Text from '../atoms/Text'

const HeaderActions = ({ selectedTrip, toggleDarkMode, darkMode }) => (
  <div className="flex items-center space-x-2 sm:space-x-4">
    {selectedTrip && (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden sm:flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-lg px-3 py-2 border border-surface-200/50"
      >
        <ApperIcon name="Calendar" className="w-4 h-4 text-primary" />
        <Text type="span">{selectedTrip.name}</Text>
      </motion.div>
    )}
    
    <IconWrapper
      iconName={darkMode ? "Sun" : "Moon"}
      onClick={toggleDarkMode}
    />
  </div>
)

export default HeaderActions