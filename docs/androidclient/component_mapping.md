# Web Client to Kotlin Client Component Mapping

## Core Architecture Components

### Entry Points & Configuration
| Web Client | Kotlin Client | Purpose |
|------------|---------------|----------|
| src/App.jsx | MainActivity.kt | Main application entry point |
| src/config/environment.js | config/Environment.kt | Environment & API config |
| src/context/quizConstants.js | domain/constants/QuizConstants.kt | App-wide constants |

### State Management
| Web Client | Kotlin Client | Purpose |
|------------|---------------|----------|
| src/context/QuizContext.jsx | domain/state/QuizStateManager.kt | Central state management |
| useContext hooks | ViewModels | State distribution |
| src/context/usePrepareResult.js | domain/state/ResultPreparation.kt | Result preparation |

### Navigation & Flow
| Web Client | Kotlin Client | Purpose |
|------------|---------------|----------|
| React Router | Jetpack Navigation | Navigation management |
| src/components/shared/useNextSection.js | domain/navigation/SectionNavigation.kt | Section transitions |
| src/components/layout/MainLayout.jsx | ui/components/layout/MainLayout.kt | Layout structure |

### Data Layer
| Web Client | Kotlin Client | Purpose |
|------------|---------------|----------|
| src/data/* JSON files | data/models/* | Data models |
| API fetch calls | domain/network/QuizApi.kt | API communication |
| src/data/getRandomQuestions.js | data/repositories/*Repository.kt | Data access |

### UI Components
| Web Client | Kotlin Client | Purpose |
|------------|---------------|----------|
| src/components/menu/MenuScreen.jsx | ui/screens/menu/MenuScreen.kt | Menu screen |
| src/components/personality/PersonalityQuiz.jsx | ui/screens/personality/PersonalityScreen.kt | Personality quiz |
| src/components/subject/SubjectQuiz.jsx | ui/screens/subject/SubjectScreen.kt | Subject quiz |
| src/components/results/QuizResults.jsx | ui/screens/results/ResultsScreen.kt | Results display |
| src/components/network-board/NetworkBoard.jsx | ui/screens/networkboard/NetworkBoardScreen.kt | Network board |

### Shared Components
| Web Client | Kotlin Client | Purpose |
|------------|---------------|----------|
| src/components/shared/QuizCard.jsx | ui/components/shared/QuizCard.kt | Question display |
| src/components/shared/ProgressBar.jsx | ui/components/shared/ProgressBar.kt | Progress indication |
| src/components/shared/Alert.jsx | ui/components/shared/Alert.kt | User notifications |
| src/components/shared/LoadingSpinner.jsx | ui/components/shared/LoadingSpinner.kt | Loading states |

### Business Logic
| Web Client | Kotlin Client | Purpose |
|------------|---------------|----------|
| usePersonalityScoring.js | domain/scoring/PersonalityScoring.kt | Personality scoring |
| useSubjectScoring.js | domain/scoring/SubjectScoring.kt | Subject scoring |
| usePersonalityCheckForTies.js | domain/ties/PersonalityTieChecker.kt | Tie detection |
| useSubjectCheckForTies.js | domain/ties/SubjectTieChecker.kt | Tie detection |

### Network Operations
| Web Client | Kotlin Client | Purpose |
|------------|---------------|----------|
| useGetNetworkBoard.js | domain/network/NetworkOperations.kt | Get board data |
| usePostResult.js | domain/network/ResultSubmission.kt | Submit results |
| useDeleteResult.js | domain/network/ResultDeletion.kt | Delete results |

## Key Architectural Differences

1. **State Management**
   - Web: React Context + Hooks
   - Kotlin: ViewModels + StateFlow

2. **UI Framework**
   - Web: React Components + JSX
   - Kotlin: Jetpack Compose

3. **Navigation**
   - Web: React Router
   - Kotlin: Jetpack Navigation

4. **Async Operations**
   - Web: Promises + async/await
   - Kotlin: Coroutines + Flow

5. **Dependency Injection**
   - Web: React Context
   - Kotlin: Hilt/Koin 