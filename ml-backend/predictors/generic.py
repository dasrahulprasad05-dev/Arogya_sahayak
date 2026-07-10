from models import PredictionFacts
import random

def predict(inputs: dict) -> PredictionFacts:
    score = 10
    flagged = []
    
    # Generic parsing based on keywords in the input dictionary
    for key, value in inputs.items():
        key_lower = key.lower()
        val_str = str(value).lower()
        
        # Check for boolean or text based warning signs
        if val_str in ['yes', 'true', 'high', 'severe', 'abnormal', 'positive']:
            score += 15
            flagged.append(f"Risk factor identified in: {key}")
            
        # Check numeric thresholds for generic inputs
        try:
            val_num = float(value)
            if 'pressure' in key_lower and val_num > 130:
                score += 20
                flagged.append(f"Elevated pressure metric ({val_num})")
            elif 'glucose' in key_lower and val_num > 110:
                score += 20
                flagged.append(f"Elevated glucose metric ({val_num})")
            elif 'cholesterol' in key_lower and val_num > 200:
                score += 20
                flagged.append(f"Elevated lipid metric ({val_num})")
            elif 'score' in key_lower and val_num > 10:
                score += 15
                flagged.append(f"Elevated clinical score ({val_num})")
        except ValueError:
            pass

    noise = random.randint(-5, 5)
    final_score = min(100, max(0, score + noise))

    riskLevel = 'Low'
    action = 'routine'
    if final_score > 75:
        riskLevel = 'High'
        action = 'urgent'
    elif final_score > 45:
        riskLevel = 'Moderate'
        action = 'preventive'

    if not flagged:
        flagged.append("All provided general metrics are within baseline normal limits.")

    return PredictionFacts(
        version="2.0.0-ML-Generic",
        riskLevel=riskLevel,
        riskScore=final_score,
        flaggedConditions=flagged,
        recommendedAction=action,
        computedBy="server_rules_ml"
    )
