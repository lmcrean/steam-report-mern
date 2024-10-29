import React, { useState, useEffect } from 'react';
import { useQuiz } from '../../context/QuizContext';

const PersonalityQuiz = () => {
  const { personalityAnswers, setPersonalityAnswers, moveToNextSection } = useQuiz();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedValue, setSelectedValue] = useState(null);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    // Import and load questions from personalityQuestions.js
    const loadQuestions = async () => {
      try {
        const { personalityQuestions } = await import('../../data/personalityQuestions');
        setQuestions(personalityQuestions);
      } catch (error) {
        console.error('Error loading personality questions:', error);
        setQuestions([]); // Set empty array on error
      }
    };
    loadQuestions();
  }, []);

  const handleNext = () => {
    if (selectedValue !== null) {
      // Save the answer
      const newAnswers = [...personalityAnswers];
      newAnswers[currentQuestionIndex] = selectedValue;
      setPersonalityAnswers(newAnswers);

      if (currentQuestionIndex < 24) {
        // Move to next question
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedValue(null);
      } else {
        // Quiz completed
        moveToNextSection();
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedValue(personalityAnswers[currentQuestionIndex - 1]);
    }
  };

  if (questions.length === 0) {
    return <div className="text-center">Loading questions...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / 25) * 100;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-600">Question {currentQuestionIndex + 1} of 25</span>
          <span className="text-sm text-gray-600">{progress.toFixed(0)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">OCEAN Personality Test</h2>
        <p className="text-gray-700 mb-6">{currentQuestion.statement}</p>

        <div className="grid grid-cols-9 gap-2 mb-6" role="radiogroup">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((value) => (
            <div key={value} className="relative">
              <input
                type="radio"
                id={`rating-${value}`}
                name="rating"
                value={value}
                checked={selectedValue === value}
                onChange={() => {
                  setSelectedValue(value);
                  // Auto advance after selection
                  setTimeout(() => {
                    if (currentQuestionIndex < 24) {
                      handleNext();
                    }
                  }, 300);
                }}
                className="absolute h-full w-full opacity-0 cursor-pointer"
                aria-label={value.toString()}
              />
              <label
                htmlFor={`rating-${value}`}
                className={`block p-4 rounded-lg text-center transition-all ${
                  selectedValue === value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {value}
              </label>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center text-sm text-gray-600 mb-6">
          <span>Strongly Disagree</span>
          <span>Neutral</span>
          <span>Strongly Agree</span>
        </div>
      </div>

      <div className="flex justify-between">
        {currentQuestionIndex > 0 && (
          <button
            onClick={handlePrevious}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Previous
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={selectedValue === null}
          role="button"
          aria-label="Next"
          name="Next"
          className={`px-6 py-2 rounded-lg transition-colors ml-auto ${
            selectedValue === null
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {currentQuestionIndex === 24 ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default PersonalityQuiz;