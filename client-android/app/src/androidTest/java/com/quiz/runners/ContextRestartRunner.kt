/**
 * Ports from: client/tests/utils/quiz-runners/checkContextRestarted.js
 */
object ContextRestartRunner {
    suspend fun verifyContextRestarted(
        composeRule: ComposeTestRule,
        quizContext: QuizContext
    ) {
        try {
            // Fields to verify (excluding implementation-specific fields)
            val fieldsToCheck = listOf(
                ContextField("section", "menu", quizContext.section),
                ContextField("username", "", quizContext.username),
                ContextField("traitPercentages", null, quizContext.traitPercentages),
                ContextField("needsPersonalityTieBreaker", false, quizContext.needsPersonalityTieBreaker),
                ContextField("personalityTies", emptyList<String>(), quizContext.personalityTies),
                ContextField("preferredTrait", null, quizContext.preferredTrait),
                ContextField("subjectPercentages", null, quizContext.subjectPercentages),
                ContextField("needsSubjectTieBreaker", false, quizContext.needsSubjectTieBreaker),
                ContextField("subjectTies", emptyList<String>(), quizContext.subjectTies),
                ContextField("preferredSubject", null, quizContext.preferredSubject),
                ContextField("preferredSubjectScore", 0, quizContext.preferredSubjectScore),
                ContextField("preferredTraitScore", 0, quizContext.preferredTraitScore),
                ContextField("preferredEnvironment", "", quizContext.preferredEnvironment)
            )

            // Check each field matches initial state
            val mismatches = fieldsToCheck.filter { field ->
                field.expected.toString() != field.actual.toString()
            }

            // Log verification results
            Log.d("ContextRestart", """
                🔄 Context Reset Verification:
                   • Fields Checked: ${fieldsToCheck.size}
                   • Mismatches: ${mismatches.size}
                   • Status: ${if (mismatches.isEmpty()) "✅ Success" else "❌ Failed"}
            """.trimIndent())

            // Log any mismatches for debugging
            if (mismatches.isNotEmpty()) {
                val mismatchLog = mismatches.joinToString("\n") { field ->
                    """   • ${field.name}:
                       Expected: ${field.expected}
                       Actual: ${field.actual}""".trimIndent()
                }
                Log.e("ContextRestart", "Mismatched Fields:\n$mismatchLog")
                throw AssertionError("Quiz context was not properly reset")
            }

        } catch (e: Exception) {
            throw AssertionError("Failed to verify context restart: ${e.message}")
        }
    }

    /**
     * Data class to hold field verification information
     */
    private data class ContextField(
        val name: String,
        val expected: Any?,
        val actual: Any?
    )

    /**
     * Data class representing the quiz context state
     */
    data class QuizContext(
        val section: String,
        val username: String,
        val traitPercentages: Map<String, Int>?,
        val needsPersonalityTieBreaker: Boolean,
        val personalityTies: List<String>,
        val preferredTrait: String?,
        val subjectPercentages: Map<String, Int>?,
        val needsSubjectTieBreaker: Boolean,
        val subjectTies: List<String>,
        val preferredSubject: String?,
        val preferredSubjectScore: Int,
        val preferredTraitScore: Int,
        val preferredEnvironment: String
    )
} 