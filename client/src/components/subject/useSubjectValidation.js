import { useContext } from 'react';
import { QuizContext } from '../../context/QuizContext';

export const useSubjectValidation = () => {
  const { updateState } = useContext(QuizContext);

  const validateSubjectScores = (scores, preferredSubject = null) => {
    updateState({
      subjectPercentages: scores,
      needsSubjectTieBreaker: false,
      subjectTies: [],
      preferredSubject,
      section: 'results'
    });
    return true;
  };

  return { validateSubjectScores };
}; 