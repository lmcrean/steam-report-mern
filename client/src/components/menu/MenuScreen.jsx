import React, { useContext } from 'react';
import { QuizContext } from '../../context/QuizContext';
import QuizCard from '../shared/QuizCard';
import { useNextSection } from '../shared/useNextSection';

const MenuScreen = () => {
  const { updateState } = useContext(QuizContext);
  const { moveToNextSection } = useNextSection();

  const menuItems = [
    {
      title: 'Start Quiz',
      description: 'Begin your STEAM career discovery journey',
      action: () => moveToNextSection(),
      primary: true
    },
    {
      title: 'About OCEAN Test',
      description: 'Learn about the personality assessment',
      action: () => updateState({ section: 'about-ocean' })
    },
    {
      title: 'About STEAM',
      description: 'Understand the subject areas',
      action: () => updateState({ section: 'about-steam' })
    },
    {
      title: 'How to Play',
      description: 'Get guidance on taking the quiz',
      action: () => updateState({ section: 'how-to-play' })
    }
  ];

  return (
    <QuizCard title="Welcome to STEAM Career Quiz">
      <div className="space-y-4">
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Discover your ideal career path through personality assessment and subject knowledge evaluation.
        </p>
        
        <div className="grid gap-4 sm:grid-cols-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={item.action}
              className={`
                p-4 rounded-lg text-left transition-all duration-200
                ${item.primary 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 text-gray-900 dark:text-white'}
              `}
            >
              <h3 className="font-semibold mb-1">
                {item.title}
              </h3>
              <p className={`text-sm ${item.primary ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                {item.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </QuizCard>
  );
};

export default MenuScreen;