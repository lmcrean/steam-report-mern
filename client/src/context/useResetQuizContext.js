import { useCallback, useContext } from 'react';
import { QuizContext } from './QuizContext';

export const useResetQuizContext = () => {
  const { updateState } = useContext(QuizContext);

  const resetQuiz = useCallback(() => {
    const initialState = {
      username: '',
      section: 'menu',
      currentQuestionIndex: 0,
      answers: [],
      traitPercentages: null,
      subjectPercentages: null,
      preferredTrait: null,
      preferredSubject: null,
      maxPersonalityScore: null,
      maxSubjectScore: null,
      maxPersonalityTrait: null,
      maxSubjectName: null,
      isReady: false
    };

    updateState(initialState);
  }, [updateState]);

  const resetToStart = useCallback(() => {
    updateState({
      section: 'menu',
      currentQuestionIndex: 0,
      answers: []
    });
  }, [updateState]);

  return {
    resetQuiz,     // Complete reset of all quiz state
    resetToStart   // Reset only navigation-related state
  };
};
