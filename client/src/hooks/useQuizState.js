import { useState, useCallback } from 'react';

const useQuizState = (initialState = {}) => {
  const [quizState, setQuizState] = useState({
    currentSection: 'menu',
    personalityAnswers: [],
    subjectAnswers: [],
    currentQuestionIndex: 0,
    ...initialState
  });

  const updateQuizState = useCallback((updates) => {
    setQuizState(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  const resetQuiz = useCallback(() => {
    setQuizState({
      currentSection: 'menu',
      personalityAnswers: [],
      subjectAnswers: [],
      currentQuestionIndex: 0
    });
  }, []);

  return {
    quizState,
    updateQuizState,
    resetQuiz
  };
};

export default useQuizState;