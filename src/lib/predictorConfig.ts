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
  },

  // ── 10 NEW INDIA-SPECIFIC PREDICTORS ──

  malaria: {
    id: 'malaria',
    name: 'Malaria Risk Screener',
    description: 'Screen for malaria symptoms and mosquito exposure risk in endemic Indian regions.',
    fields: [
      { name: 'age', type: 'number', label: 'Age', placeholder: 'e.g. 30' },
      { name: 'highFever', type: 'boolean', label: 'High fever (>102°F) with chills and sweating' },
      { name: 'feverPattern', type: 'select', label: 'Fever Pattern', options: ['Continuous', 'Every 48 Hours', 'Every 72 Hours', 'Irregular'] },
      { name: 'headache', type: 'boolean', label: 'Severe headache and body ache' },
      { name: 'nausea', type: 'boolean', label: 'Nausea / Vomiting' },
      { name: 'livesInEndemicArea', type: 'boolean', label: 'Live in malaria-endemic area (Odisha, Chhattisgarh, Jharkhand, NE India)' },
      { name: 'mosquitoExposure', type: 'boolean', label: 'Recent mosquito bites / no bed net usage' },
      { name: 'jaundice', type: 'boolean', label: 'Yellowish skin or eyes' }
    ]
  },

  chikungunya: {
    id: 'chikungunya',
    name: 'Chikungunya Screener',
    description: 'Screen for Chikungunya virus symptoms transmitted by Aedes mosquitoes.',
    fields: [
      { name: 'age', type: 'number', label: 'Age', placeholder: 'e.g. 35' },
      { name: 'suddenFever', type: 'boolean', label: 'Sudden high fever (>101°F)' },
      { name: 'jointPain', type: 'boolean', label: 'Severe joint pain (hands, wrists, ankles, knees)' },
      { name: 'jointSwelling', type: 'boolean', label: 'Joint swelling' },
      { name: 'rash', type: 'boolean', label: 'Skin rash (maculopapular)' },
      { name: 'headache', type: 'boolean', label: 'Headache and muscle pain' },
      { name: 'monsoonSeason', type: 'boolean', label: 'Currently monsoon / post-monsoon season' },
      { name: 'waterStagnation', type: 'boolean', label: 'Stagnant water sources near home' }
    ]
  },

  typhoid: {
    id: 'typhoid',
    name: 'Typhoid Fever Screener',
    description: 'Screen for enteric (typhoid) fever — common waterborne illness in India.',
    fields: [
      { name: 'age', type: 'number', label: 'Age', placeholder: 'e.g. 25' },
      { name: 'prolongedFever', type: 'boolean', label: 'Fever lasting more than 5 days (step-ladder pattern)' },
      { name: 'abdominalPain', type: 'boolean', label: 'Abdominal pain / tenderness' },
      { name: 'diarrhea', type: 'boolean', label: 'Diarrhea or constipation' },
      { name: 'headache', type: 'boolean', label: 'Headache and body ache' },
      { name: 'lossOfAppetite', type: 'boolean', label: 'Loss of appetite' },
      { name: 'untreatedWater', type: 'boolean', label: 'Consumed untreated / tap water recently' },
      { name: 'streetFood', type: 'boolean', label: 'Ate street food / uncovered food recently' }
    ]
  },

  jaundice: {
    id: 'jaundice',
    name: 'Jaundice / Hepatitis Screener',
    description: 'Screen for jaundice and hepatitis symptoms — common during Indian monsoon.',
    fields: [
      { name: 'age', type: 'number', label: 'Age', placeholder: 'e.g. 30' },
      { name: 'yellowSkin', type: 'boolean', label: 'Yellowing of skin or whites of eyes' },
      { name: 'darkUrine', type: 'boolean', label: 'Dark-colored urine' },
      { name: 'paleStools', type: 'boolean', label: 'Pale / clay-colored stools' },
      { name: 'fatigue', type: 'boolean', label: 'Extreme fatigue and weakness' },
      { name: 'abdominalPain', type: 'boolean', label: 'Pain in upper right abdomen' },
      { name: 'nausea', type: 'boolean', label: 'Nausea / Vomiting' },
      { name: 'contamWater', type: 'boolean', label: 'Consumed contaminated water or food recently' }
    ]
  },

  asthma_copd: {
    id: 'asthma_copd',
    name: 'Asthma / COPD Screener',
    description: 'Screen for chronic respiratory conditions exacerbated by air pollution in India.',
    fields: [
      { name: 'age', type: 'number', label: 'Age', placeholder: 'e.g. 45' },
      { name: 'chronicCough', type: 'boolean', label: 'Chronic cough (lasting >3 weeks)' },
      { name: 'breathlessness', type: 'boolean', label: 'Shortness of breath during activity or at rest' },
      { name: 'wheezing', type: 'boolean', label: 'Wheezing / whistling sound while breathing' },
      { name: 'chestTightness', type: 'boolean', label: 'Chest tightness or heaviness' },
      { name: 'smoking', type: 'boolean', label: 'Current / former smoker or bidi user' },
      { name: 'airPollution', type: 'boolean', label: 'Exposed to high air pollution / crop burning smoke' },
      { name: 'familyHistory', type: 'boolean', label: 'Family history of asthma or COPD' }
    ]
  },

  pregnancy_risk: {
    id: 'pregnancy_risk',
    name: 'Pregnancy Risk Screener',
    description: 'Evaluate risk factors during pregnancy — critical for maternal health in rural India.',
    fields: [
      { name: 'age', type: 'number', label: 'Age', placeholder: 'e.g. 28' },
      { name: 'weeksPregnant', type: 'number', label: 'Weeks of Pregnancy', placeholder: 'e.g. 20' },
      { name: 'highBP', type: 'boolean', label: 'High blood pressure during pregnancy' },
      { name: 'bleeding', type: 'boolean', label: 'Vaginal bleeding' },
      { name: 'severeHeadache', type: 'boolean', label: 'Severe headache with blurred vision' },
      { name: 'swelling', type: 'boolean', label: 'Excessive swelling in hands, face, or legs' },
      { name: 'anemia', type: 'boolean', label: 'Diagnosed with anemia (low hemoglobin)' },
      { name: 'previousComplications', type: 'boolean', label: 'Complications in previous pregnancy' },
      { name: 'noAntenatalCare', type: 'boolean', label: 'Not receiving regular antenatal checkups' }
    ]
  },

  malnutrition: {
    id: 'malnutrition',
    name: 'Child Malnutrition Screener',
    description: 'Screen children (0-5 years) for stunting, wasting, and underweight indicators.',
    fields: [
      { name: 'childAge', type: 'number', label: 'Child Age (in months)', placeholder: 'e.g. 24' },
      { name: 'weight', type: 'number', label: 'Current Weight (kg)', placeholder: 'e.g. 9.5' },
      { name: 'height', type: 'number', label: 'Current Height (cm)', placeholder: 'e.g. 78' },
      { name: 'poorFeeding', type: 'boolean', label: 'Poor appetite / refuses to eat' },
      { name: 'frequentIllness', type: 'boolean', label: 'Frequently ill (>3 times in last 6 months)' },
      { name: 'diarrhea', type: 'boolean', label: 'Recurrent diarrhea episodes' },
      { name: 'noBreastfeeding', type: 'boolean', label: 'Not breastfed for first 6 months' },
      { name: 'lowIncome', type: 'boolean', label: 'Family below poverty line / limited food access' }
    ]
  },

  diabetic_retinopathy: {
    id: 'diabetic_retinopathy',
    name: 'Diabetic Retinopathy Screener',
    description: 'Screen for eye complications linked to diabetes — a leading cause of blindness in India.',
    fields: [
      { name: 'age', type: 'number', label: 'Age', placeholder: 'e.g. 50' },
      { name: 'diabetesYears', type: 'number', label: 'Years since diabetes diagnosis', placeholder: 'e.g. 10' },
      { name: 'blurredVision', type: 'boolean', label: 'Blurred or fluctuating vision' },
      { name: 'floaters', type: 'boolean', label: 'Dark spots or floaters in vision' },
      { name: 'difficultyNightVision', type: 'boolean', label: 'Difficulty seeing at night' },
      { name: 'uncontrolledSugar', type: 'boolean', label: 'HbA1c > 7% or uncontrolled blood sugar' },
      { name: 'highBP', type: 'boolean', label: 'History of high blood pressure' },
      { name: 'noEyeCheckup', type: 'boolean', label: 'No eye checkup in last 12 months' }
    ]
  },

  dental_health: {
    id: 'dental_health',
    name: 'Dental Health Screener',
    description: 'Screen for oral health issues related to tobacco, gutka, and pan masala use in India.',
    fields: [
      { name: 'age', type: 'number', label: 'Age', placeholder: 'e.g. 35' },
      { name: 'toothPain', type: 'boolean', label: 'Persistent tooth pain or sensitivity' },
      { name: 'bleedingGums', type: 'boolean', label: 'Bleeding gums while brushing' },
      { name: 'looseTeeth', type: 'boolean', label: 'Loose or shifting teeth' },
      { name: 'mouthSores', type: 'boolean', label: 'Mouth sores or white/red patches (>2 weeks)' },
      { name: 'tobaccoUse', type: 'boolean', label: 'Uses tobacco, gutka, pan masala, or betel nut' },
      { name: 'badBreath', type: 'boolean', label: 'Persistent bad breath' },
      { name: 'noDentalVisit', type: 'boolean', label: 'No dental visit in last 12 months' }
    ]
  },

  skin_fungal: {
    id: 'skin_fungal',
    name: 'Skin Fungal Infection Screener',
    description: 'Screen for dermatophytosis and other fungal infections common in humid Indian climate.',
    fields: [
      { name: 'age', type: 'number', label: 'Age', placeholder: 'e.g. 30' },
      { name: 'itchyPatches', type: 'boolean', label: 'Itchy, red, ring-shaped skin patches' },
      { name: 'scaling', type: 'boolean', label: 'Skin scaling, flaking, or peeling' },
      { name: 'groinAffected', type: 'boolean', label: 'Groin, underarms, or skin folds affected' },
      { name: 'humid', type: 'boolean', label: 'Live in hot and humid area' },
      { name: 'tightClothing', type: 'boolean', label: 'Wear tight / synthetic clothing regularly' },
      { name: 'recurringInfection', type: 'boolean', label: 'Recurring infection (>3 episodes in past year)' },
      { name: 'sharedItems', type: 'boolean', label: 'Share towels, clothing, or personal items' }
    ]
  }
};

