import { useContext } from 'react';
import { QuizContext } from '../../context/QuizContext';
import { useNextSection } from '../shared/useNextSection';

export const useSubjectValidation = () => {
  const { updateState } = useContext(QuizContext);
  const { moveToNextSection } = useNextSection();

  const validateSubjectScores = (scores, preferredSubject = null) => {
    try {
      console.log('🔍 Validating subject scores:', scores);
      // First update the scores and clear tie state
      updateState(prevState => ({
        ...prevState,
        subjectPercentages: scores,
        needsSubjectTieBreaker: false,
        subjectTies: [],
        preferredSubject,
        section: 'results' // Explicitly set to results section
      }));
      
      return true;
    } catch (error) {
      console.error('❌ Error validating subject scores:', error);
      return false;
    }
  };

  return { validateSubjectScores };
}; 