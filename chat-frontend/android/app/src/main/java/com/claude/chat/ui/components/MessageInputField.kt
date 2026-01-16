package com.claude.chat.ui.components

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Send
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.claude.chat.ui.theme.Purple80

/**
 * Message input field with send button
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MessageInputField(
    onSendMessage: (String) -> Unit,
    enabled: Boolean = true
) {
    var messageText by remember { mutableStateOf("") }

    Surface(
        color = Color.White,
        shadowElevation = 8.dp
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.Bottom,
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                OutlinedTextField(
                    value = messageText,
                    onValueChange = { messageText = it },
                    modifier = Modifier.weight(1f),
                    placeholder = {
                        Text("Ihre Nachricht eingeben...")
                    },
                    enabled = enabled,
                    maxLines = 4,
                    shape = RoundedCornerShape(12.dp),
                    colors = TextFieldDefaults.outlinedTextFieldColors(
                        focusedBorderColor = Purple80,
                        unfocusedBorderColor = Color(0xFFE5E7EB)
                    )
                )

                FloatingActionButton(
                    onClick = {
                        if (messageText.isNotBlank()) {
                            onSendMessage(messageText)
                            messageText = ""
                        }
                    },
                    containerColor = Purple80,
                    contentColor = Color.White,
                    modifier = Modifier.size(56.dp),
                    enabled = enabled && messageText.isNotBlank()
                ) {
                    Icon(
                        imageVector = Icons.Default.Send,
                        contentDescription = "Senden"
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = "${messageText.length} / 4000",
                style = MaterialTheme.typography.labelSmall,
                color = if (messageText.length > 3800) {
                    Color(0xFFDC2626)
                } else {
                    Color(0xFF9CA3AF)
                }
            )
        }
    }
}
