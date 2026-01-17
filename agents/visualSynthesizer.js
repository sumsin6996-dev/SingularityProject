const aiClient = require('../utils/aiClient');

/**
 * Agent 3: Visual Synthesizer
 * Responsibility: Restructure information into scannable, visual-friendly formats
 * Input: Knowledge graph
 * Output: Visual/bullet-point formatted text
 */
class VisualSynthesizer {
    constructor() {
        this.systemPrompt = `You are a Visual Synthesizer AI agent with expertise in information design and visual hierarchy.

Your cognitive responsibility is to:
1. Transform knowledge into scannable, hierarchical formats
2. Create clear visual structure using headings, bullets, and spacing
3. Group related concepts logically
4. Extract key takeaways and quick-reference points
5. Design for rapid comprehension and easy scanning

You make autonomous decisions about:
- How to group and categorize information
- What level of hierarchy to use (main points, sub-points, details)
- Which information belongs in summaries vs. details
- How to structure for maximum scannability

Guidelines:
- Use clear hierarchical structure (##, ###, -, •)
- Create distinct sections with descriptive headings
- Keep bullet points concise (1-2 lines max)
- Include a "Key Takeaways" section at the top
- Use visual separators and whitespace
- Organize from most important to supporting details
- Include a quick reference section at the end

Output a well-structured, visually organized document using markdown formatting.`;
    }

    /**
     * Generate visual/bullet-point format from knowledge graph
     * @param {KnowledgeGraph} knowledgeGraph - Structured knowledge
     * @returns {Promise<string>} Visual formatted text
     */
    async synthesize(knowledgeGraph) {
        console.log('[Agent 3: Visual Synthesizer] Creating visual format...');

        try {
            // Organize concepts by complexity
            const lowComplexity = knowledgeGraph.getConceptsByComplexity('low');
            const mediumComplexity = knowledgeGraph.getConceptsByComplexity('medium');
            const highComplexity = knowledgeGraph.getConceptsByComplexity('high');

            const conceptsSummary = knowledgeGraph.concepts.map(c => {
                const examples = c.examples && c.examples.length > 0
                    ? `\n  Examples: ${c.examples.join(', ')}`
                    : '';
                return `- ${c.name} [${c.complexity}]: ${c.description}${examples}`;
            }).join('\n');

            const userPrompt = `Create a visual, scannable format for this topic using the following knowledge structure:

TOPIC: ${knowledgeGraph.metadata.mainTopic || 'Educational Content'}
DOMAIN: ${knowledgeGraph.metadata.domain || 'General'}

CONCEPTS:
${conceptsSummary}

COMPLEXITY BREAKDOWN:
- Foundational (${lowComplexity.length} concepts)
- Intermediate (${mediumComplexity.length} concepts)
- Advanced (${highComplexity.length} concepts)

Create a visually structured document with:
1. "🎯 Key Takeaways" section at the top (3-5 main points)
2. Hierarchical sections organized by topic/theme
3. Clear bullet points with concise information
4. "📋 Quick Reference" section at the bottom
5. Use emojis sparingly for visual anchors
6. Proper markdown formatting (##, ###, -, *)`;

            const result = await aiClient.generate(this.systemPrompt, userPrompt);

            console.log('[Agent 3: Visual Synthesizer] Visual format generated');

            return result;
        } catch (error) {
            console.error('[Agent 3: Visual Synthesizer] Error:', error);
            throw new Error(`Visual synthesis failed: ${error.message}`);
        }
    }
}

module.exports = new VisualSynthesizer();
