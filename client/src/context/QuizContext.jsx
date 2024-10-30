import React, { createContext, useContext, useState, useEffect } from 'react';

const QuizContext = createContext(null);

const STORAGE_KEY = 'quiz_state';

// Initial state structure
const initialState = {
  section: 'menu',
  username: '',
  progress: 0,
  personalityAnswers: [],
  subjectAnswers: [],
  results: null,
  startTime: null,
  completionTime: null
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};

export const QuizProvider = ({ children }) => {
  // Initialize state from localStorage or use default
  const [state, setState] = useState(() => {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY);
      return savedState ? JSON.parse(savedState) : initialState;
    } catch (error) {
      console.error('Error loading quiz state:', error);
      return initialState;
    }
  });

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving quiz state:', error);
    }
  }, [state]);

  const updateState = (updates) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  // Add setSection function to directly update the section
  const setSection = (section) => updateState({ section });

  // Define setUsername function
  const setUsername = (username) => updateState({ username });

  // Other functions
  const moveToNextSection = () => {
    const sections = ['menu', 'username', 'personality', 'subject', 'results', 'leaderboard'];
    const currentIndex = sections.indexOf(state.section);
    
    if (currentIndex < sections.length - 1) {
      const nextSection = sections[currentIndex + 1];
      
      // Validate before moving to results
      if (nextSection === 'results') {
        updateState({ 
          section: nextSection,
          completionTime: new Date().toISOString()
        });
      } else {
        updateState({ 
          section: nextSection,
          startTime: nextSection === 'personality' ? new Date().toISOString() : state.startTime
        });
      }
      return true;
    }
    return false;
  };

  const validateQuizCompletion = () => {
    const { personalityAnswers, subjectAnswers, username } = state;
  
    // Enhanced debugging logs
    console.log("Username:", username);
    console.log("Personality Answers Details:", personalityAnswers.map((answer, index) => ({
      questionNumber: index + 1,
      answer: answer
    })));
    console.log("Subject Answers Details:", subjectAnswers.map((answer, index) => ({
      questionNumber: index + 1,
      section: index < 10 ? 'Science' : 
               index < 20 ? 'Technology' :
               index < 30 ? 'English' :
               index < 40 ? 'Art' : 'Math',
      answer: answer,
      isCorrect: answer.correct
    })));
  
    return (
      username && 
      personalityAnswers.length === 25 && 
      subjectAnswers.length === 50 &&
      !personalityAnswers.includes(null) &&
      !subjectAnswers.includes(null)
    );
};
  

  const resetQuiz = () => {
    setState(initialState);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <QuizContext.Provider value={{
      ...state,
      updateState,
      setSection,
      setUsername,
      moveToNextSection,
      resetQuiz,
      validateQuizCompletion
    }}>
      {children}
    </QuizContext.Provider>
  );
};
export default QuizContext;