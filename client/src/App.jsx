// App.jsx
import React from 'react';
import MainLayout from './components/layout/MainLayout';
import Header from './components/layout/Header';
import MenuScreen from './components/quiz/MenuScreen';
import PersonalityQuiz from './components/quiz/PersonalityQuiz';
import SubjectQuiz from './components/quiz/SubjectQuiz';
import QuizResults from './components/quiz/QuizResults';
import QuizLeaderboard from './components/quiz/QuizLeaderboard';
import UsernameEntry from './components/quiz/UsernameEntry';
import PreferenceSelection from './components/quiz/preference-selection/PreferenceSelection';
import { QuizProvider, useQuiz } from './context/QuizContext';
import './App.css';

// Quiz flow component with preference selection
const QuizFlow = () => {
  const { section } = useQuiz();

  const renderSection = () => {
    switch (section) {
      case 'menu':
        return <MenuScreen />;
      case 'username':
        return <UsernameEntry />;
      case 'personality':
        return <PersonalityQuiz />;
      case 'subject':
        return <SubjectQuiz />;
      case 'preference-selection':
        return <PreferenceSelection />;
      case 'results':
        return <QuizResults />;
      case 'leaderboard':
        return <QuizLeaderboard />;
      default:
        return <MenuScreen />;
    }
  };

  return (
    <MainLayout>
      <Header title="STEAM Career Quiz" />
      <main className="flex-grow flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          {renderSection()}
        </div>
      </main>
    </MainLayout>
  );
};

function App() {
  return (
    <QuizProvider>
      <QuizFlow />
    </QuizProvider>
  );
}

export default App;