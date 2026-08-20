export interface ScanTool {
  id: string;
  name: string;
  description: string;
  category: 'radiology' | 'dermatology' | 'ophthalmology' | 'dental' | 'neurology' | 'infectious' | 'gynecology' | 'hematology' | 'pediatrics';
  labels: string[];
  guidance: string;
  modelArchitecture: string;
  calibratedThreshold: number; // minimum confidence for usable screening
}

export const scanToolsConfig: Record<string, ScanTool> = {
  // ── Existing Core Clinical Scanners ──
  skin: {
    id: 'skin',
    name: 'Skin Lesion & Melanoma CNN',
    description: 'Screen for dermal abnormal pigmentation, melanomas, or lesions.',
    category: 'dermatology',
    labels: ['Melanocytic Nevi', 'Melanoma Risk', 'Benign Keratosis', 'Dermatofibroma', 'Vascular Lesion'],
    guidance: 'Ensure skin area is well-lit, free of cosmetics, and close to the lens. Hold camera steady.',
    modelArchitecture: 'DenseNet-121 / MobileNetV2 Fine-Tuned',
    calibratedThreshold: 0.52
  },
  chest: {
    id: 'chest',
    name: 'Chest Radiograph (X-Ray) CNN',
    description: 'Analyze chest radiographs for pneumonic consolidation, opacity, or pleural effusion.',
    category: 'radiology',
    labels: ['Normal Lung Field', 'Pneumonia / Consolidation', 'Pleural Effusion', 'Pulmonary Infiltrates', 'Cardiomegaly Indicator'],
    guidance: 'Align crop boundary strictly to standard chest radiograph edges. Crop out non-lung artifacts.',
    modelArchitecture: 'CheXNet / DenseNet-121 Backbone',
    calibratedThreshold: 0.50
  },
  bone: {
    id: 'bone',
    name: 'Bone Fracture & Density CNN',
    description: 'Triage musculoskeletal X-rays for cortical bone discontinuity, hairline fractures, or osteopenia.',
    category: 'radiology',
    labels: ['Intact Cortical Bone', 'Fracture / Discontinuity Detected', 'Joint Space Narrowing', 'Osteopenic Pattern'],
    guidance: 'Ensure the affected joint/bone segment is centered with high radiographic contrast and minimal blur.',
    modelArchitecture: 'ResNet-50 / DenseNet Backbone',
    calibratedThreshold: 0.50
  },
  oral: {
    id: 'oral',
    name: 'Oral Mucosa & Cancer CNN',
    description: 'Triage oral mucosal photographs for erythroplakia, leukoplakia, or ulceration.',
    category: 'dental',
    labels: ['Normal Oral Mucosa', 'Leukoplakia (Pre-cancerous)', 'Erythroplakia Patch', 'Oral Ulceration / Suspicious Plaque'],
    guidance: 'Point bright light source directly inside mouth. Hold lens 10cm from mucosal lesion area.',
    modelArchitecture: 'EfficientNet-B0 Specialized',
    calibratedThreshold: 0.50
  },
  retina: {
    id: 'retina',
    name: 'Diabetic Retinopathy CNN',
    description: 'Screen fundus photographs for microaneurysms, hemorrhages, or hard exudates.',
    category: 'ophthalmology',
    labels: ['No Retinopathy (Normal)', 'Mild Non-proliferative (NPDR)', 'Moderate NPDR', 'Severe / Proliferative (PDR)'],
    guidance: 'Capture high fidelity central macula-focused fundus image. Avoid optical reflection glare.',
    modelArchitecture: 'ResNet-50 Retinal Classifier',
    calibratedThreshold: 0.50
  },
  mri: {
    id: 'mri',
    name: 'Brain MRI Triage CNN',
    description: 'Triage brain scan slices for space-occupying lesions or structural midline shifts.',
    category: 'neurology',
    labels: ['Normal Structural MRI', 'Space-Occupying Lesion', 'Infarct / Ischemic Pattern', 'Ventricular Asymmetry'],
    guidance: 'Position axial slice in center of frame. Capture high resolution film crop.',
    modelArchitecture: 'U-Net / DenseNet Feature Extractor',
    calibratedThreshold: 0.52
  },

  // ── 10 NEW India-Specific High-Burden Scanners ──
  tb_sputum: {
    id: 'tb_sputum',
    name: 'Tuberculosis Sputum Smear CNN',
    description: 'Screen ZN-stained microscopic sputum smears for Acid-Fast Bacilli (AFB) clusters.',
    category: 'infectious',
    labels: ['Negative / Non-Acid-Fast', 'Low Bacterial Density (AFB 1+)', 'Moderate AFB Burden (2+)', 'High Bacillary Density (3+)'],
    guidance: 'Place microscopic sputum slide under bright uniform illumination at 100x oil immersion equivalent or high-res photo.',
    modelArchitecture: 'MobileNetV2 / ResNet-50 Sputum Classifier',
    calibratedThreshold: 0.50
  },
  malaria_smear: {
    id: 'malaria_smear',
    name: 'Malaria Parasite Smear CNN',
    description: 'Screen Giemsa-stained thin blood smears for intra-erythrocytic Plasmodium rings.',
    category: 'infectious',
    labels: ['Uninfected Erythrocytes', 'Plasmodium Falciparum Ring Form', 'Plasmodium Vivax Trophozoite', 'Gametocyte Observed'],
    guidance: 'Focus strictly on monolayer region of Giemsa-stained blood smear. Ensure uniform focal plane.',
    modelArchitecture: 'NIH Malaria CNN / DenseNet-121',
    calibratedThreshold: 0.52
  },
  cervical_via: {
    id: 'cervical_via',
    name: 'Cervical Cancer (VIA Colposcopy) CNN',
    description: 'Triage visual inspection with acetic acid (VIA) photographs for acetowhite squamous changes.',
    category: 'gynecology',
    labels: ['Normal Cervical Epithelium (VIA Negative)', 'Dense Acetowhite Lesion (VIA Positive)', 'Atypical Vascular Punctation', 'Suspicious Ulcerative Mass'],
    guidance: 'Capture sharp cervical os image 1-minute post-acetic acid application with adequate speculum light.',
    modelArchitecture: 'EfficientNet-B1 Colposcopy Classifier',
    calibratedThreshold: 0.50
  },
  anemia_eye: {
    id: 'anemia_eye',
    name: 'Non-Invasive Anemia (Conjunctiva) CNN',
    description: 'Analyze palpebral conjunctiva eyelid photographs for microvascular pallor indicators.',
    category: 'hematology',
    labels: ['Healthy Pink Conjunctiva (Hb > 12 g/dL)', 'Mild Conjunctival Pallor (Hb 10-12)', 'Moderate Anemic Pallor (Hb 7-10)', 'Severe Microvascular Pallor (Hb < 7)'],
    guidance: 'Gently pull lower eyelid downward in natural daylight. Avoid artificial flash reflections.',
    modelArchitecture: 'MobileNetV2 Palpebral Chrominance Analyzer',
    calibratedThreshold: 0.50
  },
  cataract_eye: {
    id: 'cataract_eye',
    name: 'Cataract & Corneal Opacity CNN',
    description: 'Evaluate anterior segment and pupillary photos for lens opacity and corneal clouding.',
    category: 'ophthalmology',
    labels: ['Clear Optical Axis (Normal)', 'Early Nuclear / Cortical Cataract', 'Mature Dense Cataract', 'Corneal Opacity / Pterygium'],
    guidance: 'Position camera 15cm from open eye under soft diffused room lighting. Keep pupil centered.',
    modelArchitecture: 'ODIR ResNet-50 Anterior Eye Classifier',
    calibratedThreshold: 0.50
  },
  diabetic_foot: {
    id: 'diabetic_foot',
    name: 'Diabetic Foot Ulcer (DFU) CNN',
    description: 'Assess diabetic plantar and digit ulcers for tissue granulation, necrosis, and Wagner grade.',
    category: 'dermatology',
    labels: ['Intact Neuropathic Skin', 'Superficial Ulcer (Wagner Grade 1)', 'Deep Ulcer / Tendon Exposure (Grade 2-3)', 'Necrotic / Ischemic Gangrene (Grade 4-5)'],
    guidance: 'Clean and dry the foot area. Photograph wound perpendicular to the skin surface under bright light.',
    modelArchitecture: 'DFUC2021 DenseNet-121 Classifier',
    calibratedThreshold: 0.52
  },
  neonatal_jaundice: {
    id: 'neonatal_jaundice',
    name: 'Neonatal Sclera Jaundice (Bilirubin) CNN',
    description: 'Screen newborn sclera and forehead dermal color tones for elevated bilirubin risk.',
    category: 'pediatrics',
    labels: ['Normal Bilirubin Tone (<5 mg/dL)', 'Mild Physiological Jaundice (5-10 mg/dL)', 'Moderate Hyperbilirubinemia (10-15 mg/dL)', 'High Jaundice Risk (>15 mg/dL)'],
    guidance: 'Capture newborn face and sclera under indirect natural daylight. Keep baby calm and eyes gently open.',
    modelArchitecture: 'BiliCam MobileNetV2 Chromaticity Model',
    calibratedThreshold: 0.50
  },
  sickle_cell: {
    id: 'sickle_cell',
    name: 'Sickle Cell & Thalassemia Smear CNN',
    description: 'Examine peripheral blood smear micrographs for sickled drepanocytes and target cells.',
    category: 'hematology',
    labels: ['Normal Biconcave Discocytes', 'Sickled Crescent Drepanocytes', 'Codocytes (Target Cells)', 'Microcytic Anisopoikilocytosis'],
    guidance: 'Capture clear high magnification field from peripheral blood smear. Avoid overlapping thick areas.',
    modelArchitecture: 'ResNet-50 Hematology Classifier',
    calibratedThreshold: 0.50
  },
  fungal_tinea: {
    id: 'fungal_tinea',
    name: 'Superficial Fungal Tinea (Ringworm) CNN',
    description: 'Triage cutaneous annular scaling plaques for dermatophytosis (Tinea corporis/cruris/versicolor).',
    category: 'dermatology',
    labels: ['Non-Fungal Dermal Finding', 'Active Tinea (Ringworm) Annular Border', 'Tinea Versicolor Hypopigmentation', 'Candidal Intertrigo'],
    guidance: 'Ensure the active outer border of the rash is sharp and centered in focus. Wipe excess sweat.',
    modelArchitecture: 'ISIC DermNet MobileNetV2 Fine-Tuned',
    calibratedThreshold: 0.50
  },
  dental_fluorosis: {
    id: 'dental_fluorosis',
    name: 'Dental Fluorosis & Caries CNN',
    description: 'Screen anterior teeth photographs for endemic fluorosis enamel mottling and caries.',
    category: 'dental',
    labels: ['Healthy Intact Enamel', 'Mild Fluorosis (Chalky White Streaks)', 'Moderate to Severe Fluorosis (Brown Pitting)', 'Active Dental Caries Cavity'],
    guidance: 'Smile showing front teeth. Wipe teeth with a tissue and shine a light directly across the enamel surface.',
    modelArchitecture: 'DentalVision EfficientNet-B0',
    calibratedThreshold: 0.50
  }
};
