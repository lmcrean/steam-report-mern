// Helper function to get career feedback based on STEAM category and OCEAN trait
import { feedbackDatabase } from './feedbackDatabase';

export const getCareerFeedback = (steamCategory, oceanTrait) => {
    const key = `${steamCategory} and ${oceanTrait}`;
    return feedbackDatabase[key] || {
      environment: "dynamic and adaptable",
      thrive: "versatility and adaptability",
      feedback: "Your unique combination of skills and traits suggests you could succeed in various roles. Consider exploring positions that combine your technical abilities with your personality strengths.",
      recommendedCareers: [
        "Career Counselor",
        "Professional Development Coach",
        "Skills Assessment Specialist",
        "Career Development Specialist",
        "Vocational Advisor"
      ]
    };
  };