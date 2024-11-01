// QuizContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const QuizContext = createContext(null);

const STORAGE_KEY = 'quiz_state';

const initialState = {
  section: 'menu',
  username: '',
  progress: 0,
  personalityAnswers: [],
  subjectAnswers: [],
  results: null,
  startTime: null,
  completionTime: null,
  preferredTrait: null,
  preferredSubject: null,
  personalityBonus: null,
  subjectBonus: null
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};

export const QuizProvider = ({ children }) => {
  const [state, setState] = useState(() => {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY);
      return savedState ? JSON.parse(savedState) : initialState;
    } catch (error) {
      console.error('Error loading quiz state:', error);
      return initialState;
    }
  });

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

  const setSection = (section) => updateState({ section });
  const setUsername = (username) => updateState({ username });

  const sections = [
    'menu',
    'username',
    'personality',
    'subject',
    'preference-selection',
    'results',
    'leaderboard'
  ];

  const calculateTopScores = (answers, type) => {
    if (!Array.isArray(answers) || !answers.length) {
      console.error('Invalid answers array in calculateTopScores');
      return [];
    }
    
    let scores = {};
    if (type === 'personality') {
      ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Neuroticism']
        .forEach((trait, index) => {
          const traitAnswers = answers.filter((_, i) => i % 5 === index);
          const score = traitAnswers.reduce((sum, ans) => sum + (ans?.value || 0), 0);
          scores[trait] = (score / 45) * 100;
        });
    } else {
      ['Science', 'Technology', 'English', 'Art', 'Math'].forEach((subject, index) => {
        const subjectAnswers = answers.slice(index * 10, (index + 1) * 10);
        const correct = subjectAnswers.filter(a => a?.isCorrect).length;
        scores[subject] = (correct / 10) * 100;
      });
    }

    const maxScore = Math.max(...Object.values(scores));
    const TOLERANCE = 0.1;
    
    return Object.entries(scores)
      .filter(([_, score]) => Math.abs(score - maxScore) <= TOLERANCE)
      .map(([name]) => name);
  };

  const moveToNextSection = () => {
    const currentIndex = sections.indexOf(state.section);

    if (currentIndex < sections.length - 1) {
      const nextSection = sections[currentIndex + 1];

      if (nextSection === 'preference-selection') {
        const hasPersonalityTie = calculateTopScores(state.personalityAnswers, 'personality').length > 1;
        const hasSubjectTie = calculateTopScores(state.subjectAnswers, 'subject').length > 1;

        if (hasPersonalityTie || hasSubjectTie) {
          updateState({ section: nextSection });
        } else {
          updateState({
            section: 'results',
            completionTime: new Date().toISOString()
          });
        }
      } else {
        updateState({
          section: nextSection,
          ...(nextSection === 'personality' ? { startTime: new Date().toISOString() } : {}),
          ...(nextSection === 'results' ? { completionTime: new Date().toISOString() } : {})
        });
      }
      return true;
    }
    return false;
  };

  const validateQuizCompletion = () => {
    const { personalityAnswers, subjectAnswers, username } = state;
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
      validateQuizCompletion,
      calculateTopScores
    }}>
      {children}
    </QuizContext.Provider>
  );
};

export { QuizContext };
export default QuizProvider;