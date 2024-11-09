import { useContext } from 'react';
import { QuizContext } from '../../context/QuizContext';
import { usePersonalityValidation } from './usePersonalityValidation';

export const usePersonalityCheckForTies = () => {
  const { updateState } = useContext(QuizContext);
  const { validatePersonalityScores } = usePersonalityValidation();

  const checkForTies = (traitPercentages) => {
    // Find the highest score
    const maxScore = Math.max(...Object.values(traitPercentages));
    
    // Find all traits that share the highest score (with exact matching)
    const tiedTraits = Object.entries(traitPercentages)
      .filter(([_, score]) => Math.abs(score - maxScore) < 0.01) // Use small epsilon for float comparison
      .map(([trait]) => trait)
      .sort(); // Sort to ensure consistent order

    // If there's more than one trait with the highest score
    if (tiedTraits.length > 1) {

      updateState({
        traitPercentages,
        personalityTies: tiedTraits,
        needsPersonalityTieBreaker: true,
        section: 'personality-tiebreaker'
      });
      return false;
    }

    // No ties, proceed with validation and move to subject section
    return validatePersonalityScores(traitPercentages);
  };

  return { checkForTies };
};