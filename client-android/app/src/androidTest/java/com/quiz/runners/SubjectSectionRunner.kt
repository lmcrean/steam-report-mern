/**
 * Ports from: client/tests/utils/quiz-runners/subjectSection.js
 */
object SubjectSectionRunner {
    suspend fun completeSubjectSection(
        composeRule: ComposeTestRule,
        answers: Map<QuizTestCases.Subject, List<Boolean>>,
        subjectsData: Map<QuizTestCases.Subject, SubjectData>
    ) {
        with(composeRule) {
            try {
                for ((subject, subjectAnswers) in answers) {
                    for ((index, shouldBeCorrect) in subjectAnswers.withIndex()) {
                        // Wait for question to load
                        onNodeWithTag("question_container")
                            .assertIsDisplayed()

                        // Get question text
                        val questionText = onNodeWithTag("question_text")
                            .fetchSemanticsNode().text

                        // Find matching question data
                        val questionData = findMatchingQuestion(
                            questionText,
                            subjectsData[subject]?.questions ?: emptyList()
                        )

                        if (questionData == null) {
                            logQuestionMatchingError(questionText, subject, subjectsData[subject]?.questions ?: emptyList())
                            throw AssertionError("Could not find question data for: $questionText")
                        }

                        // Select appropriate answer
                        selectAnswer(this, questionData, shouldBeCorrect)

                        // Navigate to next question
                        onNodeWithText("Next")
                            .assertIsDisplayed()
                            .performClick()
                    }
                }
            } catch (e: AssertionError) {
                throw AssertionError("Failed to complete subject section: ${e.message}")
            }
        }
    }

    private fun findMatchingQuestion(
        questionText: String,
        questions: List<Question>
    ): Question? {
        val normalizedSearchText = normalizeText(questionText)
        
        return questions.find { question ->
            val normalizedQuestion = normalizeText(question.text)
            normalizedQuestion == normalizedSearchText ||
                normalizedQuestion.contains(normalizedSearchText) ||
                normalizedSearchText.contains(normalizedQuestion)
        }
    }

    private fun normalizeText(text: String): String {
        return text
            .lowercase()
            .trim()
            .replace(Regex("\\s+"), " ")
            .replace(Regex("[\"'.,?]"), "")
    }

    private suspend fun selectAnswer(
        composeRule: ComposeTestRule,
        questionData: Question,
        shouldBeCorrect: Boolean
    ) {
        with(composeRule) {
            // Get all answer options
            val answerNodes = onAllNodesWithTag("answer_option")
                .fetchSemanticsNodes()
                .map { it.text }

            // Find the correct answer node
            val targetAnswer = if (shouldBeCorrect) {
                answerNodes.find { normalizeText(it) == normalizeText(questionData.correctAnswer) }
                    ?: throw AssertionError("Could not find correct answer: ${questionData.correctAnswer}")
            } else {
                answerNodes.find { normalizeText(it) != normalizeText(questionData.correctAnswer) }
                    ?: throw AssertionError("Could not find incorrect answer option")
            }

            // Click the answer
            onNodeWithText(targetAnswer)
                .assertIsDisplayed()
                .performClick()
        }
    }

    private fun logQuestionMatchingError(
        questionText: String,
        subject: QuizTestCases.Subject,
        availableQuestions: List<Question>
    ) {
        Log.e("SubjectSection", """
            ❌ Question Matching Error
            --------------------
            Subject: $subject
            Looking for: "${questionText.trim()}"
            
            Available questions:
            ${availableQuestions.mapIndexed { index, q -> "${index + 1}. \"${q.text}\"" }.joinToString("\n")}
            
            Normalized search:
            Search text: "${normalizeText(questionText)}"
            Normalized available questions:
            ${availableQuestions.mapIndexed { index, q -> "${index + 1}. \"${normalizeText(q.text)}\"" }.joinToString("\n")}
        """.trimIndent())
    }

    // Data classes for subject section
    data class SubjectData(
        val questions: List<Question>
    )

    data class Question(
        val text: String,
        val correctAnswer: String
    )
} 