// Utility to monitor and log QuizContext state changes
export const createQuizContextMonitor = () => {
  let contextState = {
    username: null,
    personalityAnswers: [],
    subjectAnswers: [],
    personalityScores: {},
    subjectScores: {},
    preferredTrait: null,
    preferredSubject: null,
    startTime: null,
    completionTime: null
  };

  const logStateChange = (key, value) => {
    contextState[key] = value;
    console.log('\n=== QuizContext State Update ===');
    console.log(`Updated ${key}:`);
    
    switch (key) {
      case 'personalityAnswers':
        console.log('Personality answers count:', value.length);
        const traitScores = calculateTraitScores(value);
        console.log('Calculated trait scores:', traitScores);
        break;
        
      case 'subjectAnswers':
        console.log('Subject answers count:', value.length);
        const subjectScores = calculateSubjectScores(value);
        console.log('Calculated subject scores:', subjectScores);
        break;
        
      case 'preferredTrait':
      case 'preferredSubject':
        console.log(`Selected preference: ${value}`);
        break;
        
      default:
        console.log(value);
    }
  };

  const calculateTraitScores = (answers) => {
    // Group answers by trait and calculate percentages
    const traitTotals = answers.reduce((acc, ans) => {
      if (ans?.trait) {
        acc[ans.trait] = (acc[ans.trait] || 0) + (ans.value || 0);
      }
      return acc;
    }, {});

    return Object.entries(traitTotals).reduce((acc, [trait, total]) => {
      acc[trait] = `${Math.round((total / 45) * 100)}%`;
      return acc;
    }, {});
  };

  const calculateSubjectScores = (answers) => {
    // Calculate subject scores based on true/false answers
    const subjects = ['Math', 'Science', 'Technology', 'English', 'Art'];
    const scores = {};
    
    subjects.forEach((subject, idx) => {
      const subjectAnswers = answers.slice(idx * 10, (idx + 1) * 10);
      const trueCount = subjectAnswers.filter(Boolean).length;
      scores[subject] = `${Math.round((trueCount / 10) * 100)}%`;
    });

    return scores;
  };

  return {
    logStateChange,
    getState: () => contextState
  };
};