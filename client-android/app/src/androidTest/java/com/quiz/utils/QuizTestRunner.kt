/**
 * Ports from: client/tests/utils/quiz-test-runner.js
 * Reviewed as ported correctly 10/10/2024
 */
object QuizTestRunner {
    suspend fun runQuizTestCase(
        composeRule: ComposeTestRule,
        testCase: QuizTestCases.TestCase,
        subjectsData: Map<QuizTestCases.Subject, SubjectSectionRunner.SubjectData>,
        feedbackDatabase: Map<String, CareerRecommendationRunner.CareerFeedback>,
        quizContext: ContextRestartRunner.QuizContext
    ) {
        with(composeRule) {
            // Start quiz
            StartQuizRunner.startQuiz(this, testCase.username)

            // Complete personality section
            PersonalitySectionRunner.completePersonalitySection(this, testCase.personalityAnswers)

            // Handle personality tie breaker if needed
            if (hasPersonalityTie()) {
                require(testCase.preferredTrait != null) {
                    "Tie breaker screen shown but no preferred trait specified in test case"
                }
                PersonalityTieBreakerRunner.handleTie(this, testCase.preferredTrait)
            } else {
                // Wait for subject quiz section if no tie
                onNodeWithText("STEAM Subject Quiz")
                    .assertIsDisplayed()
            }

            // Complete subject section
            SubjectSectionRunner.completeSubjectSection(this, testCase.subjectAnswers, subjectsData)

            // Handle subject tie breaker if needed
            if (hasSubjectTie()) {
                require(testCase.preferredSubject != null) {
                    "Subject tie breaker screen shown but no preferred subject specified in test case"
                }
                SubjectTieBreakerRunner.handleTie(this, testCase.preferredSubject)
            }

            // Verify results
            ResultsTextCheckRunner.verifyResultsText(this, testCase)
            CareerRecommendationRunner.verifyCareerRecommendations(this, testCase, feedbackDatabase)

            try {
                NetworkBoardRunner.verifyNetworkBoard(this, testCase)
            } catch (e: AssertionError) {
                Log.e("QuizTestRunner", "Network Board verification failed: ${e.message}")
                throw e
            }

            // Cleanup
            DeleteUserResultRunner.deleteUserResult(this, testCase)
            QuizRestartRunner.verifyQuizRestart(this)
            ContextRestartRunner.verifyContextRestarted(this, quizContext)
        }
    }

    private fun ComposeTestRule.hasPersonalityTie(): Boolean {
        return try {
            onNodeWithText("We Found a Tie!")
                .assertExists()
            true
        } catch (e: AssertionError) {
            false
        }
    }

    private fun ComposeTestRule.hasSubjectTie(): Boolean {
        return try {
            onNodeWithText("Your Strongest Subjects")
                .assertExists()
            true
        } catch (e: AssertionError) {
            false
        }
    }
} 