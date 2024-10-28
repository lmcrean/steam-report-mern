import React from 'react';

const ProgressBar = ({ progress, total }) => {
  const percentage = (progress / total) * 100;
  
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
      <div 
        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export default ProgressBar;