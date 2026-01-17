// DOM Elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const textInput = document.getElementById('textInput');
const charCount = document.getElementById('charCount');
const processBtn = document.getElementById('processBtn');
const uploadSection = document.getElementById('uploadSection');
const processingStatus = document.getElementById('processingStatus');
const resultsSection = document.getElementById('resultsSection');
const newDocBtn = document.getElementById('newDocBtn');

// Tab elements
const tabBtns = document.querySelectorAll('.tab-btn');
const fileTab = document.getElementById('fileTab');
const textTab = document.getElementById('textTab');

// Output elements
const simplifiedOutput = document.getElementById('simplifiedOutput');
const deepDiveOutput = document.getElementById('deepDiveOutput');
const visualOutput = document.getElementById('visualOutput');
const flashcardsOutput = document.getElementById('flashcardsOutput');

// State
let selectedFile = null;
let inputText = '';
let activeTab = 'file';
let currentOutputs = null; // Store original outputs for translation

// Tab Switching
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;

        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (tab === 'file') {
            fileTab.classList.add('active');
            textTab.classList.remove('active');
            activeTab = 'file';
        } else {
            textTab.classList.add('active');
            fileTab.classList.remove('active');
            activeTab = 'text';
        }

        updateProcessButton();
    });
});

// Text Input Handler
if (textInput) {
    textInput.addEventListener('input', (e) => {
        inputText = e.target.value.trim();
        charCount.textContent = e.target.value.length;
        updateProcessButton();
    });
}

// File Upload Handlers
uploadArea.addEventListener('click', () => fileInput.click());

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('drag-over');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');

    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFileSelect(files[0]);
    }
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFileSelect(e.target.files[0]);
    }
});

function handleFileSelect(file) {
    const validTypes = ['application/pdf', 'text/plain'];
    if (!validTypes.includes(file.type)) {
        alert('Please upload a PDF or TXT file');
        return;
    }

    if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
    }

    selectedFile = file;

    uploadArea.classList.add('has-file');
    uploadArea.querySelector('.upload-title').textContent = file.name;
    uploadArea.querySelector('.upload-subtitle').textContent = `${(file.size / 1024).toFixed(1)} KB`;

    updateProcessButton();
}

function updateProcessButton() {
    if (activeTab === 'file') {
        processBtn.disabled = !selectedFile;
    } else {
        processBtn.disabled = inputText.length < 50;
    }
}

// Process Content
processBtn.addEventListener('click', async () => {
    processBtn.disabled = true;
    processBtn.querySelector('.btn-text').textContent = 'Processing...';
    processingStatus.style.display = 'block';

    try {
        let response;

        if (activeTab === 'file') {
            const formData = new FormData();
            formData.append('document', selectedFile);

            response = await fetch('/api/process', {
                method: 'POST',
                body: formData
            });
        } else {
            response = await fetch('/api/process-text', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: inputText })
            });
        }

        const result = await response.json();

        if (result.success) {
            currentOutputs = result.outputs;
            displayResults(result.outputs);
            setupActionButtons();
        } else {
            throw new Error(result.error || 'Processing failed');
        }

    } catch (error) {
        console.error('Error:', error);
        alert(`Error: ${error.message}`);

        processBtn.disabled = false;
        processBtn.querySelector('.btn-text').textContent = 'Generate Learning Stages';
        processingStatus.style.display = 'none';
    }
});

// Display Results
function displayResults(outputs) {
    // Simplified - 3-4 lines only
    simplifiedOutput.innerHTML = `<p>${outputs.simplified}</p>`;
    simplifiedOutput.dataset.originalText = outputs.simplified;

    // Deep-dive
    const deepDiveFormatted = outputs.deepDive
        .split('\n\n')
        .map(para => `<p>${para}</p>`)
        .join('');
    deepDiveOutput.innerHTML = deepDiveFormatted;
    deepDiveOutput.dataset.originalText = outputs.deepDive;

    // Visual - ONLY show image, no text
    if (outputs.visual) {
        const visualData = typeof outputs.visual === 'string'
            ? { text: outputs.visual, imageUrl: null }
            : outputs.visual;

        if (visualData.imageUrl) {
            // Show ONLY the image
            visualOutput.innerHTML = `<img src="${visualData.imageUrl}" alt="Educational Diagram">`;
        } else {
            // No image available - show placeholder
            visualOutput.innerHTML = `<div style="text-align: center; padding: 40px; color: var(--text-muted);">
                <p>📊 Generating visual diagram...</p>
                <p style="font-size: 0.9rem; margin-top: 10px;">Image generation in progress</p>
            </div>`;
        }
    }

    // Flashcards - exactly 4
    if (Array.isArray(outputs.flashcards)) {
        flashcardsOutput.innerHTML = outputs.flashcards.map((card, index) => `
            <div class="flashcard" data-index="${index}">
                <div class="flashcard-question">${card.question}</div>
                <div class="flashcard-answer">${card.answer}</div>
            </div>
        `).join('');

        // Store original for translation
        flashcardsOutput.dataset.originalCards = JSON.stringify(outputs.flashcards);
    }

    setTimeout(() => {
        uploadSection.style.display = 'none';
        processingStatus.style.display = 'none';
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }, 500);
}

