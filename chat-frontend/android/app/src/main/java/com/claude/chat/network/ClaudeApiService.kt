package com.claude.chat.network

import com.claude.chat.model.ChatRequest
import com.claude.chat.model.ChatResponse
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST

/**
 * Retrofit API interface for Claude Chat backend
 */
interface ClaudeApiService {

    @POST("chat")
    suspend fun sendMessage(@Body request: ChatRequest): Response<ChatResponse>

    @GET("health")
    suspend fun checkHealth(): Response<Map<String, String>>
}
