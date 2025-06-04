import { motion } from 'framer-motion'
import StatCard from '../atoms/StatCard'
import Card from '../atoms/Card'
import Text from '../atoms/Text'

const TripStatistics = ({ trips }) => {
  const statsData = [
    { icon: "Plane", value: trips.length, label: "Total Trips", color: "from-blue-500 to-blue-600" },
    { icon: "MapPin", value: trips.reduce((acc, trip) => acc + (trip.destinations?.length || 0), 0), label: "Destinations", color: "from-emerald-500 to-emerald-600" },
    { icon: "Calendar", value: trips.reduce((acc, trip) => {
      if (trip.startDate && trip.endDate) {
        const start = new Date(trip.startDate)
        const end = new Date(trip.endDate)
        return acc + Math.ceil((end - start) / (1000 * 60 * 60 * 24))
      }
      return acc
    }, 0), label: "Total Days", color: "from-amber-500 to-amber-600" },
    { icon: "Heart", value: trips.filter(trip => trip.collaborators?.length > 1).length, label: "Group Trips", color: "from-pink-500 to-pink-600" }
  ]

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="py-12 sm:py-16"
    >
      <div className="container">
        <Card>
          <Text type="h3" className="text-center mb-8 sm:mb-12">
            Your Travel Statistics
          </Text>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {statsData.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>
        </Card>
      </div>
    </motion.section>
  )
}

export default TripStatistics