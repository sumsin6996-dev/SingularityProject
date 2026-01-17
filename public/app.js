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
const visualOutput = document.getElementById('visualOutput');
const videosOutput = document.getElementById('videosOutput');
const flashcardsOutput = document.getElementById('flashcardsOutput');
const simplifiedOutput = document.getElementById('simplifiedOutput');
const deepDiveOutput = document.getElementById('deepDiveOutput');

// Chatbot elements
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const chatSendBtn = document.getElementById('chatSendBtn');
const chatVoiceBtn = document.getElementById('chatVoiceBtn');
const chatAttachBtn = document.getElementById('chatAttachBtn');

// Text voice button
const textVoiceBtn = document.getElementById('textVoiceBtn');

// Modal elements
const fileUploadModal = document.getElementById('fileUploadModal');
const modalClose = document.getElementById('modalClose');
const modalCancel = document.getElementById('modalCancel');
const modalUpload = document.getElementById('modalUpload');
const uploadAreaModal = document.getElementById('uploadAreaModal');
const chatFileInput = document.getElementById('chatFileInput');
const selectedFileName = document.getElementById('selectedFileName');

// State
let selectedFile = null;
let inputText = '';
let activeTab = 'file';
let currentOutputs = null;
let isRecording = false;
let isTextRecording = false;
let recognition = null;
let textRecognition = null;
let chatAttachedFile = null;

// Language tracking for TTS
let currentLanguages = {
    simplified: 'en',
    deepdive: 'en',
    flashcards: 'en'
};

// Toggle button handlers
document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        btn.classList.toggle('active');
    });
});

// Tab Switching
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        activeTab = tab;

        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (tab === 'file') {
            fileTab.classList.add('active');
            textTab.classList.remove('active');
        } else {
            fileTab.classList.remove('active');
            textTab.classList.add('active');
        }

        updateProcessButton();
    });
});

// File Upload
uploadArea.addEventListener('click', () => fileInput.click());

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = 'var(--primary)';
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = 'var(--border)';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = 'var(--border)';
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) handleFileSelect(file);
});

function handleFileSelect(file) {
    if (file.size > 10 * 1024 * 1024) {
        alert('File too large. Max 10MB.');
        return;
    }
    selectedFile = file;
    uploadArea.querySelector('.upload-title').textContent = file.name;
    updateProcessButton();

    // Activate starfield when file is selected
    document.body.classList.add('upload-active');
}

// Text Input
textInput.addEventListener('input', (e) => {
    inputText = e.target.value;
    charCount.textContent = inputText.length;
    updateProcessButton();
});

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

    // Activate starfield during processing
    document.body.classList.add('processing-active');

    const selectedOutputs = {
        visual: document.querySelector('.toggle-btn[data-output="visual"]').classList.contains('active'),
        videos: document.querySelector('.toggle-btn[data-output="videos"]').classList.contains('active'),
        flashcards: document.querySelector('.toggle-btn[data-output="flashcards"]').classList.contains('active'),
        simplified: document.querySelector('.toggle-btn[data-output="simplified"]').classList.contains('active'),
        deepDive: document.querySelector('.toggle-btn[data-output="deepdive"]').classList.contains('active')
    };

    try {
        let response;

        if (activeTab === 'file') {
            const formData = new FormData();
            formData.append('document', selectedFile);
            formData.append('selectedOutputs', JSON.stringify(selectedOutputs));

            response = await fetch('/api/process', {
                method: 'POST',
                body: formData
            });
        } else {
            response = await fetch('/api/process-text', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: inputText,
                    selectedOutputs: selectedOutputs
                })
            });
        }

        const result = await response.json();

        if (result.success) {
            currentOutputs = result.outputs;
            displayResults(result.outputs, selectedOutputs);
            setupActionButtons();
        } else {
            throw new Error(result.error || 'Processing failed');
        }

    } catch (error) {
        console.error('Error:', error);
        alert(`Error: ${error.message}`);

        processBtn.disabled = false;
        processBtn.querySelector('.btn-text').textContent = 'Generate Learning Experience';
        processingStatus.style.display = 'none';

        // Deactivate starfield on error
        document.body.classList.remove('upload-active', 'processing-active');
    }
});

