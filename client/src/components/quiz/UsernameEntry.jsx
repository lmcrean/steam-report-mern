import React, { useState } from 'react';
import { useQuiz } from '../../context/QuizContext';
import QuizCard from '../shared/QuizCard';
import Alert from '../shared/Alert';
import { validateUsername } from '../../utils/validators';

const UsernameEntry = () => {
  const { setUsername, moveToNextSection } = useQuiz();
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validateUsername(inputValue);
    
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    setUsername(inputValue);
    moveToNextSection();
  };

  return (
    <QuizCard title="Enter Your Username">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label 
            htmlFor="username" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            placeholder="Enter your username"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setError('');
            }}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                     focus:ring-2 focus:ring-blue-500 dark:bg-slate-700"
          />
          {error && <Alert type="error">{error}</Alert>}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
                     transition-colors"
          >
            Continue
          </button>
        </div>
      </form>
    </QuizCard>
  );
};

export default UsernameEntry;