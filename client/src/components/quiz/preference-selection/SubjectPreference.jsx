// SubjectPreference.jsx
import React, { useState } from 'react';
import QuizCard from '../../shared/QuizCard';
import RadioGroup from '../../shared/RadioGroup';
import Alert from '../../shared/Alert';
import { getSubjectDescription } from './preferenceDescriptions';

const SubjectPreference = ({ subjects, onSelect }) => {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [error, setError] = useState(null);

  console.log('SubjectPreference - Available subjects:', subjects);

  const handleSubmit = () => {
    console.log('SubjectPreference - Submitting selection:', selectedSubject);
    if (!selectedSubject) {
      setError('Please select a subject before continuing');
      return;
    }
    onSelect(selectedSubject);
  };

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
            console.log('SubjectPreference - Selection changed:', value);
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