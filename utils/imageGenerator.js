const fetch = require('node-fetch');

/**
 * Image Generator Utility
 * Generates educational images using Hugging Face with fallback to Pollinations.ai
 */
async function generate_image(prompt, imageName) {
    console.log('[Image Generator] Generating image...');

    // 1. Try Hugging Face first (if key exists)
    const HF_API_KEY = process.env.HF_API_KEY;

    if (HF_API_KEY && !HF_API_KEY.startsWith('hf_your')) {
        try {
            console.log('[Image Generator] Using Hugging Face API...');
            const MODEL_ID = "stabilityai/stable-diffusion-xl-base-1.0";
            const API_URL = `https://api-inference.huggingface.co/models/${MODEL_ID}`;

            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${HF_API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    inputs: prompt + ", educational, infographic style, clear, high quality, 4k, no text, vector art",
                    wait_for_model: true
                }),
            });

            if (response.ok) {
                const buffer = await response.buffer();
                const base64Image = buffer.toString('base64');
                return `data:image/jpeg;base64,${base64Image}`;
            } else {
                console.warn(`[Image Generator] HF Error: ${response.status} - Falling back...`);
            }
        } catch (error) {
            console.error('[Image Generator] HF Failed:', error.message);
        }
    }

    // 2. Fallback to Pollinations.ai (Free, No Key)
    try {
        console.log('[Image Generator] Using Fallback (Pollinations.ai)...');
        const encodedPrompt = encodeURIComponent(prompt + " educational infographic clean vector flat design");
        // Pollinations returns the image directly, we just return the URL
        // Adding a random seed to prevent caching
        const seed = Math.floor(Math.random() * 1000);
        return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&seed=${seed}`;
    } catch (error) {
        console.error('[Image Generator] Fallback Failed:', error);
        throw new Error("Failed to generate image with all providers");
    }
}

module.exports = { generate_image };
