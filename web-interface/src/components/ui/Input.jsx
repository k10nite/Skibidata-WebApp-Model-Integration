import { forwardRef } from 'react';

const Input = forwardRef(function Input({
  type = 'text',
  label,
  error,
  helperText,
  className = '',
  containerClassName = '',
  leftIcon,
  rightIcon,
  disabled = false,
  ...props
}, ref) {
  const baseClasses = 'w-full px-4 py-2 text-gray-900 bg-white border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed';

  const borderClasses = error
    ? 'border-red-500'
    : 'border-gray-300 hover:border-gray-400';

  const paddingClasses = `${leftIcon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''}`;

  return (
    <div className={`relative ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}

        <input
          ref={ref}
          type={type}
          disabled={disabled}
          className={`${baseClasses} ${borderClasses} ${paddingClasses} ${className}`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? 'error-message' : helperText ? 'helper-text' : undefined}
          {...props}
        />

        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>

      {error && (
        <p id="error-message" className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      )}

      {helperText && !error && (
        <p id="helper-text" className="mt-1.5 text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
});

export default Input;

// Search Input Component
export function SearchInput({
  placeholder = 'Search...',
  onSearch,
  className = '',
  ...props
}) {
  const searchIcon = (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );

  return (
    <Input
      type="search"
      placeholder={placeholder}
      leftIcon={searchIcon}
      onChange={(e) => onSearch?.(e.target.value)}
      className={className}
      {...props}
    />
  );
}
