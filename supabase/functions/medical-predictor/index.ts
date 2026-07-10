import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { checkRateLimit } from "../_shared/rateLimit.ts";
import { medicalResponseSchema, predictionFactsSchema } from "../_shared/responseSchema.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") || "";
const FASTAPI_URL = Deno.env.get("FASTAPI_URL") || "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    const userId = authHeader ? authHeader.substring(7) : "anonymous";

    // Rate Limit: 20 requests per user per minute
    const rateCheck = await checkRateLimit(userId, 20, 60000);
    if (!rateCheck.allowed) {
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded. Try again in 60s." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { predictorId, inputs, scanType, vector, localLabel } = await req.json();

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
              model: "llama-3.1-8b-instant",
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
