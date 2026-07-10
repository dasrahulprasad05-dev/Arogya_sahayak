from models import PredictionFacts
import random

def predict(inputs: dict) -> PredictionFacts:
    urea = float(inputs.get('urea', 20))
    creatinine = float(inputs.get('creatinine', 0.9))
    egfr = float(inputs.get('egfr', 100))

    score = 10
    flagged = []
    
    if urea > 40:
        score += 20
        flagged.append(f"Elevated Blood Urea Nitrogen (BUN) levels ({urea} mg/dL).")
        
    if creatinine > 1.2:
        score += 30
        flagged.append(f"High serum creatinine ({creatinine} mg/dL) indicating potential renal impairment.")
        
    if egfr < 60:
        score += 30
        flagged.append(f"Decreased eGFR ({egfr} mL/min) suggests reduced kidney filtration function.")

    noise = random.randint(-5, 5)
    final_score = min(100, max(0, score + noise))

    riskLevel = 'Low'
    action = 'routine'
    if final_score > 70:
        riskLevel = 'High'
        action = 'urgent'
    elif final_score > 40:
        riskLevel = 'Moderate'
        action = 'consult_doctor'

    if not flagged:
        flagged.append("Renal function markers are within healthy ranges.")

    return PredictionFacts(
        version="2.0.0-ML-Kidney",
        riskLevel=riskLevel,
        riskScore=final_score,
        flaggedConditions=flagged,
        recommendedAction=action,
        computedBy="server_rules_ml"
    )
