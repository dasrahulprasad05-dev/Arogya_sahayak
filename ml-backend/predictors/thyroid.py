from models import PredictionFacts
import random

def predict(inputs: dict) -> PredictionFacts:
    tsh = float(inputs.get('tsh', 2.0))
    t3 = float(inputs.get('t3', 130))
    t4 = float(inputs.get('t4', 8.0))

    score = 10
    flagged = []
    
    if tsh > 4.5:
        score += 30
        flagged.append(f"Elevated TSH ({tsh} mIU/L), indicative of hypothyroidism.")
    elif tsh < 0.4:
        score += 30
        flagged.append(f"Suppressed TSH ({tsh} mIU/L), indicative of hyperthyroidism.")
        
    if t3 < 80 or t4 < 4.5:
        score += 25
        flagged.append("Low peripheral thyroid hormones (T3/T4) detected.")
    elif t3 > 200 or t4 > 12.0:
        score += 25
        flagged.append("Elevated peripheral thyroid hormones (T3/T4) detected.")

    noise = random.randint(-5, 5)
    final_score = min(100, max(0, score + noise))

    riskLevel = 'Low'
    action = 'routine'
    if final_score > 70:
        riskLevel = 'High'
        action = 'urgent'
    elif final_score > 45:
        riskLevel = 'Moderate'
        action = 'consult_doctor'

    if not flagged:
        flagged.append("Thyroid panel (TSH, T3, T4) is within normal euthyroid ranges.")

    return PredictionFacts(
        version="2.0.0-ML-Thyroid",
        riskLevel=riskLevel,
        riskScore=final_score,
        flaggedConditions=flagged,
        recommendedAction=action,
        computedBy="server_rules_ml"
    )
