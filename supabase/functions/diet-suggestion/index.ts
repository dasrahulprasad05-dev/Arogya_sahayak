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

    const { state, lang } = await req.json();

    const systemPrompt = `ROLE: Nutrition and Diet Assistant; Context: Traditional Indian Regional Diets; Language: ${lang || 'en'}
You provide healthy, balanced traditional diet suggestions for a specific Indian state or region.
Structure your response as follows:
(1) Regional Overview
(2) Breakfast options
(3) Lunch options
(4) Dinner options
Keep it concise and highlight healthy, traditional choices.`;

    const userMessage = `Please provide a healthy traditional diet plan for the state of: ${state || 'India'}.`;

    let suggestion = "";

    if (GEMINI_API_KEY) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [{
                parts: [{ text: `${systemPrompt}\n\nUser Request:\n${userMessage}` }]
              }]
            })
          }
        );

        if (!response.ok) {
          throw new Error("Gemini API call failed");
        }

        const data = await response.json();
        suggestion = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      } catch (err) {
        console.error("Gemini request error:", err);
      }
    }

    if (!suggestion) {
      suggestion = `⚠️ AI Service Unavailable.\n\nCould not fetch customized AI diet for ${state}. Please refer to the general regional diet recommendations below.`;
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
