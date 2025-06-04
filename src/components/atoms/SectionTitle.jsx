import { motion } from 'framer-motion'

const SectionTitle = ({ title, subtitle, className = '', titleClass = '', subtitleClass = '' }) => (
  <div className={`text-center max-w-4xl mx-auto ${className}`}>
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className={`text-3xl sm:text-4xl lg:text-6xl font-heading font-bold text-surface-900 dark:text-white mb-4 sm:mb-6 ${titleClass}`}
    >
      {title}
    </motion.h2>
    
    {subtitle && (
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={`text-lg sm:text-xl text-surface-600 dark:text-surface-300 mb-8 sm:mb-12 max-w-2xl mx-auto ${subtitleClass}`}
      >
        {subtitle}
      </motion.p>
    )}
  </div>
)

export default SectionTitle