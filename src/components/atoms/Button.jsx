import { motion } from 'framer-motion'

const Button = ({
  children,
  onClick,
  className = '',
  variant = 'primary', // 'primary', 'secondary', 'ghost'
  size = 'md', // 'sm', 'md', 'lg'
  type = 'button',
  icon: Icon = null,
  iconPosition = 'left', // 'left', 'right'
  whileHover = { scale: 1.05 },
  whileTap = { scale: 0.95 },
  ...props
}) => {
  const baseClasses = "flex items-center justify-center space-x-2 font-semibold transition-all duration-300"
  let variantClasses = ""
  let sizeClasses = ""

  switch (variant) {
    case 'primary':
      variantClasses = "bg-gradient-to-r from-primary to-secondary text-white shadow-travel hover:shadow-activity"
      break
    case 'secondary':
      variantClasses = "bg-white/60 backdrop-blur-sm text-surface-700 border border-surface-200/50 hover:bg-white/80"
      break
    case 'ghost':
      variantClasses = "text-primary hover:text-primary/80"
      break
    case 'danger':
      variantClasses = "bg-red-50 text-red-500 hover:bg-red-100"
      break
    case 'outline':
      variantClasses = "border border-surface-200 dark:border-surface-600 text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700"
      break
    default:
      variantClasses = "bg-gradient-to-r from-primary to-secondary text-white shadow-travel hover:shadow-activity"
  }

  switch (size) {
    case 'sm':
      sizeClasses = "px-3 py-2 rounded-lg text-sm"
      break
    case 'md':
      sizeClasses = "px-4 py-2 rounded-lg text-sm sm:text-base"
      break
    case 'lg':
      sizeClasses = "px-6 py-3 rounded-xl"
      break
    case 'xl':
      sizeClasses = "px-8 py-4 rounded-xl text-md sm:text-lg"
      break
    default:
      sizeClasses = "px-4 py-2 rounded-lg"
  }

  const iconElement = Icon ? (
    <Icon className={size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} />
  ) : null

  return (
    <motion.button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      type={type}
      whileHover={whileHover}
      whileTap={whileTap}
      {...props}
    >
      {iconPosition === 'left' && iconElement}
      {children}
      {iconPosition === 'right' && iconElement}
    </motion.button>
  )
}

export default Button