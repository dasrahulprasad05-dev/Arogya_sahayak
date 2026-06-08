import { z } from 'zod';

export const liverSchema = z.object({
  age: z.number().min(1, 'Age is required').max(120),
  gender: z.enum(['Male', 'Female']),
  totalBilirubin: z.number().min(0.1, 'Min 0.1 mg/dL').max(30.0),
  directBilirubin: z.number().min(0.0).max(15.0),
  alkalinePhosphotase: z.number().min(50).max(1500),
  sgotAlat: z.number().min(10).max(1000),
  sgptAsat: z.number().min(10).max(1000),
  totalProteins: z.number().min(3.0).max(10.0),
  albumin: z.number().min(1.0).max(6.0),
  agRatio: z.number().min(0.1).max(4.0)
});

export type LiverInputs = z.infer<typeof liverSchema>;
