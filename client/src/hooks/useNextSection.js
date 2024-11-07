import { useCallback, useContext } from 'react';
import { QUIZ_SECTIONS } from '../constants/quizConstants';
import { QuizContext } from '../context/QuizContext';

export const useNextSection = () => {
  const { state, updateState } = useContext(QuizContext);

  const moveToNextSection = useCallback(() => {
    try {
      const currentIndex = QUIZ_SECTIONS.indexOf(state.section);

      if (currentIndex < QUIZ_SECTIONS.length - 1) {
        const nextSection = QUIZ_SECTIONS[currentIndex + 1];

        updateState({ section: nextSection });
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Navigation: Error navigating to next section:', error);
      return false;
    }
  }, [state.section, updateState]);

  return { moveToNextSection };
}; 