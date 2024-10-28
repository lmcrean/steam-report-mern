import React from 'react';
import { useQuiz } from '../../context/QuizContext';
import ProgressBar from '../shared/ProgressBar';

const PersonalityQuiz = () => {
  const { progress, setProgress, answers, setAnswers } = useQuiz();

  return (
    <div className="space-y-6">
      <ProgressBar progress={progress} total={25} />
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">
          OCEAN Personality Test
        </h2>
        {/* Quiz content will be added here */}
      </div>
    </div>
  );
};

export default PersonalityQuiz;