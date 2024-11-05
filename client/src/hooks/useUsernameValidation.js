import { useCallback } from 'react';

export const useUsernameValidation = () => {
  const validateUsername = useCallback((username) => {
    if (!username || username.trim().length < 3) {
      throw new Error('Username must be at least 3 characters long');
    }
    if (username.trim().length > 20) {
      throw new Error('Username must be less than 20 characters');
    }
    return username.trim();
  }, []);

  return { validateUsername };
}; 