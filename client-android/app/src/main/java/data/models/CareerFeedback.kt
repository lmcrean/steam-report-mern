package data.models

import com.squareup.moshi.JsonClass

/*
Purpose: Data model for career feedback and recommendations
Ported from: client/src/data/feedbackDatabase.js

Web client relationships:
- Used in: client/src/components/results/CareerFeedback.jsx
- Data source: data/feedback_database.json

Structure:
- Kotlin data class for Moshi JSON parsing
- Matches feedback_database.json structure
*/
@JsonClass(generateAdapter = true)
data class CareerFeedback(
    val highest_STEAM: String,
    val highest_OCEAN: String,
    val environment: String,
    val thrive: String,
    val feedback: String,
    val recommendedCareers: List<String>
) 