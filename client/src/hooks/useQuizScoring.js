import { useCallback } from 'react';
import { useQuiz } from '../context/QuizContext';

export const useQuizScoring = () => {
  const { state, updateState } = useQuiz();

  const calculateSubjectScore = useCallback((answers) => {
    const subjectScores = answers.reduce((acc, answer) => {
      if (answer?.subject) {
        acc[answer.subject] = (acc[answer.subject] || 0) + (answer.correct ? 1 : 0);
      }
      return acc;
    }, {});

    return {
      subjectScores: {
        Science: (subjectScores.Science / 10) * 100,
        Technology: (subjectScores.Technology / 10) * 100,
        English: (subjectScores.English / 10) * 100,
        Art: (subjectScores.Art / 10) * 100,
        Math: (subjectScores.Math / 10) * 100
      }
    };
  }, []);

  return { calculateSubjectScore };
}; 