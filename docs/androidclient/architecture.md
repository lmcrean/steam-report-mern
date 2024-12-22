# Android Client Architecture

## Existing Structure (Locked)

### Data Layer (Locked)
```
app/src/main/java/data/
├── models/
│   ├── CareerFeedback.kt         // Ports from: src/data/feedbackDatabase.js
│   ├── PersonalityQuestion.kt    // Ports from: src/data/personalityQuestions.js
│   └── SubjectQuestion.kt        // Ports from: src/data/subjectQuestions.js
├── repositories/
│   ├── FeedbackRepository.kt     // Ports from: src/data/getCareerFeedback.js
│   ├── PersonalityRepository.kt  // Ports from: src/data/getRandomQuestions.js
│   └── SubjectsRepository.kt     // Ports from: src/data/getRandomQuestions.js
└── Repository.kt
```

### Test Layer (Locked)
```
app/src/androidTest/java/com/quiz/
├── data/
│   └── QuizTestCases.kt             // Ports from: quizInputs.js
├── runners/
│   ├── CareerRecommendationRunner.kt // Ports from: careerRecommendation.js
│   ├── ContextChecker.kt            // Ports from: checkContextRestarted.js
│   ├── QuizRestartChecker.kt        // Ports from: checkQuizRestart.js
│   ├── ResultsManager.kt            // Ports from: deleteUserResult.js
│   ├── NetworkBoardRunner.kt        // Ports from: networkBoard.js
│   ├── PersonalityRunner.kt         // Ports from: personalitySection.js
│   ├── TieBreakerRunner.kt          // Ports from: personalityTieBreaker.js & 
subjectTieBreaker.js
│   ├── ResultsVerifier.kt           // Ports from: resultsTextCheck.js
│   ├── QuizStarter.kt              // Ports from: startQuiz.js
│   └── SubjectRunner.kt            // Ports from: subjectSection.js
├── testsets/
│   ├── StandardFlowTest.kt         // Ports from: 1-quiz-standard-flow.spec.js
│   ├── PersonalityTiesTest.kt      // Ports from: 2-quiz-personality-ties.spec.js (TODO:)
│   ├── SubjectTiesTest.kt          // Ports from: 3-quiz-subject-ties.spec.js (TODO:)
│   └── BothTiesTest.kt             // Ports from: 4-quiz-both-ties.spec.js (TODO:)
└── utils/
    └── QuizTestRunner.kt           // Ports from: quiz-test-runner.js
│   └── NetworkBoardRunner.kt        // Ports from: networkBoard.js
└── testsets/
    └── StandardFlowTest.kt          // Ports from: quiz-standard-flow.spec.js
```

## Functionality Layer (To Implement)

### UI Components
```
app/src/main/java/ui/
├── screens/
│   ├── menu/
│   │   └── MenuScreen.kt           // Ports from: src/components/menu/MenuScreen.jsx
│   ├── username/
│   │   └── UsernameScreen.kt       // Ports from: src/components/username/UsernameEntry.jsx
│   ├── personality/
│   │   └── PersonalityScreen.kt    // Ports from: src/components/personality/PersonalityQuiz.jsx
│   ├── subject/
│   │   └── SubjectScreen.kt        // Ports from: src/components/subject/SubjectQuiz.jsx
│   ├── results/
│   │   └── ResultsScreen.kt        // Ports from: src/components/results/QuizResults.jsx
│   └── networkboard/
│       └── NetworkBoardScreen.kt   // Ports from: src/components/network-board/NetworkBoard.jsx
└── components/
    └── shared/                     // Ports from: src/components/shared/
        ├── QuizCard.kt
        ├── ProgressBar.kt
        └── LoadingSpinner.kt
```

### ViewModels
```
app/src/main/java/viewmodels/
├── QuizViewModel.kt                // Ports from: src/context/QuizContext.jsx
├── PersonalityViewModel.kt         // Ports from: src/components/personality/usePersonalityScoring.js
├── SubjectViewModel.kt             // Ports from: src/components/subject/useSubjectScoring.js
└── NetworkViewModel.kt             // Ports from: src/components/network-board/useGetNetworkBoard.js
```

### Domain Layer
```
app/src/main/java/domain/
├── usecases/
│   ├── personality/
│   │   ├── ScoringUseCase.kt      // Ports from: src/components/personality/usePersonalityScoring.js
│   │   └── ValidationUseCase.kt    // Ports from: src/components/personality/usePersonalityValidation.js
│   ├── subject/
│   │   ├── ScoringUseCase.kt      // Ports from: src/components/subject/useSubjectScoring.js
│   │   └── ValidationUseCase.kt    // Ports from: src/components/subject/useSubjectValidation.js
│   └── network/
│       ├── PostResultUseCase.kt    // Ports from: src/components/network-board/usePostResult.js
│       └── DeleteResultUseCase.kt  // Ports from: src/components/network-board/useDeleteResult.js
└── validation/
    └── UsernameValidator.kt        // Ports from: src/components/username/useUsernameValidation.js
```

## Key Implementation Notes

1. **State Management**
   - Replace React Context (QuizContext.jsx) with QuizViewModel using StateFlow
   - Convert React hooks to ViewModel functions with coroutines

2. **UI Components**
   - Convert JSX components to Jetpack Compose
   - Implement Material3 design system
   - Use Compose navigation instead of React Router

3. **Data Flow**
   - Maintain unidirectional data flow using ViewModels
   - Use StateFlow for reactive updates
   - Implement Repository pattern for data operations

## Dependencies
```kotlin
dependencies {
    // Core dependencies remain the same as before...
}
```

