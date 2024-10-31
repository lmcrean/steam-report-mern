// SubjectPreference.jsx
import React, { useState } from 'react';
import QuizCard from '../../shared/QuizCard';
import RadioGroup from '../../shared/RadioGroup';
import Alert from '../../shared/Alert';

export const getTraitDescription = (trait) => {
  const descriptions = {
    Openness: "Curiosity and willingness to try new experiences",
    Conscientiousness: "Organization and attention to detail",
    Extraversion: "Energy from social interactions",
    Agreeableness: "Cooperation and consideration of others",
    Neuroticism: "Emotional sensitivity and awareness"
  };
  return descriptions[trait] || "";
};

export const getSubjectDescription = (subject) => {
  const descriptions = {
    Science: "Understanding natural phenomena and scientific principles",
    Technology: "Working with computers and digital systems",
    English: "Communication and literary analysis",
    Art: "Visual creativity and artistic expression",
    Math: "Problem-solving and numerical reasoning"
  };
  return descriptions[subject] || "";
};

const SubjectPreference = ({ subjects, onSelect }) => {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = () => {
    if (!selectedSubject) {
      setError('Please select a subject before continuing');
      return;
    }
    onSelect(selectedSubject);
  };

  // Only create options for the highest scoring subjects
  const options = subjects.map(subject => ({
    value: subject,
    label: subject,
    description: getSubjectDescription(subject)
  }));

  return (
    <QuizCard title="Your Strongest Subjects">
      <div className="space-y-6">
        <p className="text-gray-600 dark:text-gray-300">
          Multiple subjects show equal highest scores. Please select the one that you feel
          most passionate about:
        </p>

        <RadioGroup
          options={options}
          value={selectedSubject}
          onChange={(value) => {
            setSelectedSubject(value);
            setError(null);
          }}
          name="subject-preference"
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

export default SubjectPreference;