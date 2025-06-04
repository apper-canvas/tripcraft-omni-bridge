import { motion } from 'framer-motion'
import FeatureIcon from '../atoms/FeatureIcon'
import Text from '../atoms/Text'

const FeatureItem = ({ icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="glass-morphism p-6 sm:p-8 rounded-2xl shadow-travel hover:shadow-activity transition-all duration-300 group"
  >
    <FeatureIcon name={icon} />
    <Text type="h3" className="mb-2">{title}</Text>
    <Text type="p" className="text-sm sm:text-base">{description}</Text>
  </motion.div>
)

export default FeatureItem