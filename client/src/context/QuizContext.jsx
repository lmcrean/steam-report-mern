// QuizContext.jsx
import React, { createContext, useState, useCallback } from 'react';
import { INITIAL_STATE } from './quizConstants';

const QuizContext = createContext(null);

export const QuizProvider = ({ children }) => {
  const [state, setState] = useState(INITIAL_STATE);

  const updateState = useCallback((updates) => {
    setState(prev => {
      if (updates === INITIAL_STATE) {
        
        const newState = { ...INITIAL_STATE };
        
        // Expose context to window for testing
        if (window) {
          window.quizContext = { state: newState };
        }
        
        return newState;
      }

      // Otherwise, perform partial update
      const actualUpdates = typeof updates === 'function' ? updates(prev) : updates;
      

      const newState = { 
        ...prev, 
        ...actualUpdates 
      };

      // Expose context to window for testing
      if (window) {
        window.quizContext = { state: newState };
      }

      return newState;
    });
  }, []);

  // Initial exposure of context to window
  React.useEffect(() => {
    if (window) {
      window.quizContext = { state };
    }
  }, [state]);

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