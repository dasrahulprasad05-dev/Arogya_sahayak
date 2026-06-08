import { z } from 'zod';

export const heartSchema = z.object({
  age: z.number().min(1, 'Age is required').max(120),
  gender: z.enum(['Male', 'Female']),
  chestPainType: z.enum(['Typical Angina', 'Atypical Angina', 'Non-Anginal', 'Asymptomatic']),
  restingBloodPressure: z.number().min(70, 'Min 70 mmHg').max(250, 'Max 250 mmHg'),
  cholesterol: z.number().min(100, 'Min 100 mg/dL').max(600, 'Max 600 mg/dL'),
  fastingBloodSugar: z.boolean(),
  restingECG: z.enum(['Normal', 'ST-T Wave Abnormality', 'Left Ventricular Hypertrophy']),
  maxHeartRate: z.number().min(60, 'Min 60 bpm').max(220, 'Max 220 bpm'),
  exerciseAngina: z.boolean(),
  stDepression: z.number().min(0).max(10),
  slope: z.enum(['Upsloping', 'Flat', 'Downsloping']),
  vessels: z.number().min(0).max(4)
});

export type HeartInputs = z.infer<typeof heartSchema>;
