// src/components/quiz/preference-selection/preferenceDescriptions.js
export const getPersonalityTraitDescription = (trait) => {
    const descriptions = {
      Openness: "Curiosity and willingness to try new experiences",
      Conscientiousness: "Organization and attention to detail",
      Extraversion: "Energy from social interactions",
      Agreeableness: "Cooperation and consideration of others",
      Neuroticism: "Emotional sensitivity and awareness"
    };
    return descriptions[trait] || "";
  };
  
  export const getSubjectDescription = (subject) => {
    const descriptions = {
      Science: "Understanding natural phenomena and scientific principles",
      Technology: "Working with computers and digital systems",
      English: "Communication and literary analysis",
      Art: "Visual creativity and artistic expression",
      Math: "Problem-solving and numerical reasoning"
    };
    return descriptions[subject] || "";
  };