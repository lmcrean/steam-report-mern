import React from 'react';

const QuizNavigation = ({ onNext, onPrev, canProgress, showPrev = true }) => {
  return (
    <div className="flex justify-between mt-6">
      {showPrev && (
        <button
          onClick={onPrev}
          className="btn btn-secondary"
        >
          Previous
        </button>
      )}
      <button
        onClick={onNext}
        disabled={!canProgress}
        className={`btn btn-primary disabled:opacity-50 ${!showPrev ? 'ml-auto' : ''}`}
      >
        Next
      </button>
    </div>
  );
};

export default QuizNavigation;