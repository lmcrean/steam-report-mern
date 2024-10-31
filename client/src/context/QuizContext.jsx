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
    console.log('Updating state:', updates);
    setState(prev => {
      const newState = { ...prev, ...updates };
      console.log('New state:', newState);
      return newState;
    });
  };

  const setSection = (section) => {
    console.log(`Setting section to: ${section}`);
    updateState({ section });
  };

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
    console.log(`Calculating top scores for ${type}:`, {
      answersLength: answers?.length,
      type
    });
  
    if (!Array.isArray(answers) || !answers.length) {
      console.log('Invalid answers array');
      return [];
    }
    
    let scores = {};
    if (type === 'personality') {
      ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Neuroticism']
        .forEach((trait, index) => {
          const traitAnswers = answers.filter((_, i) => i % 5 === index);
          const score = traitAnswers.reduce((sum, ans) => sum + (ans?.value || 0), 0);
          // Convert to percentage from raw score (max 45 = 100%)
          scores[trait] = (score / 45) * 100;
        });
    } else {
      ['Science', 'Technology', 'English', 'Art', 'Math'].forEach((subject, index) => {
        const subjectAnswers = answers.slice(index * 10, (index + 1) * 10);
        const correct = subjectAnswers.filter(a => a?.isCorrect).length;
        scores[subject] = (correct / 10) * 100;
      });
    }
  
    // Find the maximum score
    const maxScore = Math.max(...Object.values(scores));
    
    // More strict tolerance for considering scores equal (0.1%)
    const TOLERANCE = 0.1;
    
    // Filter for only the truly top scores
    const topScores = Object.entries(scores)
      .filter(([_, score]) => {
        const diff = Math.abs(score - maxScore);
        console.log(`Score comparison for ${_}:`, {
          score,
          maxScore,
          difference: diff,
          isTop: diff <= TOLERANCE
        });
        return diff <= TOLERANCE;
      })
      .map(([name]) => name);
  
    console.log('Score calculation results:', {
      allScores: scores,
      maxScore,
      topScores,
      tolerance: TOLERANCE
    });
  
    return topScores;
  };

  const moveToNextSection = () => {
    const currentIndex = sections.indexOf(state.section);
    console.log('Moving to next section:', {
      currentSection: state.section,
      currentIndex,
      nextSection: sections[currentIndex + 1],
      allSections: sections
    });

    if (currentIndex < sections.length - 1) {
      const nextSection = sections[currentIndex + 1];

      if (nextSection === 'preference-selection') {
        const hasPersonalityTie = calculateTopScores(state.personalityAnswers, 'personality').length > 1;
        const hasSubjectTie = calculateTopScores(state.subjectAnswers, 'subject').length > 1;
        
        console.log('Checking ties:', {
          hasPersonalityTie,
          hasSubjectTie,
          personalityAnswers: state.personalityAnswers.length,
          subjectAnswers: state.subjectAnswers.length
        });

        if (hasPersonalityTie || hasSubjectTie) {
          console.log('Moving to preference selection');
          updateState({ section: nextSection });
        } else {
          console.log('No ties found, skipping to results');
          updateState({
            section: 'results',
            completionTime: new Date().toISOString()
          });
        }
      } else {
        console.log(`Moving to ${nextSection}`);
        updateState({
          section: nextSection,
          ...(nextSection === 'personality' ? { startTime: new Date().toISOString() } : {}),
          ...(nextSection === 'results' ? { completionTime: new Date().toISOString() } : {})
        });
      }
      return true;
    }
    
    console.log('No more sections available');
    return false;
  };

  const validateQuizCompletion = () => {
    const { personalityAnswers, subjectAnswers, username } = state;
    const isValid = username && 
      personalityAnswers.length === 25 && 
      subjectAnswers.length === 50 &&
      !personalityAnswers.includes(null) &&
      !subjectAnswers.includes(null);

    console.log('Validating quiz completion:', {
      username: !!username,
      personalityAnswersLength: personalityAnswers.length,
      subjectAnswersLength: subjectAnswers.length,
      isValid
    });

    return isValid;
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

export default QuizContext;