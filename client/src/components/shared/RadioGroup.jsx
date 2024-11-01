// src/components/shared/RadioGroup.jsx
import React from 'react';

const RadioGroup = ({ 
  options, 
  value, 
  onChange, 
  name,
  orientation = 'vertical'
}) => {
  const layoutClass = orientation === 'vertical' 
    ? 'flex flex-col space-y-3'
    : 'flex flex-row justify-between space-x-4';

  return (
    <div className={layoutClass} role="radiogroup" aria-label="Answer options">
      {options.map((option) => (
        <label
          key={option.value}
          className={`
            relative flex items-center p-4 cursor-pointer
            bg-gray-50 dark:bg-slate-700 rounded-lg
            border-2 transition-all duration-200
            ${value === option.value 
              ? 'border-blue-500 dark:border-blue-400' 
              : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500'}
          `}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            role="radio"
            aria-checked={value === option.value}
          />
          <div className="flex-1 pointer-events-none">
            <div className="flex justify-between">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {option.label}
              </div>
              {option.score !== undefined && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {option.score}
                </div>
              )}
            </div>
            {option.description && (
              <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {option.description}
              </div>
            )}
          </div>
        </label>
      ))}
    </div>
  );
};

export default RadioGroup;