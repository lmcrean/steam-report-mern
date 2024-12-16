/**
 * Ports from: client/tests/utils/quiz-runners/resultsTextCheck.js
 */
object ResultsTextCheckRunner {
    suspend fun verifyResultsText(
        composeRule: ComposeTestRule,
        testCase: QuizTestCases.TestCase
    ) {
        with(composeRule) {
            try {
                // Wait for results section to be visible
                onNodeWithText("Your Results")
                    .assertIsDisplayed()

                // Verify each personality trait score is displayed
                testCase.personalityAnswers.forEach { (trait, scores) ->
                    // Calculate expected score percentage
                    val expectedScore = calculateTraitScore(scores)
                    
                    // Verify trait and score are displayed
                    onNodeWithTag("trait_score_${trait.name.lowercase()}")
                        .assertIsDisplayed()
                        .assertTextContains("$expectedScore%")
                }

                // Verify the top trait is highlighted
                val topTrait = testCase.topScores.split(" and ")[1]
                onNodeWithTag("trait_score_${topTrait.lowercase()}")
                    .assertIsDisplayed()
                    .assertHasClass("text-green-600")

            } catch (e: AssertionError) {
                throw AssertionError("Failed to verify results text: ${e.message}")
            }
        }
    }

    private fun calculateTraitScore(scores: List<Int>): Int {
        val total = scores.sum()
        return ((total.toFloat() / 45) * 100).toInt()
    }
} 