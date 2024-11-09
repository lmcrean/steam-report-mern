import { useContext } from 'react';
import { QuizContext } from '../../context/QuizContext';

export const usePersonalityValidation = () => {
  const { updateState } = useContext(QuizContext);

  const validatePersonalityScores = (scores, preferredTrait = null) => {
    updateState({
      traitPercentages: scores,
      preferredTrait,
      needsPersonalityTieBreaker: false,
      personalityTies: [],
      section: 'subject'
    });
    return true;
  };

  return { validatePersonalityScores };
}; 