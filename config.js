require('dotenv').config();

module.exports = {
  // Groq API Configuration
  groq: {
    apiKey: process.env.GROQ_API_KEY,
    model: 'llama-3.3-70b-versatile', // Fast and powerful free model
    temperature: 0.7,
    maxOutputTokens: 2048
  },

  // Server Configuration
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development'
  },

  // File Upload Configuration
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['application/pdf', 'text/plain'],
    uploadDir: './uploads'
  }
};
