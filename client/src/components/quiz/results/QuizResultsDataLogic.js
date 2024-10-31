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

export const calculatePersonalityScoresFromAnswers = (answers, preferredTrait = null) => {
  console.log('Raw personality answers (detailed):', 
    JSON.stringify({ answers, preferredTrait }, null, 2)
  );
  
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
      console.log(`Processing personality answer ${index}:`, {
        trait,
        rawAnswer: answer,
        extractedValue: value,
        answerType: 'object'
      });
    } else {
      value = ensureNumber(answer);
      console.log(`Processing personality answer ${index}:`, {
        trait,
        rawAnswer: answer,
        extractedValue: value,
        answerType: typeof answer
      });
    }
    
    scores[trait] += value;
  });

  // Apply preference bonus if specified
  if (preferredTrait && scores[preferredTrait]) {
    const originalScore = scores[preferredTrait];
    scores[preferredTrait] = originalScore * 1.1; // 10% bonus
    console.log(`Applied preference bonus to ${preferredTrait}:`, {
      original: originalScore,
      afterBonus: scores[preferredTrait]
    });
  }

  console.log('Final personality scores:', 
    JSON.stringify({ scores, preferredTrait }, null, 2)
  );
  return scores;
};

export const processSubjectAnswers = (subjectAnswers, preferredSubject = null) => {
  console.log('Processing subject answers:', 
    JSON.stringify({ answers: subjectAnswers, preferredSubject }, null, 2)
  );

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
    
    console.log(`\nProcessing ${name} section:`, {
      sectionStart: start,
      answersFound: sectionAnswers.length,
      isPreferred: name === preferredSubject
    });

    const processedAnswers = sectionAnswers.map((answer, idx) => {
      const processed = {
        questionNumber: idx + 1,
        isCorrect: answer?.isCorrect || false,
        userAnswer: answer?.selectedAnswer,
        correctAnswer: answer?.correctAnswer
      };

      console.log(`${name} Q${idx + 1}:`, processed);
      return processed;
    });

    const correctCount = processedAnswers.filter(a => a.isCorrect).length;
    let score = (correctCount / 10) * 100;
    
    // Apply preference bonus
    if (name === preferredSubject) {
      const originalScore = score;
      score *= 1.1; // 10% bonus
      console.log(`Applied preference bonus to ${name}:`, {
        original: originalScore,
        afterBonus: score
      });
    }

    const result = {
      subject: name,
      score: ensureNumber(score),
      correctAnswers: correctCount,
      totalQuestions: 10,
      answers: processedAnswers,
      isPreferred: name === preferredSubject
    };

    console.log(`${name} section summary:`, {
      score: result.score,
      correct: result.correctAnswers,
      isPreferred: result.isPreferred
    });

    return result;
  });

  console.log('\nOverall subject scores:', 
    processedSections.map(section => ({
      subject: section.subject,
      score: section.score,
      correct: section.correctAnswers,
      isPreferred: section.isPreferred
    }))
  );

  return processedSections;
};

export const getHighestScore = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    console.log('No scores to compare in getHighestScore');
    return null;
  }

  const highest = data.reduce((max, current) => {
    const maxScore = ensureNumber(max.score);
    const currentScore = ensureNumber(current.score);
    return maxScore > currentScore ? max : current;
  });

  console.log('Highest score found:', highest);
  return highest;
};

export const useQuizResultsData = (
  personalityAnswers, 
  subjectAnswers, 
  preferredTrait = null,
  preferredSubject = null
) => {
  const personalityData = useMemo(() => {
    console.log('\nCalculating personality data...');
    if (!Array.isArray(personalityAnswers)) {
      console.error('Invalid personality answers format');
      return [];
    }

    const scores = calculatePersonalityScoresFromAnswers(personalityAnswers, preferredTrait);
    
    const processed = Object.entries(scores).map(([trait, score]) => {
      const processedScore = ensureNumber(score);
      const maxScore = 45;
      const percentage = (processedScore / maxScore) * 100;
      
      const result = {
        trait: trait.substring(0, 3),
        fullTrait: trait,
        rawScore: processedScore,
        maxPossible: maxScore,
        score: ensureNumber(percentage),
        isPreferred: trait === preferredTrait
      };

      console.log(`Processed ${trait}:`, result);
      return result;
    });

    console.log('Final personality data:', processed);
    return processed;
  }, [personalityAnswers, preferredTrait]);

  const subjectData = useMemo(() => {
    console.log('\nCalculating subject data...');
    return processSubjectAnswers(subjectAnswers, preferredSubject);
  }, [subjectAnswers, preferredSubject]);

  const highestPersonality = getHighestScore(personalityData);
  const highestSubject = getHighestScore(subjectData);

  const highest = {
    personalityTrait: highestPersonality?.fullTrait || null,
    subject: highestSubject?.subject || null
  };

  console.log('\nFinal results:', {
    highestPersonality: highest.personalityTrait,
    highestSubject: highest.subject,
    preferredTrait,
    preferredSubject
  });

  const feedback = highest.personalityTrait && highest.subject 
    ? getCareerFeedback(highest.subject, highest.personalityTrait)
    : null;

  if (feedback) {
    console.log('Career feedback generated:', feedback);
  } else {
    console.log('No career feedback available - missing required scores');
  }

  return {
    personalityData,
    subjectData,
    highestPersonalityTrait: highest.personalityTrait,
    highestSubject: highest.subject,
    careerFeedback: feedback
  };
};