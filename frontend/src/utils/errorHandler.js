/**
 * Error handling utilities for the C-Matrix Learning application
 */

/**
 * Navigate to the error page programmatically
 * @param {Object} options - Options for error navigation
 * @param {string} options.message - Custom error message
 * @param {Error} options.error - The actual error object
 * @param {boolean} options.replace - Whether to replace the current history entry
 */
export const navigateToErrorPage = (options = {}) => {
  const { message, error, replace = false } = options;

  // Store error details in sessionStorage for the error page to display
  if (error || message) {
    const errorData = {
      message: message || error?.message || "An unexpected error occurred",
      stack: error?.stack,
      timestamp: new Date().toISOString(),
    };
    sessionStorage.setItem("errorDetails", JSON.stringify(errorData));
  }

  // Navigate to error page
  if (replace) {
    window.location.replace("/error");
  } else {
    window.location.href = "/error";
  }
};

/**
 * Handle API errors and optionally navigate to error page
 * @param {Error} error - The API error
 * @param {Object} options - Options for handling
 * @param {boolean} options.navigateToError - Whether to navigate to error page
 * @param {boolean} options.showToast - Whether to show toast notification
 */
export const handleApiError = (error, options = {}) => {
  const { navigateToError = false, showToast = true } = options;

  console.error("API Error:", error);

  // Show toast notification if enabled
  if (showToast && window.toast) {
    window.toast.error(
      error.message || "An error occurred while processing your request"
    );
  }

  // Navigate to error page for critical errors
  if (navigateToError) {
    navigateToErrorPage({
      message: error.message || "Failed to process request",
      error,
    });
  }

  return error;
};

/**
 * Clear stored error details
 */
export const clearErrorDetails = () => {
  sessionStorage.removeItem("errorDetails");
};

/**
 * Get stored error details
 * @returns {Object|null} The stored error details or null
 */
export const getErrorDetails = () => {
  try {
    const errorData = sessionStorage.getItem("errorDetails");
    return errorData ? JSON.parse(errorData) : null;
  } catch (e) {
    console.error("Error parsing stored error details:", e);
    return null;
  }
};

/**
 * Enhanced error boundary helper for async operations
 * @param {Function} asyncFn - The async function to wrap
 * @param {Object} options - Options for error handling
 * @returns {Function} The wrapped async function
 */
export const withErrorHandling = (asyncFn, options = {}) => {
  return async (...args) => {
    try {
      return await asyncFn(...args);
    } catch (error) {
      handleApiError(error, options);
      throw error; // Re-throw to allow caller to handle if needed
    }
  };
};
