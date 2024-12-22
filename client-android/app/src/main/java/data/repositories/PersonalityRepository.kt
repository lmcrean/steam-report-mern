package data.repositories

import android.content.Context
import data.Repository
import data.models.PersonalityQuestion

/*
Purpose: Repository for personality questions and trait descriptions
Ported from: 
- client/src/data/personalityQuestions.js
- client/src/data/traitDescriptions.js

Web client relationships:
- Used in: client/src/components/personality/PersonalityQuiz.jsx
- Data sources: 
  - data/personality_questions.json
  - data/trait_descriptions.json

Structure:
- Extends Repository base class
- Provides access to personality questions and trait descriptions
*/
class PersonalityRepository(context: Context) : Repository(context) {
    /*
    private val PERSONALITY_FILE = "data/personality_questions.json"
    private val TRAITS_FILE = "data/trait_descriptions.json"
    
    fun getPersonalityQuestions(): List<PersonalityQuestion> {
        // Load and parse personality_questions.json
        val json = loadJsonFromAssets(PERSONALITY_FILE)
        return moshi.parse<List<PersonalityQuestion>>(json)
    }
    
    fun getTraitDescriptions(): Map<String, String> {
        // Load and parse trait_descriptions.json
        val json = loadJsonFromAssets(TRAITS_FILE)
        return moshi.parse<Map<String, String>>(json)
    }
    */
} 