/**
 * Ports from: client/tests/utils/quiz-runners/checkQuizRestart.js
 */
object QuizRestartRunner {
    suspend fun verifyQuizRestart(
        composeRule: ComposeTestRule
    ) {
        with(composeRule) {
            try {
                // Verify we're on the menu page
                onNodeWithText("Career Quiz")
                    .assertIsDisplayed()

                // Verify start button is available
                onNodeWithText("Start Quiz")
                    .assertIsDisplayed()

                Log.d("QuizRestart", """
                    🔄 Quiz Restart Verification:
                       • Menu Page: ✅ Visible
                       • Start Button: ✅ Available
                """.trimIndent())

            } catch (e: AssertionError) {
                throw AssertionError("Quiz did not restart properly: ${e.message}")
            }
        }
    }
} 