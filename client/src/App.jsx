// App.jsx
import React, { useContext } from 'react';
import MainLayout from './components/layout/MainLayout';
import Header from './components/layout/Header';
import MenuScreen from './components/menu/MenuScreen';
import PersonalityQuiz from './components/personality/PersonalityQuiz';
import SubjectQuiz from './components/subject/SubjectQuiz';
import QuizResults from './components/results/QuizResults';
import UsernameEntry from './components/username/UsernameEntry';
import { QuizProvider, QuizContext } from './context/QuizContext';
import TraitTieBreaker from './components/personality/TraitTieBreaker';
import './App.css';

// Quiz flow component with preference selection
const QuizFlow = () => {
  const { state } = useContext(QuizContext);
  const renderSection = () => {    
    switch (state.section) {
      case 'menu':
        return <MenuScreen />;
      case 'username':
        return <UsernameEntry />;
      case 'personality':
        if (state.needsPersonalityTiebreaker) {
          return <TraitTieBreaker />;
        }
        return <PersonalityQuiz />;
      case 'subject':
        return <SubjectQuiz />;
      case 'results':
        return <QuizResults />;
      default:
        console.warn('⚠️ App: Unknown section:', state.section);
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

const App = () => {
  return (
    <QuizProvider>
      <QuizFlow />
    </QuizProvider>
  );
};

export default App;