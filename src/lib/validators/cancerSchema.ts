import { z } from 'zod';

export const cancerSchema = z.object({
  age: z.number().min(1, 'Age is required').max(120),
  gender: z.enum(['Male', 'Female']),
  smokingHistory: z.enum(['Never', 'Former', 'Current']),
  familyHistory: z.boolean(),
  occupationalExposure: z.boolean(),
  weightLoss: z.boolean(),
  cough: z.boolean(),
  bowelChanges: z.boolean(),
  skinLesions: z.boolean()
});

export type CancerInputs = z.infer<typeof cancerSchema>;
