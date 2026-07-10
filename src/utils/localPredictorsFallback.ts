import type { PredictionFacts } from '../lib/types/prediction';

export const getLocalPredictionFallback = (
  predictorId: string,
  inputs: Record<string, any>
): PredictionFacts => {
  let riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical' | 'Insufficient Data' = 'Low';
  let riskScore = 70;
  const flaggedConditions: string[] = [];
  let recommendedAction: 'monitor' | 'consult_doctor' | 'urgent_care' = 'monitor';

  if (predictorId === 'diabetes') {
    const fbs = Number(inputs.fastingBloodSugar) || 100;
    const hba1c = Number(inputs.hba1c) || 5.7;
    flaggedConditions.push(`Fasting Blood Sugar: ${fbs} mg/dL`);
    flaggedConditions.push(`HbA1c level: ${hba1c}%`);

    if (fbs > 126 || hba1c >= 6.5) {
      riskLevel = 'High';
      riskScore = 85;
      flaggedConditions.push("Markers exceed glycemic thresholds.");
      recommendedAction = 'urgent_care';
    } else if (fbs > 100 || hba1c >= 5.7) {
      riskLevel = 'Moderate';
      flaggedConditions.push("Pre-diabetic glycemic range indicators.");
      recommendedAction = 'consult_doctor';
    }
  } else if (predictorId === 'heart-attack') {
    const bp = Number(inputs.restingBloodPressure) || 120;
    const chol = Number(inputs.cholesterol) || 200;
    flaggedConditions.push(`Resting Blood Pressure: ${bp} mmHg`);
    flaggedConditions.push(`Serum Cholesterol: ${chol} mg/dL`);

    if (bp > 140 || chol > 240) {
      riskLevel = 'High';
      riskScore = 80;
      flaggedConditions.push("Hypertension and hypercholesterolemia indicators.");
      recommendedAction = 'urgent_care';
    } else if (bp > 130 || chol > 200) {
      riskLevel = 'Moderate';
      flaggedConditions.push("Elevated BP or cholesterol markers.");
      recommendedAction = 'consult_doctor';
    }
  } else if (predictorId === 'ecg') {
    const hr = Number(inputs.heartRate) || 72;
    const st = inputs.stSegment || 'Normal';
    flaggedConditions.push(`Resting Heart Rate: ${hr} BPM`);
    flaggedConditions.push(`ST-Segment type: ${st}`);

    if (st === 'Elevated' || st === 'Depressed' || hr > 120 || hr < 50) {
      riskLevel = 'High';
      riskScore = 80;
      flaggedConditions.push("Abnormal heart rhythm or ST-segment displacement detected.");
      recommendedAction = 'urgent_care';
    } else if (st === 'Flat' || hr > 100) {
      riskLevel = 'Moderate';
      flaggedConditions.push("Borderline tachycardia or flat ST-segment indicators.");
      recommendedAction = 'consult_doctor';
    }
  } else if (predictorId === 'cancer') {
    const smoke = Number(inputs.smokingPackYears) || 0;
    const fam = inputs.familyHistory === true || inputs.familyHistory === 'Yes';
    flaggedConditions.push(`Smoking history: ${smoke} pack-years`);
    flaggedConditions.push(`Family history of oncology: ${fam ? 'Yes' : 'No'}`);

    if (fam && (smoke > 20 || inputs.skinLesionChanges === true || inputs.chronicCough === true)) {
      riskLevel = 'High';
      riskScore = 75;
      flaggedConditions.push("Oncology risk factors or chronic symptoms compiled.");
      recommendedAction = 'consult_doctor';
    } else if (fam || smoke > 10 || inputs.chronicCough === true) {
      riskLevel = 'Moderate';
      flaggedConditions.push("Elevated risk index due to positive family history or moderate smoking.");
      recommendedAction = 'monitor';
    }
  } else if (predictorId === 'kidney') {
    const gfr = Number(inputs.gfr) || Number(inputs.egfr) || 90;
    const cr = Number(inputs.creatinine) || 0.9;
    flaggedConditions.push(`Estimated GFR: ${gfr} mL/min/1.73m²`);
    flaggedConditions.push(`Serum Creatinine: ${cr} mg/dL`);

    if (gfr < 60 || cr > 1.5) {
      riskLevel = 'High';
      riskScore = 85;
      flaggedConditions.push("Indication of decreased glomerular filtration rate or high creatinine.");
      recommendedAction = 'consult_doctor';
    } else if (gfr < 90 || cr > 1.2) {
      riskLevel = 'Moderate';
      flaggedConditions.push("Mild renal impairment glycemic or filtration markers.");
      recommendedAction = 'monitor';
    }
  } else if (predictorId === 'liver') {
    const alt = Number(inputs.alt) || 30;
    const ast = Number(inputs.ast) || 30;
    const bil = Number(inputs.bilirubin) || 0.8;
    flaggedConditions.push(`ALT Level: ${alt} U/L`);
    flaggedConditions.push(`AST Level: ${ast} U/L`);
    flaggedConditions.push(`Total Bilirubin: ${bil} mg/dL`);

    if (alt > 100 || ast > 100 || bil > 2.0) {
      riskLevel = 'High';
      riskScore = 85;
      flaggedConditions.push("Hepatic enzymes Alt/Ast exceed double the normal reference range.");
      recommendedAction = 'consult_doctor';
    } else if (alt > 45 || ast > 45 || bil > 1.2) {
      riskLevel = 'Moderate';
      flaggedConditions.push("Mildly elevated liver enzymes.");
      recommendedAction = 'monitor';
    }
  } else if (predictorId === 'anemia') {
    const hb = Number(inputs.hemoglobin) || Number(inputs.hbLevel) || 13;
    const gender = inputs.gender || 'Male';
    flaggedConditions.push(`Hemoglobin: ${hb} g/dL`);
    flaggedConditions.push(`Gender context: ${gender}`);

    const isLow = (gender === 'Female' && hb < 11) || (gender === 'Male' && hb < 12);
    const isBorderline = (gender === 'Female' && hb < 12) || (gender === 'Male' && hb < 13);

    if (isLow) {
      riskLevel = 'High';
      riskScore = 85;
      flaggedConditions.push("Hemoglobin is significantly below standard clinical thresholds.");
      recommendedAction = 'consult_doctor';
    } else if (isBorderline) {
      riskLevel = 'Moderate';
      flaggedConditions.push("Mild/borderline anemia markers.");
      recommendedAction = 'monitor';
    }
  } else if (predictorId === 'thyroid') {
    const tsh = Number(inputs.tsh) || 2.0;
    const ft4 = Number(inputs.freeT4) || 1.2;
    flaggedConditions.push(`TSH Level: ${tsh} mIU/L`);
    flaggedConditions.push(`Free T4: ${ft4} ng/dL`);

    if (tsh > 5.0 && ft4 < 0.8) {
      riskLevel = 'High';
      riskScore = 85;
      flaggedConditions.push("Primary hypothyroid profile: Elevated TSH combined with low Free T4.");
      recommendedAction = 'consult_doctor';
    } else if (tsh < 0.4 && ft4 > 1.8) {
      riskLevel = 'High';
      riskScore = 85;
      flaggedConditions.push("Hyperthyroid profile: Low TSH combined with elevated Free T4.");
      recommendedAction = 'consult_doctor';
    } else if (tsh > 4.0 || tsh < 0.5) {
      riskLevel = 'Moderate';
      flaggedConditions.push("Mild thyroid stimulating hormone fluctuation.");
      recommendedAction = 'monitor';
    }
  } else {
    flaggedConditions.push("Clinical markers compiled for evaluation.");
    flaggedConditions.push(`Inputs checked: ${Object.keys(inputs || {}).join(', ') || 'none'}`);
  }

  return {
    version: '1.0.0',
    riskLevel,
    riskScore,
    flaggedConditions,
    recommendedAction,
    computedBy: 'offline_rules',
    timestamp: new Date().toISOString(),
  };
};
