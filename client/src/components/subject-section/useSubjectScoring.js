import { useContext } from 'react';
import { QuizContext } from '../../context/QuizContext';
import { useNextSection } from '../shared/useNextSection';

export const useSubjectScoring = () => {
  const { updateState } = useContext(QuizContext);
  const { moveToNextSection } = useNextSection();

  const calculateAndSubmitScore = (answers) => {
    // Group answers by subject (10 questions each)
    const subjectScores = {};
    const subjects = ['Math', 'Science', 'Technology', 'English', 'Art'];
    
    subjects.forEach((subject, idx) => {
      const subjectAnswers = answers.slice(idx * 10, (idx + 1) * 10);
      const correctAnswers = subjectAnswers.filter(answer => answer === true).length;
      subjectScores[subject] = Math.round((correctAnswers / 10) * 100);
    });

    updateState({ subjectScores });
    return moveToNextSection();
  };

  return { calculateAndSubmitScore };
}; 