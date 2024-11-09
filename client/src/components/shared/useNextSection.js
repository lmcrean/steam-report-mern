import { useCallback, useContext } from 'react';
import { QUIZ_SECTIONS } from '../../context/quizConstants';
import { QuizContext } from '../../context/QuizContext';

export const useNextSection = () => {
  const { state, updateState } = useContext(QuizContext);

  const moveToNextSection = useCallback(() => {
    // Get the index of the current section
    const currentIndex = QUIZ_SECTIONS.indexOf(state.section);
    // If the current section is not the last section, move to the next section
    if (currentIndex < QUIZ_SECTIONS.length - 1) {
      let nextSection = QUIZ_SECTIONS[currentIndex + 1];
      if (nextSection === 'personality-tiebreaker' && !state.needsPersonalityTieBreaker) {
        nextSection = 'subject'; // If the next section is a personality tiebreaker and the user has already resolved the tie, skip it. 
      }
      else if (nextSection === 'subject-tiebreaker' && !state.needsSubjectTieBreaker) {
        nextSection = 'results'; // If the next section is a subject tiebreaker and the user has already resolved the tie, go to results
      }
      // Otherwise, move to the next section.
      updateState({ section: nextSection });
      return true;
    }
    return false;
  }, [state, updateState]);

  return { moveToNextSection };
}; 