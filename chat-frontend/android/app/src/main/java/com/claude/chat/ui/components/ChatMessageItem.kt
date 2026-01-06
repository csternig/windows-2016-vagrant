package com.claude.chat.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.claude.chat.model.Message
import com.claude.chat.model.MessageRole
import com.claude.chat.ui.theme.Purple80
import com.claude.chat.ui.theme.Green80
import java.text.SimpleDateFormat
import java.util.*

/**
 * Individual message item composable
 */
@Composable
fun ChatMessageItem(message: Message) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = if (message.role == MessageRole.USER) {
            Arrangement.End
        } else {
            Arrangement.Start
        }
    ) {
        if (message.role == MessageRole.ASSISTANT) {
            MessageAvatar(
                initial = "C",
                backgroundColor = Green80
            )
            Spacer(modifier = Modifier.width(8.dp))
        }

        Column(
            modifier = Modifier.widthIn(max = 280.dp)
        ) {
            Surface(
                color = if (message.role == MessageRole.USER) {
                    Purple80
                } else {
                    Color.White
                },
                shape = RoundedCornerShape(12.dp),
                shadowElevation = 2.dp
            ) {
                Column(
                    modifier = Modifier.padding(12.dp)
                ) {
                    Text(
                        text = message.content,
                        color = if (message.role == MessageRole.USER) {
                            Color.White
                        } else {
                            Color(0xFF374151)
                        },
                        style = MaterialTheme.typography.bodyMedium,
                        lineHeight = 20.sp
                    )

                    Spacer(modifier = Modifier.height(4.dp))

                    Text(
                        text = formatTimestamp(message.timestamp),
                        color = if (message.role == MessageRole.USER) {
                            Color.White.copy(alpha = 0.7f)
                        } else {
                            Color(0xFF9CA3AF)
                        },
                        style = MaterialTheme.typography.labelSmall
                    )
                }
            }
        }

        if (message.role == MessageRole.USER) {
            Spacer(modifier = Modifier.width(8.dp))
            MessageAvatar(
                initial = "S",
                backgroundColor = Purple80
            )
        }
    }
}

@Composable
fun MessageAvatar(
    initial: String,
    backgroundColor: Color
) {
    Box(
        modifier = Modifier
            .size(40.dp)
            .background(backgroundColor, CircleShape),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = initial,
            color = Color.White,
            fontWeight = FontWeight.Bold,
            fontSize = 16.sp
        )
    }
}

private fun formatTimestamp(timestamp: Long): String {
    val formatter = SimpleDateFormat("HH:mm", Locale.getDefault())
    return formatter.format(Date(timestamp))
}
