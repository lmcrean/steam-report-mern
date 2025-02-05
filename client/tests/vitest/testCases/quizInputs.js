const TEST_CASES = {
  // No ties (Cases 1-3)
  set1_standardFlow: {
    case1_clearWinners: {
      description: "Case 1: Clear single winners: Extraversion and Math",
      personalityAnswers: {
        Openness: [5, 5, 5, 5, 5], // 25/45 = 55%
        Conscientiousness: [6, 6, 6, 6, 6], // 30/45 = 67%
        Extraversion: [8, 8, 8, 8, 8], // 40/45 = 89%
        Agreeableness: [4, 4, 4, 4, 4], // 20/45 = 44%
        Neuroticism: [3, 3, 3, 3, 3], // 15/45 = 33%
      },
      subjectAnswers: {
        Science: [1, 1, 1, 1, 1, 0, 0, 0, 0, 0], // 5/10 = 50%
        Technology: [1, 1, 1, 1, 0, 0, 0, 0, 0, 0], // 4/10 = 40%
        English: [1, 1, 1, 0, 0, 0, 0, 0, 0, 0], // 3/10 = 30%
        Art: [1, 1, 0, 0, 0, 0, 0, 0, 0, 0], // 2/10 = 20%
        Math: [1, 1, 1, 1, 1, 1, 1, 1, 0, 0], // 8/10 = 80%
      },
      topScores: "Math and Extraversion",
    },
  },

  // PERSONALITY TIE ONLY (Cases 1-3)
  set2_personalityTieOnly: {
    case1_twoWayTie: {
      description: "Case 1: Two-way personality tie Openness & Extraversion, Math clear winner",
      personalityAnswers: {
        Openness: [8, 8, 8, 8, 8], // 40/45 = 89%
        Conscientiousness: [6, 6, 6, 6, 6], // 30/45 = 67%
        Extraversion: [8, 8, 8, 8, 8], // 40/45 = 89%
        Agreeableness: [4, 4, 4, 4, 4], // 20/45 = 44%
        Neuroticism: [3, 3, 3, 3, 3], // 15/45 = 33%
      },
      subjectAnswers: {
        Science: [1, 1, 1, 1, 1, 0, 0, 0, 0, 0], // 5/10 = 50%
        Technology: [1, 1, 1, 1, 0, 0, 0, 0, 0, 0], // 4/10 = 40%
        English: [1, 1, 1, 0, 0, 0, 0, 0, 0, 0], // 3/10 = 30%
        Art: [1, 1, 0, 0, 0, 0, 0, 0, 0, 0], // 2/10 = 20%
        Math: [1, 1, 1, 1, 1, 1, 1, 1, 0, 0], // 8/10 = 80%
      },
      preferredTrait: "Extraversion",
      topScores: "Math and Extraversion",
    },
  },

  // Subject Tie Only (3 variations)
  set3_subjectTieOnly: {
    case1_twoWaySubjectTie: {
      description: "Case 1: Two-way subject tie (Math & Science), Extraversion clear winner",
      personalityAnswers: {
        Openness: [6, 6, 6, 6, 6], // 30/45 = 67%
        Conscientiousness: [5, 5, 5, 5, 5], // 25/45 = 56%
        Extraversion: [8, 8, 8, 8, 8], // 40/45 = 89%
        Agreeableness: [4, 4, 4, 4, 4], // 20/45 = 44%
        Neuroticism: [3, 3, 3, 3, 3], // 15/45 = 33%
      },
      subjectAnswers: {
        Science: [1, 1, 1, 1, 1, 1, 1, 0, 0, 0], // 7/10 = 70%
        Technology: [1, 1, 1, 1, 0, 0, 0, 0, 0, 0], // 4/10 = 40%
        English: [1, 1, 1, 0, 0, 0, 0, 0, 0, 0], // 3/10 = 30%
        Art: [1, 1, 0, 0, 0, 0, 0, 0, 0, 0], // 2/10 = 20%
        Math: [1, 1, 1, 1, 1, 1, 1, 0, 0, 0], // 7/10 = 70%
      },
      preferredSubject: "Math",
      topScores: "Math and Extraversion",
    },
  },

  // Subject and Personality Ties (3 variations)
  set4_subjectAndPersonalityTies: {
    case1_simpleDoubleTie: {
      description: "Case 1: Two-way ties in both categories (Openness/Extraversion, Math/Science)",
      personalityAnswers: {
        Openness: [8, 8, 8, 8, 8], // 40/45 = 89%
        Conscientiousness: [6, 6, 6, 6, 6], // 30/45 = 67%
        Extraversion: [8, 8, 8, 8, 8], // 40/45 = 89%
        Agreeableness: [4, 4, 4, 4, 4], // 20/45 = 44%
        Neuroticism: [3, 3, 3, 3, 3], // 15/45 = 33%
      },
      subjectAnswers: {
        Science: [1, 1, 1, 1, 1, 1, 1, 0, 0, 0], // 7/10 = 70%
        Technology: [1, 1, 1, 1, 0, 0, 0, 0, 0, 0], // 4/10 = 40%
        English: [1, 1, 1, 0, 0, 0, 0, 0, 0, 0], // 3/10 = 30%
        Art: [1, 1, 0, 0, 0, 0, 0, 0, 0, 0], // 2/10 = 20%
        Math: [1, 1, 1, 1, 1, 1, 1, 0, 0, 0], // 7/10 = 70%
      },
      preferredTrait: "Extraversion",
      preferredSubject: "Math",
      topScores: "Math and Extraversion",
    },
  },
};

export { TEST_CASES }; 