import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { checkRateLimit } from "../_shared/rateLimit.ts";

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

    const rateCheck = await checkRateLimit(userId, 10, 60000);
    if (!rateCheck.allowed) {
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded. Try again in 60s." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { emergency, lang } = await req.json();

    const systemPrompt = `ROLE: First Aid & Emergency Assistant; Context: Initial Emergency Stabilization; Language: ${lang || 'en'}
You provide IMMEDIATE, step-by-step first aid instructions for emergencies before professional help arrives.
CRITICAL INSTRUCTION: ALWAYS begin your response by advising the user to call an ambulance (108/112 in India) if the situation is life-threatening.
Structure your response as follows:
(1) Immediate Action (Call ambulance if needed)
(2) Step-by-step stabilization instructions (Max 4-5 steps)
(3) What NOT to do
Keep it concise, calm, and actionable. Do NOT diagnose.`;

    const userMessage = `Emergency situation: ${emergency || 'General first aid'}. Please provide immediate first aid steps.`;

    let suggestion = "";

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
                { role: "user", content: `User Request:\n${userMessage}` }
              ]
            })
          }
        );

        if (!response.ok) {
          throw new Error("Groq API call failed");
        }

        const data = await response.json();
        suggestion = data.choices?.[0]?.message?.content || "";
      } catch (err) {
        console.error("Groq request error:", err);
      }
    }

    if (!suggestion) {
      suggestion = `⚠️ AI Service Unavailable.\n\nCould not fetch customized AI first aid instructions for: ${emergency}. Please refer to the general protocols below or CALL 108 IMMEDIATELY.`;
    }

    return new Response(
      JSON.stringify({ suggestion }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
