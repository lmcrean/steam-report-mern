import { useContext } from 'react';
import { QuizContext } from '../../context/QuizContext';
import { useNextSection } from '../shared/useNextSection';

export const useSubjectValidation = () => {
  const { updateState } = useContext(QuizContext);
  const { moveToNextSection } = useNextSection();

  const validateSubjectScores = (scores) => {
    try {
      console.log('🔍 Validating subject scores:', JSON.stringify(scores, null, 2));
      
      // Update context with subject scores
      const contextUpdate = {
        subjectPercentages: scores,
        needsSubjectTieBreaker: false
      };
      
      console.log('📝 Updating context with:', contextUpdate);
      updateState(contextUpdate);
      
      console.log('✅ Context updated, moving to next section');
      moveToNextSection();
      return true;
    } catch (error) {
      console.error('❌ Error validating subject scores:', error);
      return false;
    }
  };

  return { validateSubjectScores };
}; 