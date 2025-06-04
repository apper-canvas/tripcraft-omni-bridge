import { motion } from 'framer-motion'
import AppLogo from '../atoms/AppLogo'
import HeaderActions from '../molecules/HeaderActions'

const Header = ({ selectedTrip, toggleDarkMode, darkMode }) => (
  <motion.header
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    className="glass-morphism sticky top-0 z-50 border-b border-surface-200/50"
  >
    <div className="container">
      <div className="flex items-center justify-between h-16 sm:h-20">
        <AppLogo />
        <HeaderActions
          selectedTrip={selectedTrip}
          toggleDarkMode={toggleDarkMode}
          darkMode={darkMode}
        />
      </div>
    </div>
  </motion.header>
)

export default Header