import type { PredictionData, PredictionFacts } from '../lib/types/prediction';
import { templateRenderer } from '../utils/templateRenderer';

/**
 * Generates an AI clinical narrative for predictor facts using the client-side Groq/Gemini key if available.
 */
export async function enhancePredictionWithAI(
  predictorId: string,
  facts: PredictionFacts,
  inputs: Record<string, any>
): Promise<PredictionData> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GROQ_API_KEY;

  if (!apiKey) {
    return templateRenderer(facts);
  }

  try {
    const systemPrompt = `You are an expert India preventive medicine clinical risk assessor.
You have been provided with validated medical FACTS computed by a clinical rule engine for the '${predictorId}' predictor.
Your job is to narrate these facts into a clear, professional, pointwise clinical report.
DO NOT change the risk level '${facts.riskLevel}' or confidence score ${facts.riskScore}.

Return ONLY a valid JSON object matching this schema:
{
  "risk": "${facts.riskLevel}",
  "confidence": ${facts.riskScore},
  "reasoning": ["3 to 4 concise, clear points explaining why these biomarkers matter"],
  "recommendations": ["3 to 5 highly actionable, culturally relevant Indian lifestyle, diet, and monitoring steps"],
  "urgency": "${facts.recommendedAction === 'urgent_care' ? 'urgent' : facts.recommendedAction === 'consult_doctor' ? 'soon' : 'routine'}",
  "missing_fields": [],
  "sos_guidance": ${facts.riskLevel === 'High' || facts.riskLevel === 'Critical' ? '"If experiencing chest tightness, extreme breathlessness, or severe pain, dial 108 immediately."' : 'null'},
  "disclaimer": "This is a preventive screening risk assessment based on ICMR protocols, not a formal hospital diagnosis. Consult a qualified doctor."
}`;

    const userMessage = `Predictor: ${predictorId}
Facts: Risk Level: ${facts.riskLevel}, Score: ${facts.riskScore}%
Flagged Biomarkers: ${Array.isArray(facts.flaggedConditions) ? facts.flaggedConditions.join('; ') : 'None'}
Inputs: ${JSON.stringify(inputs)}`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ]
      })
    });

    if (response.ok) {
      const data = await response.json();
      const rawContent = data.choices?.[0]?.message?.content || '';
      const cleaned = rawContent
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();

      const parsed = JSON.parse(cleaned);
      if (parsed.risk && Array.isArray(parsed.reasoning) && Array.isArray(parsed.recommendations)) {
        return {
          ...parsed,
          computedBy: 'llm_narrative',
          safetyGateStatus: facts.safetyGateStatus || 'usable'
        } as PredictionData;
      }
    }
  } catch (err) {
    console.warn('Client-side AI predictor enhancement fallback to templateRenderer', err);
  }

  return templateRenderer(facts);
}
