import { useSubjectValidation } from './useSubjectValidation';
import { checkForSubjectTies } from './useSubjectCheckForTies';
import { useContext } from 'react';
import { QuizContext } from '../../context/QuizContext';

export const useSubjectScoring = () => {
  const { validateSubjectScores } = useSubjectValidation();
  const { updateState } = useContext(QuizContext);

  const calculateAndSubmitScore = (answers) => {
    // Group answers by subject (10 questions each)
    const subjectScores = {};
    const subjects = ['Science', 'Technology', 'English', 'Art', 'Math'];
    
    subjects.forEach((subject, idx) => {
      const subjectAnswers = answers.slice(idx * 10, (idx + 1) * 10);
      const correctAnswers = subjectAnswers.filter(answer => answer === true).length;
      subjectScores[subject] = Math.round((correctAnswers / 10) * 100);
    });

    // Check for ties before validation
    const tiedSubjects = checkForSubjectTies(subjectScores);
    if (tiedSubjects.length > 1) {
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