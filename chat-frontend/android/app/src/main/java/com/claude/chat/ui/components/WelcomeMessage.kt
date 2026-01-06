package com.claude.chat.ui.components

import androidx.compose.foundation.layout.*
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

/**
 * Welcome message shown when there are no messages
 */
@Composable
fun WelcomeMessage() {
    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center,
            modifier = Modifier.padding(32.dp)
        ) {
            Text(
                text = "Willkommen beim\nClaude Chat!",
                fontSize = 28.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF374151),
                textAlign = TextAlign.Center,
                lineHeight = 36.sp
            )

            Spacer(modifier = Modifier.height(16.dp))

            Text(
                text = "Stellen Sie mir eine Frage oder\nbeginnen Sie eine Unterhaltung.",
                fontSize = 16.sp,
                color = Color(0xFF6B7280),
                textAlign = TextAlign.Center,
                lineHeight = 24.sp
            )
        }
    }
}
