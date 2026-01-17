require('dotenv').config();
const aiClient = require('./utils/aiClient');

async function test() {
    try {
        console.log('Testing AI Client...');
        const response = await aiClient.generate(
            'You are a helpful assistant.',
            'Say hello!'
        );
        console.log('Response:', response);
    } catch (error) {
        console.error('Test Failed:', error);
    }
}

test();
