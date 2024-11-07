// QuizContext.jsx
import React, { createContext, useState, useCallback } from 'react';
import { INITIAL_STATE } from '../constants/quizConstants';

const QuizContext = createContext(null);

export const QuizProvider = ({ children }) => {
  const [state, setState] = useState(INITIAL_STATE);

  const updateState = useCallback((updates) => {
    console.log('📝 Context: Updating state with:', updates);
    setState(prev => {
      const newState = { ...prev, ...updates };
      console.log('📊 Context: New state:', newState);
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