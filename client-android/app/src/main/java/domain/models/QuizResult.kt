/**
 * Ports from: src/context/usePrepareResult.js (result shape)
 * Purpose: Represents the final quiz result structure
 */
data class QuizResult(
    val username: String,
    val personalityTraits: Map<String, Int>,
    val subjectScores: Map<String, Int>,
    val dominantTrait: String,
    val strongestSubject: String,
    val timestamp: Long = System.currentTimeMillis()
) 