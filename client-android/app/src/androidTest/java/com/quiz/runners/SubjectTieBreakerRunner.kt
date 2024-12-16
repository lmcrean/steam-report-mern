/**
 * Ports from: client/tests/utils/quiz-runners/subjectTieBreaker.js
 */
object SubjectTieBreakerRunner {
    suspend fun handleTie(
        composeRule: ComposeTestRule,
        preferredSubject: QuizTestCases.Subject
    ) {
        with(composeRule) {
            try {
                // Verify tie breaker screen is visible
                onNodeWithText("Your Strongest Subjects")
                    .assertIsDisplayed()

                // Select preferred subject radio button
                onNodeWithTag("subject_${preferredSubject.name.lowercase()}")
                    .assertIsDisplayed()
                    .performClick()

                // Click confirm button
                onNodeWithText("Confirm Selection")
                    .assertIsDisplayed()
                    .performClick()

                // Wait for results section to appear
                onNodeWithText("Your Results")
                    .assertIsDisplayed()

            } catch (e: AssertionError) {
                // Log available buttons for debugging
                val buttons = onAllNodesWithRole(Role.Button)
                    .fetchSemanticsNodes()
                    .map { it.text }
                    .joinToString(", ")
                
                Log.e("SubjectTieBreaker", "Available buttons: $buttons")
                throw AssertionError("Subject tie breaker failed: ${e.message}")
            }
        }
    }
} 