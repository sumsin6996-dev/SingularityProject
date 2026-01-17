const aiClient = require('../utils/aiClient');
const { generate_image } = require('../utils/imageGenerator');

/**
 * Agent 4: Visual Learning Generator
 * Generates prompts for AI image generation
 */
class VisualLearning {
    constructor() {
        this.systemPrompt = `You are an expert visual prompt engineer for educational content.
    
Your goal is to write a detailed, descriptive prompt for an AI image generator (like Stable Diffusion).
The image should be an EDUCATIONAL INFOGRAPHIC, CHART, or DIAGRAM explaining the topic.

RULES:
1. Output ONLY the image generation prompt.
2. The prompt should be descriptive: "A detailed educational infographic showing..."
3. Include style keywords: "clean, vector art, flat design, educational, labeled, professional, 4k"
4. Do NOT output markdown, backticks, or code. Just the prompt text.
`;
    }

    async generate(knowledgeGraph) {
        console.log('[Agent 4: Visual Learning] Generating image prompt...');

        try {
            const topConcepts = knowledgeGraph.concepts.slice(0, 5).map(c => c.name).join(', ');

            const userPrompt = `Topic: ${knowledgeGraph.metadata.mainTopic}
Key Concepts: ${topConcepts}

Write a prompt to generate a high-quality educational illustration or diagram that explains this topic visually.`;

            // 1. Generate the Prompt
            const imagePrompt = await aiClient.generate(this.systemPrompt, userPrompt);
            console.log('[Agent 4] Prompt generated:', imagePrompt.substring(0, 50) + '...');

            // 2. Generate the Image using Hugging Face
            // Clean prompt
            const cleanPrompt = imagePrompt.replace(/['"]/g, '').trim();

            let imageUrl = null;
            try {
                imageUrl = await generate_image(cleanPrompt, 'visual_learning');
            } catch (err) {
                console.error('[Agent 4] Image generation failed:', err);
            }

            return {
                text: '', // Empty text, only show image
                imageUrl: imageUrl, // Base64 data URL
                type: imageUrl ? 'image' : 'error'
            };

        } catch (error) {
            console.error('[Agent 4: Visual Learning] Error:', error);
            return {
                text: "Could not generate visual content.",
                imageUrl: null,
                type: 'error'
            };
        }
    }
}

module.exports = new VisualLearning();
