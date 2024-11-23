// QuizContext.jsx
import React, { createContext, useState, useCallback } from 'react';
import { INITIAL_STATE } from './quizConstants';

const QuizContext = createContext(null);

export const QuizProvider = ({ children }) => {
  const [state, setState] = useState(INITIAL_STATE);

  const updateState = useCallback((updates) => {
    console.log('📝 QuizProvider - Updating State:', updates);
    setState(prev => {
      const actualUpdates = typeof updates === 'function' ? updates(prev) : updates;
      const newState = { ...prev, ...actualUpdates };
      console.log('✨ QuizProvider - New State:', {
        section: newState.section,
        hasTraitPercentages: !!newState.traitPercentages,
        hasSubjectPercentages: !!newState.subjectPercentages,
        isReady: newState.isReady
      });
      return newState;
    });
  }, []);

  const value = {
    state,
    updateState
  };

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
};

export { QuizContext };