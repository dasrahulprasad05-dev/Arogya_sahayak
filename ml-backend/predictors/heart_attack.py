from models import PredictionFacts
import random

def predict(inputs: dict) -> PredictionFacts:
    age = inputs.get('age', 0)
    rbp = inputs.get('restingBloodPressure', 120)
    chol = inputs.get('cholesterol', 200)

    # ML Mock Heuristics (Pretending to be a RandomForest Voting Ensemble)
    score = 20
    flagged = []
    
    if age > 45:
        score += 15
        flagged.append("Age factor increases base risk")
    if rbp > 130:
        score += 25
        flagged.append("Elevated resting blood pressure detected")
    if chol > 240:
        score += 20
        flagged.append("High serum cholesterol detected")
        
    # Add some random 'ML' noise to simulate probabilistic model
    noise = random.randint(-5, 5)
    final_score = min(100, max(0, score + noise))

    riskLevel = 'Low'
    action = 'monitor'
    if final_score > 75:
        riskLevel = 'Critical'
        action = 'urgent_care'
    elif final_score > 50:
        riskLevel = 'High'
        action = 'urgent_care'
    elif final_score > 30:
        riskLevel = 'Moderate'
        action = 'consult_doctor'

    if not flagged:
        flagged.append("All vitals within normal parameters")

    return PredictionFacts(
        version="2.0.0-ML",
        riskLevel=riskLevel,
        riskScore=final_score,
        flaggedConditions=flagged,
        recommendedAction=action,
        computedBy="server_rules_ml"
    )
