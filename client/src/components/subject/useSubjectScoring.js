import { useSubjectValidation } from './useSubjectValidation';

export const useSubjectScoring = () => {
  const { validateSubjectScores } = useSubjectValidation();

  const calculateAndSubmitScore = (answers) => {
    console.log('📊 Starting subject score calculation...');
    console.log('Raw answers:', answers);
    
    // Group answers by subject (10 questions each)
    const subjectScores = {};
    const subjects = ['Science', 'Technology', 'English', 'Art', 'Math'];
    
    subjects.forEach((subject, idx) => {
      const subjectAnswers = answers.slice(idx * 10, (idx + 1) * 10);
      const correctAnswers = subjectAnswers.filter(answer => answer === true).length;
      subjectScores[subject] = Math.round((correctAnswers / 10) * 100);
      console.log(`${subject}: ${correctAnswers}/10 = ${subjectScores[subject]}%`);
    });

    console.log('Final subject scores:', subjectScores);
    return validateSubjectScores(subjectScores);
  };

  return { calculateAndSubmitScore };
}; 