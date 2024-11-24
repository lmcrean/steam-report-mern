import { useCallback, useContext } from 'react';
import { QuizContext } from './QuizContext';
import { INITIAL_STATE } from './quizConstants';

export const useResetQuizContext = () => {
  const { updateState } = useContext(QuizContext);

  const resetQuiz = useCallback(() => {
    console.log('resetQuiz called');
    
    if (!updateState) {
      console.error('updateState is undefined in resetQuiz');
      return;
    }

    try {
      // Pass INITIAL_STATE directly to trigger complete reset
      updateState(INITIAL_STATE);
      console.log('Reset completed with initial state:', INITIAL_STATE);
    } catch (error) {
      console.error('Error in resetQuiz:', error);
    }
  }, [updateState]);

  return {
    resetQuiz
  };
};
