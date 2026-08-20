from typing import List, Optional, Literal, Dict, Any
from pydantic import BaseModel, Field

class GraphState(BaseModel):
    user_id: Optional[str] = "anonymous"
    session_id: Optional[str] = "default"
    userMessage: str
    language: Literal['en', 'hi', 'or'] = 'en'
    ragContext: List[Dict[str, Any]] = Field(default_factory=list)
    retrievalConfidence: float = 0.0
    safetyStatus: Literal['safe', 'emergency'] = 'safe'
    emergencyType: Optional[str] = None
    finalResponse: Dict[str, Any] = Field(default_factory=dict)
    messages: List[Dict[str, str]] = Field(default_factory=list)
