import { motion } from 'framer-motion'
import ApperIcon from '../ApperIcon'
import AppLogo from '../atoms/AppLogo'

const AppLayout = ({ children, darkMode }) => {
  return (
    <div className={`min-h-screen transition-all duration-300 ${darkMode ? 'dark bg-surface-900' : 'bg-gradient-to-br from-blue-50 via-white to-emerald-50'}`}>
      {children}
      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="py-8 sm:py-12 border-t border-surface-200/50 dark:border-surface-700/50"
      >
        <div className="container">
          <div className="text-center">
            <AppLogo textClass="text-transparent" iconClass="w-5 h-5" />
            <p className="text-surface-600 dark:text-surface-400 text-sm sm:text-base">
              Crafting unforgettable journeys, one itinerary at a time.
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}

export default AppLayout