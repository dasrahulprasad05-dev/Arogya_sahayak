import { z } from 'zod';

export const kidneySchema = z.object({
  age: z.number().min(1, 'Age is required').max(120),
  bloodPressure: z.number().min(50).max(220),
  specificGravity: z.number().min(1.000).max(1.035),
  albumin: z.number().min(0).max(5),
  sugar: z.number().min(0).max(5),
  redBloodCells: z.enum(['Normal', 'Abnormal']),
  pusCells: z.enum(['Normal', 'Abnormal']),
  bloodUrea: z.number().min(10).max(300),
  serumCreatinine: z.number().min(0.1).max(15),
  sodium: z.number().min(100).max(180),
  potassium: z.number().min(2.0).max(8.0),
  hemoglobin: z.number().min(3.0).max(20.0)
});

export type KidneyInputs = z.infer<typeof kidneySchema>;
