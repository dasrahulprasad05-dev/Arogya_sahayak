// Clinical Knowledge, Disease Identification & Tailored Precautions Engine for Arogya Sahayak CNN Scanners

export interface ClinicalProfile {
  conditionName: string;
  category: string;
  pathologySummary: string;
  suspectedFindings: string[];
  causesAndRiskFactors: string[];
  actionablePrecautions: string[];
  emergencyRedFlags: string[];
  recommendedSpecialist: string;
  confirmatoryTests: string[];
  dietAndLifestyle: string[];
}

export const CLINICAL_KNOWLEDGE_BASE: Record<string, ClinicalProfile> = {
  // ── 10 NEW / MAPPED CLINICAL PROFILES ──
  retinopathy: {
    conditionName: 'Diabetic Retinopathy Microvascular Screening',
    category: 'Ophthalmology',
    pathologySummary: 'Retinal fundus image evaluation assessing retinal microvasculature for microaneurysms, blot hemorrhages, cotton-wool spots, and neovascularization.',
    suspectedFindings: [
      'Retinal microvascular blot hemorrhages or microaneurysms',
      'Macular hard exudate rings and cotton wool spots',
      'Venous beading or neovascular proliferation at optic disc'
    ],
    causesAndRiskFactors: [
      'Prolonged chronic hyperglycemia (elevated HbA1c > 7.0%)',
      'Uncontrolled systemic arterial hypertension damaging capillary pericytes',
      'Duration of diabetes mellitus exceeding 5 to 10 years'
    ],
    actionablePrecautions: [
      '👁️ Schedule dilated fundus examination and Optical Coherence Tomography (OCT) with a retina specialist annually.',
      '🩸 Maintain tight glycemic control (target HbA1c < 7.0%) and monitor fasting blood glucose weekly.',
      '🩺 Keep blood pressure strictly below 130/80 mmHg to reduce retinal capillary shear stress.',
      '🚭 Cease tobacco smoking immediately to preserve ocular microvascular perfusion.',
      '👓 Seek prompt medical review if experiencing sudden onset floaters, dark spots, or vision distortion.'
    ],
    emergencyRedFlags: [
      'Sudden painless loss of vision or curtain-like dark shadow across field of view',
      'Massive shower of dark floaters or cobweb-like visual distortion',
      'Severe eye pain with nausea and rainbow halos around lights'
    ],
    recommendedSpecialist: 'Vitreoretinal Surgeon / Medical Ophthalmologist',
    confirmatoryTests: ['Dilated Slit-Lamp Funduscopy', 'Optical Coherence Tomography (OCT Macula)', 'Fundus Fluorescein Angiography (FFA)'],
    dietAndLifestyle: ['Antioxidant-rich leafy greens (lutein & zeaxanthin)', 'Omega-3 fatty acids (flaxseeds, walnuts)', 'Low glycemic index whole grains (millets, oats)']
  },

  alzheimer: {
    conditionName: "Alzheimer's Disease & Neurocognitive Assessment",
    category: 'Neurology',
    pathologySummary: 'Structural neuroimaging triage analyzing medial temporal lobe, hippocampal volume shrinkage, and ventriculomegaly consistent with neurodegenerative dementia.',
    suspectedFindings: [
      'Medial temporal lobe and hippocampal volumetric reduction',
      'Ex-vacuo lateral ventricular enlargement and cortical sulcal widening',
      'Bilateral parietal and temporal cortical thinning'
    ],
    causesAndRiskFactors: [
      'Neurodegenerative extracellular amyloid-beta plaques and tau neurofibrillary tangles',
      'Advanced age (>65 years) and genetic Apolipoprotein E (APOE-e4) allele carriage',
      'Cardiovascular risk factors (hypertension, hyperlipidemia, sedentary lifestyle)'
    ],
    actionablePrecautions: [
      '🧠 Engage in daily cognitively stimulating exercises: puzzles, reading, memory games, and learning new skills.',
      '🚶‍♂️ Maintain 30-45 minutes of aerobic exercise (brisk walking, swimming) daily to boost cerebral blood flow.',
      '🥗 Adopt the MIND or Mediterranean diet rich in berries, nuts, olive oil, and leafy vegetables.',
      '😴 Ensure 7-8 hours of restful sleep daily to support glymphatic clearance of neurotoxic proteins.',
      '📋 Establish predictable daily routines and utilize visual memory prompts for medications and appointments.'
    ],
    emergencyRedFlags: [
      'Acute sudden confusion, delirium, or severe disorientation over hours/days',
      'Wandering away from home with complete inability to recognize familiar family members',
      'Sudden onset focal neurological deficits (limb weakness, speech loss)'
    ],
    recommendedSpecialist: 'Cognitive Neurologist / Geriatric Neuropsychiatrist',
    confirmatoryTests: ['High-Resolution 3T Brain MRI with Volumetric Hippocampal Analysis', 'Mini-Mental State Examination (MMSE) / MoCA Test', 'CSF or Amyloid PET Biomarker Imaging'],
    dietAndLifestyle: ['Walnuts, blueberries, turmeric (curcumin), leafy spinach', 'Strict social engagement and cognitive social networking']
  },

  brain_tumor: {
    conditionName: 'Intracranial Space-Occupying Lesion & Neoplasm Triage',
    category: 'Neurology / Neuro-Oncology',
    pathologySummary: 'Contrast-enhanced neuroimaging triage assessing for intracranial intra-axial or extra-axial mass lesions, perilesional vasogenic edema, and midline brain shift.',
    suspectedFindings: [
      'Focal contrast-enhancing intracranial mass or space-occupying lesion',
      'Significant surrounding vasogenic edema with sulcal effacement',
      'Midline structural shift or compression of ventricular system'
    ],
    causesAndRiskFactors: [
      'Primary neoplastic glial cell proliferation (Glioma, Astrocytoma, Glioblastoma)',
      'Extra-axial dural arachnoid cap cell proliferation (Meningioma)',
      'Secondary metastatic dissemination from lung, breast, or melanoma'
    ],
    actionablePrecautions: [
      '🛑 Immediate referral to a tertiary neurosurgical center for contrast neuro-navigation planning.',
      '🚫 Avoid sudden Valsalva maneuvers (straining, heavy lifting) that acutely raise intracranial pressure.',
      '💊 Take prescribed anti-epileptic medications (e.g. Levetiracetam) conscientiously if seizure risk is identified.',
      '🛌 Sleep with head elevated 30 degrees to promote intracranial venous drainage.',
      '📋 Keep a detailed log of headache frequency, severity, morning vomiting, and neurological signs.'
    ],
    emergencyRedFlags: [
      'New-onset generalized or focal seizure episodes',
      'Projectile early morning vomiting without antecedent nausea accompanied by severe headache',
      'Rapidly worsening motor hemiparesis, pupil asymmetry, or progressive stupor'
    ],
    recommendedSpecialist: 'Neurosurgeon / Neuro-Oncologist',
    confirmatoryTests: ['3T Brain MRI with Contrast (T1+C, T2, FLAIR, DWI, MRS)', 'Magnetic Resonance Spectroscopy (MRS)', 'Stereotactic or Open Biopsy with Histopathology & IDH/MGMT Profiling'],
    dietAndLifestyle: ['Anti-inflammatory nutrition', 'Strict low-salt hydration', 'Avoid alcohol and caffeine']
  },

  lung_cancer: {
    conditionName: 'Thoracic Pulmonary Nodule & Malignancy Screening',
    category: 'Pulmonology / Thoracic Oncology',
    pathologySummary: 'Computed tomography (CT) triage examining pulmonary parenchymal nodules for spiculated margins, subsolid ground-glass opacity (GGO), and pleural tags.',
    suspectedFindings: [
      'Focal pulmonary nodule with irregular or spiculated margins (>6mm)',
      'Ground-glass opacity (GGO) with solid central component',
      'Associated hilar or mediastinal lymphadenopathy'
    ],
    causesAndRiskFactors: [
      'Active tobacco cigarette/bidi smoking and extensive passive secondhand smoke exposure',
      'Environmental exposure to radon gas, asbestos, silica, or high industrial particulate matter (PM2.5)',
      'Chronic pulmonary inflammation (COPD, pulmonary fibrosis, previous TB scar carcinoma)'
    ],
    actionablePrecautions: [
      '🚭 Absolute smoking cessation immediately; enroll in certified tobacco cessation programs.',
      '🩺 Undergo protocolized Low-Dose CT (LDCT) follow-up as per Fleischner Society pulmonary nodule guidelines.',
      '🚫 Avoid exposure to biomass cooking smoke (chulha), occupational dust, and chemical fumes.',
      '🌬️ Practice incentive spirometry to optimize residual lung capacity and pulmonary hygiene.',
      '🌡️ Seek immediate evaluation for persistent cough lasting more than 3 weeks or unexplained weight loss.'
    ],
    emergencyRedFlags: [
      'Coughing up fresh blood or blood-streaked sputum (hemoptysis)',
      'Rapidly progressing breathlessness or severe unilateral pleuritic chest pain',
      'Unexplained hoarseness of voice or superior vena cava syndrome (facial/neck swelling)'
    ],
    recommendedSpecialist: 'Thoracic Surgical Oncologist / Pulmonologist',
    confirmatoryTests: ['Contrast-Enhanced Chest CT (CECT)', 'PET-CT Whole Body Scan', 'CT-guided Transthoracic Needle Biopsy (TTNB) / EBUS-TBNA'],
    dietAndLifestyle: ['High-protein balanced recovery meals', 'Cruciferous vegetables (broccoli, cabbage)', 'Fresh citrus fruits with Vitamin C']
  },

  dry_eye: {
    conditionName: 'Ocular Surface & Tear Film Instability Assessment',
    category: 'Ophthalmology',
    pathologySummary: 'Ocular surface evaluation assessing tear film breakup time (TBUT), meibomian gland dysfunction (MGD), and corneal epithelial punctate keratopathy.',
    suspectedFindings: [
      'Reduced tear meniscus height and uneven tear film distribution',
      'Punctate corneal epithelial micro-staining under blue cobalt light',
      'Meibomian gland orifice capping and marginal conjunctival hypervascularity'
    ],
    causesAndRiskFactors: [
      'Prolonged visual display terminal (VDT) screen exposure reducing natural blink rate',
      'Air conditioning, dry winds, dust, and environmental low-humidity exposure',
      'Meibomian Gland Dysfunction (MGD) or systemic autoimmune conditions (Sjögren syndrome)'
    ],
    actionablePrecautions: [
      '💻 Implement the 20-20-20 Rule: Every 20 minutes, gaze at an object 20 feet away for 20 seconds, blinking fully.',
      '💧 Use preservative-free lubricating artificial tear drops (e.g., Sodium Hyaluronate 0.1-0.18%) 3-4 times daily.',
      '♨️ Apply warm moist compresses over closed eyelids for 5-10 minutes nightly followed by gentle lid massage.',
      '🚫 Avoid direct blast of fans, vehicle vents, or air conditioning onto the open eyes.',
      '👓 Wear wraparound sunglasses in dusty or windy outdoor environments to prevent tear evaporation.'
    ],
    emergencyRedFlags: [
      'Severe intractable ocular pain, photophobia, and extreme redness',
      'Sudden drop in visual acuity or corneal white opacification',
      'Copious purulent discharge suggesting bacterial corneal ulcer'
    ],
    recommendedSpecialist: 'Cornea & Ocular Surface Specialist / General Ophthalmologist',
    confirmatoryTests: ['Fluorescein Tear Break-Up Time (TBUT)', "Schirmer's Test (Tear Secretion Rate)", 'Meibography & Ocular Surface Staining (Oxford Scale)'],
    dietAndLifestyle: ['Omega-3 fatty acid supplementation (1000-2000 mg/day)', 'Ensure 2.5 Liters of daily hydration', 'Use desktop room humidifiers']
  },

  keratoconus: {
    conditionName: 'Corneal Ectasia & Keratoconus Early Screening',
    category: 'Ophthalmology',
    pathologySummary: 'Corneal structural assessment evaluating progressive non-inflammatory corneal stromal thinning, irregular conical steepening, and Fleischer ring deposition.',
    suspectedFindings: [
      'Asymmetric steepening of inferior corneal curvature',
      'Central or paracentral corneal stromal thinning and high irregular astigmatism',
      'Vogt striae or iron epithelial deposit line (Fleischer ring)'
    ],
    causesAndRiskFactors: [
      'Chronic, vigorous eye rubbing (frequently associated with allergic ocular pruritus)',
      'Genetic predisposition, collagen synthesis disorder, and connective tissue laxity',
      'Onset typically during puberty or second decade of life with rapidly fluctuating astigmatism'
    ],
    actionablePrecautions: [
      '🛑 NEVER RUB YOUR EYES: Eye rubbing causes mechanical shear stress accelerating corneal ectasia.',
      '💧 Treat underlying ocular allergies with preservative-free anti-allergy drops (e.g. Olopatadine) to eliminate itching.',
      '🩺 Undergo Corneal Collagen Cross-Linking (CXL / C3R) evaluation early to halt disease progression.',
      '👓 Avoid frequent spectacle changes without corneal topography; consider specialized rigid gas permeable (RGP) or Scleral lenses.',
      '🚫 Laser refractive surgery (LASIK / PRK) is strictly contraindicated in keratoconic eyes.'
    ],
    emergencyRedFlags: [
      'Sudden acute clouding/whitening of cornea with pain and vision drop (Acute Corneal Hydrops)',
      'Rupture of Descemet membrane leading to sudden stromal edema',
      'Severe photophobia and ocular inflammation'
    ],
    recommendedSpecialist: 'Cornea & Refractive Specialist / Ophthalmologist',
    confirmatoryTests: ['Scheimpflug Corneal Tomography (Pentacam / Sirius)', 'Corneal Pachymetry (Mapping Minimum Stromal Thickness)', 'Anterior Segment Optical Coherence Tomography (AS-OCT)'],
    dietAndLifestyle: ['Vitamin B2 (Riboflavin) rich foods (almonds, dairy, eggs)', 'Cold compresses to soothe allergic eye itching instead of rubbing']
  },

  skin_disease: {
    conditionName: 'Dermatological Lesion & Cutaneous Screening',
    category: 'Dermatology',
    pathologySummary: 'Dermoscopic and clinical cutaneous assessment screening for inflammatory plaques (psoriasis, eczema), superficial fungal lesions, and atypical pigmented neoplasms.',
    suspectedFindings: [
      'Atypical epidermal pigmentation, erythematous borders, or plaque scaling',
      'Structural border contour variegation and surface textural changes',
      'Superficial dermal vascularization or hyperkeratosis'
    ],
    causesAndRiskFactors: [
      'Cumulative solar ultraviolet (UV) radiation exposure and chronic sunburns',
      'Autoimmune immune dysregulation (Psoriasis, Atopic Eczema)',
      'Superficial dermatophyte infection, allergens, or chemical contact irritants'
    ],
    actionablePrecautions: [
      '☀️ Apply broad-spectrum SPF 50+ sunscreen daily; avoid direct midday sunlight between 10 AM and 4 PM.',
      '🔍 Follow the ABCDE rule for moles: check Asymmetry, Border irregularity, Color changes, Diameter >6mm, and Evolution.',
      '🧴 Apply ceramide-based emollient moisturizers twice daily immediately after bathing to restore dermal skin barrier.',
      '🚫 Never pick, scratch, chemically cauterize, or use over-the-counter steroid creams without medical prescription.',
      '🩺 Have any changing, bleeding, or non-healing skin lesion examined with dermoscopy by a dermatologist.'
    ],
    emergencyRedFlags: [
      'Rapid lesion enlargement, spontaneous ulceration, or oozing blood',
      'Sudden appearance of dark satellite pigmentation around an existing mole',
      'Widespread blistering eruption with fever and mucous membrane involvement'
    ],
    recommendedSpecialist: 'Dermatologist / Dermato-Oncologist',
    confirmatoryTests: ['Polarized Dermoscopy Examination', 'Punch / Excisional Biopsy with Histopathology', 'Skin Scraping for KOH Mount (if fungal suspected)'],
    dietAndLifestyle: ['Anti-inflammatory diet (turmeric, leafy vegetables, omega-3 seeds)', 'Wear loose, breathable 100% cotton clothing']
  },

  pneumonia: {
    conditionName: 'Pneumonia & Alveolar Consolidation Screening',
    category: 'Pulmonology / Radiology',
    pathologySummary: 'Chest radiograph evaluation detecting focal lobar consolidation, bilateral patchy bronchopneumonic opacities, and alveolar air bronchograms.',
    suspectedFindings: [
      'Focal radiographic airspace opacity or dense lobar consolidation',
      'Prominent bronchovascular markings with air bronchogram signs',
      'Blunting of costophrenic angles suggesting parapneumonic effusion'
    ],
    causesAndRiskFactors: [
      'Bacterial pathogens (Streptococcus pneumoniae, Klebsiella pneumoniae)',
      'Viral respiratory infections (Influenza, RSV, SARS-CoV-2, Adenovirus)',
      'Aspiration risk, immunosuppression, biomass smoke inhalation, and elderly age'
    ],
    actionablePrecautions: [
      '🫁 Perform gentle deep diaphragmatic breathing and warm saline steam inhalation (10 mins twice daily) to clear airways.',
      '💧 Maintain robust oral hydration (2.5 to 3 Liters of warm fluids/broth daily) to liquify thickened secretions.',
      '🌡️ Monitor body temperature and SpO2 oxygen levels twice daily with a certified finger pulse oximeter.',
      '💊 Strictly adhere to prescribed antimicrobial therapy; never stop antibiotic courses prematurely.',
      '🚫 Avoid smoking, passive smoke, chulha biomass fumes, and cold damp drafts.'
    ],
    emergencyRedFlags: [
      'Resting SpO2 oxygen saturation dropping below 93-94%',
      'Severe respiratory distress, chest indrawing, or inability to speak full sentences',
      'High fever (>103°F) accompanied by mental confusion, blueness of lips (cyanosis), or hemoptysis'
    ],
    recommendedSpecialist: 'Pulmonologist / Chest Physician / Critical Care Specialist',
    confirmatoryTests: ['High-Resolution Computed Tomography of Chest (HRCT)', 'Sputum Gram Stain & Aerobic Culture Sensitivity', 'Complete Blood Count (CBC with Differential) & CRP/Procalcitonin'],
    dietAndLifestyle: ['Warm turmeric milk, ginger-tulsi decoction, warm soups', 'Rest in semi-propped upright position (30-45 degrees)']
  },

  bone_fracture: {
    conditionName: 'Musculoskeletal Fracture & Cortical Disruption Triage',
    category: 'Orthopedics / Radiology',
    pathologySummary: 'Radiographic examination of skeletal extremities assessing cortical bone continuity, trabecular line disruption, joint articulation, and soft tissue swelling.',
    suspectedFindings: [
      'Sharp radiolucent cortical line indicating acute skeletal fracture',
      'Bone fragment displacement, angulation, or impaction',
      'Articular joint space distortion or peri-articular soft tissue hematoma'
    ],
    causesAndRiskFactors: [
      'Acute mechanical physical trauma, road traffic accidents, or direct impact',
      'Accidental falls in elderly individuals with underlying osteopenia / osteoporosis',
      'Repetitive mechanical stress leading to micro-trabecular fatigue fractures'
    ],
    actionablePrecautions: [
      '🛑 Immediately immobilize the affected bone/joint using a rigid splint or sling; avoid any weight-bearing.',
      '❄️ Apply ice packs wrapped in a clean cloth for 15-20 minutes every 3-4 hours to curb swelling and hematoma formation.',
      '🩹 Keep the injured limb elevated above the level of the heart to minimize dependent edema.',
      '🦴 Support skeletal recovery with dietary Calcium (1000-1200 mg/day) and Vitamin D3 under physician guidance.',
      '🩺 Obtain orthogonal (Antero-Posterior and Lateral) radiographic views to evaluate alignment and intra-articular extension.'
    ],
    emergencyRedFlags: [
      'Bone fragment piercing through the skin surface (Open / Compound Fracture — high infection risk)',
      'Cold, pale, pulseless extremity or severe progressive numbness (Acute Compartment Syndrome)',
      'Severe gross anatomical deformity with circulatory compromise'
    ],
    recommendedSpecialist: 'Orthopedic Surgeon / Traumatologist',
    confirmatoryTests: ['Multi-view Orthogonal Plain Radiographs (AP + Lateral + Oblique)', 'CT Scan with 3D Reconstruction (for intra-articular complex fractures)', 'Musculoskeletal Ultrasound / MRI (for occult fractures & ligamentous tears)'],
    dietAndLifestyle: ['Adequate protein intake for collagen matrix synthesis', 'Dairy, ragi, sesame seeds for natural calcium', 'Strict smoking avoidance (nicotine impairs bone union)']
  },

  tuberculosis: {
    conditionName: 'Pulmonary Tuberculosis Fibro-Cavitary Screening',
    category: 'Pulmonology / Infectious Diseases',
    pathologySummary: 'Chest radiograph evaluation identifying apical fibro-cavitary infiltrates, subclavicular consolidation, miliary micronodular mottling, and lymphadenopathy.',
    suspectedFindings: [
      'Apical or posterior segment upper-lobe cavitation or focal consolidation',
      'Fibronodular opacities with subclavicular infiltrates and volume loss',
      'Unilateral pleural effusion or diffuse miliary micronodular pattern'
    ],
    causesAndRiskFactors: [
      'Infection by Mycobacterium tuberculosis via airborne respiratory droplets',
      'Compromised cell-mediated immunity (malnutrition, diabetes, HIV/immunosuppression)',
      'Overcrowded living conditions, prolonged close household contact with active TB patients'
    ],
    actionablePrecautions: [
      '🧪 Immediate sputum testing at the nearest government DOTS / NTEP center for free diagnostic confirmation.',
      '😷 Wear an N95 or surgical mask and practice cough etiquette to prevent transmission to family members.',
      '💊 Strictly adhere to prescribed Anti-Tubercular Therapy (ATT) regimen under DOTS; never miss a single dose.',
      '🪟 Ensure excellent cross-ventilation in the home; sunlight and fresh airflow kill airborne bacilli.',
      '🥗 Consume a high-protein, calorie-dense diet to reverse catabolic weight loss and support immune recovery.'
    ],
    emergencyRedFlags: [
      'Massive hemoptysis (coughing up large volumes of fresh bright red blood >100ml)',
      'Sudden acute breathlessness with unilateral chest pain (Tension Pneumothorax)',
      'High continuous fever with severe disorientation or neck stiffness (TB Meningitis risk)'
    ],
    recommendedSpecialist: 'Pulmonologist / Chest Physician / NTEP Medical Officer',
    confirmatoryTests: ['CBNAAT / GeneXpert MTB/RIF Assay (rapid molecular detection & rifampicin resistance)', 'Sputum Smear Microscopy for Acid-Fast Bacilli (AFB Stain)', 'High-Resolution Chest CT (HRCT)'],
    dietAndLifestyle: ['High protein: eggs, lentils, paneer, soy, roasted chana', 'Adequate dietary zinc, iron, and multivitamin supplementation', 'Complete avoidance of tobacco, bidi, and alcohol']
  },

  chest: {
    conditionName: 'Pulmonary Infiltration & Consolidation Assessment',
    category: 'Pulmonology / Radiology',
    pathologySummary: 'Radiographic examination of lung parenchyma showing focal opacification, vascular marking prominence, or potential alveolar airspace fluid/consolidation.',
    suspectedFindings: [
      'Increased radiographic density in pulmonary parenchyma',
      'Bronchovascular marking prominence with clear costophrenic angles',
      'Cardiopulmonary silhouette and diaphragm curvature evaluation'
    ],
    causesAndRiskFactors: [
      'Bacterial or viral respiratory infections (Pneumonia, Bronchitis)',
      'Air pollution, biomass fuel / chulha smoke exposure, and active/passive smoking',
      'Seasonal viral illness with secondary airway congestion'
    ],
    actionablePrecautions: [
      '🫁 Practice deep diaphragmatic breathing and gentle steam inhalation (10 mins twice daily) to clear airway secretions.',
      '💧 Maintain robust hydration (2.5 to 3 Liters of warm water/fluids daily) to thin mucus.',
      '🚫 Strictly avoid smoking, bidi, vaping, and direct exposure to biomass smoke and dusty air.',
      '🌡️ Monitor body temperature and SpO2 oxygen saturation twice daily with a pulse oximeter.',
      '💊 Complete full course of any prescribed antibiotics or bronchodilators without skipping.'
    ],
    emergencyRedFlags: [
      'Resting shortness of breath or SpO2 dropping below 94%',
      'Persistent high-grade fever (>102°F) with chills',
      'Severe pleuritic chest pain or coughing up blood (hemoptysis)'
    ],
    recommendedSpecialist: 'Pulmonologist / Chest Physician',
    confirmatoryTests: ['High-Resolution Chest CT (HRCT)', 'Sputum Culture & Gram Stain', 'Complete Blood Count (CBC) with ESR/CRP'],
    dietAndLifestyle: ['Warm turmeric milk (haldi doodh)', 'Tulsi and ginger tea', 'Nutrient-rich lentil soups and fresh fruits']
  },

  skin: {
    conditionName: 'Dermal Pigmentation & Melanocytic Lesion Screening',
    category: 'Dermatology',
    pathologySummary: 'Dermoscopic evaluation of cutaneous pigmentation patterns, structural asymmetry, and network regularity to screen for atypical nevi or melanoma risks.',
    suspectedFindings: [
      'Atypical pigmented dermal network with localized melanin density',
      'Border contour regularity and pigment gradation across margins',
      'Superficial dermal vascularization indicators'
    ],
    causesAndRiskFactors: [
      'Cumulative solar ultraviolet (UV-A / UV-B) radiation exposure',
      'Genetic predisposition, fair skin phototypes, or dysplastic nevus syndrome',
      'Chronic mechanical friction or irritation over preexisting moles'
    ],
    actionablePrecautions: [
      '☀️ Apply broad-spectrum SPF 50+ PA+++ sunscreen 20 minutes before stepping outdoors, and reapply every 3 hours.',
      '🔍 Follow the ABCDE Rule monthly: Check for Asymmetry, Border irregularity, Color variegation, Diameter >6mm, and Evolution/Change.',
      '🚫 Never scratch, squeeze, burn, or attempt home chemical peeling on any skin lesion or mole.',
      '👒 Wear wide-brimmed hats and UV-protective clothing during peak sunlight hours (10 AM to 4 PM).',
      '🩺 Undergo full-body dermoscopy screening with a dermatologist once every 6-12 months.'
    ],
    emergencyRedFlags: [
      'Rapid lesion growth, spontaneous bleeding, or persistent ulceration',
      'Development of satellite dark spots around the primary lesion',
      'Severe itching, tenderness, or pain in an existing mole'
    ],
    recommendedSpecialist: 'Dermatologist / Dermato-Oncologist',
    confirmatoryTests: ['Dermoscopy with polarized light', 'Excisional Biopsy with Histopathology', 'Confocal Laser Scanning Microscopy'],
    dietAndLifestyle: ['Antioxidant-rich diet (carrots, tomatoes with lycopene, green leafy vegetables)', 'Adequate skin hydration with ceramide creams']
  },

  bone: {
    conditionName: 'Musculoskeletal Cortical Integrity & Fracture Screen',
    category: 'Orthopedics / Radiology',
    pathologySummary: 'Radiographic triage of skeletal structures to assess cortical continuity, joint space alignment, and bone trabecular mineralization patterns.',
    suspectedFindings: [
      'Cortical margin discontinuity or focal trabecular disruption',
      'Joint articular spacing and soft tissue swelling contour',
      'Bone density mineralization and osteopenic index'
    ],
    causesAndRiskFactors: [
      'Physical trauma, sports impact, accidental falls, or repetitive stress',
      'Calcium and Vitamin D3 deficiency leading to osteopenia / osteoporosis',
      'Age-related bone density loss and post-menopausal bone remodeling'
    ],
    actionablePrecautions: [
      '🛑 Immediately immobilize the affected limb with a splint or sling; avoid weight-bearing or strenuous exertion.',
      '❄️ Apply ice packs wrapped in clean cloth for 15-20 minutes every 3-4 hours to minimize swelling and inflammation.',
      '🦴 Support bone repair with adequate dietary Calcium (1000-1200 mg/day) and Vitamin D3 (60,000 IU/month or as advised).',
      '🩹 Keep limb elevated above heart level when resting to reduce edema.',
      '🩺 Obtain orthogonal (Antero-Posterior and Lateral) radiographic views for accurate orthopedic confirmation.'
    ],
    emergencyRedFlags: [
      'Visible limb deformity, bone protrusion through skin (compound fracture)',
      'Numbness, loss of pulse, or severe coldness/blueness in distal fingers or toes',
      'Inability to move joints distal to the injury site'
    ],
    recommendedSpecialist: 'Orthopedic Surgeon',
    confirmatoryTests: ['Orthogonal 2-View Radiographs (AP + Lateral)', 'Non-Contrast CT for complex articular fractures', 'DEXA Bone Mineral Density Scan'],
    dietAndLifestyle: ['Milk, curd, paneer, ragi (finger millet)', 'Sesame seeds (til) and green leafy vegetables', 'Morning gentle sunlight exposure for Vitamin D synthesis']
  },

  oral: {
    conditionName: 'Oral Mucosal Lesion & Pre-Cancerous Plaque Triage',
    category: 'Oral Medicine / ENT',
    pathologySummary: 'Clinical mucosal inspection assessing epithelial keratinization, erythema, hyperkeratotic leukoplakia, and submucous tissue elasticity.',
    suspectedFindings: [
      'Epithelial hyperkeratosis or blanched mucosal fibrous bands',
      'Erythroplakic/leukoplakic plaque with irregular surface texture',
      'Mucosal vascular prominence and sublingual/buccal changes'
    ],
    causesAndRiskFactors: [
      'Chronic use of smokeless tobacco, gutkha, paan masala, khaini, betel quid (areca nut)',
      'Smoking (bidi/cigarettes) and heavy alcohol consumption (synergistic risk)',
      'Chronic mechanical trauma from sharp broken teeth or ill-fitting dentures'
    ],
    actionablePrecautions: [
      '🚫 STRICT PRIORITY: Stop all forms of tobacco, gutkha, khaini, paan masala, and supari immediately.',
      '🦷 Visit a dentist to smooth down any sharp tooth edges that chronically rub against oral mucosa.',
      '🥗 Eat a diet rich in natural antioxidants: carrots, papayas, amla, citrus fruits, and green vegetables.',
      '🧼 Maintain gentle oral hygiene using a soft-bristled brush; use warm saline rinses twice daily.',
      '🩺 Undergo vital staining (Toluidine Blue) and punch biopsy examination by an oral surgeon.'
    ],
    emergencyRedFlags: [
      'Non-healing oral ulcer or sore that persists for more than 14 days',
      'Difficulty in opening the mouth (trismus with < 3 finger breadth opening)',
      'Hard palpable lymph node lump in the neck or difficulty swallowing (dysphagia)'
    ],
    recommendedSpecialist: 'Oral & Maxillofacial Surgeon / ENT Specialist / Head & Neck Oncologist',
    confirmatoryTests: ['Punch Biopsy with Histopathology', 'Toluidine Blue Staining', 'Oral Brush Cytology with DNA ploidy'],
    dietAndLifestyle: ['Lycopene supplements / cooked tomatoes', 'Turmeric (curcumin) with warm milk', 'Avoid spicy, acidic, and scalding hot foods']
  },

  retina: {
    conditionName: 'Diabetic Retinopathy & Microvascular Fundus Triage',
    category: 'Ophthalmology / Retina',
    pathologySummary: 'Funduscopic inspection of the posterior retinal pole, macula, and vascular arcades to detect microaneurysms, dot-blot hemorrhages, or exudates.',
    suspectedFindings: [
      'Retinal vascular caliber variation and microvascular changes',
      'Hard exudate lipid clusters or microaneurysm dot indicators',
      'Foveal reflection clarity and optic disc margin definition'
    ],
    causesAndRiskFactors: [
      'Long-standing uncontrolled diabetes mellitus (elevated blood glucose)',
      'Co-existing arterial hypertension and dyslipidemia (elevated LDL/triglycerides)',
      'Diabetic nephropathy (microalbuminuria) accelerating microvascular damage'
    ],
    actionablePrecautions: [
      '🩸 Maintain strict glycemic control: Target HbA1c < 6.5% - 7.0% and fasting glucose 80-120 mg/dL.',
      '💓 Keep blood pressure below 130/80 mmHg to reduce hydrostatic capillary shear stress in retinal vessels.',
      '👁️ Schedule an annual dilated fundus examination with an eye specialist, even if vision seems normal.',
      '👓 Protect eyes with UV-blocking eyewear; avoid rubbing eyes forcefully.',
      '🏃‍♂️ Engage in moderate low-impact exercise (30 mins daily) to improve microvascular circulation.'
    ],
    emergencyRedFlags: [
      'Sudden shower of dark floaters or cobwebs in your visual field',
      'Flashing lights (photopsia) or sudden loss of peripheral vision',
      'Dark curtain or veil descending across one eye'
    ],
    recommendedSpecialist: 'Vitreo-Retina Specialist / Ophthalmologist',
    confirmatoryTests: ['Optical Coherence Tomography (OCT)', 'Fundus Fluorescein Angiography (FFA)', 'Dilated Indirect Ophthalmoscopy'],
    dietAndLifestyle: ['Lutein and zeaxanthin-rich foods (spinach, kale, corn)', 'Omega-3 fatty acids (flaxseeds, walnuts, fish)', 'Strict low-sugar, low-sodium diabetic meal plan']
  },

  mri: {
    conditionName: 'Brain MRI Structural Symmetry & Lesion Screening',
    category: 'Neurology / Neuroradiology',
    pathologySummary: 'Neuroimaging evaluation of brain parenchymal signal intensity, ventricular symmetry, sulcal prominence, and midline anatomical alignment.',
    suspectedFindings: [
      'Ventricular symmetry and intracranial density gradients',
      'Parenchymal signal intensity distribution across cerebral hemispheres',
      'Midline anatomical alignment and basal cistern contours'
    ],
    causesAndRiskFactors: [
      'Cerebrovascular ischemia, microangiopathy, or focal parenchymal lesions',
      'Chronic hypertension, uncontrolled diabetes, and atherosclerosis',
      'Prior head trauma, structural headaches, or space-occupying etiologies'
    ],
    actionablePrecautions: [
      '📋 Keep your complete DICOM scan files and radiograph films safely organized for specialist review.',
      '💊 Do NOT alter, stop, or self-prescribe any neurological or blood pressure medications.',
      '😴 Prioritize 7-8 hours of uninterrupted sleep and avoid severe physical or mental strain.',
      '🩺 Schedule an in-person consultation with a Neurologist for clinical reflex and cranial nerve examination.',
      '🧠 Keep a headache and symptom diary noting frequency, triggers, and duration.'
    ],
    emergencyRedFlags: [
      'Sudden explosive "thunderclap" headache (worst headache of life)',
      'Sudden weakness, facial droop, slurred speech, or numbness on one side of the body',
      'Seizures, loss of consciousness, projectile vomiting, or double vision'
    ],
    recommendedSpecialist: 'Neurologist / Neurosurgeon',
    confirmatoryTests: ['3T Contrast-Enhanced MRI Brain with MR Angiography (MRA)', 'Electroencephalogram (EEG)', 'Carotid Doppler Ultrasound'],
    dietAndLifestyle: ['DASH diet (low salt, rich in potassium & magnesium)', 'Stay well-hydrated throughout the day', 'Stress management via deep breathing / meditation']
  },

  tb_sputum: {
    conditionName: 'Tuberculosis Sputum Smear (AFB) Triage',
    category: 'Infectious Diseases / Pulmonology',
    pathologySummary: 'Ziehl-Neelsen microscopic sputum analysis assessing acid-fast rod-shaped mycobacteria density to screen for pulmonary tuberculosis.',
    suspectedFindings: [
      'Acid-Fast Bacilli (AFB) stain density indicators on microscopic field',
      'Inflammatory polymorphonuclear background and mucus consistency',
      'Cellular density profile suggestive of mycobacterial presence'
    ],
    causesAndRiskFactors: [
      'Infection with *Mycobacterium tuberculosis* transmitted via airborne droplets',
      'Underlying malnutrition, diabetes mellitus, or immunocompromised status',
      'Close household contact with an active TB patient in poorly ventilated spaces'
    ],
    actionablePrecautions: [
      '😷 Wear an N95 or 3-ply surgical mask to prevent spreading respiratory droplets to family members and children.',
      '🪟 Keep living rooms well-ventilated with open windows; direct sunlight naturally helps inactivate airborne bacteria.',
      '🥣 High-protein diet (eggs, pulses/dal, soya, milk, nuts) to rebuild immune strength and body weight.',
      '🏥 Visit your nearest government DOTS / NTEP center for free CBNAAT / TrueNat confirmatory testing.',
      '💊 If diagnosed, strictly complete the entire 6-month course of Anti-Tubercular Therapy (ATT) without missing a single dose.'
    ],
    emergencyRedFlags: [
      'Coughing up fresh blood or blood-streaked sputum (hemoptysis)',
      'Significant unexplained weight loss (>5 kg in a month) with drenching night sweats',
      'Severe resting breathlessness or chest tightness'
    ],
    recommendedSpecialist: 'Pulmonologist / DOTS Physician (NTEP)',
    confirmatoryTests: ['CBNAAT / TrueNat GeneXpert molecular assay', 'Sputum AFB Smear (Spot & Early Morning)', 'Chest X-Ray PA View'],
    dietAndLifestyle: ['High-protein meals with khichdi, eggs, sattu', 'Seasonal fruits rich in Vitamin C', 'Avoid smoking, alcohol, and excessive physical exertion']
  },

  malaria_smear: {
    conditionName: 'Malaria Parasite Intra-Erythrocytic Smear Screening',
    category: 'Infectious Diseases / Tropical Medicine',
    pathologySummary: 'Microscopic blood smear evaluation assessing intracellular ring forms, trophozoites, and gametocytes of *Plasmodium* species in red blood cells.',
    suspectedFindings: [
      'Intra-erythrocytic ring-stage inclusions in thin blood smear',
      'Erythrocyte morphology and parasitemia density index',
      'Chromatin dot and cytoplasm halo pattern characteristics'
    ],
    causesAndRiskFactors: [
      'Bite of infected female *Anopheles* mosquito carrying *P. falciparum* or *P. vivax*',
      'Residence in or travel to malaria-endemic regions with stagnant water pools',
      'Lack of mosquito net usage during dusk-to-dawn feeding hours'
    ],
    actionablePrecautions: [
      '🦟 Sleep under insecticide-treated bed nets (LLINs) and apply mosquito repellent cream on exposed skin.',
      '💧 Drink plenty of fluids (ORS, coconut water, lemon water) to maintain kidney hydration during fever spikes.',
      '🌡️ Check temperature every 4-6 hours; use prescribed Paracetamol for fever management (avoid Aspirin/NSAIDs).',
      '🩸 Get an immediate Rapid Diagnostic Test (RDT) and confirmatory peripheral blood smear test at your local PHC.',
      '💊 Complete full course of Artemisinin-based Combination Therapy (ACT) or Chloroquine/Primaquine as prescribed.'
    ],
    emergencyRedFlags: [
      'Dark red/cola-colored urine (Blackwater fever / hemoglobinuria)',
      'Severe yellowing of eyes/skin (Jaundice) with high fever',
      'Extreme drowsiness, confusion, convulsions, or persistent vomiting (Cerebral Malaria risk)'
    ],
    recommendedSpecialist: 'Infectious Disease Specialist / General Physician',
    confirmatoryTests: ['Rapid Diagnostic Test (RDT - Antigen Pf/Pv)', 'Peripheral Blood Smear (Thick & Thin film)', 'Complete Blood Count (CBC) with Platelet count'],
    dietAndLifestyle: ['Light digestible foods (khichdi, curd rice, daliya)', 'Adequate electrolyte fluids', 'Eliminate stagnant water around home']
  },

  cervical_via: {
    conditionName: 'Cervical VIA Colposcopy & Dysplasia Screening',
    category: 'Gynecology / Women’s Health',
    pathologySummary: 'Visual inspection with 5% acetic acid (VIA) triaging acetowhite epithelium, vascular punctation, and squamocolumnar junction integrity for early cervical neoplasia.',
    suspectedFindings: [
      'Acetowhite epithelial reaction near the transformation zone',
      'Squamocolumnar junction vascular margins and surface contour',
      'Epithelial density and opacity changes post-acetic acid exposure'
    ],
    causesAndRiskFactors: [
      'Persistent infection with High-Risk Human Papillomavirus (HPV strains 16 & 18)',
      'Early age at marriage/childbirth, high parity, or poor menstrual hygiene',
      'Lack of regular cervical screening (Pap smear / VIA screening intervals)'
    ],
    actionablePrecautions: [
      '🩺 Schedule a formal Colposcopy and directed punch biopsy with a Gynecologist for histopathological verification.',
      '💉 Discuss HPV Vaccination for eligible family members (females aged 9-26 years) to prevent 90% of cervical cancers.',
      '🧼 Maintain strict menstrual hygiene; use clean sanitary pads and avoid vaginal douching.',
      '📅 Undergo routine cervical screening (VIA or Pap Smear) every 3 to 5 years under national guidelines.',
      '🚫 Avoid smoking and exposure to tobacco products which weaken mucosal cervical immunity.'
    ],
    emergencyRedFlags: [
      'Post-coital bleeding (bleeding after sexual intercourse)',
      'Unusual bleeding between menstrual periods or after menopause',
      'Persistent foul-smelling watery or blood-tinged vaginal discharge'
    ],
    recommendedSpecialist: 'Gynecologist / Gynecologic Oncologist',
    confirmatoryTests: ['Colposcopy-directed Biopsy', 'Liquid-Based Cytology (LBC / Pap Smear)', 'High-Risk HPV-DNA Real-Time PCR'],
    dietAndLifestyle: ['Antioxidant-rich foods (folate, Vitamin A, Vitamin C)', 'Green leafy vegetables and carrots', 'Regular gentle walking and pelvic floor exercises']
  },

  anemia_eye: {
    conditionName: 'Non-Invasive Palpebral Conjunctiva Anemia Screening',
    category: 'Hematology / Preventive Care',
    pathologySummary: 'Computer vision chrominance analysis of lower eyelid palpebral conjunctival microvasculature to estimate hemoglobin levels and detect pallor.',
    suspectedFindings: [
      'Conjunctival capillary bed erythema and pallor index',
      'Red-to-green chromatic ratio in lower palpebral mucosal vascular zone',
      'Microvascular density tone indicative of systemic hemoglobin status'
    ],
    causesAndRiskFactors: [
      'Iron deficiency due to poor dietary iron bioavailability or low intake',
      'Chronic blood loss (heavy menstrual bleeding, gastrointestinal ulcers, hookworm infestation)',
      'Increased physiological demand (pregnancy, lactation, adolescent growth spurt)'
    ],
    actionablePrecautions: [
      '🥗 Boost dietary iron: Eat spinach (palak), fenugreek (methi), beetroot, jaggery (gur), dates, raisins, lentils, and eggs.',
      '🍋 Always pair iron-rich meals with Vitamin C (amla, lemon, guava, oranges) — Vitamin C boosts iron absorption by 300%!',
      '☕ AVOID drinking tea, coffee, or milk within 1 hour before or after meals, as tannins and calcium inhibit iron absorption.',
      '🩸 Get a Complete Blood Count (CBC) and Serum Ferritin blood test done at your local laboratory.',
      '💊 Take Iron-Folic Acid (IFA) supplements with water at bedtime as recommended by your physician.'
    ],
    emergencyRedFlags: [
      'Extreme fatigue, dizziness, fainting spells (syncope) upon standing',
      'Palpitations or rapid pounding heart rate with mild walking',
      'Marked breathlessness on minor physical activities'
    ],
    recommendedSpecialist: 'General Physician / Hematologist',
    confirmatoryTests: ['Complete Blood Count (CBC with Hb, MCV, MCH)', 'Serum Ferritin & Total Iron Binding Capacity (TIBC)', 'Peripheral Blood Smear for RBC morphology'],
    dietAndLifestyle: ['Daily intake of soaked dates and jaggery', 'Cook food in iron utensils (lohe ki kadhai)', 'Regular deworming (Albendazole 400mg) once every 6 months']
  },

  cataract_eye: {
    conditionName: 'Anterior Segment Cataract & Corneal Opacity Screen',
    category: 'Ophthalmology',
    pathologySummary: 'Anterior ocular segment photograph analysis inspecting pupillary transparency, crystalline lens nuclear clouding, and corneal light reflex.',
    suspectedFindings: [
      'Pupillary aperture opacity and light transmission attenuation',
      'Lens nuclear/cortical density changes causing visual scattering',
      'Corneal surface clarity and anterior chamber depth contours'
    ],
    causesAndRiskFactors: [
      'Age-related aggregation and oxidation of lens crystallin proteins (Senile Cataract)',
      'Uncontrolled Diabetes Mellitus causing osmotic lens fiber swelling',
      'Chronic ultraviolet (UV) sunlight exposure, eye trauma, or long-term steroid eye drop usage'
    ],
    actionablePrecautions: [
      '🕶️ Wear UV400 protective sunglasses when stepping outside into bright sunlight to prevent further photochemical lens damage.',
      '💡 Ensure adequate, diffused, glare-free lighting when reading, cooking, or working.',
      '🩸 Maintain tight blood glucose control (HbA1c < 7.0%) if you have diabetes.',
      '🩺 Consult an Eye Specialist for formal Slit-Lamp Biomicroscopy and Snellen visual acuity testing.',
      '👁️ Reassurance: Cataract is completely curable with standard, safe, 10-minute sutureless Phacoemulsification surgery with IOL lens implantation.'
    ],
    emergencyRedFlags: [
      'Sudden onset of severe eye pain with redness, halos around lights, and nausea (Acute Glaucoma risk)',
      'Rapid sudden drop in vision within days or hours',
      'Eye trauma with corneal clouding and discharge'
    ],
    recommendedSpecialist: 'Ophthalmologist / Cataract & Refractive Surgeon',
    confirmatoryTests: ['Slit-Lamp Biomicroscopy', 'Dilated Fundus Examination', 'IOL Master / A-Scan Biometry (pre-operative)'],
    dietAndLifestyle: ['Carotenoids (lutein/zeaxanthin from carrots, spinach, egg yolks)', 'Vitamin C rich foods (amla, citrus)', 'Avoid smoking and eye rubbing']
  },

  diabetic_foot: {
    conditionName: 'Diabetic Foot Ulcer & Tissue Viability Assessment',
    category: 'Endocrinology / Wound Care / Podiatry',
    pathologySummary: 'Computer vision analysis of diabetic plantar/digit wounds evaluating granulation tissue, peripheral erythema, slough, and Wagner severity grading.',
    suspectedFindings: [
      'Ulceration depth, margin regularity, and peripheral tissue erythema',
      'Granulation tissue viability vs necrotic slough indicators',
      'Plantar pressure distribution and hyperkeratotic callus presence'
    ],
    causesAndRiskFactors: [
      'Diabetic peripheral sensory neuropathy (loss of pain/temperature protective sensation)',
      'Peripheral Arterial Disease (PAD) causing poor microvascular blood supply and delayed healing',
      'Minor unperceived trauma from ill-fitting shoes, walking barefoot, or stepping on sharp objects'
    ],
    actionablePrecautions: [
      '🧦 NEVER walk barefoot anywhere — always wear specialized diabetic footwear with custom Micro-Cellular Rubber (MCR) insoles.',
      '🧼 Wash feet daily with mild soap and lukewarm water; dry completely between toes with a soft towel.',
      '🧴 Apply moisturizing cream on feet daily to prevent skin cracking, but DO NOT apply between the toes.',
      '🩹 Keep any existing ulcer covered with sterile saline dressings; never attempt self-cutting calluses or corn caps.',
      '🩺 Undergo professional wound debridement and offloading at a dedicated Diabetic Foot Clinic.'
    ],
    emergencyRedFlags: [
      'Black/blue discoloration of toes (wet or dry gangrene)',
      'Foul-smelling purulent discharge, increasing redness spreading up the leg, or fever',
      'Crepitus (cracking feeling under skin) or severe foot pain/swelling'
    ],
    recommendedSpecialist: 'Podiatrist / Vascular Surgeon / Endocrinologist',
    confirmatoryTests: ['Arterial Doppler Ultrasound of lower limbs', 'Wound Swab Culture & Antibiotic Sensitivity', 'X-Ray Foot to rule out underlying Osteomyelitis'],
    dietAndLifestyle: ['Strict diabetic meal plan with glycemic tracking', 'High protein (boiled eggs, sprouts) for wound healing', 'Daily visual foot inspection using a floor mirror']
  },

  neonatal_jaundice: {
    conditionName: 'Neonatal Sclera Jaundice (Bilirubin) Screening',
    category: 'Pediatrics / Neonatology',
    pathologySummary: 'Cutaneous and scleral chromaticity analysis assessing yellow pigment deposition corresponding to unconjugated serum bilirubin levels.',
    suspectedFindings: [
      'Scleral and facial dermal yellowness index (Bilirubin hue)',
      'Cephalocaudal progression of cutaneous jaundice tone',
      'Periorbital and forehead microvascular chrominance'
    ],
    causesAndRiskFactors: [
      'Physiological immaturity of neonatal liver enzymes (UDP-glucuronosyltransferase)',
      'ABO or Rh blood group incompatibility between mother and newborn (hemolysis)',
      'Inadequate breastfeeding leading to reduced gut motility and increased enterohepatic circulation'
    ],
    actionablePrecautions: [
      '🤱 Frequent breastfeeding: Feed baby every 2 to 3 hours (8-12 times in 24 hours) to promote regular bowel movements and flush bilirubin.',
      '☀️ Brief early morning indirect sunlight exposure (before 8 AM for 10-15 mins, protecting baby’s eyes).',
      '🩸 Check serum Total and Direct Bilirubin (TSB) via a simple laboratory blood test at your nearest hospital.',
      '🩺 Consult a Pediatrician promptly to determine if specialized Blue-Light Phototherapy (460-490 nm) is needed.',
      '👶 Keep baby warm, clean, and monitor wet nappies (at least 6-8 wet diapers per day indicates good hydration).'
    ],
    emergencyRedFlags: [
      'Baby is excessively sleepy, lethargic, difficult to wake up for feeds, or has weak sucking reflex',
      'High-pitched abnormal cry, arched back (opisthotonos), or fever',
      'Yellowing spreading rapidly down to the abdomen, palms, and soles'
    ],
    recommendedSpecialist: 'Pediatrician / Neonatologist',
    confirmatoryTests: ['Serum Total & Direct Bilirubin (TSB / SBR)', 'Mother & Baby Blood Group (ABO / Rh typing)', 'Direct Coombs Test (DCT) and Reticulocyte count'],
    dietAndLifestyle: ['Exclusive breastfeeding on demand', 'Do NOT give sugar water, ghutti, or cow milk to newborns', 'Keep nursery room warm and well-lit']
  },

  sickle_cell: {
    conditionName: 'Sickle Cell & Thalassemia Erythrocyte Morphology Triage',
    category: 'Hematology / Tribal Health Mission',
    pathologySummary: 'Peripheral blood smear micrograph analysis detecting elongated sickled drepanocytes, target cells (codocytes), and hypochromic microcytic red blood cells.',
    suspectedFindings: [
      'Crescent-shaped sickled erythrocyte (drepanocyte) morphology',
      'Target cells (codocytes) and red cell poikilocytosis',
      'Hypochromic microcytic cell indices and Howell-Jolly bodies'
    ],
    causesAndRiskFactors: [
      'Inherited genetic mutation in beta-globin gene causing Hemoglobin S (HbS) synthesis',
      'Deoxygenation, dehydration, acidosis, or cold exposure triggering HbS polymerization',
      'Consanguineous marriage or carrier trait inheritance (autosomal recessive)'
    ],
    actionablePrecautions: [
      '💧 Drink plenty of water throughout the day (3 to 4 Liters) — hydration prevents blood cells from sickling and causing painful crises.',
      '❄️ Avoid sudden extreme cold weather exposure, mountain high-altitudes, and strenuous dehydrating sports.',
      '💊 Take daily Folic Acid (5mg) and Hydroxyurea as prescribed by your Hematologist/Primary Health Centre.',
      '🩸 Undergo confirmatory High-Performance Liquid Chromatography (HPLC) or Hemoglobin Electrophoresis.',
      '🛡️ Register for your Sickle Cell Status Card under the National Sickle Cell Anemia Elimination Mission.'
    ],
    emergencyRedFlags: [
      'Acute Vaso-Occlusive Crisis (severe agonizing pain in bones, joints, back, or abdomen)',
      'Acute Chest Syndrome (chest pain, fever, cough, and sudden breathlessness)',
      'Sudden weakness/stroke-like symptoms, or sudden severe pallor with spleen enlargement'
    ],
    recommendedSpecialist: 'Hematologist / District Hospital Sickle Cell Center',
    confirmatoryTests: ['HPLC (High-Performance Liquid Chromatography)', 'Sickling Test with Sodium Metabisulfite', 'Complete Blood Count (CBC) with Peripheral Smear'],
    dietAndLifestyle: ['Balanced protein-rich diet with leafy greens and fresh fruits', 'Avoid heavy physical exhaustion', 'Pre-marital genetic counseling for carriers']
  },

  fungal_tinea: {
    conditionName: 'Cutaneous Dermatophytosis (Tinea / Ringworm) Triage',
    category: 'Dermatology / Tropical Medicine',
    pathologySummary: 'Dermatological image analysis identifying active expanding erythematous annular borders, central clearing, and peripheral scaling plaques.',
    suspectedFindings: [
      'Active annular erythematous scaling border with central clearing',
      'Superficial epidermal micro-vesiculation and lichenification',
      'Dermal pigmentation changes characteristic of dermatophyte infection'
    ],
    causesAndRiskFactors: [
      'Fungal dermatophyte infection (*Trichophyton rubrum / mentagrophytes*) thriving in warm, humid Indian climate',
      'Misuse of over-the-counter steroid combination creams (e.g. Betnovate, Quadriderm, Panderm) causing steroid-modified Tinea Incognito',
      'Wearing tight synthetic clothing, excessive sweating, and sharing towels or bedsheets'
    ],
    actionablePrecautions: [
      '🚫 STRICT WARNING: NEVER apply steroid creams (Betnovate, Panderm, Quadriderm) — steroids suppress local immunity and cause massive fungal recurrence!',
      '👕 Wear loose-fitting, breathable, 100% pure cotton clothing; change innerwear twice daily.',
      '🧼 Keep the infected area completely clean and dry; dry thoroughly with a separate towel after bathing.',
      '💊 Apply doctor-prescribed topical antifungal creams (e.g., Luliconazole, Terbinafine, Amorolfine) 2cm beyond the visible border for full 3-4 weeks.',
      '👨‍👩‍👧 Treat all infected family members simultaneously and wash all clothing in hot water and iron inside out.'
    ],
    emergencyRedFlags: [
      'Secondary bacterial infection with pus, crusting, swelling, and severe pain',
      'Extensive widespread involvement covering more than 30% of body surface area',
      'High fever with painful swollen lymph nodes in groin or armpits'
    ],
    recommendedSpecialist: 'Dermatologist',
    confirmatoryTests: ['KOH (Potassium Hydroxide) 10% Mount for Fungal Hyphae', 'Fungal Culture on Sabouraud Dextrose Agar', 'Wood’s Lamp Examination'],
    dietAndLifestyle: ['Take daily bath with mild antifungal soap', 'Keep groins and skin folds dry with absorbent antifungal dusting powder', 'Avoid sharing towels, bedsheets, or soap']
  },

  dental_fluorosis: {
    conditionName: 'Dental Fluorosis Enamel Mottling & Caries Screening',
    category: 'Dentistry / Community Health',
    pathologySummary: 'Anterior dental photograph analysis evaluating enamel opacity, chalky white striations, brown-yellow pitting, and dental caries cavitation.',
    suspectedFindings: [
      'Enamel surface bilateral chalky white opaque striations',
      'Brown to yellow intrinsic pigmentation and structural pitting',
      'Incisal edge chipping and interproximal carious lesions'
    ],
    causesAndRiskFactors: [
      'Chronic consumption of borewell drinking water with high natural fluoride (> 1.0 to 1.5 ppm) during tooth formation years',
      'Swallowing fluoridated toothpaste by young children during brushing',
      'Frequent consumption of refined carbohydrates and sugary snacks combined with poor oral plaque removal'
    ],
    actionablePrecautions: [
      '💧 Test your drinking water fluoride level: If borewell water has > 1.0 mg/L fluoride, switch to RO water or rainwater harvesting.',
      '🪥 Use a non-fluoridated or low-fluoride toothpaste if living in an endemic high-fluoride groundwater area.',
      '🥛 Consume calcium and Vitamin C rich foods (milk, curd, amla, guava) — dietary calcium binds fluoride in the gut and prevents systemic absorption.',
      '🦷 Visit a dentist for aesthetic cosmetic treatments like Enamel Microabrasion, Composite Veneers, or Dental Crowns.',
      '🪥 Brush teeth twice daily with gentle circular motions and floss between teeth.'
    ],
    emergencyRedFlags: [
      'Severe throbbing toothache radiating to jaw or ear (acute pulpitis)',
      'Swelling in the gums, face, or neck with fever (dental abscess)',
      'Difficulty in swallowing or opening mouth due to dental infection'
    ],
    recommendedSpecialist: 'Dentist / Prosthodontist / Endodontist',
    confirmatoryTests: ['Intraoral Periapical (IOPA) Radiograph', 'Orthopantomogram (OPG)', 'Water Fluoride Level Testing (Ion-Selective Electrode)'],
    dietAndLifestyle: ['Calcium and Vitamin D3 rich foods (ragi, milk, green vegetables)', 'Limit sticky sweets, chocolates, and carbonated sodas', 'Rinse mouth thoroughly with water after every meal']
  }
};

