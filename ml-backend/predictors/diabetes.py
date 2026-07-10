from models import PredictionFacts
import random

def predict(inputs: dict) -> PredictionFacts:
    glucose = float(inputs.get('glucose', 90.0))
    bmi = float(inputs.get('bmi', 22.0))
    age = float(inputs.get('age', 30.0))
    blood_pressure = float(inputs.get('bloodPressure', 120.0))
    family_history = str(inputs.get('familyHistory', 'No')).lower() == 'yes'

    score = 5
    flagged = []
    
    if glucose > 125.0:
        score += 40
        flagged.append(f"Fasting glucose level is high ({glucose} mg/dL).")
    elif glucose > 100.0:
        score += 20
        flagged.append(f"Fasting glucose level is slightly elevated ({glucose} mg/dL).")
        
    if bmi >= 30.0:
        score += 15
        flagged.append(f"BMI indicates obesity ({bmi}), increasing risk.")
    elif bmi >= 25.0:
        score += 5
        flagged.append(f"BMI indicates overweight ({bmi}).")
        
    if age > 45.0:
        score += 10
        flagged.append("Age > 45 is a risk factor.")

    if blood_pressure > 140.0:
        score += 10
        flagged.append(f"High blood pressure reported ({blood_pressure} mmHg).")

    if family_history:
        score += 15
        flagged.append("Family history of diabetes reported.")

    noise = random.randint(-5, 5)
    final_score = min(100, max(0, score + noise))

    riskLevel = 'Low'
    action = 'monitor'
    if final_score > 75:
        riskLevel = 'High'
        action = 'urgent_care'
    elif final_score > 40:
        riskLevel = 'Moderate'
        action = 'consult_doctor'

    if not flagged:
        flagged.append("All metabolic parameters are within normal ranges.")

    return PredictionFacts(
        version="2.0.0-ML-Diabetes",
        riskLevel=riskLevel,
        riskScore=final_score,
        flaggedConditions=flagged,
        recommendedAction=action,
        computedBy="server_rules_ml"
    )
