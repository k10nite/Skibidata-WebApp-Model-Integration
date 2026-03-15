export default function Card({
  children,
  className = '',
  hoverable = false,
  padding = 'default',
  ...props
}) {
  const baseClasses = 'bg-white rounded-xl transition-all duration-200';

  const shadowClasses = hoverable
    ? 'shadow-md hover:shadow-lg hover:-translate-y-0.5'
    : 'shadow-md';

  const paddingClasses = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8'
  };

  return (
    <div
      className={`${baseClasses} ${shadowClasses} ${paddingClasses[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

// Card Header Component
export function CardHeader({ children, className = '' }) {
  return (
    <div className={`border-b border-gray-100 pb-4 mb-4 ${className}`}>
      {children}
    </div>
  );
}

// Card Title Component
export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
      {children}
    </h3>
  );
}

// Card Content Component
export function CardContent({ children, className = '' }) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

// Card Footer Component
export function CardFooter({ children, className = '' }) {
  return (
    <div className={`border-t border-gray-100 pt-4 mt-4 ${className}`}>
      {children}
    </div>
  );
}
