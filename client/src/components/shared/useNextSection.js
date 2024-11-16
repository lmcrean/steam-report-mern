import { useCallback, useContext } from 'react';
import { QUIZ_SECTIONS } from '../../context/quizConstants';
import { QuizContext } from '../../context/QuizContext';

export const useNextSection = () => {
  const { state, updateState } = useContext(QuizContext);

  const moveToNextSection = useCallback(() => {
    const currentIndex = QUIZ_SECTIONS.indexOf(state.section);
    if (currentIndex < QUIZ_SECTIONS.length - 1) { // Prevent navigation beyond the final quiz section.
      let nextSection = QUIZ_SECTIONS[currentIndex + 1];
      if (nextSection === 'personality-tiebreaker' && !state.needsPersonalityTieBreaker) {
        nextSection = 'subject'; // The next section is a personality tiebreaker and the user has ALREADY resolved the tie, soskip it. 
      }
      else if (nextSection === 'subject-tiebreaker' && !state.needsSubjectTieBreaker) {
        nextSection = 'results'; // The next section is a subject tiebreaker and the user has ALREADY resolved the tie, so go to results.
      }
      // The next section is not a tiebreaker or the user has NOT resolved the tie, so move to the next section.
      updateState({ section: nextSection });
      return true;
    }
    return false;
  }, [state, updateState]);

  return { moveToNextSection };
}; 