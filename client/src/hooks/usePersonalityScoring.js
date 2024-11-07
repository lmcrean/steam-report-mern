import { usePersonalityCheckForTies } from './usePersonalityCheckForTies';
import { usePersonalityValidation } from './usePersonalityValidation';

export const usePersonalityScoring = () => {
  const { checkForTies } = usePersonalityCheckForTies();
  const { validatePersonalityScores } = usePersonalityValidation();

  const calculateAndSubmitScores = (answers) => {
    const traitTotals = answers.reduce((acc, ans) => {
      if (ans && ans.trait) {
        acc[ans.trait] = (acc[ans.trait] || 0) + ans.value;
      }
      return acc;
    }, {});
    
    const traitPercentages = Object.keys(traitTotals).reduce((acc, trait) => {
      acc[trait] = Math.round((traitTotals[trait] / 45) * 100);
      return acc;
    }, {});

    console.log('📊 Calculated trait percentages:', traitPercentages);

    const noTies = checkForTies(traitPercentages);

    if (noTies) {
      return validatePersonalityScores(traitPercentages);
    }
    // If there are ties, we'll handle the UI transition in the Quiz component
    return false;
  };

  return { calculateAndSubmitScores };
}; 