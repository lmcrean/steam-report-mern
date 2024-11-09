import { useContext } from 'react';
import { QuizContext } from '../../context/QuizContext';

export const useSubjectValidation = () => {
  const { updateState } = useContext(QuizContext);

  const validateSubjectScores = (scores, preferredSubject = null) => {
    try {
      // Update context with final scores and navigate directly to results
      updateState({
        subjectPercentages: scores,
        needsSubjectTieBreaker: false,
        subjectTies: [],
        preferredSubject,
        section: 'results'  // Directly set the section to results
      });
      
      return true;
    } catch (error) {
      console.error('❌ Error validating subject scores:', error);
      return false;
    }
  };

  return { validateSubjectScores };
}; 