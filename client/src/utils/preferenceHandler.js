// preferenceHandler.js
export const applyTraitPreference = (scores, preferredTrait) => {
    if (!preferredTrait || !scores) return scores;
  
    // Add 10% bonus to preferred trait
    return Object.entries(scores).reduce((acc, [trait, score]) => ({
      ...acc,
      [trait]: trait === preferredTrait ? score * 1.1 : score
    }), {});
  };
  
  export const applySubjectPreference = (scores, preferredSubject) => {
    if (!preferredSubject || !scores) return scores;
  
    // Add 10% bonus to preferred subject
    return Object.entries(scores).reduce((acc, [subject, score]) => ({
      ...acc,
      [subject]: subject === preferredSubject ? score * 1.1 : score
    }), {});
  };
  
  export const calculateFinalScores = (
    personalityScores,
    subjectScores,
    preferredTrait,
    preferredSubject
  ) => {
    return {
      personality: applyTraitPreference(personalityScores, preferredTrait),
      subjects: applySubjectPreference(subjectScores, preferredSubject)
    };
  };