from pydantic import BaseModel
from typing import List, Literal, Optional

class PredictionFacts(BaseModel):
    version: str
    riskLevel: Literal['Low', 'Moderate', 'High', 'Critical']
    riskScore: int
    flaggedConditions: List[str]
    recommendedAction: Literal['routine', 'preventive', 'urgent']
    computedBy: Optional[str] = None
