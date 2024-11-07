import { useCallback, useContext } from 'react';
import { QUIZ_SECTIONS } from '../constants/quizConstants';
import { checkForPersonalityTies } from '../utils/checkForPersonalityTies';
import { checkForSubjectTies } from '../utils/checkForSubjectTies';
import { QuizContext } from '../context/QuizContext';

export const useNextSection = () => {
  const { state, updateState } = useContext(QuizContext);

  const moveToNextSection = useCallback(() => {
    try {
      const currentIndex = QUIZ_SECTIONS.indexOf(state.section);
      console.log('🧭 Navigation: Current section:', {
        section: state.section,
        index: currentIndex,
        allSections: QUIZ_SECTIONS
      });

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