const Card = ({ children, className = '' }) => {
  return (
    <div className={`glass-morphism rounded-3xl p-6 sm:p-8 lg:p-12 shadow-travel ${className}`}>
      {children}
    </div>
  )
}

export default Card