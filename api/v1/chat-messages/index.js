// Chat messages API endpoint for Vercel
// Handles GET (retrieve messages) and POST (add message)
// Messages are persisted to chat-messages.json file

const fs = require('fs');
const path = require('path');

// Path to messages file (relative to api directory)
const MESSAGES_FILE = path.join(process.cwd(), 'chat-messages.json');
const MESSAGES_LOG_FILE = path.join(process.cwd(), 'chat-messages.txt');

// Helper function to read messages from file
function readMessages() {
    try {
        if (fs.existsSync(MESSAGES_FILE)) {
            const fileContent = fs.readFileSync(MESSAGES_FILE, 'utf8');
            return JSON.parse(fileContent || '[]');
        }
        return [];
    } catch (error) {
        console.error('Error reading messages file:', error);
        return [];
    }
}

// Helper function to write messages to file
function writeMessages(messages) {
    try {
        // Keep only last 500 messages to prevent file from getting too large
        const messagesToSave = messages.slice(-500);
        
        // Write JSON file
        fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messagesToSave, null, 2), 'utf8');
        
        // Write human-readable .txt log file
        const logLines = messagesToSave.map(msg => {
            const date = new Date(msg.timestamp);
            const dateStr = date.toLocaleString();
            return `[${dateStr}] ${msg.username}: ${msg.text}`;
        });
        fs.writeFileSync(MESSAGES_LOG_FILE, logLines.join('\n') + '\n', 'utf8');
        
        return true;
    } catch (error) {
        console.error('Error writing messages file:', error);
        return false;
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

            // Write messages back to file
            const writeSuccess = writeMessages(messages);

            if (!writeSuccess) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to save message'
                });
                return;
            }

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
