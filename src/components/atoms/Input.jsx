const Input = ({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  className = '',
  labelClassName = '',
  min,
  rows,
  ...props
}) => {
  const inputClasses = `w-full px-4 py-3 rounded-xl border border-surface-200 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${className}`

  return (
    <div>
      {label && (
        <label htmlFor={id} className={`block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2 ${labelClassName}`}>
          {label} {required && '*'}
        </label>
      )}
      {type === 'textarea' ? (
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`${inputClasses} resize-none`}
          rows={rows}
          {...props}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={inputClasses}
          min={min}
          {...props}
        />
      )}
    </div>
  )
}

export default Input