// Display Results
function displayResults(outputs, selectedOutputs) {
    // Visual
    if (selectedOutputs.visual && outputs.visual) {
        document.querySelector('.visual-section').style.display = 'block';
        const visualData = typeof outputs.visual === 'string' ? { text: outputs.visual, imageUrl: null } : outputs.visual;

        visualOutput.innerHTML = '';

        if (visualData.imageUrl) {
            // Show loading state
            visualOutput.innerHTML = `<div class="visual-loading">
                <div class="spinner"></div>
                <p>Rendering Infographic...</p>
            </div>`;

            const img = new Image();
            img.onload = () => {
                visualOutput.innerHTML = '';
                visualOutput.appendChild(img);
            };
            img.onerror = () => {
                visualOutput.innerHTML = `<div class="error-box">
                    <p>❌ Failed to load image</p>
                    <p class="error-detail">The image could not be loaded.</p>
                </div>`;
            };

            img.src = visualData.imageUrl;
            img.alt = "Educational Infographic";
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
            img.style.borderRadius = '8px';

        } else if (visualData.type === 'error' || !visualData.imageUrl) {
            visualOutput.innerHTML = `<div class="error-box">
                <p>⚠️ Image Generation Failed</p>
                <p class="error-detail">Unable to generate visual content. Please try again.</p>
            </div>`;
        }
    } else {
        document.querySelector('.visual-section').style.display = 'none';
    }

    // Videos - Embed YouTube iframes with clickable overlay
    if (selectedOutputs.videos && outputs.videos && Array.isArray(outputs.videos)) {
        document.querySelector('.videos-section').style.display = 'block';
        videosOutput.innerHTML = outputs.videos.map(video => {
            const youtubeUrl = `https://www.youtube.com/watch?v=${video.id}`;

            return `
                <div class="video-embed-card">
                    <div class="video-iframe-container">
                        <iframe 
                            src="https://www.youtube.com/embed/${video.id}" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen
                            loading="lazy">
                        </iframe>
                        <a href="${youtubeUrl}" target="_blank" class="video-overlay" title="Open on YouTube">
                            <span class="youtube-icon">▶️ Watch on YouTube</span>
                        </a>
                    </div>
                    <div class="video-info">
                        <div class="video-title">${video.title}</div>
                        <div class="video-meta">
                            <span class="video-level">${video.level}</span>
                            <span>⏱️ ${video.duration}</span>
                            <span>📺 ${video.channel}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    } else {
        document.querySelector('.videos-section').style.display = 'none';
    }

    // Flashcards as vertical cards
    if (selectedOutputs.flashcards && outputs.flashcards) {
        document.querySelector('.flashcards-section').style.display = 'block';
        if (Array.isArray(outputs.flashcards)) {
            flashcardsOutput.innerHTML = `
                <div class="flashcards-grid">
                    ${outputs.flashcards.map(card => `
                        <div class="flashcard">
                            <div class="flashcard-question">${card.question}</div>
                            <div class="flashcard-answer">${card.answer}</div>
                        </div>
                    `).join('')}
                </div>
            `;
            flashcardsOutput.dataset.originalCards = JSON.stringify(outputs.flashcards);
        }
    } else {
        document.querySelector('.flashcards-section').style.display = 'none';
    }

    // Simplified & Deep-Dive
    if (selectedOutputs.simplified && outputs.simplified) {
        simplifiedOutput.innerHTML = `<p>${outputs.simplified}</p>`;
        simplifiedOutput.dataset.originalText = outputs.simplified;
    }

    if (selectedOutputs.deepDive && outputs.deepDive) {
        const deepDiveFormatted = outputs.deepDive.split('\n\n').map(para => `<p>${para}</p>`).join('');
        deepDiveOutput.innerHTML = deepDiveFormatted;
        deepDiveOutput.dataset.originalText = outputs.deepDive;
    }

    setTimeout(() => {
        uploadSection.style.display = 'none';
        processingStatus.style.display = 'none';
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth' });

        // Deactivate starfield when results are displayed
        document.body.classList.remove('upload-active', 'processing-active');

        // Save results to sessionStorage for persistence across page navigation
        sessionStorage.setItem('clarify_results', JSON.stringify({
            outputs: outputs,
            selectedOutputs: selectedOutputs,
            timestamp: Date.now()
        }));
    }, 500);
}

// Setup Action Buttons
function setupActionButtons() {
    document.querySelectorAll('.action-btn[data-action="copy"]').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const section = btn.dataset.section;
            let content = '';

            if (section === 'visual') content = visualOutput.innerText || 'Visual content';
            else if (section === 'simplified') content = simplifiedOutput.innerText;
            else if (section === 'deepdive') content = deepDiveOutput.innerText;

            try {
                await navigator.clipboard.writeText(content);
                btn.innerHTML = '<span>✅</span>';
                setTimeout(() => btn.innerHTML = '<span>📋</span>', 2000);
            } catch (err) {
                alert('Failed to copy');
            }
        });
    });

    document.querySelectorAll('.action-btn[data-action="share"]').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const section = e.target.closest('.stage-card');
            const content = section.querySelector('.stage-content').innerText;

            if (navigator.share) {
                try {
                    await navigator.share({ title: 'Clarify', text: content });
                } catch (err) {
                    console.log('Share cancelled');
                }
            } else {
                alert('Sharing not supported');
            }
        });
    });

    // Text-to-Speech functionality
    let currentSpeech = null;
    let currentSpeakButton = null;

    document.querySelectorAll('.action-btn[data-action="speak"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const section = btn.dataset.section;
            let content = '';
            let lang = 'en-US'; // Default language

            if (section === 'simplified') {
                content = simplifiedOutput.innerText;
                // Set language based on current translation
                if (currentLanguages.simplified === 'hi') lang = 'hi-IN';
                else if (currentLanguages.simplified === 'mr') lang = 'mr-IN';
            } else if (section === 'deepdive') {
                content = deepDiveOutput.innerText;
                if (currentLanguages.deepDive === 'hi') lang = 'hi-IN';
                else if (currentLanguages.deepDive === 'mr') lang = 'mr-IN';
            }

            if (!content) {
                alert('No content to read');
                return;
            }

            // If already speaking, stop
            if (window.speechSynthesis.speaking) {
                window.speechSynthesis.cancel();

                // Reset previous button
                if (currentSpeakButton) {
                    currentSpeakButton.querySelector('.speaker-icon').textContent = '🔊';
                    currentSpeakButton.classList.remove('speaking');
                }

                // If clicking the same button, just stop
                if (currentSpeakButton === btn) {
                    currentSpeakButton = null;
                    return;
                }
            }

            // Start new speech
            const utterance = new SpeechSynthesisUtterance(content);
            utterance.lang = lang; // Set language
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;

            // Update button state
            btn.querySelector('.speaker-icon').textContent = '⏸️';
            btn.classList.add('speaking');
            currentSpeakButton = btn;

            // Handle speech end
            utterance.onend = () => {
                btn.querySelector('.speaker-icon').textContent = '🔊';
                btn.classList.remove('speaking');
                currentSpeakButton = null;
            };

            // Handle errors
            utterance.onerror = (event) => {
                console.error('Speech error:', event);
                btn.querySelector('.speaker-icon').textContent = '🔊';
                btn.classList.remove('speaking');
                currentSpeakButton = null;
            };

            window.speechSynthesis.speak(utterance);
            currentSpeech = utterance;
        });
    });

    document.querySelectorAll('.language-select').forEach(select => {
        select.addEventListener('change', async (e) => {
            await translateSection(e.target.dataset.section, e.target.value);
        });
    });
}

// Translation
async function translateSection(section, language) {
    // Update current language tracking
    currentLanguages[section] = language;

    if (language === 'en') {
        if (section === 'simplified') {
            simplifiedOutput.innerHTML = `<p>${simplifiedOutput.dataset.originalText}</p>`;
        } else if (section === 'deepdive') {
            const formatted = deepDiveOutput.dataset.originalText.split('\n\n').map(p => `<p>${p}</p>`).join('');
            deepDiveOutput.innerHTML = formatted;
        } else if (section === 'flashcards') {
            const cards = JSON.parse(flashcardsOutput.dataset.originalCards);
            flashcardsOutput.innerHTML = `
                <div class="flashcards-grid">
                    ${cards.map(card => `
                        <div class="flashcard">
                            <div class="flashcard-question">${card.question}</div>
                            <div class="flashcard-answer">${card.answer}</div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
        return;
    }

    try {
        let textToTranslate = '';

        if (section === 'simplified') {
            textToTranslate = simplifiedOutput.dataset.originalText;
        } else if (section === 'deepdive') {
            textToTranslate = deepDiveOutput.dataset.originalText;
        } else if (section === 'flashcards') {
            const cards = JSON.parse(flashcardsOutput.dataset.originalCards);
            textToTranslate = cards.map(c => `Q: ${c.question}\nA: ${c.answer}`).join('\n\n');
        }

        const response = await fetch('/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: textToTranslate,
                targetLanguage: language
            })
        });

        const result = await response.json();

        if (result.success) {
            if (section === 'simplified') {
                simplifiedOutput.innerHTML = `<p>${result.translatedText}</p>`;
            } else if (section === 'deepdive') {
                const formatted = result.translatedText.split('\n\n').map(p => `<p>${p}</p>`).join('');
                deepDiveOutput.innerHTML = formatted;
            } else if (section === 'flashcards') {
                const lines = result.translatedText.split('\n\n');
                const translatedCards = lines.map(line => {
                    const [q, a] = line.split('\nA: ');
                    return {
                        question: q.replace('Q: ', ''),
                        answer: a
                    };
                });
                flashcardsOutput.innerHTML = `
                    <div class="flashcards-grid">
                        ${translatedCards.map(card => `
                            <div class="flashcard">
                                <div class="flashcard-question">${card.question}</div>
                                <div class="flashcard-answer">${card.answer}</div>
                            </div>
                        `).join('')}
                    </div>
                `;
            }
        } else {
            alert('Translation failed: ' + (result.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Translation error:', error);
        alert('Translation failed. Please try again.');
    }
}

// Chatbot
chatSendBtn.addEventListener('click', sendChatMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendChatMessage();
});

async function sendChatMessage() {
    const question = chatInput.value.trim();
    if (!question) return;

    addChatMessage(question, 'user');
    chatInput.value = '';

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                question,
                context: currentOutputs
            })
        });

        const result = await response.json();
        if (result.success) {
            addChatMessage(result.answer, 'bot');
        } else {
            addChatMessage('Sorry, I encountered an error.', 'bot');
        }
    } catch (error) {
        console.error('Chat error:', error);
        addChatMessage('Sorry, I encountered an error.', 'bot');
    }
}

function addChatMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}-message`;
    messageDiv.innerHTML = `<p>${text}</p>`;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Voice Input (Web Speech API)
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        chatInput.value = transcript;
        isRecording = false;
        chatVoiceBtn.classList.remove('recording');
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        isRecording = false;
        chatVoiceBtn.classList.remove('recording');
        alert('Voice input failed. Please try again or use text input.');
    };

    recognition.onend = () => {
        isRecording = false;
        chatVoiceBtn.classList.remove('recording');
    };

    chatVoiceBtn.addEventListener('click', () => {
        if (isRecording) {
            recognition.stop();
        } else {
            try {
                recognition.start();
                isRecording = true;
                chatVoiceBtn.classList.add('recording');
            } catch (error) {
                console.error('Failed to start recognition:', error);
                alert('Voice input is not available. Please use text input.');
            }
        }
    });
} else {
    chatVoiceBtn.style.display = 'none';
}

// Voice Input for Text Tab
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    textRecognition = new SpeechRecognition();
    textRecognition.continuous = false;
    textRecognition.interimResults = false;
    textRecognition.lang = 'en-US';

    textRecognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        textInput.value += (textInput.value ? ' ' : '') + transcript;
        inputText = textInput.value;
        charCount.textContent = inputText.length;
        updateProcessButton();
        isTextRecording = false;
        textVoiceBtn.classList.remove('recording');
    };

    textRecognition.onerror = (event) => {
        console.error('Text speech recognition error:', event.error);
        isTextRecording = false;
        textVoiceBtn.classList.remove('recording');
        alert('Voice input failed. Please try again or use text input.');
    };

    textRecognition.onend = () => {
        isTextRecording = false;
        textVoiceBtn.classList.remove('recording');
    };

    textVoiceBtn.addEventListener('click', () => {
        if (isTextRecording) {
            textRecognition.stop();
        } else {
            try {
                textRecognition.start();
                isTextRecording = true;
                textVoiceBtn.classList.add('recording');
            } catch (error) {
                console.error('Failed to start text recognition:', error);
                alert('Voice input is not available. Please use text input.');
            }
        }
    });
} else {
    textVoiceBtn.style.display = 'none';
}

// File Upload Modal
chatAttachBtn.addEventListener('click', () => {
    fileUploadModal.style.display = 'flex';
});

modalClose.addEventListener('click', () => {
    fileUploadModal.style.display = 'none';
    chatAttachedFile = null;
    selectedFileName.textContent = '';
    modalUpload.disabled = true;
});

modalCancel.addEventListener('click', () => {
    fileUploadModal.style.display = 'none';
    chatAttachedFile = null;
    selectedFileName.textContent = '';
    modalUpload.disabled = true;
});

uploadAreaModal.addEventListener('click', () => chatFileInput.click());

chatFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        chatAttachedFile = file;
        selectedFileName.textContent = `Selected: ${file.name}`;
        modalUpload.disabled = false;
    }
});

