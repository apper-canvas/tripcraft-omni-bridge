import StatCard from '../atoms/StatCard'

const TripOverviewStats = ({ stats }) => (
  <div className="lg:w-80">
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  </div>
)

export default TripOverviewStats