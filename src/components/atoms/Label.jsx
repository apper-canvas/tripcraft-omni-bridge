const Label = ({ htmlFor, children, className = '' }) => {
  return (
    <label htmlFor={htmlFor} className={`block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2 ${className}`}>
      {children}
    </label>
  )
}

export default Label