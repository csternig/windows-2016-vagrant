// Configuration
// Use relative URL to work from both localhost and LAN access
const API_URL = '/api/chat';

// DOM Elements
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const charCount = document.getElementById('charCount');
const statusIndicator = document.getElementById('status');

// Conversation history
let conversationHistory = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    loadConversationHistory();
    messageInput.focus();
});

function setupEventListeners() {
    // Send message on button click
    sendButton.addEventListener('click', sendMessage);

    // Send message on Enter key (without Shift)
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Auto-resize textarea
    messageInput.addEventListener('input', () => {
        updateCharCount();
        autoResizeTextarea();
    });
}

function updateCharCount() {
    const count = messageInput.value.length;
    charCount.textContent = `${count} / 4000`;

    if (count > 3800) {
        charCount.style.color = '#dc2626';
    } else {
        charCount.style.color = '#9ca3af';
    }
}

function autoResizeTextarea() {
    messageInput.style.height = 'auto';
    messageInput.style.height = messageInput.scrollHeight + 'px';
}

async function sendMessage() {
    const message = messageInput.value.trim();

    if (!message) return;

    // Clear input
    messageInput.value = '';
    messageInput.style.height = 'auto';
    updateCharCount();

    // Remove welcome message if present
    const welcomeMessage = document.querySelector('.welcome-message');
    if (welcomeMessage) {
        welcomeMessage.remove();
    }

    // Add user message to UI
    addMessage('user', message);

    // Disable input while processing
    setInputState(false);
    setStatus('Verarbeite...');

    // Show typing indicator
    const typingIndicator = showTypingIndicator();

    try {
        // Send to API
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                conversationHistory: conversationHistory
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Remove typing indicator
        typingIndicator.remove();

        // Add assistant response to UI
        addMessage('assistant', data.response);

        // Update conversation history
        conversationHistory.push(
            { role: 'user', content: message },
            { role: 'assistant', content: data.response }
        );

        saveConversationHistory();
        setStatus('Bereit');

    } catch (error) {
        console.error('Error:', error);
        typingIndicator.remove();
        showError('Fehler beim Senden der Nachricht. Bitte stellen Sie sicher, dass der Backend-Server läuft.');
        setStatus('Fehler');
    } finally {
        setInputState(true);
        messageInput.focus();
    }
}

function addMessage(role, content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = role === 'user' ? 'S' : 'C';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';

    const textP = document.createElement('p');
    textP.textContent = content;

    const timeSpan = document.createElement('div');
    timeSpan.className = 'message-time';
    timeSpan.textContent = new Date().toLocaleTimeString('de-DE', {
        hour: '2-digit',
        minute: '2-digit'
    });

    contentDiv.appendChild(textP);
    contentDiv.appendChild(timeSpan);
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(contentDiv);

    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

function showTypingIndicator() {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message assistant';
    messageDiv.id = 'typing-indicator';

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = 'C';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';

    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.innerHTML = '<span></span><span></span><span></span>';

    contentDiv.appendChild(typingDiv);
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(contentDiv);

    chatMessages.appendChild(messageDiv);
    scrollToBottom();

    return messageDiv;
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;

    chatMessages.appendChild(errorDiv);
    scrollToBottom();

    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

function setInputState(enabled) {
    messageInput.disabled = !enabled;
    sendButton.disabled = !enabled;
}

function setStatus(text) {
    statusIndicator.textContent = text;
    if (text === 'Bereit') {
        statusIndicator.classList.remove('active');
    } else {
        statusIndicator.classList.add('active');
    }
}

function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function saveConversationHistory() {
    try {
        localStorage.setItem('conversationHistory', JSON.stringify(conversationHistory));
    } catch (e) {
        console.error('Error saving conversation history:', e);
    }
}

function loadConversationHistory() {
    try {
        const saved = localStorage.getItem('conversationHistory');
        if (saved) {
            conversationHistory = JSON.parse(saved);

            // Restore messages in UI
            conversationHistory.forEach(msg => {
                if (msg.role === 'user' || msg.role === 'assistant') {
                    addMessage(msg.role, msg.content);
                }
            });

            // Remove welcome message if there's history
            if (conversationHistory.length > 0) {
                const welcomeMessage = document.querySelector('.welcome-message');
                if (welcomeMessage) {
                    welcomeMessage.remove();
                }
            }
        }
    } catch (e) {
        console.error('Error loading conversation history:', e);
    }
}

// Clear conversation (optional feature)
function clearConversation() {
    if (confirm('Möchten Sie die Konversation wirklich löschen?')) {
        conversationHistory = [];
        localStorage.removeItem('conversationHistory');
        chatMessages.innerHTML = `
            <div class="welcome-message">
                <h2>Willkommen beim Claude Chat!</h2>
                <p>Stellen Sie mir eine Frage oder beginnen Sie eine Unterhaltung.</p>
            </div>
        `;
    }
}
