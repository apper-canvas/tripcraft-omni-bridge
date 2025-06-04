import { motion } from 'framer-motion'

const Loader = ({ className = 'w-12 h-12 border-4 border-primary border-t-transparent rounded-full' }) => {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      className={className}
    />
  )
}

export default Loader