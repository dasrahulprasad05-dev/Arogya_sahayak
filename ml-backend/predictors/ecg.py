from models import PredictionFacts
import random

def predict(inputs: dict) -> PredictionFacts:
    heart_rate = float(inputs.get('heartRate', 70))
    qt_interval = float(inputs.get('qtInterval', 400))
    rhythm = str(inputs.get('rhythmStatus', 'Normal')).lower()

    score = 10
    flagged = []
    
    if heart_rate > 100:
        score += 20
        flagged.append(f"Tachycardia detected (HR: {heart_rate} bpm).")
    elif heart_rate < 50:
        score += 20
        flagged.append(f"Bradycardia detected (HR: {heart_rate} bpm).")
        
    if qt_interval > 450:
        score += 30
        flagged.append(f"Prolonged QT interval ({qt_interval} ms) increases arrhythmia risk.")
        
    if 'atrial fibrillation' in rhythm or 'afib' in rhythm:
        score += 40
        flagged.append("Atrial fibrillation rhythm pattern detected.")
    elif rhythm != 'normal':
        score += 20
        flagged.append(f"Abnormal rhythm noted: {rhythm}.")

    noise = random.randint(-5, 5)
    final_score = min(100, max(0, score + noise))

    riskLevel = 'Low'
    action = 'routine'
    if final_score > 75:
        riskLevel = 'Critical'
        action = 'urgent'
    elif final_score > 50:
        riskLevel = 'High'
        action = 'urgent'
    elif final_score > 30:
        riskLevel = 'Moderate'
        action = 'preventive'

    if not flagged:
        flagged.append("ECG parameters are within normal limits.")

    return PredictionFacts(
        version="2.0.0-ML-ECG",
        riskLevel=riskLevel,
        riskScore=final_score,
        flaggedConditions=flagged,
        recommendedAction=action,
        computedBy="server_rules_ml"
    )
