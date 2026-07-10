from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Any, Dict, Optional
from models import PredictionFacts

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

app = FastAPI(title="Medical Predictor ML Backend")

class PredictionRequest(BaseModel):
    predictorId: str
    inputs: Dict[str, Any]
    localLabel: Optional[str] = None

@app.post("/api/predict/{predictorId}", response_model=PredictionFacts)
async def predict(predictorId: str, request: PredictionRequest):
    if predictorId != request.predictorId:
        raise HTTPException(status_code=400, detail="URL predictorId does not match body")
        
    # Route to the appropriate dedicated ML logic
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
        # Generic fallback for any other predictor (hypertension, stroke, dengue, etc)
        return generic.predict(request.inputs)

@app.get("/health")
async def health():
    return {"status": "healthy"}
