# Proposed Test Architecture (ports from the web client)

client-android/app/src/androidTest/java/com/quiz/
├── data/
│   └── QuizTestCases.kt             // Ports from: quizInputs.js
├── runners/
│   ├── CareerRecommendationRunner.kt // Ports from: careerRecommendation.js
│   ├── ContextChecker.kt            // Ports from: checkContextRestarted.js
│   ├── QuizRestartChecker.kt        // Ports from: checkQuizRestart.js
│   ├── ResultsManager.kt            // Ports from: deleteUserResult.js
│   ├── NetworkBoardRunner.kt        // Ports from: networkBoard.js
│   ├── PersonalityRunner.kt         // Ports from: personalitySection.js
│   ├── TieBreakerRunner.kt          // Ports from: personalityTieBreaker.js & subjectTieBreaker.js
│   ├── ResultsVerifier.kt           // Ports from: resultsTextCheck.js
│   ├── QuizStarter.kt              // Ports from: startQuiz.js
│   └── SubjectRunner.kt            // Ports from: subjectSection.js
├── testsets/
│   ├── StandardFlowTest.kt         // Ports from: 1-quiz-standard-flow.spec.js
│   ├── PersonalityTiesTest.kt      // Ports from: 2-quiz-personality-ties.spec.js
│   ├── SubjectTiesTest.kt          // Ports from: 3-quiz-subject-ties.spec.js
│   └── BothTiesTest.kt             // Ports from: 4-quiz-both-ties.spec.js
└── utils/
    └── QuizTestRunner.kt           // Ports from: quiz-test-runner.js

