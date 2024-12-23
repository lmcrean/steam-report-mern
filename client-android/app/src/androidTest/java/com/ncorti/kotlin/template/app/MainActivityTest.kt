package com.ncorti.kotlin.template.app

import androidx.compose.ui.test.junit4.createAndroidComposeRule
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.assertIsDisplayed
import androidx.test.ext.junit.runners.AndroidJUnit4
import domain.constants.QuizConstants.Menu
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class MainActivityTest {
    @get:Rule
    val composeRule = createAndroidComposeRule<MainActivity>()

    @Test
    fun initialScreen_showsMenuScreen() {
        // Verify the menu screen title is displayed
        composeRule.onNodeWithText(Menu.TITLE)
            .assertIsDisplayed()
    }
}
