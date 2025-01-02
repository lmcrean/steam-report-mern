import React from 'react';

const QuizCard = ({ 
  title, 
  children, 
  footer,
  className = "" 
}) => {
  return (
    <div className={`w-full max-w-2xl mx-auto ${className}`}>
      <div className="bg-dark dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
        {title && (
          <div className="px-6 py-4 bg-gray-50 dark:bg-slate-700 border-b border-gray-200 dark:border-slate-600">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {title}
            </h2>
          </div>
        )}
        
        <div className="p-6 text-gray-900 dark:text-white">
          {children}
        </div>

        {footer && (
          <div className="px-6 py-4 bg-gray-50 dark:bg-slate-700 border-t border-gray-200 dark:border-slate-600">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizCard;