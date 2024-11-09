import { useCallback, useContext } from 'react';
import { QUIZ_SECTIONS } from '../../context/quizConstants';
import { QuizContext } from '../../context/QuizContext';

export const useNextSection = () => {
  const { state, updateState } = useContext(QuizContext);

  const moveToNextSection = useCallback(() => {
    try {
      const currentIndex = QUIZ_SECTIONS.indexOf(state.section);
      
      if (currentIndex < QUIZ_SECTIONS.length - 1) {
        let nextSection = QUIZ_SECTIONS[currentIndex + 1];
        
        // Skip personality-tiebreaker if no ties
        if (nextSection === 'personality-tiebreaker' && !state.needsPersonalityTieBreaker) {
          nextSection = 'subject';
        }
        // Skip subject-tiebreaker if no ties
        else if (nextSection === 'subject-tiebreaker' && !state.needsSubjectTieBreaker) {
          nextSection = 'results';
        }

        updateState({ section: nextSection });
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Navigation: Error navigating to next section:', error);
      return false;
    }
  }, [state, updateState]);

  return { moveToNextSection };
}; 