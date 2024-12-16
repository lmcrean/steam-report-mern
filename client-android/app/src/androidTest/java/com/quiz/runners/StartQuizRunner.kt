/**
 * Ports from: client/tests/utils/quiz-runners/startQuiz.js
 */
object StartQuizRunner {
    suspend fun startQuiz(
        composeRule: ComposeTestRule,
        username: String = "TestUser"
    ) {
        with(composeRule) {
            try {
                // Click start quiz button
                onNodeWithText("Start Quiz")
                    .assertIsDisplayed()
                    .performClick()

                // Enter username
                onNodeWithTag("username_input")
                    .assertIsDisplayed()
                    .performTextInput(username)

                // Click continue button
                onNodeWithText("Continue")
                    .assertIsDisplayed()
                    .performClick()

                // Wait for personality section to appear
                onNodeWithText("Personality Quiz")
                    .assertIsDisplayed()

            } catch (e: AssertionError) {
                throw AssertionError("Failed to start quiz: ${e.message}")
            }
        }
    }
} 