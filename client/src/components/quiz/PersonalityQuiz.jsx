import React, { useState } from 'react';
import { useQuiz } from '../../context/QuizContext';
import ProgressBar from '../shared/ProgressBar';
import RadioGroup from '../shared/RadioGroup';
import QuizNavigation from '../shared/QuizNavigation';
import { personalityQuestions } from '../../data/personalityQuestions';

const PersonalityQuiz = () => {
  const { progress, setProgress, personalityAnswers, setPersonalityAnswers, moveToNextSection } = useQuiz();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState(null);

  const handleAnswer = (value) => {
    setCurrentAnswer(value);
  };

  const handleNext = () => {
    // Save answer
    const newAnswers = [...personalityAnswers, currentAnswer];
    setPersonalityAnswers(newAnswers);
    setProgress((currentQuestion + 1) / personalityQuestions.length * 100);

    if (currentQuestion < personalityQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setCurrentAnswer(null);
    } else {
      moveToNextSection();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setCurrentAnswer(personalityAnswers[currentQuestion - 1]);
      setProgress(((currentQuestion - 1) / personalityQuestions.length) * 100);
    }
  };

  const getAnswerOptions = () => {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => ({
      value: num,
      label: num.toString(),
      description: num === 1 ? 'Strongly Disagree' : num === 9 ? 'Strongly Agree' : ''
    }));
  };

  return (
    <div className="space-y-6">
      <ProgressBar progress={progress} total={100} />
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">
          OCEAN Personality Test
        </h2>
        <div className="space-y-6">
          <p className="text-gray-600 dark:text-gray-300">
            Question {currentQuestion + 1} of {personalityQuestions.length}
          </p>
          <p className="text-lg font-medium">
            {personalityQuestions[currentQuestion].statement}
          </p>
          <RadioGroup
            options={getAnswerOptions()}
            value={currentAnswer}
            onChange={handleAnswer}
            name="personality-answer"
          />
          <QuizNavigation
            onNext={handleNext}
            onPrev={handlePrevious}
            canProgress={currentAnswer !== null}
            showPrev={currentQuestion > 0}
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalityQuiz;