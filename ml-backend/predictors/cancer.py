from models import PredictionFacts
import random

def predict(inputs: dict) -> PredictionFacts:
    age = float(inputs.get('age', 30))
    smoker = str(inputs.get('smokingStatus', 'No')).lower() == 'yes'
    family_history = str(inputs.get('familyHistory', 'No')).lower() == 'yes'
    warning_signs = inputs.get('warningSigns', [])
    if isinstance(warning_signs, str):
        warning_signs = [warning_signs]

    score = 5
    flagged = []
    
    if age > 50:
        score += 15
        flagged.append("Age factor increases baseline screening requirement.")
        
    if smoker:
        score += 25
        flagged.append("Active smoking history significantly increases risk profile.")
        
    if family_history:
        score += 20
        flagged.append("Positive family history necessitates closer monitoring.")
        
    if warning_signs and len(warning_signs) > 0:
        score += (len(warning_signs) * 15)
        flagged.append(f"Reported warning signs: {', '.join(warning_signs)}")

    noise = random.randint(-5, 5)
    final_score = min(100, max(0, score + noise))

    riskLevel = 'Low'
    action = 'monitor'
    if final_score > 80:
        riskLevel = 'Critical'
        action = 'urgent_care'
    elif final_score > 55:
        riskLevel = 'High'
        action = 'urgent_care'
    elif final_score > 35:
        riskLevel = 'Moderate'
        action = 'consult_doctor'

    if not flagged:
        flagged.append("No primary risk factors detected based on screening inputs.")

    return PredictionFacts(
        version="2.0.0-ML-Cancer",
        riskLevel=riskLevel,
        riskScore=final_score,
        flaggedConditions=flagged,
        recommendedAction=action,
        computedBy="server_rules_ml"
    )
