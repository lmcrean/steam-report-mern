import React from 'react';
import MainLayout from './components/layout/MainLayout';
import Header from './components/layout/Header';
import { QuizProvider } from './context/QuizContext';
import './App.css';

function App() {
  return (
    <QuizProvider>
      <MainLayout>
        <Header title="STEAM Career Quiz" />
        <main className="flex-grow flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            {/* Quiz components will be rendered here */}
            <p className="text-center text-gray-700 dark:text-gray-300">
              Welcome to the STEAM Career Quiz! Let's discover your ideal career path.
            </p>
          </div>
        </main>
      </MainLayout>
    </QuizProvider>
  );
}

export default App;