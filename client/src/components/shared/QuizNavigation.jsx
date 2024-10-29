import React from 'react';

const QuizNavigation = ({ onNext, onPrev, canProgress, showPrev = true }) => {
  return (
    <div className="flex justify-between mt-6">
      {showPrev && (
        <button
          onClick={onPrev}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 
                   transition-colors dark:bg-gray-700 dark:text-gray-200 
                   dark:hover:bg-gray-600"
          name="Previous"
          type="button"
        >
          Previous
        </button>
      )}
      <button
        onClick={onNext}
        disabled={!canProgress}
        className={`px-4 py-2 rounded-lg transition-colors 
          ${!canProgress 
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
            : 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400'
          } ${!showPrev ? 'ml-auto' : ''}`}
        name="Next"
        type="button"
        aria-disabled={!canProgress}
      >
        Next
      </button>
    </div>
  );
};

export default QuizNavigation;