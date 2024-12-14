export const loadSubjects = async () => {
  const response = await fetch('/data/subjectQuestions.json');
  return response.json();
};

export const loadFeedback = async () => {
  const response = await fetch('/data/feedbackOutput.json');
  return response.json();
};

export const loadPersonality = async () => {
  const response = await fetch('/data/personalityQuestions.json');
  return response.json();
}; 