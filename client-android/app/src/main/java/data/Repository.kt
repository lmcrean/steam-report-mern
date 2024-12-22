package data

import android.content.Context
import com.squareup.moshi.Moshi
import java.io.IOException

/*
Purpose: Base repository class providing common JSON loading functionality
Structure:
- Abstract base class for all repositories
- Provides shared Moshi instance for JSON parsing
- Common asset loading utilities

Key functionality:
- JSON file loading from assets
- Moshi instance management
*/
abstract class Repository(private val context: Context) {
    protected val moshi: Moshi = Moshi.Builder().build()

    protected fun loadJsonFromAssets(fileName: String): String {
        return try {
            context.assets.open(fileName)
                .bufferedReader()
                .use { it.readText() }
        } catch (e: IOException) {
            throw IOException("Error reading $fileName from assets", e)
        }
    }
} 