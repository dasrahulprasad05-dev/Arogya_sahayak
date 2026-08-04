/**
 * ═══════════════════════════════════════════════════════════════════
 *  Template Renderer — Converts PredictionFacts → PredictionData
 * ═══════════════════════════════════════════════════════════════════
 *  Generates structured clinical recommendations, urgency levels,
 *  and SOS guidance from offline risk assessment facts.
 */

import type { PredictionData, PredictionFacts } from '../lib/types/prediction';

export const templateRenderer = (facts: PredictionFacts): PredictionData => {
  let urgency: PredictionData['urgency'] = 'routine';
  let recommendations: string[] = [];
  let sos_guidance: string | null = null;

  switch (facts.recommendedAction) {
    case 'monitor':
      urgency = 'routine';
      recommendations = [
        "Your indicators are within acceptable ranges. Continue monitoring regularly.",
        "Maintain a balanced diet rich in seasonal fruits, vegetables, and whole grains.",
        "Stay hydrated (2–3 litres/day) and ensure 30 minutes of moderate physical activity daily.",
        "Schedule routine health checkups every 6–12 months.",
      ];
      break;

    case 'consult_doctor':
      urgency = 'soon';
      recommendations = [
        "Some clinical markers are outside normal reference ranges.",
        "Consult a qualified healthcare professional within 1–2 weeks for a thorough clinical evaluation.",
        "Bring these screening results to your primary care doctor for discussion and further laboratory testing.",
        "Track your symptoms daily and note any changes before your appointment.",
        "Do not self-medicate without professional guidance.",
      ];
      break;

    case 'urgent_care':
      urgency = 'urgent';
      recommendations = [
        "Multiple risk indicators are significantly elevated.",
        "Seek medical evaluation as soon as possible — preferably within 24–48 hours.",
        "Visit your nearest healthcare center, PHC (Primary Health Centre), or specialist clinic.",
        "Do not delay consultation. Early intervention significantly improves clinical outcomes.",
        "If available, bring any previous medical reports, prescriptions, and test results.",
      ];
      sos_guidance = [
        "🆘 If you experience severe symptoms — such as radiating chest pain, sudden numbness/weakness on one side, difficulty breathing, severe bleeding, loss of consciousness, or uncontrollable vomiting — call emergency services immediately.",
        "📞 India Emergency: 112 (National) | Ambulance: 108 | NIMHANS Mental Health Helpline: 080-46110007",
        "📞 Vandrevala Foundation (24/7 Mental Health): 9999 666 555",
        "Do NOT drive yourself to the hospital if experiencing chest pain or neurological symptoms. Call for an ambulance.",
      ].join('\n');
      break;
  }

  // ── Risk-specific additional recommendations ──
  if (facts.riskLevel === 'Critical') {
    urgency = 'emergency';
    recommendations.unshift("⚠️ CRITICAL RISK DETECTED — This screening has identified critical-level indicators requiring IMMEDIATE medical attention.");
    if (!sos_guidance) {
      sos_guidance = "Call 112 (India Emergency) or proceed to the nearest hospital emergency department immediately. Do not wait.";
    }
  }

  const risk = facts.riskLevel as PredictionData['risk'];

  return {
    risk,
    confidence: facts.riskScore,
    reasoning: facts.flaggedConditions.length > 0
      ? facts.flaggedConditions
      : ["Clinical markers compiled and evaluated using evidence-based screening criteria."],
    recommendations,
    urgency,
    sos_guidance,
    computedBy: facts.computedBy,
    disclaimer: [
      "⚕️ MEDICAL DISCLAIMER: This is an automated health screening tool, NOT a clinical diagnosis.",
      "Results are generated using evidence-based rule engines (ADA, AHA/ACC, KDIGO, ATA, WHO) for educational purposes only.",
      "Laboratory confirmation, clinical examination, and specialist consultation are ALWAYS required for definitive diagnosis.",
      "Never delay seeking medical care based on screening results. When in doubt, consult a doctor."
    ].join(' ')
  };
};
