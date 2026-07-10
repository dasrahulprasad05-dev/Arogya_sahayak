from models import PredictionFacts
import random

def predict(inputs: dict) -> PredictionFacts:
    hemoglobin = float(inputs.get('hemoglobin', 14.0))
    mcv = float(inputs.get('mcv', 90.0))
    fatigue = str(inputs.get('chronicFatigue', 'No')).lower() == 'yes'

    score = 5
    flagged = []
    
    if hemoglobin < 12.0:
        score += 40
        flagged.append(f"Low hemoglobin concentration ({hemoglobin} g/dL).")
        
    if mcv < 80.0:
        score += 20
        flagged.append(f"Microcytosis detected (MCV {mcv} fL), suggesting iron deficiency.")
    elif mcv > 100.0:
        score += 20
        flagged.append(f"Macrocytosis detected (MCV {mcv} fL), suggesting B12/folate deficiency.")
        
    if fatigue:
        score += 15
        flagged.append("Chronic fatigue symptoms reported, aligning with anemic hypoxia.")

    noise = random.randint(-5, 5)
    final_score = min(100, max(0, score + noise))

    riskLevel = 'Low'
    action = 'routine'
    if final_score > 75:
        riskLevel = 'High'
        action = 'urgent'
    elif final_score > 40:
        riskLevel = 'Moderate'
        action = 'preventive'

    if not flagged:
        flagged.append("CBC parameters indicate healthy red blood cell profiles.")

    return PredictionFacts(
        version="2.0.0-ML-Anemia",
        riskLevel=riskLevel,
        riskScore=final_score,
        flaggedConditions=flagged,
        recommendedAction=action,
        computedBy="server_rules_ml"
    )
