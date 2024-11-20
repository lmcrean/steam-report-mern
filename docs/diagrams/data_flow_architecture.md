```mermaid
   graph TD
       subgraph QuizFlowComponents ["Quiz Flow Components"]
           direction LR
           M[Menu]
           U[UsernameEntry]
           P[PersonalityQuiz]
           S[SubjectQuiz]
           NS[NextSection Button]
           R[Results]
           NB[NetworkBoard]
           DB[Delete Button]
           RE[Restart Quiz Button]
       end

       subgraph Functionality ["Functionality"]
        subgraph CustomHooks ["Custom Hooks"]
            direction LR
            
            PS[usePersonalityScoring]
            SS[useSubjectScoring]
        end

        N[useNextSection]

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
            QC[QuizContext: INITIAL_STATE]
        end
    end

       subgraph NetworkBoardAPI ["Network Board API"]
           NA[QuizContext: NETWORK_BOARD_USER_RESULTS]
           A[API]

           D[DELETE]
       end

       %% Menu to UsernameEntry
       M -->|"start quiz"| U
       U -->|"enter username"| P
       P -->|"personality quiz"| S

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

       %% useNextSection updates section
       N -->|"update section"| QC

       %% Context provides state back to Results
       QC -->|"all quiz data"| R

       %% Results submits data to Network Board API
       R -->|"submit data from QuizContext"| NA
       NA -->|"submit data"| A
       A -->|"response"| NB
       NB -->|"delete data"| DB
       DB -->|"restart quiz"| D
       NB -->|"restart quiz"| RE
       RE -->|"restart quiz"| M


       classDef flow fill:royalblue,stroke:#ff9800,color:white
       classDef hooks fill:#e3f2fd,stroke:#1565c0,color:#000
       classDef core fill:#e8f5e9,stroke:#2e7d32,color:#000
       classDef results fill:#fff3e0,stroke:#ef6c00,color:#000
       classDef validation fill:#e0f7fa,stroke:#00796b,color:#000
       classDef functionality fill:grey,stroke:#9e9e9e,color:white

       class M,U,P,S,R,NB flow
       class N,PS,SS hooks
       class PST,SST ties
       class NU,PV,SV validation
       class QC,NA core
       class Functionality functionality
```