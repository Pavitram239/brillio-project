import os
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
import sys

# Ensure backend directory is in python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app
from database import init_db

# Use temporary SQLite database for tests
os.environ["DATABASE_PATH"] = os.path.join(os.path.dirname(__file__), "test_research.db")

@pytest_asyncio.fixture(autouse=True)
async def setup_test_db():
    await init_db()
    yield
    test_db = os.environ.get("DATABASE_PATH")
    if test_db and os.path.exists(test_db):
        try:
            os.remove(test_db)
        except PermissionError:
            pass

@pytest.mark.asyncio
async def test_health_check():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        assert "timestamp" in data

@pytest.mark.asyncio
async def test_list_reports_initially_empty():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/reports")
        assert response.status_code == 200
        assert response.json() == []

@pytest.mark.asyncio
async def test_invalid_research_request():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/api/research", json={"company_name": ""})
        assert response.status_code in (400, 422)

@pytest.mark.asyncio
async def test_research_stream_and_crud():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # 1. Trigger research stream
        response = await ac.post("/api/research", json={"company_name": "Stripe"})
        assert response.status_code == 200
        assert "text/event-stream" in response.headers["content-type"]

        body = response.text
        assert "event: status" in body
        assert "event: section_start" in body
        assert "event: section_data" in body
        assert "event: complete" in body

        # 2. List reports
        list_resp = await ac.get("/api/reports")
        assert list_resp.status_code == 200
        reports = list_resp.json()
        assert len(reports) == 1
        assert reports[0]["company_name"] == "Stripe"
        report_id = reports[0]["id"]

        # 3. Get single report
        get_resp = await ac.get(f"/api/reports/{report_id}")
        assert get_resp.status_code == 200
        report_data = get_resp.json()
        assert report_data["company_name"] == "Stripe"
        assert report_data["data"]["overview"]["industry"] is not None
        assert len(report_data["data"]["key_people"]) > 0

        # 4. Delete report
        del_resp = await ac.delete(f"/api/reports/{report_id}")
        assert del_resp.status_code == 200

        # 5. Verify deletion
        get_again = await ac.get(f"/api/reports/{report_id}")
        assert get_again.status_code == 404
