# Multi-Agent Educational Transformation System

A sequential 4-agent pipeline that transforms educational documents into three distinct learning representations, demonstrating true agentic AI through cognitive task decomposition.

## 🎯 Overview

This system uses four specialized AI agents powered by Google Gemini to transform any educational document (PDF or text) into three learning formats:

1. **Simplified Explanation** - Beginner-friendly with analogies and examples
2. **Visual Format** - Scannable bullet points and hierarchical structure
3. **Deep-Dive Analysis** - Advanced technical insights and implications

## 🤖 The Four Agents

### Agent 1: Document Analyzer
- **Responsibility**: Extract and structure core knowledge from input document
- **Input**: Raw document text
- **Output**: Structured knowledge graph with concepts, relationships, and complexity levels

### Agent 2: Simplification Specialist
- **Responsibility**: Transform complex concepts into accessible explanations
- **Input**: Knowledge graph
- **Output**: Beginner-friendly explanation with analogies

### Agent 3: Visual Synthesizer
- **Responsibility**: Restructure information into scannable formats
- **Input**: Knowledge graph
- **Output**: Hierarchical bullet points and quick-reference sections

### Agent 4: Deep-Dive Expander
- **Responsibility**: Generate advanced analysis and extended insights
- **Input**: Knowledge graph
- **Output**: Technical depth with implications and edge cases

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Configure environment**:
```bash
# Copy the example env file
copy .env.example .env

# Edit .env and add your Gemini API key
# GEMINI_API_KEY=your_actual_api_key_here
```

3. **Start the server**:
```bash
npm run dev
```

4. **Open in browser**:
```
http://localhost:3000
```

## 📁 Project Structure

```
SS/
├── agents/                      # Four AI agents
│   ├── documentAnalyzer.js     # Agent 1: Knowledge extraction
│   ├── simplificationSpecialist.js  # Agent 2: Beginner explanations
│   ├── visualSynthesizer.js    # Agent 3: Visual formatting
│   └── deepDiveExpander.js     # Agent 4: Advanced analysis
├── utils/                       # Utilities
│   ├── aiClient.js             # Gemini API wrapper
│   ├── documentParser.js       # PDF/text parsing
│   └── knowledgeGraph.js       # Knowledge graph data structure
├── routes/                      # API endpoints
│   └── api.js                  # Document processing routes
├── public/                      # Frontend
│   ├── index.html              # Main UI
│   ├── styles.css              # Premium dark mode design
│   └── app.js                  # Frontend logic
├── pipeline.js                  # Agent orchestration
├── server.js                    # Express server
├── config.js                    # Configuration
└── package.json                 # Dependencies
```

## 💡 How It Works

1. **User uploads** a PDF or text document
2. **Agent 1** analyzes the document and builds a knowledge graph
3. **Agents 2, 3, 4** run in parallel, each transforming the knowledge graph into their respective formats
4. **Results** are displayed side-by-side for comparison

## 🎨 Features

- ✅ **True Agentic AI** - Each agent makes autonomous decisions about structure, analogies, and depth
- ✅ **Sequential Pipeline** - Clear execution flow from analysis to transformation
- ✅ **Premium UI** - Modern dark mode design with smooth animations
- ✅ **Real-time Status** - Visual feedback showing agent pipeline progress
- ✅ **Responsive Design** - Works on desktop and mobile
- ✅ **No Database Required** - Stateless processing for MVP simplicity

## 🧪 Testing

Upload a sample educational document about any topic (e.g., "Photosynthesis", "Machine Learning", "Quantum Physics") and observe how the agents transform it into three distinct learning formats.

## 🏗️ Technology Stack

- **Backend**: Node.js + Express
- **AI**: Google Gemini 1.5 Flash
- **Document Processing**: PDF.js
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Design**: Modern dark mode with glassmorphism

## 📝 API Endpoints

- `POST /api/process` - Upload and process document
- `GET /api/health` - Health check

## 🎓 Why This is Agentic AI

1. **Task Decomposition** - Four distinct cognitive responsibilities
2. **Autonomous Decision-Making** - Each agent makes independent choices
3. **Shared Context** - Knowledge graph enables coordinated operation
4. **Goal-Oriented** - Each agent optimizes for its specific learning outcome
5. **No Hard-Coded Rules** - Agents adapt to document content dynamically

## 🚧 Future Enhancements

- Support for more document formats (DOCX, HTML)
- Interactive knowledge graph visualization
- Export to PDF/Markdown
- Multi-language support
- Custom agent configuration

## 📄 License

MIT

---

**Built for hackathon demonstration of true agentic AI principles**
