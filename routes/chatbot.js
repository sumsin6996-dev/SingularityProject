const express = require('express');
const router = express.Router();
const aiClient = require('../utils/aiClient');

// Store current learning context (in-memory for now)
let currentContext = {
    visual: '',
    simplified: '',
    deepDive: '',
    flashcards: []
};

/**
 * POST /api/chat
 * Context-aware chatbot for answering questions about learned content
 */
router.post('/chat', express.json(), async (req, res) => {
    try {
        const { question, context } = req.body;

        if (!question) {
            return res.status(400).json({
                success: false,
                error: 'Question is required'
            });
        }

        // Update context if provided
        if (context) {
            currentContext = context;
        }

        // Build context string
        const contextString = `
VISUAL LEARNING:
${typeof currentContext.visual === 'object' ? currentContext.visual.text : currentContext.visual}

SIMPLIFIED EXPLANATION:
${currentContext.simplified}

DEEP-DIVE EXPLANATION:
${currentContext.deepDive}

FLASHCARDS:
${Array.isArray(currentContext.flashcards) ? currentContext.flashcards.map((c, i) => `${i + 1}. Q: ${c.question} A: ${c.answer}`).join('\n') : ''}
`;

        const systemPrompt = `You are a helpful educational assistant for the Clarify learning platform.

STRICT RULES:
1. Answer questions ONLY based on the learning content provided below.
2. If a question is outside the scope of the content, politely say: "That's beyond the current topic. I can only answer questions about the content you just learned."
3. Be clear, concise, and student-friendly.
4. Use simple language.
5. If asked about concepts in the content, explain them clearly.

LEARNING CONTENT:
${contextString}`;

        const answer = await aiClient.generate(systemPrompt, question);

        res.json({
            success: true,
            answer: answer.trim()
        });

    } catch (error) {
        console.error('[Chatbot] Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate answer'
        });
    }
});

module.exports = router;
