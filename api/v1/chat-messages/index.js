// Chat messages API endpoint for Vercel
// Handles GET (retrieve messages) and POST (add message)

// In-memory storage (for serverless functions)
// Note: This resets on each cold start. For production, use a database or persistent storage
let messages = [];

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
            // Return all messages
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

            const newMessage = {
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                username: username,
                text: text.trim(),
                timestamp: new Date().toISOString()
            };

            messages.push(newMessage);

            // Keep only last 100 messages to prevent memory issues
            if (messages.length > 100) {
                messages = messages.slice(-100);
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
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}
