// QuizContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_STATE } from '../constants/quizConstants';

const QuizContext = createContext(null);

export const QuizProvider = ({ children }) => {
  const [state, setState] = useState(INITIAL_STATE);

  useEffect(() => {
    console.log('🏁 QuizContext initialized:', state);
  }, []);

  const updateState = (updates) => {
    console.log('📝 QuizState updating with:', updates);
    setState(prev => {
      const newState = { ...prev, ...updates };
      console.log('📊 QuizState updated:', {
        previous: prev,
        updates,
        new: newState
      });
      return newState;
    });
  };

  const value = {
    ...state,
    updateState,
    setSection: (section) => updateState({ section }),
    setUsername: (username) => updateState({ username }),
    resetQuiz: () => setState(INITIAL_STATE),
    moveToNextSection: () => {
      updateState({ section: state.section + 1 });
    }
  };

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) throw new Error('useQuiz must be used within QuizProvider');
  return context;
};