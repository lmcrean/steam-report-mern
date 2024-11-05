import { useCallback } from 'react';
import { SCORE_TOLERANCE } from '../constants/quizConstants';

export const usePersonalityScoring = () => {
  const calculatePersonalityScore = useCallback((answers) => {
    const scores = {
      Openness: 0,
      Conscientiousness: 0,
      Extraversion: 0,
      Agreeableness: 0,
      Neuroticism: 0
    };

    Object.keys(scores).forEach((trait, traitIndex) => {
      const traitAnswers = answers.slice(traitIndex * 5, (traitIndex + 1) * 5);
      const traitTotal = traitAnswers.reduce((sum, answer) => {
        return sum + (answer?.value || 0);
      }, 0);
      scores[trait] = (traitTotal / 45) * 100;
    });

    return scores;
  }, []);

  return { calculatePersonalityScore };
}; 