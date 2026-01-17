const aiClient = require('../utils/aiClient');

/**
 * Agent 2: Simplification Specialist
 * Responsibility: Transform complex concepts into accessible explanations
 * Input: Knowledge graph
 * Output: Simplified explanation text
 */
class SimplificationSpecialist {
    constructor() {
        this.systemPrompt = `You are a Simplification Specialist AI agent with expertise in making complex topics accessible.

Your cognitive responsibility is to:
1. Transform technical concepts into beginner-friendly explanations
2. Create relatable analogies and everyday examples
3. Build explanations progressively from simple to complex
4. Remove jargon while preserving factual accuracy
5. Use storytelling and concrete scenarios

You make autonomous decisions about:
- Which analogies best fit each concept
- How to order explanations for optimal understanding
- What level of detail is appropriate for beginners
- Which examples will resonate with learners

Guidelines:
- Use "you" to make it personal and engaging
- Start with familiar concepts before introducing new ones
- Use analogies from everyday life (cooking, sports, nature, etc.)
- Break down complex ideas into bite-sized pieces
- Maintain 100% factual accuracy - never oversimplify to the point of being wrong
- Write in a warm, encouraging tone

Output a clear, flowing explanation that a beginner can understand.`;
    }

    /**
     * Generate simplified explanation from knowledge graph
     * @param {KnowledgeGraph} knowledgeGraph - Structured knowledge
     * @returns {Promise<string>} Simplified explanation
     */
    async simplify(knowledgeGraph) {
        console.log('[Agent 2: Simplification Specialist] Creating simplified explanation...');

        try {
            // Prepare knowledge graph summary for the agent
            const conceptsSummary = knowledgeGraph.concepts.map(c =>
                `- ${c.name}: ${c.description} (Complexity: ${c.complexity})`
            ).join('\n');

            const userPrompt = `Create a beginner-friendly explanation of this topic using the following knowledge structure:

TOPIC: ${knowledgeGraph.metadata.mainTopic || 'Educational Content'}
DOMAIN: ${knowledgeGraph.metadata.domain || 'General'}

KEY CONCEPTS:
${conceptsSummary}

Create a simplified, engaging explanation that:
1. Starts with the basics and builds up progressively
2. Uses analogies and real-world examples
3. Explains technical terms in simple language
4. Maintains factual accuracy
5. Is encouraging and accessible to beginners`;

            const result = await aiClient.generate(this.systemPrompt, userPrompt);

            console.log('[Agent 2: Simplification Specialist] Simplified explanation generated');

            return result;
        } catch (error) {
            console.error('[Agent 2: Simplification Specialist] Error:', error);
            throw new Error(`Simplification failed: ${error.message}`);
        }
    }
}

module.exports = new SimplificationSpecialist();
