package data.repositories

import android.content.Context
import data.Repository
import data.models.Subject

/*
Purpose: Repository for subject quiz questions
Ported from: client/src/services/SubjectsService.js

Web client relationships:
- Used in: client/src/components/subject/SubjectQuiz.jsx
- Data source: data/subject_questions.json

Structure:
- Extends Repository base class
- Provides access to subject questions with randomization
*/
class SubjectsRepository(context: Context) : Repository(context) {
    /*
    private val SUBJECTS_FILE = "data/subject_questions.json"
    
    fun getSubjects(): Map<String, Subject> {
        // Load and parse subject_questions.json
        val json = loadJsonFromAssets(SUBJECTS_FILE)
        return moshi.parse<Map<String, Subject>>(json)
    }
    
    fun getRandomQuestions(subject: String, count: Int = 10): List<Subject.Question> {
        // Get questions for subject
        val subjectData = getSubjects()[subject] 
            ?: throw IllegalArgumentException("Subject not found")
            
        // Shuffle and return requested number of questions
        return subjectData.questions.shuffled().take(count)
    }
    */
} 