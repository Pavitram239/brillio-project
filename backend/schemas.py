from typing import List, Optional
from pydantic import BaseModel, Field

class CompanyOverview(BaseModel):
    industry: str = Field(..., description="Industry segment")
    core_products: List[str] = Field(default_factory=list, description="Core products or services")
    target_customers: str = Field(..., description="Target customer demographics or enterprise tier")
    market_positioning: str = Field(..., description="Market position and competitive advantage")
    summary: str = Field(..., description="30-second briefing summary for sales rep")

class KeyPerson(BaseModel):
    name: str = Field(..., description="Executive name")
    title: str = Field(..., description="Executive title (CEO, CTO, CFO, etc.)")

class FinancialHighlights(BaseModel):
    revenue: Optional[str] = Field(None, description="Annual revenue (e.g. '$10B' or null if unavailable)")
    employee_count: Optional[str] = Field(None, description="Total headcount (e.g. '15,000+' or null)")
    market_cap: Optional[str] = Field(None, description="Market capitalization (null for private companies)")
    yoy_growth: Optional[str] = Field(None, description="Year-over-year revenue growth percentage (e.g. '15%' or null)")

class ReportData(BaseModel):
    overview: Optional[CompanyOverview] = None
    key_people: Optional[List[KeyPerson]] = None
    news: Optional[List[str]] = None
    financials: Optional[FinancialHighlights] = None
    risks: Optional[List[str]] = None

class ResearchRequest(BaseModel):
    company_name: str = Field(..., min_length=1, max_length=100, description="Name of company to research")

class ReportListItem(BaseModel):
    id: str
    company_name: str
    created_at: str

class ReportRecord(BaseModel):
    id: str
    company_name: str
    created_at: str
    data: ReportData
