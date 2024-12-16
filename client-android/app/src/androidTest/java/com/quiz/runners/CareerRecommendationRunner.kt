/**
 * Ports from: client/tests/utils/quiz-runners/careerRecommendation.js
 */
object CareerRecommendationRunner {
    suspend fun verifyCareerRecommendations(
        composeRule: ComposeTestRule,
        testCase: QuizTestCases.TestCase,
        feedbackDatabase: Map<String, CareerFeedback>
    ) {
        with(composeRule) {
            try {
                // Extract subject and trait from top scores
                val (subject, trait) = testCase.topScores.split(" and ")
                val expectedKey = "$subject and $trait"

                // Get expected careers from database
                val expectedCareers = feedbackDatabase[expectedKey]?.recommendedCareers
                    ?: throw AssertionError("No career recommendations found for combination: $expectedKey")

                // Verify the top scores text appears correctly
                onNodeWithText(expectedKey)
                    .assertIsDisplayed()

                // Verify each career appears
                expectedCareers.forEach { career ->
                    onNodeWithText(career)
                        .assertIsDisplayed()
                }

                // Click the share results button
                onNodeWithText("Share Results to Network Board")
                    .assertIsDisplayed()
                    .performClick()

                // Wait for network board to appear
                onNodeWithTag("network_board")
                    .assertIsDisplayed()

                Log.d("CareerRecommendation", "✓ Verified career recommendations for $expectedKey")
                Log.d("CareerRecommendation", "✓ Successfully submitted results to network board")

            } catch (e: AssertionError) {
                throw AssertionError("Failed to verify career recommendations: ${e.message}")
            }
        }
    }

    /**
     * Data class representing career feedback from the database
     */
    data class CareerFeedback(
        val recommendedCareers: List<String>
    )
} 