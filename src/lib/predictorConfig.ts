export interface PredictorField {
  name: string;
  type: 'number' | 'boolean' | 'select';
  label: string;
  options?: string[];
  placeholder?: string;
}

export interface PredictorConfig {
  id: string;
  name: string;
  description: string;
  fields: PredictorField[];
}

export const genericPredictorConfig: Record<string, PredictorConfig> = {
  hypertension: {
    id: 'hypertension',
    name: 'Hypertension Screener',
    description: 'Check your blood pressure elevation risk parameters.',
    fields: [
      { name: 'age', type: 'number', label: 'Age', placeholder: 'e.g. 45' },
      { name: 'familyHistory', type: 'boolean', label: 'Family History of High BP' },
      { name: 'sedentaryLifestyle', type: 'boolean', label: 'Sedentary Lifestyle (lack of regular exercise)' },
      { name: 'sodiumIntake', type: 'select', label: 'Dietary Sodium / Salt Intake', options: ['Low', 'Moderate', 'High'] },
      { name: 'systolicBP', type: 'number', label: 'Systolic Blood Pressure (mmHg)', placeholder: 'e.g. 120' },
      { name: 'diastolicBP', type: 'number', label: 'Diastolic Blood Pressure (mmHg)', placeholder: 'e.g. 80' }
    ]
  },
  stroke: {
    id: 'stroke',
    name: 'Stroke Risk Index',
    description: 'Assess cardiovascular stroke warning indications.',
    fields: [
      { name: 'age', type: 'number', label: 'Age', placeholder: 'e.g. 60' },
      { name: 'hypertension', type: 'boolean', label: 'History of Hypertension' },
      { name: 'heartDisease', type: 'boolean', label: 'History of Coronary Heart Disease' },
      { name: 'smoking', type: 'boolean', label: 'Regular Smoker / Tobacco Consumer' },
      { name: 'glucoseLevel', type: 'number', label: 'Average Blood Glucose Level (mg/dL)', placeholder: 'e.g. 110' },
      { name: 'bmi', type: 'number', label: 'Body Mass Index (BMI)', placeholder: 'e.g. 24.5' }
    ]
  },
  tuberculosis: {
    id: 'tuberculosis',
    name: 'Tuberculosis (TB) Assessment',
    description: 'Screen for symptoms and exposure to TB in regional Indian context.',
    fields: [
      { name: 'coughWeeks', type: 'number', label: 'Duration of Cough (in Weeks)', placeholder: 'e.g. 3' },
      { name: 'fever', type: 'boolean', label: 'Low-grade Fever (especially evening rise)' },
      { name: 'nightSweats', type: 'boolean', label: 'Drenching Night Sweats' },
      { name: 'weightLoss', type: 'boolean', label: 'Unexplained Weight Loss' },
      { name: 'coughingBlood', type: 'boolean', label: 'Haemoptysis (Coughing blood)' },
      { name: 'tbContact', type: 'boolean', label: 'Close Contact with a diagnosed TB Patient' }
    ]
  },
  dengue: {
    id: 'dengue',
    name: 'Dengue Fever Screening',
    description: 'Triage mosquito-borne dengue fever risk indicators.',
    fields: [
      { name: 'feverDays', type: 'number', label: 'Duration of High Fever (Days)', placeholder: 'e.g. 4' },
      { name: 'severeHeadache', type: 'boolean', label: 'Severe Headache (often retro-orbital / behind eyes)' },
      { name: 'eyePain', type: 'boolean', label: 'Pain behind the eyes' },
      { name: 'jointMusclePain', type: 'boolean', label: 'Severe Joint and Muscle Pain (breakbone fever)' },
      { name: 'skinRash', type: 'boolean', label: 'Skin Rash (appears on day 3-4)' },
      { name: 'plateletCount', type: 'number', label: 'Platelet Count (cells/mcL)', placeholder: 'e.g. 150000' }
    ]
  },
  pcos: {
    id: 'pcos',
    name: 'PCOS Screening (Polycystic Ovary Syndrome)',
    description: 'Evaluate primary endocrine disorder indicators for women.',
    fields: [
      { name: 'age', type: 'number', label: 'Age', placeholder: 'e.g. 24' },
      { name: 'irregularPeriods', type: 'boolean', label: 'Irregular or Delayed Menstrual Cycles' },
      { name: 'facialHair', type: 'boolean', label: 'Hirsutism (excessive hair on face, chest, or abdomen)' },
      { name: 'severeAcne', type: 'boolean', label: 'Severe Acne or oily skin' },
      { name: 'weightGain', type: 'boolean', label: 'Unexplained Weight Gain / difficulty losing weight' },
      { name: 'thinningHair', type: 'boolean', label: 'Male-pattern hair thinning or loss' }
    ]
  },
  phq9: {
    id: 'phq9',
    name: 'PHQ-9 Depression Screener',
    description: 'Standardized 9-question clinical depression assessment.',
    fields: [
      { name: 'q1', type: 'select', label: '1. Little interest or pleasure in doing things', options: ['0 - Not at all', '1 - Several days', '2 - More than half the days', '3 - Nearly every day'] },
      { name: 'q2', type: 'select', label: '2. Feeling down, depressed, or hopeless', options: ['0 - Not at all', '1 - Several days', '2 - More than half the days', '3 - Nearly every day'] },
      { name: 'q3', type: 'select', label: '3. Trouble falling or staying asleep, or sleeping too much', options: ['0 - Not at all', '1 - Several days', '2 - More than half the days', '3 - Nearly every day'] },
      { name: 'q4', type: 'select', label: '4. Feeling tired or having little energy', options: ['0 - Not at all', '1 - Several days', '2 - More than half the days', '3 - Nearly every day'] },
      { name: 'q5', type: 'select', label: '5. Poor appetite or overeating', options: ['0 - Not at all', '1 - Several days', '2 - More than half the days', '3 - Nearly every day'] },
      { name: 'q6', type: 'select', label: '6. Feeling bad about yourself — or that you are a failure', options: ['0 - Not at all', '1 - Several days', '2 - More than half the days', '3 - Nearly every day'] },
      { name: 'q7', type: 'select', label: '7. Trouble concentrating on things, such as reading the newspaper', options: ['0 - Not at all', '1 - Several days', '2 - More than half the days', '3 - Nearly every day'] },
      { name: 'q8', type: 'select', label: '8. Moving or speaking so slowly that other people could have noticed', options: ['0 - Not at all', '1 - Several days', '2 - More than half the days', '3 - Nearly every day'] },
      { name: 'q9', type: 'select', label: '9. Thoughts that you would be better off dead, or of hurting yourself', options: ['0 - Not at all', '1 - Several days', '2 - More than half the days', '3 - Nearly every day'] }
    ]
  },
  gad7: {
    id: 'gad7',
    name: 'GAD-7 Anxiety Screener',
    description: 'Standardized 7-question clinical anxiety assessment.',
    fields: [
      { name: 'q1', type: 'select', label: '1. Feeling nervous, anxious, or on edge', options: ['0 - Not at all', '1 - Several days', '2 - More than half the days', '3 - Nearly every day'] },
      { name: 'q2', type: 'select', label: '2. Not being able to stop or control worrying', options: ['0 - Not at all', '1 - Several days', '2 - More than half the days', '3 - Nearly every day'] },
      { name: 'q3', type: 'select', label: '3. Worrying too much about different things', options: ['0 - Not at all', '1 - Several days', '2 - More than half the days', '3 - Nearly every day'] },
      { name: 'q4', type: 'select', label: '4. Trouble relaxing', options: ['0 - Not at all', '1 - Several days', '2 - More than half the days', '3 - Nearly every day'] },
      { name: 'q5', type: 'select', label: '5. Being so restless that it is hard to sit still', options: ['0 - Not at all', '1 - Several days', '2 - More than half the days', '3 - Nearly every day'] },
      { name: 'q6', type: 'select', label: '6. Becoming easily annoyed or irritable', options: ['0 - Not at all', '1 - Several days', '2 - More than half the days', '3 - Nearly every day'] },
      { name: 'q7', type: 'select', label: '7. Feeling afraid, as if something awful might happen', options: ['0 - Not at all', '1 - Several days', '2 - More than half the days', '3 - Nearly every day'] }
    ]
  },
  stopbang: {
    id: 'stopbang',
    name: 'STOP-BANG Sleep Apnea Screener',
    description: 'Identify obstructive sleep apnea (OSA) risks index.',
    fields: [
      { name: 'snoring', type: 'boolean', label: 'Snoring (loud snoring, louder than talking)' },
      { name: 'tiredness', type: 'boolean', label: 'Tiredness (fatigue or sleepiness during the day)' },
      { name: 'observedApnea', type: 'boolean', label: 'Observed Apnea (someone observed you stop breathing during sleep)' },
      { name: 'hypertension', type: 'boolean', label: 'High Blood Pressure (being treated for high BP)' },
      { name: 'bmiOver35', type: 'boolean', label: 'Body Mass Index over 35 kg/m2' },
      { name: 'ageOver50', type: 'boolean', label: 'Age over 50 years' },
      { name: 'neckOver40cm', type: 'boolean', label: 'Neck circumference greater than 40 cm (16 inches)' },
      { name: 'maleGender', type: 'boolean', label: 'Male Gender' }
    ]
  },
  vitaminD: {
    id: 'vitaminD',
    name: 'Vitamin-D Deficiency Screener',
    description: 'Check bone health and sunlight synthesis indices.',
    fields: [
      { name: 'sunlightExposure', type: 'select', label: 'Daily Sunlight Exposure', options: ['Less than 15 mins', '15-60 mins', 'More than 60 mins'] },
      { name: 'muscleWeakness', type: 'boolean', label: 'Chronic Muscle Weakness or muscle aches' },
      { name: 'bonePain', type: 'boolean', label: 'Persistent Bone or Joint Pain' },
      { name: 'fatigue', type: 'boolean', label: 'Unexplained general Fatigue' },
      { name: 'veganDiet', type: 'boolean', label: 'Strict Vegan/Vegetarian diet (low natural Vitamin D intake)' }
    ]
  },
  osteoporosis: {
    id: 'osteoporosis',
    name: 'Osteoporosis Risk Assessor',
    description: 'Evaluate bone mineral density risk indices.',
    fields: [
      { name: 'age', type: 'number', label: 'Age', placeholder: 'e.g. 65' },
      { name: 'femalePostMenopausal', type: 'boolean', label: 'Female and Post-menopausal' },
      { name: 'fractureHistory', type: 'boolean', label: 'Personal history of bone fracture after minor fall' },
      { name: 'lowCalciumIntake', type: 'boolean', label: 'Chronic low Calcium or Vitamin D intake' },
      { name: 'sedentaryLifestyle', type: 'boolean', label: 'Sedentary Lifestyle (lack of weight-bearing exercise)' },
      { name: 'smoking', type: 'boolean', label: 'Regular Smoker / Tobacco Consumer' }
    ]
  }
};
