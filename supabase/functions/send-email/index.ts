import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { checkRateLimit } from "../_shared/rateLimit.ts";
import { welcomeEmail, passwordResetEmail, predictionReportEmail } from "../_shared/emailTemplates.ts";

// ==========================================
// AAROGYA SAHAYAK — SEND EMAIL EDGE FUNCTION
// Uses Resend API to deliver transactional emails
// ==========================================

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "";
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") || "Aarogya Sahayak <onboarding@resend.dev>";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type EmailType = "welcome" | "password-reset" | "prediction-report";

interface EmailRequest {
  type: EmailType;
  to: string;
  data: Record<string, any>;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Validate API key is configured
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not set in Supabase secrets.");
      return new Response(
        JSON.stringify({ error: "Email service is not configured. Set RESEND_API_KEY in Supabase secrets." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Rate limit: 10 emails per user per minute
    const authHeader = req.headers.get("Authorization");
    const userId = authHeader ? authHeader.substring(7) : "anonymous";
    const rateCheck = await checkRateLimit(userId, 10, 60000);
    if (!rateCheck.allowed) {
      return new Response(
        JSON.stringify({ error: "Email rate limit exceeded. Try again shortly." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { type, to, data }: EmailRequest = await req.json();

    // Validate required fields
    if (!type || !to) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: 'type' and 'to' are required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return new Response(
        JSON.stringify({ error: "Invalid email address format." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Render the correct template
    let subject: string;
    let html: string;

    switch (type) {
      case "welcome": {
        const result = welcomeEmail(data.name || "", data.language || "en");
        subject = result.subject;
        html = result.html;
        break;
      }
      case "password-reset": {
        const resetLink = data.resetLink || "#";
        const result = passwordResetEmail(data.name || "", resetLink);
        subject = result.subject;
        html = result.html;
        break;
      }
      case "prediction-report": {
        const result = predictionReportEmail(data.name || "", {
          predictorName: data.predictorName || "Health Assessment",
          risk: data.risk || "Insufficient Data",
          confidence: data.confidence || 0,
          reasoning: data.reasoning || [],
          recommendations: data.recommendations || [],
          urgency: data.urgency || "routine",
          disclaimer: data.disclaimer || "This is a screening risk index, not a diagnosis. Consult a doctor.",
        });
        subject = result.subject;
        html = result.html;
        break;
      }
      default:
        return new Response(
          JSON.stringify({ error: `Unknown email type: '${type}'. Valid types: welcome, password-reset, prediction-report` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    // Send via Resend API
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [to],
        subject,
        html,
      }),
    });

    const resendData = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error("Resend API error:", resendData);
      return new Response(
        JSON.stringify({ error: "Failed to send email.", details: resendData }),
        { status: resendResponse.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`✅ Email sent: type=${type}, to=${to}, id=${resendData.id}`);

    return new Response(
      JSON.stringify({ success: true, message: `${type} email sent successfully.`, id: resendData.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err: any) {
    console.error("Send-email function error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
