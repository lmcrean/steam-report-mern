# Automated Test

This Readme chapter introduces the **outcomes** of the Automated and Manual Testing. For instructions of how to carry out the tests refer to the **Usage & Deployment** readme chapter - for readibility it is not covered here.

The testing process favoured **TDD (Test Driven Development)** methodologies, where tests were written before the implementation of features. This approach helps ensure that the codebase remains stable and that new features do not break existing functionality. For that reason the Automatic Testing is introduced first. Manual Testing was then conducted after the completion of the app to ensure that all features work as expected from a user's perspective.

## Playwright Testing
The app includes automatic tests for core components and functionality using testing frameworks like Jest.

### quizflowstandard.test.js

```mermaid
flowchart TB
    %% Row 1: Test Setup & Navigation
    subgraph Setup ["Test Setup & Navigation"]
        direction LR
        Start([Start Test]) --> 
        LoadPage["page.goto('/')"] -->
        VerifyWelcome["Verify 'Welcome to STEAM Career Quiz'"] -->
        ClickStart["Click 'Start Quiz'"] -->
        Username["Enter 'TestUser'<br>Click Continue"]
    end

    %% Row 2: Data Generation & Personality Quiz
    subgraph PersonalitySection ["Personality Quiz Implementation"]
        direction LR
        subgraph PData ["Personality Data Setup"]
            direction TB
            OCEANData["Test Data Structure:
            Openness: [7,7,7,7,7] = 78%
            Conscientiousness: [6,6,6,6,6] = 67%
            Extraversion: [9,9,9,9,9] = 100%
            Agreeableness: [5,5,5,5,5] = 56%
            Neuroticism: [4,4,4,4,4] = 44%"]
        end

        subgraph PExecution ["Quiz Execution"]
            direction TB
            VerifyOCEAN["Verify 'OCEAN Personality Test' visible"] -->
            ForTrait["For each OCEAN trait:"] -->
            ForAnswer["For each answer in trait:
            1. Wait for question visible
            2. Select predetermined answer
            3. Wait for & click Next"]
        end
    end

    %% Row 3: Subject Quiz Implementation
    subgraph SubjectSection ["Subject Quiz Implementation"]
        direction LR
        subgraph SData ["Subject Data Setup"]
            direction TB
            STEAMData["Test Data Structure:
            Science: [T,T,T,T,T,T,F,F,F,F] = 60%
            Technology: [T,T,T,T,T,F,F,F,F,F] = 50%
            English: [T,T,T,T,F,F,F,F,F,F] = 40%
            Art: [T,T,T,F,F,F,F,F,F,F] = 30%
            Math: [T,T,T,T,T,T,T,T,T,T] = 100%"]
        end

        subgraph SExecution ["Quiz Execution"]
            direction TB
            ForSubject["For each subject:"] -->
            ForQuestion["For each question (1-10):
            1. Wait for question visible
            2. Wait for options (5s timeout)
            3. Select by answerIndex
            4. Wait for & click Next"]
        end
    end

    %% Row 4: Results Verification
    subgraph Verify ["Results Verification"]
        direction LR
        VerifyResults["Verify 'Your Results' Header"] -->
        VerifyProfile["Verify 'Personality Profile' Present"] -->
        VerifyMath["Verify Math Score Present"] -->
        VerifyExtra["Verify Extraversion Score Present"] -->
        Complete([Test Complete])
    end

    %% Connect the rows
    Setup --> PersonalitySection
    PExecution --> SubjectSection
    SExecution --> Verify

    classDef setup fill:#e3f2fd,stroke:#1565c0,color:#000
    classDef data fill:#e8f5e9,stroke:#2e7d32,color:#000
    classDef exec fill:#fff3e0,stroke:#ef6c00,color:#000
    classDef verify fill:#f3e5f5,stroke:#6a1b9a,color:#000

    class Start,LoadPage,VerifyWelcome,ClickStart,Username setup
    class OCEANData,STEAMData data
    class VerifyOCEAN,ForTrait,ForAnswer,ForSubject,ForQuestion exec
    class VerifyResults,VerifyProfile,VerifyMath,VerifyExtra,Complete verify
```


