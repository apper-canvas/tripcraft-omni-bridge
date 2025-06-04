const Text = ({ children, type = 'p', className = '' }) => {
  const Component = type

  const baseClasses = {
    h1: 'text-2xl sm:text-3xl font-heading font-bold text-surface-900 dark:text-white',
    h2: 'text-xl sm:text-2xl font-heading font-semibold text-surface-900 dark:text-white',
    h3: 'text-lg sm:text-xl font-heading font-semibold text-surface-900 dark:text-white',
    h4: 'text-lg font-heading font-semibold text-surface-900 dark:text-white',
    p: 'text-surface-600 dark:text-surface-300',
    span: 'text-sm font-medium text-surface-700',
    div: ''
  }

  return (
    <Component className={`${baseClasses[type]} ${className}`}>
      {children}
    </Component>
  )
}

export default Text