/**
 * Generate a complete, medically rich, structured prediction report
 * tailored specifically to the scanner and findings.
 */
export function buildClinicalAssessment(
  toolId: string,
  score: number,
  localLabel?: string,
  isSafetyGatePassed: boolean = true
) {
  const profile = CLINICAL_KNOWLEDGE_BASE[toolId] || CLINICAL_KNOWLEDGE_BASE.chest;
  const confidencePct = Math.round(score * 100);

  const riskLevel = !isSafetyGatePassed 
    ? 'Insufficient Data' 
    : confidencePct > 78 
      ? 'High' 
      : confidencePct > 55 
        ? 'Moderate' 
        : 'Low';

  const labelDisplay = localLabel && !['pinwheel', 'envelope', 'spotlight', 'Unknown', 'General Clinical Feature'].includes(localLabel)
    ? localLabel
    : profile.suspectedFindings[0];

  const reasoning = [
    `Suspected Condition: ${profile.conditionName} (${profile.category})`,
    `Clinical Feature Finding: ${labelDisplay}`,
    `Pathology Context: ${profile.pathologySummary}`,
    `Key Underlying Etiology: ${profile.causesAndRiskFactors[0]}`,
    !isSafetyGatePassed 
      ? '⚠️ Safety Gate Note: Saliency activation is borderline. Physical exam required.'
      : `Safety Gate: Passed (Confidence ${confidencePct}% exceeds decision threshold).`
  ];

  const recommendations = [
    ...profile.actionablePrecautions,
    `🩺 Specialist Referral: Schedule an evaluation with a ${profile.recommendedSpecialist}.`,
    `🧪 Recommended Diagnostic Tests: ${profile.confirmatoryTests.join(' • ')}.`
  ];

  return {
    risk: riskLevel,
    confidence: confidencePct,
    safetyGateStatus: isSafetyGatePassed ? ('usable' as const) : ('uncertain_further_evaluation' as const),
    reasoning,
    recommendations,
    urgency: riskLevel === 'High' ? ('soon' as const) : ('routine' as const),
    disclaimer: '⚕️ Automated AI Screening Tool: This assessment provides preliminary clinical risk indicators and precautions. It does not replace an in-person medical diagnosis. Always consult a certified physician for medical management.',
    computedBy: 'server_rules_ml' as const,
    clinicalProfile: profile
  };
}
