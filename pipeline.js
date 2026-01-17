const documentAnalyzer = require('./agents/documentAnalyzer');
const simplificationSpecialist = require('./agents/simplificationSpecialist');
const visualSynthesizer = require('./agents/visualSynthesizer');
const deepDiveExpander = require('./agents/deepDiveExpander');
const documentParser = require('./utils/documentParser');

/**
 * Agent Pipeline Orchestrator
 * Coordinates the sequential execution of all four agents
 */
class AgentPipeline {
    /**
     * Process a document through the complete agent pipeline
     * @param {string} filePath - Path to uploaded document
     * @returns {Promise<object>} All three learning outputs
     */
    async process(filePath) {
        console.log('\n=== STARTING AGENT PIPELINE ===\n');
        const startTime = Date.now();

        try {
            // Step 0: Parse document
            console.log('[Pipeline] Step 0: Parsing document...');
            const rawText = await documentParser.parse(filePath);
            const cleanText = documentParser.preprocess(rawText);
            console.log(`[Pipeline] Document parsed: ${cleanText.length} characters\n`);

            // Step 1: Agent 1 - Document Analyzer
            console.log('[Pipeline] Step 1: Running Document Analyzer...');
            const knowledgeGraph = await documentAnalyzer.analyze(cleanText);
            console.log(`[Pipeline] Knowledge graph created with ${knowledgeGraph.concepts.length} concepts\n`);

            // Steps 2-4: Run agents 2, 3, 4 in parallel (they all use the same knowledge graph)
            console.log('[Pipeline] Steps 2-4: Running transformation agents in parallel...');
            const [simplified, visual, deepDive] = await Promise.all([
                // Agent 2: Simplification Specialist
                simplificationSpecialist.simplify(knowledgeGraph),

                // Agent 3: Visual Synthesizer
                visualSynthesizer.synthesize(knowledgeGraph),

                // Agent 4: Deep-Dive Expander
                deepDiveExpander.expand(knowledgeGraph)
            ]);

            const endTime = Date.now();
            const duration = ((endTime - startTime) / 1000).toFixed(2);

            console.log(`\n=== PIPELINE COMPLETE in ${duration}s ===\n`);

            return {
                success: true,
                duration: duration,
                knowledgeGraph: knowledgeGraph.toJSON(),
                outputs: {
                    simplified: simplified,
                    visual: visual,
                    deepDive: deepDive
                }
            };

        } catch (error) {
            console.error('[Pipeline] Error:', error);
            throw error;
        }
    }
}

module.exports = new AgentPipeline();
