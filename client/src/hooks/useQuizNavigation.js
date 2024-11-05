import { useCallback } from 'react';
import { QUIZ_SECTIONS, SCORE_TOLERANCE } from '../constants/quizConstants';
import { checkForTies } from '../utils/checkForTies';
import { useQuiz } from '../context/QuizContext';

export const useQuizNavigation = () => {
  const { state, updateState, setSection } = useQuiz();

  const moveToNextSection = useCallback(() => {
    try {
      const currentIndex = QUIZ_SECTIONS.indexOf(state.section);
      console.log('🧭 Navigation: Current section:', {
        section: state.section,
        index: currentIndex
      });

      if (currentIndex < QUIZ_SECTIONS.length - 1) {
        const nextSection = QUIZ_SECTIONS[currentIndex + 1];
        console.log('🔜 Navigation: Next section:', nextSection);

        if (nextSection === 'preference-selection') {
          if (!state.personalityScores || !state.subjectScores) {
            console.log('⚠️ Navigation: Missing scores, cannot proceed');
            return false;
          }

          try {
            const personalityTies = checkForTies(state.personalityScores, SCORE_TOLERANCE);
            const subjectTies = checkForTies(state.subjectScores, SCORE_TOLERANCE);

            console.log('🎯 Navigation: Score analysis:', {
              personalityTies,
              subjectTies
            });

            if (personalityTies.length > 1 || subjectTies.length > 1) {
              console.log('👥 Navigation: Ties detected, moving to preference selection');
              updateState({ section: nextSection });
            } else {
              console.log('✨ Navigation: No ties, moving directly to results');
              updateState({
                section: 'results',
                completionTime: new Date().toISOString()
              });
            }
          } catch (error) {
            console.error('❌ Navigation: Error checking for ties:', error);
            return false;
          }
        } else {
          console.log('➡️ Navigation: Standard section change');
          updateState({
            section: nextSection,
            ...(nextSection === 'personality' ? { startTime: new Date().toISOString() } : {}),
            ...(nextSection === 'results' ? { completionTime: new Date().toISOString() } : {})
          });
        }
        return true;
      }
      console.log('🛑 Navigation: At last section, cannot proceed');
      return false;
    } catch (error) {
      console.error('❌ Navigation: Error navigating to next section:', error);
      return false;
    }
  }, [state, updateState, setSection]);

  return { moveToNextSection };
}; 