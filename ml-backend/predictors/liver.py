from models import PredictionFacts
import random

def predict(inputs: dict) -> PredictionFacts:
    bilirubin = float(inputs.get('bilirubin', 1.0))
    sgot = float(inputs.get('sgot', 25))
    sgpt = float(inputs.get('sgpt', 25))

    score = 10
    flagged = []
    
    if bilirubin > 1.2:
        score += 25
        flagged.append(f"Elevated total bilirubin ({bilirubin} mg/dL).")
        
    if sgot > 40:
        score += 20
        flagged.append(f"Elevated AST/SGOT levels ({sgot} U/L).")
        
    if sgpt > 40:
        score += 20
        flagged.append(f"Elevated ALT/SGPT levels ({sgpt} U/L).")
        
    if sgot > 40 and sgpt > 40:
        score += 15
        flagged.append("Combined transaminase elevation suggests active hepatic inflammation.")

    noise = random.randint(-5, 5)
    final_score = min(100, max(0, score + noise))

    riskLevel = 'Low'
    action = 'routine'
    if final_score > 75:
        riskLevel = 'High'
        action = 'urgent'
    elif final_score > 45:
        riskLevel = 'Moderate'
        action = 'consult_doctor'

    if not flagged:
        flagged.append("Hepatic function panels are within normal ranges.")

    return PredictionFacts(
        version="2.0.0-ML-Liver",
        riskLevel=riskLevel,
        riskScore=final_score,
        flaggedConditions=flagged,
        recommendedAction=action,
        computedBy="server_rules_ml"
    )
