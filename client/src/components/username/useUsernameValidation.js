import { useContext } from 'react';
import { QuizContext } from '../../context/QuizContext';
import { useNextSection } from '../shared/useNextSection';

export const useUsernameValidation = () => {
  const { updateState } = useContext(QuizContext);
  const { moveToNextSection } = useNextSection();

  const validateAndUpdateUsername = (username) => {
    // Trim whitespace
    const trimmedUsername = username.trim();

    // Validation rules
    if (!trimmedUsername) {
      return {
        isValid: false,
        error: 'Username is required'
      };
    }

    if (trimmedUsername.length < 3) {
      return {
        isValid: false,
        error: 'Username must be at least 3 characters long'
      };
    }

    if (trimmedUsername.length > 20) {
      return {
        isValid: false,
        error: 'Username must be less than 20 characters'
      };
    }

    // If validation passes, update context and move to next section
    updateState({ 
      username: trimmedUsername,
    });
    
    moveToNextSection();
    
    return {
      isValid: true,
      error: null
    };
  };

  return { validateAndUpdateUsername };
}; 