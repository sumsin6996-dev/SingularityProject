const path = require('path');
const fs = require('fs').promises;
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

/**
 * Image Generator Utility
 * Generates educational infographic images using Python + Pillow or external API
 */

async function generate_image(prompt, imageName) {
    console.log('[Image Generator] Generating educational infographic...');
    console.log('[Image Generator] Prompt:', prompt.substring(0, 100) + '...');

    try {
        // Create output directory
        const outputDir = path.join(__dirname, '..', 'public', 'generated-images');
        await fs.mkdir(outputDir, { recursive: true });

        // Generate unique filename
        const timestamp = Date.now();
        const filename = `${imageName}_${timestamp}.png`;
        const filepath = path.join(outputDir, filename);

        // For MVP: Create a simple placeholder image using Python PIL
        // In production: Replace with actual API call (DALL-E, Stable Diffusion, etc.)

        const pythonScript = `
import sys
from PIL import Image, ImageDraw, ImageFont
import textwrap

# Create image
width, height = 800, 600
img = Image.new('RGB', (width, height), color='#1a1a2e')

draw = ImageDraw.Draw(img)

# Try to use a font, fallback to default if not available
try:
    title_font = ImageFont.truetype("arial.ttf", 32)
    text_font = ImageFont.truetype("arial.ttf", 16)
except:
    title_font = ImageFont.load_default()
    text_font = ImageFont.load_default()

# Draw title
title = "Educational Infographic"
draw.text((50, 50), title, fill='#6366f1', font=title_font)

# Draw prompt text (wrapped)
prompt_text = """${prompt.replace(/"/g, '\\"').substring(0, 300)}"""
wrapped_text = textwrap.fill(prompt_text, width=60)
draw.text((50, 120), wrapped_text, fill='#e0e0e0', font=text_font)

# Draw decorative elements
draw.rectangle([50, 100, 750, 102], fill='#8b5cf6')
draw.ellipse([650, 450, 750, 550], fill='#06b6d4', outline='#0891b2', width=3)

# Save image
img.save('${filepath.replace(/\\/g, '\\\\')}')
print('SUCCESS')
`;

        // Write Python script to temp file
        const scriptPath = path.join(outputDir, `generate_${timestamp}.py`);
        await fs.writeFile(scriptPath, pythonScript);

        // Execute Python script
        try {
            const { stdout, stderr } = await execPromise(`python "${scriptPath}"`);

            if (stdout.includes('SUCCESS')) {
                console.log('[Image Generator] Image generated successfully');

                // Clean up script
                await fs.unlink(scriptPath).catch(() => { });

                // Return web-accessible path
                return `/generated-images/${filename}`;
            } else {
                throw new Error('Python script failed');
            }
        } catch (pythonError) {
            console.log('[Image Generator] Python not available, using fallback...');

            // Fallback: Return null and show text only
            await fs.unlink(scriptPath).catch(() => { });
            return null;
        }

    } catch (error) {
        console.error('[Image Generator] Error:', error.message);
        return null;
    }
}

module.exports = { generate_image };
