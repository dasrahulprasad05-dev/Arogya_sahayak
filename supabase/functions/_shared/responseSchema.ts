import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

export const medicalResponseSchema = z.object({
  risk: z.enum(['Low', 'Moderate', 'High', 'Critical', 'Insufficient Data']),
  confidence: z.number().min(0).max(100),
  reasoning: z.array(z.string()),
  recommendations: z.array(z.string()),
  urgency: z.enum(['routine', 'soon', 'urgent', 'emergency']),
  missing_fields: z.array(z.string()).default([]),
  sos_guidance: z.string().nullable().default(null),
  disclaimer: z.string()
});

export type MedicalResponse = z.infer<typeof medicalResponseSchema>;
