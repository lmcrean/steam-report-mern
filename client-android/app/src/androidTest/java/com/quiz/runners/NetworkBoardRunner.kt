/**
 * Ports from: client/tests/utils/quiz-runners/networkBoard.js
 */
object NetworkBoardRunner {
    suspend fun verifyNetworkBoard(
        composeRule: ComposeTestRule,
        testCase: QuizTestCases.TestCase
    ) {
        with(composeRule) {
            try {
                // Wait for network board to be visible
                onNodeWithTag("network_board")
                    .assertIsDisplayed()

                // Verify table headers are present
                listOf(
                    "Username",
                    "Best Subject",
                    "Subject Score",
                    "Best Personality Trait",
                    "Personality Score",
                    "Preferred Environment",
                    "Date",
                    "Actions"
                ).forEach { header ->
                    onNodeWithText(header)
                        .assertIsDisplayed()
                }

                // Verify current user's row exists and contains correct data
                onNodeWithTag("user_row_${testCase.username}")
                    .assertIsDisplayed()
                    .assertHasClass("current-user")

                // Verify the delete button is available for current user
                onNodeWithText("Delete my result")
                    .assertIsDisplayed()

                Log.d("NetworkBoard", "✓ Network board verification complete")

            } catch (e: AssertionError) {
                throw AssertionError("Failed to verify network board: ${e.message}")
            }
        }
    }
} 