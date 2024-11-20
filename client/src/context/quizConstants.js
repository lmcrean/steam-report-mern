// Quiz sections in order of progression
export const QUIZ_SECTIONS = [
  'menu',
  'username',
  'personality',
  'personality-tiebreaker',
  'subject',
  'subject-tiebreaker',
  'results'
];

// Initial state for the quiz context
export const INITIAL_STATE = {
  section: 'menu',
  username: '',
  traitPercentages: null,
  needsPersonalityTieBreaker: false,
  personalityTies: [],
  preferredTrait: null,
  subjectPercentages: null,
  needsSubjectTieBreaker: false,
  subjectTies: [],
  preferredSubject: null,
};

export const NETWORK_BOARD_USER_RESULTS = {
  username: '',
  bestSubject: '',
  subjectScore: 0,
  bestPersonalityTrait: '',
  personalityScore: 0,
  preferredEnvironment: '',
  dateOfSubmission: ''
}

// Tolerance for considering scores as tied (percentage points)
// for example, if the score is 50.001, it will be considered 50
export const SCORE_TOLERANCE = 5; 