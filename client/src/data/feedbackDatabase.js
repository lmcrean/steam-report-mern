export const feedbackDatabase = {
    "Science and Openness": {
      environment: "exploratory and innovative",
      careers: [
        "Research Scientist",
        "Innovation Lead",
        "Scientific Explorer",
        "R&D Specialist"
      ],
      feedback: "Your affinity for science combined with an open-minded approach suggests you'd excel in exploratory and innovative environments. Your curiosity and creativity will drive you forward in fields that value research and development."
    },
    "Technology and Conscientiousness": {
      environment: "structured and data-driven",
      careers: [
        "Systems Analyst",
        "Database Administrator",
        "Software Engineer",
        "Quality Assurance Lead"
      ],
      feedback: "Your technological aptitude combined with a conscientious nature suggests a structured and data-driven environment would suit you well. Your precision and organized workflow will be highly valued."
    },
    "English and Extraversion": {
      environment: "interactive and collaborative",
      careers: [
        "Content Strategist",
        "Communications Director",
        "Publishing Manager",
        "Public Relations"
      ],
      feedback: "Your English expertise combined with an extroverted personality makes an interactive and collaborative environment ideal for you. Your communication skills and team dynamics could shine."
    },
    "Art and Agreeableness": {
      environment: "supportive and community-focused",
      careers: [
        "Art Therapist",
        "Community Arts Director",
        "Design Team Lead",
        "Creative Workshop Facilitator"
      ],
      feedback: "Your artistic interests, paired with an agreeable nature, align well with supportive and community-focused environments. Your empathy and collaboration skills could make a real difference."
    },
    "Math and Neuroticism": {
      environment: "predictable and well-defined",
      careers: [
        "Data Analyst",
        "Financial Planner",
        "Risk Assessment Specialist",
        "Statistical Researcher"
      ],
      feedback: "With a solid background in math and a detail-oriented nature, you may find comfort in predictable and well-defined environments. Your analytical skills could serve well in roles requiring precision."
    }
    // Additional combinations will be loaded from the JSON file
  };
  
  export const getCareerFeedback = (steamCategory, oceanTrait) => {
    const key = `${steamCategory} and ${oceanTrait}`;
    return feedbackDatabase[key] || {
      environment: "dynamic and adaptable",
      careers: ["Various career paths available"],
      feedback: "Your unique combination of skills and traits suggests you could succeed in various roles. Consider exploring positions that combine your technical abilities with your personality strengths."
    };
  };