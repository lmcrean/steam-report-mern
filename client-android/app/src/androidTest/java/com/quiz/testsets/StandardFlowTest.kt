/**
 * Ports from: client/tests/1-quiz-standard-flow.spec.js
 */
@RunWith(AndroidJUnit4::class)
class StandardFlowTest {

    @get:Rule
    val composeTestRule = createAndroidComposeRule<MainActivity>()

    @Test
    fun runStandardFlowTests() {
        QuizTestCases.StandardFlow::class.memberProperties
            .filter { it.isConst }
            .map { it.getter.call() as QuizTestCases.TestCase }
            .forEach { testCase ->
                // Log test case details
                Log.d("QuizTest", "\n=== Test Case Details ===")
                Log.d("QuizTest", "Description: ${testCase.description}")

                // Calculate expected results
                val personalityScores = testCase.personalityAnswers.map { (trait, scores) ->
                    val total = scores.sum() * 100 / 45
                    trait to total
                }

                // Find highest scoring personality traits
                val maxPersonalityScore = personalityScores.maxOf { it.second }
                val expectedPersonalityTies = personalityScores
                    .filter { it.second == maxPersonalityScore }
                    .map { it.first }

                // Calculate subject scores
                val subjectScores = testCase.subjectAnswers.map { (subject, scores) ->
                    val total = scores.count { it } * 100 / scores.size
                    subject to total
                }

                // Find highest scoring subjects
                val maxSubjectScore = subjectScores.maxOf { it.second }
                val expectedSubjectTies = subjectScores
                    .filter { it.second == maxSubjectScore }
                    .map { it.first }

                // Log expected results
                Log.d("QuizTest", "\n=== Expected Results ===")
                Log.d("QuizTest", "Personality Scores: ${
                    personalityScores.joinToString { 
                        "${it.first}: ${it.second}%" +
                        if (it.first in expectedPersonalityTies) " *" else ""
                    }
                }")
                Log.d("QuizTest", "Subject Scores: ${
                    subjectScores.joinToString { 
                        "${it.first}: ${it.second}%" +
                        if (it.first in expectedSubjectTies) " *" else ""
                    }
                }")

                // Run the test case
                QuizTestRunner.runQuizTestCase(
                    composeTestRule,
                    testCase
                )

                Log.d("QuizTest", "\n=== Test Complete ===")
            }
    }
} 