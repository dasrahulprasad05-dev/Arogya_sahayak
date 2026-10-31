export interface ScanTool {
  id: string;
  name: string;
  description: string;
  category: 'ophthalmology' | 'neurology' | 'pulmonology' | 'dermatology' | 'radiology';
  inputModality: string;
  labels: string[];
  guidance: string;
  modelArchitecture: string;
  calibratedThreshold: number; // minimum confidence for usable screening
}

export const scanToolsConfig: Record<string, ScanTool> = {
  // 1. Diabetic Retinopathy
  retinopathy: {
    id: 'retinopathy',
    name: 'Diabetic Retinopathy Detection',
    description: 'Screen retinal fundus photographs for microaneurysms, hemorrhages, and exudates.',
    category: 'ophthalmology',
    inputModality: 'Retinal Fundus Image',
    labels: ['No Retinopathy (Normal)', 'Mild Non-Proliferative (NPDR)', 'Moderate NPDR', 'Severe / Proliferative (PDR)'],
    guidance: 'Capture high-fidelity macula-centered fundus photo. Avoid flash reflection and optical lens flare.',
    modelArchitecture: 'MobileNetV2 / ResNet-50 Retinal Classifier',
    calibratedThreshold: 0.52
  },

  // 2. Alzheimer's Disease
  alzheimer: {
    id: 'alzheimer',
    name: "Alzheimer's Disease Detection",
    description: 'Analyze structural brain MRI scans for hippocampal volume loss and ventricular enlargement.',
    category: 'neurology',
    inputModality: 'Brain MRI (T1-weighted)',
    labels: ['Non-Demented (Normal Control)', 'Very Mild Cognitive Decline', 'Mild Demented', 'Moderate Alzheimer Dementia'],
    guidance: 'Upload T1-weighted coronal or axial brain MRI slice with clear contrast around temporal lobes and ventricles.',
    modelArchitecture: 'MobileNetV2 / 3D Deep Slice Extractor',
    calibratedThreshold: 0.50
  },

  // 3. Brain Tumor Grade
  brain_tumor: {
    id: 'brain_tumor',
    name: 'Brain Tumor Grade Classification',
    description: 'Classify intracranial MRI scans for glioma grade, meningioma, or pituitary neoplasms.',
    category: 'neurology',
    inputModality: 'Brain MRI Scans (T1-CE / FLAIR)',
    labels: ['No Tumor Detected (Healthy)', 'Glioma (Low/High Grade)', 'Meningioma', 'Pituitary Tumor'],
    guidance: 'Upload contrast-enhanced T1-CE or FLAIR axial slice centered on cranial vault with minimal motion blur.',
    modelArchitecture: 'DenseNet-121 / MobileNetV2 Tumor Head',
    calibratedThreshold: 0.52
  },

  // 4. Lung Cancer
  lung_cancer: {
    id: 'lung_cancer',
    name: 'Lung Cancer Detection',
    description: 'Screen thoracic CT scans for pulmonary nodule spiculation, calcification, and malignancy risks.',
    category: 'pulmonology',
    inputModality: 'Thoracic CT Scans (LDCT)',
    labels: ['Benign Parenchyma / Clear', 'Suspicious Pulmonary Nodule', 'Non-Small Cell Carcinoma (NSCLC)', 'Small Cell Malignancy Risk'],
    guidance: 'Upload high-resolution thoracic axial CT slice with standard lung window setting (-600 to -700 HU).',
    modelArchitecture: 'EfficientNet-B1 / MobileNetV2 CT Classifier',
    calibratedThreshold: 0.52
  },

  // 5. Dry Eye Disease
  dry_eye: {
    id: 'dry_eye',
    name: 'Dry Eye Disease Severity Prediction',
    description: 'Assess anterior eye and tear film photographs for tear breakup and ocular surface instability.',
    category: 'ophthalmology',
    inputModality: 'Eye / Tear Film Photos',
    labels: ['Normal Tear Film (Grade 0)', 'Mild Tear Instability (Grade 1)', 'Moderate Evaporative Dry Eye (Grade 2)', 'Severe Ocular Surface Breakdown (Grade 3)'],
    guidance: 'Photograph ocular surface under diffuse illumination showing tear meniscus height along the lower eyelid.',
    modelArchitecture: 'MobileNetV2 Ocular Surface Analyzer',
    calibratedThreshold: 0.50
  },

  // 6. Keratoconus Early Detection
  keratoconus: {
    id: 'keratoconus',
    name: 'Keratoconus Early Detection',
    description: 'Triage corneal curvature and anterior segment photos for early ectatic corneal thinning.',
    category: 'ophthalmology',
    inputModality: 'Corneal / Eye Topography',
    labels: ['Normal Corneal Curvature', 'Subclinical / Forme Fruste Keratoconus', 'Moderate Keratoconic Ectasia', 'Advanced Keratoconus with Apical Scarring'],
    guidance: 'Capture anterior eye cornea or Pentacam topography map showing axial curvature and central elevation.',
    modelArchitecture: 'ResNet-50 / MobileNetV2 Corneal Topographer',
    calibratedThreshold: 0.50
  },

  // 7. Skin Disease Classification
  skin_disease: {
    id: 'skin_disease',
    name: 'Skin Disease Classification',
    description: 'Classify dermal lesions across melanoma, atypical nevi, psoriasis, and inflammatory plaques.',
    category: 'dermatology',
    inputModality: 'Skin / Dermoscopy Images',
    labels: ['Benign Epidermal Tissue', 'Melanocytic Nevus / Mole', 'Psoriasis / Inflammatory Plaque', 'Eczema / Atopic Dermatitis', 'Melanoma / Carcinoma Risk'],
    guidance: 'Ensure skin lesion is well-lit in natural daylight, centered, free of cosmetics, hair, or casting shadows.',
    modelArchitecture: 'ISIC HAM10000 MobileNetV2 Fine-Tuned',
    calibratedThreshold: 0.52
  },

  // 8. Pneumonia Detection
  pneumonia: {
    id: 'pneumonia',
    name: 'Pneumonia Detection',
    description: 'Screen chest radiographs for focal consolidation, alveolar opacification, and air bronchograms.',
    category: 'pulmonology',
    inputModality: 'Chest X-rays (PA View)',
    labels: ['Normal Clear Lung Parenchyma', 'Bacterial Pneumonia (Focal Consolidation)', 'Viral Pneumonia (Bilateral Interstitial Opacity)'],
    guidance: 'Upload full upright PA chest radiograph. Ensure bilateral costophrenic angles and lung apices are visible.',
    modelArchitecture: 'CheXNet / MobileNetV2 Pneumonia Classifier',
    calibratedThreshold: 0.50
  },

  // 9. Bone Fracture Detection
  bone_fracture: {
    id: 'bone_fracture',
    name: 'Bone Fracture Detection',
    description: 'Triage musculoskeletal radiographs for cortical bone discontinuity, hairline cracks, and dislocations.',
    category: 'radiology',
    inputModality: 'Musculoskeletal X-rays',
    labels: ['Intact Cortical Bone Structure', 'Acute Cortical Bone Fracture', 'Hairline / Stress Fracture', 'Joint Dislocation / Space Narrowing'],
    guidance: 'Ensure the affected skeletal long bone or joint is centered with sharp radiographic contrast and minimal blur.',
    modelArchitecture: 'MURA ResNet-50 / MobileNetV2 Classifier',
    calibratedThreshold: 0.50
  },

  // 10. Tuberculosis Detection
  tuberculosis: {
    id: 'tuberculosis',
    name: 'Tuberculosis Detection',
    description: 'Analyze chest X-rays for apical fibro-cavitary lesions, miliary mottling, and pleural effusion.',
    category: 'pulmonology',
    inputModality: 'Chest X-rays (PA View)',
    labels: ['Normal Pulmonary Cavity', 'Active Pulmonary Tuberculosis (Apical Cavitation)', 'Miliary TB Infiltrates', 'Healed / Fibrocalcific Lesion'],
    guidance: 'Upload high-contrast chest X-ray. Inspect apical lung zones and subclavicular areas for infiltrates.',
    modelArchitecture: 'Shenzhen-Montgomery MobileNetV2 Classifier',
    calibratedThreshold: 0.52
  }
};
