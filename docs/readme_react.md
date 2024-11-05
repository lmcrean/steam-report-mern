# Technical Architecture

## Client Application Flow

```mermaid
flowchart TB
    %% Row 1: Core Application Structure
    subgraph Core ["Core Application"]
        direction LR
        A[App.jsx] --> B[QuizContext]
        B --> C[MainLayout]
    end

    %% Row 2: User Interface Flow
    subgraph Interface ["User Interface Flow"]
        direction LR
        D[MenuScreen] --> E[UsernameEntry]
        E --> F[PersonalityQuiz]
        F --> G[SubjectQuiz]
        G --> H[PreferenceSelection_if_applicable]
        H --> I[QuizResults]
    end

    %% Row 3: Data Management
    subgraph Data ["Data Layer"]
        direction LR
        J[(Personality DB)] --> K[Score Processing]
        L[(Subject DB)] --> K
        K --> M[(Results DB)]
    end

    %% Connect the rows
    Core --> Interface
    Interface --> Data

    classDef core fill:#e3f2fd,stroke:#1565c0,color:#000
    classDef interface fill:#e8f5e9,stroke:#2e7d32,color:#000
    classDef data fill:#fff3e0,stroke:#ef6c00,color:#000

    class A,B,C core
    class D,E,F,G,H,I interface
    class J,K,L,M data
```

## Component Architecture

```mermaid
flowchart TB
    %% Row 1: UI Components
    subgraph UI ["User Interface Layer"]
        direction LR
        A[MainLayout] --> B[Header]
        A --> C[QuizCard]
        C --> D[InputControls]
    end
    
    %% Row 2: Business Logic
    subgraph Logic ["Business Logic Layer"]
        direction LR
        E[QuizContext] --> F[ScoreCalculator]
        F --> G[NavigationControl]
        G --> H[StateManager]
    end
    
    %% Row 3: Data Processing
    subgraph Processing ["Data Processing Layer"]
        direction LR
        I[DataCollection] --> J[Analysis]
        J --> K[ResultsGeneration]
    end

    %% Connect the rows
    UI --> Logic
    Logic --> Processing

    classDef ui fill:#e3f2fd,stroke:#1565c0,color:#000
    classDef logic fill:#e8f5e9,stroke:#2e7d32,color:#000
    classDef process fill:#fff3e0,stroke:#ef6c00,color:#000

    class A,B,C,D ui
    class E,F,G,H logic
    class I,J,K process
```

## Data Flow Pipeline

```mermaid
flowchart TB
    %% Row 1: User Input Collection
    subgraph Input ["User Input Phase"]
        direction LR
        A[Personality Test] --> B[Subject Test]
        B --> C[Preferences]
    end
    
    %% Row 2: Processing Logic
    subgraph Process ["Processing Phase"]
        direction LR
        D[Score Calculation] --> E[Career Matching]
        E --> F[Recommendation Engine]
    end
    
    %% Row 3: Output Generation
    subgraph Output ["Output Phase"]
        direction LR
        G[Results Display] --> H[Visualization]
        H --> I[Final Report]
    end

    %% Connect the rows
    Input --> Process
    Process --> Output

    classDef input fill:#e3f2fd,stroke:#1565c0,color:#000
    classDef process fill:#e8f5e9,stroke:#2e7d32,color:#000
    classDef output fill:#fff3e0,stroke:#ef6c00,color:#000

    class A,B,C input
    class D,E,F process
    class G,H,I output
```

# Important Files

## QuizContext.js and Related Hooks

The quiz application uses a combination of Context and Custom Hooks for state management and business logic:

### QuizContext
Acts as the central state container, providing:
- Core state management
- Basic state updates
- Context provider wrapper

### Data Flow Architecture

This flowchart shows the data flow between the components and the custom hooks.

