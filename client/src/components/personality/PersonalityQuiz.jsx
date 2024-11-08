import React, { useState, useEffect } from 'react';
import { usePersonalityScoring } from './usePersonalityScoring';
import Alert from '../shared/Alert';
import QuizNavigation from '../shared/QuizNavigation';

const PersonalityQuiz = () => {
  const { calculateAndSubmitScores } = usePersonalityScoring();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedValue, setSelectedValue] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState(new Array(25).fill(null));
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const { personalityQuestions } = await import('../../data/personalityQuestions');
        setQuestions(personalityQuestions);
      } catch (error) {
        console.error('Error loading personality questions:', error);
        setError('Failed to load questions. Please try again.');
      }
    };
    loadQuestions();
  }, []);

  const handleNextQuestion = () => {
    if (selectedValue !== null) {
      const newAnswers = [...answers];
      const answer = {
        value: selectedValue,
        trait: questions[currentQuestionIndex].trait,
        questionIndex: currentQuestionIndex,
      };
      
      newAnswers[currentQuestionIndex] = answer;
      setAnswers(newAnswers);

      if (currentQuestionIndex < 24) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedValue(null);
      } else {
        const success = calculateAndSubmitScores(newAnswers);
        if (!success) {
          console.error('❌ Failed to submit personality scores');
          setError('Please answer all questions before proceeding.');
        }
      }
    }
  };

  if (error) {
    return <Alert type="error">{error}</Alert>;
  }

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
        <div className="text-sm text-gray-600 mb-4">
          Testing trait: {currentQuestion.trait}
        </div>
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
                onChange={() => setSelectedValue(value)}
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

      <QuizNavigation 
        onNext={handleNextQuestion}
        canProgress={selectedValue !== null}
      />
    </div>
  );
};

export default PersonalityQuiz;