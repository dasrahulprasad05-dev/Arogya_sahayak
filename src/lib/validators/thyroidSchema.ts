import { z } from 'zod';

export const thyroidSchema = z.object({
  age: z.number().min(1, 'Age is required').max(120),
  gender: z.enum(['Male', 'Female']),
  tsh: z.number().min(0.01, 'TSH must be at least 0.01 uIU/mL').max(100.0),
  freeT3: z.number().min(0.1, 'Free T3 must be at least 0.1 pg/mL').max(20.0),
  freeT4: z.number().min(0.1, 'Free T4 must be at least 0.1 ng/dL').max(10.0),
  goiter: z.boolean(),
  thyroidSurgery: z.boolean(),
  iodineDeficiency: z.boolean(),
  weightChange: z.enum(['None', 'Weight Loss', 'Weight Gain']),
  temperatureSensitivity: z.enum(['None', 'Cold Intolerance', 'Heat Intolerance'])
});

export type ThyroidInputs = z.infer<typeof thyroidSchema>;
