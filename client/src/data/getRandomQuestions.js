// Utility function to get random questions for a subject
import { subjects } from './subjectQuestions';

export const getRandomQuestions = (subject, count = 10) => {
    try {
      const allQuestions = subjects[subject].questions;
      const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, count);
    } catch (error) {
      console.error(`Error getting random questions for ${subject}:`, error);
      return [];
    }
  };