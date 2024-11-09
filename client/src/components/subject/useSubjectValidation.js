import { useContext } from 'react';
import { QuizContext } from '../../context/QuizContext';
import { useNextSection } from '../shared/useNextSection';

export const useSubjectValidation = () => {
  const { updateState } = useContext(QuizContext);
  const { moveToNextSection } = useNextSection();

  const validateSubjectScores = (scores, preferredSubject = null) => {
    try {


      
      // Update context with final scores and clear tie-breaker state
      const contextUpdate = {
        subjectPercentages: scores,
        needsSubjectTieBreaker: false,
        subjectTies: [],
        preferredSubject
      };
      

      updateState(contextUpdate);
      

      moveToNextSection();
      return true;
    } catch (error) {
      console.error('❌ Error validating subject scores:', error);
      return false;
    }
  };

  return { validateSubjectScores };
}; 