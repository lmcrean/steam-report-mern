import { useContext } from 'react';
import { QuizContext } from '../context/QuizContext';
import { useNextSection } from './useNextSection';

export const usePersonalityScoring = () => {
  const { updateState } = useContext(QuizContext);
  const { moveToNextSection } = useNextSection();

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

    updateState({ personalityScores: traitPercentages });
    return moveToNextSection();
  };

  return { calculateAndSubmitScores };
}; 