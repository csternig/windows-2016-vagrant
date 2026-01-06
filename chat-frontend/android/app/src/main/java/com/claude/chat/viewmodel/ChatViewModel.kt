package com.claude.chat.viewmodel

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.claude.chat.model.Message
import com.claude.chat.model.MessageRole
import com.claude.chat.repository.ChatRepository
import kotlinx.coroutines.launch

/**
 * ViewModel for managing chat state and operations
 */
class ChatViewModel : ViewModel() {

    private val repository = ChatRepository()

    var uiState by mutableStateOf(ChatUiState())
        private set

    init {
        // Load conversation history from persistent storage
        // For now, we start fresh
    }

    fun sendMessage(messageText: String) {
        if (messageText.isBlank() || uiState.isLoading) return

        val userMessage = Message(
            role = MessageRole.USER,
            content = messageText.trim()
        )

        // Add user message to the list
        uiState = uiState.copy(
            messages = uiState.messages + userMessage,
            isLoading = true,
            errorMessage = null
        )

        // Send to API
        viewModelScope.launch {
            try {
                val result = repository.sendMessage(
                    message = messageText.trim(),
                    conversationHistory = uiState.messages.dropLast(1) // Exclude the just-added user message
                )

                result.fold(
                    onSuccess = { response ->
                        val assistantMessage = Message(
                            role = MessageRole.ASSISTANT,
                            content = response.response
                        )

                        uiState = uiState.copy(
                            messages = uiState.messages + assistantMessage,
                            isLoading = false
                        )
                    },
                    onFailure = { error ->
                        uiState = uiState.copy(
                            isLoading = false,
                            errorMessage = error.message ?: "Ein Fehler ist aufgetreten"
                        )
                    }
                )
            } catch (e: Exception) {
                uiState = uiState.copy(
                    isLoading = false,
                    errorMessage = e.message ?: "Ein Fehler ist aufgetreten"
                )
            }
        }
    }

    fun clearError() {
        uiState = uiState.copy(errorMessage = null)
    }

    fun clearConversation() {
        uiState = ChatUiState()
    }
}

/**
 * UI State for the chat screen
 */
data class ChatUiState(
    val messages: List<Message> = emptyList(),
    val isLoading: Boolean = false,
    val errorMessage: String? = null
)
