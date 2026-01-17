const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const agentPipeline = require('../pipeline');
const config = require('../config');

const router = express.Router();

// Configure file upload
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const uploadDir = config.upload.uploadDir;
        try {
            await fs.mkdir(uploadDir, { recursive: true });
            cb(null, uploadDir);
        } catch (error) {
            cb(error);
        }
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: config.upload.maxFileSize
    },
    fileFilter: (req, file, cb) => {
        if (config.upload.allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF and TXT files are allowed.'));
        }
    }
});

/**
 * POST /api/process
 * Upload and process a document through the agent pipeline
 */
router.post('/process', upload.single('document'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No file uploaded'
            });
        }

        console.log(`\n[API] Processing file: ${req.file.originalname}`);

        // Process through agent pipeline
        const result = await agentPipeline.process(req.file.path);

        // Clean up uploaded file
        try {
            await fs.unlink(req.file.path);
        } catch (cleanupError) {
            console.error('File cleanup error:', cleanupError);
        }

        res.json(result);

    } catch (error) {
        console.error('[API] Processing error:', error);

        // Clean up file on error
        if (req.file) {
            try {
                await fs.unlink(req.file.path);
            } catch (cleanupError) {
                console.error('File cleanup error:', cleanupError);
            }
        }

        res.status(500).json({
            success: false,
            error: error.message || 'Processing failed'
        });
    }
});

/**
 * POST /api/process-text
 * Process text content directly through the agent pipeline
 */
router.post('/process-text', express.json(), async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || text.trim().length < 50) {
            return res.status(400).json({
                success: false,
                error: 'Text content must be at least 50 characters'
            });
        }

        console.log(`\n[API] Processing text input: ${text.length} characters`);

        // Create temporary file from text
        const tempDir = config.upload.uploadDir;
        await fs.mkdir(tempDir, { recursive: true });

        const tempFile = path.join(tempDir, `text-${Date.now()}.txt`);
        await fs.writeFile(tempFile, text);

        // Process through agent pipeline
        const result = await agentPipeline.process(tempFile);

        // Clean up temp file
        try {
            await fs.unlink(tempFile);
        } catch (cleanupError) {
            console.error('File cleanup error:', cleanupError);
        }

        res.json(result);

    } catch (error) {
        console.error('[API] Text processing error:', error);

        res.status(500).json({
            success: false,
            error: error.message || 'Processing failed'
        });
    }
});

/**
 * POST /api/translate
 * Translate text to target language using Groq
 */
router.post('/translate', express.json(), async (req, res) => {
    try {
        const { text, targetLanguage } = req.body;

        if (!text || !targetLanguage) {
            return res.status(400).json({
                success: false,
                error: 'Text and target language are required'
            });
        }

        const aiClient = require('../utils/aiClient');

        const systemPrompt = `You are a professional translator. Translate the given text to ${targetLanguage}. Maintain the same tone, style, and formatting. Only output the translated text, nothing else.`;

        const userPrompt = `Translate this text to ${targetLanguage}:\n\n${text}`;

        const translatedText = await aiClient.generate(systemPrompt, userPrompt);

        res.json({
            success: true,
            translatedText: translatedText.trim()
        });

    } catch (error) {
        console.error('[API] Translation error:', error);

        res.status(500).json({
            success: false,
            error: error.message || 'Translation failed'
        });
    }
});

/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/health', (req, res) => {
    res.json({
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
