// SubjectQuiz.jsx
import React, { useState, useEffect, useRef, useContext } from 'react';
import { useSubjectScoring } from './useSubjectScoring';
import { subjects } from '../../data/subjectQuestions';
import { getRandomQuestions } from '../../data/getRandomQuestions';
import ProgressBar from '../shared/ProgressBar';
import RadioGroup from '../shared/RadioGroup';
import QuizNavigation from '../shared/QuizNavigation';
import Alert from '../shared/Alert';
import LoadingSpinner from '../shared/LoadingSpinner';
import { QuizContext } from '../../context/QuizContext';
import SubjectTieBreaker from './SubjectTieBreaker';

const SubjectQuiz = () => {
  const { state } = useContext(QuizContext);
  const { needsSubjectTieBreaker, subjectTies } = state;

  const { calculateAndSubmitScore } = useSubjectScoring();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState(new Array(50).fill(null));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const stateUpdated = useRef(false);

  const totalQuestions = 50;

  useEffect(() => {
    try {
      const allQuestions = [];
      
      Object.keys(subjects).forEach(subject => {
        const subjectQuestions = getRandomQuestions(subject, 10);        
        allQuestions.push(...subjectQuestions);
      });

      setQuestions(allQuestions);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading questions:', error);
      setError('Failed to load quiz questions. Please try again.');
      setIsLoading(false);
    }
  }, []);

  const handleQuizCompletion = () => {
    if (!stateUpdated.current) {
      const success = calculateAndSubmitScore(answers);
      if (!success) {
        setError('Failed to submit quiz results. Please try again.');
      }
      stateUpdated.current = true;
    }
  };

  useEffect(() => {
    if (quizCompleted) {
      handleQuizCompletion();
    }
  }, [quizCompleted]);

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
    if (currentAnswer !== null) {
      const currentQuestionData = getCurrentQuestionData();
      const answerResult = checkAnswer(currentQuestionData, currentAnswer);
      
      // Create new answers array
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = answerResult;
      setAnswers(newAnswers);

      if (currentQuestion < totalQuestions - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setCurrentAnswer(null);
      } else {

        setQuizCompleted(true);
      }
    }
  };

  const checkAnswer = (question, selectedAnswer) => {
    const options = getAnswerOptions();
    const selectedOption = options.find(opt => opt.value === selectedAnswer);
    const isCorrect = selectedOption?.label === question.correct_answer;
  
    return isCorrect
  };

  const getCurrentQuestionData = () => {
    if (!questions.length) return null;
    return questions[currentQuestion];
  };

  const getAnswerOptions = () => {
    const question = getCurrentQuestionData();
    if (!question) return [];

    const allAnswers = [
      question.correct_answer,
      ...question.incorrect_answers
    ];
    
    // Deterministic shuffle based on question text
    const shuffledAnswers = allAnswers
      .map((answer, index) => ({
        answer,
        sort: question.question.charCodeAt(index % question.question.length)
      }))
      .sort((a, b) => a.sort - b.sort)
      .map((item, index) => ({
        value: index + 1,
        label: item.answer
      }));

    return shuffledAnswers;
  };

  if (needsSubjectTieBreaker && subjectTies?.length > 1) {
    return <SubjectTieBreaker subjects={subjectTies} />;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <Alert type="error">{error}</Alert>;
  }

  const currentSubject = getCurrentSubject();
  const questionNumber = (currentQuestion % 10) + 1;
  const question = getCurrentQuestionData();

  if (!question) {
    return <Alert type="error">Failed to load quiz questions. Please try again.</Alert>;
  }

  const subjectProgress = ((questionNumber / 10) * 100).toFixed(0);
  const overallProgress = ((currentQuestion + 1) / totalQuestions * 100).toFixed(0);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <ProgressBar progress={parseFloat(overallProgress)} total={100} />
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
          <span>Overall Progress: {overallProgress}%</span>
          <span>{currentSubject} Progress: {subjectProgress}%</span>
        </div>
      </div>

      <div className="bg-dark dark:bg-slate-800 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
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
            <p className="text-lg font-medium mb-2 text-gray-900 dark:text-white">
              {question.question}
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
            canProgress={currentAnswer !== null}
          />
        </div>
      </div>
    </div>
  );
};

export default SubjectQuiz;