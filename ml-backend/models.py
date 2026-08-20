from pydantic import BaseModel, Field
from typing import List, Literal, Optional
from datetime import datetime, timezone

class PredictionFacts(BaseModel):
    version: str
    riskLevel: Literal['Low', 'Moderate', 'High', 'Critical']
    riskScore: int
    flaggedConditions: List[str]
    recommendedAction: Literal['monitor', 'consult_doctor', 'urgent_care']
    computedBy: Optional[str] = None
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
