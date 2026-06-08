export interface ScanTool {
  id: string;
  name: string;
  description: string;
  labels: string[];
  guidance: string;
}

export const scanToolsConfig: Record<string, ScanTool> = {
  skin: {
    id: 'skin',
    name: 'Skin Lesion Analysis',
    description: 'Screen for dermal abnormal pigmentation, melanomas, or lesions.',
    labels: ['Melanocytic Nevi', 'Melanoma', 'Benign Keratosis', 'Dermatofibroma', 'Vascular Lesions'],
    guidance: 'Ensure skin area is well-lit, free of cosmetics, and close to the lens. Hold camera steady.'
  },
  chest: {
    id: 'chest',
    name: 'Chest X-Ray Screening',
    description: 'Analyze chest radiographs for pneumonic consolidation or opacity indices.',
    labels: ['Normal Lung', 'Pneumonia / Consolidation', 'Pleural Effusion', 'Infiltrates'],
    guidance: 'Align crop boundary strictly to standard chest radiograph edges. Crop out non-lung details.'
  },
  mri: {
    id: 'mri',
    name: 'Brain MRI Triage',
    description: 'Triage brain scan slices for space-occupying lesions or structural midline shifts.',
    labels: ['Normal Structural MRI', 'Tumor Screen Highlight', 'Stroke Infarct Highlight', 'Ventricular Dilated'],
    guidance: 'Position axial slice in center of frame. Capture high resolution film crop.'
  },
  retina: {
    id: 'retina',
    name: 'Diabetic Retinopathy',
    description: 'Screen fundus photographs for microaneurysms, hemorrhages, or exudates.',
    labels: ['No Retinopathy (Normal)', 'Mild Non-proliferative (NPDR)', 'Moderate NPDR', 'Severe NPDR / Proliferative (PDR)'],
    guidance: 'Capture high fidelity central macula-focused fundus image. Avoid optical reflection glare.'
  },
  oral: {
    id: 'oral',
    name: 'Oral Cancer Screening',
    description: 'Triage oral mucosal photographs for erythroplakia, leukoplakia, or ulceration.',
    labels: ['Normal Mucosa', 'Leukoplakia (Pre-cancerous)', 'Erythroplakia', 'Oral Squamous Cell Carcinoma Risk'],
    guidance: 'Point light source directly inside mouth. Hold lens 10cm from mucosal lesion area.'
  }
};
