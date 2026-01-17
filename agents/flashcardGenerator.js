const aiClient = require('../utils/aiClient');

/**
 * Agent 5: Flashcard Generator
 * Responsibility: Create visual flashcard data
 * Input: Knowledge graph
 * Output: 5-6 flashcards with questions and answers
 */
class FlashcardGenerator {
    constructor() {
        this.systemPrompt = `You are an expert at creating exam-ready flashcards for effective learning.

Your STRICT requirements:
1. Generate EXACTLY 5 to 6 flashcards.
2. Each flashcard should have:
   - A clear, specific question or term
   - A concise, memorable answer (1-2 sentences max)
3. Questions must be exam-oriented and test recall
4. Answers must be factually accurate and easy to memorize

Output as JSON array:
[
  {"question": "What is X?", "answer": "X is..."},
  {"question": "Define Y", "answer": "Y is defined as..."},
  ...
]

Do NOT include explanations or commentary.
Focus on the most important concepts for memorization.`;
    }

    /**
     * Generate flashcards from knowledge graph
     * @param {KnowledgeGraph} knowledgeGraph - Structured knowledge
     * @returns {Promise<Array>} Array of flashcard objects
     */
    async generate(knowledgeGraph) {
        console.log('[Agent 5: Flashcard Generator] Generating...');

        try {
            const conceptsSummary = knowledgeGraph.concepts.map(c =>
                `- ${c.name}: ${c.description}`
            ).join('\n');

            const userPrompt = `Create exam-ready flashcards for this topic:

TOPIC: ${knowledgeGraph.metadata.mainTopic || 'Educational Content'}

KEY CONCEPTS:
${conceptsSummary}

Generate EXACTLY 5-6 flashcards as a JSON array.`;

            const result = await aiClient.generateJSON(this.systemPrompt, userPrompt);

            // Ensure it's an array
            const flashcards = Array.isArray(result) ? result : result.flashcards || [];

            console.log('[Agent 5: Flashcard Generator] Generated successfully');

            return flashcards.slice(0, 6); // Ensure max 6 cards
        } catch (error) {
            console.error('[Agent 5: Flashcard Generator] Error:', error);
            throw new Error(`Flashcard generation failed: ${error.message}`);
        }
    }
}

module.exports = new FlashcardGenerator();
