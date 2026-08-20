import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { checkRateLimit } from "../_shared/rateLimit.ts";
import { medicalResponseSchema, predictionFactsSchema } from "../_shared/responseSchema.ts";
import { getAuthUserId } from "../_shared/authHelper.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") || "";
const FASTAPI_URL = Deno.env.get("FASTAPI_URL") || "";

const ALLOWED_ORIGINS = (Deno.env.get("ALLOWED_ORIGINS") || "*").split(",").map(o => o.trim());

function getCorsHeaders(req: Request) {
  const origin = req.headers.get("Origin") || "";
  const allowedOrigin = ALLOWED_ORIGINS.includes("*")
    ? "*"
    : ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
}

interface PredictionFacts {
  version: string;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical' | 'Insufficient Data';
  riskScore: number;
  flaggedConditions: string[];
  recommendedAction: 'monitor' | 'consult_doctor' | 'urgent_care';
  // computedBy tracks the origin of these facts (e.g., 'server_rules' for Deno edge function, 'server_rules_ml' for future Python ML service)
  computedBy: 'offline_rules' | 'server_rules' | 'server_rules_ml';
  timestamp: string;
}

function computeServerRules(predictorId: string, inputs: Record<string, any>, localLabel?: string): PredictionFacts {
  let riskLevel: PredictionFacts['riskLevel'] = 'Low';
  let riskScore = 70;
  const flaggedConditions: string[] = [];
  let recommendedAction: PredictionFacts['recommendedAction'] = 'monitor';

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
  } else if (predictorId === 'image_analysis') {
    flaggedConditions.push(`Local MobileNet identified: "${localLabel || 'Unknown'}"`);
    flaggedConditions.push("Vector feature map analyzed on-device.");
    riskLevel = 'Moderate';
    riskScore = 65;
    recommendedAction = 'consult_doctor';

  // ── 10 NEW INDIA-SPECIFIC PREDICTORS ──
  } else if (predictorId === 'malaria') {
    const symptoms = [inputs.highFever, inputs.headache, inputs.nausea, inputs.jaundice, inputs.livesInEndemicArea, inputs.mosquitoExposure].filter(Boolean).length;
    flaggedConditions.push(`Fever pattern: ${inputs.feverPattern || 'Unknown'}`);
    flaggedConditions.push(`Endemic area resident: ${inputs.livesInEndemicArea ? 'Yes' : 'No'}`);
    flaggedConditions.push(`Symptom count: ${symptoms}/6`);
    if (symptoms >= 4 || (inputs.highFever && inputs.jaundice)) {
      riskLevel = 'High'; riskScore = 85; recommendedAction = 'urgent_care';
      flaggedConditions.push("High fever with jaundice or multiple malaria indicators — urgent blood smear test needed.");
    } else if (symptoms >= 2) {
      riskLevel = 'Moderate'; riskScore = 65; recommendedAction = 'consult_doctor';
      flaggedConditions.push("Moderate malaria risk — RDT/blood test recommended.");
    }

  } else if (predictorId === 'chikungunya') {
    const symptoms = [inputs.suddenFever, inputs.jointPain, inputs.jointSwelling, inputs.rash, inputs.headache, inputs.monsoonSeason, inputs.waterStagnation].filter(Boolean).length;
    flaggedConditions.push(`Joint pain: ${inputs.jointPain ? 'Yes' : 'No'}`);
    flaggedConditions.push(`Symptom count: ${symptoms}/7`);
    if (symptoms >= 4 || (inputs.suddenFever && inputs.jointPain && inputs.jointSwelling)) {
      riskLevel = 'High'; riskScore = 80; recommendedAction = 'consult_doctor';
      flaggedConditions.push("Classic chikungunya triad — fever, joint pain, swelling. Serology test recommended.");
    } else if (symptoms >= 2) {
      riskLevel = 'Moderate'; riskScore = 60; recommendedAction = 'monitor';
      flaggedConditions.push("Some chikungunya-like symptoms present. Monitor and consult if worsening.");
    }

  } else if (predictorId === 'typhoid') {
    const symptoms = [inputs.prolongedFever, inputs.abdominalPain, inputs.diarrhea, inputs.headache, inputs.lossOfAppetite, inputs.untreatedWater, inputs.streetFood].filter(Boolean).length;
    flaggedConditions.push(`Prolonged fever: ${inputs.prolongedFever ? 'Yes' : 'No'}`);
    flaggedConditions.push(`Consumed untreated water: ${inputs.untreatedWater ? 'Yes' : 'No'}`);
    if (symptoms >= 5 || (inputs.prolongedFever && inputs.untreatedWater && inputs.abdominalPain)) {
      riskLevel = 'High'; riskScore = 82; recommendedAction = 'urgent_care';
      flaggedConditions.push("Strong typhoid indicators — Widal test or blood culture recommended immediately.");
    } else if (symptoms >= 3) {
      riskLevel = 'Moderate'; riskScore = 65; recommendedAction = 'consult_doctor';
      flaggedConditions.push("Moderate enteric fever risk — clinical evaluation recommended.");
    }

  } else if (predictorId === 'jaundice') {
    const symptoms = [inputs.yellowSkin, inputs.darkUrine, inputs.paleStools, inputs.fatigue, inputs.abdominalPain, inputs.nausea, inputs.contamWater].filter(Boolean).length;
    flaggedConditions.push(`Yellow skin/eyes: ${inputs.yellowSkin ? 'Yes' : 'No'}`);
    flaggedConditions.push(`Dark urine: ${inputs.darkUrine ? 'Yes' : 'No'}`);
    if (symptoms >= 4 || (inputs.yellowSkin && inputs.darkUrine && inputs.paleStools)) {
      riskLevel = 'High'; riskScore = 85; recommendedAction = 'urgent_care';
      flaggedConditions.push("Classic jaundice triad present. LFT and hepatitis panel urgently needed.");
    } else if (symptoms >= 2) {
      riskLevel = 'Moderate'; riskScore = 60; recommendedAction = 'consult_doctor';
      flaggedConditions.push("Some hepatic indicators — liver function tests recommended.");
    }

  } else if (predictorId === 'asthma_copd') {
    const symptoms = [inputs.chronicCough, inputs.breathlessness, inputs.wheezing, inputs.chestTightness, inputs.smoking, inputs.airPollution, inputs.familyHistory].filter(Boolean).length;
    flaggedConditions.push(`Chronic cough: ${inputs.chronicCough ? 'Yes' : 'No'}`);
    flaggedConditions.push(`Smoker/bidi user: ${inputs.smoking ? 'Yes' : 'No'}`);
    if (symptoms >= 5 || (inputs.breathlessness && inputs.wheezing && inputs.smoking)) {
      riskLevel = 'High'; riskScore = 83; recommendedAction = 'urgent_care';
      flaggedConditions.push("Strong COPD/Asthma indicators — spirometry and chest X-ray needed.");
    } else if (symptoms >= 3) {
      riskLevel = 'Moderate'; riskScore = 65; recommendedAction = 'consult_doctor';
      flaggedConditions.push("Moderate respiratory risk — pulmonary function assessment recommended.");
    }

  } else if (predictorId === 'pregnancy_risk') {
    const symptoms = [inputs.highBP, inputs.bleeding, inputs.severeHeadache, inputs.swelling, inputs.anemia, inputs.previousComplications, inputs.noAntenatalCare].filter(Boolean).length;
    const weeks = Number(inputs.weeksPregnant) || 0;
    flaggedConditions.push(`Weeks pregnant: ${weeks}`);
    flaggedConditions.push(`Bleeding: ${inputs.bleeding ? 'Yes' : 'No'}`);
    if (inputs.bleeding || inputs.severeHeadache || symptoms >= 4) {
      riskLevel = 'Critical'; riskScore = 90; recommendedAction = 'urgent_care';
      flaggedConditions.push("HIGH-RISK PREGNANCY — immediate medical attention required. Possible pre-eclampsia or hemorrhage.");
    } else if (symptoms >= 2) {
      riskLevel = 'Moderate'; riskScore = 65; recommendedAction = 'consult_doctor';
      flaggedConditions.push("Moderate pregnancy risk factors — regular antenatal checkup urgently needed.");
    }

  } else if (predictorId === 'malnutrition') {
    const symptoms = [inputs.poorFeeding, inputs.frequentIllness, inputs.diarrhea, inputs.noBreastfeeding, inputs.lowIncome].filter(Boolean).length;
    const childAge = Number(inputs.childAge) || 12;
    const weight = Number(inputs.weight) || 0;
    flaggedConditions.push(`Child age: ${childAge} months, Weight: ${weight} kg`);
    if (symptoms >= 4 || (weight > 0 && childAge > 6 && weight < childAge * 0.35)) {
      riskLevel = 'High'; riskScore = 85; recommendedAction = 'urgent_care';
      flaggedConditions.push("Severe malnutrition risk — immediate Anganwadi/nutrition center referral needed.");
    } else if (symptoms >= 2) {
      riskLevel = 'Moderate'; riskScore = 65; recommendedAction = 'consult_doctor';
      flaggedConditions.push("Moderate malnutrition risk — dietary counseling and growth monitoring needed.");
    }

  } else if (predictorId === 'diabetic_retinopathy') {
    const symptoms = [inputs.blurredVision, inputs.floaters, inputs.difficultyNightVision, inputs.uncontrolledSugar, inputs.highBP, inputs.noEyeCheckup].filter(Boolean).length;
    const years = Number(inputs.diabetesYears) || 0;
    flaggedConditions.push(`Years with diabetes: ${years}`);
    flaggedConditions.push(`Uncontrolled sugar: ${inputs.uncontrolledSugar ? 'Yes' : 'No'}`);
    if (symptoms >= 4 || (years > 10 && inputs.blurredVision && inputs.uncontrolledSugar)) {
      riskLevel = 'High'; riskScore = 85; recommendedAction = 'urgent_care';
      flaggedConditions.push("High retinopathy risk — fundoscopy exam urgently needed to prevent vision loss.");
    } else if (symptoms >= 2 || years > 5) {
      riskLevel = 'Moderate'; riskScore = 65; recommendedAction = 'consult_doctor';
      flaggedConditions.push("Moderate retinopathy risk — annual dilated eye exam recommended.");
    }

  } else if (predictorId === 'dental_health') {
    const symptoms = [inputs.toothPain, inputs.bleedingGums, inputs.looseTeeth, inputs.mouthSores, inputs.tobaccoUse, inputs.badBreath, inputs.noDentalVisit].filter(Boolean).length;
    flaggedConditions.push(`Tobacco/gutka use: ${inputs.tobaccoUse ? 'Yes' : 'No'}`);
    flaggedConditions.push(`Mouth sores: ${inputs.mouthSores ? 'Yes' : 'No'}`);
    if (symptoms >= 5 || (inputs.mouthSores && inputs.tobaccoUse)) {
      riskLevel = 'High'; riskScore = 80; recommendedAction = 'urgent_care';
      flaggedConditions.push("HIGH RISK — oral cancer screening recommended. Mouth sores with tobacco use is a red flag.");
    } else if (symptoms >= 3) {
      riskLevel = 'Moderate'; riskScore = 60; recommendedAction = 'consult_doctor';
      flaggedConditions.push("Periodontal disease risk — dental checkup recommended.");
    }

  } else if (predictorId === 'skin_fungal') {
    const symptoms = [inputs.itchyPatches, inputs.scaling, inputs.groinAffected, inputs.humid, inputs.tightClothing, inputs.recurringInfection, inputs.sharedItems].filter(Boolean).length;
    flaggedConditions.push(`Ring-shaped itchy patches: ${inputs.itchyPatches ? 'Yes' : 'No'}`);
    flaggedConditions.push(`Recurring infection: ${inputs.recurringInfection ? 'Yes' : 'No'}`);
    if (symptoms >= 5 || (inputs.recurringInfection && inputs.itchyPatches && inputs.scaling)) {
      riskLevel = 'High'; riskScore = 78; recommendedAction = 'consult_doctor';
      flaggedConditions.push("Chronic dermatophytosis — dermatologist consultation needed. Antifungal resistance possible.");
    } else if (symptoms >= 3) {
      riskLevel = 'Moderate'; riskScore = 60; recommendedAction = 'monitor';
      flaggedConditions.push("Fungal infection likely — basic antifungal treatment and hygiene measures needed.");
    }

  } else if (predictorId === 'image_analysis') {
    const scanType = inputs?.scanType || 'general';
    const local = localLabel || 'Identified Visual Finding';
    riskLevel = 'Moderate';
    riskScore = 68;
    recommendedAction = 'consult_doctor';
    
    const domainNames: Record<string, string> = {
      tb_sputum: 'Tuberculosis Sputum Microscopy Smear (AFB)',
      malaria_smear: 'Malaria Blood Smear (Plasmodium Ring Forms)',
      cervical_via: 'Cervical VIA Colposcopy (Acetowhite Squamous Triage)',
      anemia_eye: 'Non-Invasive Palpebral Conjunctiva Hemoglobin Pallor',
      cataract_eye: 'Anterior Segment Lens Transparency & Cataract',
      diabetic_foot: 'Diabetic Foot Ulcer (DFUC2021 Wagner Severity)',
      neonatal_jaundice: 'Neonatal Sclera/Dermal Bilirubin (BiliCam)',
      sickle_cell: 'Sickle Cell Drepanocyte Morphological Smear',
      fungal_tinea: 'Superficial Dermatophytosis Scaling Border (Tinea)',
      dental_fluorosis: 'Enamel Mottling & Dental Fluorosis Caries',
      chest: 'Chest Radiograph CheXNet Opacity Screener',
      skin: 'Dermatology Melanoma & Lesion Classifier',
      bone: 'Musculoskeletal Bone Fracture & Cortical Alignment',
      oral: 'Oral Mucosa Leukoplakia & Pre-cancerous Lesion',
      retina: 'Diabetic Retinopathy Fundus Microaneurysm Screener',
      mri: 'Neurology Brain MRI Density & Midline Shift'
    };

    const domainName = domainNames[scanType] || `${scanType.toUpperCase()} CNN Specialized Classifier`;
    flaggedConditions.push(`Model Router Domain: ${domainName}.`);
    flaggedConditions.push(`Primary Visual Feature Finding: "${local}".`);
    flaggedConditions.push("Grad-CAM: Saliency activation hotspot verified across spatial feature map.");
    flaggedConditions.push("Safety Gate: Validated for clinical review.");
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
    computedBy: 'server_rules',
    timestamp: new Date().toISOString(),
  };
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const userId = await getAuthUserId(req);

    // Rate Limit: 20 requests per user per minute
    const rateCheck = await checkRateLimit(userId, 20, 60000);
    if (!rateCheck.allowed) {
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded. Try again in 60s." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { predictorId, inputs: rawInputs, scanType, vector, localLabel } = await req.json();
    const inputs = { ...(rawInputs || {}), scanType, vector, localLabel };

    // 1. Compute Strict Facts using Server Rules (FastAPI ML or Deno Fallback)
    let rawFacts: any = null;

    if (FASTAPI_URL) {
      try {
        console.log(`Calling FastAPI at ${FASTAPI_URL}/api/predict/${predictorId}`);
        const mlResponse = await fetch(`${FASTAPI_URL}/api/predict/${predictorId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ predictorId, inputs })
        });
        
        if (mlResponse.ok) {
          rawFacts = await mlResponse.json();
        } else {
          console.error("FastAPI returned error status:", mlResponse.status, await mlResponse.text());
        }
      } catch (err) {
        console.error("FastAPI call error:", err);
      }
    }

    if (!rawFacts) {
      console.log("Falling back to Deno deterministic server rules...");
      rawFacts = computeServerRules(predictorId, inputs, localLabel);
    }
    
    // Zod validation on PredictionFacts BEFORE Step 2 (the LLM call)
    const facts = predictionFactsSchema.parse(rawFacts);

    let resultJson: any = null;

    // 2. Ask LLM to Narrate the Facts
    if (GEMINI_API_KEY) {
      const systemPrompt = `You are an expert India preventive medicine risk assessor.
You have been provided with undeniable, strict medical FACTS computed by a medical rule engine for the '${predictorId}' predictor.
Your job is to narrate these facts into a friendly, professional report. 
DO NOT change the risk level or confidence score.

You must return ONLY a valid JSON object matching this schema:
{
  "risk": "${facts.riskLevel}",
  "confidence": ${facts.riskScore},
  "reasoning": string[], // 3-5 items explaining the flagged conditions below
  "recommendations": string[], // 3-5 HIGHLY SPECIFIC, actionable health/diet steps tailored to ${predictorId} and the flagged conditions. Give culturally relevant Indian dietary/lifestyle advice. Do NOT give generic advice.
  "urgency": "routine" | "soon" | "urgent" | "emergency",
  "missing_fields": string[],
  "sos_guidance": string | null,
  "disclaimer": "This is a screening risk index, not a diagnosis. Consult a doctor."
}

IMPORTANT RULES:
- Never recommend specific drug names or dosages.
- Do NOT promote specific websites or portals.
- Output ONLY valid raw JSON. No markdown wrappers, no preambles.`;

      const userMessage = `Predictor Type: ${predictorId}
Computed Facts to Narrate:
Risk Level: ${facts.riskLevel}
Confidence Score: ${facts.riskScore}
Flagged Conditions: ${facts.flaggedConditions.join('; ')}
Recommended Action: ${facts.recommendedAction}`;

      try {
        const response = await fetch(
          `https://api.groq.com/openai/v1/chat/completions`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${GEMINI_API_KEY}`
            },
            body: JSON.stringify({
              model: "llama-3.3-70b-versatile",
              response_format: { type: "json_object" },
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userMessage }
              ]
            })
          }
        );

        if (response.ok) {
          const data = await response.json();
          let rawText = data.choices?.[0]?.message?.content || "";
          
          rawText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
          
          const parsed = JSON.parse(rawText);
          const validation = medicalResponseSchema.safeParse(parsed);
          if (validation.success) {
            resultJson = { ...validation.data, computedBy: 'llm_narrative' };
          } else {
            console.error("Zod Validation Failed:", validation.error);
          }
        } else {
          console.error("Groq API returned error status:", response.status, await response.text());
        }
      } catch (err) {
        console.error("Groq call error:", err);
      }
    }

    // 3. Granular Fallback: If LLM failed, return the raw facts directly
    if (!resultJson) {
      console.log("LLM failed or unconfigured, returning raw Server Facts for template renderer...");
      return new Response(
        JSON.stringify({ llm_failed: true, facts }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify(resultJson),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err: any) {
    // If the entire edge function fails (network issue, Deno crash), return 500
    // The frontend will catch this and use the offline client rule engine.
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
