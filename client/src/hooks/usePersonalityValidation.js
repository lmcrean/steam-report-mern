import { useContext } from 'react';
import { QuizContext } from '../context/QuizContext';

export const usePersonalityValidation = () => {
  const { updateState } = useContext(QuizContext);

  const validatePersonalityScores = (scores) => {    
    try {
      console.log('🔍 Validating personality scores:', JSON.stringify(scores, null, 2));
      
      // Single source of truth for storing scores in context
      updateState({
        traitPercentages: scores,
        validatedPersonalityScores: scores
      });
      
      return true;
    } catch (error) {
      console.error('❌ Error validating personality scores:', error);
      return false;
    }
  };

  return { validatePersonalityScores };
}; 