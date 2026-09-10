# Company Research Tool 🚀

A production-grade, fullstack sales intelligence web application designed for Account Executives (AEs) and Sales Development Reps (SDRs). When a rep enters a company name, an AI agent conducts real-time web research and streams a structured, 2-minute executive briefing via Server-Sent Events (SSE). Completed reports are automatically saved to a local SQLite database for history browsing, review, and management.

---

**Live Demo**: [https://company-research-tool-67r5.onrender.com/](https://company-research-tool-67r5.onrender.com/)

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

## 🛠️ Tech Stack & Provider Choices

### Backend

- **Framework**: Python 3.14 + FastAPI + `uvicorn`
- **Database**: SQLite (`aiosqlite` for asynchronous non-blocking I/O)
- **Streaming Protocol**: Server-Sent Events (SSE) via `StreamingResponse` (`text/event-stream`)
- **Testing**: `pytest` & `pytest-asyncio`

### Frontend

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Lucide Icons + Inter typography
- **State & Utilities**: `date-fns` for relative timestamps, custom `fetch` reader with `AbortController` for stream cancellation.

### AI & Search Provider Rationale

- **LLM Choice (OpenAI / Gemini)**:
  - Supports OpenAI (`gpt-4o-mini`) and Google Gemini (`gemini-1.5-flash`). These models provide structured JSON output, fast generation speeds, and high reasoning fidelity for company briefing extraction.
- **Search API Choice (Tavily / Serper)**:
  - Supports Tavily Search API or Serper API for real-time web context retrieval.
- **Smart Out-of-the-Box Fallback**:
  - If no API keys are provided in `.env`, the tool activates an internal smart research generator that simulates live web search and section streaming step-by-step.

---

## ⚡ Quick Start (How to Install & Run)

### Prerequisites

- Python 3.10+
- Node.js 18+ & npm

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn main:app --reload --port 8000
```

_Backend API will be live at `http://localhost:8000` (Health check at `http://localhost:8000/api/health`)._

### 2. Frontend Setup

```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Start Vite dev server
npm run dev
```

_Frontend UI will be live at `http://localhost:5173`._

---

## 🔑 How to Configure API Keys

Create a `.env` file inside the `backend/` directory (or set environment variables in your terminal shell):

```env
# Choose your preferred LLM provider (Optional - fallback generator used if omitted)
OPENAI_API_KEY=your_openai_api_key_here
# OR
GEMINI_API_KEY=your_gemini_api_key_here

# Choose your preferred Search API (Optional)
TAVILY_API_KEY=your_tavily_api_key_here
# OR
SERPER_API_KEY=your_serper_api_key_here

# Database path (Optional, defaults to backend/research_tool.db)
DATABASE_PATH=research_tool.db
```

> **Note**: Do **NOT** commit your `.env` file to version control.

---

## 🧪 Running Tests

Run the backend test suite:

```bash
cd backend
python -m pytest tests/test_api.py -v
```

Run the frontend TypeScript compilation check:

```bash
cd frontend
npm run build
```

---

## ⚖️ Trade-offs Made

1. **Server-Sent Events (SSE) vs WebSockets**:
   - Chosen SSE over WebSockets because research streaming is unidirectional (server -> client). SSE works over standard HTTP/1.1 and HTTP/2, requires no socket handshake overhead, and integrates seamlessly with FastAPI standard streaming.
2. **SQLite Connection Handling**:
   - Used `aiosqlite` async context manager per-request rather than maintaining a long-lived global connection pool, ensuring zero database lock contention for desktop SQLite.
3. **Optimistic Streaming UI**:
   - Rendered section cards with state badges and progressive skeleton states so sales reps never look at a blank screen while research is processing.

---

## 🔮 What I'd Do Differently With More Time

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
