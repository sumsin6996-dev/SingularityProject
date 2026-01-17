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

// Tab Switching
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;

        // Update active tab button
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Update active tab content
        if (tab === 'file') {
            fileTab.classList.add('active');
            textTab.classList.remove('active');
            activeTab = 'file';
        } else {
            textTab.classList.add('active');
            fileTab.classList.remove('active');
            activeTab = 'text';
        }

        // Update process button state
        updateProcessButton();
    });
});

// Text Input Handler
textInput.addEventListener('input', (e) => {
    inputText = e.target.value.trim();
    charCount.textContent = e.target.value.length;
    updateProcessButton();
});

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
    // Validate file type
    const validTypes = ['application/pdf', 'text/plain'];
    if (!validTypes.includes(file.type)) {
        alert('Please upload a PDF or TXT file');
        return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
    }

    selectedFile = file;

    // Update UI
    uploadArea.classList.add('has-file');
    uploadArea.querySelector('.upload-title').textContent = file.name;
    uploadArea.querySelector('.upload-subtitle').textContent = `${(file.size / 1024).toFixed(1)} KB`;

    updateProcessButton();
}

function updateProcessButton() {
    if (activeTab === 'file') {
        processBtn.disabled = !selectedFile;
    } else {
        processBtn.disabled = inputText.length < 50; // Minimum 50 characters
    }
}

// Process Content
processBtn.addEventListener('click', async () => {
    // Disable button
    processBtn.disabled = true;
    processBtn.querySelector('.btn-text').textContent = 'Processing...';

    // Show processing status
    processingStatus.style.display = 'block';

    try {
        let response;

        if (activeTab === 'file') {
            // Process file
            const formData = new FormData();
            formData.append('document', selectedFile);

            response = await fetch('/api/process', {
                method: 'POST',
                body: formData
            });
        } else {
            // Process text
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
            // Display results
            displayResults(result.outputs);
        } else {
            throw new Error(result.error || 'Processing failed');
        }

    } catch (error) {
        console.error('Error:', error);
        alert(`Error: ${error.message}`);

        // Reset UI
        processBtn.disabled = false;
        processBtn.querySelector('.btn-text').textContent = 'Generate Learning Stages';
        processingStatus.style.display = 'none';
    }
});

// Display Results
function displayResults(outputs) {
    // Render simplified explanation
    simplifiedOutput.innerHTML = `<p>${outputs.simplified}</p>`;

    // Render deep-dive explanation (preserve paragraph breaks)
    const deepDiveFormatted = outputs.deepDive
        .split('\n\n')
        .map(para => `<p>${para}</p>`)
        .join('');
    deepDiveOutput.innerHTML = deepDiveFormatted;

    // Render visual learning
    if (outputs.visual) {
        const visualData = typeof outputs.visual === 'string'
            ? { text: outputs.visual, imageUrl: null }
            : outputs.visual;

        let visualHTML = formatMarkdown(visualData.text);

        // Add image if available
        if (visualData.imageUrl) {
            visualHTML += `<div class="visual-diagram"><img src="${visualData.imageUrl}" alt="Visual Diagram"></div>`;
        }

        visualOutput.innerHTML = visualHTML;
        visualOutput.classList.add('visual-content');
    }

    // Render flashcards as visual cards
    if (Array.isArray(outputs.flashcards)) {
        flashcardsOutput.innerHTML = outputs.flashcards.map(card => `
            <div class="flashcard">
                <div class="flashcard-question">${card.question}</div>
                <div class="flashcard-answer">${card.answer}</div>
            </div>
        `).join('');
    } else {
        // Fallback if flashcards are in text format
        flashcardsOutput.innerHTML = formatMarkdown(outputs.flashcards);
    }

    // Hide upload section, show results
    setTimeout(() => {
        uploadSection.style.display = 'none';
        processingStatus.style.display = 'none';
        resultsSection.style.display = 'block';

        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }, 500);
}

// Simple Markdown Formatter
function formatMarkdown(text) {
    if (!text) return '';

    let html = text;

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Inline code
    html = html.replace(/`(.*?)`/g, '<code>$1</code>');

    // Line breaks and paragraphs
    html = html.replace(/\n\n/g, '</p><p>');
    html = html.replace(/\n/g, '<br>');

    // Lists
    html = html.replace(/<p>- (.*?)<br>/g, '<ul><li>$1</li>');
    html = html.replace(/<\/li><br>- /g, '</li><li>');
    html = html.replace(/<\/li><\/p>/g, '</li></ul></p>');

    // Nested lists
    html = html.replace(/<li>  - (.*?)<\/li>/g, '<li><ul><li>$1</li></ul></li>');

    return html;
}

// New Content Button
newDocBtn.addEventListener('click', () => {
    // Reset state
    selectedFile = null;
    inputText = '';

    // Reset file upload UI
    uploadArea.classList.remove('has-file');
    uploadArea.querySelector('.upload-title').textContent = 'Drop your document here';
    uploadArea.querySelector('.upload-subtitle').textContent = 'or click to browse';

    // Reset text input
    textInput.value = '';
    charCount.textContent = '0';

    // Reset button
    processBtn.disabled = true;
    processBtn.querySelector('.btn-text').textContent = 'Generate Learning Stages';

    // Clear outputs
    simplifiedOutput.innerHTML = '';
    deepDiveOutput.innerHTML = '';
    visualOutput.innerHTML = '';
    flashcardsOutput.innerHTML = '';

    // Show upload section
    resultsSection.style.display = 'none';
    uploadSection.style.display = 'block';

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
