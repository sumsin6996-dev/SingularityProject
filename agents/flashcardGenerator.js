const aiClient = require('../utils/aiClient');

/**
 * Agent 5: Flashcard Generator
 * Responsibility: Create exactly 4 visual flashcard data
 * Input: Knowledge graph
 * Output: EXACTLY 4 flashcards with questions and answers
 */
class FlashcardGenerator {
    constructor() {
        this.systemPrompt = `You are an expert at creating exam-ready flashcards for effective learning.

Your STRICT requirements:
1. Generate EXACTLY 4 flashcards. No more, no less.
2. Each flashcard should have:
   - A clear, specific question or term
   - A concise, memorable answer (1-2 sentences max)
3. Questions must be exam-oriented and test recall
4. Answers must be factually accurate and easy to memorize

Output as JSON array:
[
  {"question": "What is X?", "answer": "X is..."},
  {"question": "Define Y", "answer": "Y is defined as..."},
  {"question": "How does Z work?", "answer": "Z works by..."},
  {"question": "Why is W important?", "answer": "W is important because..."}
]

Do NOT include explanations or commentary.
Focus on the 4 most important concepts for memorization.`;
    }

    /**
     * Generate exactly 4 flashcards from knowledge graph
     * @param {KnowledgeGraph} knowledgeGraph - Structured knowledge
     * @returns {Promise<Array>} Array of exactly 4 flashcard objects
     */
    async generate(knowledgeGraph) {
        console.log('[Agent 5: Flashcard Generator] Generating...');

        try {
            const conceptsSummary = knowledgeGraph.concepts.slice(0, 4).map(c =>
                `- ${c.name}: ${c.description}`
            ).join('\n');

            const userPrompt = `Create exam-ready flashcards for this topic:

TOPIC: ${knowledgeGraph.metadata.mainTopic || 'Educational Content'}

KEY CONCEPTS (top 4):
${conceptsSummary}

Generate EXACTLY 4 flashcards as a JSON array.`;

            const result = await aiClient.generateJSON(this.systemPrompt, userPrompt);

            // Ensure it's an array
            const flashcards = Array.isArray(result) ? result : result.flashcards || [];

            // Ensure exactly 4 cards
            const exactlyFour = flashcards.slice(0, 4);

            // Pad with default cards if less than 4
            while (exactlyFour.length < 4) {
                exactlyFour.push({
                    question: `Key Concept ${exactlyFour.length + 1}`,
                    answer: 'Important information about this topic.'
                });
            }

            console.log('[Agent 5: Flashcard Generator] Generated exactly 4 cards');

            return exactlyFour;
        } catch (error) {
            console.error('[Agent 5: Flashcard Generator] Error:', error);
            throw new Error(`Flashcard generation failed: ${error.message}`);
        }
    }
}

module.exports = new FlashcardGenerator();
