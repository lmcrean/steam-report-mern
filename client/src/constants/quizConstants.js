// Quiz sections in order of progression
export const QUIZ_SECTIONS = [
  'menu',
  'username',
  'personality',
  'subject',
  'preference-selection',
  'results',
  'leaderboard'
];

// Initial state for the quiz context
export const INITIAL_STATE = {
  section: 'menu',
  username: '',
  startTime: null,
  completionTime: null,
  personalityAnswers: [],
  personalityScores: null,
  calculatedTraitPercentages: null,
  validatedPersonalityScores: null,
  finalTraitPercentages: null,
  personalityTies: [],
  needsPreferenceSelection: false,
  preferredTrait: null
};

// Tolerance for considering scores as tied (percentage points)
// for example, if the score is 50.001, it will be considered 50
export const SCORE_TOLERANCE = 5; 