from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any, Dict, Optional, List
from models import PredictionFacts
from rag.graph import run_chat_pipeline

# Import all predictors
import predictors.heart_attack as heart_attack
import predictors.diabetes as diabetes
import predictors.ecg as ecg
import predictors.cancer as cancer
import predictors.kidney as kidney
import predictors.liver as liver
import predictors.anemia as anemia
import predictors.thyroid as thyroid
import predictors.generic as generic
import predictors.image_scanner as image_scanner

app = FastAPI(title="Arogya Sahayak ML & LangGraph RAG Backend")

# CORS Middleware — restrict origins in production via ALLOWED_ORIGINS env var
import os
allowed_origins = os.environ.get("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:4173,http://127.0.0.1:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in allowed_origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictionRequest(BaseModel):
    predictorId: str
    inputs: Dict[str, Any]
    localLabel: Optional[str] = None

class ChatRequest(BaseModel):
    query: str
    language: Optional[str] = "en"  # "en", "hi", or "or"
    sessionId: Optional[str] = "default"

@app.post("/api/predict/{predictorId}", response_model=PredictionFacts)
async def predict(predictorId: str, request: PredictionRequest):
    if predictorId != request.predictorId:
        raise HTTPException(status_code=400, detail="URL predictorId does not match body")
        
    if predictorId == 'heart-attack':
        return heart_attack.predict(request.inputs)
    elif predictorId == 'diabetes':
        return diabetes.predict(request.inputs)
    elif predictorId == 'ecg':
        return ecg.predict(request.inputs)
    elif predictorId == 'cancer':
        return cancer.predict(request.inputs)
    elif predictorId == 'kidney':
        return kidney.predict(request.inputs)
    elif predictorId == 'liver':
        return liver.predict(request.inputs)
    elif predictorId == 'anemia':
        return anemia.predict(request.inputs)
    elif predictorId == 'thyroid':
        return thyroid.predict(request.inputs)
    elif predictorId == 'image_analysis':
        return image_scanner.predict(request.inputs, request.localLabel)
    else:
        return generic.predict(request.inputs)

# ── Multilingual Medical RAG Chatbot Endpoints ────────────────────────────

@app.post("/api/chat/message")
async def chat_message(request: ChatRequest):
    if not request.query or not request.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    result = run_chat_pipeline(request.query, request.language or "en")
    return result

@app.get("/api/chat/quick-topics")
async def get_quick_topics(lang: str = "en"):
    """Returns localized suggested prompts for quick start chips."""
    if lang == "or":
        return [
          {"label": "ମୋତେ ୩ ଦିନ ହେଲା ପ୍ରବଳ ଜ୍ୱର ଅଛି (Dengue/Malaria Triage)", "query": "ମୋତେ ୩ ଦିନ ହେଲା ପ୍ରବଳ ଜ୍ୱର ଏବଂ ଗଣ୍ଠି ବିନ୍ଧା ହେଉଛି"},
          {"label": "ଡାଇବେଟିସ୍ ପାଇଁ କ’ଣ ଖାଇବା ଉଚିତ୍? (Diabetes Diet)", "query": "ଡାଇବେଟିସ୍ ନିୟନ୍ତ୍ରଣ ପାଇଁ ଘରୋଇ ଖାଦ୍ୟ ତାଲିକା କ'ଣ?"},
          {"label": "ଅଂଶୁଘାତ ବା ଖରା ଲାଗିଲେ କ’ଣ କରିବେ? (Heatstroke Care)", "query": "ଅଂଶୁଘାତ ଏବଂ ଖରା ତାତିରୁ ରକ୍ଷା ପାଇବା ପାଇଁ ଘରୋଇ ଉପଚାର"},
          {"label": "ବିଜୁ ସ୍ୱାସ୍ଥ୍ୟ କଲ୍ୟାଣ ଯୋଜନା (Odisha BSKY Guide)", "query": "ବିଜୁ ସ୍ୱାସ୍ଥ୍ୟ କଲ୍ୟାଣ ଯୋଜନା BSKY କାର୍ଡରେ ମାଗଣା ଚିକିତ୍ସା କିପରି ପାଇବେ?"}
        ]
    elif lang == "hi":
        return [
          {"label": "मुझे तेज बुखार और सिरदर्द है (Dengue/Malaria Triage)", "query": "मुझे 3 दिन से तेज बुखार और सिरदर्द है, क्या करें?"},
          {"label": "शुगर (डायबिटीज) में क्या खाना चाहिए? (Diabetes Diet)", "query": "डायबिटीज कंट्रोल करने के लिए भारतीय घरेलू डाइट प्लान बताएं"},
          {"label": "गर्मियों में लू से बचाव के घरेलू उपाय (Heatstroke Care)", "query": "लू लगने पर तुरंत क्या घरेलू उपचार करना चाहिए?"},
          {"label": "आयुष्मान भारत कार्ड से मुफ्त इलाज (PM-JAY Guide)", "query": "आयुष्मान भारत योजना के तहत मुफ्त अस्पताल में इलाज कैसे मिलता है?"}
        ]
    else:
        return [
          {"label": "High fever & body chills triage", "query": "I have high fever and severe shivering for 3 days"},
          {"label": "Indian diet plan for Type 2 Diabetes", "query": "What is the best Indian diet and home remedies for managing diabetes?"},
          {"label": "First aid for acute heat exhaustion", "query": "Immediate first aid steps for heatstroke in hot Indian summer"},
          {"label": "Ayushman Bharat PM-JAY hospital coverage", "query": "How to get free cashless treatment under Ayushman Bharat scheme?"}
        ]

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "Arogya Sahayak ML & RAG Engine"}
