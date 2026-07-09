import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { checkRateLimit } from "../_shared/rateLimit.ts";
import { medicalResponseSchema } from "../_shared/responseSchema.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") || "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

    const systemPrompt = `You are an expert India preventive medicine risk assessor.
You must return ONLY a valid JSON object matching this schema:
{
  "risk": "Low" | "Moderate" | "High" | "Critical" | "Insufficient Data",
  "confidence": number, // NEVER exceed 85 for non-lab assessments. Range: 0 to 100.
  "reasoning": string[], // 3-5 items, citing actual patient input values (e.g. "HbA1c: 7.2%")
  "recommendations": string[], // 3-5 items, India-specific, actionable (e.g., eSanjeevani, AIIMS OPD, Jan Aushadhi, 108)
  "urgency": "routine" | "soon" | "urgent" | "emergency",
  "missing_fields": string[],
  "sos_guidance": string | null,
  "disclaimer": "This is a screening risk index, not a diagnosis. Consult a doctor."
}
IMPORTANT RULES:
- Never recommend specific drug names or dosages.
- Always include at least 1 Indian public healthcare resource.
- Cite actual patient inputs in the reasoning.
- Output ONLY valid raw JSON. No markdown wrappers, no preambles.`;

    const userMessage = `Predictor: ${predictorId} ${scanType ? `(CNN Scan type: ${scanType})` : ''}
Inputs: ${JSON.stringify(inputs || {})}
${vector ? `Feature Vector Length: ${vector.length}. Local Classification: ${localLabel}` : ''}`;

    let resultJson: any = null;

    if (GEMINI_API_KEY) {
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
              model: "llama3-8b-8192",
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Patient Data:\n${userMessage}` }
              ]
            })
          }
        );

        if (response.ok) {
          const data = await response.json();
          let rawText = data.choices?.[0]?.message?.content || "";
          
          // Clean up potential markdown wrappers
          rawText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
          
          const parsed = JSON.parse(rawText);
          const validation = medicalResponseSchema.safeParse(parsed);
          if (validation.success) {
            resultJson = validation.data;
          }
        }
      } catch (err) {
        console.error("Groq call error, falling back to local predictor engine:", err);
      }
    }

    // Local Rule-Based Risk Engine Fallback if Groq fails or is unconfigured
    if (!resultJson) {
      console.log("Generating local rule-based risk profiles...");
      
      let risk: 'Low' | 'Moderate' | 'High' | 'Critical' | 'Insufficient Data' = 'Low';
      let confidence = 70;
      const reasoning: string[] = [];
      const recommendations: string[] = [
        "Consult eSanjeevani online portal or visit your nearest primary healthcare center.",
        "Eat a balanced diet, keep hydrated, and maintain moderate physical activity."
      ];
      let urgency: 'routine' | 'soon' | 'urgent' | 'emergency' = 'routine';
      let sos_guidance: string | null = null;

      if (predictorId === 'diabetes') {
        const fbs = inputs.fastingBloodSugar || 100;
        const hba1c = inputs.hba1c || 5.7;
        reasoning.push(`Fasting Blood Sugar: ${fbs} mg/dL`);
        reasoning.push(`HbA1c level: ${hba1c}%`);
        
        if (fbs > 126 || hba1c >= 6.5) {
          risk = 'High';
          urgency = 'soon';
          confidence = 85; // Lab values
          reasoning.push("Markers exceed glycemic thresholds.");
          recommendations.push("Consult your nearest AIIMS or district hospital endocrinologist.");
          recommendations.push("Avail low-cost diabetes monitors from Pradhan Mantri Jan Aushadhi Kendra.");
        } else if (fbs > 100 || hba1c >= 5.7) {
          risk = 'Moderate';
          reasoning.push("Pre-diabetic glycemic range indicators.");
        }
      } else if (predictorId === 'heart-attack') {
        const bp = inputs.restingBloodPressure || 120;
        const chol = inputs.cholesterol || 200;
        reasoning.push(`Resting Blood Pressure: ${bp} mmHg`);
        reasoning.push(`Serum Cholesterol: ${chol} mg/dL`);

        if (bp > 140 || chol > 240) {
          risk = 'High';
          urgency = 'urgent';
          confidence = 80;
          reasoning.push("Hypertension and hypercholesterolemia indicators.");
          recommendations.push("Limit sodium/salt intake, do regular cardiorespiratory checkups.");
          sos_guidance = "If you experience radiating arm pain or severe chest squeezing, call 108/112.";
        }
      } else if (predictorId === 'image_analysis') {
        // Blended CNN scanning details
        reasoning.push(`Local MobileNet identified: "${localLabel || 'Unknown'}"`);
        reasoning.push("Vector feature map analyzed on-device.");
        risk = 'Moderate';
        confidence = 65;
        recommendations.push("For definitive screening, consult eSanjeevani or a district physician.");
      } else {
        // Generic default indicators
        reasoning.push("Self-logged clinical indicators compiled.");
        reasoning.push(`Inputs: ${Object.keys(inputs || {}).join(', ') || 'none'}`);
      }

      resultJson = {
        risk,
        confidence,
        reasoning,
        recommendations,
        urgency,
        missing_fields: [],
        sos_guidance,
        disclaimer: "This is an AI preventive health screening estimate. Consult a qualified doctor."
      };
    }

    return new Response(
      JSON.stringify(resultJson),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
