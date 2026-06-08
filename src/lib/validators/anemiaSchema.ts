import { z } from 'zod';

export const anemiaSchema = z.object({
  gender: z.enum(['Male', 'Female']),
  hbLevel: z.number().min(2.0, 'Hb must be at least 2 g/dL').max(22.0, 'Hb cannot exceed 22 g/dL'),
  fatigue: z.boolean(),
  paleSkin: z.boolean(),
  dizziness: z.boolean(),
  coldHandsFeet: z.boolean(),
  shortnessOfBreath: z.boolean(),
  tongueSwelling: z.boolean()
});

export type AnemiaInputs = z.infer<typeof anemiaSchema>;
