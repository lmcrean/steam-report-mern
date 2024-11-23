import { useEffect, useContext } from 'react';
import { QuizContext } from './QuizContext';

export const usePrepareResult = () => {
  const { state, updateState } = useContext(QuizContext);
  
  const prepareResults = () => {
    const { traitPercentages, subjectPercentages, preferredTrait, preferredSubject } = state;
    
    if (!traitPercentages || !subjectPercentages) {
      console.warn('⚠️ Missing percentages data:', { traitPercentages, subjectPercentages });
      return null;
    }
    
    // Calculate max scores and find corresponding names
    const maxPersonalityScore = Math.max(...Object.values(traitPercentages));
    const maxSubjectScore = Math.max(...Object.values(subjectPercentages));

    // Find the trait and subject names that correspond to max scores
    const maxPersonalityTrait = Object.entries(traitPercentages)
      .find(([trait, score]) => score === maxPersonalityScore)?.[0];
    
    const maxSubjectName = Object.entries(subjectPercentages)
      .find(([subject, score]) => score === maxSubjectScore)?.[0];

    const results = {
      maxPersonalityScore,
      maxSubjectScore,
      maxPersonalityTrait,
      maxSubjectName,
      isReady: true
    };

    return results;
  };

  useEffect(() => {
    if (state.traitPercentages && state.subjectPercentages) {
      const results = prepareResults();
      if (results) {
        updateState(results);
      }
    }
  }, [state.traitPercentages, state.subjectPercentages, updateState]);

  return {
    maxPersonalityScore: state.maxPersonalityScore,
    maxSubjectScore: state.maxSubjectScore,
    maxPersonalityTrait: state.maxPersonalityTrait,
    maxSubjectName: state.maxSubjectName,
    isReady: state.isReady
  };
};
