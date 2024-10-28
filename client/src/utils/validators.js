export const validateUsername = (username) => {
    if (!username) {
      return { isValid: false, error: 'Username is required' };
    }
  
    if (username.length < 3) {
      return { isValid: false, error: 'Username must be at least 3 characters long' };
    }
  
    if (username.length > 9) {
      return { isValid: false, error: 'Username must be less than 9 characters long' };
    }
  
    if (!username.match(/^[a-zA-Z0-9]+$/)) {
      return { isValid: false, error: 'Username must contain only letters and numbers' };
    }
  
    return { isValid: true, error: null };
  };
  
  export const validateQuizAnswer = (answer, type) => {
    if (type === 'personality') {
      const numAnswer = Number(answer);
      if (isNaN(numAnswer) || numAnswer < 1 || numAnswer > 9) {
        return { isValid: false, error: 'Answer must be between 1 and 9' };
      }
    } else if (type === 'subject') {
      if (typeof answer !== 'number' || answer < 0 || answer > 3) {
        return { isValid: false, error: 'Invalid answer selection' };
      }
    }
  
    return { isValid: true, error: null };
  };
  
  export const validateQuizProgress = (currentSection, answers) => {
    switch (currentSection) {
      case 'personality':
        return answers.length === 25;
      case 'subject':
        return answers.length === 50;
      default:
        return false;
    }
  };