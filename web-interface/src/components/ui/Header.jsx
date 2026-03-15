import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header({
  logo,
  title = 'AgriCapture',
  navigation = [],
  rightContent,
  className = '',
  sticky = true
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <header
      className={`bg-white border-b border-gray-200 z-40 ${
        sticky ? 'sticky top-0' : ''
      } ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            {logo && (
              <Link to="/" className="flex items-center">
                {typeof logo === 'string' ? (
                  <img src={logo} alt={title} className="h-8 w-auto" />
                ) : (
                  logo
                )}
              </Link>
            )}
            {title && (
              <Link
                to="/"
                className="text-xl font-semibold text-gray-900 hover:text-emerald-600 transition-colors duration-200"
              >
                {title}
              </Link>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navigation.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                  isActivePath(item.href)
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
                aria-current={isActivePath(item.href) ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Content */}
          <div className="hidden md:flex items-center gap-3">
            {rightContent}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <nav className="px-4 py-3 space-y-1">
            {navigation.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActivePath(item.href)
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
                aria-current={isActivePath(item.href) ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {rightContent && (
            <div className="px-4 py-3 border-t border-gray-200">
              {rightContent}
            </div>
          )}
        </div>
      )}
    </header>
  );
}

// Simple Header variant (no navigation)
export function SimpleHeader({ title, leftContent, rightContent, className = '' }) {
  return (
    <header className={`bg-white border-b border-gray-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            {leftContent}
            {title && (
              <h1 className="text-xl font-semibold text-gray-900">
                {title}
              </h1>
            )}
          </div>

          {rightContent && (
            <div className="flex items-center gap-3">
              {rightContent}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

// Header with search
export function HeaderWithSearch({
  title,
  onSearch,
  searchPlaceholder = 'Search...',
  navigation = [],
  rightContent,
  className = ''
}) {
  return (
    <header className={`bg-white border-b border-gray-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <div className="flex items-center gap-6">
            {title && (
              <h1 className="text-xl font-semibold text-gray-900 whitespace-nowrap">
                {title}
              </h1>
            )}

            <nav className="hidden lg:flex items-center gap-1">
              {navigation.map((item, index) => (
                <Link
                  key={index}
                  to={item.href}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="relative flex-1">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="search"
                placeholder={searchPlaceholder}
                onChange={(e) => onSearch?.(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {rightContent}
          </div>
        </div>
      </div>
    </header>
  );
}
