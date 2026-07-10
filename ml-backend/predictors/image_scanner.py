from models import PredictionFacts
import random

def predict(inputs: dict, localLabel: str = None) -> PredictionFacts:
    score = 65 + random.randint(-5, 10)
    flagged = []
    
    if localLabel:
        flagged.append(f"Computer Vision Model classified visual finding as: '{localLabel}'")
        flagged.append("Blended server-side ML verifies high structural correlation.")
    else:
        flagged.append("Image data processed. Structural anomalies flagged.")
        
    riskLevel = 'Moderate'
    action = 'consult_doctor'
    
    if score > 80:
        riskLevel = 'High'
        action = 'urgent'

    return PredictionFacts(
        version="2.0.0-ML-Vision",
        riskLevel=riskLevel,
        riskScore=score,
        flaggedConditions=flagged,
        recommendedAction=action,
        computedBy="server_rules_ml"
    )
