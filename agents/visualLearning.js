const aiClient = require('../utils/aiClient');

/**
 * Agent 4: Visual Learning Generator
 * Generates clean Mermaid diagrams for educational content
 */
class VisualLearning {
    constructor() {
        this.systemPrompt = `You are an expert at creating educational Mermaid diagrams.

STRICT OUTPUT RULES:
1. Generate ONLY valid Mermaid syntax
2. Use simple, clean diagrams
3. Choose diagram type based on content:
   - Processes/Steps → flowchart (graph TD or graph LR)
   - Concepts/Relationships → mind map or graph
   - Comparisons → simple flowchart

4. Styling rules:
   - Use hex colors: #6366f1, #8b5cf6, #06b6d4, #10b981
   - Keep node labels SHORT (max 3-4 words)
   - Use simple arrows: --> or ---
   - Maximum 6-8 nodes

5. Output format:
\`\`\`mermaid
graph LR
    A[Node 1] --> B[Node 2]
    B --> C[Node 3]
    style A fill:#6366f1,stroke:#fff,color:#fff
    style B fill:#8b5cf6,stroke:#fff,color:#fff
    style C fill:#06b6d4,stroke:#fff,color:#fff
\`\`\`

CRITICAL: Output ONLY the mermaid code block. No explanations.`;
    }

    async generate(knowledgeGraph) {
        console.log('[Agent 4: Visual Learning] Generating diagram...');

        try {
            // Get top 5 concepts
            const topConcepts = knowledgeGraph.concepts.slice(0, 5);
            const conceptNames = topConcepts.map(c => c.name.substring(0, 20)); // Limit length

            const userPrompt = `Create a Mermaid flowchart for: ${knowledgeGraph.metadata.mainTopic}

Main concepts: ${conceptNames.join(', ')}

Generate a simple flowchart showing how these concepts relate.
Use graph LR (left to right).
Keep labels under 4 words.
Output ONLY the mermaid code block.`;

            const result = await aiClient.generate(this.systemPrompt, userPrompt);

            console.log('[Agent 4: Visual Learning] Diagram generated');

            return {
                text: result.trim(),
                type: 'mermaid'
            };
        } catch (error) {
            console.error('[Agent 4: Visual Learning] Error:', error);

            // Fallback: Generate a simple default diagram
            const fallbackDiagram = `\`\`\`mermaid
graph LR
    A[${knowledgeGraph.metadata.mainTopic || 'Topic'}] --> B[Learn]
    B --> C[Practice]
    C --> D[Master]
    style A fill:#6366f1,stroke:#fff,color:#fff
    style B fill:#8b5cf6,stroke:#fff,color:#fff
    style C fill:#06b6d4,stroke:#fff,color:#fff
    style D fill:#10b981,stroke:#fff,color:#fff
\`\`\``;

            return {
                text: fallbackDiagram,
                type: 'mermaid'
            };
        }
    }
}

module.exports = new VisualLearning();
