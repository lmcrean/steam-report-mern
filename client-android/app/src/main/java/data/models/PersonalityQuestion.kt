package data.models

import com.squareup.moshi.JsonClass

/*
Purpose: Data model for personality assessment questions
Ported from: client/src/data/personalityQuestions.js

Web client relationships:
- Used in: client/src/components/personality/PersonalityQuiz.jsx
- Data source: data/personality_questions.json

Structure:
- Kotlin data class for Moshi JSON parsing
- Represents individual OCEAN personality questions
*/
@JsonClass(generateAdapter = true)
data class PersonalityQuestion(
    val trait: String,
    val statement: String
) 