const aiClient = require('../utils/aiClient');

/**
 * Agent 4: Deep-Dive Expander
 * Responsibility: Generate advanced analysis and extended insights
 * Input: Knowledge graph
 * Output: Deep-dive advanced explanation
 */
class DeepDiveExpander {
    constructor() {
        this.systemPrompt = `You are a Deep-Dive Expander AI agent with expertise in advanced analysis and technical depth.

Your cognitive responsibility is to:
1. Explore technical depth and nuanced details
2. Analyze implications and real-world applications
3. Identify edge cases and advanced considerations
4. Connect concepts to broader domain knowledge
5. Generate novel insights beyond the source material

You make autonomous decisions about:
- Which advanced topics to explore in depth
- What implications and applications are most relevant
- How to connect concepts to cutting-edge developments
- Which technical details add meaningful depth

Guidelines:
- Assume the reader has strong foundational knowledge
- Use precise technical terminology appropriately
- Explore "why" and "how" at a deeper level
- Discuss real-world applications and case studies
- Address limitations, trade-offs, and edge cases
- Connect to related advanced topics
- Include technical nuances and subtleties
- Maintain academic rigor and accuracy

Output a comprehensive, technically rich explanation for advanced learners.`;
    }

    /**
     * Generate deep-dive explanation from knowledge graph
     * @param {KnowledgeGraph} knowledgeGraph - Structured knowledge
     * @returns {Promise<string>} Advanced explanation
     */
    async expand(knowledgeGraph) {
        console.log('[Agent 4: Deep-Dive Expander] Creating advanced explanation...');

        try {
            // Focus on medium and high complexity concepts
            const advancedConcepts = knowledgeGraph.concepts.filter(
                c => c.complexity === 'medium' || c.complexity === 'high'
            );

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

            const userPrompt = `Create an advanced, in-depth analysis of this topic using the following knowledge structure:

TOPIC: ${knowledgeGraph.metadata.mainTopic || 'Educational Content'}
DOMAIN: ${knowledgeGraph.metadata.domain || 'General'}

ALL CONCEPTS:
${conceptsSummary}

CONCEPT RELATIONSHIPS:
${relationshipsSummary}

ADVANCED CONCEPTS TO EXPLORE:
${advancedConcepts.map(c => `- ${c.name}: ${c.description}`).join('\n')}

Create a deep-dive explanation that:
1. Explores technical depth and nuanced details
2. Discusses real-world applications and implications
3. Addresses edge cases and advanced considerations
4. Connects to broader domain knowledge
5. Analyzes trade-offs and limitations
6. Provides insights beyond the source material
7. Uses appropriate technical terminology
8. Maintains academic rigor`;

            const result = await aiClient.generate(this.systemPrompt, userPrompt);

            console.log('[Agent 4: Deep-Dive Expander] Advanced explanation generated');

            return result;
        } catch (error) {
            console.error('[Agent 4: Deep-Dive Expander] Error:', error);
            throw new Error(`Deep-dive expansion failed: ${error.message}`);
        }
    }
}

module.exports = new DeepDiveExpander();
