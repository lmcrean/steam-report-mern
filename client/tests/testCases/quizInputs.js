const TEST_CASES = {
  // No ties (Cases 1-3)
  set1_standardFlow: {
    case1_clearWinners: {
      description: "Case 1: Clear single winners: Extraversion and Math",
      personalityAnswers: {
        // NOTE on MARKDOWN calculations: scores/45 Percentages appear accurate but only checked in samples, pecentages are out by quite a few %
        // console.logs in spec files appear to return perfectly accurate values
        Openness: [5, 5, 5, 5, 5], // 25/45 = 55%... 
        Conscientiousness: [6, 6, 6, 6, 6], // 30/45 = 67%
        Extraversion: [8, 8, 8, 8, 8], // 40/45 = 89%
        Agreeableness: [4, 4, 4, 4, 4], // 20/45 = 44%
        Neuroticism: [3, 3, 3, 3, 3], // 15/45 = 33%
      },
      subjectAnswers: {
        Math: [1, 1, 1, 1, 1, 1, 1, 1, 0, 0], // 8/10 = 80%
        Science: [1, 1, 1, 1, 1, 0, 0, 0, 0, 0], // 5/10 = 50%
        Technology: [1, 1, 1, 1, 0, 0, 0, 0, 0, 0], // 4/10 = 40%
        English: [1, 1, 1, 0, 0, 0, 0, 0, 0, 0], // 3/10 = 30%
        Art: [1, 1, 0, 0, 0, 0, 0, 0, 0, 0], // 2/10 = 20%
      },
    },

    case2_barelyNoTies: {
      description: "Case 2: Winners by 6% margin: Openness and Science",
      personalityAnswers: {
        Openness: [7, 7, 7, 6, 7], // 34/45 = 75%
        Conscientiousness: [6, 6, 6, 6, 6], // 30/45 = 67%
        Extraversion: [6, 6, 6, 6, 5], // 29/45 = 69%
        Agreeableness: [5, 5, 5, 5, 5], // 25/45 = 55%
        Neuroticism: [4, 4, 4, 4, 4], // 20/45 = 44%
      },
      subjectAnswers: {
        Science: [1, 1, 1, 1, 1, 1, 0, 0, 0, 0], // 6.5/10 = 65%
        Math: [1, 1, 1, 1, 1, 0, 0, 0, 0, 0], // 5/10 = 50%
        Technology: [1, 1, 1, 1, 0, 0, 0, 0, 0, 0], // 4/10 = 40%
        English: [1, 1, 1, 0, 0, 0, 0, 0, 0, 0], // 3/10 = 30%
        Art: [1, 1, 0, 0, 0, 0, 0, 0, 0, 0], // 2/10 = 20%
      },
    },

    case3_extremeWinners: {
      description: "Case 3: Extreme differences: Conscientiousness and Technology",
      personalityAnswers: {
        Conscientiousness: [9, 9, 9, 9, 9], // 45/45 = 100%
        Openness: [4, 4, 9, 4, 4], // 25/45 = 56%
        Extraversion: [3, 3, 3, 3, 3], // 15/45 = 33%
        Agreeableness: [2, 2, 2, 2, 2], // 10/45 = 22%
        Neuroticism: [1, 1, 1, 1, 1], // 5/45 = 11%
      },
      subjectAnswers: {
        Technology: [1, 1, 1, 1, 1, 1, 1, 1, 1, 0], // 9/10 = 90%
        Math: [1, 1, 1, 1, 1, 0, 0, 0, 0, 0], // 5/10 = 50%
        Science: [1, 1, 1, 0, 0, 0, 0, 0, 0, 0], // 3/10 = 30%
        English: [1, 1, 0, 0, 0, 0, 0, 0, 0, 0], // 2/10 = 20%
        Art: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 1/10 = 10%
      },
    },
  },

  // PERSONALITY TIE ONLY (Cases 1-3)
  set2_personalityTieOnly: {
    case1_twoWayTie: {
      description: "Case 1: Two-way personality tie Openness & Extraversion, Math clear winner",
      personalityAnswers: {
        Openness: [8, 8, 8, 8, 8], // 40/45 = 88%
        Extraversion: [8, 8, 8, 8, 8], // 40/45 = 88%
        Conscientiousness: [6, 6, 6, 6, 6], // 30/45 = 67%
        Agreeableness: [4, 4, 4, 4, 4], // 20/45 = 44%
        Neuroticism: [3, 3, 3, 3, 3], // 15/45 = 33%
      },
      subjectAnswers: {
        Math: [1, 1, 1, 1, 1, 1, 1, 1, 0, 0], // 8/10 = 80%
        Science: [1, 1, 1, 1, 1, 0, 0, 0, 0, 0], // 5/10 = 50%
        Technology: [1, 1, 1, 1, 0, 0, 0, 0, 0, 0], // 4/10 = 40%
        English: [1, 1, 1, 0, 0, 0, 0, 0, 0, 0], // 3/10 = 30%
        Art: [1, 1, 0, 0, 0, 0, 0, 0, 0, 0], // 2/10 = 20%
      },
      preferredTrait: "Extraversion",
    },
    case2_threeWayTie: {
      description: "Case 2: Three-way personality tie (Openness, Conscientiousness & Extraversion), Science clear winner",
      personalityAnswers: {
        Openness: [7, 7, 7, 7, 8], // 36/45 = 80%
        Conscientiousness: [7, 7, 7, 8, 7], // 36/45 = 80%
        Extraversion: [8, 7, 7, 7, 7], // 36/45 = 80%
        Agreeableness: [5, 5, 5, 5, 5], // 25/45 = 55%
        Neuroticism: [4, 4, 4, 4, 4], // 20/45 = 44%
      },
      subjectAnswers: {
        Science: [1, 1, 1, 1, 1, 1, 1, 0, 0, 0], // 7/10 = 70%
        Math: [1, 1, 1, 1, 1, 0, 0, 0, 0, 0], // 5/10 = 50%
        Technology: [1, 1, 1, 1, 0, 0, 0, 0, 0, 0], // 4/10 = 40%
        English: [1, 1, 1, 0, 0, 0, 0, 0, 0, 0], // 3/10 = 30%
        Art: [1, 1, 0, 0, 0, 0, 0, 0, 0, 0], // 2/10 = 20%
      },
      preferredTrait: "Openness",
    },
    case3_fourWayTie: {
      description: "Case 3: Four-way personality tie (all except Neuroticism), Technology clear winner",
      personalityAnswers: {
        Openness: [6, 6, 7, 6, 7], // 32/45 = 71%
        Conscientiousness: [7, 6, 6, 7, 6], // 32/45 = 71%
        Extraversion: [6, 7, 6, 7, 6], // 32/45 = 71%
        Agreeableness: [7, 6, 7, 6, 6], // 32/45 = 71%
        Neuroticism: [3, 3, 3, 3, 3], // 15/45 = 33%
      },
      subjectAnswers: {
        Technology: [1, 1, 1, 1, 1, 1, 1, 1, 0, 0], // 8/10 = 80%
        Science: [1, 1, 1, 1, 1, 0, 0, 0, 0, 0], // 5/10 = 50%
        Math: [1, 1, 1, 1, 0, 0, 0, 0, 0, 0], // 4/10 = 40%
        English: [1, 1, 1, 0, 0, 0, 0, 0, 0, 0], // 3/10 = 30%
        Art: [1, 1, 0, 0, 0, 0, 0, 0, 0, 0], // 2/10 = 20%
      },
      preferredTrait: "Conscientiousness",
    },
  },
  // Subject Tie Only (3 variations)
  set3_subjectTieOnly: {
    case1_twoWaySubjectTie: {
      description: "Case 1: Two-way subject tie (Math & Science), Extraversion clear winner",
      personalityAnswers: {
        Extraversion: [8, 8, 8, 8, 8], // 40/45 = 89%
        Openness: [6, 6, 6, 6, 6], // 30/45 = 67%
        Conscientiousness: [5, 5, 5, 5, 5], // 25/45 = 56%
        Agreeableness: [4, 4, 4, 4, 4], // 20/45 = 44%
        Neuroticism: [3, 3, 3, 3, 3], // 15/45 = 33%
      },
      subjectAnswers: {
        Math: [1, 1, 1, 1, 1, 1, 1, 0, 0, 0], // 7/10 = 70%
        Science: [1, 1, 1, 1, 1, 1, 1, 0, 0, 0], // 7/10 = 70%
        Technology: [1, 1, 1, 1, 0, 0, 0, 0, 0, 0], // 4/10 = 40%
        English: [1, 1, 1, 0, 0, 0, 0, 0, 0, 0], // 3/10 = 30%
        Art: [1, 1, 0, 0, 0, 0, 0, 0, 0, 0], // 2/10 = 20%
      },
      preferredSubject: "Math",
    },
    case2_threeWaySubjectTie: {
      description: "Case 2: Three-way subject tie (Math, Science & Technology), Openness clear winner",
      personalityAnswers: {
        Openness: [8, 8, 8, 8, 8], // 40/45 = 89%
        Conscientiousness: [6, 6, 6, 6, 6], // 30/45 = 67%
        Extraversion: [5, 5, 5, 5, 5], // 25/45 = 56%
        Agreeableness: [4, 4, 4, 4, 4], // 20/45 = 44%
        Neuroticism: [3, 3, 3, 3, 3], // 15/45 = 33%
      },
      subjectAnswers: {
        Math: [1, 1, 1, 1, 1, 1, 0, 0, 0, 0], // 6/10 = 60%
        Science: [1, 1, 1, 1, 1, 1, 0, 0, 0, 0], // 6/10 = 60%
        Technology: [1, 1, 1, 1, 1, 1, 0, 0, 0, 0], // 6/10 = 60%
        English: [1, 1, 1, 0, 0, 0, 0, 0, 0, 0], // 3/10 = 30%
        Art: [1, 1, 0, 0, 0, 0, 0, 0, 0, 0], // 2/10 = 20%
      },
      preferredSubject: "Science",
    },
    case3_fourWaySubjectTie: {
      description: "Case 3: Four-way subject tie (all except Art), Agreeableness clear winner",
      personalityAnswers: {
        Agreeableness: [8, 8, 8, 8, 8], // 40/45 = 89%
        Openness: [6, 6, 6, 6, 6], // 30/45 = 67%
        Conscientiousness: [5, 5, 5, 5, 5], // 25/45 = 56%
        Extraversion: [4, 4, 4, 4, 4], // 20/45 = 44%
        Neuroticism: [3, 3, 3, 3, 3], // 15/45 = 33%
      },
      subjectAnswers: {
        Math: [1, 1, 1, 1, 1, 1, 0, 0, 0, 0], // 6/10 = 60%
        Science: [1, 1, 1, 1, 1, 1, 0, 0, 0, 0], // 6/10 = 60%
        Technology: [1, 1, 1, 1, 1, 1, 0, 0, 0, 0], // 6/10 = 60%
        English: [1, 1, 1, 1, 1, 1, 0, 0, 0, 0], // 6/10 = 60%
        Art: [1, 1, 0, 0, 0, 0, 0, 0, 0, 0], // 2/10 = 20%
      },
      preferredSubject: "Technology",
    },
  },
  // Subject and Personality Ties (3 variations)
  set4_subjectAndPersonalityTies: {
    case1_simpleDoubleTie: {
      description: "Case 1: Two-way ties in both categories (Openness/Extraversion, Math/Science)",
      personalityAnswers: {
        Openness: [7, 7, 7, 7, 8], // 36/45 = 80%
        Extraversion: [8, 7, 7, 7, 7], // 36/45 = 80%
        Conscientiousness: [6, 6, 6, 6, 6], // 30/45 = 67%
        Agreeableness: [5, 5, 5, 5, 5], // 25/45 = 56%
        Neuroticism: [4, 4, 4, 4, 4], // 20/45 = 44%
      },
      subjectAnswers: {
        Math: [1, 1, 1, 1, 1, 1, 1, 0, 0, 0], // 7/10 = 70%
        Science: [1, 1, 1, 1, 1, 1, 1, 0, 0, 0], // 7/10 = 70%
        Technology: [1, 1, 1, 1, 0, 0, 0, 0, 0, 0], // 4/10 = 40%
        English: [1, 1, 1, 0, 0, 0, 0, 0, 0, 0], // 3/10 = 30%
        Art: [1, 1, 0, 0, 0, 0, 0, 0, 0, 0], // 2/10 = 20%
      },
      preferredTrait: "Extraversion",
      preferredSubject: "Math",
    },
    case2_complexMixedTies: {
      description: "Case 2: Three-way personality tie, two-way subject tie (different scores)",
      personalityAnswers: {
        Openness: [7, 7, 7, 7, 7], // 35/45 = 78%
        Conscientiousness: [7, 7, 7, 7, 7], // 35/45 = 78%
        Extraversion: [7, 7, 7, 7, 7], // 35/45 = 78%
        Agreeableness: [5, 5, 5, 5, 5], // 25/45 = 56%
        Neuroticism: [4, 4, 4, 4, 4], // 20/45 = 44%
      },
      subjectAnswers: {
        Math: [1, 1, 1, 1, 1, 1, 1, 1, 0, 0], // 8/10 = 80%
        Science: [1, 1, 1, 1, 1, 1, 1, 1, 0, 0], // 8/10 = 80%
        Technology: [1, 1, 1, 1, 1, 0, 0, 0, 0, 0], // 5/10 = 50%
        English: [1, 1, 1, 0, 0, 0, 0, 0, 0, 0], // 3/10 = 30%
        Art: [1, 1, 0, 0, 0, 0, 0, 0, 0, 0], // 2/10 = 20%
      },
      preferredTrait: "Conscientiousness",
      preferredSubject: "Science",
    },
    case3_allWayTies: {
      description: "Case 3: All traits tied (except Neuroticism), all subjects tied (except Art)",
      personalityAnswers: {
        Openness: [7, 7, 7, 7, 7], // 35/45 = 78%
        Conscientiousness: [7, 7, 7, 7, 7], // 35/45 = 78%
        Extraversion: [7, 7, 7, 7, 7], // 35/45 = 78%
        Agreeableness: [7, 7, 7, 7, 7], // 35/45 = 78%
        Neuroticism: [4, 4, 4, 4, 4], // 20/45 = 44%
      },
      subjectAnswers: {
        Math: [1, 1, 1, 1, 1, 1, 0, 0, 0, 0], // 6/10 = 60%
        Science: [1, 1, 1, 1, 1, 1, 0, 0, 0, 0], // 6/10 = 60%
        Technology: [1, 1, 1, 1, 1, 1, 0, 0, 0, 0], // 6/10 = 60%
        English: [1, 1, 1, 1, 1, 1, 0, 0, 0, 0], // 6/10 = 60%
        Art: [1, 1, 0, 0, 0, 0, 0, 0, 0, 0], // 2/10 = 20%
      },
      preferredTrait: "Openness",
      preferredSubject: "Science",
    },
  },
};

export { TEST_CASES };