const path = require('path');
const fs = require('fs').promises;

/**
 * Image Generator Utility
 * Generates educational charts and diagrams using QuickChart.io (free API)
 */

async function generate_image(prompt, imageName) {
    console.log('[Image Generator] Generating chart/diagram...');
    console.log('[Image Generator] Prompt:', prompt.substring(0, 100) + '...');

    try {
        // Use QuickChart.io - completely free chart generation API
        // Creates flowcharts, mind maps, and diagrams

        // Extract key concepts from prompt for chart
        const concepts = extractConcepts(prompt);

        // Generate Mermaid diagram syntax
        const mermaidCode = generateMermaidDiagram(concepts, prompt);

        // Encode for QuickChart
        const encodedMermaid = encodeURIComponent(mermaidCode);

        // QuickChart URL (free, no API key needed)
        const chartUrl = `https://quickchart.io/chart?c=${encodedMermaid}&format=png&width=800&height=600`;

        console.log('[Image Generator] Chart URL generated successfully');

        return chartUrl;

    } catch (error) {
        console.error('[Image Generator] Error:', error);
        return null;
    }
}

function extractConcepts(prompt) {
    // Extract main concepts from prompt
    const words = prompt.split(/[,.:;]/).map(s => s.trim()).filter(s => s.length > 3);
    return words.slice(0, 6); // Top 6 concepts
}

function generateMermaidDiagram(concepts, prompt) {
    // Generate a simple flowchart or mind map
    const isProcess = prompt.toLowerCase().includes('process') || prompt.toLowerCase().includes('how');

    if (isProcess) {
        // Flowchart for processes
        return `graph TD
    A[${concepts[0] || 'Start'}] --> B[${concepts[1] || 'Process'}]
    B --> C[${concepts[2] || 'Analysis'}]
    C --> D[${concepts[3] || 'Result'}]
    style A fill:#6366f1
    style B fill:#8b5cf6
    style C fill:#06b6d4
    style D fill:#10b981`;
    } else {
        // Mind map for concepts
        return `graph LR
    A[${concepts[0] || 'Main Topic'}]
    A --> B[${concepts[1] || 'Concept 1'}]
    A --> C[${concepts[2] || 'Concept 2'}]
    A --> D[${concepts[3] || 'Concept 3'}]
    B --> E[${concepts[4] || 'Detail'}]
    C --> F[${concepts[5] || 'Detail'}]
    style A fill:#6366f1
    style B fill:#8b5cf6
    style C fill:#8b5cf6
    style D fill:#8b5cf6`;
    }
}

module.exports = { generate_image };
