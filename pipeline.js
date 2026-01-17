const documentAnalyzer = require('./agents/documentAnalyzer');
const simplifiedExplanation = require('./agents/simplifiedExplanation');
const deepDiveExplanation = require('./agents/deepDiveExplanation');
const visualLearning = require('./agents/visualLearning');
const flashcardGenerator = require('./agents/flashcardGenerator');
const videoRecommendations = require('./agents/videoRecommendations');
const documentParser = require('./utils/documentParser');

/**
 * Agent Pipeline Orchestrator
 * Coordinates the sequential execution of all 5 agents for 4-stage learning output
 */
class AgentPipeline {
    /**
     * Process a document through the complete agent pipeline
     * @param {string} filePath - Path to uploaded document
     * @returns {Promise<object>} All four learning stage outputs
     */
    async process(filePath) {
        console.log('\n=== STARTING 4-STAGE LEARNING PIPELINE ===\n');
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

            // Steps 2-6: Run learning stage generators in parallel
            console.log('[Pipeline] Steps 2-6: Generating learning stages...');
            const [simplified, deepDive, visual, flashcards, videos] = await Promise.all([
                // Agent 2: Simplified Explanation (3-4 sentences)
                simplifiedExplanation.generate(knowledgeGraph),

                // Agent 3: Deep-Dive Explanation (3-4 paragraphs)
                deepDiveExplanation.generate(knowledgeGraph),

                // Agent 4: Visual Learning (infographic)
                visualLearning.generate(knowledgeGraph),

                // Agent 5: Flashcard Generator (4 cards)
                flashcardGenerator.generate(knowledgeGraph),

                // Agent 6: Video Recommendations (3-5 videos)
                videoRecommendations.generate(knowledgeGraph)
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
                    deepDive: deepDive,
                    visual: visual,
                    flashcards: flashcards,
                    videos: videos
                }
            };

        } catch (error) {
            console.error('[Pipeline] Error:', error);
            throw error;
        }
    }
}

module.exports = new AgentPipeline();