### edgecases.test.js


```mermaid
flowchart TB
    %% Row 1: Test Setup & Initial Navigation
    subgraph Setup ["Test Setup & Navigation"]
        direction LR
        Start([Start Test]) --> LoadPage["page.goto('/')"]
        LoadPage --> ClickStart["Click 'Start Quiz'"]
        ClickStart --> Username["Enter 'EdgeTest'<br>Click Continue"]
    end

    %% Row 2: Test Data Generation and Quiz Execution
    subgraph DataAndExecution ["Data Generation & Quiz Execution"]
        direction LR
        subgraph PersonalitySetup ["Personality Setup"]
            direction LR
            PData["Generate 25 responses:
            traitIndex % 5:
            [0,2,3] → value = 8
            others → value = 5"]
            -->
            PExpected["Expected Scores:
            Openness = 88.9%
            Extraversion = 88.9%
            Agreeableness = 88.9%
            Conscientiousness = 55.6%
            Neuroticism = 55.6%"]
            -->
            PQuiz["Execute Quiz:
            1. Find radio button
            2. Verify visibility
            3. Click value
            4. Click Next"]
        end

        subgraph SubjectSetup ["Subject Setup"]
            direction LR
            SData["Target Scores:
            Science: 7/10 = 70%
            Technology: 7/10 = 70%
            Math: 7/10 = 70%
            English: 5/10 = 50%
            Art: 5/10 = 50%"]
            -->
            SQuiz["Execute Quiz:
            For each subject:
            1. Track correct answers
            2. Select first option if
               needed correct < target
            3. Select second option
               otherwise"]
        end
    end

    %% Row 3: Tie Resolution for Both Quizzes
    subgraph TieResolution ["Tie Resolution Phase"]
        direction LR
        subgraph PersonalityTie ["Personality Tie Resolution"]
            direction TB
            PVerifyTie["Verify:
            1. 'Multiple traits' message shown
            2. Top 3 traits visible (O,E,A)
            3. Bottom 2 hidden (C,N)"]
            -->
            PSelectTrait["Select Extraversion
            Click Confirm"]
        end

        subgraph SubjectTie ["Subject Tie Resolution"]
            direction TB
            SVerifyTie["Verify:
            1. 'Multiple subjects' message shown
            2. Top 3 subjects visible (S,T,M)
            3. Bottom 2 hidden (E,A)"]
            -->
            SSelectSubject["Select Technology
            Click Confirm"]
        end
    end

    %% Row 4: Final Verification
    subgraph Verify ["Final Results Verification"]
        direction LR
        WaitLoad["Wait for networkidle"] -->
        VerifyPrefs["Verify Selected Preferences:
        • Personality: Extraversion
        • Subject: Technology"] -->
        VerifyScores["Verify Final Scores:
        • Extraversion: 97.8% (with bonus)
        • Other high scores: 88.9%
        • Low scores: 55.6%"] -->
        Complete([Test Complete])
    end

    %% Connect the rows
    Setup --> DataAndExecution
    PersonalitySetup --> SubjectSetup
    SubjectSetup --> TieResolution
    PersonalityTie --> SubjectTie
    TieResolution --> Verify

    classDef setup fill:#e3f2fd,stroke:#1565c0,color:#000
    classDef data fill:#e8f5e9,stroke:#2e7d32,color:#000
    classDef exec fill:#fff3e0,stroke:#ef6c00,color:#000
    classDef verify fill:#f3e5f5,stroke:#6a1b9a,color:#000

    class Start,LoadPage,ClickStart,Username setup
    class PData,PExpected,SData data
    class PQuiz,SQuiz exec
    class PersonalityTie,SubjectTie,WaitLoad,VerifyPrefs,VerifyScores,Complete verify
```