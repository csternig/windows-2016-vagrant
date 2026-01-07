const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');
const os = require('os');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Function to get local IP address
function getLocalIPAddress() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            // Skip internal (loopback) and non-IPv4 addresses
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

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
            model: 'claude-sonnet-4-5-20250929',
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

// Start server on all network interfaces (0.0.0.0)
app.listen(PORT, '0.0.0.0', () => {
    const localIP = getLocalIPAddress();

    console.log(`
╔═══════════════════════════════════════════════════╗
║         Claude Chat Backend Server                ║
╚═══════════════════════════════════════════════════╝

🚀 Server running on all network interfaces

📍 Local access:
   http://localhost:${PORT}

🌐 LAN access (from other devices):
   http://${localIP}:${PORT}

📡 API endpoint:
   http://${localIP}:${PORT}/api/chat

💻 Frontend:
   http://${localIP}:${PORT}

${process.env.ANTHROPIC_API_KEY ? '✅ API Key configured' : '❌ API Key not configured - Please set ANTHROPIC_API_KEY in .env'}

💡 Tipp: Teilen Sie die LAN-Adresse mit anderen Geräten im Netzwerk
⚠️  Stellen Sie sicher, dass Ihre Firewall den Zugriff erlaubt

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