```mermaid
graph TD
    subgraph QuizFlowComponents ["Quiz Flow Components"]
        direction LR
        U[UsernameEntry]
        P[PersonalityQuiz]
        S[SubjectQuiz]
        NS[NextSection]
    end

    subgraph CustomHooks ["Custom Hooks"]
        direction LR
        N[useQuizNavigation]
        PS[usePersonalityScoring]
        SS[useSubjectScoring]
    end

    subgraph CheckForTies ["Check for Ties Edge Case"]
        direction LR
        PST[CheckForPersonalityTies]
        SST[CheckForSubjectTies]
    end

    subgraph ValidationHooks ["Validation Hooks"]
        direction LR
        NU[useUsernameValidation]
        PV[usePersonalityValidation]
        SV[useSubjectValidation]
    end

    subgraph CoreState ["Core State"]
        QC[QuizContext]
    end

    subgraph ResultsComponent ["Results"]
        R[Results]
    end

    %% Data flow connections
    NS -->|"updates section"| N
    P -->|"personality answers"| PS
    PS -->|"check for ties"| PST
    PST -->|"validated personality data"| PV
    S -->|"subject answers"| SS
    SS -->|"check for ties"| SST
    SST -->|"validated subject data"| SV

    %% Custom hooks to validation hooks
    U -->|"update username"| NU

    %% Validation hooks update context
    NU -->|"validated username"| QC
    PV -->|"validated personality data"| QC
    SV -->|"validated subject data"| QC

    %% useQuizNavigation updates section
    N -->|"update section"| QC

    %% Context provides state back to Results
    QC -->|"all quiz data"| R

    classDef flow fill:#f9f9f9,stroke:#ff9800,color:#000
    classDef hooks fill:#e3f2fd,stroke:#1565c0,color:#000
    classDef core fill:#e8f5e9,stroke:#2e7d32,color:#000
    classDef results fill:#fff3e0,stroke:#ef6c00,color:#000
    classDef validation fill:#e0f7fa,stroke:#00796b,color:#000

    class U,P,S,NS flow
    class N,PS,SS hooks
    class PST,SST ties
    class NU,PV,SV validation
    class QC core
    class R results
```


### CheckForTies edge case



### CheckForTies edge case

in the case of a tie, the user is asked to select the best option.

When we travel to Results, we check for ties and if there are any, we display the tie and ask the user to select the best option.

```mermaid
flowchart TB

    subgraph PersonalityTie ["Personality Tie"]
      %% Check Personality first lane
      P[Personality Tie?]
      
      P -->|Yes| C[Display Personality Tie]

      %% Personality Tie Calculation
      C --> D[User Input for Personality]      
    end

    subgraph SubjectTie ["Subject Tie"]
      %% Check Subject second lane
      S[Subject Tie?]
      S -->|Yes| G[Display Subject Tie]
      G --> H[User Input for Subject]

    end

    %% Context Updates State
    subgraph ValidationHooks ["Validation Hooks"]
      P -->|No| PV
      D --> PV[Personality Tie Results]
      H --> SV
      PV[Personality Validation hooks]
      SV[Subject Validation hooks]

    end

    subgraph ContextUpdates ["Context Updates State"]
      PV --> CUS[Context Updates State]
      SV --> CUS[Context Updates State]
      CUS --> NS[Next Section]
    end

    classDef decision fill:white,stroke:#1565c0,color:#000
    classDef validation fill:white,stroke:grey,color:#000
    classDef context fill:#fff3e0,stroke:#ef6c00,color:#000
    classDef userInput fill:purple,stroke:#00796b,color:white

    class B,P,S decision
    class A,C,E,F,G,I,J,K,L,M,N,O action
    class D,H userInput
    class PV,SV validation
    class CUS context
```

### Custom Hooks Architecture

```mermaid
graph TD
    subgraph ContextLayer["Context Layer"]
        QC[QuizContext]
    end

    subgraph CustomHooks["Custom Hooks Layer"]
        QV[useQuizValidation]
        QS[useQuizScoring]
        QN[useQuizNavigation]
    end

    subgraph Features["Feature Layer"]
        V[Validation Logic]
        S[Scoring System]
        N[Navigation Control]
    end

    %% Context connections
    QC --> QV
    QC --> QS
    QC --> QN

    %% Hook implementations
```

