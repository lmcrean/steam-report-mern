// QuizContext.jsx
import React, { createContext, useContext, useState } from 'react';

const QuizContext = createContext(null);
const SCORE_TOLERANCE = 0.001;

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};

export const QuizProvider = ({ children }) => {
  const [state, setState] = useState({
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
  });

  const updateState = (updates, callback) => {
    setState(prev => {
      const newState = { ...prev, ...updates };
      if (callback) {
        // Execute callback after state update
        setTimeout(() => callback(newState), 0);
      }
      return newState;
    });
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

  // Modified calculateTopScores function
  const calculateTopScores = (answers, type) => {
    console.log('calculateTopScores input:', {
      type,
      answersLength: answers?.length,
      answersContent: answers?.slice(0, 5), // Show first 5 for debugging
      isArray: Array.isArray(answers)
    });

    if (!Array.isArray(answers) || !answers.length) {
      console.error('Invalid answers array:', {
        isArray: Array.isArray(answers),
        length: answers?.length,
        answers
      });
      return [];
    }

    const scores = {};

    if (type === 'personality') {
      // Keep personality scoring the same
      const traits = ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Neuroticism'];
      
      traits.forEach((trait, index) => {
        const startIndex = index * 5;
        const traitAnswers = answers.slice(startIndex, startIndex + 5);
        
        const totalPoints = traitAnswers.reduce((sum, ans) => {
          const value = ans?.value || 0;
          return sum + value;
        }, 0);
        
        scores[trait] = Number((totalPoints / 45 * 100).toFixed(1));
      });
    } else if (type === 'subject') {
      // Add subject scoring
      const subjects = ['Science', 'Technology', 'English', 'Art', 'Math'];
      
      subjects.forEach((subject, index) => {
        const startIndex = index * 10;
        const subjectAnswers = answers.slice(startIndex, startIndex + 10);
        
        // Count true values for correct answers
        const correctCount = subjectAnswers.filter(answer => answer === true).length;
        scores[subject] = Number(((correctCount / 10) * 100).toFixed(1));
        
        console.log(`${subject} score calculation:`, {
          startIndex,
          answers: subjectAnswers,
          correct: correctCount,
          score: scores[subject]
        });
      });
    }

    // Find max score and top scorers
    const maxScore = Math.max(...Object.values(scores));
    const topScores = Object.entries(scores)
      .filter(([name, score]) => {
        const diff = Math.abs(score - maxScore);
        return diff <= SCORE_TOLERANCE;
      })
      .map(([name]) => name);

    console.log('Score calculation complete:', {
      type,
      scores,
      maxScore,
      topScores
    });

    return topScores;
  };

  const moveToNextSection = () => {
    const currentIndex = sections.indexOf(state.section);

    if (currentIndex < sections.length - 1) {
      const nextSection = sections[currentIndex + 1];

      // Special handling for preference selection
      if (nextSection === 'preference-selection') {
        console.log('Moving to preference selection, current state:', {
          personalityAnswers: state.personalityAnswers?.length,
          subjectAnswers: state.subjectAnswers?.length,
        });

        const personalityTopScores = calculateTopScores(state.personalityAnswers, 'personality');
        
        // Ensure we have the subject answers before calculating
        if (!Array.isArray(state.subjectAnswers) || state.subjectAnswers.length === 0) {
          console.error('Missing subject answers in moveToNextSection');
          return false;
        }
        
        const subjectTopScores = calculateTopScores([...state.subjectAnswers], 'subject');
        
        console.log('Top scores calculated:', {
          personality: personalityTopScores,
          subject: subjectTopScores,
          subjectAnswersLength: state.subjectAnswers.length
        });

        const hasPersonalityTie = personalityTopScores.length > 1;
        const hasSubjectTie = subjectTopScores.length > 1;

        if (hasPersonalityTie || hasSubjectTie) {
          console.log('Tie detected, moving to preference selection');
          updateState({ section: nextSection });
        } else {
          console.log('No tie detected, moving to results');
          updateState({
            section: 'results',
            completionTime: new Date().toISOString()
          });
        }
      } else {
        // Normal section transition
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
    
    const validation = {
      hasUsername: !!username,
      hasPersonalityLength: personalityAnswers?.length === 25,
      hasSubjectLength: subjectAnswers?.length === 50,
      personalityValid: !personalityAnswers?.includes(null),
      subjectValid: !subjectAnswers?.includes(null),
      subjectAnswersType: typeof subjectAnswers,
      isSubjectArray: Array.isArray(subjectAnswers)
    };
    
    console.log('QuizContext validation check:', validation);
    
    return (
      validation.hasUsername && 
      validation.hasPersonalityLength && 
      validation.hasSubjectLength &&
      validation.personalityValid &&
      validation.subjectValid
    );
  };

  const resetQuiz = () => {
    setState({
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
    });
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

export default QuizProvider;