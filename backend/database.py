import os
import json
import uuid
from datetime import datetime, timezone
import aiosqlite
from typing import List, Optional, Dict, Any
from schemas import ReportRecord, ReportData, ReportListItem, CompanyOverview, KeyPerson, FinancialHighlights

def get_db_path():
    return os.environ.get("DATABASE_PATH", os.path.join(os.path.dirname(__file__), "research_tool.db"))

async def init_db():
    async with aiosqlite.connect(get_db_path()) as db:
        await db.execute("""
            CREATE TABLE IF NOT EXISTS reports (
                id TEXT PRIMARY KEY,
                company_name TEXT NOT NULL,
                overview TEXT,
                key_people TEXT,
                news TEXT,
                financials TEXT,
                risks TEXT,
                created_at TEXT NOT NULL
            )
        """)
        await db.execute("CREATE INDEX IF NOT EXISTS idx_created_at ON reports (created_at DESC)")
        await db.commit()

async def save_report(company_name: str, report_data: Dict[str, Any], custom_id: Optional[str] = None) -> ReportRecord:
    report_id = custom_id or str(uuid.uuid4())
    created_at = datetime.now(timezone.utc).isoformat()

    overview_json = json.dumps(report_data.get("overview")) if report_data.get("overview") else None
    key_people_json = json.dumps(report_data.get("key_people")) if report_data.get("key_people") else None
    news_json = json.dumps(report_data.get("news")) if report_data.get("news") else None
    financials_json = json.dumps(report_data.get("financials")) if report_data.get("financials") else None
    risks_json = json.dumps(report_data.get("risks")) if report_data.get("risks") else None

    async with aiosqlite.connect(get_db_path()) as db:
        await db.execute(
            """
            INSERT INTO reports (id, company_name, overview, key_people, news, financials, risks, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (report_id, company_name, overview_json, key_people_json, news_json, financials_json, risks_json, created_at)
        )
        await db.commit()

    return await get_report_by_id(report_id)

async def list_reports() -> List[ReportListItem]:
    async with aiosqlite.connect(get_db_path()) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute("SELECT id, company_name, created_at FROM reports ORDER BY created_at DESC") as cursor:
            rows = await cursor.fetchall()
            return [
                ReportListItem(
                    id=row["id"],
                    company_name=row["company_name"],
                    created_at=row["created_at"]
                )
                for row in rows
            ]

async def get_report_by_id(report_id: str) -> Optional[ReportRecord]:
    async with aiosqlite.connect(get_db_path()) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute("SELECT * FROM reports WHERE id = ?", (report_id,)) as cursor:
            row = await cursor.fetchone()
            if not row:
                return None
            
            overview = json.loads(row["overview"]) if row["overview"] else None
            key_people = json.loads(row["key_people"]) if row["key_people"] else None
            news = json.loads(row["news"]) if row["news"] else None
            financials = json.loads(row["financials"]) if row["financials"] else None
            risks = json.loads(row["risks"]) if row["risks"] else None

            return ReportRecord(
                id=row["id"],
                company_name=row["company_name"],
                created_at=row["created_at"],
                data=ReportData(
                    overview=CompanyOverview(**overview) if overview else None,
                    key_people=[KeyPerson(**p) for p in key_people] if key_people else None,
                    news=news,
                    financials=FinancialHighlights(**financials) if financials else None,
                    risks=risks
                )
            )

async def delete_report(report_id: str) -> bool:
    async with aiosqlite.connect(get_db_path()) as db:
        async with db.execute("DELETE FROM reports WHERE id = ?", (report_id,)) as cursor:
            await db.commit()
            return cursor.rowcount > 0

