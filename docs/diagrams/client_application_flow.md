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
