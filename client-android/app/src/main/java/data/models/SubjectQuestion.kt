package data.models

import com.squareup.moshi.JsonClass

/*
Purpose: Data model that matches the structure in subject_questions.json
Ported from: client/src/data/subjectQuestions.js

Web client relationships:
- Used in: client/src/components/subject/SubjectQuiz.jsx
- Tested in: client/tests/testCases/quizInputs.js

Key differences from web version:
- Kotlin data class instead of JS object
- Structured for Moshi JSON parsing
- Maintains same data structure for compatibility
*/

@JsonClass(generateAdapter = true)
data class Subject(
    val description: String,  // e.g. "Tests your understanding of scientific principles..."
    val icon: String,         // e.g. "🔬" for Science
    val categoryId: Int,      // e.g. 17 for Science category
    val questions: List<Question>
) {
    @JsonClass(generateAdapter = true)
    data class Question(
        val question: String,          // The actual question text
        val correct_answer: String,    // The correct answer
        val incorrect_answers: List<String>  // List of wrong answers
    )
} 