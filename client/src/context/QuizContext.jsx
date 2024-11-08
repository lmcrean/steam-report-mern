// QuizContext.jsx
import React, { createContext, useState, useCallback } from 'react';
import { INITIAL_STATE } from './quizConstants';

const QuizContext = createContext(null);

export const QuizProvider = ({ children }) => {
  const [state, setState] = useState(INITIAL_STATE);

  const updateState = useCallback((updates) => {
    setState(prev => {
      // If updates is a function, execute it
      const actualUpdates = typeof updates === 'function' ? updates(prev) : updates;
      const newState = { ...prev, ...actualUpdates };
      
      console.log('📊 Context: New state:', JSON.stringify(newState, null, 2));
      
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