import { useContext } from 'react';
import { QuizContext } from '../context/QuizContext';
import { checkForTies } from '../utils/checkForTies';
import { SCORE_TOLERANCE } from '../constants/quizConstants';

export const usePersonalityValidation = () => {
  const { state, updateState } = useContext(QuizContext);

  const validatePersonalityScores = (scores) => {
    try {
      const personalityTies = checkForTies(scores, SCORE_TOLERANCE);
      
      if (personalityTies.length > 1) {
        updateState({ 
          personalityTies,
          needsPreferenceSelection: true 
        });
      } else {
        updateState({ 
          preferredTrait: personalityTies[0],
          needsPreferenceSelection: false 
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error validating personality scores:', error);
      return false;
    }
  };

  return { validatePersonalityScores };
}; 