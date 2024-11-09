import { useSubjectValidation } from './useSubjectValidation';
import { checkForSubjectTies } from './useSubjectCheckForTies';
import { useContext } from 'react';
import { QuizContext } from '../../context/QuizContext';

export const useSubjectScoring = () => {
  const { validateSubjectScores } = useSubjectValidation();
  const { updateState } = useContext(QuizContext);

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
    
    // Check for ties before validation
    const tiedSubjects = checkForSubjectTies(subjectScores);
    
    if (tiedSubjects.length > 1) {
      console.log('🔄 Subject ties detected:', tiedSubjects);
      updateState({
        subjectPercentages: subjectScores,
        needsSubjectTieBreaker: true,
        subjectTies: tiedSubjects
      });
      return true;
    }

    return validateSubjectScores(subjectScores);
  };

  return { calculateAndSubmitScore };
}; 