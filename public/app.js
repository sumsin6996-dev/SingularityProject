// DOM Elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const processBtn = document.getElementById('processBtn');
const uploadSection = document.getElementById('uploadSection');
const agentStatus = document.getElementById('agentStatus');
const resultsSection = document.getElementById('resultsSection');
const newDocBtn = document.getElementById('newDocBtn');

// Output elements
const simplifiedOutput = document.getElementById('simplifiedOutput');
const visualOutput = document.getElementById('visualOutput');
const deepDiveOutput = document.getElementById('deepDiveOutput');

// State
let selectedFile = null;

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

    processBtn.disabled = false;
}

// Process Document
processBtn.addEventListener('click', async () => {
    if (!selectedFile) return;

    // Disable button
    processBtn.disabled = true;
    processBtn.querySelector('.btn-text').textContent = 'Processing...';

    // Show agent status
    agentStatus.style.display = 'block';

    // Animate agent status
    animateAgentPipeline();

    try {
        // Create form data
        const formData = new FormData();
        formData.append('document', selectedFile);

        // Send to API
        const response = await fetch('/api/process', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            // Mark all agents as complete
            document.querySelectorAll('.status-item').forEach(item => {
                item.classList.remove('active');
                item.classList.add('complete');
            });

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
        processBtn.querySelector('.btn-text').textContent = 'Process Document';
        agentStatus.style.display = 'none';
    }
});

// Animate Agent Pipeline
function animateAgentPipeline() {
    const agents = document.querySelectorAll('.status-item');

    // Reset all
    agents.forEach(item => {
        item.classList.remove('active', 'complete');
    });

    // Activate agents sequentially
    let currentAgent = 0;
    const interval = setInterval(() => {
        if (currentAgent > 0) {
            agents[currentAgent - 1].classList.remove('active');
            agents[currentAgent - 1].classList.add('complete');
        }

        if (currentAgent < agents.length) {
            agents[currentAgent].classList.add('active');
            currentAgent++;
        } else {
            clearInterval(interval);
        }
    }, 1500);
}

// Display Results
function displayResults(outputs) {
    // Convert markdown-like text to HTML
    simplifiedOutput.innerHTML = formatMarkdown(outputs.simplified);
    visualOutput.innerHTML = formatMarkdown(outputs.visual);
    deepDiveOutput.innerHTML = formatMarkdown(outputs.deepDive);

    // Hide upload section, show results
    setTimeout(() => {
        uploadSection.style.display = 'none';
        resultsSection.style.display = 'block';

        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }, 1000);
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

    // Code
    html = html.replace(/`(.*?)`/g, '<code>$1</code>');

    // Line breaks
    html = html.replace(/\n\n/g, '</p><p>');
    html = html.replace(/\n/g, '<br>');

    // Wrap in paragraph
    html = '<p>' + html + '</p>';

    // Lists (basic)
    html = html.replace(/<p>- (.*?)<br>/g, '<ul><li>$1</li>');
    html = html.replace(/<\/li><br>- /g, '</li><li>');
    html = html.replace(/<\/li><\/p>/g, '</li></ul></p>');

    return html;
}

// New Document Button
newDocBtn.addEventListener('click', () => {
    // Reset state
    selectedFile = null;

    // Reset UI
    uploadArea.classList.remove('has-file');
    uploadArea.querySelector('.upload-title').textContent = 'Drop your document here';
    uploadArea.querySelector('.upload-subtitle').textContent = 'or click to browse';

    processBtn.disabled = true;
    processBtn.querySelector('.btn-text').textContent = 'Process Document';

    agentStatus.style.display = 'none';

    // Clear outputs
    simplifiedOutput.innerHTML = '';
    visualOutput.innerHTML = '';
    deepDiveOutput.innerHTML = '';

    // Show upload section
    resultsSection.style.display = 'none';
    uploadSection.style.display = 'block';

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
