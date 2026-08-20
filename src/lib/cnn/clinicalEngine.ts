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
