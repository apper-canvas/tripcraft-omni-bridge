import { motion } from 'framer-motion'
import SectionTitle from '../atoms/SectionTitle'
import FeatureItem from '../molecules/FeatureItem'

const featureData = [
  { icon: "MapPin", title: "Interactive Maps", desc: "Visualize your journey" },
  { icon: "Users", title: "Collaborate", desc: "Plan with friends" },
  { icon: "Calendar", title: "Timeline View", desc: "Day-by-day planning" }
]

const HeroSection = () => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
    className="relative py-12 sm:py-20 lg:py-24 overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
    <div className="container relative">
      <SectionTitle
        title={<>Plan Your <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"> Perfect Journey</span></>}
        subtitle="Create detailed itineraries, collaborate with travel companions, and turn your dream trips into unforgettable experiences."
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16"
      >
        {featureData.map((feature, index) => (
          <FeatureItem
            key={feature.title}
            icon={feature.icon}
            title={feature.title}
            description={feature.desc}
            delay={0.6 + index * 0.1}
          />
        ))}
      </motion.div>
    </div>
  </motion.section>
)

export default HeroSection