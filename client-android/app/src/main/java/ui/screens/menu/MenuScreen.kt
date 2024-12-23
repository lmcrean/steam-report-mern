package ui.screens.menu

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import domain.constants.QuizConstants.Menu

@Composable
private fun MenuButton(
    text: String,
    description: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    isPrimary: Boolean = false
) {
    ElevatedButton(
        onClick = onClick,
        modifier = modifier.fillMaxWidth(),
        colors = ButtonDefaults.elevatedButtonColors(
            containerColor = if (isPrimary) MaterialTheme.colorScheme.primary 
                           else MaterialTheme.colorScheme.surface
        )
    ) {
        Column(
            horizontalAlignment = Alignment.Start,
            modifier = Modifier.padding(vertical = 8.dp)
        ) {
            Text(
                text = text,
                style = MaterialTheme.typography.titleMedium
            )
            Text(
                text = description,
                style = MaterialTheme.typography.bodyMedium
            )
        }
    }
}

/**
 * Ports from: src/components/menu/MenuScreen.jsx
 * Purpose: Entry point of the quiz, displays welcome message and start button
 */
@Composable
fun MenuScreen(
    onStartQuiz: () -> Unit = {},
    onAboutOcean: () -> Unit = {},
    onAboutSteam: () -> Unit = {},
    onHowToPlay: () -> Unit = {}
) {
    Surface(
        modifier = Modifier.fillMaxSize(),
        color = MaterialTheme.colorScheme.background
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = Menu.TITLE,
                style = MaterialTheme.typography.headlineMedium,
                textAlign = TextAlign.Center,
                modifier = Modifier.padding(bottom = 8.dp)
            )
            
            Text(
                text = Menu.SUBTITLE,
                style = MaterialTheme.typography.bodyLarge,
                textAlign = TextAlign.Center,
                modifier = Modifier.padding(bottom = 24.dp)
            )

            MenuButton(
                text = Menu.Buttons.START_QUIZ,
                description = Menu.Buttons.START_QUIZ_DESCRIPTION,
                onClick = onStartQuiz,
                modifier = Modifier.padding(vertical = 8.dp),
                isPrimary = true
            )

            MenuButton(
                text = Menu.Buttons.ABOUT_OCEAN,
                description = Menu.Buttons.ABOUT_OCEAN_DESCRIPTION,
                onClick = onAboutOcean,
                modifier = Modifier.padding(vertical = 8.dp)
            )

            MenuButton(
                text = Menu.Buttons.ABOUT_STEAM,
                description = Menu.Buttons.ABOUT_STEAM_DESCRIPTION,
                onClick = onAboutSteam,
                modifier = Modifier.padding(vertical = 8.dp)
            )

            MenuButton(
                text = Menu.Buttons.HOW_TO_PLAY,
                description = Menu.Buttons.HOW_TO_PLAY_DESCRIPTION,
                onClick = onHowToPlay,
                modifier = Modifier.padding(vertical = 8.dp)
            )
        }
    }
} 