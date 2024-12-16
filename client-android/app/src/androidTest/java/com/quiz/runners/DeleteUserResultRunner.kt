/**
 * Ports from: client/tests/utils/quiz-runners/deleteUserResult.js
 */
object DeleteUserResultRunner {
    suspend fun deleteUserResult(
        composeRule: ComposeTestRule,
        testCase: QuizTestCases.TestCase
    ) {
        with(composeRule) {
            try {
                // Wait for network board and restart button to be visible
                onNodeWithTag("network_board")
                    .assertIsDisplayed()

                onNodeWithTag("restart_quiz_button")
                    .assertIsDisplayed()
                    .performClick()

                // Wait for confirmation modal and confirm deletion
                onNodeWithTag("confirmation_modal")
                    .assertIsDisplayed()

                onNodeWithTag("confirm_delete_button")
                    .assertIsDisplayed()
                    .performClick()

                // Wait for menu to appear after deletion
                onNodeWithText("Career Quiz")
                    .assertIsDisplayed()

                // Wait for start button to be available
                onNodeWithText("Start Quiz")
                    .assertIsDisplayed()

                Log.d("DeleteUserResult", """
                    🧪 Delete Verification:
                       • Status: ✅ Success
                       • User: ${testCase.username}
                       • Action: Result deleted and quiz restarted
                """.trimIndent())

            } catch (e: AssertionError) {
                throw AssertionError("Failed to delete user result: ${e.message}")
            }
        }
    }
} 