import { useContext } from 'react';
import { QuizContext } from '../context/QuizContext';
import { usePersonalityValidation } from './usePersonalityValidation';

export const usePersonalityCheckForTies = () => {
  const { updateState } = useContext(QuizContext);
  const { validatePersonalityScores } = usePersonalityValidation();

  const checkForTies = (traitPercentages) => {
    // Find the highest score
    const maxScore = Math.max(...Object.values(traitPercentages));
    
    // Find all traits that share the highest score
    const tiedTraits = Object.entries(traitPercentages)
      .filter(([_, score]) => score === maxScore)
      .map(([trait]) => trait);

    // If there's more than one trait with the highest score
    if (tiedTraits.length > 1) {
      updateState({
        personalityTies: tiedTraits,
        needsPersonalityTiebreaker: true
      });
      return false;
    }

    // No ties, proceed with validation
    return validatePersonalityScores(traitPercentages);
  };

  return { checkForTies };
};