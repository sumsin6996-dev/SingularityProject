const aiClient = require('../utils/aiClient');
const KnowledgeGraph = require('../utils/knowledgeGraph');

/**
 * Agent 1: Document Analyzer
 * Responsibility: Extract and structure core knowledge from input document
 * Input: Raw document text
 * Output: Structured knowledge graph
 */
class DocumentAnalyzer {
    constructor() {
        this.systemPrompt = `You are a Document Analyzer AI agent with expertise in knowledge extraction and structuring.

Your cognitive responsibility is to:
1. Identify key concepts, definitions, and ideas in the document
2. Determine the complexity level of each concept (low, medium, high)
3. Map relationships between concepts (prerequisites, dependencies, related topics)
4. Extract concrete examples and supporting evidence
5. Build a structured knowledge representation

You make autonomous decisions about:
- Which concepts are fundamental vs. advanced
- How concepts relate to each other
- What constitutes a discrete concept vs. a sub-point
- The optimal knowledge structure for learning

Output a JSON knowledge graph with this structure:
{
  "concepts": [
    {
      "name": "Concept Name",
      "description": "Clear, factual description",
      "complexity": "low|medium|high",
      "prerequisites": ["prerequisite concept names"],
      "examples": ["concrete examples from the document"]
    }
  ],
  "relationships": [
    {
      "from": "Concept A",
      "to": "Concept B",
      "type": "requires|enables|relates_to"
    }
  ],
  "metadata": {
    "domain": "subject area",
    "mainTopic": "primary topic",
    "targetAudience": "inferred audience level"
  }
}`;
    }

    /**
     * Analyze document and create knowledge graph
     * @param {string} documentText - Raw document text
     * @returns {Promise<KnowledgeGraph>} Structured knowledge graph
     */
    async analyze(documentText) {
        console.log('[Agent 1: Document Analyzer] Starting analysis...');

        try {
            const userPrompt = `Analyze this educational document and extract a structured knowledge graph:\n\n${documentText}`;

            const result = await aiClient.generateJSON(this.systemPrompt, userPrompt);

            // Convert to KnowledgeGraph instance
            const knowledgeGraph = new KnowledgeGraph();

            // Add concepts with IDs
            if (result.concepts && Array.isArray(result.concepts)) {
                result.concepts.forEach((concept, index) => {
                    knowledgeGraph.addConcept({
                        name: concept.name,
                        description: concept.description,
                        complexity: concept.complexity || 'medium',
                        prerequisites: concept.prerequisites || [],
                        examples: concept.examples || []
                    });
                });
            }

            // Add relationships
            if (result.relationships && Array.isArray(result.relationships)) {
                result.relationships.forEach(rel => {
                    // Find concept IDs by name
                    const fromConcept = knowledgeGraph.concepts.find(c => c.name === rel.from);
                    const toConcept = knowledgeGraph.concepts.find(c => c.name === rel.to);

                    if (fromConcept && toConcept) {
                        knowledgeGraph.addRelationship(fromConcept.id, toConcept.id, rel.type);
                    }
                });
            }

            // Add metadata
            knowledgeGraph.metadata = result.metadata || {};

            console.log(`[Agent 1: Document Analyzer] Extracted ${knowledgeGraph.concepts.length} concepts`);

            return knowledgeGraph;
        } catch (error) {
            console.error('[Agent 1: Document Analyzer] Error:', error);
            throw new Error(`Document analysis failed: ${error.message}`);
        }
    }
}

module.exports = new DocumentAnalyzer();
