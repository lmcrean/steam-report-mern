// QuizContext.jsx
import React, { createContext, useState } from 'react';
import { INITIAL_STATE } from '../constants/quizConstants';

const QuizContext = createContext(null);

export const QuizProvider = ({ children }) => {
  const [state, setState] = useState(INITIAL_STATE);

  const updateState = (updates) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  return (
    <QuizContext.Provider value={{ state, updateState }}>
      {children}
    </QuizContext.Provider>
  );
};

export { QuizContext };