// Chat messages API endpoint for Vercel
// Handles GET (retrieve messages) and POST (add message)
// Messages are persisted to chat-messages.json file

const fs = require('fs');
const path = require('path');
const os = require('os');

// Use /tmp for serverless functions (writable directory)
// Also try to read from project directory if it exists
const MESSAGES_FILE_TMP = path.join(os.tmpdir(), 'chat-messages.json');
const MESSAGES_LOG_FILE_TMP = path.join(os.tmpdir(), 'chat-messages.txt');
const MESSAGES_FILE_PROJECT = path.join(process.cwd(), 'chat-messages.json');
const MESSAGES_LOG_FILE_PROJECT = path.join(process.cwd(), 'chat-messages.txt');

// In-memory fallback storage
let memoryMessages = [];

// Helper function to read messages from file
function readMessages() {
    try {
        // Try reading from /tmp first (most recent)
        if (fs.existsSync(MESSAGES_FILE_TMP)) {
            const fileContent = fs.readFileSync(MESSAGES_FILE_TMP, 'utf8');
            const messages = JSON.parse(fileContent || '[]');
            if (messages.length > 0) {
                memoryMessages = messages;
                return messages;
            }
        }
        // Try reading from project directory
        if (fs.existsSync(MESSAGES_FILE_PROJECT)) {
            const fileContent = fs.readFileSync(MESSAGES_FILE_PROJECT, 'utf8');
            const messages = JSON.parse(fileContent || '[]');
            if (messages.length > 0) {
                memoryMessages = messages;
                return messages;
            }
        }
        // Fall back to memory
        if (memoryMessages.length > 0) {
            return memoryMessages;
        }
        return [];
    } catch (error) {
        console.error('Error reading messages file:', error);
        // Fall back to memory
        return memoryMessages.length > 0 ? memoryMessages : [];
    }
}

// Helper function to write messages to file
function writeMessages(messages) {
    try {
        // Keep only last 500 messages to prevent file from getting too large
        const messagesToSave = messages.slice(-500);
        
        // Update memory storage
        memoryMessages = messagesToSave;
        
        // Try to write to /tmp (writable in serverless)
        try {
            fs.writeFileSync(MESSAGES_FILE_TMP, JSON.stringify(messagesToSave, null, 2), 'utf8');
            
            // Write human-readable .txt log file
            const logLines = messagesToSave.map(msg => {
                const date = new Date(msg.timestamp);
                const dateStr = date.toLocaleString();
                return `[${dateStr}] ${msg.username}: ${msg.text}`;
            });
            fs.writeFileSync(MESSAGES_LOG_FILE_TMP, logLines.join('\n') + '\n', 'utf8');
        } catch (tmpError) {
            console.error('Error writing to /tmp:', tmpError);
            // Continue - memory storage will work
        }
        
        // Try to write to project directory (may fail in serverless, but try anyway)
        try {
            fs.writeFileSync(MESSAGES_FILE_PROJECT, JSON.stringify(messagesToSave, null, 2), 'utf8');
            const logLines = messagesToSave.map(msg => {
                const date = new Date(msg.timestamp);
                const dateStr = date.toLocaleString();
                return `[${dateStr}] ${msg.username}: ${msg.text}`;
            });
            fs.writeFileSync(MESSAGES_LOG_FILE_PROJECT, logLines.join('\n') + '\n', 'utf8');
        } catch (projectError) {
            // This is expected in serverless - ignore
            console.log('Note: Cannot write to project directory (expected in serverless)');
        }
        
        return true;
    } catch (error) {
        console.error('Error writing messages file:', error);
        // Still return true if memory was updated
        return memoryMessages.length > 0;
    }
}

export default function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        if (req.method === 'GET') {
            // Read messages from file
            const messages = readMessages();
            res.status(200).json({
                success: true,
                messages: messages
            });
        } else if (req.method === 'POST') {
            // Add a new message
            const { username, text } = req.body;

            if (!username || !text) {
                res.status(400).json({
                    success: false,
                    error: 'Username and text are required'
                });
                return;
            }

            // Read existing messages
            const messages = readMessages();

            const newMessage = {
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                username: username,
                text: text.trim(),
                timestamp: new Date().toISOString()
            };

            messages.push(newMessage);

            // Write messages back to file (always succeeds with memory storage)
            writeMessages(messages);

            // Always return success - memory storage ensures the message is saved
            res.status(200).json({
                success: true,
                message: newMessage
            });
        } else {
            res.status(405).json({
                success: false,
                error: 'Method not allowed'
            });
        }
    } catch (error) {
        console.error('Error in handler:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}
