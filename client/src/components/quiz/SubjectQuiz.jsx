// SubjectQuiz.jsx
import React, { useState, useEffect } from 'react';
import { useQuiz } from '../../context/QuizContext';
import ProgressBar from '../shared/ProgressBar';
import RadioGroup from '../shared/RadioGroup';
import QuizNavigation from '../shared/QuizNavigation';
import LoadingSpinner from '../shared/LoadingSpinner';
import Alert from '../shared/Alert';
import { subjects, getRandomQuestions } from '../../data/subjectQuestions';

const SubjectQuiz = () => {
  const { updateState, moveToNextSection } = useQuiz();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState(new Array(50).fill(null));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subjectScores, setSubjectScores] = useState({
    Science: 0,
    Technology: 0,
    English: 0,
    Art: 0,
    Math: 0,
  });
  
  const totalQuestions = 50;

  useEffect(() => {
    try {
      const allQuestions = [];
      const questionMap = new Map();
      
      Object.keys(subjects).forEach(subject => {
        const subjectQuestions = getRandomQuestions(subject, 10);        
        subjectQuestions.forEach(question => {
          questionMap.set(question.question, question.correct_answer);
        });
        allQuestions.push(...subjectQuestions);
      });

      setQuestions(allQuestions);
      setSubjectScores(questionMap);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading questions:', error);
      setError('Failed to load quiz questions. Please try again.');
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentQuestion < 10) {
      console.log(`\nScience Section Starting`);
    } else if (currentQuestion < 20) {
      console.log(`\nTechnology Section Starting`);
    } else if (currentQuestion < 30) {
      console.log(`\nEnglish Section Starting`);
    } else if (currentQuestion < 40) {
      console.log(`\nArt Section Starting`);
    } else {
      console.log(`\nMath Section Starting`);
    }
  }, [currentQuestion]);

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
      const isCorrect = checkAnswer(currentQuestionData, currentAnswer);
      const subject = getCurrentSubject();

      // Update subject scores with numeric values
      setSubjectScores(prev => {
        const newScores = { ...prev };
        newScores[subject] = Number(prev[subject] || 0) + (isCorrect ? 1 : 0);
        return newScores;
      });

      // Update answers array
      const updatedAnswers = [...answers];
      updatedAnswers[currentQuestion] = isCorrect;
      setAnswers(updatedAnswers);

      if ((currentQuestion + 1) % 10 === 0) {
        const sectionScore = Math.round((subjectScores[subject] / 10) * 100);
        console.log('Section Complete:', {
          subject,
          score: sectionScore,
          correctAnswers: subjectScores[subject]
        });
      }

      if (currentQuestion < totalQuestions - 1) {
        updateState({ 
          subjectAnswers: updatedAnswers,
          progress: ((currentQuestion + 1) / totalQuestions * 100)
        });
        setCurrentQuestion(currentQuestion + 1);
        setCurrentAnswer(null);
      } else {
        console.log('Quiz completed, preparing for section transition');
        updateState({ 
          subjectAnswers: updatedAnswers,
          progress: 100
        });

        const subjectTotals = Object.keys(subjectScores).reduce((acc, subject) => {
          acc[subject] = subjectScores[subject];
          return acc;
        }, {});
        
        const subjectPercentages = Object.keys(subjectTotals).reduce((acc, subject) => {
          acc[subject] = ((subjectTotals[subject] * 100) / 10).toFixed(0);
          return acc;
        }, {});
        
        console.log('Final Subject totals / 10:', subjectTotals);
        console.log('Final Subject totals as % (planned):', subjectPercentages);
        
        const success = moveToNextSection();
        if (!success) {
          setError('Failed to proceed to next section. Please try again.');
        }
      }
    }
  };

  const checkAnswer = (question, selectedAnswer) => {
    const options = getAnswerOptions();
    const selectedOption = options.find(opt => opt.value === selectedAnswer);
    const isCorrect = selectedOption?.label === question.correct_answer;
  
    console.log(`Q${currentQuestion % 10 + 1}: ${isCorrect ? 'correct' : 'incorrect'} - ${selectedOption?.label}`);

    return {
      question: question.question,
      correctAnswer: question.correct_answer,
      selectedLabel: selectedOption?.label,
      selectedValue: selectedAnswer,
      isCorrect
    };
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      const previousAnswer = answers[currentQuestion - 1];
      setCurrentAnswer(previousAnswer ? previousAnswer.selectedAnswer : null);
      updateState({
        progress: ((currentQuestion - 1) / totalQuestions * 100)
      });
    }
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
        <div className="flex justify-between text-sm text-gray-600">
          <span>Overall Progress: {overallProgress}%</span>
          <span>{currentSubject} Progress: {subjectProgress}%</span>
        </div>
      </div>

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