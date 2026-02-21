export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  dot = false,
  ...props
}) {
  const baseClasses = 'inline-flex items-center font-medium rounded-full transition-all duration-200';

  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-emerald-100 text-emerald-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',

    // Priority variants
    low: 'bg-gray-100 text-gray-700',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800',

    // Status variants
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-600',
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-blue-100 text-blue-800'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base'
  };

  const dotColors = {
    default: 'bg-gray-600',
    primary: 'bg-emerald-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    danger: 'bg-red-600',
    info: 'bg-blue-600',
    low: 'bg-gray-500',
    medium: 'bg-yellow-600',
    high: 'bg-orange-600',
    critical: 'bg-red-600',
    active: 'bg-green-600',
    inactive: 'bg-gray-400',
    pending: 'bg-yellow-600',
    completed: 'bg-blue-600'
  };

  return (
    <span
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dotColors[variant]}`}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}

// Specialized Priority Badge
export function PriorityBadge({ priority = 'low', ...props }) {
  const priorityMap = {
    1: { variant: 'low', label: 'Low' },
    2: { variant: 'medium', label: 'Medium' },
    3: { variant: 'high', label: 'High' },
    4: { variant: 'critical', label: 'Critical' }
  };

  const config = priorityMap[priority] || priorityMap[1];

  return (
    <Badge variant={config.variant} dot {...props}>
      {config.label}
    </Badge>
  );
}

// Specialized Status Badge
export function StatusBadge({ status = 'inactive', label, ...props }) {
  return (
    <Badge variant={status} dot {...props}>
      {label || status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}
