import { useContext } from 'react';
import { QuizContext } from '../../context/QuizContext';
import { useNextSection } from '../shared/useNextSection';

export const usePersonalityValidation = () => {
  const { updateState } = useContext(QuizContext);
  const { moveToNextSection } = useNextSection();

  const validatePersonalityScores = (scores, preferredTrait = null) => {    
    try {

      
      if (preferredTrait) {
        // Handle tie-breaker case

        updateState({
          traitPercentages: scores,
          preferredTrait,
          needsPersonalityTieBreaker: false,
          personalityTies: [] // Clear the ties array
        });
      } else {
        // Handle normal case (no ties)
        updateState({
          traitPercentages: scores,
          needsPersonalityTieBreaker: false
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