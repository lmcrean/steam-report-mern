import React, { createContext, useContext, useState } from 'react';

const QuizContext = createContext(null);

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};

export const QuizProvider = ({ children }) => {
  const [section, setSection] = useState('menu');
  const [username, setUsername] = useState('');
  const [progress, setProgress] = useState(0);
  const [personalityAnswers, setPersonalityAnswers] = useState([]);
  const [subjectAnswers, setSubjectAnswers] = useState([]);
  const [results, setResults] = useState(null);

  const moveToNextSection = () => {
    const sections = ['menu', 'username', 'personality', 'subject', 'results', 'leaderboard'];
    const currentIndex = sections.indexOf(section);
    if (currentIndex < sections.length - 1) {
      setSection(sections[currentIndex + 1]);
    }
  };

  const moveToPreviousSection = () => {
    const sections = ['menu', 'username', 'personality', 'subject', 'results', 'leaderboard'];
    const currentIndex = sections.indexOf(section);
    if (currentIndex > 0) {
      setSection(sections[currentIndex - 1]);
    }
  };

  const value = {
    section,
    setSection,
    username,
    setUsername,
    progress,
    setProgress,
    personalityAnswers,
    setPersonalityAnswers,
    subjectAnswers,
    setSubjectAnswers,
    results,
    setResults,
    moveToNextSection,
    moveToPreviousSection
  };

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
};

export default QuizContext;