import React from 'react';
import { Loader2, RefreshCw, Zap } from 'lucide-react';

/**
 * Enhanced Loading Spinner Component
 * Provides multiple loading variants with better UX
 */

const LoadingSpinner = ({
  size = 'medium',
  variant = 'default',
  message = 'Loading...',
  fullScreen = false,
  overlay = false,
  className = ''
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const iconVariants = {
    default: Loader2,
    refresh: RefreshCw,
    zap: Zap,
    pulse: null // Custom pulse animation
  };

  const Icon = iconVariants[variant];

  const spinnerContent = (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative">
        {variant === 'pulse' ? (
          <div className={`${sizeClasses[size]} bg-blue-600 rounded-full animate-ping`} />
        ) : (
          <Icon
            className={`${sizeClasses[size]} animate-spin text-blue-600`}
          />
        )}
      </div>
      {message && (
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 text-center">
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-900 bg-opacity-90 dark:bg-opacity-90 z-50 flex items-center justify-center">
        {spinnerContent}
      </div>
    );
  }

  if (overlay) {
    return (
      <div className="absolute inset-0 bg-white dark:bg-gray-800 bg-opacity-75 dark:bg-opacity-75 z-10 flex items-center justify-center rounded-lg">
        {spinnerContent}
      </div>
    );
  }

  return spinnerContent;
};

/**
 * InlineLoader - Small inline loading spinner for buttons/forms
 */
export const InlineLoader = ({
  size = 'small',
  message = null,
  className = ''
}) => (
  <div className={`inline-flex items-center space-x-2 ${className}`}>
    <Loader2 className={`${size === 'small' ? 'w-4 h-4' : 'w-5 h-5'} animate-spin text-blue-600`} />
    {message && (
      <span className="text-sm text-gray-600 dark:text-gray-400">{message}</span>
    )}
  </div>
);

/**
 * CardLoader - Loading state for card components
 */
export const CardLoader = ({
  height = '200px',
  message = 'Loading content...'
}) => (
  <div
    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-center"
    style={{ height }}
  >
    <LoadingSpinner message={message} />
  </div>
);

/**
 * PageLoader - Full page loading state
 */
export const PageLoader = ({
  message = 'Loading page...',
  variant = 'default'
}) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="text-center">
      <LoadingSpinner
        size="xl"
        variant={variant}
        message={message}
        className="mb-4"
      />
    </div>
  </div>
);

/**
 * DataLoader - Loading state for data fetching with retry
 */
export const DataLoader = ({
  loading,
  error,
  onRetry,
  children,
  loadingMessage = 'Loading data...',
  errorMessage = 'Failed to load data',
  emptyMessage = 'No data available'
}) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <LoadingSpinner message={loadingMessage} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-center mb-4">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <RefreshCw className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {errorMessage}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Something went wrong while loading the data.
          </p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
        )}
      </div>
    );
  }

  if (!children || (Array.isArray(children) && children.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <Loader2 className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {emptyMessage}
        </h3>
      </div>
    );
  }

  return children;
};

/**
 * ProgressLoader - Loading with progress indicator
 */
export const ProgressLoader = ({
  progress = 0,
  message = 'Processing...',
  size = 'medium'
}) => (
  <div className="flex flex-col items-center justify-center space-y-4">
    <LoadingSpinner size={size} message={message} />
    <div className="w-48 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
      <div
        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
        style={{ width: `${Math.min(progress, 100)}%` }}
      />
    </div>
    <p className="text-sm text-gray-600 dark:text-gray-400">
      {Math.round(progress)}% complete
    </p>
  </div>
);

export { LoadingSpinner };
export default LoadingSpinner;
