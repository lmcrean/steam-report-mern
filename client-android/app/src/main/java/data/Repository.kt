class Repository(private val context: Context) {
    private val gson = Gson()

    fun loadSubjects(): Map<String, Subject> {
        val json = context.assets.open("subjects.json").bufferedReader().use { it.readText() }
        return gson.fromJson(json, object : TypeToken<Map<String, Subject>>() {}.type)
    }

    fun loadFeedback(): Map<String, FeedbackData> {
        val json = context.assets.open("feedback.json").bufferedReader().use { it.readText() }
        return gson.fromJson(json, object : TypeToken<Map<String, FeedbackData>>() {}.type)
    }

    fun loadPersonality(): PersonalityData {
        val json = context.assets.open("personality.json").bufferedReader().use { it.readText() }
        return gson.fromJson(json, PersonalityData::class.java)
    }
}

// Data classes to match JSON structure
data class PersonalityData(
    val questions: List<PersonalityQuestion>,
    val traitDescriptions: Map<String, String>
)

data class PersonalityQuestion(
    val trait: String,
    val statement: String
)

data class FeedbackData(
    val highest_STEAM: String,
    val highest_OCEAN: String,
    val environment: String,
    val thrive: String,
    val feedback: String,
    val recommendedCareers: List<String>
) 