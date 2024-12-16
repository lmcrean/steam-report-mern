/**
 * Ports from: client/tests/testCases/quizInputs.js
 */
object QuizTestCases {
    // Data classes to represent test case structure
    data class TestCase(
        val description: String,
        val personalityAnswers: Map<PersonalityTrait, List<Int>>,
        val subjectAnswers: Map<Subject, List<Boolean>>,
        val preferredTrait: PersonalityTrait? = null,
        val preferredSubject: Subject? = null,
        val topScores: String
    )

    enum class PersonalityTrait {
        OPENNESS,
        CONSCIENTIOUSNESS,
        EXTRAVERSION,
        AGREEABLENESS,
        NEUROTICISM
    }

    enum class Subject {
        SCIENCE,
        TECHNOLOGY,
        ENGLISH,
        ART,
        MATH
    }

    // Test Sets matching web client structure
    object StandardFlow {
        val case1_clearWinners = TestCase(
            description = "Case 1: Clear single winners: Extraversion and Math",
            personalityAnswers = mapOf(
                PersonalityTrait.OPENNESS to listOf(5, 5, 5, 5, 5),  // 55%
                PersonalityTrait.CONSCIENTIOUSNESS to listOf(6, 6, 6, 6, 6),  // 67%
                PersonalityTrait.EXTRAVERSION to listOf(8, 8, 8, 8, 8),  // 89%
                PersonalityTrait.AGREEABLENESS to listOf(4, 4, 4, 4, 4),  // 44%
                PersonalityTrait.NEUROTICISM to listOf(3, 3, 3, 3, 3)  // 33%
            ),
            subjectAnswers = mapOf(
                Subject.SCIENCE to List(10) { it < 5 },  // 50%
                Subject.TECHNOLOGY to List(10) { it < 4 },  // 40%
                Subject.ENGLISH to List(10) { it < 3 },  // 30%
                Subject.ART to List(10) { it < 2 },  // 20%
                Subject.MATH to List(10) { it < 8 }  // 80%
            ),
            topScores = "Math and Extraversion"
        )

        val case2_barelyNoTies = TestCase(
            description = "Case 2: Winners by 6% margin: Science and Openness",
            personalityAnswers = mapOf(
                PersonalityTrait.OPENNESS to listOf(7, 7, 7, 6, 7),  // 75%
                PersonalityTrait.CONSCIENTIOUSNESS to listOf(6, 6, 6, 6, 6),  // 67%
                PersonalityTrait.EXTRAVERSION to listOf(6, 6, 6, 6, 5),  // 69%
                PersonalityTrait.AGREEABLENESS to listOf(5, 5, 5, 5, 5),  // 55%
                PersonalityTrait.NEUROTICISM to listOf(4, 4, 4, 4, 4)  // 44%
            ),
            subjectAnswers = mapOf(
                Subject.SCIENCE to List(10) { it < 6 },  // 65%
                Subject.TECHNOLOGY to List(10) { it < 4 },  // 40%
                Subject.ENGLISH to List(10) { it < 3 },  // 30%
                Subject.ART to List(10) { it < 2 },  // 20%
                Subject.MATH to List(10) { it < 5 }  // 50%
            ),
            topScores = "Science and Openness"
        )

        val case3_extremeWinners = TestCase(
            description = "Case 3: Extreme differences: Conscientiousness and Technology",
            personalityAnswers = mapOf(
                PersonalityTrait.OPENNESS to listOf(4, 4, 9, 4, 4),  // 56%
                PersonalityTrait.CONSCIENTIOUSNESS to listOf(9, 9, 9, 9, 9),  // 100%
                PersonalityTrait.EXTRAVERSION to listOf(3, 3, 3, 3, 3),  // 33%
                PersonalityTrait.AGREEABLENESS to listOf(2, 2, 2, 2, 2),  // 22%
                PersonalityTrait.NEUROTICISM to listOf(1, 1, 1, 1, 1)  // 11%
            ),
            subjectAnswers = mapOf(
                Subject.SCIENCE to List(10) { it < 3 },  // 30%
                Subject.TECHNOLOGY to List(10) { it < 9 },  // 90%
                Subject.ENGLISH to List(10) { it < 2 },  // 20%
                Subject.ART to List(10) { it < 1 },  // 10%
                Subject.MATH to List(10) { it < 5 }  // 50%
            ),
            topScores = "Technology and Conscientiousness"
        )
    }

    object PersonalityTieOnly {
        val case1_twoWayTie = TestCase(
            description = "Case 1: Two-way personality tie Openness & Extraversion, Math clear winner",
            personalityAnswers = mapOf(
                PersonalityTrait.OPENNESS to listOf(8, 8, 8, 8, 8),  // 88%
                PersonalityTrait.CONSCIENTIOUSNESS to listOf(6, 6, 6, 6, 6),  // 67%
                PersonalityTrait.EXTRAVERSION to listOf(8, 8, 8, 8, 8),  // 88%
                PersonalityTrait.AGREEABLENESS to listOf(4, 4, 4, 4, 4),  // 44%
                PersonalityTrait.NEUROTICISM to listOf(3, 3, 3, 3, 3)  // 33%
            ),
            subjectAnswers = mapOf(
                Subject.SCIENCE to List(10) { it < 5 },  // 50%
                Subject.TECHNOLOGY to List(10) { it < 4 },  // 40%
                Subject.ENGLISH to List(10) { it < 3 },  // 30%
                Subject.ART to List(10) { it < 2 },  // 20%
                Subject.MATH to List(10) { it < 8 }  // 80%
            ),
            preferredTrait = PersonalityTrait.EXTRAVERSION,
            topScores = "Math and Extraversion"
        )

    // This section is a placeholder for future test cases and will be completed later.
    // We will revisit this to port over all test scenarios as needed.
    }
} 