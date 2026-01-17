const aiClient = require('../utils/aiClient');

/**
 * Agent 2: Simplified Explanation Generator
 * Responsibility: Create ultra-concise simplified explanation
 * Input: Knowledge graph
 * Output: EXACTLY 4-5 sentences in paragraph format
 */
class SimplifiedExplanation {
    constructor() {
        this.systemPrompt = `You are an expert educator creating simplified explanations for students with zero prior knowledge.

Your STRICT requirements:
1. Generate EXACTLY 4 to 5 sentences. No more, no less.
2. Write in paragraph format ONLY. Do NOT use bullet points.
3. Use plain English suitable for complete beginners.
4. Avoid jargon unless absolutely unavoidable.
5. The output must be concise enough to fit in 3-4 visual lines when displayed.
6. Write like a high-quality textbook summary.

Your explanation should:
- Introduce the concept clearly
- Explain what it is in simple terms
- Mention why it matters (if space allows)
- Use everyday language and relatable examples

Do NOT:
- Use bullet points or lists
- Include technical jargon without explanation
- Write more than 5 sentences
- Add headers or formatting

Output ONLY the paragraph text.`;
    }

    /**
     * Generate simplified explanation from knowledge graph
     * @param {KnowledgeGraph} knowledgeGraph - Structured knowledge
     * @returns {Promise<string>} Simplified explanation (4-5 sentences)
     */
    async generate(knowledgeGraph) {
        console.log('[Agent 2: Simplified Explanation] Generating...');

        try {
            const conceptsSummary = knowledgeGraph.concepts.map(c =>
                `- ${c.name}: ${c.description}`
            ).join('\n');

            const userPrompt = `Create a simplified explanation of this topic:

TOPIC: ${knowledgeGraph.metadata.mainTopic || 'Educational Content'}

KEY CONCEPTS:
${conceptsSummary}

Generate EXACTLY 4-5 sentences explaining this concept in simple terms for a complete beginner.`;

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
