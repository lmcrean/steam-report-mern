import { usePersonalityCheckForTies } from './usePersonalityCheckForTies';
import { usePersonalityValidation } from './usePersonalityValidation';

export const usePersonalityScoring = () => {
  const { checkForTies } = usePersonalityCheckForTies();
  const { validatePersonalityScores } = usePersonalityValidation();

  const calculateAndSubmitScores = (answers) => {
    const traitTotals = answers.reduce((acc, ans) => {
      if (ans && ans.trait) {
        if (!acc[ans.trait]) acc[ans.trait] = [];
        acc[ans.trait].push(ans.value);
      }
      return acc;
    }, {});
    
    const traitPercentages = Object.entries(traitTotals).reduce((acc, [trait, values]) => {
      const total = values.reduce((sum, val) => sum + val, 0);
      acc[trait] = Math.round((total / 45) * 100);
      return acc;
    }, {});



    const noTies = checkForTies(traitPercentages);

    if (noTies) {
      return validatePersonalityScores(traitPercentages);
    }
    return true;
  };

  return { calculateAndSubmitScores };
}; 