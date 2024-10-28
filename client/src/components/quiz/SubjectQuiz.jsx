import React, { useState } from 'react';
import { useQuiz } from '../../context/QuizContext';
import ProgressBar from '../shared/ProgressBar';
import RadioGroup from '../shared/RadioGroup';
import QuizNavigation from '../shared/QuizNavigation';
import { subjects } from '../../data/subjectQuestions';

const SubjectQuiz = () => {
  const { progress, setProgress, subjectAnswers, setSubjectAnswers, moveToNextSection } = useQuiz();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState(null);
  
  // Total 50 questions (10 per subject)
  const totalQuestions = 50;
  
  const getCurrentSubject = () => {
    if (currentQuestion < 10) return 'Science';
    if (currentQuestion < 20) return 'Technology';
    if (currentQuestion < 30) return 'English';
    if (currentQuestion < 40) return 'Art';
    return 'Math';
  };

  const handleAnswer = (value) => {
    setCurrentAnswer(value);
  };

  const handleNext = () => {
    // Save answer
    const newAnswers = [...subjectAnswers, currentAnswer];
    setSubjectAnswers(newAnswers);
    setProgress((currentQuestion + 1) / totalQuestions * 100);

    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setCurrentAnswer(null);
    } else {
      moveToNextSection();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setCurrentAnswer(subjectAnswers[currentQuestion - 1]);
      setProgress(((currentQuestion - 1) / totalQuestions) * 100);
    }
  };

  const getAnswerOptions = () => {
    return [1, 2, 3, 4].map(num => ({
      value: num,
      label: `Option ${num}`
    }));
  };

  const currentSubject = getCurrentSubject();
  const questionNumber = (currentQuestion % 10) + 1;

  return (
    <div className="space-y-6">
      <ProgressBar progress={progress} total={100} />
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">
          STEAM Subject Quiz
        </h2>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-gray-600 dark:text-gray-300">
              {currentSubject} - Question {questionNumber} of 10
            </p>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {subjects[currentSubject].icon}
            </span>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
            <p className="text-lg font-medium mb-2">
              Sample {currentSubject} Question {questionNumber}
            </p>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {subjects[currentSubject].description}
            </p>
          </div>
          <RadioGroup
            options={getAnswerOptions()}
            value={currentAnswer}
            onChange={handleAnswer}
            name="subject-answer"
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

export default SubjectQuiz;