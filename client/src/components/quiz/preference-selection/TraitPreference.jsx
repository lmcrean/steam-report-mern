// TraitPreference.jsx
import React, { useState } from 'react';
import QuizCard from '../../shared/QuizCard';
import RadioGroup from '../../shared/RadioGroup';
import Alert from '../../shared/Alert';
import { getTraitDescription } from './SubjectPreference';

const TraitPreference = ({ traits, onSelect }) => {
  const [selectedTrait, setSelectedTrait] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = () => {
    if (!selectedTrait) {
      setError('Please select a trait before continuing');
      return;
    }
    onSelect(selectedTrait);
  };

  // Only create options for the highest scoring traits
  const options = traits.map(trait => ({
    value: trait,
    label: trait,
    description: getTraitDescription(trait)
  }));

  return (
    <QuizCard title="Your Strongest Traits">
      <div className="space-y-6">
        <p className="text-gray-600 dark:text-gray-300">
          Multiple traits show equal highest scores. Please select the one that you feel
          best represents you:
        </p>

        <RadioGroup
          options={options}
          value={selectedTrait}
          onChange={(value) => {
            setSelectedTrait(value);
            setError(null);
          }}
          name="trait-preference"
        />

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
    </QuizCard>
  );
};

export default TraitPreference;