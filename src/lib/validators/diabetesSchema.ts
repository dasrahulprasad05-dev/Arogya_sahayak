import { z } from 'zod';

export const diabetesSchema = z.object({
  age: z.number().min(1, 'Age is required').max(120, 'Enter a valid age'),
  gender: z.enum(['Male', 'Female']),
  polyuria: z.boolean(),
  polydipsia: z.boolean(),
  suddenWeightLoss: z.boolean(),
  weakness: z.boolean(),
  polyphagia: z.boolean(),
  visualBlurring: z.boolean(),
  itching: z.boolean(),
  irritability: z.boolean(),
  delayedHealing: z.boolean(),
  partialParesis: z.boolean(),
  muscleStiffness: z.boolean(),
  alopecia: z.boolean(),
  obesity: z.boolean(),
  hba1c: z.number().min(3, 'HbA1c must be at least 3%').max(20, 'HbA1c cannot exceed 20%'),
  fastingBloodSugar: z.number().min(50, 'Fasting Blood Sugar must be at least 50 mg/dL').max(500, 'FBS cannot exceed 500 mg/dL')
});

export type DiabetesInputs = z.infer<typeof diabetesSchema>;
