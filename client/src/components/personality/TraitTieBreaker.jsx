// TraitTieBreaker.jsx
import React, { useState } from 'react';
import { useContext } from 'react';
import { QuizContext } from '../../context/QuizContext';
import { usePersonalityValidation } from './usePersonalityValidation';

const TraitTieBreaker = () => {
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

    // Add bonus point to selected trait
    const updatedScores = {
      ...traitPercentages,
      [selectedTrait]: traitPercentages[selectedTrait] + 1
    };

    validatePersonalityScores(updatedScores, selectedTrait);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">We Found a Tie!</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          These personality traits scored equally high. Please select the one that best represents you:
        </p>

        <div className="space-y-4">
          {personalities.map(trait => (
            <button
              key={trait}
              onClick={() => setSelectedTrait(trait)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {trait}
            </button>
          ))}
        </div>

        {error && <Alert type="error">{error}</Alert>}

        <div className="flex justify-end">
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

export default TraitTieBreaker;