import { useContext } from 'react';
import { QuizContext } from '../../context/QuizContext';
import { useNextSection } from '../shared/useNextSection';

// in this file, note that the user has already come from check for ties.
export const usePersonalityValidation = () => {
  const { updateState } = useContext(QuizContext);

  const validatePersonalityScores = (scores, preferredTrait = null) => {    
    try {

      
      if (preferredTrait) {
        // Handle tie-breaker case, clear the ties array
        updateState({
          traitPercentages: scores,
          preferredTrait,
          needsPersonalityTieBreaker: false,
          personalityTies: [], // Clear the ties array
          section: 'subject',
        });
      } else {
        // Handle normal case (no ties)
        updateState({
          traitPercentages: scores,
          needsPersonalityTieBreaker: false,
          section: 'subject'
        });
      }
      return true;
    } catch (error) {
      console.error('❌ Error validating personality scores:', error);
      return false;
    }
  };

  return { validatePersonalityScores };
}; 