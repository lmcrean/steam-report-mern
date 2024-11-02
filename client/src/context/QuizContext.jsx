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

  // Modified calculateTopScores function
  const calculateTopScores = (answers, type) => {
    if (!Array.isArray(answers) || !answers.length) {
      console.error('Invalid answers array in calculateTopScores');
      return [];
    }
  
    const scores = {};
  
    if (type === 'personality') {
      // Keep personality scoring exactly the same
      const traits = ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Neuroticism'];
      
      traits.forEach((trait, index) => {
        const startIndex = index * 5;
        const traitAnswers = answers.slice(startIndex, startIndex + 5);
        
        const totalPoints = traitAnswers.reduce((sum, ans) => {
          const value = ans?.value || 0;
          return sum + value;
        }, 0);
        
        scores[trait] = Number((totalPoints / 45 * 100).toFixed(3));
      });
    } else {
      const subjects = ['Science', 'Technology', 'English', 'Art', 'Math'];
      
      subjects.forEach((subject, index) => {
        const startIdx = index * 10;
        const endIdx = startIdx + 10;
        const subjectAnswers = answers.slice(startIdx, endIdx);
        
        console.log(`Raw ${subject} answers:`, subjectAnswers); // Add this log
        
        const correctCount = subjectAnswers.filter(a => a?.isCorrect).length;
        scores[subject] = Number((correctCount / 10 * 100).toFixed(3));
  
        console.log(`${subject} detailed calculation:`, {
          startIdx,
          endIdx,
          answers: subjectAnswers.map(a => ({
            correct: a?.isCorrect,
            question: a?.questionText && a.questionText.substring(0, 30) + '...'
          })),
          correctCount,
          score: scores[subject]
        });
      });
    }
  
    // Add more logging around max score detection
    const maxScore = Math.max(...Object.values(scores));
    const topScores = Object.entries(scores)
      .filter(([name, score]) => {
        const diff = Math.abs(score - maxScore);
        console.log(`Score comparison for ${name}:`, {
          score,
          maxScore,
          difference: diff,
          withinTolerance: diff <= SCORE_TOLERANCE
        });
        return diff <= SCORE_TOLERANCE;
      })
      .map(([name]) => name);
  
    return topScores;
  };

  const moveToNextSection = () => {
    const currentIndex = sections.indexOf(state.section);

    if (currentIndex < sections.length - 1) {
      const nextSection = sections[currentIndex + 1];

      // Special handling for preference selection
      if (nextSection === 'preference-selection') {
        const personalityTopScores = calculateTopScores(state.personalityAnswers, 'personality');
        const subjectTopScores = calculateTopScores(state.subjectAnswers, 'subject');
        
        const hasPersonalityTie = personalityTopScores.length > 1;
        const hasSubjectTie = subjectTopScores.length > 1;

        console.log('Checking for ties:', {
          personalityTopScores,
          subjectTopScores,
          hasPersonalityTie,
          hasSubjectTie
        });

        if (hasPersonalityTie || hasSubjectTie) {
          // Go to preference selection if there are actual ties
          console.log('Tie detected, moving to preference selection');
          updateState({ section: nextSection });
        } else {
          // Skip to results if no ties
          console.log('No tie detected, moving to results');
          updateState({
            section: 'results',
            completionTime: new Date().toISOString()
          });
        }
      } else {
        // Normal section transition
        console.log('Moving to next section (normal transition):', nextSection);
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