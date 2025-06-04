import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-primary to-secondary rounded-3xl flex items-center justify-center mb-8 mx-auto shadow-travel"
          >
            <ApperIcon name="MapPin" className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl sm:text-6xl lg:text-8xl font-heading font-bold text-surface-900 mb-4"
          >
            404
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-heading font-semibold text-surface-700 mb-6"
          >
            Journey Not Found
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-lg sm:text-xl text-surface-600 mb-12 max-w-md mx-auto"
          >
            Looks like this destination doesn't exist on our map. Let's get you back on track!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center"
          >
            <Link
              to="/"
              className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-xl font-semibold hover:shadow-travel transition-all duration-300 group w-full sm:w-auto"
            >
              <ApperIcon name="Home" className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Return Home</span>
            </Link>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center space-x-2 bg-white/60 backdrop-blur-sm text-surface-700 px-8 py-4 rounded-xl font-semibold border border-surface-200 hover:bg-white/80 transition-all duration-300 group w-full sm:w-auto"
            >
              <ApperIcon name="ArrowLeft" className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Go Back</span>
            </motion.button>
          </motion.div>

          {/* Floating Elements */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.1, scale: 1 }}
                transition={{ delay: 1 + i * 0.2, duration: 2 }}
                className={`absolute w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-gradient-to-r from-primary to-secondary`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFound