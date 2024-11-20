// QuizContext.jsx
import React, { createContext, useState, useCallback } from 'react';
import { INITIAL_STATE } from './quizConstants';

const QuizContext = createContext(null);

export const QuizProvider = ({ children }) => {
  const [state, setState] = useState(INITIAL_STATE);

  const updateState = useCallback((updates) => {
    setState(prev => {
      const actualUpdates = typeof updates === 'function' ? updates(prev) : updates;
      return { ...prev, ...actualUpdates };
    });
  }, []);

  const submitToNetworkBoard = useCallback(async (results) => {
    try {
      const response = await fetch('http://localhost:8000/api/user-result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(results)
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit to network board');
      }
      
      return true;
    } catch (error) {
      console.error('Error submitting to network board:', error);
      return false;
    }
  }, []);

  const value = {
    state,
    updateState,
    submitToNetworkBoard
  };

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
};

export { QuizContext };