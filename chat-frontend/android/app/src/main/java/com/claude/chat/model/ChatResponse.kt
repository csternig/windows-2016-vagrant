package com.claude.chat.model

import com.google.gson.annotations.SerializedName

/**
 * Response from chat API
 */
data class ChatResponse(
    @SerializedName("response")
    val response: String,

    @SerializedName("model")
    val model: String? = null,

    @SerializedName("usage")
    val usage: Usage? = null
)

data class Usage(
    @SerializedName("input_tokens")
    val inputTokens: Int,

    @SerializedName("output_tokens")
    val outputTokens: Int
)
