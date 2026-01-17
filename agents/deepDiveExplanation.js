const aiClient = require('../utils/aiClient');

/**
 * Agent 3: Deep-Dive Explanation Generator
 * Responsibility: Create comprehensive conceptual explanation
 * Input: Knowledge graph
 * Output: EXACTLY 3-4 paragraphs, each with 5-6 lines
 */
class DeepDiveExplanation {
    constructor() {
        this.systemPrompt = `You are an expert educator creating comprehensive deep-dive explanations.

Your STRICT requirements:
1. Generate EXACTLY 3 or 4 paragraphs.
2. Each paragraph MUST contain 5 to 6 lines of text.
3. Follow this logical structure:
   - Paragraph 1: What the concept is (fundamentals and definition)
   - Paragraph 2: How it works (mechanisms and processes)
   - Paragraph 3: Why it matters (applications and importance)
   - Paragraph 4 (optional): Advanced considerations or implications

4. Maintain strong logical flow between paragraphs.
5. Start from fundamentals and progress toward advanced understanding.
6. Use proper technical terminology with clear explanations.

Your explanation should provide complete conceptual clarity on its own.

Do NOT:
- Use bullet points or lists
- Include headers or section titles
- Write fewer than 3 or more than 4 paragraphs
- Make paragraphs shorter than 5 lines or longer than 6 lines

Output ONLY the paragraph text with proper paragraph breaks.`;
    }

    /**
     * Generate deep-dive explanation from knowledge graph
     * @param {KnowledgeGraph} knowledgeGraph - Structured knowledge
     * @returns {Promise<string>} Deep-dive explanation (3-4 paragraphs)
     */
    async generate(knowledgeGraph) {
        console.log('[Agent 3: Deep-Dive Explanation] Generating...');

        try {
            const conceptsSummary = knowledgeGraph.concepts.map(c => {
                const prereqs = c.prerequisites && c.prerequisites.length > 0
                    ? `\n  Prerequisites: ${c.prerequisites.join(', ')}`
                    : '';
                return `- ${c.name} [${c.complexity}]: ${c.description}${prereqs}`;
            }).join('\n');

            const relationshipsSummary = knowledgeGraph.relationships.map(r => {
                const fromConcept = knowledgeGraph.concepts.find(c => c.id === r.from);
                const toConcept = knowledgeGraph.concepts.find(c => c.id === r.to);
                return `  ${fromConcept?.name} → ${r.type} → ${toConcept?.name}`;
            }).join('\n');

            const userPrompt = `Create a deep-dive explanation of this topic:

TOPIC: ${knowledgeGraph.metadata.mainTopic || 'Educational Content'}
DOMAIN: ${knowledgeGraph.metadata.domain || 'General'}

CONCEPTS:
${conceptsSummary}

RELATIONSHIPS:
${relationshipsSummary}

Generate EXACTLY 3-4 paragraphs (each 5-6 lines) that:
1. Explain what this concept is (fundamentals)
2. Describe how it works (mechanisms)
3. Explain why it matters (applications/importance)
4. (Optional) Discuss advanced considerations`;

            const result = await aiClient.generate(this.systemPrompt, userPrompt);

            console.log('[Agent 3: Deep-Dive Explanation] Generated successfully');

            return result.trim();
        } catch (error) {
            console.error('[Agent 3: Deep-Dive Explanation] Error:', error);
            throw new Error(`Deep-dive explanation generation failed: ${error.message}`);
        }
    }
}

module.exports = new DeepDiveExplanation();
