import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { checkRateLimit } from "../_shared/rateLimit.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") || "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    const userId = authHeader ? authHeader.substring(7) : "anonymous"; // mock/bypass or actual user id

    // Rate Limit: 10 requests per user per minute (60000 ms)
    const rateCheck = await checkRateLimit(userId, 10, 60000);
    if (!rateCheck.allowed) {
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded. Try again in 60s." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { symptoms, notes, lang } = await req.json();

    const systemPrompt = `ROLE: Triage assistant; India clinical context; language: ${lang || 'or'}
Reference ICMR / NHP / Ayushman Bharat protocols where applicable.
NEVER diagnose. Use "may suggest", "could indicate", "warrants evaluation for".
Structure: (1) Possible causes (2) Warning signs (3) Recommended action (4) When to call 108.`;

    const userMessage = `Selected symptoms: ${symptoms?.join(', ') || 'None'}. Additional details: ${notes || 'None'}. Provide localized advice.`;

    let advisory = "";

    // 1. Fetch Groq API if key is present
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
                { role: "user", content: `Patient Vitals/Symptoms:\n${userMessage}` }
              ]
            })
          }
        );

        if (!response.ok) {
          throw new Error("Groq API call failed");
        }

        const data = await response.json();
        advisory = data.choices?.[0]?.message?.content || "";
      } catch (err) {
        console.error("Groq request error:", err);
      }
    }

    // 2. If Gemini API fails or is unconfigured, return localized static clinical triage recommendations
    if (!advisory) {
      console.log("Using static fallback triage database...");
      if (lang === 'or') {
        advisory = `⚠️ ସ୍ୱାସ୍ଥ୍ୟ ପରାମର୍ଶ (Clinical Guidelines):
(୧) ସମ୍ଭାବ୍ୟ କାରଣ: ଆପଣଙ୍କର ଲକ୍ଷଣ ସାଧାରଣ ଥଣ୍ଡା, ଋତୁଗତ ଜ୍ୱର କିମ୍ବା ମାଂସପେଶୀର ଯନ୍ତ୍ରଣା ହୋଇପାରେ।
(୨) ବିପଦ ସଙ୍କେତ (Warning Signs): ଯଦି ଶ୍ୱାସକ୍ରିୟାରେ କଷ୍ଟ, ଅତ୍ୟଧିକ ଜ୍ୱର କିମ୍ବା ଛାତିରେ ଯନ୍ତ୍ରଣା ହୁଏ।
(୩) ସୁପାରିଶ କାର୍ଯ୍ୟାନୁଷ୍ଠାନ: ପ୍ରଚୁର ପାଣି ପିଅନ୍ତୁ, ବିଶ୍ରାମ କରନ୍ତୁ, ଏବଂ eSanjeevani (ଇ-ସଞ୍ଜୀବନୀ) ପୋର୍ଟାଲ ବ୍ୟବହାର କରି ପରାମର୍ଶ କରନ୍ତୁ।
(୪) ତୁରନ୍ତ ୧୦୮ କୁ କଲ୍ କରନ୍ତୁ ଯଦି ଜରୁରୀ ପରିସ୍ଥିତି ଉପୁଜେ।`;
      } else if (lang === 'hi') {
        advisory = `⚠️ स्वास्थ्य सलाह (Clinical Guidelines):
(1) संभावित कारण: मौसमी वायरल बुखार, सर्दी-जुकाम या सामान्य थकान हो सकती है।
(2) चेतावनी के लक्षण: सांस लेने में तकलीफ, छाती में जकड़न या निरंतर तेज बुखार।
(3) अनुशंसित कार्रवाई: भरपूर पानी पिएं, आराम करें, और जन औषधि केंद्र या ई-संजीवनी का उपयोग कर चिकित्सक से संपर्क करें।
(4) आपातकाल में तुरंत 108 डायल करें।`;
      } else {
        advisory = `⚠️ Clinical Guidelines Advice:
(1) Possible causes: Mild viral infection, common cold, or fatigue may suggest these symptoms.
(2) Warning signs: Dyspnea (shortness of breath), persistent high fever (>38.5°C), or chest pressure.
(3) Recommended action: Rest, maintain high hydration, monitor vitals, and consult eSanjeevani or local AIIMS OPD services.
(4) Call 108 / 112 immediately in case of severe distress or red flags.`;
      }
    }

    return new Response(
      JSON.stringify({ advisory }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
