import { z } from 'zod';

export const ecgSchema = z.object({
  heartRate: z.number().min(40, 'Min 40 bpm').max(200, 'Max 200 bpm'),
  prInterval: z.number().min(80, 'PR Interval 80-300 ms').max(300),
  qrsDuration: z.number().min(40, 'QRS Duration 40-200 ms').max(200),
  qtInterval: z.number().min(200, 'QT Interval 200-600 ms').max(600),
  qtcInterval: z.number().min(200, 'QTc Interval 200-600 ms').max(600),
  symptoms: z.array(z.string()).min(1, 'Select at least one option')
});

export type EcgInputs = z.infer<typeof ecgSchema>;
