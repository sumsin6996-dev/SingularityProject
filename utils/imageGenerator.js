const fetch = require("node-fetch");

console.error("🔥 USING HF ROUTER IMAGE GENERATOR 🔥");

/**
 * Hugging Face Image Generator (FIXED)
 * - Uses HF router endpoint
 * - Binary-safe (no content-type guessing)
 * - Base64-only output
 * - No fallbacks, no URLs
 */
async function generate_image(prompt, imageName = "generated") {
    const HF_API_KEY = process.env.HUGGING_FACE_API_KEY;

    if (!HF_API_KEY) {
        throw new Error(
            "[Image Generator] ❌ HUGGING_FACE_API_KEY is missing"
        );
    }

    // Use the same model style that already works for you
    const MODEL_ID = process.env.IMAGE_MODEL || "black-forest-labs/FLUX.1-schnell";
    const API_URL = `https://router.huggingface.co/hf-inference/models/${MODEL_ID}`;

    const payload = {
        inputs: `${prompt}, educational infographic, clean vector style, flat design, high clarity`,
        options: {
            wait_for_model: true
        }
    };

    console.log("[Image Generator] Generating image via HF router...");
    console.log("[Image Generator] Model:", MODEL_ID);

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${HF_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
            `[Image Generator] ❌ HF image error ${response.status}: ${errorText}`
        );
    }

    // IMPORTANT: Always treat response as binary
    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    console.log("[Image Generator] ✅ Image generated successfully");

    return `data:image/png;base64,${base64}`;
}

module.exports = { generate_image };