import { z } from 'zod';

export const hypertensionSchema = z.object({
  age: z.number().min(1).max(120),
  familyHistory: z.boolean(),
  sedentaryLifestyle: z.boolean(),
  sodiumIntake: z.enum(['Low', 'Moderate', 'High']),
  systolicBP: z.number().min(80).max(220),
  diastolicBP: z.number().min(50).max(140)
});

export const strokeSchema = z.object({
  age: z.number().min(1).max(120),
  hypertension: z.boolean(),
  heartDisease: z.boolean(),
  smoking: z.boolean(),
  glucoseLevel: z.number().min(50).max(500),
  bmi: z.number().min(10).max(60)
});

export const tbSchema = z.object({
  coughWeeks: z.number().min(0).max(20),
  fever: z.boolean(),
  nightSweats: z.boolean(),
  weightLoss: z.boolean(),
  coughingBlood: z.boolean(),
  tbContact: z.boolean()
});

export const dengueSchema = z.object({
  feverDays: z.number().min(0).max(30),
  severeHeadache: z.boolean(),
  eyePain: z.boolean(),
  jointMusclePain: z.boolean(),
  skinRash: z.boolean(),
  plateletCount: z.number().min(10000).max(600000)
});

export const pcosSchema = z.object({
  age: z.number().min(10).max(60),
  irregularPeriods: z.boolean(),
  facialHair: z.boolean(),
  severeAcne: z.boolean(),
  weightGain: z.boolean(),
  thinningHair: z.boolean()
});

// PHQ-9 (9 items, each 0-3)
export const phq9Schema = z.object({
  q1: z.number().min(0).max(3),
  q2: z.number().min(0).max(3),
  q3: z.number().min(0).max(3),
  q4: z.number().min(0).max(3),
  q5: z.number().min(0).max(3),
  q6: z.number().min(0).max(3),
  q7: z.number().min(0).max(3),
  q8: z.number().min(0).max(3),
  q9: z.number().min(0).max(3)
});

// GAD-7 (7 items, each 0-3)
export const gad7Schema = z.object({
  q1: z.number().min(0).max(3),
  q2: z.number().min(0).max(3),
  q3: z.number().min(0).max(3),
  q4: z.number().min(0).max(3),
  q5: z.number().min(0).max(3),
  q6: z.number().min(0).max(3),
  q7: z.number().min(0).max(3)
});

// STOP-BANG (8 Yes/No questions)
export const stopbangSchema = z.object({
  snoring: z.boolean(),
  tiredness: z.boolean(),
  observedApnea: z.boolean(),
  hypertension: z.boolean(),
  bmiOver35: z.boolean(),
  ageOver50: z.boolean(),
  neckOver40cm: z.boolean(),
  maleGender: z.boolean()
});

export const vitDDeficiencySchema = z.object({
  sunlightExposure: z.enum(['Less than 15 mins', '15-60 mins', 'More than 60 mins']),
  muscleWeakness: z.boolean(),
  bonePain: z.boolean(),
  fatigue: z.boolean(),
  veganDiet: z.boolean()
});

export const osteoporosisSchema = z.object({
  age: z.number().min(1).max(120),
  femalePostMenopausal: z.boolean(),
  fractureHistory: z.boolean(),
  lowCalciumIntake: z.boolean(),
  sedentaryLifestyle: z.boolean(),
  smoking: z.boolean()
});

export const genericSchemas = {
  hypertension: hypertensionSchema,
  stroke: strokeSchema,
  tuberculosis: tbSchema,
  dengue: dengueSchema,
  pcos: pcosSchema,
  phq9: phq9Schema,
  gad7: gad7Schema,
  stopbang: stopbangSchema,
  vitaminD: vitDDeficiencySchema,
  osteoporosis: osteoporosisSchema
};
