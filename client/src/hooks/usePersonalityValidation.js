import { useCallback } from 'react';

export const usePersonalityValidation = () => {
  const validatePersonalityData = useCallback((personalityAnswers) => {
    try {
      console.log('🔍 Validation: Checking personality data');
      
      const validation = {
        hasAnswers: personalityAnswers?.length === 25,
        isComplete: !personalityAnswers?.includes(null),
        hasValidScores: personalityAnswers?.every(answer => 
          answer?.value >= 1 && answer?.value <= 9
        )
      };

      console.log('📋 Personality validation results:', validation);

      const isValid = Object.values(validation).every(v => v);
      console.log(isValid ? '✅ Personality data valid' : '❌ Personality data invalid');

      return isValid;
    } catch (error) {
      console.error('❌ Validation: Error during personality validation:', error);
      return false;
    }
  }, []);

  return { validatePersonalityData };
}; 