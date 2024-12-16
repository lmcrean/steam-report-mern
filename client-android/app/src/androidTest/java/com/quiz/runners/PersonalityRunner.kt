/**
 * Ports from: client/tests/utils/quiz-runners/personalitySection.js
 */
object PersonalityRunner {
    suspend fun completeSection(
        composeRule: ComposeTestRule,
        answers: Map<QuizTestCases.PersonalityTrait, List<Int>>
    ) {
        with(composeRule) {
            // Complete all personality questions
            answers.forEach { (_, traitAnswers) ->
                traitAnswers.forEach { answer ->
                    // Select radio button for this answer
                    onNodeWithTag("radio_option_$answer")
                        .assertIsDisplayed()
                        .performClick()

                    // Click next button
                    onNodeWithText("Next")
                        .assertIsDisplayed()
                        .performClick()
                }
            }

            // Wait for either tie breaker or subject section
            waitUntilAtLeastOneExists(
                hasText("We Found a Tie!"),
                hasText("STEAM Subject Quiz")
            )
        }
    }

    private fun ComposeTestRule.waitUntilAtLeastOneExists(
        vararg matchers: SemanticsMatcher,
        timeoutMillis: Long = 2000
    ) {
        waitUntil(timeoutMillis) {
            matchers.any { matcher ->
                onAllNodes(matcher)
                    .fetchSemanticsNodes()
                    .isNotEmpty()
            }
        }
    }
} 