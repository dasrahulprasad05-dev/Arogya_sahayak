/**
 * ═══════════════════════════════════════════════════════════════════
 *  Template Renderer — Converts PredictionFacts → PredictionData
 * ═══════════════════════════════════════════════════════════════════
 *  v2.1.0 — INPUT-SENSITIVE rendering
 *  Generates structured clinical recommendations from the ACTUAL
 *  flaggedConditions produced by the rule engine, ensuring every
 *  predictor shows unique, user-input-specific results.
 *
 *  Previous bug: recommendations were hardcoded per action-level,
 *  ignoring flaggedConditions entirely.
 */

import type { PredictionData, PredictionFacts } from '../lib/types/prediction';

/** Build dynamic recommendations from actual flagged conditions + action level */
function buildRecommendations(facts: PredictionFacts): string[] {
  const recs: string[] = [];

  // ── Extract condition-specific actionable items from flaggedConditions ──
  // The flaggedConditions array contains input-specific clinical findings
  // like "⚠ FBS 200 mg/dL — exceeds random glucose diagnostic threshold"
  // We use these to build targeted recommendations.

  // ── Condition-specific recommendation layer ──
  // Parse the flaggedConditions to generate targeted advice
  const conditions = facts.flaggedConditions;

  for (const condition of conditions) {
    const cl = condition.toLowerCase();

    // Blood sugar / Diabetes markers
    if (cl.includes('fbs') || cl.includes('glucose') || cl.includes('hba1c') || cl.includes('diabetic') || cl.includes('glycemic')) {
      if (cl.includes('⚠') || cl.includes('elevated') || cl.includes('exceeds') || cl.includes('meets')) {
        recs.push('Monitor fasting blood sugar and HbA1c levels regularly. Consider an OGTT (Oral Glucose Tolerance Test) for confirmation.');
        recs.push('Adopt a low glycemic index diet: millets (ragi/jowar), green vegetables, dal, and reduce refined carbohydrates and sugary drinks.');
      }
    }

    // Blood pressure
    if (cl.includes('hypertens') || cl.includes('blood pressure') || cl.includes('bp ')) {
      if (cl.includes('⚠') || cl.includes('stage') || cl.includes('elevated')) {
        recs.push('Reduce salt intake to <5g/day (WHO recommendation). Avoid pickles, papad, and processed foods high in sodium.');
        recs.push('Monitor blood pressure at home twice daily (morning and evening) and maintain a log for your doctor.');
      }
    }

    // Cholesterol / Lipid
    if (cl.includes('cholesterol') || cl.includes('lipid') || cl.includes('hypercholesterol')) {
      if (cl.includes('⚠') || cl.includes('high') || cl.includes('borderline')) {
        recs.push('Request a full lipid panel (LDL, HDL, Triglycerides). Increase omega-3 intake through flaxseed, walnuts, and fish.');
      }
    }

    // Kidney / Renal
    if (cl.includes('egfr') || cl.includes('creatinine') || cl.includes('urea') || cl.includes('renal') || cl.includes('kidney') || cl.includes('kdigo')) {
      if (cl.includes('⚠') || cl.includes('decreased') || cl.includes('elevated') || cl.includes('stage g3') || cl.includes('stage g4') || cl.includes('stage g5')) {
        recs.push('Limit protein intake as advised by a nephrologist. Stay well-hydrated with 2-3 litres of water daily.');
        recs.push('Avoid NSAIDs (ibuprofen, diclofenac) which can worsen kidney function. Get regular kidney function tests (KFT).');
      }
    }

    // Liver / Hepatic
    if (cl.includes('alt') || cl.includes('ast') || cl.includes('bilirubin') || cl.includes('hepat') || cl.includes('liver') || cl.includes('transaminase') || cl.includes('alp ')) {
      if (cl.includes('⚠') || cl.includes('elevated') || cl.includes('severe')) {
        recs.push('Avoid alcohol completely. Get a hepatitis panel (HBsAg, anti-HCV) and liver ultrasound.');
        recs.push('Eat a liver-friendly diet: avoid fried/oily foods, increase fresh fruits, vegetables, and whole grains.');
      }
    }

    // Anemia / Hemoglobin
    if (cl.includes('hemoglobin') || cl.includes('anemia') || cl.includes('hb ')) {
      if (cl.includes('⚠') || cl.includes('low') || cl.includes('mild') || cl.includes('moderate') || cl.includes('severe') || cl.includes('critical')) {
        recs.push('Increase iron-rich foods: spinach (palak), beetroot, jaggery (gur), dates (khajoor), and pomegranate.');
        recs.push('Get a Complete Blood Count (CBC) with peripheral smear and serum ferritin test. Take iron supplements only as prescribed.');
      }
    }

    // Thyroid
    if (cl.includes('tsh') || cl.includes('thyroid') || cl.includes('ft3') || cl.includes('ft4') || cl.includes('hypo') || cl.includes('hyper')) {
      if (cl.includes('⚠') || cl.includes('elevated') || cl.includes('suppressed') || cl.includes('low') || cl.includes('overt')) {
        recs.push('Get a complete thyroid panel (TSH, FT3, FT4) and thyroid ultrasound. Take thyroid medication at consistent timing daily.');
      }
    }

    // Cardiac / Heart / ECG
    if (cl.includes('cardiac') || cl.includes('heart') || cl.includes('angina') || cl.includes('st-') || cl.includes('ischemi') || cl.includes('coronary') || cl.includes('tachycardia') || cl.includes('bradycardia') || cl.includes('atrial fibrillation') || cl.includes('ecg') || cl.includes('arrhythmi')) {
      if (cl.includes('⚠') || cl.includes('critical') || cl.includes('high')) {
        recs.push('Get a cardiac evaluation: ECG, 2D Echo, and stress test. Avoid strenuous activity until cleared by a cardiologist.');
      }
    }

    // Cancer screening
    if (cl.includes('cancer') || cl.includes('smoking') || cl.includes('lump') || cl.includes('lesion') || cl.includes('blood in stool') || cl.includes('ldct')) {
      if (cl.includes('⚠') || cl.includes('risk') || cl.includes('recommend')) {
        recs.push('Schedule recommended cancer screening tests. Early detection significantly improves outcomes.');
      }
    }

    // Depression / Mental health
    if (cl.includes('phq-9') || cl.includes('depression') || cl.includes('suicid')) {
      recs.push('Speak with a mental health professional. NIMHANS Helpline: 080-46110007, Vandrevala Foundation: 9999 666 555 (24/7).');
    }

    // Anxiety
    if (cl.includes('gad-7') || cl.includes('anxiety')) {
      recs.push('Consider cognitive behavioral therapy (CBT) and regular physical activity. Practice deep breathing and mindfulness daily.');
    }

    // Potassium / Electrolyte
    if (cl.includes('hyperkalemia') || cl.includes('hypokalemia') || cl.includes('hyponatremia')) {
      recs.push('Electrolyte imbalance detected. Get an urgent serum electrolyte panel and ECG monitoring.');
    }

    // Dengue / Platelet
    if (cl.includes('platelet') || cl.includes('dengue') || cl.includes('thrombocytopenia')) {
      recs.push('Monitor platelet count daily. Stay hydrated with ORS, coconut water, and papaya leaf extract (traditional remedy). Avoid aspirin/NSAIDs.');
    }

    // Malaria
    if (cl.includes('malaria') || cl.includes('blood smear') || cl.includes('rdt')) {
      recs.push('Get a rapid diagnostic test (RDT) and thick/thin blood smear. Use mosquito nets and take prescribed antimalarials.');
    }

    // TB
    if (cl.includes('tuberculosis') || cl.includes('tb ') || cl.includes('sputum') || cl.includes('hemoptysis') || cl.includes('afb')) {
      recs.push('Get sputum AFB microscopy and GeneXpert test. Visit your nearest DOTS center for free TB diagnosis and treatment.');
    }
  }

  // Deduplicate recommendations
  const unique = [...new Set(recs)];

  // ── Base action-level guidance ──
  // Add generic tier advice AFTER specific recommendations
  switch (facts.recommendedAction) {
    case 'monitor':
      if (unique.length === 0) {
        // Only use generic text when there are truly no specific findings
        unique.push('Your indicators are within acceptable ranges based on the values you entered. Continue monitoring regularly.');
      }
      unique.push('Maintain a balanced diet and stay hydrated (2–3 litres/day). Ensure 30 minutes of moderate physical activity daily.');
      unique.push('Schedule routine health checkups every 6–12 months.');
      break;

    case 'consult_doctor':
      unique.push('Consult a qualified healthcare professional within 1–2 weeks for a thorough clinical evaluation.');
      unique.push('Bring these screening results to your doctor. Track your symptoms daily before your appointment.');
      unique.push('Do not self-medicate without professional guidance.');
      break;

    case 'urgent_care':
      unique.push('Seek medical evaluation as soon as possible — preferably within 24–48 hours.');
      unique.push('Visit your nearest healthcare center, PHC (Primary Health Centre), or specialist clinic.');
      unique.push('Do not delay consultation. Early intervention significantly improves clinical outcomes.');
      unique.push('Bring any previous medical reports, prescriptions, and test results.');
      break;
  }

  return unique;
}

