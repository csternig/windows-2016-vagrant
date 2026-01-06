package com.claude.chat.model

import com.google.gson.annotations.SerializedName
import java.util.UUID

/**
 * Represents a chat message
 */
data class Message(
    val id: String = UUID.randomUUID().toString(),
    val role: MessageRole,
    val content: String,
    val timestamp: Long = System.currentTimeMillis()
)

enum class MessageRole {
    @SerializedName("user")
    USER,

    @SerializedName("assistant")
    ASSISTANT
}
