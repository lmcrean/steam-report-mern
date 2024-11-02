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
  // Input validation with detailed logging
  if (!answers || !Array.isArray(answers)) {
    console.error('Invalid answers input:', JSON.stringify(answers, null, 2));
    return null;
  }

  const scores = {
    Openness: 0,
    Conscientiousness: 0,
    Extraversion: 0,
    Agreeableness: 0,
    Neuroticism: 0
  };
  
  const traits = Object.keys(scores);
  
  // Track detailed answer processing
  const processedAnswers = answers.map((answer, index) => {
    const traitIndex = index % 5;
    const trait = traits[traitIndex];
    let value = 0;

    if (typeof answer === 'number') {
      value = answer;
    } else if (answer?.value) {
      value = answer.value;
    } else {
      console.warn(`Invalid answer at index ${index}:`, JSON.stringify(answer, null, 2));
    }

    return {
      index,
      trait,
      rawValue: answer,
      processedValue: value
    };
  });

  // Calculate raw scores
  processedAnswers.forEach(({ trait, processedValue }) => {
    scores[trait] += processedValue;
  });

  // Convert to percentages
  const percentages = Object.entries(scores).reduce((acc, [trait, score]) => {
    const percentage = (score / 45) * 100;
    acc[trait] = percentage;
    return acc;
  }, {});

  // Apply preference bonus if specified
  if (preferredTrait && percentages[preferredTrait]) {
    const originalScore = percentages[preferredTrait];
    percentages[preferredTrait] *= 1.1; // 10% bonus
    console.log(`Applied preference bonus to ${preferredTrait}:`, {
      originalScore,
      bonusScore: percentages[preferredTrait]
    });
  }

  return percentages;
};

export const processSubjectAnswers = (subjectAnswers, preferredSubject = null) => {
  // Input validation with detailed logging
  if (!Array.isArray(subjectAnswers)) {
    console.error('Invalid subject answers:', JSON.stringify(subjectAnswers, null, 2));
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
    console.warn('Invalid data for highest score calculation:', data);
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