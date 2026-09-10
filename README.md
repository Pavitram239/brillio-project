# Company Research Tool 🚀

A production-grade, fullstack sales intelligence web application designed for Account Executives (AEs) and Sales Development Reps (SDRs). When a rep enters a company name, an AI agent conducts real-time web research and streams a structured, 2-minute executive briefing via Server-Sent Events (SSE). Completed reports are automatically saved to a local SQLite database for history browsing, review, and management.

🔗 **Live Demo**: [https://company-research-tool-67r5.onrender.com/](https://company-research-tool-67r5.onrender.com/)

---

## 📋 Required Submission Requirements Summary

| Requirement | Section Link | Status |
| :--- | :--- | :---: |
| **How to install and run** | [Quick Start Instructions](#-how-to-install-and-run-quick-start) | ✅ Complete |
| **LLM & Search API choice & rationale** | [LLM & Search API Choices](#-which-llm-and-search-api-were-chosen-and-why) | ✅ Complete |
| **How to configure API keys** | [API Key Configuration Guide](#-how-to-configure-api-keys) | ✅ Complete |
| **Trade-offs made** | [Trade-offs Made](#-trade-offs-you-made) | ✅ Complete |
| **What you'd do differently with more time** | [Future Improvements](#-what-youd-do-differently-with-more-time) | ✅ Complete |

---

## 📸 Core Features & Sales Rep UX

- 🔍 **Prominent Search Bar**: Fast company lookup with keyboard shortcuts (`Cmd+K` / `Ctrl+K`), in-flight research cancellation, and rapid duplicate-search prevention.
- ⚡ **Real-Time Progressive SSE Streaming**: Section-by-section live rendering so sales reps see instant progress as the agent researches overview, key people, recent news, financials, and risks.
- 🏢 **5 Purpose-Built Briefing Sections**:
  1. **Company Overview**: 30-second briefing summary, industry, target customer profile, core products, and positioning.
  2. **Key People**: Executive leadership roster (CEO, CTO, CFO, CISO) for sales persona alignment.
  3. **Recent News**: 3-4 bullet points covering earnings, acquisitions, launches, and partnerships.
  4. **Financial Highlights**: Revenue, employee headcount, market cap, and YoY growth (gracefully renders private company `N/A` metrics).
  5. **Risk Factors & Objections**: Regulatory, competitive, or operational friction points to anticipate.
- 📜 **Research History Sidebar**: Browse past briefings with relative timestamps ("3 minutes ago"), instant filtering, and clean deletion.
- 🛡️ **Zero-Friction Fallback**: Seamlessly runs out-of-the-box with or without external API keys.

---

## 🤖 Which LLM and Search API Were Chosen, and Why

### 1. LLM Choice: OpenAI (`gpt-4o-mini`) & Google Gemini (`gemini-1.5-flash`)
- **Why**: Both models support strict JSON mode schema enforcement, offer ultra-low latency streaming, and deliver high-fidelity structured summaries from web search snippets.
- **Cost & Speed**: `gpt-4o-mini` and `gemini-1.5-flash` provide an optimal balance between execution speed (< 2s generation) and minimal API token cost.

### 2. Search API Choice: Tavily Search & Serper API
- **Why**: Tavily and Serper are built specifically for LLM agent workflows. Unlike raw HTML scrapers, they deliver clean, deduplicated organic search snippets, news articles, and executive press releases.

### 3. Out-of-the-Box Smart Fallback Engine
- **Why**: If external API keys (`OPENAI_API_KEY`, `GEMINI_API_KEY`, `TAVILY_API_KEY`) are missing, the tool seamlessly uses an internal smart generator that simulates real-time web search and progressive SSE section streaming so the app is 100% functional immediately upon launch.

---

## ⚡ How to Install and Run (Quick Start)

### Prerequisites
- Python 3.10+
- Node.js 18+ & npm

### 1. Run Backend Server
```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Start FastAPI backend server
uvicorn main:app --reload --port 8000
```
*Backend API will be live at `http://localhost:8000` (Health check at `http://localhost:8000/api/health`).*

### 2. Run Frontend Client
```bash
# In a new terminal, navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Start Vite development server
npm run dev
```
*Frontend UI will be live at `http://localhost:5173`.*

---

## 🔑 How to Configure API Keys

Create a `.env` file inside the `backend/` directory (or export environment variables in your shell):

```env
# LLM Provider Keys (Optional - smart fallback used if omitted)
OPENAI_API_KEY=your_openai_api_key_here
# OR
GEMINI_API_KEY=your_gemini_api_key_here

# Search Engine Keys (Optional)
TAVILY_API_KEY=your_tavily_api_key_here
# OR
SERPER_API_KEY=your_serper_api_key_here

# SQLite Database Location (Optional, defaults to backend/research_tool.db)
DATABASE_PATH=research_tool.db
```

> ⚠️ **IMPORTANT**: Do **NOT** commit `.env` files or API keys to version control. The repository includes `.gitignore` to prevent secret leaks.

---

## 🧪 Running Tests

### Backend Test Suite (Pytest)
```bash
cd backend
python -m pytest tests/test_api.py -v
```

### Frontend Type Check & Build
```bash
cd frontend
npm run build
```

---

## ⚖️ Trade-offs You Made

1. **Server-Sent Events (SSE) vs WebSockets**:
   - Chosen SSE over WebSockets because research streaming is strictly unidirectional (server -> client). SSE uses standard HTTP/1.1 and HTTP/2 transport without requiring WebSockets handshake infrastructure.
2. **SQLite (`aiosqlite`) Per-Request Connections**:
   - Managed async connections per request using `aiosqlite.connect()` to guarantee zero thread locking or SQLite pool starvation during concurrent streaming.
3. **Progressive UI State Badging**:
   - Designed section cards with live progress badges (`Pending`, `Researching...`, `Ready`) so sales reps receive immediate feedback instead of staring at a blank loader.

---

## 🔮 What You'd Do Differently With More Time

1. **Export & Sharing**: Add one-click "Copy Briefing to Clipboard" in Markdown or Slack-ready format for SDR team huddles.
2. **Deep LinkedIn / Sales Navigator Enrichment**: Incorporate executive social profiles and direct contact email patterns.
3. **Competitor Battlecard Comparison**: Add an optional 6th section comparing the target company against top 3 industry rivals.

---

## 🌐 Deploying on Render

### Option A: Render Blueprint (Recommended - 1 Click)

1. Push this repository to **GitHub**.
2. Log in to [Render Dashboard](https://dashboard.render.com/).
3. Click **New +** -> **Blueprint**.
4. Connect your GitHub repository. Render will automatically detect [`render.yaml`](file:///c:/Users/pavit/Desktop/AI%20Engineer/FastApi%20Projects/Company%20research%20tool/render.yaml).
5. Add your optional API keys (`OPENAI_API_KEY` / `GEMINI_API_KEY` / `TAVILY_API_KEY`) under Environment Variables.
6. Click **Apply**. Render will build and deploy the entire fullstack app!

### Option B: Manual Web Service Setup

1. In Render, click **New +** -> **Web Service**.
2. Connect your GitHub repo.
3. Configure the service settings:
   - **Environment**: `Python`
   - **Build Command**: `cd frontend && npm install && npm run build && cd ../backend && pip install -r requirements.txt`
   - **Start Command**: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Add Environment Variables (e.g. `GEMINI_API_KEY`, `OPENAI_API_KEY`, `TAVILY_API_KEY`).
5. Click **Create Web Service**. Render will deploy your application.
