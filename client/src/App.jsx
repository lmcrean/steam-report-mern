// App.jsx
import React, { useContext, useState, useEffect } from 'react';
import MainLayout from './components/layout/MainLayout';
import Header from './components/layout/Header';
import MenuScreen from './components/menu/MenuScreen';
import PersonalityQuiz from './components/personality/PersonalityQuiz';
import SubjectQuiz from './components/subject/SubjectQuiz';
import QuizResults from './components/results/QuizResults';
import UsernameEntry from './components/username/UsernameEntry';
import { QuizProvider, QuizContext } from './context/QuizContext';
import PersonalityTieBreaker from './components/personality/PersonalityTieBreaker';
import './App.css';
import SubjectTieBreaker from './components/subject/SubjectTieBreaker';
import NetworkBoard from './components/network-board/NetworkBoard';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Create an Alert Context
export const AlertContext = React.createContext(null);

// Create an Alert Provider component
const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState(null);

  const showAlert = (message) => {
    setAlert(message);
    // Clear alert after 3 seconds
    setTimeout(() => setAlert(null), 3000);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alert && (
        <div className="alert fixed top-4 right-4 bg-dark shadow-lg rounded-lg p-4 z-50">
          {alert}
        </div>
      )}
    </AlertContext.Provider>
  );
};

const QuizFlow = () => {
  const { state } = useContext(QuizContext);
  const renderSection = () => {    
    switch (state.section) {
      case 'menu':
        return <MenuScreen />;
      case 'username':
        return <UsernameEntry />;
      case 'personality':
        return <PersonalityQuiz />;
      case 'personality-tiebreaker':
        return <PersonalityTieBreaker />;
      case 'subject':
        return <SubjectQuiz />;
      case 'subject-tiebreaker':
        return <SubjectTieBreaker />;
      case 'results':
        return <QuizResults />;
      case 'network-board':
        return <NetworkBoard />;
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
  const [isDark, setIsDark] = useState(() => {
    const storedPreference = localStorage.getItem('darkMode');
    return storedPreference === null ? true : storedPreference === 'true';
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', isDark);
  }, [isDark]);

  const toggleDark = () => setIsDark(!isDark);

  return (
    <BrowserRouter>
      <AlertProvider>
        <QuizProvider>
          <QuizFlow />
        </QuizProvider>
      </AlertProvider>
    </BrowserRouter>
  );
};

export default App;