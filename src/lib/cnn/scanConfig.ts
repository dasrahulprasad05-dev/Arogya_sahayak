export interface ScanTool {
  id: string;
  name: string;
  description: string;
  category: 'radiology' | 'dermatology' | 'ophthalmology' | 'dental' | 'neurology';
  labels: string[];
  guidance: string;
  modelArchitecture: string;
  calibratedThreshold: number; // minimum confidence for usable screening
}

export const scanToolsConfig: Record<string, ScanTool> = {
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
  }
};
