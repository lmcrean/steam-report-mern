/**
 * Ports from: client/tests/utils/quiz-runners/personalityTieBreaker.js
 */
object PersonalityTieBreakerRunner {
    suspend fun handleTie(
        composeRule: ComposeTestRule,
        preferredTrait: QuizTestCases.PersonalityTrait
    ) {
        with(composeRule) {
            try {
                // Verify tie breaker screen is visible
                onNodeWithText("We Found a Tie!")
                    .assertIsDisplayed()

                // Select preferred trait radio button
                onNodeWithTag("trait_${preferredTrait.name.lowercase()}")
                    .assertIsDisplayed()
                    .performClick()

                // Click confirm button
                onNodeWithText("Confirm Selection")
                    .assertIsDisplayed()
                    .performClick()

                // Wait for subject section to appear
                onNodeWithText("STEAM Subject Quiz")
                    .assertIsDisplayed()

            } catch (e: AssertionError) {
                Log.e("PersonalityTieBreaker", "Failed to handle personality tie breaker", e)
                throw AssertionError("Personality tie breaker failed: ${e.message}")
            }
        }
    }
} 