// Setup Action Buttons
function setupActionButtons() {
    // Copy buttons
    document.querySelectorAll('.action-btn[data-action="copy"]').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const section = e.target.closest('.stage-card');
            const content = section.querySelector('.stage-content').innerText;

            try {
                await navigator.clipboard.writeText(content);
                btn.innerHTML = '<span>✅</span>';
                setTimeout(() => btn.innerHTML = '<span>📋</span>', 2000);
            } catch (err) {
                alert('Failed to copy');
            }
        });
    });

    // Like/Dislike buttons
    document.querySelectorAll('.action-btn[data-action="like"], .action-btn[data-action="dislike"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            btn.classList.toggle('active');
        });
    });

    // Share buttons
    document.querySelectorAll('.action-btn[data-action="share"]').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const section = e.target.closest('.stage-card');
            const content = section.querySelector('.stage-content').innerText;

            if (navigator.share) {
                try {
                    await navigator.share({
                        title: 'EduTransform AI',
                        text: content
                    });
                } catch (err) {
                    console.log('Share cancelled');
                }
            } else {
                alert('Sharing not supported on this browser');
            }
        });
    });

    // Language selection
    document.querySelectorAll('.language-select').forEach(select => {
        select.addEventListener('change', async (e) => {
            const section = e.target.dataset.section;
            const language = e.target.value;

            await translateSection(section, language);
        });
    });
}

// Translation function
async function translateSection(section, targetLang) {
    if (targetLang === 'en' || !currentOutputs) return;

    const langMap = {
        'mr': 'Marathi',
        'hi': 'Hindi'
    };

    try {
        let textToTranslate = '';
        let outputElement = null;

        if (section === 'simplified') {
            textToTranslate = currentOutputs.simplified;
            outputElement = simplifiedOutput;
        } else if (section === 'deepdive') {
            textToTranslate = currentOutputs.deepDive;
            outputElement = deepDiveOutput;
        } else if (section === 'flashcards') {
            // Translate flashcards
            const cards = currentOutputs.flashcards;
            const translatedCards = await Promise.all(cards.map(async card => {
                const translatedQ = await translateText(card.question, langMap[targetLang]);
                const translatedA = await translateText(card.answer, langMap[targetLang]);
                return { question: translatedQ, answer: translatedA };
            }));

            flashcardsOutput.innerHTML = translatedCards.map((card, index) => `
                <div class="flashcard" data-index="${index}">
                    <div class="flashcard-question">${card.question}</div>
                    <div class="flashcard-answer">${card.answer}</div>
                </div>
            `).join('');
            return;
        }

        if (textToTranslate && outputElement) {
            const translated = await translateText(textToTranslate, langMap[targetLang]);

            if (section === 'simplified') {
                outputElement.innerHTML = `<p>${translated}</p>`;
            } else {
                const formatted = translated.split('\n\n').map(para => `<p>${para}</p>`).join('');
                outputElement.innerHTML = formatted;
            }
        }
    } catch (error) {
        console.error('Translation error:', error);
        alert('Translation failed. Please try again.');
    }
}

// Translate text using Groq API
async function translateText(text, targetLanguage) {
    try {
        const response = await fetch('/api/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: text,
                targetLanguage: targetLanguage
            })
        });

        const result = await response.json();
        return result.translatedText || text;
    } catch (error) {
        console.error('Translation API error:', error);
        return text;
    }
}

// New Content Button
newDocBtn.addEventListener('click', () => {
    selectedFile = null;
    inputText = '';
    currentOutputs = null;

    uploadArea.classList.remove('has-file');
    uploadArea.querySelector('.upload-title').textContent = 'Drop your document here';
    uploadArea.querySelector('.upload-subtitle').textContent = 'or click to browse';

    if (textInput) {
        textInput.value = '';
        charCount.textContent = '0';
    }

    processBtn.disabled = true;
    processBtn.querySelector('.btn-text').textContent = 'Generate Learning Stages';

    simplifiedOutput.innerHTML = '';
    deepDiveOutput.innerHTML = '';
    visualOutput.innerHTML = '';
    flashcardsOutput.innerHTML = '';

    resultsSection.style.display = 'none';
    uploadSection.style.display = 'block';

    window.scrollTo({ top: 0, behavior: 'smooth' });
});
