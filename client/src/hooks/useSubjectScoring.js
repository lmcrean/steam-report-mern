import { useCallback } from 'react';
import { SCORE_TOLERANCE } from '../constants/quizConstants';

export const useSubjectScoring = () => {
  const calculateSubjectScore = useCallback((answers) => {
    const subjectScores = {
      Science: 0,
      Technology: 0,
      English: 0,
      Art: 0,
      Math: 0
    };

    Object.keys(subjectScores).forEach((subject, index) => {
      const subjectAnswers = answers.slice(index * 10, (index + 1) * 10);
      const correctCount = subjectAnswers.filter(answer => answer?.correct).length;
      subjectScores[subject] = (correctCount / 10) * 100;
    });

    return subjectScores;
  }, []);

  return { calculateSubjectScore };
}; 