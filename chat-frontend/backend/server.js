const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Anthropic client
const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

// Serve static files from frontend
app.use(express.static('../frontend'));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message, conversationHistory = [] } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        if (!process.env.ANTHROPIC_API_KEY) {
            return res.status(500).json({
                error: 'ANTHROPIC_API_KEY not configured. Please set it in .env file'
            });
        }

        console.log(`[${new Date().toISOString()}] Received message: ${message.substring(0, 50)}...`);

        // Build messages array for Claude API
        const messages = [
            ...conversationHistory,
            { role: 'user', content: message }
        ];

        // Call Claude API
        const response = await anthropic.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 4096,
            messages: messages
        });

        const assistantMessage = response.content[0].text;

        console.log(`[${new Date().toISOString()}] Response sent successfully`);

        res.json({
            response: assistantMessage,
            model: response.model,
            usage: response.usage
        });

    } catch (error) {
        console.error('Error calling Claude API:', error);

        if (error.status === 401) {
            return res.status(401).json({
                error: 'Invalid API key. Please check your ANTHROPIC_API_KEY'
            });
        }

        if (error.status === 429) {
            return res.status(429).json({
                error: 'Rate limit exceeded. Please try again later.'
            });
        }

        res.status(500).json({
            error: 'Error processing your request',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════╗
║         Claude Chat Backend Server                ║
╚═══════════════════════════════════════════════════╝

🚀 Server running on: http://localhost:${PORT}
📡 API endpoint: http://localhost:${PORT}/api/chat
💻 Frontend: http://localhost:${PORT}

${process.env.ANTHROPIC_API_KEY ? '✅ API Key configured' : '❌ API Key not configured - Please set ANTHROPIC_API_KEY in .env'}

Press Ctrl+C to stop
    `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('\n\nShutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\n\nShutting down gracefully...');
    process.exit(0);
});
