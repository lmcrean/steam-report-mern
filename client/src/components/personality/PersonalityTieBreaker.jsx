// PersonalityTieBreaker.jsx
import React, { useState } from 'react';
import { useContext } from 'react';
import { QuizContext } from '../../context/QuizContext';
import { usePersonalityValidation } from './usePersonalityValidation';
import Alert from '../shared/Alert';

const PersonalityTieBreaker = () => {
  const [selectedTrait, setSelectedTrait] = useState(null);
  const [error, setError] = useState(null);
  const { validatePersonalityScores } = usePersonalityValidation();
  const { state } = useContext(QuizContext);
  const { personalityTies, traitPercentages } = state;

  const handleSubmit = () => {
    if (!selectedTrait) {
      setError('Please select a trait before continuing');
      return;
    }

    // Get the raw score from the percentage
    const currentScore = Math.round((traitPercentages[selectedTrait] * 45) / 100);
    
    // Add bonus point and recalculate percentage
    const updatedScores = {
      ...traitPercentages,
      [selectedTrait]: Math.round(((currentScore + 1) / 45) * 100)
    };

    validatePersonalityScores(updatedScores, selectedTrait);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-dark dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">We Found a Tie!</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          These personality traits scored equally high. Please select the one that best represents you:
        </p>

        <div className="space-y-4">
          {personalityTies.map(trait => (
            <button
              key={trait}
              onClick={() => setSelectedTrait(trait)}
              className={`px-4 py-2 w-full text-white rounded-lg transition-colors ${
                selectedTrait === trait ? 'bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {trait}
            </button>
          ))}
        </div>

        {error && <Alert type="error">{error}</Alert>}

        <div className="flex justify-end mt-6">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Confirm Selection
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalityTieBreaker;