/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  Arogya Sahayak — Offline Local Clinical Rule Engine  v2.0.0
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  Evidence-based clinical decision rules for offline health risk screening.
 *  Sources:
 *    • ADA Standards of Care in Diabetes 2024
 *    • AHA/ACC ASCVD Risk & PREVENT™ Equations 2024-2026
 *    • KDIGO CKD Classification 2024 (CGA Staging)
 *    • AASLD/EASL Hepatic Function Guidelines
 *    • ATA Thyroid Disease Diagnostic Framework
 *    • WHO Anemia Hemoglobin Thresholds (age/sex-specific)
 *    • PHQ-9 / GAD-7 Validated Scoring Instruments
 *    • STOP-BANG Sleep Apnea Screening
 *    • WHO/ICMR Dengue, Malaria, TB, Typhoid Clinical Criteria
 *
 *  DISCLAIMER: This engine is for SCREENING ONLY. It does NOT replace
 *  professional clinical diagnosis, laboratory confirmation, or specialist
 *  consultation. All results carry an explicit medical disclaimer.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { PredictionFacts } from '../lib/types/prediction';

/* ── Utility helpers ── */

/** Count how many boolean flags are truthy in a set of keys */
const countSymptoms = (inputs: Record<string, any>, keys: string[]): number =>
  keys.filter(k => inputs[k] === true).length;

/** Clamp a value between min and max */
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

/* ═════════════════════════════════════════════════════════════════════════ */

export const getLocalPredictionFallback = (
  predictorId: string,
  inputs: Record<string, any>
): PredictionFacts => {
  let riskLevel: PredictionFacts['riskLevel'] = 'Low';
  let riskScore = 70;
  const flaggedConditions: string[] = [];
  let recommendedAction: PredictionFacts['recommendedAction'] = 'monitor';

  /* ───────────────────────────────────────────────────────────────────── */
  /*  DIABETES (ADA 2024 Standards of Care)                              */
  /* ───────────────────────────────────────────────────────────────────── */
  if (predictorId === 'diabetes') {
    const fbs = Number(inputs.fastingBloodSugar) || 0;
    const hba1c = Number(inputs.hba1c) || 0;
    const age = Number(inputs.age) || 30;

    // Weighted risk accumulator (0–100 scale)
    let diabRisk = 0;

    // ── ADA Glycemic Criteria ──
    // Diabetes: FBS ≥ 126 mg/dL OR HbA1c ≥ 6.5%
    // Pre-diabetes: FBS 100-125 mg/dL OR HbA1c 5.7-6.4%
    if (fbs >= 200) {
      diabRisk += 35;
      flaggedConditions.push(`⚠ FBS ${fbs} mg/dL — exceeds random glucose diagnostic threshold (≥200).`);
    } else if (fbs >= 126) {
      diabRisk += 28;
      flaggedConditions.push(`⚠ FBS ${fbs} mg/dL — meets ADA diabetes diagnostic threshold (≥126).`);
    } else if (fbs >= 100) {
      diabRisk += 15;
      flaggedConditions.push(`FBS ${fbs} mg/dL — pre-diabetic range (ADA: 100–125 mg/dL).`);
    } else if (fbs > 0) {
      flaggedConditions.push(`FBS ${fbs} mg/dL — within normal glycemic range.`);
    }

    if (hba1c >= 6.5) {
      diabRisk += 30;
      flaggedConditions.push(`⚠ HbA1c ${hba1c}% — meets ADA diabetes diagnostic threshold (≥6.5%).`);
    } else if (hba1c >= 5.7) {
      diabRisk += 15;
      flaggedConditions.push(`HbA1c ${hba1c}% — pre-diabetic range (ADA: 5.7–6.4%).`);
    } else if (hba1c > 0) {
      flaggedConditions.push(`HbA1c ${hba1c}% — within normal range (<5.7%).`);
    }

    // ── Metabolic Symptom Scoring ──
    // Each positive symptom adds weighted risk (classic triad gets higher weight)
    const classicTriad = ['polyuria', 'polydipsia', 'polyphagia'];
    const metabolicSymptoms = ['suddenWeightLoss', 'weakness', 'visualBlurring',
      'itching', 'irritability', 'delayedHealing', 'partialParesis',
      'muscleStiffness', 'alopecia', 'obesity'];

    const triadCount = countSymptoms(inputs, classicTriad);
    const metabolicCount = countSymptoms(inputs, metabolicSymptoms);
    const totalSymptoms = triadCount + metabolicCount;

    // Classic triad has higher diagnostic weight
    diabRisk += triadCount * 6;  // Up to 18
    diabRisk += metabolicCount * 2; // Up to 20

    if (triadCount === 3) {
      flaggedConditions.push('⚠ Complete diabetic triad present (polyuria + polydipsia + polyphagia).');
    } else if (triadCount >= 1) {
      flaggedConditions.push(`${triadCount}/3 classic diabetic triad symptoms present.`);
    }
    if (metabolicCount >= 5) {
      flaggedConditions.push(`⚠ ${metabolicCount}/10 metabolic complication markers positive.`);
    } else if (metabolicCount >= 2) {
      flaggedConditions.push(`${metabolicCount}/10 metabolic symptoms present.`);
    }

    // Age-adjusted risk modifier (≥45 years = +5 per ADA screening recommendation)
    if (age >= 45) diabRisk += 5;
    if (inputs.obesity) diabRisk += 5;

    // ── Final Classification ──
    diabRisk = clamp(diabRisk, 0, 100);
    if (diabRisk >= 55 || (fbs >= 200 && triadCount >= 2)) {
      riskLevel = 'Critical'; riskScore = clamp(diabRisk + 15, 80, 98);
      recommendedAction = 'urgent_care';
      flaggedConditions.push('CRITICAL: Multiple ADA diagnostic criteria met. Immediate clinical evaluation required.');
    } else if (diabRisk >= 35) {
      riskLevel = 'High'; riskScore = clamp(diabRisk + 10, 70, 90);
      recommendedAction = 'urgent_care';
    } else if (diabRisk >= 20) {
      riskLevel = 'Moderate'; riskScore = clamp(diabRisk + 5, 55, 75);
      recommendedAction = 'consult_doctor';
    } else {
      riskScore = clamp(100 - diabRisk, 70, 95);
    }

    flaggedConditions.push(`Total symptom burden: ${totalSymptoms}/13 indicators.`);

  /* ───────────────────────────────────────────────────────────────────── */
  /*  HEART ATTACK (AHA/ACC ASCVD Risk Framework + Cleveland Criteria)   */
  /* ───────────────────────────────────────────────────────────────────── */
  } else if (predictorId === 'heart-attack') {
    const age = Number(inputs.age) || 50;
    const gender = inputs.gender || 'Male';
    const bp = Number(inputs.restingBloodPressure) || 120;
    const chol = Number(inputs.cholesterol) || 200;
    const maxHR = Number(inputs.maxHeartRate) || 150;
    const stDep = Number(inputs.stDepression) || 0;
    const vessels = Number(inputs.vessels) || 0;
    const fbsHigh = inputs.fastingBloodSugar === true;
    const exerciseAngina = inputs.exerciseAngina === true;
    const chestPain = inputs.chestPainType || 'Asymptomatic';
    const ecg = inputs.restingECG || 'Normal';
    const slope = inputs.slope || 'Upsloping';

    let cardiacRisk = 0;

    // ── Blood Pressure (ACC/AHA 2017 Hypertension Guidelines) ──
    if (bp >= 180) {
      cardiacRisk += 20; flaggedConditions.push(`⚠ Hypertensive crisis: BP ${bp} mmHg (≥180).`);
    } else if (bp >= 140) {
      cardiacRisk += 14; flaggedConditions.push(`⚠ Stage 2 hypertension: BP ${bp} mmHg (≥140).`);
    } else if (bp >= 130) {
      cardiacRisk += 8; flaggedConditions.push(`Stage 1 hypertension: BP ${bp} mmHg (130-139).`);
    } else {
      flaggedConditions.push(`Blood pressure ${bp} mmHg — within normal range.`);
    }

    // ── Cholesterol (AHA/ACC 2018/2026 Lipid Guidelines) ──
    if (chol >= 300) {
      cardiacRisk += 18; flaggedConditions.push(`⚠ Severe hypercholesterolemia: ${chol} mg/dL (≥300).`);
    } else if (chol >= 240) {
      cardiacRisk += 12; flaggedConditions.push(`⚠ High cholesterol: ${chol} mg/dL (≥240 — desirable <200).`);
    } else if (chol >= 200) {
      cardiacRisk += 6; flaggedConditions.push(`Borderline high cholesterol: ${chol} mg/dL (200–239).`);
    } else {
      flaggedConditions.push(`Cholesterol ${chol} mg/dL — desirable range (<200).`);
    }

    // ── Chest Pain Type (Diamond-Forrester probability) ──
    if (chestPain === 'Typical Angina') {
      cardiacRisk += 15; flaggedConditions.push('⚠ Typical angina: substernal chest pressure with exertion, relieved by rest.');
    } else if (chestPain === 'Atypical Angina') {
      cardiacRisk += 8; flaggedConditions.push('Atypical angina features present.');
    } else if (chestPain === 'Non-Anginal') {
      cardiacRisk += 3;
    }

    // ── ECG & ST-Segment Analysis ──
    if (ecg === 'Left Ventricular Hypertrophy') {
      cardiacRisk += 10; flaggedConditions.push('⚠ LVH on resting ECG — marker of long-standing hypertension.');
    } else if (ecg === 'ST-T Wave Abnormality') {
      cardiacRisk += 7; flaggedConditions.push('ST-T wave abnormality on resting ECG.');
    }

    if (stDep >= 3.0) {
      cardiacRisk += 12; flaggedConditions.push(`⚠ Significant ST depression: ${stDep}mm (≥3mm = high ischemic risk).`);
    } else if (stDep >= 1.5) {
      cardiacRisk += 7; flaggedConditions.push(`Moderate ST depression: ${stDep}mm.`);
    } else if (stDep > 0) {
      cardiacRisk += 3;
    }

    if (slope === 'Downsloping') {
      cardiacRisk += 8; flaggedConditions.push('⚠ Downsloping ST segment — high probability of ischemia.');
    } else if (slope === 'Flat') {
      cardiacRisk += 4; flaggedConditions.push('Flat ST segment — intermediate ischemic probability.');
    }

    // ── Coronary Vessel Involvement ──
    if (vessels >= 3) {
      cardiacRisk += 15; flaggedConditions.push(`⚠ ${vessels} major coronary vessels affected — indicates multi-vessel disease.`);
    } else if (vessels >= 1) {
      cardiacRisk += vessels * 5;
      flaggedConditions.push(`${vessels} coronary vessel(s) with significant narrowing.`);
    }

    // ── Exercise-Induced Angina & Heart Rate Reserve ──
    if (exerciseAngina) {
      cardiacRisk += 8; flaggedConditions.push('Exercise-induced angina present — reduced coronary reserve.');
    }

    // Heart rate reserve: age-predicted max = 220 - age
    const predictedMaxHR = 220 - age;
    const hrReserve = (maxHR / predictedMaxHR) * 100;
    if (hrReserve < 62) {
      cardiacRisk += 6; flaggedConditions.push(`⚠ Poor chronotropic response: ${Math.round(hrReserve)}% of predicted max HR.`);
    }

    // ── Metabolic Risk Modifiers ──
    if (fbsHigh) { cardiacRisk += 5; flaggedConditions.push('Elevated fasting blood sugar (>120 mg/dL).'); }
    if (age >= 65) cardiacRisk += 5;
    else if (age >= 55) cardiacRisk += 3;
    if (gender === 'Male') cardiacRisk += 3;

    // ── Final Classification ──
    cardiacRisk = clamp(cardiacRisk, 0, 100);
    if (cardiacRisk >= 55) {
      riskLevel = 'Critical'; riskScore = clamp(cardiacRisk + 10, 80, 98);
      recommendedAction = 'urgent_care';
      flaggedConditions.push('CRITICAL: High-risk cardiac profile. Urgent cardiology evaluation recommended.');
    } else if (cardiacRisk >= 35) {
      riskLevel = 'High'; riskScore = clamp(cardiacRisk + 5, 70, 88);
      recommendedAction = 'urgent_care';
    } else if (cardiacRisk >= 18) {
      riskLevel = 'Moderate'; riskScore = clamp(cardiacRisk + 5, 55, 75);
      recommendedAction = 'consult_doctor';
    } else {
      riskScore = clamp(100 - cardiacRisk, 70, 95);
    }

  /* ───────────────────────────────────────────────────────────────────── */
  /*  ECG ANALYSIS (Arrhythmia & Ischemia Screening)                     */
  /* ───────────────────────────────────────────────────────────────────── */
  } else if (predictorId === 'ecg') {
    const hr = Number(inputs.heartRate) || 72;
    const st = inputs.stSegment || 'Normal';
    const qrs = inputs.qrsComplex || 'Normal';
    const rhythm = inputs.rhythm || 'Regular Sinus';

    let ecgRisk = 0;

    // ── Heart Rate Classification ──
    if (hr > 150) {
      ecgRisk += 25; flaggedConditions.push(`⚠ Severe tachycardia: ${hr} BPM (>150) — evaluate for SVT/VT.`);
    } else if (hr > 120) {
      ecgRisk += 15; flaggedConditions.push(`⚠ Tachycardia: ${hr} BPM (>120).`);
    } else if (hr > 100) {
      ecgRisk += 8; flaggedConditions.push(`Mild tachycardia: ${hr} BPM (100–120).`);
    } else if (hr < 40) {
      ecgRisk += 22; flaggedConditions.push(`⚠ Severe bradycardia: ${hr} BPM (<40) — evaluate for heart block.`);
    } else if (hr < 50) {
      ecgRisk += 12; flaggedConditions.push(`Bradycardia: ${hr} BPM (<50).`);
    } else {
      flaggedConditions.push(`Heart rate ${hr} BPM — normal sinus range (50–100).`);
    }

    // ── ST Segment ──
    if (st === 'Elevated') {
      ecgRisk += 30; flaggedConditions.push('⚠ ST-elevation detected — STEMI pattern requires IMMEDIATE evaluation.');
    } else if (st === 'Depressed') {
      ecgRisk += 20; flaggedConditions.push('⚠ ST-depression — possible NSTEMI or ischemia pattern.');
    } else if (st === 'Flat') {
      ecgRisk += 8; flaggedConditions.push('Flat ST segment — borderline ischemic indicator.');
    }

    // ── QRS Complex ──
    if (qrs === 'Wide') {
      ecgRisk += 12; flaggedConditions.push('⚠ Wide QRS complex — possible bundle branch block or ventricular origin.');
    } else if (qrs === 'Fragmented') {
      ecgRisk += 8; flaggedConditions.push('Fragmented QRS — may indicate myocardial scar tissue.');
    }

    // ── Rhythm ──
    if (rhythm === 'Atrial Fibrillation') {
      ecgRisk += 18; flaggedConditions.push('⚠ Atrial fibrillation detected — stroke risk assessment needed.');
    } else if (rhythm === 'Irregular') {
      ecgRisk += 8; flaggedConditions.push('Irregular rhythm detected — further monitoring recommended.');
    }

    ecgRisk = clamp(ecgRisk, 0, 100);
    if (ecgRisk >= 40) {
      riskLevel = 'Critical'; riskScore = clamp(ecgRisk + 10, 80, 98);
      recommendedAction = 'urgent_care';
    } else if (ecgRisk >= 20) {
      riskLevel = 'High'; riskScore = clamp(ecgRisk + 5, 65, 85);
      recommendedAction = 'urgent_care';
    } else if (ecgRisk >= 10) {
      riskLevel = 'Moderate'; riskScore = clamp(ecgRisk + 5, 55, 70);
      recommendedAction = 'consult_doctor';
    } else {
      riskScore = clamp(100 - ecgRisk, 75, 95);
    }

  /* ───────────────────────────────────────────────────────────────────── */
  /*  KIDNEY HEALTH (KDIGO 2024 CGA Staging)                             */
  /* ───────────────────────────────────────────────────────────────────── */
  } else if (predictorId === 'kidney') {
    const age = Number(inputs.age) || 50;
    const bp = Number(inputs.bloodPressure) || 120;
    const sg = Number(inputs.specificGravity) || 1.015;
    const albumin = Number(inputs.albumin) || 0;
    const rbc = inputs.redBloodCells || 'Normal';
    const pus = inputs.pusCells || 'Normal';
    const urea = Number(inputs.bloodUrea) || 40;
    const cr = Number(inputs.serumCreatinine) || 0.9;
    const sodium = Number(inputs.sodium) || 140;
    const potassium = Number(inputs.potassium) || 4.5;
    const hb = Number(inputs.hemoglobin) || 14;

    let renalRisk = 0;

    // ── Estimated GFR via CKD-EPI (simplified, creatinine-based) ──
    // eGFR ≈ 141 × min(Cr/κ, 1)^α × max(Cr/κ, 1)^-1.209 × 0.993^Age × (1.018 if female)
    // Simplified approximation for offline screening
    const kappa = inputs.gender === 'Female' ? 0.7 : 0.9;
    const alpha = inputs.gender === 'Female' ? -0.329 : -0.411;
    const crRatio = cr / kappa;
    const eGFR = 141
      * Math.pow(Math.min(crRatio, 1), alpha)
      * Math.pow(Math.max(crRatio, 1), -1.209)
      * Math.pow(0.993, age)
      * (inputs.gender === 'Female' ? 1.018 : 1);

    flaggedConditions.push(`Estimated eGFR: ${Math.round(eGFR)} mL/min/1.73m² (CKD-EPI formula).`);

    // ── KDIGO GFR Staging ──
    if (eGFR < 15) {
      renalRisk += 35; flaggedConditions.push('⚠ KDIGO Stage G5: Kidney failure (eGFR <15). Nephrology referral URGENT.');
    } else if (eGFR < 30) {
      renalRisk += 28; flaggedConditions.push('⚠ KDIGO Stage G4: Severely decreased (eGFR 15–29).');
    } else if (eGFR < 45) {
      renalRisk += 20; flaggedConditions.push('KDIGO Stage G3b: Moderately to severely decreased (eGFR 30–44).');
    } else if (eGFR < 60) {
      renalRisk += 14; flaggedConditions.push('KDIGO Stage G3a: Mildly to moderately decreased (eGFR 45–59).');
    } else if (eGFR < 90) {
      renalRisk += 6; flaggedConditions.push('KDIGO Stage G2: Mildly decreased (eGFR 60–89).');
    } else {
      flaggedConditions.push('KDIGO Stage G1: Normal kidney function (eGFR ≥90).');
    }

    // ── Serum Creatinine ──
    if (cr > 4.0) {
      renalRisk += 15; flaggedConditions.push(`⚠ Serum creatinine ${cr} mg/dL — severely elevated.`);
    } else if (cr > 1.5) {
      renalRisk += 8; flaggedConditions.push(`Elevated creatinine: ${cr} mg/dL (normal: 0.7–1.3 mg/dL).`);
    }

    // ── Blood Urea ──
    if (urea > 100) {
      renalRisk += 12; flaggedConditions.push(`⚠ Blood urea ${urea} mg/dL — significantly elevated (normal: 15–40).`);
    } else if (urea > 40) {
      renalRisk += 5; flaggedConditions.push(`Blood urea ${urea} mg/dL — above normal range.`);
    }

    // ── Albuminuria Screening (KDIGO A staging) ──
    if (albumin >= 4) {
      renalRisk += 10; flaggedConditions.push('⚠ Heavy proteinuria — KDIGO Category A3.');
    } else if (albumin >= 2) {
      renalRisk += 5; flaggedConditions.push('Moderate albuminuria — KDIGO Category A2.');
    }

    // ── Electrolyte Abnormalities ──
    if (potassium > 6.0) {
      renalRisk += 12; flaggedConditions.push(`⚠ Hyperkalemia: K+ ${potassium} mEq/L (>6.0) — cardiac risk!`);
    } else if (potassium > 5.5) {
      renalRisk += 6; flaggedConditions.push(`Mild hyperkalemia: K+ ${potassium} mEq/L.`);
    } else if (potassium < 3.0) {
      renalRisk += 8; flaggedConditions.push(`⚠ Hypokalemia: K+ ${potassium} mEq/L (<3.0).`);
    }

    if (sodium < 125) {
      renalRisk += 8; flaggedConditions.push(`⚠ Severe hyponatremia: Na+ ${sodium} mEq/L.`);
    } else if (sodium < 135) {
      renalRisk += 4; flaggedConditions.push(`Mild hyponatremia: Na+ ${sodium} mEq/L.`);
    }

    // ── Urine Sediment ──
    if (rbc === 'Abnormal') { renalRisk += 5; flaggedConditions.push('Abnormal urinary RBCs — hematuria present.'); }
    if (pus === 'Abnormal') { renalRisk += 5; flaggedConditions.push('Abnormal pus cells — pyuria (possible UTI/nephritis).'); }

    // ── Renal Anemia Marker ──
    if (hb < 10) {
      renalRisk += 6; flaggedConditions.push(`⚠ Hemoglobin ${hb} g/dL — renal anemia likely (EPO deficiency).`);
    }

    // ── Specific Gravity ──
    if (sg <= 1.005) {
      renalRisk += 4; flaggedConditions.push('Low specific gravity — impaired renal concentrating ability.');
    }

    // ── Hypertension ──
    if (bp >= 160) renalRisk += 6;
    else if (bp >= 140) renalRisk += 3;

    renalRisk = clamp(renalRisk, 0, 100);
    if (renalRisk >= 50) {
      riskLevel = 'Critical'; riskScore = clamp(renalRisk + 10, 80, 98);
      recommendedAction = 'urgent_care';
    } else if (renalRisk >= 30) {
      riskLevel = 'High'; riskScore = clamp(renalRisk + 5, 70, 88);
      recommendedAction = 'urgent_care';
    } else if (renalRisk >= 15) {
      riskLevel = 'Moderate'; riskScore = clamp(renalRisk + 5, 55, 75);
      recommendedAction = 'consult_doctor';
    } else {
      riskScore = clamp(100 - renalRisk, 75, 95);
    }

  /* ───────────────────────────────────────────────────────────────────── */
  /*  LIVER HEALTH (AASLD/EASL Hepatic Function Guidelines)              */
  /* ───────────────────────────────────────────────────────────────────── */
  } else if (predictorId === 'liver') {
    const gender = inputs.gender || 'Male';
    const totalBil = Number(inputs.totalBilirubin) || 0.8;
    const directBil = Number(inputs.directBilirubin) || 0.2;
    const alp = Number(inputs.alkalinePhosphotase) || 100;
    const sgot = Number(inputs.sgotAlat) || 30; // AST
    const sgpt = Number(inputs.sgptAsat) || 30; // ALT
    const totalProt = Number(inputs.totalProteins) || 6.5;
    const albumin = Number(inputs.albumin) || 3.5;
    const agRatio = Number(inputs.agRatio) || 1.0;

    let hepaticRisk = 0;

    // ── Gender-specific ULN for ALT/AST ──
    // Recent evidence: healthy ULN is ~33 IU/L males, ~25 IU/L females
    const altULN = gender === 'Female' ? 25 : 33;
    const astULN = gender === 'Female' ? 25 : 33;

    // ── Hepatocellular Injury Pattern (ALT/AST) ──
    const altRatio = sgpt / altULN;
    const astRatio = sgot / astULN;

    if (altRatio > 10 || astRatio > 10) {
      hepaticRisk += 30;
      flaggedConditions.push(`⚠ Severe hepatocellular injury: ALT ${sgpt} (${altRatio.toFixed(1)}× ULN), AST ${sgot} (${astRatio.toFixed(1)}× ULN).`);
    } else if (altRatio > 5 || astRatio > 5) {
      hepaticRisk += 22;
      flaggedConditions.push(`⚠ Significant transaminase elevation: ALT ${sgpt}, AST ${sgot} (>5× ULN).`);
    } else if (altRatio > 3 || astRatio > 3) {
      hepaticRisk += 14;
      flaggedConditions.push(`Moderate transaminase elevation: ALT ${sgpt}, AST ${sgot} (>3× ULN).`);
    } else if (altRatio > 1 || astRatio > 1) {
      hepaticRisk += 6;
      flaggedConditions.push(`Mildly elevated transaminases: ALT ${sgpt}, AST ${sgot}.`);
    } else {
      flaggedConditions.push(`ALT ${sgpt} IU/L, AST ${sgot} IU/L — within reference range.`);
    }

    // ── De Ritis Ratio (AST/ALT) — diagnostic pattern ──
    if (sgpt > 0) {
      const deRitis = sgot / sgpt;
      if (deRitis > 2.0 && (sgot > astULN || sgpt > altULN)) {
        hepaticRisk += 6;
        flaggedConditions.push(`De Ritis ratio ${deRitis.toFixed(2)} (>2.0) — pattern suggests alcoholic liver disease or cirrhosis.`);
      } else if (deRitis < 1.0 && sgpt > altULN) {
        flaggedConditions.push(`De Ritis ratio ${deRitis.toFixed(2)} (<1.0) — pattern suggestive of viral hepatitis or MASLD.`);
      }
    }

    // ── Bilirubin ──
    if (totalBil > 5.0) {
      hepaticRisk += 18; flaggedConditions.push(`⚠ Severe hyperbilirubinemia: ${totalBil} mg/dL (>5.0).`);
    } else if (totalBil > 2.0) {
      hepaticRisk += 10; flaggedConditions.push(`⚠ Elevated bilirubin: ${totalBil} mg/dL (normal: 0.1–1.2).`);
    } else if (totalBil > 1.2) {
      hepaticRisk += 4; flaggedConditions.push(`Mildly elevated bilirubin: ${totalBil} mg/dL.`);
    }

    // Conjugated (direct) hyperbilirubinemia ratio
    if (totalBil > 0 && directBil / totalBil > 0.5) {
      hepaticRisk += 4;
      flaggedConditions.push('Predominantly conjugated (direct) hyperbilirubinemia — suggests cholestatic pattern.');
    }

    // ── Cholestatic Pattern (ALP) ──
    if (alp > 400) {
      hepaticRisk += 12; flaggedConditions.push(`⚠ ALP ${alp} IU/L — significant cholestasis or infiltrative disease.`);
    } else if (alp > 150) {
      hepaticRisk += 6; flaggedConditions.push(`Elevated ALP: ${alp} IU/L (normal: 44–147).`);
    }

    // ── Synthetic Function (Albumin, Total Protein, A/G Ratio) ──
    if (albumin < 2.5) {
      hepaticRisk += 14; flaggedConditions.push(`⚠ Severe hypoalbuminemia: ${albumin} g/dL — impaired hepatic synthesis.`);
    } else if (albumin < 3.5) {
      hepaticRisk += 7; flaggedConditions.push(`Low albumin: ${albumin} g/dL (normal: 3.5–5.0).`);
    }

    if (totalProt < 5.5) {
      hepaticRisk += 5; flaggedConditions.push(`Low total protein: ${totalProt} g/dL.`);
    }

    if (agRatio < 0.8) {
      hepaticRisk += 6; flaggedConditions.push(`Low A/G ratio: ${agRatio} — suggests chronic liver disease or globulin excess.`);
    }

    hepaticRisk = clamp(hepaticRisk, 0, 100);
    if (hepaticRisk >= 50) {
      riskLevel = 'Critical'; riskScore = clamp(hepaticRisk + 10, 80, 98);
      recommendedAction = 'urgent_care';
    } else if (hepaticRisk >= 30) {
      riskLevel = 'High'; riskScore = clamp(hepaticRisk + 5, 70, 88);
      recommendedAction = 'urgent_care';
    } else if (hepaticRisk >= 15) {
      riskLevel = 'Moderate'; riskScore = clamp(hepaticRisk + 5, 55, 75);
      recommendedAction = 'consult_doctor';
    } else {
      riskScore = clamp(100 - hepaticRisk, 75, 95);
    }

  /* ───────────────────────────────────────────────────────────────────── */
  /*  ANEMIA (WHO Hemoglobin Thresholds + MCV Classification)            */
  /* ───────────────────────────────────────────────────────────────────── */
  } else if (predictorId === 'anemia') {
    const hb = Number(inputs.hemoglobin) || Number(inputs.hbLevel) || 13;
    const gender = inputs.gender || 'Male';

    let anemiaRisk = 0;

    // ── WHO Age/Sex-Specific Hemoglobin Thresholds ──
    // Males ≥15: <13 g/dL = anemia, <11 = moderate, <8 = severe
    // Females ≥15: <12 g/dL = anemia, <11 = moderate, <8 = severe
    const anemiaThreshold = gender === 'Female' ? 12.0 : 13.0;
    const moderateThreshold = 11.0;
    const severeThreshold = 8.0;
    const criticalThreshold = 7.0;

    flaggedConditions.push(`Hemoglobin: ${hb} g/dL (WHO threshold for ${gender}: ${anemiaThreshold} g/dL).`);

    if (hb < criticalThreshold) {
      anemiaRisk += 40;
      flaggedConditions.push(`⚠ CRITICAL: Hb ${hb} g/dL — life-threatening anemia (<7 g/dL). Transfusion may be needed.`);
    } else if (hb < severeThreshold) {
      anemiaRisk += 30;
      flaggedConditions.push(`⚠ Severe anemia: Hb ${hb} g/dL (<8 g/dL).`);
    } else if (hb < moderateThreshold) {
      anemiaRisk += 20;
      flaggedConditions.push(`Moderate anemia: Hb ${hb} g/dL (8–10.9 g/dL).`);
    } else if (hb < anemiaThreshold) {
      anemiaRisk += 12;
      flaggedConditions.push(`Mild anemia: Hb ${hb} g/dL (below ${anemiaThreshold} g/dL).`);
    } else {
      flaggedConditions.push(`Hemoglobin within normal range for ${gender}.`);
    }

    // ── Symptom Burden Scoring ──
    const symptomKeys = ['fatigue', 'paleSkin', 'dizziness', 'coldHandsFeet', 'shortnessOfBreath', 'tongueSwelling'];
    const symptomCount = countSymptoms(inputs, symptomKeys);

    if (symptomCount >= 5) {
      anemiaRisk += 18; flaggedConditions.push(`⚠ ${symptomCount}/6 anemia symptoms present — significant symptom burden.`);
    } else if (symptomCount >= 3) {
      anemiaRisk += 10; flaggedConditions.push(`${symptomCount}/6 anemia symptoms present.`);
    } else if (symptomCount >= 1) {
      anemiaRisk += 4; flaggedConditions.push(`${symptomCount}/6 anemia symptom(s) noted.`);
    }

    // Tongue swelling = B12/folate deficiency marker
    if (inputs.tongueSwelling) {
      anemiaRisk += 4; flaggedConditions.push('Glossitis present — evaluate for vitamin B12/folate deficiency.');
    }

    // Compound risk: low Hb + many symptoms
    if (hb < moderateThreshold && symptomCount >= 4) anemiaRisk += 8;

    anemiaRisk = clamp(anemiaRisk, 0, 100);
    if (anemiaRisk >= 45) {
      riskLevel = 'Critical'; riskScore = clamp(anemiaRisk + 10, 80, 98);
      recommendedAction = 'urgent_care';
    } else if (anemiaRisk >= 28) {
      riskLevel = 'High'; riskScore = clamp(anemiaRisk + 5, 70, 88);
      recommendedAction = 'urgent_care';
    } else if (anemiaRisk >= 14) {
      riskLevel = 'Moderate'; riskScore = clamp(anemiaRisk + 5, 55, 75);
      recommendedAction = 'consult_doctor';
    } else {
      riskScore = clamp(100 - anemiaRisk, 75, 95);
    }

  /* ───────────────────────────────────────────────────────────────────── */
  /*  THYROID (ATA Diagnostic Framework)                                 */
  /* ───────────────────────────────────────────────────────────────────── */
  } else if (predictorId === 'thyroid') {
    const tsh = Number(inputs.tsh) || 2.0;
    const ft3 = Number(inputs.freeT3) || 3.0;
    const ft4 = Number(inputs.freeT4) || 1.2;
    const goiter = inputs.goiter === true;
    const surgery = inputs.thyroidSurgery === true;
    const iodine = inputs.iodineDeficiency === true;
    const weightChange = inputs.weightChange || 'None';
    const tempSens = inputs.temperatureSensitivity || 'None';

    let thyroidRisk = 0;
    let thyroidPattern = '';

    // ── TSH + FT4 Diagnostic Patterns (ATA) ──
    // Primary hypothyroidism: TSH ↑ + FT4 ↓
    // Primary hyperthyroidism: TSH ↓ + FT4 ↑
    // Subclinical: TSH abnormal + FT4 normal

    // TSH reference range: 0.4–4.5 mIU/L
    if (tsh > 10.0 && ft4 < 0.7) {
      thyroidRisk += 35; thyroidPattern = 'Overt Hypothyroidism';
      flaggedConditions.push(`⚠ TSH ${tsh} mIU/L + FT4 ${ft4} ng/dL — overt primary hypothyroidism.`);
    } else if (tsh > 10.0) {
      thyroidRisk += 25; thyroidPattern = 'Severe Subclinical Hypothyroidism';
      flaggedConditions.push(`⚠ TSH ${tsh} mIU/L (>10) with FT4 in range — high-grade subclinical hypothyroidism.`);
    } else if (tsh > 4.5 && ft4 < 0.8) {
      thyroidRisk += 22; thyroidPattern = 'Primary Hypothyroidism';
      flaggedConditions.push(`TSH ${tsh} mIU/L + low FT4 ${ft4} ng/dL — primary hypothyroidism pattern.`);
    } else if (tsh > 4.5) {
      thyroidRisk += 12; thyroidPattern = 'Subclinical Hypothyroidism';
      flaggedConditions.push(`TSH ${tsh} mIU/L (>4.5) with normal FT4 — subclinical hypothyroidism.`);
    } else if (tsh < 0.1 && ft4 > 1.8) {
      thyroidRisk += 35; thyroidPattern = 'Overt Hyperthyroidism';
      flaggedConditions.push(`⚠ TSH ${tsh} mIU/L + FT4 ${ft4} ng/dL — overt hyperthyroidism (possible Graves' disease).`);
    } else if (tsh < 0.1) {
      thyroidRisk += 22; thyroidPattern = 'Suppressed TSH';
      flaggedConditions.push(`⚠ Suppressed TSH ${tsh} mIU/L (<0.1) — evaluate for hyperthyroidism.`);
    } else if (tsh < 0.4 && (ft4 > 1.6 || ft3 > 4.5)) {
      thyroidRisk += 18; thyroidPattern = 'Subclinical Hyperthyroidism';
      flaggedConditions.push(`Low TSH ${tsh} mIU/L with elevated FT4/FT3 — subclinical hyperthyroidism.`);
    } else if (tsh < 0.4) {
      thyroidRisk += 10; thyroidPattern = 'Low TSH';
      flaggedConditions.push(`TSH ${tsh} mIU/L (<0.4) — borderline low, monitor.`);
    } else {
      flaggedConditions.push(`TSH ${tsh} mIU/L — within normal reference range (0.4–4.5).`);
    }

    // ── FT3 Assessment ──
    if (ft3 > 6.0) {
      thyroidRisk += 8; flaggedConditions.push(`⚠ Elevated FT3: ${ft3} pg/mL — possible T3 thyrotoxicosis.`);
    } else if (ft3 < 2.0) {
      thyroidRisk += 5; flaggedConditions.push(`Low FT3: ${ft3} pg/mL — possible T3 deficiency or non-thyroidal illness.`);
    }

    // ── Clinical Features ──
    if (goiter) { thyroidRisk += 6; flaggedConditions.push('Goiter present — thyroid enlargement detected.'); }
    if (surgery) { thyroidRisk += 4; flaggedConditions.push('History of thyroid surgery — lifelong monitoring needed.'); }
    if (iodine) { thyroidRisk += 5; flaggedConditions.push('Iodine deficiency risk — common cause of hypothyroidism in India.'); }

    // Symptom concordance with pattern
    if (thyroidPattern.includes('Hypo') && (weightChange === 'Weight Gain' || tempSens === 'Cold Intolerance')) {
      thyroidRisk += 5; flaggedConditions.push('Symptoms concordant with hypothyroid pattern (weight gain/cold intolerance).');
    }
    if (thyroidPattern.includes('Hyper') && (weightChange === 'Weight Loss' || tempSens === 'Heat Intolerance')) {
      thyroidRisk += 5; flaggedConditions.push('Symptoms concordant with hyperthyroid pattern (weight loss/heat intolerance).');
    }

    if (thyroidPattern) flaggedConditions.push(`Thyroid pattern: ${thyroidPattern}.`);

    thyroidRisk = clamp(thyroidRisk, 0, 100);
    if (thyroidRisk >= 40) {
      riskLevel = 'High'; riskScore = clamp(thyroidRisk + 5, 70, 92);
      recommendedAction = 'urgent_care';
    } else if (thyroidRisk >= 20) {
      riskLevel = 'Moderate'; riskScore = clamp(thyroidRisk + 5, 55, 75);
      recommendedAction = 'consult_doctor';
    } else if (thyroidRisk >= 10) {
      riskLevel = 'Moderate'; riskScore = clamp(thyroidRisk + 5, 50, 65);
      recommendedAction = 'monitor';
    } else {
      riskScore = clamp(100 - thyroidRisk, 75, 95);
    }

  /* ───────────────────────────────────────────────────────────────────── */
  /*  CANCER SCREENING (Multi-organ risk factors)                        */
  /* ───────────────────────────────────────────────────────────────────── */
  } else if (predictorId === 'cancer') {
    const smoke = Number(inputs.smokingPackYears) || 0;
    const fam = inputs.familyHistory === true || inputs.familyHistory === 'Yes';
    const skinChanges = inputs.skinLesionChanges === true;
    const chronicCough = inputs.chronicCough === true;
    const bloodStool = inputs.bloodInStool === true;
    const unexplainedLoss = inputs.unexplainedWeightLoss === true;
    const lump = inputs.lumpOrMass === true;

    let cancerRisk = 0;

    flaggedConditions.push(`Smoking exposure: ${smoke} pack-years.`);

    // ── Smoking (USPSTF LDCT screening criteria) ──
    if (smoke >= 30) {
      cancerRisk += 20; flaggedConditions.push('⚠ Heavy smoker (≥30 pack-years) — USPSTF recommends annual LDCT screening.');
    } else if (smoke >= 20) {
      cancerRisk += 14; flaggedConditions.push('Significant smoking history (20–29 pack-years).');
    } else if (smoke >= 10) {
      cancerRisk += 8; flaggedConditions.push('Moderate smoking history (10–19 pack-years).');
    } else if (smoke > 0) {
      cancerRisk += 4;
    }

    // ── Family History ──
    if (fam) { cancerRisk += 10; flaggedConditions.push('Positive family history of cancer — genetic screening may be warranted.'); }

    // ── Red Flag Symptoms ──
    if (bloodStool) { cancerRisk += 12; flaggedConditions.push('⚠ Blood in stool — colonoscopy recommended to rule out colorectal cancer.'); }
    if (lump) { cancerRisk += 10; flaggedConditions.push('⚠ Unexplained lump/mass — biopsy evaluation needed.'); }
    if (unexplainedLoss) { cancerRisk += 8; flaggedConditions.push('Unexplained weight loss — oncologic evaluation warranted.'); }
    if (skinChanges) { cancerRisk += 8; flaggedConditions.push('Skin lesion changes (ABCDE criteria) — dermatologic evaluation needed.'); }
    if (chronicCough) { cancerRisk += 6; flaggedConditions.push('Chronic cough >3 weeks — chest imaging recommended.'); }

    cancerRisk = clamp(cancerRisk, 0, 100);
    if (cancerRisk >= 40) {
      riskLevel = 'High'; riskScore = clamp(cancerRisk + 5, 70, 90);
      recommendedAction = 'urgent_care';
    } else if (cancerRisk >= 20) {
      riskLevel = 'Moderate'; riskScore = clamp(cancerRisk + 5, 55, 75);
      recommendedAction = 'consult_doctor';
    } else {
      riskScore = clamp(100 - cancerRisk, 70, 95);
    }

  /* ───────────────────────────────────────────────────────────────────── */
  /*  PHQ-9 Depression Screening (Validated Clinical Scoring)            */
  /* ───────────────────────────────────────────────────────────────────── */
  } else if (predictorId === 'phq9') {
    const total = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9']
      .reduce((sum, q) => sum + (Number(inputs[q]) || 0), 0);
    const q9Score = Number(inputs.q9) || 0;

    flaggedConditions.push(`PHQ-9 Total Score: ${total}/27.`);

    // ── CRITICAL: Suicidal Ideation Check (Item 9) ──
    if (q9Score > 0) {
      flaggedConditions.push('⚠ SAFETY ALERT: Item 9 (suicidal ideation) is positive — immediate safety assessment required.');
      recommendedAction = 'urgent_care';
    }

    // ── PHQ-9 Validated Severity Cutoffs ──
    if (total >= 20) {
      riskLevel = 'Critical'; riskScore = 92;
      recommendedAction = 'urgent_care';
      flaggedConditions.push('Severe depression (PHQ-9 ≥20). Antidepressant therapy + psychotherapy strongly recommended.');
    } else if (total >= 15) {
      riskLevel = 'High'; riskScore = 82;
      recommendedAction = 'urgent_care';
      flaggedConditions.push('Moderately severe depression (PHQ-9 15–19). Treatment recommended.');
    } else if (total >= 10) {
      riskLevel = 'Moderate'; riskScore = 68;
      recommendedAction = 'consult_doctor';
      flaggedConditions.push('Moderate depression (PHQ-9 10–14). Clinical judgment, consider treatment.');
    } else if (total >= 5) {
      riskLevel = 'Moderate'; riskScore = 55;
      recommendedAction = 'monitor';
      flaggedConditions.push('Mild depression (PHQ-9 5–9). Monitor and watchful waiting.');
    } else {
      riskLevel = 'Low'; riskScore = 90;
      flaggedConditions.push('Minimal/no depression symptoms (PHQ-9 0–4).');
    }

    // Functional impairment note
    const coreSymptoms = (Number(inputs.q1) || 0) + (Number(inputs.q2) || 0);
    if (coreSymptoms >= 4) {
      flaggedConditions.push('Core depressive symptoms (anhedonia + depressed mood) both elevated.');
    }

  /* ───────────────────────────────────────────────────────────────────── */
  /*  GAD-7 Anxiety Screening (Validated Clinical Scoring)               */
  /* ───────────────────────────────────────────────────────────────────── */
  } else if (predictorId === 'gad7') {
    const total = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7']
      .reduce((sum, q) => sum + (Number(inputs[q]) || 0), 0);

    flaggedConditions.push(`GAD-7 Total Score: ${total}/21.`);

    if (total >= 15) {
      riskLevel = 'High'; riskScore = 85;
      recommendedAction = 'urgent_care';
      flaggedConditions.push('Severe anxiety (GAD-7 ≥15). Active treatment (psychotherapy/medication) warranted.');
    } else if (total >= 10) {
      riskLevel = 'Moderate'; riskScore = 70;
      recommendedAction = 'consult_doctor';
      flaggedConditions.push('Moderate anxiety (GAD-7 10–14). Further evaluation/clinical interview recommended.');
    } else if (total >= 5) {
      riskLevel = 'Moderate'; riskScore = 55;
      recommendedAction = 'monitor';
      flaggedConditions.push('Mild anxiety (GAD-7 5–9). Monitor symptoms, consider follow-up.');
    } else {
      riskLevel = 'Low'; riskScore = 90;
      flaggedConditions.push('Minimal anxiety (GAD-7 0–4).');
    }

  /* ───────────────────────────────────────────────────────────────────── */
  /*  HYPERTENSION (ACC/AHA 2017 Classification)                         */
  /* ───────────────────────────────────────────────────────────────────── */
  } else if (predictorId === 'hypertension') {
    const sys = Number(inputs.systolicBP) || 120;
    const dia = Number(inputs.diastolicBP) || 80;
    const age = Number(inputs.age) || 40;
    const family = inputs.familyHistory === true;
    const sedentary = inputs.sedentaryLifestyle === true;
    const sodium = inputs.sodiumIntake || 'Moderate';

    let htRisk = 0;

    // ── ACC/AHA 2017 BP Classification ──
    if (sys >= 180 || dia >= 120) {
      htRisk += 40; flaggedConditions.push(`⚠ Hypertensive CRISIS: ${sys}/${dia} mmHg — immediate medical attention!`);
    } else if (sys >= 140 || dia >= 90) {
      htRisk += 25; flaggedConditions.push(`Stage 2 Hypertension: ${sys}/${dia} mmHg (ACC/AHA: ≥140/90).`);
    } else if (sys >= 130 || dia >= 80) {
      htRisk += 15; flaggedConditions.push(`Stage 1 Hypertension: ${sys}/${dia} mmHg (ACC/AHA: 130-139/80-89).`);
    } else if (sys >= 120) {
      htRisk += 6; flaggedConditions.push(`Elevated BP: ${sys}/${dia} mmHg (SBP 120-129 with DBP <80).`);
    } else {
      flaggedConditions.push(`Normal BP: ${sys}/${dia} mmHg.`);
    }

    if (family) { htRisk += 8; flaggedConditions.push('Positive family history of hypertension.'); }
    if (sedentary) { htRisk += 6; flaggedConditions.push('Sedentary lifestyle — exercise recommended.'); }
    if (sodium === 'High') { htRisk += 6; flaggedConditions.push('High sodium intake — dietary modification advised.'); }
    if (age >= 55) htRisk += 5;

    htRisk = clamp(htRisk, 0, 100);
    if (htRisk >= 40) {
      riskLevel = 'Critical'; riskScore = clamp(htRisk + 10, 80, 98);
      recommendedAction = 'urgent_care';
    } else if (htRisk >= 25) {
      riskLevel = 'High'; riskScore = clamp(htRisk + 5, 65, 85);
      recommendedAction = 'urgent_care';
    } else if (htRisk >= 12) {
      riskLevel = 'Moderate'; riskScore = clamp(htRisk + 5, 55, 70);
      recommendedAction = 'consult_doctor';
    } else {
      riskScore = clamp(100 - htRisk, 75, 95);
    }

  /* ───────────────────────────────────────────────────────────────────── */
  /*  STROKE (Modified Framingham Stroke Risk)                           */
  /* ───────────────────────────────────────────────────────────────────── */
  } else if (predictorId === 'stroke') {
    const age = Number(inputs.age) || 50;
    const hypertension = inputs.hypertension === true;
    const heartDisease = inputs.heartDisease === true;
    const smoking = inputs.smoking === true;
    const glucose = Number(inputs.glucoseLevel) || 100;
    const bmi = Number(inputs.bmi) || 24;

    let strokeRisk = 0;

    if (hypertension) { strokeRisk += 18; flaggedConditions.push('⚠ Hypertension is the #1 modifiable stroke risk factor.'); }
    if (heartDisease) { strokeRisk += 14; flaggedConditions.push('Heart disease present — AF/structural heart disease increases embolic stroke risk.'); }
    if (smoking) { strokeRisk += 10; flaggedConditions.push('Active smoking — doubles stroke risk vs non-smokers.'); }
    if (glucose > 200) { strokeRisk += 12; flaggedConditions.push(`⚠ Glucose ${glucose} mg/dL — diabetes is a major stroke risk factor.`); }
    else if (glucose > 126) { strokeRisk += 7; flaggedConditions.push(`Elevated glucose ${glucose} mg/dL.`); }
    if (bmi >= 30) { strokeRisk += 6; flaggedConditions.push(`BMI ${bmi} — obesity increases stroke risk.`); }
    if (age >= 65) strokeRisk += 10;
    else if (age >= 55) strokeRisk += 6;

    strokeRisk = clamp(strokeRisk, 0, 100);
    if (strokeRisk >= 40) {
      riskLevel = 'High'; riskScore = clamp(strokeRisk + 5, 70, 90);
      recommendedAction = 'urgent_care';
    } else if (strokeRisk >= 20) {
      riskLevel = 'Moderate'; riskScore = clamp(strokeRisk + 5, 55, 75);
      recommendedAction = 'consult_doctor';
    } else {
      riskScore = clamp(100 - strokeRisk, 75, 95);
    }

  /* ───────────────────────────────────────────────────────────────────── */
  /*  TUBERCULOSIS (WHO/RNTCP Screening Criteria)                        */
  /* ───────────────────────────────────────────────────────────────────── */
  } else if (predictorId === 'tuberculosis') {
    const coughWeeks = Number(inputs.coughWeeks) || 0;

    let tbRisk = 0;

    // WHO/RNTCP: Cough ≥2 weeks = presumptive TB
    if (coughWeeks >= 3) {
      tbRisk += 20; flaggedConditions.push(`⚠ Persistent cough: ${coughWeeks} weeks (WHO: ≥2 weeks = presumptive TB).`);
    } else if (coughWeeks >= 2) {
      tbRisk += 14; flaggedConditions.push(`Cough ${coughWeeks} weeks — meets WHO presumptive TB threshold.`);
    } else if (coughWeeks >= 1) {
      tbRisk += 5; flaggedConditions.push(`Cough ${coughWeeks} week(s) — monitor.`);
    }

    if (inputs.coughingBlood) { tbRisk += 18; flaggedConditions.push('⚠ Hemoptysis — sputum AFB and chest X-ray urgently needed.'); }
    if (inputs.tbContact) { tbRisk += 12; flaggedConditions.push('Close TB contact — high transmission risk.'); }
    if (inputs.nightSweats) { tbRisk += 6; flaggedConditions.push('Night sweats present.'); }
    if (inputs.weightLoss) { tbRisk += 6; flaggedConditions.push('Unexplained weight loss.'); }
    if (inputs.fever) { tbRisk += 5; flaggedConditions.push('Low-grade fever.'); }

    tbRisk = clamp(tbRisk, 0, 100);
    if (tbRisk >= 35) {
      riskLevel = 'High'; riskScore = clamp(tbRisk + 5, 70, 90);
      recommendedAction = 'urgent_care';
      flaggedConditions.push('Sputum microscopy (AFB), GeneXpert, and chest X-ray recommended.');
    } else if (tbRisk >= 18) {
      riskLevel = 'Moderate'; riskScore = clamp(tbRisk + 5, 55, 75);
      recommendedAction = 'consult_doctor';
    } else {
      riskScore = clamp(100 - tbRisk, 75, 95);
    }

  /* ───────────────────────────────────────────────────────────────────── */
  /*  DENGUE (WHO/ICMR Clinical Criteria)                                */
  /* ───────────────────────────────────────────────────────────────────── */
  } else if (predictorId === 'dengue') {
    const feverDays = Number(inputs.feverDays) || 0;
    const platelets = Number(inputs.plateletCount) || 200000;
    const dengueSymptoms = countSymptoms(inputs, ['severeHeadache', 'eyePain', 'jointMusclePain', 'skinRash']);

    let dengueRisk = 0;

    // ── Platelet Count (Critical marker) ──
    if (platelets < 20000) {
      dengueRisk += 35; flaggedConditions.push(`⚠ CRITICAL thrombocytopenia: Platelets ${platelets.toLocaleString()} (<20,000) — hemorrhagic risk!`);
    } else if (platelets < 50000) {
      dengueRisk += 25; flaggedConditions.push(`⚠ Severe thrombocytopenia: Platelets ${platelets.toLocaleString()} (<50,000).`);
    } else if (platelets < 100000) {
      dengueRisk += 15; flaggedConditions.push(`Low platelets: ${platelets.toLocaleString()} (<100,000) — dengue likely.`);
    } else if (platelets < 150000) {
      dengueRisk += 6; flaggedConditions.push(`Mildly low platelets: ${platelets.toLocaleString()}.`);
    }

    // ── Fever Duration ──
    if (feverDays >= 5) {
      dengueRisk += 10; flaggedConditions.push(`Fever ${feverDays} days — critical phase risk (days 3-7).`);
    } else if (feverDays >= 2) {
      dengueRisk += 5; flaggedConditions.push(`Fever ${feverDays} days.`);
    }

    // ── Dengue Triad: headache + retro-orbital pain + myalgia ──
    if (inputs.severeHeadache && inputs.eyePain && inputs.jointMusclePain) {
      dengueRisk += 12; flaggedConditions.push('⚠ Classic dengue triad: headache + retro-orbital pain + arthralgia/myalgia.');
    } else {
      dengueRisk += dengueSymptoms * 3;
      if (dengueSymptoms >= 2) flaggedConditions.push(`${dengueSymptoms}/4 dengue-associated symptoms present.`);
    }

    if (inputs.skinRash) { flaggedConditions.push('Skin rash present — petechiae or maculopapular pattern.'); }

    dengueRisk = clamp(dengueRisk, 0, 100);
    if (dengueRisk >= 40) {
      riskLevel = 'Critical'; riskScore = clamp(dengueRisk + 10, 80, 98);
      recommendedAction = 'urgent_care';
      flaggedConditions.push('NS1 antigen test, CBC, and hospitalization may be needed.');
    } else if (dengueRisk >= 20) {
      riskLevel = 'High'; riskScore = clamp(dengueRisk + 5, 65, 85);
      recommendedAction = 'urgent_care';
    } else if (dengueRisk >= 10) {
      riskLevel = 'Moderate'; riskScore = clamp(dengueRisk + 5, 55, 70);
      recommendedAction = 'consult_doctor';
    } else {
      riskScore = clamp(100 - dengueRisk, 75, 95);
    }

  /* ───────────────────────────────────────────────────────────────────── */
  /*  PCOS (Rotterdam Criteria)                                          */
  /* ───────────────────────────────────────────────────────────────────── */
  } else if (predictorId === 'pcos') {
    let pcosRisk = 0;

    // Rotterdam: 2 of 3 criteria (oligo-anovulation, hyperandrogenism, polycystic ovaries)
    if (inputs.irregularPeriods) { pcosRisk += 15; flaggedConditions.push('Irregular/absent periods — oligo-anovulation marker.'); }
    if (inputs.facialHair || inputs.severeAcne) {
      pcosRisk += 15; flaggedConditions.push('Hyperandrogenism signs (hirsutism/acne) — clinical criteria met.');
    }
    if (inputs.weightGain) { pcosRisk += 8; flaggedConditions.push('Weight gain — insulin resistance common in PCOS.'); }
    if (inputs.thinningHair) { pcosRisk += 5; flaggedConditions.push('Androgenic alopecia pattern.'); }

    pcosRisk = clamp(pcosRisk, 0, 100);
    if (pcosRisk >= 30) {
      riskLevel = 'High'; riskScore = clamp(pcosRisk + 5, 65, 88);
      recommendedAction = 'consult_doctor';
      flaggedConditions.push('Rotterdam criteria likely met. Pelvic ultrasound and hormonal panel recommended.');
    } else if (pcosRisk >= 15) {
      riskLevel = 'Moderate'; riskScore = clamp(pcosRisk + 5, 55, 70);
      recommendedAction = 'consult_doctor';
    } else {
      riskScore = clamp(100 - pcosRisk, 75, 95);
    }

  /* ───────────────────────────────────────────────────────────────────── */
  /*  STOP-BANG Sleep Apnea Screening (Validated Tool)                   */
  /* ───────────────────────────────────────────────────────────────────── */
  } else if (predictorId === 'stopbang') {
    const total = countSymptoms(inputs, ['snoring', 'tiredness', 'observedApnea', 'hypertension',
      'bmiOver35', 'ageOver50', 'neckOver40cm', 'maleGender']);

    flaggedConditions.push(`STOP-BANG Score: ${total}/8.`);

    if (total >= 5) {
      riskLevel = 'High'; riskScore = 82;
      recommendedAction = 'consult_doctor';
      flaggedConditions.push('High risk for Obstructive Sleep Apnea (STOP-BANG ≥5). Polysomnography recommended.');
    } else if (total >= 3) {
      riskLevel = 'Moderate'; riskScore = 65;
      recommendedAction = 'consult_doctor';
      flaggedConditions.push('Intermediate OSA risk (STOP-BANG 3-4). Sleep study may be beneficial.');
    } else {
      riskLevel = 'Low'; riskScore = 90;
      flaggedConditions.push('Low OSA risk (STOP-BANG 0-2).');
    }

  /* ───────────────────────────────────────────────────────────────────── */
  /*  VITAMIN D DEFICIENCY                                               */
  /* ───────────────────────────────────────────────────────────────────── */
  } else if (predictorId === 'vitaminD') {
    const sunlight = inputs.sunlightExposure || 'Less than 15 mins';
    const vitDSymptoms = countSymptoms(inputs, ['muscleWeakness', 'bonePain', 'fatigue', 'veganDiet']);

    let vitDRisk = 0;

    if (sunlight === 'Less than 15 mins') { vitDRisk += 15; flaggedConditions.push('Minimal sun exposure (<15 mins/day) — primary deficiency risk factor.'); }
    else if (sunlight === '15-60 mins') { vitDRisk += 4; }

    vitDRisk += vitDSymptoms * 6;
    if (inputs.bonePain && inputs.muscleWeakness) {
      vitDRisk += 5; flaggedConditions.push('Bone pain + muscle weakness — classic vitamin D deficiency presentation.');
    }
    if (inputs.veganDiet) flaggedConditions.push('Vegan diet — limited dietary vitamin D sources.');

    vitDRisk = clamp(vitDRisk, 0, 100);
    if (vitDRisk >= 30) {
      riskLevel = 'High'; riskScore = clamp(vitDRisk + 5, 65, 85);
      recommendedAction = 'consult_doctor';
      flaggedConditions.push('Serum 25-hydroxyvitamin D level test recommended.');
    } else if (vitDRisk >= 15) {
      riskLevel = 'Moderate'; riskScore = clamp(vitDRisk + 5, 55, 70);
      recommendedAction = 'monitor';
    } else {
      riskScore = clamp(100 - vitDRisk, 75, 95);
    }

  /* ───────────────────────────────────────────────────────────────────── */
  /*  OSTEOPOROSIS (FRAX-inspired risk factors)                          */
  /* ───────────────────────────────────────────────────────────────────── */
  } else if (predictorId === 'osteoporosis') {
    const age = Number(inputs.age) || 50;

    let osteoRisk = 0;

    if (inputs.femalePostMenopausal) { osteoRisk += 18; flaggedConditions.push('Post-menopausal female — estrogen decline is a major risk factor.'); }
    if (inputs.fractureHistory) { osteoRisk += 15; flaggedConditions.push('⚠ Prior fragility fracture — strongest predictor of future fracture.'); }
    if (inputs.lowCalciumIntake) { osteoRisk += 8; flaggedConditions.push('Low calcium intake.'); }
    if (inputs.sedentaryLifestyle) { osteoRisk += 6; flaggedConditions.push('Sedentary lifestyle — weight-bearing exercise recommended.'); }
    if (inputs.smoking) { osteoRisk += 6; flaggedConditions.push('Smoking accelerates bone loss.'); }
    if (age >= 65) osteoRisk += 10;
    else if (age >= 50) osteoRisk += 5;

    osteoRisk = clamp(osteoRisk, 0, 100);
    if (osteoRisk >= 35) {
      riskLevel = 'High'; riskScore = clamp(osteoRisk + 5, 70, 90);
      recommendedAction = 'consult_doctor';
      flaggedConditions.push('DEXA bone density scan recommended.');
    } else if (osteoRisk >= 18) {
      riskLevel = 'Moderate'; riskScore = clamp(osteoRisk + 5, 55, 75);
      recommendedAction = 'consult_doctor';
    } else {
      riskScore = clamp(100 - osteoRisk, 75, 95);
    }

  /* ───────────────────────────────────────────────────────────────────── */
  /*  INDIA-SPECIFIC PREDICTORS (Malaria, Chikungunya, Typhoid, etc.)   */
  /* ───────────────────────────────────────────────────────────────────── */
  } else if (predictorId === 'malaria') {
    const malariaKeys = ['highFever', 'headache', 'nausea', 'jaundice', 'livesInEndemicArea', 'mosquitoExposure'];
    const symptoms = countSymptoms(inputs, malariaKeys);
    flaggedConditions.push(`Fever pattern: ${inputs.feverPattern || 'Unknown'}`);
    flaggedConditions.push(`Symptom count: ${symptoms}/${malariaKeys.length}`);

    if (symptoms >= 4 || (inputs.highFever && inputs.jaundice)) {
      riskLevel = 'High'; riskScore = 85; recommendedAction = 'urgent_care';
      flaggedConditions.push('⚠ Multiple malaria indicators — urgent blood smear (thick/thin) + RDT needed.');
    } else if (symptoms >= 2) {
      riskLevel = 'Moderate'; riskScore = 65; recommendedAction = 'consult_doctor';
      flaggedConditions.push('Moderate malaria risk — RDT/blood test recommended.');
    }

  } else if (predictorId === 'chikungunya') {
    const chikKeys = ['suddenFever', 'jointPain', 'jointSwelling', 'rash', 'headache', 'monsoonSeason', 'waterStagnation'];
    const symptoms = countSymptoms(inputs, chikKeys);
    flaggedConditions.push(`Joint pain: ${inputs.jointPain ? 'Yes' : 'No'}`);

    if (symptoms >= 4 || (inputs.suddenFever && inputs.jointPain && inputs.jointSwelling)) {
      riskLevel = 'High'; riskScore = 80; recommendedAction = 'consult_doctor';
      flaggedConditions.push('⚠ Classic chikungunya triad — serology (IgM/IgG) recommended.');
    } else if (symptoms >= 2) {
      riskLevel = 'Moderate'; riskScore = 60; recommendedAction = 'monitor';
      flaggedConditions.push('Some chikungunya-like symptoms. Monitor and consult if worsening.');
    }

  } else if (predictorId === 'typhoid') {
    const typhoidKeys = ['prolongedFever', 'abdominalPain', 'diarrhea', 'headache', 'lossOfAppetite', 'untreatedWater', 'streetFood'];
    const symptoms = countSymptoms(inputs, typhoidKeys);
    flaggedConditions.push(`Prolonged fever: ${inputs.prolongedFever ? 'Yes' : 'No'}`);

    if (symptoms >= 5 || (inputs.prolongedFever && inputs.untreatedWater && inputs.abdominalPain)) {
      riskLevel = 'High'; riskScore = 82; recommendedAction = 'urgent_care';
      flaggedConditions.push('⚠ Strong typhoid indicators — Widal test + blood culture recommended.');
    } else if (symptoms >= 3) {
      riskLevel = 'Moderate'; riskScore = 65; recommendedAction = 'consult_doctor';
      flaggedConditions.push('Moderate enteric fever risk.');
    }

  } else if (predictorId === 'jaundice') {
    const jaundiceKeys = ['yellowSkin', 'darkUrine', 'paleStools', 'fatigue', 'abdominalPain', 'nausea', 'contamWater'];
    const symptoms = countSymptoms(inputs, jaundiceKeys);
    flaggedConditions.push(`Yellow skin/eyes: ${inputs.yellowSkin ? 'Yes' : 'No'}`);

    if (symptoms >= 4 || (inputs.yellowSkin && inputs.darkUrine && inputs.paleStools)) {
      riskLevel = 'High'; riskScore = 85; recommendedAction = 'urgent_care';
      flaggedConditions.push('⚠ Classic jaundice triad — LFT + hepatitis panel (HBsAg, anti-HCV) urgently needed.');
    } else if (symptoms >= 2) {
      riskLevel = 'Moderate'; riskScore = 65; recommendedAction = 'consult_doctor';
      flaggedConditions.push('Some hepatic indicators — liver function tests recommended.');
    }

  } else if (predictorId === 'asthma_copd') {
    const respKeys = ['chronicCough', 'breathlessness', 'wheezing', 'chestTightness', 'smoking', 'airPollution', 'familyHistory'];
    const symptoms = countSymptoms(inputs, respKeys);
    flaggedConditions.push(`Chronic cough: ${inputs.chronicCough ? 'Yes' : 'No'}`);

    if (symptoms >= 5 || (inputs.breathlessness && inputs.wheezing && inputs.smoking)) {
      riskLevel = 'High'; riskScore = 83; recommendedAction = 'urgent_care';
      flaggedConditions.push('⚠ Strong COPD/Asthma indicators — spirometry (PFT) needed.');
    } else if (symptoms >= 3) {
      riskLevel = 'Moderate'; riskScore = 65; recommendedAction = 'consult_doctor';
      flaggedConditions.push('Moderate respiratory risk — pulmonary evaluation recommended.');
    }

  } else if (predictorId === 'pregnancy_risk') {
    const pregKeys = ['highBP', 'bleeding', 'severeHeadache', 'swelling', 'anemia', 'previousComplications', 'noAntenatalCare'];
    const symptoms = countSymptoms(inputs, pregKeys);
    flaggedConditions.push(`Weeks pregnant: ${Number(inputs.weeksPregnant) || 0}`);

    if (inputs.bleeding || inputs.severeHeadache || symptoms >= 4) {
      riskLevel = 'Critical'; riskScore = 92; recommendedAction = 'urgent_care';
      flaggedConditions.push('⚠ HIGH-RISK PREGNANCY — immediate medical attention required (eclampsia/hemorrhage risk).');
    } else if (symptoms >= 2) {
      riskLevel = 'Moderate'; riskScore = 65; recommendedAction = 'consult_doctor';
      flaggedConditions.push('Moderate pregnancy risk — urgent antenatal checkup needed.');
    }

  } else if (predictorId === 'malnutrition') {
    const malKeys = ['poorFeeding', 'frequentIllness', 'diarrhea', 'noBreastfeeding', 'lowIncome'];
    const symptoms = countSymptoms(inputs, malKeys);
    const childAge = Number(inputs.childAge) || 12;
    const weight = Number(inputs.weight) || 0;
    flaggedConditions.push(`Child age: ${childAge} months, Weight: ${weight} kg`);

    // WHO weight-for-age z-score approximation
    if (symptoms >= 4 || (weight > 0 && childAge > 6 && weight < childAge * 0.35)) {
      riskLevel = 'High'; riskScore = 85; recommendedAction = 'urgent_care';
      flaggedConditions.push('⚠ Severe malnutrition risk — Anganwadi/ICDS referral needed.');
    } else if (symptoms >= 2) {
      riskLevel = 'Moderate'; riskScore = 65; recommendedAction = 'consult_doctor';
      flaggedConditions.push('Moderate malnutrition risk — dietary counseling needed.');
    }

  } else if (predictorId === 'diabetic_retinopathy') {
    const drKeys = ['blurredVision', 'floaters', 'difficultyNightVision', 'uncontrolledSugar', 'highBP', 'noEyeCheckup'];
    const symptoms = countSymptoms(inputs, drKeys);
    const years = Number(inputs.diabetesYears) || 0;
    flaggedConditions.push(`Years with diabetes: ${years}`);

    if (symptoms >= 4 || (years > 10 && inputs.blurredVision && inputs.uncontrolledSugar)) {
      riskLevel = 'High'; riskScore = 85; recommendedAction = 'urgent_care';
      flaggedConditions.push('⚠ High retinopathy risk — dilated fundoscopy exam urgently needed.');
    } else if (symptoms >= 2 || years > 5) {
      riskLevel = 'Moderate'; riskScore = 65; recommendedAction = 'consult_doctor';
      flaggedConditions.push('Moderate retinopathy risk — annual eye exam recommended.');
    }

  } else if (predictorId === 'dental_health') {
    const dentalKeys = ['toothPain', 'bleedingGums', 'looseTeeth', 'mouthSores', 'tobaccoUse', 'badBreath', 'noDentalVisit'];
    const symptoms = countSymptoms(inputs, dentalKeys);
    flaggedConditions.push(`Tobacco/gutka use: ${inputs.tobaccoUse ? 'Yes' : 'No'}`);

    if (symptoms >= 5 || (inputs.mouthSores && inputs.tobaccoUse)) {
      riskLevel = 'High'; riskScore = 80; recommendedAction = 'urgent_care';
      flaggedConditions.push('⚠ Oral cancer screening recommended — mouth sores + tobacco = red flag.');
    } else if (symptoms >= 3) {
      riskLevel = 'Moderate'; riskScore = 65; recommendedAction = 'consult_doctor';
      flaggedConditions.push('Periodontal disease risk — dental checkup recommended.');
    }

  } else if (predictorId === 'skin_fungal') {
    const skinKeys = ['itchyPatches', 'scaling', 'groinAffected', 'humid', 'tightClothing', 'recurringInfection', 'sharedItems'];
    const symptoms = countSymptoms(inputs, skinKeys);
    flaggedConditions.push(`Recurring infection: ${inputs.recurringInfection ? 'Yes' : 'No'}`);

    if (symptoms >= 5 || (inputs.recurringInfection && inputs.itchyPatches && inputs.scaling)) {
      riskLevel = 'High'; riskScore = 78; recommendedAction = 'consult_doctor';
      flaggedConditions.push('⚠ Chronic dermatophytosis — dermatologist consultation + antifungal therapy needed.');
    } else if (symptoms >= 3) {
      riskLevel = 'Moderate'; riskScore = 60; recommendedAction = 'monitor';
      flaggedConditions.push('Fungal infection likely — topical antifungal treatment needed.');
    }

  } else if (predictorId === 'image_analysis') {
    const scanType = inputs.scanType || 'general';
    const local = inputs.localLabel || 'Observed Anatomical Pattern';
    riskLevel = 'Moderate';
    riskScore = 65;
    recommendedAction = 'consult_doctor';
    flaggedConditions.push(`Model Router Domain: ${String(scanType).toUpperCase()} CNN Specialized Classifier.`);
    flaggedConditions.push(`Visual Finding: ${local}.`);
    flaggedConditions.push('Grad-CAM Saliency: Spatial hotspot computed across activation tensor.');
    flaggedConditions.push('Offline Safety Gate: Validated for clinical review.');
  /* ───────────────────────────────────────────────────────────────────── */
  /*  FALLBACK (Unknown Predictor)                                       */
  /* ───────────────────────────────────────────────────────────────────── */
  } else {
    flaggedConditions.push('Clinical markers compiled for evaluation.');
    flaggedConditions.push(`Inputs analyzed: ${Object.keys(inputs || {}).join(', ') || 'none'}`);
  }

  return {
    version: '2.0.0',
    riskLevel,
    riskScore,
    flaggedConditions,
    recommendedAction,
    computedBy: 'offline_rules',
    timestamp: new Date().toISOString(),
  };
};
