/**
 * Ports from: client/tests/utils/quiz-runners/personalitySection.js
 */
object PersonalitySectionRunner {
    suspend fun completePersonalitySection(
        composeRule: ComposeTestRule,
        answers: Map<QuizTestCases.PersonalityTrait, List<Int>>
    ) {
        with(composeRule) {
            try {
                // Complete all personality questions
                for ((trait, traitAnswers) in answers) {
                    for (answer in traitAnswers) {
                        // Select the radio button with the answer value
                        onNodeWithTag("radio_${answer}")
                            .assertIsDisplayed()
                            .performClick()

                        // Click next button
                        onNodeWithText("Next")
                            .assertIsDisplayed()
                            .performClick()
                    }
                }

                // Wait for either tie breaker or subject section
                waitForEitherSection(this)

            } catch (e: AssertionError) {
                throw AssertionError("Failed to complete personality section: ${e.message}")
            }
        }
    }

    private suspend fun waitForEitherSection(composeRule: ComposeTestRule) {
        with(composeRule) {
            // Try to find either the tie breaker or subject quiz heading
            try {
                onNodeWithText("We Found a Tie!")
                    .assertExists()
            } catch (e: AssertionError) {
                // If tie breaker not found, verify subject quiz is shown
                onNodeWithText("STEAM Subject Quiz")
                    .assertExists()
            }
        }
    }
} 