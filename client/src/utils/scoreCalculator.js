export const calculatePersonalityScores = (answers) => {
    const scores = {
      Openness: 0,
      Conscientiousness: 0,
      Extraversion: 0,
      Agreeableness: 0,
      Neuroticism: 0
    };
  
    // Group answers by trait and calculate scores
    answers.forEach((answer, index) => {
      const trait = getTraitForQuestion(index);
      scores[trait] += answer;
    });
  
    return scores;
  };
  
  export const calculateSubjectScores = (answers) => {
    const scores = {
      Science: 0,
      Technology: 0,
      English: 0,
      Art: 0,
      Math: 0,
      Total: 0
    };
  
    // Calculate scores for each subject (10 questions each)
    answers.forEach((isCorrect, index) => {
      const subject = getSubjectForQuestion(index);
      if (isCorrect) {
        scores[subject]++;
        scores.Total++;
      }
    });
  
    return scores;
  };
  
  export const getTraitForQuestion = (questionIndex) => {
    // Map question indices to OCEAN traits
    const traitMapping = {
      0: 'Openness',
      1: 'Conscientiousness',
      2: 'Extraversion',
      3: 'Agreeableness',
      4: 'Neuroticism'
    };
  
    return traitMapping[questionIndex % 5];
  };
  
  export const getSubjectForQuestion = (questionIndex) => {
    // Map question indices to STEAM subjects
    if (questionIndex < 10) return 'Science';
    if (questionIndex < 20) return 'Technology';
    if (questionIndex < 30) return 'English';
    if (questionIndex < 40) return 'Art';
    return 'Math';
  };
  
  export const convertScoreToPercentage = (score, maxScore) => {
    return ((score / maxScore) * 100).toFixed(1);
  };