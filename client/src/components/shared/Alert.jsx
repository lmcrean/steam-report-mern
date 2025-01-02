import React from 'react';

const alertStyles = {
  success: 'bg-green-50 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  error: 'bg-red-50 text-red-800 dark:bg-red-900/50 dark:text-red-300',
  warning: 'bg-yellow-50 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  info: 'bg-blue-50 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
};

const Alert = ({ 
  type = 'info', 
  title, 
  children,
  onClose 
}) => {
  return (
    <div className={`rounded-lg p-4 mb-4 ${alertStyles[type]}`}>
      <div className="flex items-start">
        <div className="flex-1">
          {title && (
            <h3 className="text-sm font-medium mb-1">
              {title}
            </h3>
          )}
          <div className="text-sm">
            {children}
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-3 inline-flex flex-shrink-0 justify-center items-center h-5 w-5 rounded-full hover:bg-black/5 dark:hover:bg-dark/5 transition-colors"
          >
            <span className="sr-only">Close</span>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;