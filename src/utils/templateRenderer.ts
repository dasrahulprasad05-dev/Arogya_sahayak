import type { PredictionData, PredictionFacts } from '../lib/types/prediction';

export const templateRenderer = (facts: PredictionFacts): PredictionData => {
  let urgency: PredictionData['urgency'] = 'routine';
  let recommendations: string[] = [];
  let sos_guidance: string | null = null;

  switch (facts.recommendedAction) {
    case 'monitor':
      urgency = 'routine';
      recommendations = [
        "Monitor your condition regularly.",
        "Maintain a balanced diet, stay hydrated, and ensure moderate physical activity."
      ];
      break;
    case 'consult_doctor':
      urgency = 'soon';
      recommendations = [
        "Consult a qualified healthcare professional soon for a thorough clinical evaluation.",
        "Take these screening results to your primary care doctor for discussion."
      ];
      break;
    case 'urgent_care':
      urgency = 'urgent';
      recommendations = [
        "Seek immediate medical evaluation.",
        "Do not delay consulting a specialist or visiting the nearest healthcare center."
      ];
      sos_guidance = "If you experience severe symptoms like radiating chest pain, severe shortness of breath, or fainting, call emergency services (108/112) immediately.";
      break;
  }

  // Ensure riskLevel is properly formatted if needed, though they should match
  const risk = facts.riskLevel as PredictionData['risk'];

  return {
    risk,
    confidence: facts.riskScore,
    reasoning: facts.flaggedConditions.length > 0 ? facts.flaggedConditions : ["Clinical markers compiled and evaluated."],
    recommendations,
    urgency,
    sos_guidance,
    computedBy: facts.computedBy,
    disclaimer: "This is a basic automated health screening fallback, not a clinical diagnosis. Always consult a doctor for any symptom evaluation."
  };
};
