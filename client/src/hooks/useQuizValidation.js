import { useCallback } from 'react';
import { useQuiz } from '../context/QuizContext';

export const useQuizValidation = () => {
  const { state } = useQuiz();

  const validateQuizCompletion = useCallback(() => {
    try {
      console.log('🔍 Validation: Checking quiz completion');
      
      const validation = {
        hasUsername: !!state.username,
        hasPersonalityAnswers: state.personalityAnswers?.length === 25,
        hasSubjectAnswers: state.subjectAnswers?.length === 50,
        personalityValid: !state.personalityAnswers?.includes(null),
        subjectValid: !state.subjectAnswers?.includes(null)
      };

      console.log('📋 Validation results:', validation);

      const isValid = Object.values(validation).every(v => v);
      console.log(isValid ? '✅ Validation: Quiz is complete' : '❌ Validation: Quiz is incomplete');

      return isValid;
    } catch (error) {
      console.error('❌ Validation: Error during validation:', error);
      return false;
    }
  }, [state]);

  return { validateQuizCompletion };
}; 