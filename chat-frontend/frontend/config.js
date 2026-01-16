// Frontend Configuration
//
// API_URL: The URL for the backend API
// - Use relative URL '/api/chat' when frontend is served by the backend (default)
// - Use full URL 'http://YOUR_IP:3000/api/chat' when serving frontend separately
//
// The default configuration works for:
// - http://localhost:3000 (local access)
// - http://192.168.x.x:3000 (LAN access)
// - Any IP address where the backend is running

window.CLAUDE_CHAT_CONFIG = {
    // Relative URL - works from any host since backend serves the frontend
    apiUrl: '/api/chat',

    // Alternative: Use absolute URL if serving frontend separately
    // apiUrl: 'http://192.168.1.100:3000/api/chat',

    // Maximum message length
    maxMessageLength: 4000,

    // Enable debug logging
    debug: false
};
