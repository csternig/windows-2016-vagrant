package com.claude.chat.repository

import com.claude.chat.model.ChatRequest
import com.claude.chat.model.ChatResponse
import com.claude.chat.model.ConversationMessage
import com.claude.chat.model.Message
import com.claude.chat.network.RetrofitInstance
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

/**
 * Repository for chat operations
 */
class ChatRepository {

    private val apiService = RetrofitInstance.apiService

    suspend fun sendMessage(
        message: String,
        conversationHistory: List<Message>
    ): Result<ChatResponse> = withContext(Dispatchers.IO) {
        try {
            val historyMessages = conversationHistory.map {
                ConversationMessage(
                    role = it.role.name.lowercase(),
                    content = it.content
                )
            }

            val request = ChatRequest(
                message = message,
                conversationHistory = historyMessages
            )

            val response = apiService.sendMessage(request)

            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(
                    Exception("API Error: ${response.code()} - ${response.message()}")
                )
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun checkHealth(): Result<Boolean> = withContext(Dispatchers.IO) {
        try {
            val response = apiService.checkHealth()
            if (response.isSuccessful) {
                Result.success(true)
            } else {
                Result.failure(Exception("Health check failed"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
