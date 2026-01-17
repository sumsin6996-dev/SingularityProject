const aiClient = require('../utils/aiClient');

/**
 * Agent 2: Simplified Explanation Generator
 * Responsibility: Create ultra-concise simplified explanation
 * Input: Knowledge graph
 * Output: EXACTLY 3-4 lines (very short)
 */
class SimplifiedExplanation {
    constructor() {
        this.systemPrompt = `You are an expert educator creating ultra-concise simplified explanations.

Your STRICT requirements:
1. Generate EXACTLY 3 to 4 SHORT sentences. No more.
2. Each sentence should be brief and to the point.
3. Write in paragraph format ONLY. Do NOT use bullet points.
4. Use plain English suitable for complete beginners.
5. Avoid jargon unless absolutely unavoidable.
6. The ENTIRE output must fit in 3-4 visual lines when displayed.
7. Write like a high-quality textbook summary - extremely concise.

Your explanation should:
- Introduce the concept clearly in 1 sentence
- Explain what it is in 1-2 sentences
- Mention why it matters in 1 sentence (if space allows)

Do NOT:
- Use bullet points or lists
- Include technical jargon without explanation
- Write more than 4 sentences
- Add headers or formatting

Output ONLY the paragraph text - make it as SHORT as possible while still being informative.`;
    }

    /**
     * Generate simplified explanation from knowledge graph
     * @param {KnowledgeGraph} knowledgeGraph - Structured knowledge
     * @returns {Promise<string>} Simplified explanation (3-4 lines)
     */
    async generate(knowledgeGraph) {
        console.log('[Agent 2: Simplified Explanation] Generating...');

        try {
            const conceptsSummary = knowledgeGraph.concepts.slice(0, 3).map(c =>
                `- ${c.name}: ${c.description}`
            ).join('\n');

            const userPrompt = `Create an ultra-concise simplified explanation of this topic:

TOPIC: ${knowledgeGraph.metadata.mainTopic || 'Educational Content'}

KEY CONCEPTS (top 3):
${conceptsSummary}

Generate EXACTLY 3-4 SHORT sentences explaining this concept in the simplest way possible.
Make it fit in 3-4 visual lines.`;

            const result = await aiClient.generate(this.systemPrompt, userPrompt);

            console.log('[Agent 2: Simplified Explanation] Generated successfully');

            return result.trim();
        } catch (error) {
            console.error('[Agent 2: Simplified Explanation] Error:', error);
            throw new Error(`Simplified explanation generation failed: ${error.message}`);
        }
    }
}

module.exports = new SimplifiedExplanation();
