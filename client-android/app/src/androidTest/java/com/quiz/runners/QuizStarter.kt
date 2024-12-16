/**
 * Ports from: client/tests/utils/quiz-runners/startQuiz.js
 */
object QuizStarter {
    suspend fun startQuiz(composeRule: ComposeTestRule) {
        with(composeRule) {
            // Wait for and click start button
            onNodeWithText("Start Quiz")
                .assertIsDisplayed()
                .performClick()

            // Enter username
            onNodeWithTag("username_input")
                .performTextInput("TestUser")

            // Click continue button
            onNodeWithText("Continue")
                .assertIsDisplayed()
                .performClick()

            // Verify quiz has started by checking for first question
            onNodeWithTag("quiz_question")
                .assertIsDisplayed()
        }
    }
} 