modalUpload.addEventListener('click', () => {
    if (chatAttachedFile) {
        addChatMessage(`📎 Uploaded: ${chatAttachedFile.name}`, 'user');
        fileUploadModal.style.display = 'none';
        chatAttachedFile = null;
        selectedFileName.textContent = '';
        modalUpload.disabled = true;

        // For now, just acknowledge the upload
        setTimeout(() => {
            addChatMessage('File received! You can ask questions about it.', 'bot');
        }, 500);
    }
});

// New Document
newDocBtn.addEventListener('click', () => {
    resultsSection.style.display = 'none';
    uploadSection.style.display = 'block';
    selectedFile = null;
    inputText = '';
    textInput.value = '';
    fileInput.value = '';
    charCount.textContent = '0';
    uploadArea.querySelector('.upload-title').textContent = 'Drop your document here';
    processBtn.querySelector('.btn-text').textContent = 'Generate Learning Experience';
    updateProcessButton();

    // Clear saved results from sessionStorage
    sessionStorage.removeItem('clarify_results');

    // Deactivate starfield when starting new document
    document.body.classList.remove('upload-active', 'processing-active');
});

// Markdown Formatter
function formatMarkdown(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/^(.+)$/gm, '<p>$1</p>');
}

// Initial Setup
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('fileInput').value = '';
    document.getElementById('textInput').value = '';

    document.querySelectorAll('.language-select').forEach(select => {
        select.value = 'en';
    });

    // Restore results from sessionStorage if available
    const savedResults = sessionStorage.getItem('clarify_results');
    if (savedResults) {
        try {
            const { outputs, selectedOutputs, timestamp } = JSON.parse(savedResults);

            // Check if results are less than 24 hours old
            const hoursSinceCreation = (Date.now() - timestamp) / (1000 * 60 * 60);
            if (hoursSinceCreation < 24) {
                // Restore the results
                currentOutputs = outputs;
                displayResults(outputs, selectedOutputs);
                setupActionButtons();

                console.log('Results restored from session');
            } else {
                // Clear old results
                sessionStorage.removeItem('clarify_results');
            }
        } catch (error) {
            console.error('Error restoring results:', error);
            sessionStorage.removeItem('clarify_results');
        }
    }
});
