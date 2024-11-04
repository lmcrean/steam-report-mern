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
    personalityScores: {},
    subjectScores: {},
    startTime: null,
    completionTime: null,
    preferredTrait: null,
    preferredSubject: null,
    personalityBonus: null,
    subjectBonus: null
  });

  const updateState = (updates) => {
    console.log('Received in updateState:', {
      raw: JSON.stringify(updates, null, 2),
      keys: Object.keys(updates),
      hasSubjectScores: 'subjectScores' in updates,
      subjectScoresValue: updates.subjectScores ? JSON.stringify(updates.subjectScores, null, 2) : 'undefined'
    });

    setState(prev => {
      const newState = { ...prev, ...updates };
      console.log('Setting new state with scores:', {
        personality: newState.personalityScores,
        subject: newState.subjectScores
      });
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

  const moveToNextSection = () => {
    const currentIndex = sections.indexOf(state.section);

    if (currentIndex < sections.length - 1) {
      const nextSection = sections[currentIndex + 1];

      if (nextSection === 'preference-selection') {
        console.log('Detailed State Analysis:', {
          personalityScores: {
            raw: state.personalityScores,
            entries: Object.entries(state.personalityScores || {}),
            keys: Object.keys(state.personalityScores || {}),
            values: Object.values(state.personalityScores || {})
          },
          subjectScores: {
            raw: state.subjectScores,
            entries: Object.entries(state.subjectScores || {}),
            keys: Object.keys(state.subjectScores || {}),
            values: Object.values(state.subjectScores || {})
          }
        });

        // Only proceed if we have scores
        if (!state.personalityScores || !state.subjectScores) {
          console.error('Missing scores:', {
            hasPersonalityScores: !!state.personalityScores,
            personalityScoresType: typeof state.personalityScores,
            hasSubjectScores: !!state.subjectScores,
            subjectScoresType: typeof state.subjectScores
          });
          return false;
        }

        // Check for ties in personality scores
        const personalityScores = Object.entries(state.personalityScores);
        const maxPersonalityScore = Math.max(...personalityScores.map(([_, score]) => score));
        const personalityTies = personalityScores.filter(([_, score]) => 
          Math.abs(score - maxPersonalityScore) <= SCORE_TOLERANCE
        );

        // Check for ties in subject scores
        const subjectScores = Object.entries(state.subjectScores);
        const maxSubjectScore = Math.max(...subjectScores.map(([_, score]) => score));
        const subjectTies = subjectScores.filter(([_, score]) => 
          Math.abs(score - maxSubjectScore) <= SCORE_TOLERANCE
        );

        console.log('Scores analysis:', {
          personalityTies: personalityTies.map(([trait]) => trait),
          subjectTies: subjectTies.map(([subject]) => subject)
        });

        const hasPersonalityTie = personalityTies.length > 1;
        const hasSubjectTie = subjectTies.length > 1;

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
      personalityScores: {},
      subjectScores: {},
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
      validateQuizCompletion
    }}>
      {children}
    </QuizContext.Provider>
  );
};

export default QuizProvider;