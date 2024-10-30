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

export const calculatePersonalityScoresFromAnswers = (answers) => {
  console.log('Raw personality answers:', answers);
  
  const scores = {
    Openness: 0,
    Conscientiousness: 0,
    Extraversion: 0,
    Agreeableness: 0,
    Neuroticism: 0
  };
  
  if (!Array.isArray(answers)) {
    console.error('Invalid answers format:', answers);
    return scores;
  }

  const traits = Object.keys(scores);
  
  answers.forEach((answer, index) => {
    const traitIndex = index % 5;
    const trait = traits[traitIndex];
    
    let value = 0;
    if (answer && typeof answer === 'object') {
      value = ensureNumber(answer.value);
    } else {
      value = ensureNumber(answer);
    }
    
    console.log(`Answer ${index}:`, { trait, rawAnswer: answer, processedValue: value });
    scores[trait] += value;
  });

  console.log('Final personality scores:', scores);
  return scores;
};

export const processSubjectAnswers = (subjectAnswers) => {
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

  return subjects.map(({ name, start }) => {
    const sectionAnswers = subjectAnswers.slice(start, start + 10);
    const correct = sectionAnswers.filter(answer => {
      if (typeof answer === 'object') return answer?.correct === true;
      return answer === true;
    }).length;
    
    const score = (correct / 10) * 100;
    
    console.log(`Processing ${name}:`, { correct, score });

    return {
      subject: name,
      score: ensureNumber(score)
    };
  });
};

export const getHighestScore = (data) => {
  if (!Array.isArray(data) || data.length === 0) return null;
  return data.reduce((max, current) => {
    const maxScore = ensureNumber(max.score);
    const currentScore = ensureNumber(current.score);
    return maxScore > currentScore ? max : current;
  });
};

export const useQuizResultsData = (personalityAnswers, subjectAnswers) => {
  const personalityData = useMemo(() => {
    if (!Array.isArray(personalityAnswers)) return [];

    const scores = calculatePersonalityScoresFromAnswers(personalityAnswers);
    
    return Object.entries(scores).map(([trait, score]) => {
      const processedScore = ensureNumber(score);
      const maxScore = 45;
      const percentage = (processedScore / maxScore) * 100;
      
      return {
        trait: trait.substring(0, 3),
        fullTrait: trait,
        score: ensureNumber(percentage)
      };
    });
  }, [personalityAnswers]);

  const subjectData = useMemo(() => {
    return processSubjectAnswers(subjectAnswers);
  }, [subjectAnswers]);

  const highestPersonality = getHighestScore(personalityData);
  const highestSubject = getHighestScore(subjectData);

  const highest = {
    personalityTrait: highestPersonality?.fullTrait || null,
    subject: highestSubject?.subject || null
  };

  return {
    personalityData,
    subjectData,
    highestPersonalityTrait: highest.personalityTrait,
    highestSubject: highest.subject,
    careerFeedback: highest.personalityTrait && highest.subject 
      ? getCareerFeedback(highest.subject, highest.personalityTrait)
      : null
  };
};