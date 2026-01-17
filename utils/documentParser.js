const fs = require('fs').promises;
const path = require('path');
const pdfParse = require('pdf-parse');

class DocumentParser {
    /**
     * Parse document based on file type
     * @param {string} filePath - Path to the uploaded file
     * @returns {Promise<string>} Extracted text content
     */
    async parse(filePath) {
        const ext = path.extname(filePath).toLowerCase();

        switch (ext) {
            case '.pdf':
                return await this.parsePDF(filePath);
            case '.txt':
                return await this.parseText(filePath);
            default:
                throw new Error(`Unsupported file type: ${ext}`);
        }
    }

    /**
     * Extract text from PDF file
     * @param {string} filePath - Path to PDF file
     * @returns {Promise<string>} Extracted text
     */
    async parsePDF(filePath) {
        try {
            const dataBuffer = await fs.readFile(filePath);
            const data = await pdfParse(dataBuffer);
            return data.text;
        } catch (error) {
            console.error('PDF Parsing Error:', error);
            throw new Error(`Failed to parse PDF: ${error.message}`);
        }
    }

    /**
     * Read plain text file
     * @param {string} filePath - Path to text file
     * @returns {Promise<string>} File content
     */
    async parseText(filePath) {
        try {
            const content = await fs.readFile(filePath, 'utf-8');
            return content.trim();
        } catch (error) {
            console.error('Text Parsing Error:', error);
            throw new Error(`Failed to parse text file: ${error.message}`);
        }
    }

    /**
     * Validate and preprocess document text
     * @param {string} text - Raw extracted text
     * @returns {string} Cleaned text
     */
    preprocess(text) {
        // Remove excessive whitespace
        let cleaned = text.replace(/\s+/g, ' ');

        // Remove special characters that might interfere with processing
        cleaned = cleaned.replace(/[\x00-\x1F\x7F-\x9F]/g, '');

        // Trim
        cleaned = cleaned.trim();

        // Validate minimum length
        if (cleaned.length < 50) {
            throw new Error('Document too short. Please provide a document with at least 50 characters.');
        }

        return cleaned;
    }
}

module.exports = new DocumentParser();
