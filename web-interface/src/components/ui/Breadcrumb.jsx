import { Link } from 'react-router-dom';

export default function Breadcrumb({ items = [], className = '' }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center space-x-2 text-sm ${className}`}
    >
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <svg
                  className="w-4 h-4 text-gray-400 mx-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}

              {isLast ? (
                <span
                  className="font-medium text-gray-900"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                item.href ? (
                  <Link
                    to={item.href}
                    className="text-gray-600 hover:text-emerald-600 transition-colors duration-200 hover:underline"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    onClick={item.onClick}
                    className="text-gray-600 hover:text-emerald-600 transition-colors duration-200 hover:underline focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded"
                  >
                    {item.label}
                  </button>
                )
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// Breadcrumb Item Component (for custom usage)
export function BreadcrumbItem({
  children,
  href,
  onClick,
  isLast = false,
  className = ''
}) {
  return (
    <li className={`flex items-center ${className}`}>
      {isLast ? (
        <span
          className="font-medium text-gray-900"
          aria-current="page"
        >
          {children}
        </span>
      ) : (
        <>
          {href ? (
            <Link
              to={href}
              className="text-gray-600 hover:text-emerald-600 transition-colors duration-200 hover:underline"
            >
              {children}
            </Link>
          ) : (
            <button
              onClick={onClick}
              className="text-gray-600 hover:text-emerald-600 transition-colors duration-200 hover:underline focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded"
            >
              {children}
            </button>
          )}
          <svg
            className="w-4 h-4 text-gray-400 mx-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </>
      )}
    </li>
  );
}

// Alternative: Slash separator breadcrumb
export function BreadcrumbSlash({ items = [], className = '' }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center space-x-2 text-sm ${className}`}
    >
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <span className="text-gray-400 mx-2" aria-hidden="true">/</span>
              )}

              {isLast ? (
                <span
                  className="font-medium text-gray-900"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                item.href ? (
                  <Link
                    to={item.href}
                    className="text-gray-600 hover:text-emerald-600 transition-colors duration-200 hover:underline"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    onClick={item.onClick}
                    className="text-gray-600 hover:text-emerald-600 transition-colors duration-200 hover:underline focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded"
                  >
                    {item.label}
                  </button>
                )
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
