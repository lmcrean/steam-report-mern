// QuizResultsDataLogic.js
import { useMemo } from 'react';
import { getCareerFeedback } from '../../../data/feedbackDatabase';

export const ensureNumber = (value) => {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
};

export const formatScore = (score) => {
  return ensureNumber(score).toFixed(1);
};

const calculatePersonalityScoresFromAnswers = (answers, preferredTrait = null) => {
  const scores = {
    Openness: 0,
    Conscientiousness: 0,
    Extraversion: 0,
    Agreeableness: 0,
    Neuroticism: 0
  };
  
  const traits = Object.keys(scores); // Add this
  
  // First accumulate raw scores
  answers.forEach((answer, index) => {
    const traitIndex = index % 5;
    const trait = traits[traitIndex];
    const value = answer?.value ?? answer ?? 0;
    scores[trait] += ensureNumber(value);
  });

  // Convert to percentages
  const percentages = Object.entries(scores).reduce((acc, [trait, score]) => {
    const percentage = (score / 45) * 100;
    acc[trait] = percentage;
    return acc;
  }, {});

  // Apply bonus to percentage if preferred
  if (preferredTrait && percentages[preferredTrait]) {
    percentages[preferredTrait] *= 1.1;
  }

  return percentages;
};


export const processSubjectAnswers = (subjectAnswers, preferredSubject = null) => {
  
  if (!Array.isArray(subjectAnswers)) {
    console.error('Invalid subject answers:', subjectAnswers);
    return [];
  }

  const subjects = [
    { name: 'Science', start: 0 },
    { name: 'Technology', start: 10 },
    { name: 'English', start: 20 },
    { name: 'Art', start: 30 },
    { name: 'Math', start: 40 }
  ];

  const processedSections = subjects.map(({ name, start }) => {
    const sectionAnswers = subjectAnswers.slice(start, start + 10);
    
    
    const processedAnswers = sectionAnswers.map((answer, idx) => {
      const processed = {
        questionNumber: idx + 1,
        isCorrect: answer?.isCorrect || false,
        userAnswer: answer?.selectedAnswer,
        correctAnswer: answer?.correctAnswer
      };

            return processed;
    });

    const correctCount = processedAnswers.filter(a => a.isCorrect).length;
    let score = (correctCount / 10) * 100;
    
    // Apply preference bonus
    if (name === preferredSubject) {
      const originalScore = score;
      score *= 1.1; // 10% bonus
          }

    const result = {
      subject: name,
      score: ensureNumber(score),
      correctAnswers: correctCount,
      totalQuestions: 10,
      answers: processedAnswers,
      isPreferred: name === preferredSubject
    };

    
    return result;
  });

  
  return processedSections;
};

export const getHighestScore = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
        return null;
  }

  const highest = data.reduce((max, current) => {
    const maxScore = ensureNumber(max.score);
    const currentScore = ensureNumber(current.score);
    return maxScore > currentScore ? max : current;
  });

    return highest;
};

export const useQuizResultsData = (
  personalityAnswers,
  subjectAnswers,
  preferredTrait = null,
  preferredSubject = null
) => {
  const personalityData = useMemo(() => {
    if (!Array.isArray(personalityAnswers)) {
      console.error('Invalid personality answers format');
      return [];
    }

    const scores = calculatePersonalityScoresFromAnswers(personalityAnswers, preferredTrait);
    
    return Object.entries(scores).map(([trait, percentage]) => ({
      trait: trait.substring(0, 3),
      fullTrait: trait,
      score: ensureNumber(percentage),
      isPreferred: trait === preferredTrait
    }));
  }, [personalityAnswers, preferredTrait]);

  const subjectData = useMemo(() => {
        return processSubjectAnswers(subjectAnswers, preferredSubject);
  }, [subjectAnswers, preferredSubject]);

  const highestPersonality = getHighestScore(personalityData);
  const highestSubject = getHighestScore(subjectData);

  const highest = {
    personalityTrait: highestPersonality?.fullTrait || null,
    subject: highestSubject?.subject || null
  };

  
  const feedback = highest.personalityTrait && highest.subject 
    ? getCareerFeedback(highest.subject, highest.personalityTrait)
    : null;

  if (feedback) {
      } else {
      }

  return {
    personalityData,
    subjectData,
    highestPersonalityTrait: highest.personalityTrait,
    highestSubject: highest.subject,
    careerFeedback: feedback
  };
};