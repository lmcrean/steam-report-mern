import { useContext } from 'react';
import { QuizContext } from '../context/QuizContext';
import { useNextSection } from './useNextSection';

export const usePersonalityValidation = () => {
  const { updateState } = useContext(QuizContext);
  const { moveToNextSection } = useNextSection();

  const validatePersonalityScores = (scores, preferredTrait = null) => {    
    try {
      console.log('🔍 Validating personality scores:', JSON.stringify(scores, null, 2));
      
      if (preferredTrait) {
        // Handle tie-breaker case
        console.log('👔 Processing tie-breaker selection:', preferredTrait);
        updateState({
          traitPercentages: scores,
          preferredTrait,
          needsPersonalityTiebreaker: false
        });
      } else {
        // Handle normal case (no ties)
        updateState({
          traitPercentages: scores
        });
      }
      
      moveToNextSection();
      return true;
    } catch (error) {
      console.error('❌ Error validating personality scores:', error);
      return false;
    }
  };

  return { validatePersonalityScores };
}; 