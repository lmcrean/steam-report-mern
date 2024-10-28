import React from 'react';
import { useQuiz } from '../../context/QuizContext';
import ProgressBar from '../shared/ProgressBar';

const SubjectQuiz = () => {
  const { progress, setProgress, answers, setAnswers } = useQuiz();

  return (
    <div className="space-y-6">
      <ProgressBar progress={progress} total={50} />
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">
          STEAM Subject Quiz
        </h2>
        {/* Quiz content will be added here */}
      </div>
    </div>
  );
};

export default SubjectQuiz;