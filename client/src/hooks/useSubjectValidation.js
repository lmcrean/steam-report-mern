import { useCallback } from 'react';

export const useSubjectValidation = () => {
  const validateSubjectData = useCallback((subjectAnswers) => {
    try {
      console.log('🔍 Validation: Checking subject data');
      
      const validation = {
        hasAnswers: subjectAnswers?.length === 50,
        isComplete: !subjectAnswers?.includes(null),
        hasValidFormat: subjectAnswers?.every(answer => 
          typeof answer?.correct === 'boolean'
        )
      };

      console.log('📋 Subject validation results:', validation);

      const isValid = Object.values(validation).every(v => v);
      console.log(isValid ? '✅ Subject data valid' : '❌ Subject data invalid');

      return isValid;
    } catch (error) {
      console.error('❌ Validation: Error during subject validation:', error);
      return false;
    }
  }, []);

  return { validateSubjectData };
}; 