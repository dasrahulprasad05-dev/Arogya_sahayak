export interface PredictionData {
  risk: 'Low' | 'Moderate' | 'High' | 'Critical' | 'Insufficient Data';
  confidence: number;
  reasoning: string[];
  recommendations: string[];
  urgency: 'routine' | 'soon' | 'urgent' | 'emergency';
  missing_fields?: string[];
  sos_guidance?: string | null;
  disclaimer: string;
}

export const getLocalPredictionFallback = (
  predictorId: string,
  inputs: Record<string, any>
): PredictionData => {
  let risk: 'Low' | 'Moderate' | 'High' | 'Critical' | 'Insufficient Data' = 'Low';
  let confidence = 70;
  const reasoning: string[] = [];
  const recommendations: string[] = [
    "Consult the eSanjeevani online portal or visit your nearest primary healthcare center.",
    "Eat a balanced diet, keep hydrated, and maintain moderate physical activity."
  ];
  let urgency: 'routine' | 'soon' | 'urgent' | 'emergency' = 'routine';
  let sos_guidance: string | null = null;

  if (predictorId === 'diabetes') {
    const fbs = Number(inputs.fastingBloodSugar) || 100;
    const hba1c = Number(inputs.hba1c) || 5.7;
    reasoning.push(`Fasting Blood Sugar: ${fbs} mg/dL`);
    reasoning.push(`HbA1c level: ${hba1c}%`);

    if (fbs > 126 || hba1c >= 6.5) {
      risk = 'High';
      urgency = 'soon';
      confidence = 85;
      reasoning.push("Markers exceed glycemic thresholds.");
      recommendations.push("Consult your nearest AIIMS or district hospital endocrinologist.");
      recommendations.push("Avail low-cost diabetes monitors and drugs from a Pradhan Mantri Jan Aushadhi Kendra.");
    } else if (fbs > 100 || hba1c >= 5.7) {
      risk = 'Moderate';
      reasoning.push("Pre-diabetic glycemic range indicators.");
      recommendations.push("Monitor carbohydrate intake and consult a health practitioner soon.");
    }
  } else if (predictorId === 'heart-attack') {
    const bp = Number(inputs.restingBloodPressure) || 120;
    const chol = Number(inputs.cholesterol) || 200;
    reasoning.push(`Resting Blood Pressure: ${bp} mmHg`);
    reasoning.push(`Serum Cholesterol: ${chol} mg/dL`);

    if (bp > 140 || chol > 240) {
      risk = 'High';
      urgency = 'urgent';
      confidence = 80;
      reasoning.push("Hypertension and hypercholesterolemia indicators.");
      recommendations.push("Limit sodium/salt intake, do regular cardiorespiratory checkups.");
      sos_guidance = "If you experience radiating arm pain or severe chest squeezing, call 108/112 immediately.";
    } else if (bp > 130 || chol > 200) {
      risk = 'Moderate';
      reasoning.push("Elevated BP or cholesterol markers.");
      recommendations.push("Adopt a low-fat, low-sodium diet and schedule a follow-up assessment.");
    }
  } else if (predictorId === 'ecg') {
    const hr = Number(inputs.heartRate) || 72;
    const st = inputs.stSegment || 'Normal';
    reasoning.push(`Resting Heart Rate: ${hr} BPM`);
    reasoning.push(`ST-Segment type: ${st}`);

    if (st === 'Elevated' || st === 'Depressed' || hr > 120 || hr < 50) {
      risk = 'High';
      urgency = 'urgent';
      confidence = 80;
      reasoning.push("Abnormal heart rhythm or ST-segment displacement detected.");
      recommendations.push("Visit a cardiologist for an echocardiogram or 12-lead ECG.");
      sos_guidance = "If experiencing chest pain, dizziness, or fainting, seek emergency care immediately (dial 108).";
    } else if (st === 'Flat' || hr > 100) {
      risk = 'Moderate';
      reasoning.push("Borderline tachycardia or flat ST-segment indicators.");
    }
  } else if (predictorId === 'cancer') {
    const smoke = Number(inputs.smokingPackYears) || 0;
    const fam = inputs.familyHistory === true || inputs.familyHistory === 'Yes';
    reasoning.push(`Smoking history: ${smoke} pack-years`);
    reasoning.push(`Family history of oncology: ${fam ? 'Yes' : 'No'}`);

    if (fam && (smoke > 20 || inputs.skinLesionChanges === true || inputs.chronicCough === true)) {
      risk = 'High';
      urgency = 'soon';
      confidence = 75;
      reasoning.push("Oncology risk factors or chronic symptoms compiled.");
      recommendations.push("Consult an oncologist or primary care doctor for targeted cancer screenings.");
    } else if (fam || smoke > 10 || inputs.chronicCough === true) {
      risk = 'Moderate';
      reasoning.push("Elevated risk index due to positive family history or moderate smoking.");
    }
  } else if (predictorId === 'kidney') {
    const gfr = Number(inputs.gfr) || Number(inputs.egfr) || 90;
    const cr = Number(inputs.creatinine) || 0.9;
    reasoning.push(`Estimated GFR: ${gfr} mL/min/1.73m²`);
    reasoning.push(`Serum Creatinine: ${cr} mg/dL`);

    if (gfr < 60 || cr > 1.5) {
      risk = 'High';
      urgency = 'soon';
      confidence = 85;
      reasoning.push("Indication of decreased glomerular filtration rate or high creatinine.");
      recommendations.push("Consult a nephrologist for clinical evaluation and renal function checks.");
    } else if (gfr < 90 || cr > 1.2) {
      risk = 'Moderate';
      reasoning.push("Mild renal impairment glycemic or filtration markers.");
    }
  } else if (predictorId === 'liver') {
    const alt = Number(inputs.alt) || 30;
    const ast = Number(inputs.ast) || 30;
    const bil = Number(inputs.bilirubin) || 0.8;
    reasoning.push(`ALT Level: ${alt} U/L`);
    reasoning.push(`AST Level: ${ast} U/L`);
    reasoning.push(`Total Bilirubin: ${bil} mg/dL`);

    if (alt > 100 || ast > 100 || bil > 2.0) {
      risk = 'High';
      urgency = 'soon';
      confidence = 85;
      reasoning.push("Hepatic enzymes Alt/Ast exceed double the normal reference range.");
      recommendations.push("Consult a gastroenterologist/hepatologist or visit a district clinical lab.");
    } else if (alt > 45 || ast > 45 || bil > 1.2) {
      risk = 'Moderate';
      reasoning.push("Mildly elevated liver enzymes.");
    }
  } else if (predictorId === 'anemia') {
    const hb = Number(inputs.hemoglobin) || Number(inputs.hbLevel) || 13;
    const gender = inputs.gender || 'Male';
    reasoning.push(`Hemoglobin: ${hb} g/dL`);
    reasoning.push(`Gender context: ${gender}`);

    const isLow = (gender === 'Female' && hb < 11) || (gender === 'Male' && hb < 12);
    const isBorderline = (gender === 'Female' && hb < 12) || (gender === 'Male' && hb < 13);

    if (isLow) {
      risk = 'High';
      urgency = 'soon';
      confidence = 85;
      reasoning.push("Hemoglobin is significantly below standard clinical thresholds.");
      recommendations.push("Increase iron-rich dietary intake (leafy greens, lentils, beans).");
      recommendations.push("Consult a doctor for potential iron or B12 supplementation.");
    } else if (isBorderline) {
      risk = 'Moderate';
      reasoning.push("Mild/borderline anemia markers.");
    }
  } else if (predictorId === 'thyroid') {
    const tsh = Number(inputs.tsh) || 2.0;
    const ft4 = Number(inputs.freeT4) || 1.2;
    reasoning.push(`TSH Level: ${tsh} mIU/L`);
    reasoning.push(`Free T4: ${ft4} ng/dL`);

    if (tsh > 5.0 && ft4 < 0.8) {
      risk = 'High';
      urgency = 'soon';
      confidence = 85;
      reasoning.push("Primary hypothyroid profile: Elevated TSH combined with low Free T4.");
      recommendations.push("Consult an endocrinologist for thyroid hormone replacement therapy evaluation.");
    } else if (tsh < 0.4 && ft4 > 1.8) {
      risk = 'High';
      urgency = 'soon';
      confidence = 85;
      reasoning.push("Hyperthyroid profile: Low TSH combined with elevated Free T4.");
      recommendations.push("Consult an endocrinologist to assess thyroid glandular activity.");
    } else if (tsh > 4.0 || tsh < 0.5) {
      risk = 'Moderate';
      reasoning.push("Mild thyroid stimulating hormone fluctuation.");
    }
  } else {
    // Default fallback
    reasoning.push("Clinical markers compiled for evaluation.");
    reasoning.push(`Inputs checked: ${Object.keys(inputs || {}).join(', ') || 'none'}`);
  }

  return {
    risk,
    confidence,
    reasoning,
    recommendations,
    urgency,
    missing_fields: [],
    sos_guidance,
    disclaimer: "This is an automated local health screening fallback, not a diagnosis. Consult a doctor for any symptom evaluation."
  };
};
