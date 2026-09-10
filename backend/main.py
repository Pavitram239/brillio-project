import os
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv

from schemas import ResearchRequest, ReportListItem, ReportRecord
from database import init_db, list_reports, get_report_by_id, delete_report
from agent import ResearchAgent

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize SQLite database schema on startup
    await init_db()
    yield

app = FastAPI(
    title="Company Research API",
    description="Sales intelligence tool that streams company research via SSE and stores reports in SQLite.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware for local frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

agent = ResearchAgent()

@app.get("/api/health", status_code=status.HTTP_200_OK)
async def health_check():
    """Health check endpoint."""
    return {
        "status": "ok",
        "service": "Company Research Tool API",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

@app.post("/api/research")
async def start_research(request: ResearchRequest):
    """
    Accepts a company name and streams real-time research results via Server-Sent Events (SSE).
    """
    company_name = request.company_name.strip()
    if not company_name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Company name cannot be empty or whitespace."
        )

    # Return SSE StreamingResponse
    return StreamingResponse(
        agent.run_research_stream(company_name),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )

@app.get("/api/reports", response_model=list[ReportListItem], status_code=status.HTTP_200_OK)
async def get_all_reports():
    """Returns a list of saved reports (newest first)."""
    return await list_reports()

@app.get("/api/reports/{report_id}", response_model=ReportRecord, status_code=status.HTTP_200_OK)
async def get_single_report(report_id: str):
    """Retrieves a full report by ID."""
    report = await get_report_by_id(report_id)
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Report with ID '{report_id}' not found."
        )
    return report

@app.delete("/api/reports/{report_id}", status_code=status.HTTP_200_OK)
async def delete_single_report(report_id: str):
    """Deletes a saved report by ID."""
    deleted = await delete_report(report_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Report with ID '{report_id}' not found."
        )
    return {"message": f"Report '{report_id}' successfully deleted.", "id": report_id}

# Optional Static Files Serving (for single-service deployment on Render)
from fastapi.staticfiles import StaticFiles
frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist"))
if os.path.exists(frontend_dist):
    app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="static")

