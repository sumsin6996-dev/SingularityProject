/**
 * Knowledge Graph Data Structure
 * Represents the structured knowledge extracted from a document
 */
class KnowledgeGraph {
    constructor(data = null) {
        if (data) {
            this.concepts = data.concepts || [];
            this.relationships = data.relationships || [];
            this.metadata = data.metadata || {};
        } else {
            this.concepts = [];
            this.relationships = [];
            this.metadata = {};
        }
    }

    /**
     * Add a concept to the knowledge graph
     * @param {object} concept - Concept object with name, description, complexity
     */
    addConcept(concept) {
        this.concepts.push({
            id: this.concepts.length,
            name: concept.name,
            description: concept.description,
            complexity: concept.complexity || 'medium', // low, medium, high
            prerequisites: concept.prerequisites || [],
            examples: concept.examples || []
        });
    }

    /**
     * Add a relationship between concepts
     * @param {number} fromId - Source concept ID
     * @param {number} toId - Target concept ID
     * @param {string} type - Relationship type (e.g., 'requires', 'enables', 'relates_to')
     */
    addRelationship(fromId, toId, type) {
        this.relationships.push({
            from: fromId,
            to: toId,
            type: type
        });
    }

    /**
     * Get concepts by complexity level
     * @param {string} level - Complexity level (low, medium, high)
     * @returns {array} Filtered concepts
     */
    getConceptsByComplexity(level) {
        return this.concepts.filter(c => c.complexity === level);
    }

    /**
     * Get all concepts that are prerequisites for a given concept
     * @param {number} conceptId - Target concept ID
     * @returns {array} Prerequisite concepts
     */
    getPrerequisites(conceptId) {
        const concept = this.concepts.find(c => c.id === conceptId);
        if (!concept) return [];

        return concept.prerequisites.map(prereqId =>
            this.concepts.find(c => c.id === prereqId)
        ).filter(Boolean);
    }

    /**
     * Convert to JSON for storage/transmission
     * @returns {object} JSON representation
     */
    toJSON() {
        return {
            concepts: this.concepts,
            relationships: this.relationships,
            metadata: this.metadata
        };
    }

    /**
     * Create from JSON
     * @param {object} json - JSON data
     * @returns {KnowledgeGraph} New instance
     */
    static fromJSON(json) {
        return new KnowledgeGraph(json);
    }

    /**
     * Validate the knowledge graph structure
     * @returns {boolean} True if valid
     */
    validate() {
        if (!Array.isArray(this.concepts) || this.concepts.length === 0) {
            return false;
        }

        // Ensure all concepts have required fields
        for (const concept of this.concepts) {
            if (!concept.name || !concept.description) {
                return false;
            }
        }

        return true;
    }
}

module.exports = KnowledgeGraph;
