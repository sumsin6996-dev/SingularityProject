const Groq = require('groq-sdk');
const config = require('../config');

class AIClient {
    constructor() {
        this.groq = new Groq({
            apiKey: config.groq.apiKey
        });
    }

    /**
     * Generate content using Groq API with structured prompt
     * @param {string} systemPrompt - System instructions for the agent
     * @param {string} userPrompt - User content/query
     * @param {object} options - Additional options (temperature, etc.)
     * @returns {Promise<string>} Generated text response
     */
    async generate(systemPrompt, userPrompt, options = {}) {
        try {
            const response = await this.groq.chat.completions.create({
                model: config.groq.model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                temperature: options.temperature || config.groq.temperature,
                max_tokens: options.maxOutputTokens || config.groq.maxOutputTokens,
            });

            return response.choices[0].message.content;
        } catch (error) {
            console.error('AI Generation Error:', error);
            throw new Error(`AI generation failed: ${error.message}`);
        }
    }

    /**
     * Generate structured JSON output
     * @param {string} systemPrompt - System instructions
     * @param {string} userPrompt - User content
     * @returns {Promise<object>} Parsed JSON response
     */
    async generateJSON(systemPrompt, userPrompt) {
        try {
            const jsonPrompt = `${systemPrompt}\n\nIMPORTANT: Respond ONLY with valid JSON. No markdown, no explanations.\n\n${userPrompt}`;
            const response = await this.generate(jsonPrompt, '', { temperature: 0.3 });

            // Clean response (remove markdown code blocks if present)
            let cleaned = response.trim();
            if (cleaned.startsWith('```json')) {
                cleaned = cleaned.replace(/```json\n?/g, '').replace(/```\n?/g, '');
            } else if (cleaned.startsWith('```')) {
                cleaned = cleaned.replace(/```\n?/g, '');
            }

            return JSON.parse(cleaned);
        } catch (error) {
            console.error('JSON Generation Error:', error);
            throw new Error(`JSON generation failed: ${error.message}`);
        }
    }
}

module.exports = new AIClient();
