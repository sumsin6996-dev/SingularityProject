const aiClient = require('../utils/aiClient');
const { generate_image } = require('../utils/imageGenerator');

/**
 * Agent 4: Visual Learning Generator
 * Responsibility: Create visual representation with actual diagram/chart image
 * Input: Knowledge graph
 * Output: Hierarchical bullets + actual diagram image
 */
class VisualLearning {
    constructor() {
        this.systemPrompt = `You are an expert at creating visual learning materials.

Your responsibilities:
1. Generate hierarchical bullet points explaining the concept
2. Create a detailed description for a visual diagram/chart/mindmap

The visual description should specify:
- Type of diagram (flowchart, mind map, concept map, process diagram, etc.)
- All nodes/elements and their relationships
- Clear labels and connections
- Color coding if helpful

Output format:
### Key Concepts
- Main concept 1
  - Sub-concept 1.1
  - Sub-concept 1.2
- Main concept 2

### Visual Diagram Description
[Detailed description of the diagram to be generated]

Do NOT use Mermaid syntax or code blocks.
Focus on creating a clear textual description that can be turned into an image.`;
    }

    /**
     * Generate visual learning content from knowledge graph
     * @param {KnowledgeGraph} knowledgeGraph - Structured knowledge
     * @returns {Promise<object>} Visual learning content with image
     */
    async generate(knowledgeGraph) {
        console.log('[Agent 4: Visual Learning] Generating...');

        try {
            const conceptsSummary = knowledgeGraph.concepts.map(c => {
                const examples = c.examples && c.examples.length > 0
                    ? `\n  Examples: ${c.examples.join(', ')}`
                    : '';
                return `- ${c.name}: ${c.description}${examples}`;
            }).join('\n');

            const userPrompt = `Create visual learning content for this topic:

TOPIC: ${knowledgeGraph.metadata.mainTopic || 'Educational Content'}

CONCEPTS:
${conceptsSummary}

Generate:
1. Hierarchical bullet points organizing the key concepts
2. A detailed description for a visual diagram (flowchart, mind map, or concept diagram)`;

            const textContent = await aiClient.generate(this.systemPrompt, userPrompt);

            // Generate image from the concept
            const imagePrompt = `Create an educational diagram for: ${knowledgeGraph.metadata.mainTopic}. 
Include: ${knowledgeGraph.concepts.slice(0, 5).map(c => c.name).join(', ')}. 
Style: Clean, modern educational infographic with clear labels, arrows showing relationships, and a professional color scheme.`;

            let imageUrl = null;
            try {
                imageUrl = await generate_image(imagePrompt, 'visual_diagram');
            } catch (imgError) {
                console.error('[Agent 4] Image generation failed:', imgError);
            }

            console.log('[Agent 4: Visual Learning] Generated successfully');

            return {
                text: textContent.trim(),
                imageUrl: imageUrl
            };
        } catch (error) {
            console.error('[Agent 4: Visual Learning] Error:', error);
            throw new Error(`Visual learning generation failed: ${error.message}`);
        }
    }
}

module.exports = new VisualLearning();
