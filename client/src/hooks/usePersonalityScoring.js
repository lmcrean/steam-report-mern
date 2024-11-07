import { useContext } from 'react';
import { QuizContext } from '../context/QuizContext';
import { useNextSection } from './useNextSection';
import { usePersonalityValidation } from './usePersonalityValidation';

export const usePersonalityScoring = () => {
  const { moveToNextSection } = useNextSection();
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

    // Pass to validation for storage and verification
    const isValid = validatePersonalityScores(traitPercentages);

    if (isValid) {
      console.log('✅ Personality scores validated, moving to next section');
      return moveToNextSection();
    }
    return false;
  };

  return { calculateAndSubmitScores };
}; 