require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config');
const apiRoutes = require('./routes/api');
const chatbotRoutes = require('./routes/chatbot');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api', apiRoutes);
app.use('/api', chatbotRoutes);

// Root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({
        success: false,
        error: error.message || 'Internal server error'
    });
});

// Start server
const PORT = config.server.port;
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🎓 Multi-Agent Educational Transformation System         ║
║                                                            ║
║   Server running on: http://localhost:${PORT}                 ║
║   Environment: ${config.server.env}                            ║
║                                                            ║
║   Four Agents Ready:                                       ║
║   ✓ Agent 1: Document Analyzer                            ║
║   ✓ Agent 2: Simplification Specialist                    ║
║   ✓ Agent 3: Visual Synthesizer                           ║
║   ✓ Agent 4: Deep-Dive Expander                           ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);

    // Validate Groq API key
    if (!config.groq.apiKey || config.groq.apiKey.includes('your_')) {
        console.warn('\n⚠️  WARNING: GROQ_API_KEY not configured!');
        console.warn('Please set your Groq API key in the .env file\n');
    }
});

module.exports = app;
