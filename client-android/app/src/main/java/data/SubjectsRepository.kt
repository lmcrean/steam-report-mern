class SubjectsRepository {
    private val gson = Gson()

    fun loadSubjects(context: Context): Map<String, Subject> {
        val json = context.assets.open("subjects.json").bufferedReader().use { it.readText() }
        return gson.fromJson(json, object : TypeToken<Map<String, Subject>>() {}.type)
    }
}

data class Subject(
    val description: String,
    val icon: String,
    val categoryId: Int,
    val questions: List<Question>
)

data class Question(
    val question: String,
    val correct_answer: String,
    val incorrect_answers: List<String>
) 