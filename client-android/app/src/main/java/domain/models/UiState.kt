/**
 * Ports from: src/context/QuizContext.jsx (state shape)
 * Purpose: Represents the overall UI state of the quiz application
 */
sealed class UiState {
    object Loading : UiState()
    object Error : UiState()
    data class Success(
        val currentSection: QuizSection,
        val username: String = "",
        val personalityAnswers: Map<String, Int> = emptyMap(),
        val subjectAnswers: Map<String, Int> = emptyMap(),
        val result: QuizResult? = null
    ) : UiState()
} 