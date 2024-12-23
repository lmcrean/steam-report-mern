package ui.screens.menu

import androidx.compose.ui.test.junit4.createComposeRule
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.assertIsDisplayed
import androidx.test.ext.junit.runners.AndroidJUnit4
import domain.constants.QuizConstants.Menu
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class MenuScreenTest {
    @get:Rule
    val composeRule = createComposeRule()

    @Test
    fun menuScreen_displaysAllElements() {
        // Start the MenuScreen
        composeRule.setContent {
            MenuScreen()
        }

        // Verify the title and subtitle are displayed
        composeRule.onNodeWithText(Menu.TITLE)
            .assertIsDisplayed()
        composeRule.onNodeWithText(Menu.SUBTITLE)
            .assertIsDisplayed()

        // Verify all buttons are displayed
        composeRule.onNodeWithText(Menu.Buttons.START_QUIZ)
            .assertIsDisplayed()
        composeRule.onNodeWithText(Menu.Buttons.ABOUT_OCEAN)
            .assertIsDisplayed()
        composeRule.onNodeWithText(Menu.Buttons.ABOUT_STEAM)
            .assertIsDisplayed()
        composeRule.onNodeWithText(Menu.Buttons.HOW_TO_PLAY)
            .assertIsDisplayed()
    }
} 