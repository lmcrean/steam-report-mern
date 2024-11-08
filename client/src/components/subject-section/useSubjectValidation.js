import { useContext } from 'react';
import { QuizContext } from '../../context/QuizContext';
import { checkForTies } from '../utils/checkForTies';
import { SCORE_TOLERANCE } from '../constants/quizConstants';

export const useSubjectValidation = () => {
  const { state, updateState } = useContext(QuizContext);

  const validateSubjectScores = (scores) => {
    try {
      const subjectTies = checkForTies(scores, SCORE_TOLERANCE);
      
      if (subjectTies.length > 1) {
        updateState({ 
          subjectTies,
          needsPreferenceSelection: true 
        });
      } else {
        updateState({ 
          preferredSubject: subjectTies[0],
          needsPreferenceSelection: false 
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error validating subject scores:', error);
      return false;
    }
  };

  return { validateSubjectScores };
}; 