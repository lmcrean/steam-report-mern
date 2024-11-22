import { useEffect } from 'react';
import { useContext } from 'react';
import { QuizContext } from './QuizContext';

export const usePrepareResult = () => {
  const { state } = useContext(QuizContext);
  
  const prepareResults = () => {
    const { traitPercentages, subjectPercentages, preferredTrait, preferredSubject } = state;
    
    // Calculate max scores and find corresponding names
    const maxPersonalityScore = Math.max(...Object.values(traitPercentages));
    const maxSubjectScore = Math.max(...Object.values(subjectPercentages));

    // Find the trait and subject names that correspond to max scores
    const maxPersonalityTrait = Object.entries(traitPercentages)
      .find(([trait, score]) => score === maxPersonalityScore)?.[0];
    
    const maxSubjectName = Object.entries(subjectPercentages)
      .find(([subject, score]) => score === maxSubjectScore)?.[0];

    return {
      maxPersonalityScore,
      maxSubjectScore,
      maxPersonalityTrait,
      maxSubjectName,
      isReady: true
    };
  };

  useEffect(() => {
    if (state.traitPercentages && state.subjectPercentages) {
      const results = prepareResults();
      // Here you would update the context with the prepared results
      // dispatch({ type: 'SET_PREPARED_RESULTS', payload: results });
    }
  }, [state.traitPercentages, state.subjectPercentages]);

  return {
    maxPersonalityScore: state.maxPersonalityScore,
    maxSubjectScore: state.maxSubjectScore,
    maxPersonalityTrait: state.maxPersonalityTrait,
    maxSubjectName: state.maxSubjectName,
    isReady: state.isReady
  };
};
