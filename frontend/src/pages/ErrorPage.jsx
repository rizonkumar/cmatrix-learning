import React, { useEffect, useState } from "react";
import { AlertTriangle, Home, RefreshCw, Mail } from "lucide-react";
import Button from "../components/common/Button";
import { getErrorDetails, clearErrorDetails } from "../utils/errorHandler";

const ErrorPage = ({ error, resetError }) => {
  const [storedError, setStoredError] = useState(null);

  useEffect(() => {
    const errorDetails = getErrorDetails();
    if (errorDetails) {
      setStoredError(errorDetails);
      clearErrorDetails();
    }
  }, []);

  const displayError =
    error || (storedError ? { message: storedError.message } : null);
  const handleRefresh = () => {
    if (resetError) {
      resetError();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
            <AlertTriangle className="w-12 h-12 text-red-600 dark:text-red-400" />
          </div>
        </div>

        <div className="mb-6">
          <div className="text-8xl font-bold text-red-600 dark:text-red-400 select-none">
            Oops!
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Something went wrong
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
          We encountered an unexpected error. Our team has been notified and is
          working to fix it. Please try refreshing the page or contact support
          if the problem persists.
        </p>

        {displayError && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 text-left">
            <h3 className="text-sm font-semibold text-red-800 dark:text-red-200 mb-2">
              Error Details:
            </h3>
            <p className="text-sm text-red-700 dark:text-red-300 font-mono break-all">
              {displayError.message || "Unknown error occurred"}
            </p>
            {storedError?.timestamp && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                Occurred at: {new Date(storedError.timestamp).toLocaleString()}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button
            onClick={handleRefresh}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>

          <button
            onClick={() => (window.location.href = "/")}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 w-full sm:w-auto justify-center"
          >
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center mb-4">
            <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-2" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Need immediate help?
            </span>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Contact our support team for assistance:
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="mailto:support@cmatrix-learning.com"
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
            >
              <Mail className="w-4 h-4 mr-2" />
              Email Support
            </a>

            <Button
              variant="outline"
              size="sm"
              onClick={() => window.history.back()}
              className="text-sm"
            >
              Go Back
            </Button>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Error ID: {Date.now().toString(36).toUpperCase()}
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            If this error continues, please include the error ID above when
            contacting support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
