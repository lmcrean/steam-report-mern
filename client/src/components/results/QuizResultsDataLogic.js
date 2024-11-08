// QuizResultsDataLogic.js
import { useMemo } from 'react';
import { getCareerFeedback } from '../../data/feedbackDatabase';

export const ensureNumber = (value) => {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
};

export const formatScore = (score) => {
  return ensureNumber(score).toFixed(0);
};

export const calculatePersonalityScores = (answers) => {
  const scores = {
    Openness: 0,
    Conscientiousness: 0,
    Extraversion: 0,
    Agreeableness: 0,
    Neuroticism: 0
  };

  // Group answers by trait (5 questions per trait)
  Object.keys(scores).forEach((trait, traitIndex) => {
    const traitAnswers = answers.slice(traitIndex * 5, (traitIndex + 1) * 5);
    const traitTotal = traitAnswers.reduce((sum, answer) => {
      return sum + (answer?.value || 0);
    }, 0);
    scores[trait] = (traitTotal / 45) * 100; // Convert to percentage
  });

  return scores;
};

export const processSubjectAnswers = (subjectAnswers, preferredSubject = null) => {
  // Input validation with detailed logging
  if (!Array.isArray(subjectAnswers)) {
    // console.error('Invalid subject answers:', JSON.stringify(subjectAnswers, null, 2));
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
    
    // Track detailed answer processing
    const processedAnswers = sectionAnswers.map((answer, idx) => {
      const processed = {
        questionNumber: idx + 1,
        isCorrect: answer?.isCorrect || false,
        userAnswer: answer?.selectedAnswer,
        correctAnswer: answer?.correctAnswer,
        processed: !!answer
      };

      return processed;
    });

    const correctCount = processedAnswers.filter(a => a.isCorrect).length;
    let score = (correctCount / 10) * 100;
    
    // Apply preference bonus with logging
    if (name === preferredSubject) {
      const originalScore = score;
      score *= 1.1; // 10% bonus
      console.log(`Applied subject preference bonus to ${name}:`, {
        originalScore,
        bonusScore: score
      });
    }

    const result = {
      subject: name,
      score: ensureNumber(score),
      correctAnswers: correctCount,
      totalQuestions: 10,
      answers: processedAnswers,
      isPreferred: name === preferredSubject,
      validAnswers: processedAnswers.filter(a => a.processed).length
    };

    return result;
  });

  return processedSections;
};

export const getHighestScore = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    // console.warn('Invalid data for highest score calculation:', data);
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
      // console.error('Invalid personality answers format');
      return [];
    }

    const scores = calculatePersonalityScores(personalityAnswers);
    if (!scores) return [];
    
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

  // console.log('Final Results Summary:', {
  //   highestPersonalityTrait: highest.personalityTrait,
  //   highestSubject: highest.subject,
  // });

  return {
    personalityData,
    subjectData,
    highestPersonalityTrait: highest.personalityTrait,
    highestSubject: highest.subject,
    careerFeedback: feedback
  };
};