export const templateRenderer = (facts: PredictionFacts): PredictionData => {
  let urgency: PredictionData['urgency'] = 'routine';
  let sos_guidance: string | null = null;

  switch (facts.recommendedAction) {
    case 'monitor':
      urgency = 'routine';
      break;
    case 'consult_doctor':
      urgency = 'soon';
      break;
    case 'urgent_care':
      urgency = 'urgent';
      sos_guidance = [
        "🆘 If you experience severe symptoms — such as radiating chest pain, sudden numbness/weakness on one side, difficulty breathing, severe bleeding, loss of consciousness, or uncontrollable vomiting — call emergency services immediately.",
        "📞 India Emergency: 112 (National) | Ambulance: 108 | NIMHANS Mental Health Helpline: 080-46110007",
        "📞 Vandrevala Foundation (24/7 Mental Health): 9999 666 555",
        "Do NOT drive yourself to the hospital if experiencing chest pain or neurological symptoms. Call for an ambulance.",
      ].join('\n');
      break;
  }

  // Build INPUT-SPECIFIC recommendations from flaggedConditions
  const recommendations = buildRecommendations(facts);

  // ── Risk-specific additional recommendations ──
  if (facts.riskLevel === 'Critical') {
    urgency = 'emergency';
    recommendations.unshift("⚠️ CRITICAL RISK DETECTED — This screening has identified critical-level indicators requiring IMMEDIATE medical attention.");
    if (!sos_guidance) {
      sos_guidance = "Call 112 (India Emergency) or proceed to the nearest hospital emergency department immediately. Do not wait.";
    }
  }

  const risk = facts.riskLevel as PredictionData['risk'];

  // Build computation source label
  const sourceLabel = facts.computedBy === 'server_rules_ml'
    ? 'Server ML Engine'
    : facts.computedBy === 'server_rules'
    ? 'Server Rule Engine'
    : 'Offline Clinical Rules (Local)';

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
      `⚕️ MEDICAL DISCLAIMER: This is an automated health screening tool, NOT a clinical diagnosis.`,
      `Results are generated using evidence-based rule engines (ADA, AHA/ACC, KDIGO, ATA, WHO) for educational purposes only.`,
      `Computed by: ${sourceLabel}.`,
      `Laboratory confirmation, clinical examination, and specialist consultation are ALWAYS required for definitive diagnosis.`,
      `Never delay seeking medical care based on screening results. When in doubt, consult a doctor.`
    ].join(' ')
  };
};
