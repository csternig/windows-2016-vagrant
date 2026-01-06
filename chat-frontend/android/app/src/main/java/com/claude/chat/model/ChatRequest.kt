package com.claude.chat.model

import com.google.gson.annotations.SerializedName

/**
 * Request body for chat API
 */
data class ChatRequest(
    @SerializedName("message")
    val message: String,

    @SerializedName("conversationHistory")
    val conversationHistory: List<ConversationMessage>
)

data class ConversationMessage(
    @SerializedName("role")
    val role: String,

    @SerializedName("content")
    val content: String
)
