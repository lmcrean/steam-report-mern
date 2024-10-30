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
  
    // Enhanced debugging logs with detailed expansions
    console.log("Quiz Completion State:", {
      username,
      personalityAnswersCount: personalityAnswers.length,
      subjectAnswersCount: subjectAnswers.length,
  
      // Expanded section summaries
      scienceSection: {
        answers: subjectAnswers.slice(0, 10).map((answer, idx) => ({
          question: idx + 1,
          isCorrect: answer.isCorrect,
          userAnswer: answer.selectedAnswer,
          correctAnswer: answer.correctAnswer
        })),
        correct: subjectAnswers.slice(0, 10).filter(a => a.isCorrect).length
      },
      technologySection: {
        answers: subjectAnswers.slice(10, 20).map((answer, idx) => ({
          question: idx + 1,
          isCorrect: answer.isCorrect,
          userAnswer: answer.selectedAnswer,
          correctAnswer: answer.correctAnswer
        })),
        correct: subjectAnswers.slice(10, 20).filter(a => a.isCorrect).length
      },
      englishSection: {
        answers: subjectAnswers.slice(20, 30).map((answer, idx) => ({
          question: idx + 1,
          isCorrect: answer.isCorrect,
          userAnswer: answer.selectedAnswer,
          correctAnswer: answer.correctAnswer
        })),
        correct: subjectAnswers.slice(20, 30).filter(a => a.isCorrect).length
      },
      artSection: {
        answers: subjectAnswers.slice(30, 40).map((answer, idx) => ({
          question: idx + 1,
          isCorrect: answer.isCorrect,
          userAnswer: answer.selectedAnswer,
          correctAnswer: answer.correctAnswer
        })),
        correct: subjectAnswers.slice(30, 40).filter(a => a.isCorrect).length
      },
      mathSection: {
        answers: subjectAnswers.slice(40, 50).map((answer, idx) => ({
          question: idx + 1,
          isCorrect: answer.isCorrect,
          userAnswer: answer.selectedAnswer,
          correctAnswer: answer.correctAnswer
        })),
        correct: subjectAnswers.slice(40, 50).filter(a => a.isCorrect).length
      },
  
      // Overall scores
      totalCorrect: subjectAnswers.filter(a => a.isCorrect).length,
      percentageScore: (subjectAnswers.filter(a => a.isCorrect).length / 50) * 100
    });
  
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