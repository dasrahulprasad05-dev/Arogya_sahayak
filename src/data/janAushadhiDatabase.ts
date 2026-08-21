export interface MedicineItem {
  id: string;
  brandName: string;
  genericSalt: string;
  category: string;
  brandedPrice: number; // in INR
  genericPrice: number; // in INR
  dosage: string;
  packSize: string;
  usage: string;
}

export const JAN_AUSHADHI_DATABASE: MedicineItem[] = [
  // ==========================================
  // 1. ANTIBIOTICS, ANTIBACTERIALS & ANTIVIRALS
  // ==========================================
  {
    id: 'ab-1',
    brandName: 'Augmentin 625 Duo / Moxikind-CV 625 / Clavam 625',
    genericSalt: 'Amoxicillin (500mg) + Clavulanic Acid (125mg)',
    category: 'Antibiotic',
    brandedPrice: 220,
    genericPrice: 45,
    dosage: '625mg',
    packSize: '10 Tablets',
    usage: 'Bacterial infections of throat, chest, lungs, sinus, dental, skin & UTI.'
  },
  {
    id: 'ab-2',
    brandName: 'Augmentin 1000 / Clavam 1g',
    genericSalt: 'Amoxicillin (875mg) + Clavulanic Acid (125mg)',
    category: 'Antibiotic',
    brandedPrice: 295,
    genericPrice: 62,
    dosage: '1000mg',
    packSize: '10 Tablets',
    usage: 'Severe bacterial infections, complicated pneumonia, and bone infections.'
  },
  {
    id: 'ab-3',
    brandName: 'Azithral 500 / Azee 500 / Zithrox 500 / Aziwok 500',
    genericSalt: 'Azithromycin (500mg)',
    category: 'Antibiotic',
    brandedPrice: 135,
    genericPrice: 34,
    dosage: '500mg',
    packSize: '5 Tablets',
    usage: 'Chest infections, typhoid, sinusitis, tonsillitis, ear & skin infections.'
  },
  {
    id: 'ab-4',
    brandName: 'Azithral 250 / Azee 250',
    genericSalt: 'Azithromycin (250mg)',
    category: 'Antibiotic',
    brandedPrice: 85,
    genericPrice: 20,
    dosage: '250mg',
    packSize: '6 Tablets',
    usage: 'Pediatric and mild upper respiratory tract and throat infections.'
  },
  {
    id: 'ab-5',
    brandName: 'Taxim-O 200 / Cefolac 200 / Mahacef 200 / Zifi 200',
    genericSalt: 'Cefixime (200mg)',
    category: 'Antibiotic',
    brandedPrice: 165,
    genericPrice: 38,
    dosage: '200mg',
    packSize: '10 Tablets',
    usage: 'Typhoid fever, urinary tract infections (UTI), gonorrhea & bronchitis.'
  },
  {
    id: 'ab-6',
    brandName: 'Taxim-O CV / Zifi-CV / Cefolac-CV',
    genericSalt: 'Cefixime (200mg) + Clavulanic Acid (125mg)',
    category: 'Antibiotic',
    brandedPrice: 280,
    genericPrice: 58,
    dosage: '325mg',
    packSize: '10 Tablets',
    usage: 'Resistant bacterial infections, recurring UTI, and post-surgery prophylaxis.'
  },
  {
    id: 'ab-7',
    brandName: 'Ceftum 500 / Cetil 500 / Forcef 500',
    genericSalt: 'Cefuroxime Axetil (500mg)',
    category: 'Antibiotic',
    brandedPrice: 550,
    genericPrice: 95,
    dosage: '500mg',
    packSize: '10 Tablets',
    usage: 'Second-generation cephalosporin for severe respiratory, skin & kidney infections.'
  },
  {
    id: 'ab-8',
    brandName: 'Ceftum 250 / Cetil 250',
    genericSalt: 'Cefuroxime Axetil (250mg)',
    category: 'Antibiotic',
    brandedPrice: 320,
    genericPrice: 55,
    dosage: '250mg',
    packSize: '10 Tablets',
    usage: 'Tonsillitis, Lyme disease, acute otitis media, and skin infections.'
  },
  {
    id: 'ab-9',
    brandName: 'Ciplox 500 / Cifran 500',
    genericSalt: 'Ciprofloxacin (500mg)',
    category: 'Antibiotic',
    brandedPrice: 55,
    genericPrice: 14,
    dosage: '500mg',
    packSize: '10 Tablets',
    usage: 'Gastrointestinal diarrhea, typhoid, prostatitis, and pelvic infections.'
  },
  {
    id: 'ab-10',
    brandName: 'Ciplox 250 / Cifran 250',
    genericSalt: 'Ciprofloxacin (250mg)',
    category: 'Antibiotic',
    brandedPrice: 35,
    genericPrice: 9,
    dosage: '250mg',
    packSize: '10 Tablets',
    usage: 'Mild bacterial diarrhea and localized urinary tract infections.'
  },
  {
    id: 'ab-11',
    brandName: 'O2 / Zenflox-OZ / Oflomac-OZ / Oflox-OZ',
    genericSalt: 'Ofloxacin (200mg) + Ornidazole (500mg)',
    category: 'Antibiotic',
    brandedPrice: 145,
    genericPrice: 28,
    dosage: '200mg/500mg',
    packSize: '10 Tablets',
    usage: 'Amoebic dysentery, gastrointestinal infections, acute loose motions & dental abscess.'
  },
  {
    id: 'ab-12',
    brandName: 'Zenflox 200 / Oflomac 200',
    genericSalt: 'Ofloxacin (200mg)',
    category: 'Antibiotic',
    brandedPrice: 85,
    genericPrice: 18,
    dosage: '200mg',
    packSize: '10 Tablets',
    usage: 'Uncomplicated UTI, pneumonia, enteric fever, and skin soft tissue infections.'
  },
  {
    id: 'ab-13',
    brandName: 'Levomac 500 / Loxof 500 / Glevo 500',
    genericSalt: 'Levofloxacin (500mg)',
    category: 'Antibiotic',
    brandedPrice: 110,
    genericPrice: 24,
    dosage: '500mg',
    packSize: '10 Tablets',
    usage: 'Community-acquired pneumonia, acute pyelonephritis, and severe sinusitis.'
  },
  {
    id: 'ab-14',
    brandName: 'Levomac 750 / Loxof 750',
    genericSalt: 'Levofloxacin (750mg)',
    category: 'Antibiotic',
    brandedPrice: 160,
    genericPrice: 32,
    dosage: '750mg',
    packSize: '5 Tablets',
    usage: 'Nosocomial pneumonia and complicated urinary and kidney infections.'
  },
  {
    id: 'ab-15',
    brandName: 'Doxicip 100 / Doxy-1 / Microdox-LBX',
    genericSalt: 'Doxycycline (100mg) + Lactic Acid Bacillus',
    category: 'Antibiotic',
    brandedPrice: 120,
    genericPrice: 22,
    dosage: '100mg',
    packSize: '10 Capsules',
    usage: 'Acne vulgaris, cholera, malaria prophylaxis, scrub typhus, and chlamydia.'
  },
  {
    id: 'ab-16',
    brandName: 'Metrogyl 400 / Flagyl 400',
    genericSalt: 'Metronidazole (400mg)',
    category: 'Antibiotic',
    brandedPrice: 28,
    genericPrice: 7,
    dosage: '400mg',
    packSize: '15 Tablets',
    usage: 'Amoebiasis, Giardiasis, bacterial vaginosis, dental infection & anaerobic sepsis.'
  },
  {
    id: 'ab-17',
    brandName: 'Metrogyl 200 / Flagyl 200',
    genericSalt: 'Metronidazole (200mg)',
    category: 'Antibiotic',
    brandedPrice: 18,
    genericPrice: 5,
    dosage: '200mg',
    packSize: '15 Tablets',
    usage: 'Mild amoebic colitis, dental gum swelling, and pediatric gut parasites.'
  },
  {
    id: 'ab-18',
    brandName: 'Norflox-TZ / Norbactin-TZ',
    genericSalt: 'Norfloxacin (400mg) + Tinidazole (600mg)',
    category: 'Antibiotic',
    brandedPrice: 115,
    genericPrice: 22,
    dosage: '400mg/600mg',
    packSize: '10 Tablets',
    usage: 'Severe bacterial and parasitic food poisoning, gastroenteritis, and amoebic dysentery.'
  },
  {
    id: 'ab-19',
    brandName: 'Dalacin-C 300 / Clindac-A 300',
    genericSalt: 'Clindamycin (300mg)',
    category: 'Antibiotic',
    brandedPrice: 310,
    genericPrice: 65,
    dosage: '300mg',
    packSize: '10 Capsules',
    usage: 'Severe dental bone abscess, MRSA skin infections, and pelvic inflammatory disease.'
  },
  {
    id: 'ab-20',
    brandName: 'Rifagut 400 / Rcifax 400 / Rifaxigress 400',
    genericSalt: 'Rifaximin (400mg)',
    category: 'Antibiotic',
    brandedPrice: 420,
    genericPrice: 75,
    dosage: '400mg',
    packSize: '10 Tablets',
    usage: 'Hepatic encephalopathy, Travelers Diarrhea, and Irritable Bowel Syndrome (IBS-D).'
  },
  {
    id: 'ab-21',
    brandName: 'Rifagut 550 / Rcifax 550',
    genericSalt: 'Rifaximin (550mg)',
    category: 'Antibiotic',
    brandedPrice: 540,
    genericPrice: 95,
    dosage: '550mg',
    packSize: '10 Tablets',
    usage: 'Chronic liver cirrhosis maintenance, small intestinal bacterial overgrowth (SIBO).'
  },
  {
    id: 'ab-22',
    brandName: 'Farobact 200 / Duonem 200',
    genericSalt: 'Faropenem Sodium (200mg)',
    category: 'Antibiotic',
    brandedPrice: 680,
    genericPrice: 120,
    dosage: '200mg',
    packSize: '6 Tablets',
    usage: 'Penem antibiotic for multi-drug resistant respiratory, gynecological & kidney infections.'
  },
  {
    id: 'ab-23',
    brandName: 'Linid 600 / Lizomac 600 / Lizoforce 600',
    genericSalt: 'Linezolid (600mg)',
    category: 'Antibiotic',
    brandedPrice: 390,
    genericPrice: 68,
    dosage: '600mg',
    packSize: '10 Tablets',
    usage: 'Resistant MRSA, VRE hospital-acquired pneumonia, and complicated diabetic foot ulcers.'
  },
  {
    id: 'ab-24',
    brandName: 'Martifur-MR 100 / Niftas 100 / Urifast 100',
    genericSalt: 'Nitrofurantoin (100mg Modified Release)',
    category: 'Antibiotic',
    brandedPrice: 185,
    genericPrice: 36,
    dosage: '100mg',
    packSize: '10 Tablets',
    usage: 'Acute uncomplicated urinary tract infections (UTI) and cystitis in women.'
  },
  {
    id: 'ab-25',
    brandName: 'Claribid 500 / Crixan 500',
    genericSalt: 'Clarithromycin (500mg)',
    category: 'Antibiotic',
    brandedPrice: 380,
    genericPrice: 64,
    dosage: '500mg',
    packSize: '10 Tablets',
    usage: 'H. Pylori stomach eradication, atypical pneumonia, and chronic bronchitis.'
  },
  {
    id: 'ab-26',
    brandName: 'Forcan 150 / Zocon 150 / Syscan 150',
    genericSalt: 'Fluconazole (150mg)',
    category: 'Antibiotic',
    brandedPrice: 42,
    genericPrice: 9,
    dosage: '150mg',
    packSize: '1 Tablet',
    usage: 'Vaginal candidiasis (yeast infection), fungal skin ringworm, and oral thrush.'
  },
  {
    id: 'ab-27',
    brandName: 'Canditral 100 / Itaspor 100 / Candiforce 100',
    genericSalt: 'Itraconazole (100mg)',
    category: 'Antibiotic',
    brandedPrice: 170,
    genericPrice: 35,
    dosage: '100mg',
    packSize: '10 Capsules',
    usage: 'Stubborn fungal nail infections, onychomycosis, systemic aspergillosis & tinea cruris.'
  },
  {
    id: 'ab-28',
    brandName: 'Canditral 200 / Itaspor 200 / Candiforce 200',
    genericSalt: 'Itraconazole (200mg)',
    category: 'Antibiotic',
    brandedPrice: 290,
    genericPrice: 58,
    dosage: '200mg',
    packSize: '10 Capsules',
    usage: 'Recurrent severe ringworm fungal infections, blastomycosis, and fungal keratitis.'
  },
  {
    id: 'ab-29',
    brandName: 'Tyza 250 / Sebifin 250 / Terbicip 250',
    genericSalt: 'Terbinafine (250mg)',
    category: 'Antibiotic',
    brandedPrice: 210,
    genericPrice: 42,
    dosage: '250mg',
    packSize: '7 Tablets',
    usage: 'Athletes foot, jock itch, tinea corporis, and fungal nail bed infections.'
  },
  {
    id: 'ab-30',
    brandName: 'Zovirax 400 / Herperax 400',
    genericSalt: 'Acyclovir (400mg)',
    category: 'Antibiotic',
    brandedPrice: 165,
    genericPrice: 32,
    dosage: '400mg',
    packSize: '10 Tablets',
    usage: 'Herpes zoster (shingles), genital herpes, cold sores, and chickenpox management.'
  },
  {
    id: 'ab-31',
    brandName: 'Ivercross 12 / Ivecop 12',
    genericSalt: 'Ivermectin (12mg)',
    category: 'Antibiotic',
    brandedPrice: 65,
    genericPrice: 14,
    dosage: '12mg',
    packSize: '2 Tablets',
    usage: 'Parasitic roundworm, scabies infestation, filariasis, and strongyloidiasis.'
  },
  {
    id: 'ab-32',
    brandName: 'Zentel / Bandy-Plus',
    genericSalt: 'Albendazole (400mg) + Ivermectin (6mg)',
    category: 'Antibiotic',
    brandedPrice: 45,
    genericPrice: 11,
    dosage: 'Combo',
    packSize: '1 Chewable Tab',
    usage: 'Single-dose intestinal deworming for pinworms, tapeworms, and hookworms.'
  },

  // ==========================================
  // 2. GASTROENTEROLOGY, ACIDITY, GERD & DIGESTION
  // ==========================================
  {
    id: 'ga-1',
    brandName: 'Pan-D / Pantocid DSR / Pantodac DSR',
    genericSalt: 'Pantoprazole (40mg) + Domperidone (30mg SR)',
    category: 'Gastro / Acidity',
    brandedPrice: 195,
    genericPrice: 32,
    dosage: '40mg/30mg',
    packSize: '10 Capsules',
    usage: 'Severe GERD, chronic acid reflux, morning bile vomiting, and gastric burning.'
  },
  {
    id: 'ga-2',
    brandName: 'Pan 40 / Pantocid 40 / Pantodac 40',
    genericSalt: 'Pantoprazole (40mg)',
    category: 'Gastro / Acidity',
    brandedPrice: 135,
    genericPrice: 22,
    dosage: '40mg',
    packSize: '15 Tablets',
    usage: 'Gastric acid suppression, peptic ulcer healing, and NSAID-induced gastritis.'
  },
  {
    id: 'ga-3',
    brandName: 'Cyra-D / Cyra DSR / Razo-D / Happi-D',
    genericSalt: 'Rabeprazole (20mg) + Domperidone (30mg SR)',
    category: 'Gastro / Acidity',
    brandedPrice: 155,
    genericPrice: 26,
    dosage: '20mg/30mg',
    packSize: '10 Capsules',
    usage: 'Fast-acting acid reflux relief, burning sensation in chest, and indigestion nausea.'
  },
  {
    id: 'ga-4',
    brandName: 'Cyra 20 / Razo 20 / Happi 20 / Pariet',
    genericSalt: 'Rabeprazole (20mg)',
    category: 'Gastro / Acidity',
    brandedPrice: 115,
    genericPrice: 18,
    dosage: '20mg',
    packSize: '10 Tablets',
    usage: 'Rapid gastric acid inhibitor for duodenal ulcers and Zollinger-Ellison syndrome.'
  },
  {
    id: 'ga-5',
    brandName: 'Cyra-LS / Razo-L / Happi-L',
    genericSalt: 'Rabeprazole (20mg) + Levosulpiride (75mg SR)',
    category: 'Gastro / Acidity',
    brandedPrice: 245,
    genericPrice: 46,
    dosage: '20mg/75mg',
    packSize: '10 Capsules',
    usage: 'Severe diabetic gastroparesis, chronic functional dyspepsia, and IBS bloating.'
  },
  {
    id: 'ga-6',
    brandName: 'Pan-L / Pantocid-L',
    genericSalt: 'Pantoprazole (40mg) + Levosulpiride (75mg SR)',
    category: 'Gastro / Acidity',
    brandedPrice: 265,
    genericPrice: 48,
    dosage: '40mg/75mg',
    packSize: '10 Capsules',
    usage: 'Non-ulcer dyspepsia, refractory GERD, and gastrointestinal motility impairment.'
  },
  {
    id: 'ga-7',
    brandName: 'Omez 20 / Omee 20 / Procept 20',
    genericSalt: 'Omeprazole (20mg)',
    category: 'Gastro / Acidity',
    brandedPrice: 65,
    genericPrice: 12,
    dosage: '20mg',
    packSize: '20 Capsules',
    usage: 'Daily heartburn relief, acid hypersecretion, and gastric mucosal protection.'
  },
  {
    id: 'ga-8',
    brandName: 'Omez-D / Omee-D',
    genericSalt: 'Omeprazole (20mg) + Domperidone (10mg)',
    category: 'Gastro / Acidity',
    brandedPrice: 95,
    genericPrice: 18,
    dosage: '20mg/10mg',
    packSize: '15 Capsules',
    usage: 'Gastritis accompanied by fullness, nausea, and sour burping.'
  },
  {
    id: 'ga-9',
    brandName: 'Nexpro 40 / Sompraz 40 / Esomac 40',
    genericSalt: 'Esomeprazole (40mg)',
    category: 'Gastro / Acidity',
    brandedPrice: 165,
    genericPrice: 28,
    dosage: '40mg',
    packSize: '15 Tablets',
    usage: 'S-isomer proton pump inhibitor for severe erosive esophagitis and ulcer maintenance.'
  },
  {
    id: 'ga-10',
    brandName: 'Nexpro-RD 40 / Sompraz-D 40',
    genericSalt: 'Esomeprazole (40mg) + Domperidone (30mg SR)',
    category: 'Gastro / Acidity',
    brandedPrice: 225,
    genericPrice: 40,
    dosage: '40mg/30mg',
    packSize: '10 Capsules',
    usage: 'Persistent acid reflux with delayed gastric emptying and nighttime regurgitation.'
  },
  {
    id: 'ga-11',
    brandName: 'Rantac 150 / Aciloc 150 / Zinetac 150',
    genericSalt: 'Ranitidine (150mg)',
    category: 'Gastro / Acidity',
    brandedPrice: 38,
    genericPrice: 8,
    dosage: '150mg',
    packSize: '30 Tablets',
    usage: 'H2 receptor blocker for mild acidity, nighttime acid suppression, and allergy support.'
  },
  {
    id: 'ga-12',
    brandName: 'Sucrafil-O / Pegalfate-O',
    genericSalt: 'Sucralfate (1000mg) + Oxetacaine (20mg)',
    category: 'Gastro / Acidity',
    brandedPrice: 240,
    genericPrice: 48,
    dosage: '200ml Suspension',
    packSize: '1 Bottle',
    usage: 'Direct mucosal coating band-aid for burning stomach ulcers and acute esophagus erosion.'
  },
  {
    id: 'ga-13',
    brandName: 'Gelusil / Digene / Mucaine Gel',
    genericSalt: 'Aluminium Hydroxide + Magnesium Hydroxide + Simethicone',
    category: 'Gastro / Acidity',
    brandedPrice: 140,
    genericPrice: 32,
    dosage: '200ml Liquid',
    packSize: '1 Bottle',
    usage: 'Instant neutralizing antacid for sudden gas, bloating, and food-induced acidity.'
  },
  {
    id: 'ga-14',
    brandName: 'Emeset 4 / Ondem 4 / Vomikind 4',
    genericSalt: 'Ondansetron (4mg)',
    category: 'Gastro / Acidity',
    brandedPrice: 55,
    genericPrice: 10,
    dosage: '4mg',
    packSize: '10 Tablets',
    usage: '5-HT3 blocker for acute nausea, vomiting, gastroenteritis, and post-chemo sickness.'
  },
  {
    id: 'ga-15',
    brandName: 'Domstal 10 / Motilium 10',
    genericSalt: 'Domperidone (10mg)',
    category: 'Gastro / Acidity',
    brandedPrice: 42,
    genericPrice: 8,
    dosage: '10mg',
    packSize: '10 Tablets',
    usage: 'Prokinetic medicine for stomach heaviness, nausea, and motion discomfort.'
  },
  {
    id: 'ga-16',
    brandName: 'Meftal-Spas / Spasmo-Proxyvon / Cyclopam',
    genericSalt: 'Dicyclomine (10mg) + Mefenamic Acid (250mg)',
    category: 'Gastro / Acidity',
    brandedPrice: 58,
    genericPrice: 12,
    dosage: 'Combo',
    packSize: '10 Tablets',
    usage: 'Severe abdominal cramps, stomach colic pain, and menstrual dysmenorrhea spasms.'
  },
  {
    id: 'ga-17',
    brandName: 'Drotikind-M / Drotin-M',
    genericSalt: 'Drotaverine (80mg) + Mefenamic Acid (250mg)',
    category: 'Gastro / Acidity',
    brandedPrice: 125,
    genericPrice: 24,
    dosage: '80mg/250mg',
    packSize: '10 Tablets',
    usage: 'Kidney stone colic, biliary tract spasms, and acute intestinal spastic cramps.'
  },
  {
    id: 'ga-18',
    brandName: 'Imodium / Lopamide 2mg',
    genericSalt: 'Loperamide (2mg)',
    category: 'Gastro / Acidity',
    brandedPrice: 32,
    genericPrice: 6,
    dosage: '2mg',
    packSize: '10 Tablets',
    usage: 'Anti-motility agent for sudden acute non-infectious diarrhea and travelers gut.'
  },
  {
    id: 'ga-19',
    brandName: 'Duphalac / Loose / Cremaffin Plus',
    genericSalt: 'Lactulose (10g/15ml Liquid)',
    category: 'Gastro / Acidity',
    brandedPrice: 285,
    genericPrice: 60,
    dosage: '200ml Syrup',
    packSize: '1 Bottle',
    usage: 'Gentle osmotic laxative for chronic constipation and hepatic portal detox.'
  },
  {
    id: 'ga-20',
    brandName: 'Udiliv 300 / Ursofib 300 / Ursocol 300',
    genericSalt: 'Ursodeoxycholic Acid (300mg)',
    category: 'Gastro / Acidity',
    brandedPrice: 460,
    genericPrice: 85,
    dosage: '300mg',
    packSize: '10 Tablets',
    usage: 'Dissolves cholesterol gallstones, treats fatty liver (NAFLD), and cholestatic cirrhosis.'
  },
  {
    id: 'ga-21',
    brandName: 'Aristozyme / Unienzyme / Festal-N',
    genericSalt: 'Diastase (50mg) + Pepsin (10mg) Digestive Enzymes',
    category: 'Gastro / Acidity',
    brandedPrice: 130,
    genericPrice: 28,
    dosage: '200ml Liquid',
    packSize: '1 Bottle',
    usage: 'Aids starch and protein breakdown, relieves chronic gas and post-meal fullness.'
  },
  {
    id: 'ga-22',
    brandName: 'Enterogermina / Darolac Probiotics',
    genericSalt: 'Bacillus Clausii (2 Billion Spores)',
    category: 'Gastro / Acidity',
    brandedPrice: 480,
    genericPrice: 95,
    dosage: '5ml Mini Vials',
    packSize: '10 Vials',
    usage: 'Restores healthy intestinal flora after antibiotic courses and acute diarrhea.'
  },

  // ==========================================
  // 3. CARDIOVASCULAR, HYPERTENSION & CHOLESTEROL
  // ==========================================
  {
    id: 'cv-1',
    brandName: 'Telma 40 / Telmikind 40 / Micardis 40',
    genericSalt: 'Telmisartan (40mg)',
    category: 'Blood Pressure',
    brandedPrice: 140,
    genericPrice: 18,
    dosage: '40mg',
    packSize: '15 Tablets',
    usage: 'Angiotensin receptor blocker (ARB) for High Blood Pressure and heart protection.'
  },
  {
    id: 'cv-2',
    brandName: 'Telma 80 / Telmikind 80',
    genericSalt: 'Telmisartan (80mg)',
    category: 'Blood Pressure',
    brandedPrice: 240,
    genericPrice: 32,
    dosage: '80mg',
    packSize: '15 Tablets',
    usage: 'High dose antihypertensive for resistant hypertension and stroke prevention.'
  },
  {
    id: 'cv-3',
    brandName: 'Telma-H / Telmikind-H / Telsartan-H',
    genericSalt: 'Telmisartan (40mg) + Hydrochlorothiazide (12.5mg)',
    category: 'Blood Pressure',
    brandedPrice: 195,
    genericPrice: 28,
    dosage: '40mg/12.5mg',
    packSize: '15 Tablets',
    usage: 'Combination therapy with mild diuretic for stubborn high systolic blood pressure.'
  },
  {
    id: 'cv-4',
    brandName: 'Telma-AM / Telmikind-AM / Telsartan-AM',
    genericSalt: 'Telmisartan (40mg) + Amlodipine (5mg)',
    category: 'Blood Pressure',
    brandedPrice: 215,
    genericPrice: 30,
    dosage: '40mg/5mg',
    packSize: '15 Tablets',
    usage: 'Dual-action vasodilation for patients requiring multiple blood pressure agents.'
  },
  {
    id: 'cv-5',
    brandName: 'Telma-CT 40/12.5 / Telmikind-CT',
    genericSalt: 'Telmisartan (40mg) + Chlorthalidone (12.5mg)',
    category: 'Blood Pressure',
    brandedPrice: 220,
    genericPrice: 34,
    dosage: '40mg/12.5mg',
    packSize: '15 Tablets',
    usage: 'Long-acting 24-hour thiazide-like combination for cardiovascular risk reduction.'
  },
  {
    id: 'cv-6',
    brandName: 'Amlong 5 / Stamlo 5 / Norvasc 5',
    genericSalt: 'Amlodipine (5mg)',
    category: 'Blood Pressure',
    brandedPrice: 65,
    genericPrice: 10,
    dosage: '5mg',
    packSize: '15 Tablets',
    usage: 'Calcium channel blocker for hypertension and chronic stable coronary angina.'
  },
  {
    id: 'cv-7',
    brandName: 'Amlong 10 / Stamlo 10',
    genericSalt: 'Amlodipine (10mg)',
    category: 'Blood Pressure',
    brandedPrice: 110,
    genericPrice: 16,
    dosage: '10mg',
    packSize: '15 Tablets',
    usage: 'Higher-dose vascular relaxant for severe vasospastic and exercise angina.'
  },
  {
    id: 'cv-8',
    brandName: 'Amlokind-AT / Betacard-AM',
    genericSalt: 'Amlodipine (5mg) + Atenolol (50mg)',
    category: 'Blood Pressure',
    brandedPrice: 125,
    genericPrice: 20,
    dosage: '5mg/50mg',
    packSize: '15 Tablets',
    usage: 'Controls both elevated blood pressure and rapid resting heart rate palpitations.'
  },
  {
    id: 'cv-9',
    brandName: 'Losacar 50 / Repace 50 / Losar 50',
    genericSalt: 'Losartan Potassium (50mg)',
    category: 'Blood Pressure',
    brandedPrice: 110,
    genericPrice: 16,
    dosage: '50mg',
    packSize: '15 Tablets',
    usage: 'Renal-protective antihypertensive recommended for diabetic hypertension patients.'
  },
  {
    id: 'cv-10',
    brandName: 'Losar-H / Repace-H',
    genericSalt: 'Losartan (50mg) + Hydrochlorothiazide (12.5mg)',
    category: 'Blood Pressure',
    brandedPrice: 165,
    genericPrice: 24,
    dosage: '50mg/12.5mg',
    packSize: '15 Tablets',
    usage: 'Synergistic fluid and vessel regulation for chronic hypertension.'
  },
  {
    id: 'cv-11',
    brandName: 'Cardace 5 / Ramipres 5',
    genericSalt: 'Ramipril (5mg)',
    category: 'Blood Pressure',
    brandedPrice: 135,
    genericPrice: 22,
    dosage: '5mg',
    packSize: '15 Tablets',
    usage: 'ACE inhibitor preserving heart muscle function following myocardial infarction.'
  },
  {
    id: 'cv-12',
    brandName: 'Cardace 2.5 / Ramipres 2.5',
    genericSalt: 'Ramipril (2.5mg)',
    category: 'Blood Pressure',
    brandedPrice: 85,
    genericPrice: 14,
    dosage: '2.5mg',
    packSize: '15 Tablets',
    usage: 'Starting dose for congestive heart failure and microalbuminuria reduction.'
  },
  {
    id: 'cv-13',
    brandName: 'Betaloc 50 / Metolar-XR 50 / Seloken-XL 50',
    genericSalt: 'Metoprolol Succinate (50mg Extended Release)',
    category: 'Blood Pressure',
    brandedPrice: 165,
    genericPrice: 26,
    dosage: '50mg ER',
    packSize: '15 Tablets',
    usage: 'Beta-1 selective blocker for angina pectoris, post-heart attack recovery & tachycardia.'
  },
  {
    id: 'cv-14',
    brandName: 'Betaloc 25 / Metolar-XR 25',
    genericSalt: 'Metoprolol Succinate (25mg Extended Release)',
    category: 'Blood Pressure',
    brandedPrice: 105,
    genericPrice: 18,
    dosage: '25mg ER',
    packSize: '15 Tablets',
    usage: 'Lower dose heart rate stabilizer for mild arrhythmia and anxiety palpitations.'
  },
  {
    id: 'cv-15',
    brandName: 'Concor 5 / Bisoheart 5 / Corbis 5',
    genericSalt: 'Bisoprolol Fumarate (5mg)',
    category: 'Blood Pressure',
    brandedPrice: 145,
    genericPrice: 24,
    dosage: '5mg',
    packSize: '10 Tablets',
    usage: 'High cardioselectivity beta blocker for stable chronic systolic heart failure.'
  },
  {
    id: 'cv-16',
    brandName: 'Nebicard 5 / Nebistar 5',
    genericSalt: 'Nebivolol (5mg)',
    category: 'Blood Pressure',
    brandedPrice: 175,
    genericPrice: 28,
    dosage: '5mg',
    packSize: '10 Tablets',
    usage: 'Third-generation beta blocker with nitric oxide-mediated direct vasodilation.'
  },
  {
    id: 'cv-17',
    brandName: 'Carca 12.5 / Cardivas 12.5',
    genericSalt: 'Carvedilol (12.5mg)',
    category: 'Blood Pressure',
    brandedPrice: 130,
    genericPrice: 22,
    dosage: '12.5mg',
    packSize: '10 Tablets',
    usage: 'Non-selective beta and alpha-1 blocker for congestive cardiac insufficiency.'
  },
  {
    id: 'cv-18',
    brandName: 'Atorva 10 / Lipitor 10 / Storvas 10 / Atocor 10',
    genericSalt: 'Atorvastatin (10mg)',
    category: 'Cholesterol / Heart',
    brandedPrice: 160,
    genericPrice: 20,
    dosage: '10mg',
    packSize: '15 Tablets',
    usage: 'HMG-CoA reductase inhibitor lowering LDL Bad Cholesterol and preventing coronary plaques.'
  },
  {
    id: 'cv-19',
    brandName: 'Atorva 20 / Lipitor 20 / Storvas 20',
    genericSalt: 'Atorvastatin (20mg)',
    category: 'Cholesterol / Heart',
    brandedPrice: 260,
    genericPrice: 34,
    dosage: '20mg',
    packSize: '15 Tablets',
    usage: 'Intensive lipid-lowering therapy for dyslipidemia and high cardiovascular risk.'
  },
  {
    id: 'cv-20',
    brandName: 'Atorva 40 / Storvas 40',
    genericSalt: 'Atorvastatin (40mg)',
    category: 'Cholesterol / Heart',
    brandedPrice: 390,
    genericPrice: 52,
    dosage: '40mg',
    packSize: '15 Tablets',
    usage: 'High-intensity statin therapy prescribed immediately post acute coronary stent.'
  },
  {
    id: 'cv-21',
    brandName: 'Rosuvas 10 / Crestor 10 / Rosave 10',
    genericSalt: 'Rosuvastatin (10mg)',
    category: 'Cholesterol / Heart',
    brandedPrice: 220,
    genericPrice: 28,
    dosage: '10mg',
    packSize: '15 Tablets',
    usage: 'Potent statin raising HDL Good Cholesterol while aggressively lowering triglycerides.'
  },
  {
    id: 'cv-22',
    brandName: 'Rosuvas 20 / Crestor 20',
    genericSalt: 'Rosuvastatin (20mg)',
    category: 'Cholesterol / Heart',
    brandedPrice: 380,
    genericPrice: 48,
    dosage: '20mg',
    packSize: '15 Tablets',
    usage: 'Maximum efficacy lipid plaque regression for severe familial hypercholesterolemia.'
  },
  {
    id: 'cv-23',
    brandName: 'Fibator 10 / Lipikind-F',
    genericSalt: 'Atorvastatin (10mg) + Fenofibrate (145mg)',
    category: 'Cholesterol / Heart',
    brandedPrice: 275,
    genericPrice: 45,
    dosage: 'Combo',
    packSize: '10 Tablets',
    usage: 'Combined statin + fibrate targeting very high serum triglycerides (>300 mg/dL).'
  },
  {
    id: 'cv-24',
    brandName: 'Clavix 75 / Plavix 75 / Deplatt 75',
    genericSalt: 'Clopidogrel (75mg)',
    category: 'Cardiology',
    brandedPrice: 155,
    genericPrice: 24,
    dosage: '75mg',
    packSize: '15 Tablets',
    usage: 'P2Y12 platelet inhibitor preventing arterial blood clots in post-angioplasty stents.'
  },
  {
    id: 'cv-25',
    brandName: 'Clopilet-A 75 / Deplatt-A',
    genericSalt: 'Clopidogrel (75mg) + Aspirin (75mg)',
    category: 'Cardiology',
    brandedPrice: 195,
    genericPrice: 28,
    dosage: '75mg/75mg',
    packSize: '15 Capsules',
    usage: 'Dual antiplatelet therapy (DAPT) preventing stent thrombosis and ischemic stroke.'
  },
  {
    id: 'cv-26',
    brandName: 'Ecosprin 75 / Disprin 75',
    genericSalt: 'Aspirin Gastro-resistant (75mg)',
    category: 'Cardiology',
    brandedPrice: 60,
    genericPrice: 9,
    dosage: '75mg',
    packSize: '14 Tablets',
    usage: 'Daily blood thinner for primary and secondary cardiovascular protection.'
  },
  {
    id: 'cv-27',
    brandName: 'Ecosprin 150',
    genericSalt: 'Aspirin Gastro-resistant (150mg)',
    category: 'Cardiology',
    brandedPrice: 75,
    genericPrice: 12,
    dosage: '150mg',
    packSize: '14 Tablets',
    usage: 'Higher dose antiplatelet therapy for acute coronary syndromes and peripheral vascular disease.'
  },
  {
    id: 'cv-28',
    brandName: 'Brilinta 90 / Axcer 90',
    genericSalt: 'Ticagrelor (90mg)',
    category: 'Cardiology',
    brandedPrice: 850,
    genericPrice: 160,
    dosage: '90mg',
    packSize: '14 Tablets',
    usage: 'Reversible P2Y12 blocker for acute heart attack patients with unstable angina.'
  },
  {
    id: 'cv-29',
    brandName: 'Lasix 40',
    genericSalt: 'Furosemide (40mg)',
    category: 'Blood Pressure',
    brandedPrice: 22,
    genericPrice: 6,
    dosage: '40mg',
    packSize: '10 Tablets',
    usage: 'Fast loop diuretic clearing fluid retention in pulmonary edema and congestive heart failure.'
  },
  {
    id: 'cv-30',
    brandName: 'Dytor 10 / Torget 10',
    genericSalt: 'Torsemide (10mg)',
    category: 'Blood Pressure',
    brandedPrice: 95,
    genericPrice: 18,
    dosage: '10mg',
    packSize: '15 Tablets',
    usage: 'Longer bioavailability diuretic for chronic leg swelling, renal edema & ascites.'
  },
  {
    id: 'cv-31',
    brandName: 'Dytor-Plus 10 / Torget-Plus',
    genericSalt: 'Torsemide (10mg) + Spironolactone (50mg)',
    category: 'Blood Pressure',
    brandedPrice: 165,
    genericPrice: 32,
    dosage: '10mg/50mg',
    packSize: '15 Tablets',
    usage: 'Potassium-sparing diuretic combination preventing dangerous potassium loss.'
  },
  {
    id: 'cv-32',
    brandName: 'Aldactone 25',
    genericSalt: 'Spironolactone (25mg)',
    category: 'Blood Pressure',
    brandedPrice: 65,
    genericPrice: 14,
    dosage: '25mg',
    packSize: '15 Tablets',
    usage: 'Aldosterone antagonist improving survival in severe reduced ejection fraction heart failure.'
  },
  {
    id: 'cv-33',
    brandName: 'Sorbitrate 5mg / Isordil 5mg',
    genericSalt: 'Isosorbide Dinitrate (5mg Sublingual)',
    category: 'Cardiology',
    brandedPrice: 42,
    genericPrice: 8,
    dosage: '5mg',
    packSize: '50 Tablets',
    usage: 'Under-the-tongue emergency nitrate providing immediate relief during sudden chest pain/angina.'
  },
  {
    id: 'cv-34',
    brandName: 'Monotrate 20 / Imdur 30',
    genericSalt: 'Isosorbide Mononitrate (20mg)',
    category: 'Cardiology',
    brandedPrice: 95,
    genericPrice: 18,
    dosage: '20mg',
    packSize: '30 Tablets',
    usage: 'Daily coronary vasodilator preventing angina attacks and reducing cardiac pre-load.'
  },

  // ==========================================
  // 4. ENDOCRINOLOGY, DIABETES & THYROID
  // ==========================================
  {
    id: 'di-1',
    brandName: 'Glyciphage 500 / Glycomet 500',
    genericSalt: 'Metformin Hydrochloride (500mg SR)',
    category: 'Diabetes',
    brandedPrice: 55,
    genericPrice: 10,
    dosage: '500mg',
    packSize: '20 Tablets',
    usage: 'First-line biguanide reducing hepatic glucose output and improving insulin sensitivity.'
  },
  {
    id: 'di-2',
    brandName: 'Glyciphage 1000 / Glycomet 1g',
    genericSalt: 'Metformin Hydrochloride (1000mg SR)',
    category: 'Diabetes',
    brandedPrice: 95,
    genericPrice: 16,
    dosage: '1000mg',
    packSize: '15 Tablets',
    usage: 'High strength sustained release Metformin for Type-2 Diabetes and PCOS insulin resistance.'
  },
  {
    id: 'di-3',
    brandName: 'Glycomet-GP 1 / Amaryl-M 1',
    genericSalt: 'Glimepiride (1mg) + Metformin (500mg SR)',
    category: 'Diabetes',
    brandedPrice: 135,
    genericPrice: 20,
    dosage: '1mg/500mg',
    packSize: '15 Tablets',
    usage: 'Dual-action glycemic control stimulating beta cells while suppressing liver sugar production.'
  },
  {
    id: 'di-4',
    brandName: 'Glycomet-GP 2 / Amaryl-M 2 / Glimisave-M 2',
    genericSalt: 'Glimepiride (2mg) + Metformin (500mg SR)',
    category: 'Diabetes',
    brandedPrice: 175,
    genericPrice: 24,
    dosage: '2mg/500mg',
    packSize: '15 Tablets',
    usage: 'Most commonly prescribed diabetes combination for uncontrolled fasting & postprandial sugar.'
  },
  {
    id: 'di-5',
    brandName: 'Glycomet-GP 3 / Glimisave-M 3',
    genericSalt: 'Glimepiride (3mg) + Metformin (850mg SR)',
    category: 'Diabetes',
    brandedPrice: 215,
    genericPrice: 32,
    dosage: '3mg/850mg',
    packSize: '15 Tablets',
    usage: 'High strength secretagogue combination for advanced Type-2 diabetes.'
  },
  {
    id: 'di-6',
    brandName: 'Voglistar-GM 2 / Trivolib 2 / Glimisave-MV 2',
    genericSalt: 'Glimepiride (2mg) + Metformin (500mg) + Voglibose (0.2mg)',
    category: 'Diabetes',
    brandedPrice: 245,
    genericPrice: 38,
    dosage: 'Triple Combo',
    packSize: '10 Tablets',
    usage: 'Triple drug therapy preventing steep post-meal glucose spikes and HbA1c elevation.'
  },
  {
    id: 'di-7',
    brandName: 'Galvus 50 / Jalra 50 / Zomelis 50',
    genericSalt: 'Vildagliptin (50mg)',
    category: 'Diabetes',
    brandedPrice: 280,
    genericPrice: 42,
    dosage: '50mg',
    packSize: '15 Tablets',
    usage: 'DPP-4 inhibitor enhancing incretin hormones with very low risk of hypoglycemia.'
  },
  {
    id: 'di-8',
    brandName: 'Galvus Met 50/500 / Jalra-M 50/500',
    genericSalt: 'Vildagliptin (50mg) + Metformin (500mg)',
    category: 'Diabetes',
    brandedPrice: 340,
    genericPrice: 52,
    dosage: '50mg/500mg',
    packSize: '15 Tablets',
    usage: 'Synergistic incretin-biguanide combination without causing weight gain.'
  },
  {
    id: 'di-9',
    brandName: 'Galvus Met 50/1000 / Jalra-M 50/1000',
    genericSalt: 'Vildagliptin (50mg) + Metformin (1000mg)',
    category: 'Diabetes',
    brandedPrice: 395,
    genericPrice: 60,
    dosage: '50mg/1000mg',
    packSize: '15 Tablets',
    usage: 'High strength incretin combination for robust 24-hour HbA1c reduction.'
  },
  {
    id: 'di-10',
    brandName: 'Tenlimac 20 / Tenglyn 20 / Ziten 20',
    genericSalt: 'Teneligliptin (20mg)',
    category: 'Diabetes',
    brandedPrice: 145,
    genericPrice: 24,
    dosage: '20mg',
    packSize: '15 Tablets',
    usage: 'Affordable once-daily DPP-4 inhibitor safe in mild to moderate kidney impairment.'
  },
  {
    id: 'di-11',
    brandName: 'Tenlimac-M / Tenglyn-M / Ziten-M',
    genericSalt: 'Teneligliptin (20mg) + Metformin (500mg SR)',
    category: 'Diabetes',
    brandedPrice: 195,
    genericPrice: 30,
    dosage: '20mg/500mg',
    packSize: '15 Tablets',
    usage: 'Combined incretin therapy controlling both fasting and mealtime glucose levels.'
  },
  {
    id: 'di-12',
    brandName: 'Januvia 100 / Istavel 100 / Zita 100',
    genericSalt: 'Sitagliptin (100mg)',
    category: 'Diabetes',
    brandedPrice: 380,
    genericPrice: 65,
    dosage: '100mg',
    packSize: '15 Tablets',
    usage: 'Once-daily premium DPP-4 inhibitor with extensive cardiovascular safety trial data.'
  },
  {
    id: 'di-13',
    brandName: 'Janumet 50/500 / Istamet 50/500',
    genericSalt: 'Sitagliptin (50mg) + Metformin (500mg)',
    category: 'Diabetes',
    brandedPrice: 420,
    genericPrice: 68,
    dosage: '50mg/500mg',
    packSize: '15 Tablets',
    usage: 'Combined Sitagliptin and Metformin for patients struggling with high HbA1c.'
  },
  {
    id: 'di-14',
    brandName: 'Forxiga 10 / Oxra 10 / Dapavel 10',
    genericSalt: 'Dapagliflozin (10mg)',
    category: 'Diabetes',
    brandedPrice: 620,
    genericPrice: 85,
    dosage: '10mg',
    packSize: '14 Tablets',
    usage: 'SGLT2 inhibitor expelling glucose in urine, providing kidney protection & heart failure defense.'
  },
  {
    id: 'di-15',
    brandName: 'Forxiga 5 / Oxra 5',
    genericSalt: 'Dapagliflozin (5mg)',
    category: 'Diabetes',
    brandedPrice: 390,
    genericPrice: 55,
    dosage: '5mg',
    packSize: '14 Tablets',
    usage: 'Starting dose SGLT-2 inhibitor for elderly patients and chronic kidney disease management.'
  },
  {
    id: 'di-16',
    brandName: 'Xigduo XR 10/500 / Oxramet 10/500',
    genericSalt: 'Dapagliflozin (10mg) + Metformin (500mg ER)',
    category: 'Diabetes',
    brandedPrice: 680,
    genericPrice: 95,
    dosage: '10mg/500mg',
    packSize: '14 Tablets',
    usage: 'Dual gliflozin-biguanide therapy aiding weight loss while lowering glucose.'
  },
  {
    id: 'di-17',
    brandName: 'Jardiance 10 / Gibtulio 10',
    genericSalt: 'Empagliflozin (10mg)',
    category: 'Diabetes',
    brandedPrice: 640,
    genericPrice: 88,
    dosage: '10mg',
    packSize: '10 Tablets',
    usage: 'SGLT2 inhibitor proven to reduce cardiovascular mortality in diabetic patients.'
  },
  {
    id: 'di-18',
    brandName: 'Diamicron 60 MR / Reclide 60 MR',
    genericSalt: 'Gliclazide (60mg Modified Release)',
    category: 'Diabetes',
    brandedPrice: 195,
    genericPrice: 28,
    dosage: '60mg MR',
    packSize: '15 Tablets',
    usage: 'Microvascular-protective sulfonylurea with steady pancreatic insulin release.'
  },
  {
    id: 'di-19',
    brandName: 'Volibo 0.2 / Voglitor 0.2',
    genericSalt: 'Voglibose (0.2mg)',
    category: 'Diabetes',
    brandedPrice: 110,
    genericPrice: 16,
    dosage: '0.2mg',
    packSize: '10 Tablets',
    usage: 'Alpha-glucosidase inhibitor taken before meals to delay complex carbohydrate absorption.'
  },
  {
    id: 'di-20',
    brandName: 'Volibo 0.3 / Voglitor 0.3',
    genericSalt: 'Voglibose (0.3mg)',
    category: 'Diabetes',
    brandedPrice: 140,
    genericPrice: 20,
    dosage: '0.3mg',
    packSize: '10 Tablets',
    usage: 'Higher strength starch blocker for carbohydrate-heavy Indian diets.'
  },
  {
    id: 'di-21',
    brandName: 'Eltroxin 50mcg / Thyronorm 50',
    genericSalt: 'Thyroxine Sodium (50mcg)',
    category: 'Thyroid',
    brandedPrice: 165,
    genericPrice: 38,
    dosage: '50mcg',
    packSize: '100 Tablets',
    usage: 'Synthetic T4 hormone replacement for primary hypothyroidism, fatigue, and weight gain.'
  },
  {
    id: 'di-22',
    brandName: 'Eltroxin 100mcg / Thyronorm 100',
    genericSalt: 'Thyroxine Sodium (100mcg)',
    category: 'Thyroid',
    brandedPrice: 195,
    genericPrice: 44,
    dosage: '100mcg',
    packSize: '100 Tablets',
    usage: 'Full replacement dose for Hashimoto thyroiditis and post-thyroidectomy patients.'
  },
  {
    id: 'di-23',
    brandName: 'Eltroxin 25mcg / Thyronorm 25',
    genericSalt: 'Thyroxine Sodium (25mcg)',
    category: 'Thyroid',
    brandedPrice: 145,
    genericPrice: 32,
    dosage: '25mcg',
    packSize: '100 Tablets',
    usage: 'Subclinical hypothyroidism and gentle titration dose for cardiac or elderly patients.'
  },
  {
    id: 'di-24',
    brandName: 'Neo-Mercazole 5 / Thyrocab 5',
    genericSalt: 'Carbimazole (5mg)',
    category: 'Thyroid',
    brandedPrice: 155,
    genericPrice: 28,
    dosage: '5mg',
    packSize: '100 Tablets',
    usage: 'Antithyroid medicine reducing excessive thyroid hormone in hyperthyroidism & Graves disease.'
  },

  // ==========================================
  // 5. PAIN, ARTHRITIS, ORTHOPEDICS & MUSCLE RELAXANTS
  // ==========================================
  {
    id: 'pa-1',
    brandName: 'Dolo 650 / Calpol 650 / Crocin 650 / P-650',
    genericSalt: 'Paracetamol (650mg)',
    category: 'Pain & Swelling',
    brandedPrice: 35,
    genericPrice: 8,
    dosage: '650mg',
    packSize: '15 Tablets',
    usage: 'First-line antipyretic for high fever, bodyache, viral headaches, and dental pain.'
  },
  {
    id: 'pa-2',
    brandName: 'Combiflam / Flexon / Ibugesic-Plus',
    genericSalt: 'Ibuprofen (400mg) + Paracetamol (325mg)',
    category: 'Pain & Swelling',
    brandedPrice: 48,
    genericPrice: 10,
    dosage: '400mg/325mg',
    packSize: '20 Tablets',
    usage: 'Dual analgesic-anti-inflammatory for muscle sprains, toothaches, fever, and sports injury.'
  },
  {
    id: 'pa-3',
    brandName: 'Zerodol-P / Hifenac-P / Aceclo-Plus',
    genericSalt: 'Aceclofenac (100mg) + Paracetamol (325mg)',
    category: 'Pain & Swelling',
    brandedPrice: 85,
    genericPrice: 16,
    dosage: '100mg/325mg',
    packSize: '10 Tablets',
    usage: 'Relieves acute joint pain, osteoarthritis stiffness, backache, and soft tissue trauma.'
  },
  {
    id: 'pa-4',
    brandName: 'Zerodol-SP / Hifenac-SP / Signoflam',
    genericSalt: 'Aceclofenac (100mg) + Paracetamol (325mg) + Serratiopeptidase (15mg)',
    category: 'Pain & Swelling',
    brandedPrice: 125,
    genericPrice: 28,
    dosage: 'Triple Combo',
    packSize: '10 Tablets',
    usage: 'Enzymatic pain formula reducing severe post-operative swelling, dental edema, and fractures.'
  },
  {
    id: 'pa-5',
    brandName: 'Zerodol-TH / Hifenac-TH / Myoril-A',
    genericSalt: 'Aceclofenac (100mg) + Thiocolchicoside (4mg)',
    category: 'Pain & Swelling',
    brandedPrice: 245,
    genericPrice: 45,
    dosage: '100mg/4mg',
    packSize: '10 Tablets',
    usage: 'Powerful muscle relaxant + NSAID for severe cervical spondylosis, neck stiffness & sciatica.'
  },
  {
    id: 'pa-6',
    brandName: 'Voveran 50 / Dynapar 50 / Reactin 50',
    genericSalt: 'Diclofenac Sodium (50mg Gastro-resistant)',
    category: 'Pain & Swelling',
    brandedPrice: 95,
    genericPrice: 14,
    dosage: '50mg',
    packSize: '10 Tablets',
    usage: 'Fast-acting NSAID for rheumatoid arthritis flares, gout pain, and severe back spasms.'
  },
  {
    id: 'pa-7',
    brandName: 'Voveran-SR 100 / Dynapar-SR 100',
    genericSalt: 'Diclofenac Sodium (100mg Sustained Release)',
    category: 'Pain & Swelling',
    brandedPrice: 185,
    genericPrice: 26,
    dosage: '100mg SR',
    packSize: '15 Tablets',
    usage: '24-hour continuous pain relief for severe chronic spine, knee, and hip degenerative arthritis.'
  },
  {
    id: 'pa-8',
    brandName: 'Ultracet / Tramazac-P / Calpol-T',
    genericSalt: 'Tramadol (37.5mg) + Paracetamol (325mg)',
    category: 'Pain & Swelling',
    brandedPrice: 210,
    genericPrice: 38,
    dosage: '37.5mg/325mg',
    packSize: '15 Tablets',
    usage: 'Centrally-acting opioid analgesic combination for moderate to severe post-surgical pain.'
  },
  {
    id: 'pa-9',
    brandName: 'Nucoxia 90 / Etoshine 90 / Brutaflam 90',
    genericSalt: 'Etoricoxib (90mg)',
    category: 'Pain & Swelling',
    brandedPrice: 215,
    genericPrice: 36,
    dosage: '90mg',
    packSize: '10 Tablets',
    usage: 'Selective COX-2 inhibitor with gentle stomach profile for acute gout and ankylosing spondylitis.'
  },
  {
    id: 'pa-10',
    brandName: 'Nucoxia 60 / Etoshine 60',
    genericSalt: 'Etoricoxib (60mg)',
    category: 'Pain & Swelling',
    brandedPrice: 165,
    genericPrice: 28,
    dosage: '60mg',
    packSize: '10 Tablets',
    usage: 'Daily osteoarthritis management reducing chronic knee inflammation without stomach ulcers.'
  },
  {
    id: 'pa-11',
    brandName: 'Myoril 4 / Thiospas 4',
    genericSalt: 'Thiocolchicoside (4mg)',
    category: 'Pain & Swelling',
    brandedPrice: 195,
    genericPrice: 34,
    dosage: '4mg',
    packSize: '10 Capsules',
    usage: 'Pure muscle relaxant working at the spinal level to unlock painful acute muscle spasms.'
  },
  {
    id: 'pa-12',
    brandName: 'Lyrica 75 / Pregabid 75 / Maxgalin 75',
    genericSalt: 'Pregabalin (75mg)',
    category: 'Pain & Swelling',
    brandedPrice: 240,
    genericPrice: 38,
    dosage: '75mg',
    packSize: '10 Capsules',
    usage: 'Neuropathic nerve pain reliever for diabetic peripheral neuropathy and post-herpetic neuralgia.'
  },
  {
    id: 'pa-13',
    brandName: 'Pregabid-M 75 / Nervijen-P / Maxgalin-M',
    genericSalt: 'Pregabalin (75mg) + Methylcobalamin (750mcg)',
    category: 'Pain & Swelling',
    brandedPrice: 310,
    genericPrice: 48,
    dosage: 'Combo',
    packSize: '10 Capsules',
    usage: 'Repairs damaged nerve myelin sheaths while dampening tingling, burning, and numbness in feet.'
  },
  {
    id: 'pa-14',
    brandName: 'Neurontin 300 / Gabapin 300',
    genericSalt: 'Gabapentin (300mg)',
    category: 'Pain & Swelling',
    brandedPrice: 225,
    genericPrice: 36,
    dosage: '300mg',
    packSize: '10 Tablets',
    usage: 'Modulates calcium channels to suppress chronic sciatica nerve compression and burning pain.'
  },
  {
    id: 'pa-15',
    brandName: 'Zyloric 100 / Zyrik 100',
    genericSalt: 'Allopurinol (100mg)',
    category: 'Pain & Swelling',
    brandedPrice: 45,
    genericPrice: 10,
    dosage: '100mg',
    packSize: '10 Tablets',
    usage: 'Xanthine oxidase inhibitor reducing high blood uric acid levels and preventing gout attacks.'
  },
  {
    id: 'pa-16',
    brandName: 'Febutaz 40 / Feburic 40 / Febugood 40',
    genericSalt: 'Febuxostat (40mg)',
    category: 'Pain & Swelling',
    brandedPrice: 165,
    genericPrice: 28,
    dosage: '40mg',
    packSize: '10 Tablets',
    usage: 'Potent uric acid reducer highly effective in patients with chronic tophaceous gout.'
  },
  {
    id: 'pa-17',
    brandName: 'Goutnil 0.5',
    genericSalt: 'Colchicine (0.5mg)',
    category: 'Pain & Swelling',
    brandedPrice: 75,
    genericPrice: 15,
    dosage: '0.5mg',
    packSize: '10 Tablets',
    usage: 'Emergency anti-mitotic drug arresting excruciating acute big toe gout inflammation.'
  },

  // ==========================================
  // 6. ALLERGY, ASTHMA, COUGH & RESPIRATORY
  // ==========================================
  {
    id: 're-1',
    brandName: 'Montek-LC / Montair-LC / Telekast-L / Romilast-L',
    genericSalt: 'Montelukast (10mg) + Levocetirizine (5mg)',
    category: 'Allergy & Asthma',
    brandedPrice: 210,
    genericPrice: 36,
    dosage: '10mg/5mg',
    packSize: '10 Tablets',
    usage: 'Allergic rhinitis, continuous morning sneezing, pollen allergy & nocturnal asthma.'
  },
  {
    id: 're-2',
    brandName: 'Montair 10 / Montek 10 / Singulair 10',
    genericSalt: 'Montelukast (10mg)',
    category: 'Allergy & Asthma',
    brandedPrice: 160,
    genericPrice: 28,
    dosage: '10mg',
    packSize: '15 Tablets',
    usage: 'Leukotriene receptor antagonist preventing exercise-induced airway constriction.'
  },
  {
    id: 're-3',
    brandName: 'Allegra 120 / Fexova 120',
    genericSalt: 'Fexofenadine Hydrochloride (120mg)',
    category: 'Allergy & Asthma',
    brandedPrice: 195,
    genericPrice: 32,
    dosage: '120mg',
    packSize: '10 Tablets',
    usage: 'Non-sedating antihistamine for running nose, seasonal allergies, and itchy skin hives.'
  },
  {
    id: 're-4',
    brandName: 'Allegra 180 / Fexova 180',
    genericSalt: 'Fexofenadine Hydrochloride (180mg)',
    category: 'Allergy & Asthma',
    brandedPrice: 260,
    genericPrice: 42,
    dosage: '180mg',
    packSize: '10 Tablets',
    usage: 'High strength non-drowsy formulation for chronic idiopathic urticaria and skin wheals.'
  },
  {
    id: 're-5',
    brandName: 'Cetzine / Alerid / Okacet',
    genericSalt: 'Cetirizine Hydrochloride (10mg)',
    category: 'Allergy & Asthma',
    brandedPrice: 38,
    genericPrice: 7,
    dosage: '10mg',
    packSize: '10 Tablets',
    usage: 'Classic antihistamine for sudden dust allergy, watery eyes, insect bites, and cold sneezing.'
  },
  {
    id: 're-6',
    brandName: '1-AL / Levocet / Xyzal',
    genericSalt: 'Levocetirizine (5mg)',
    category: 'Allergy & Asthma',
    brandedPrice: 65,
    genericPrice: 11,
    dosage: '5mg',
    packSize: '10 Tablets',
    usage: 'Pure active R-enantiomer with less drowsiness for seasonal hay fever.'
  },
  {
    id: 're-7',
    brandName: 'Bilasure 20 / Bilaxten 20',
    genericSalt: 'Bilastine (20mg)',
    category: 'Allergy & Asthma',
    brandedPrice: 220,
    genericPrice: 38,
    dosage: '20mg',
    packSize: '10 Tablets',
    usage: 'Next-generation fast antihistamine with zero brain sedation and zero driving impairment.'
  },
  {
    id: 're-8',
    brandName: 'Asthalin Inhaler / Ventorlin Inhaler',
    genericSalt: 'Salbutamol / Albuterol (100mcg/puff)',
    category: 'Allergy & Asthma',
    brandedPrice: 165,
    genericPrice: 42,
    dosage: '200 Metered Doses',
    packSize: '1 Inhaler',
    usage: 'Rapid-acting emergency rescue bronchodilator for sudden acute asthma breathlessness.'
  },
  {
    id: 're-9',
    brandName: 'Foracort 200 Inhaler / Budamate 200',
    genericSalt: 'Formoterol (6mcg) + Budesonide (200mcg)',
    category: 'Allergy & Asthma',
    brandedPrice: 460,
    genericPrice: 95,
    dosage: '120 Metered Doses',
    packSize: '1 Inhaler',
    usage: 'Maintenance inhaler for moderate-to-severe Asthma and chronic obstructive pulmonary disease (COPD).'
  },
  {
    id: 're-10',
    brandName: 'Foracort 400 Inhaler / Budamate 400',
    genericSalt: 'Formoterol (6mcg) + Budesonide (400mcg)',
    category: 'Allergy & Asthma',
    brandedPrice: 580,
    genericPrice: 120,
    dosage: '120 Metered Doses',
    packSize: '1 Inhaler',
    usage: 'High strength steroid + LABA inhaler preventing severe respiratory exacerbations.'
  },
  {
    id: 're-11',
    brandName: 'Duolin Inhaler / Duolin Respules',
    genericSalt: 'Levosalbutamol (50mcg) + Ipratropium Bromide (20mcg)',
    category: 'Allergy & Asthma',
    brandedPrice: 340,
    genericPrice: 65,
    dosage: '200 Doses',
    packSize: '1 Inhaler',
    usage: 'Dual bronchodilator relaxing airway smooth muscles in acute emphysema and bronchitis.'
  },
  {
    id: 're-12',
    brandName: 'Budecort 200 Inhaler / Pulmicort',
    genericSalt: 'Budesonide (200mcg Inhaler)',
    category: 'Allergy & Asthma',
    brandedPrice: 360,
    genericPrice: 68,
    dosage: '200 Doses',
    packSize: '1 Inhaler',
    usage: 'Inhaled corticosteroid reducing persistent bronchial swelling and eosinophilic inflammation.'
  },
  {
    id: 're-13',
    brandName: 'Ascoril-LS / Alex-LS / Macbery-LS',
    genericSalt: 'Levosalbutamol (1mg) + Ambroxol (30mg) + Guaiphenesin (50mg)',
    category: 'Allergy & Asthma',
    brandedPrice: 135,
    genericPrice: 28,
    dosage: '100ml Syrup',
    packSize: '1 Bottle',
    usage: 'Triple action expectorant clearing thick chest mucus while opening wheezing airways.'
  },
  {
    id: 're-14',
    brandName: 'Alex-D / Benadryl-DR / Ascoril-D',
    genericSalt: 'Dextromethorphan (10mg) + Chlorpheniramine (2mg) + Phenylephrine (5mg)',
    category: 'Allergy & Asthma',
    brandedPrice: 125,
    genericPrice: 25,
    dosage: '100ml Syrup',
    packSize: '1 Bottle',
    usage: 'Cough suppressant relieving dry irritating nocturnal throat tickles without phlegm.'
  },
  {
    id: 're-15',
    brandName: 'Deriphyllin / Deriphyllin Retard 150',
    genericSalt: 'Theophylline (115mg) + Etofylline (35mg)',
    category: 'Allergy & Asthma',
    brandedPrice: 42,
    genericPrice: 9,
    dosage: '150mg',
    packSize: '30 Tablets',
    usage: 'Affordable xanthine bronchodilator improving diaphragm contractility in chronic COPD.'
  },
  {
    id: 're-16',
    brandName: 'Doxoril 400 / Doxolin 400 / Pulmodox 400',
    genericSalt: 'Doxofylline (400mg)',
    category: 'Allergy & Asthma',
    brandedPrice: 190,
    genericPrice: 34,
    dosage: '400mg',
    packSize: '10 Tablets',
    usage: 'Novel xanthine bronchodilator with significantly lower cardiac side-effects than Theophylline.'
  },
  {
    id: 're-17',
    brandName: 'Mucomix 600 / Fluimucil 600 / Nacfil 600',
    genericSalt: 'N-Acetylcysteine (600mg Effervescent)',
    category: 'Allergy & Asthma',
    brandedPrice: 320,
    genericPrice: 58,
    dosage: '600mg',
    packSize: '10 Effervescent Tabs',
    usage: 'Dissolves stubborn respiratory mucous bonds and replenishes intracellular glutathione antioxidants.'
  },
  {
    id: 're-18',
    brandName: 'Otrivin Adult / Nasivion 0.05%',
    genericSalt: 'Oxymetazoline Hydrochloride (0.05% Nasal Drops)',
    category: 'Allergy & Asthma',
    brandedPrice: 95,
    genericPrice: 18,
    dosage: '10ml Spray',
    packSize: '1 Bottle',
    usage: 'Fast 25-second nasal decongestant clearing blocked nostrils during acute head cold and sinusitis.'
  },
  {
    id: 're-19',
    brandName: 'Flomist Nasal Spray / Furamist',
    genericSalt: 'Fluticasone Furoate (27.5mcg/spray)',
    category: 'Allergy & Asthma',
    brandedPrice: 410,
    genericPrice: 85,
    dosage: '120 Sprays',
    packSize: '1 Bottle',
    usage: 'Corticosteroid nasal spray healing chronic allergic turbinate hypertrophy and nasal polyps.'
  },

  // ==========================================
  // 7. BONE, JOINTS, VITAMINS & NUTRITION
  // ==========================================
  {
    id: 'vi-1',
    brandName: 'Shelcal 500 / Cipcal 500 / Calcicad 500',
    genericSalt: 'Calcium Carbonate (500mg Elemental) + Vitamin D3 (250 IU)',
    category: 'Bone & Joints',
    brandedPrice: 130,
    genericPrice: 22,
    dosage: '500mg',
    packSize: '15 Tablets',
    usage: 'Prevents bone loss, treats osteoporosis, post-menopausal bone aches & hypocalcemia.'
  },
  {
    id: 'vi-2',
    brandName: 'Calcimax 500 / Supracal',
    genericSalt: 'Calcium Citrate (1000mg) + Magnesium + Zinc + Vitamin D3',
    category: 'Bone & Joints',
    brandedPrice: 220,
    genericPrice: 38,
    dosage: 'High Absorption',
    packSize: '15 Tablets',
    usage: 'Highly bioavailable calcium citrate gentle on stomach, safe for kidney stone prone patients.'
  },
  {
    id: 'vi-3',
    brandName: 'Uprise-D3 60K / Calcirol 60K / D-Rise 60K',
    genericSalt: 'Cholecalciferol / Vitamin D3 (60,000 IU)',
    category: 'Bone & Joints',
    brandedPrice: 180,
    genericPrice: 28,
    dosage: '60,000 IU',
    packSize: '4 Softgels',
    usage: 'High dose weekly booster rapidly restoring severe Vitamin D deficiency, immunity & bone density.'
  },
  {
    id: 'vi-4',
    brandName: 'Becosules / Neurobion Forte / Surbex-T',
    genericSalt: 'B-Complex Vitamins (B1, B2, B6, B12, Niacinamide, Calcium Pantothenate)',
    category: 'Bone & Joints',
    brandedPrice: 65,
    genericPrice: 12,
    dosage: 'Standard Therapeutic',
    packSize: '20 Capsules',
    usage: 'Cures painful mouth ulcers, tongue sores, peripheral nerve burning, and general fatigue.'
  },
  {
    id: 'vi-5',
    brandName: 'Nurokind-OD / Rejunex / Mecobalamin 1500',
    genericSalt: 'Methylcobalamin / Vitamin B12 (1500mcg Sublingual)',
    category: 'Bone & Joints',
    brandedPrice: 195,
    genericPrice: 32,
    dosage: '1500mcg',
    packSize: '15 Tablets',
    usage: 'Crucial for vegetarian diets to prevent B12 anemia, brain fog, memory decline & nerve tingling.'
  },
  {
    id: 'vi-6',
    brandName: 'Orofer-XT / Autrin / Fefol-Z',
    genericSalt: 'Ferrous Ascorbate (100mg Elemental Iron) + Folic Acid (1.5mg)',
    category: 'Bone & Joints',
    brandedPrice: 185,
    genericPrice: 32,
    dosage: '100mg/1.5mg',
    packSize: '10 Tablets',
    usage: 'High absorption non-constipating iron booster curing iron-deficiency anemia in women & pregnancy.'
  },
  {
    id: 'vi-7',
    brandName: 'Folvite 5mg',
    genericSalt: 'Folic Acid / Vitamin B9 (5mg)',
    category: 'Bone & Joints',
    brandedPrice: 75,
    genericPrice: 12,
    dosage: '5mg',
    packSize: '45 Tablets',
    usage: 'Essential pre-conception and pregnancy supplement preventing neural tube birth defects.'
  },
  {
    id: 'vi-8',
    brandName: 'Limcee 500 / Celin 500 / Sukcee 500',
    genericSalt: 'Vitamin C / Ascorbic Acid (500mg Chewable)',
    category: 'Bone & Joints',
    brandedPrice: 42,
    genericPrice: 8,
    dosage: '500mg',
    packSize: '15 Chewable Tabs',
    usage: 'Immunity booster, collagen builder for glowing skin, and enhances dietary iron absorption.'
  },
  {
    id: 'vi-9',
    brandName: 'Evion 400',
    genericSalt: 'Vitamin E / Tocopheryl Acetate (400mg)',
    category: 'Bone & Joints',
    brandedPrice: 78,
    genericPrice: 15,
    dosage: '400mg',
    packSize: '10 Capsules',
    usage: 'Lipid antioxidant protecting cell membranes, muscle cramps, fatty liver, and hair vitality.'
  },
  {
    id: 'vi-10',
    brandName: 'Zincovit / A-to-Z / Supradyn / Revital',
    genericSalt: 'Multivitamins + Essential Minerals + Zinc (22.5mg)',
    category: 'Bone & Joints',
    brandedPrice: 125,
    genericPrice: 24,
    dosage: 'Complete Formula',
    packSize: '15 Tablets',
    usage: 'Daily nutritional insurance improving stamina, wound healing, and metabolic energy levels.'
  },
  {
    id: 'vi-11',
    brandName: 'Jointace / Cartigen / Cartilamine',
    genericSalt: 'Glucosamine Sulfate (750mg) + Chondroitin (400mg)',
    category: 'Bone & Joints',
    brandedPrice: 380,
    genericPrice: 65,
    dosage: '750mg/400mg',
    packSize: '10 Tablets',
    usage: 'Rebuilds synovial fluid cushion in knee joints and slows down cartilage erosion.'
  },

  // ==========================================
  // 8. NEUROLOGY, PSYCHIATRY & SLEEP
  // ==========================================
  {
    id: 'ne-1',
    brandName: 'Nexito 10 / Stalopam 10 / Cilentra 10',
    genericSalt: 'Escitalopram Oxalate (10mg)',
    category: 'Allergy & Asthma',
    brandedPrice: 135,
    genericPrice: 22,
    dosage: '10mg',
    packSize: '10 Tablets',
    usage: 'SSRI antidepressant for generalized anxiety disorder, panic attacks, and clinical depression.'
  },
  {
    id: 'ne-2',
    brandName: 'Nexito-Plus / Clonafit-Plus / Petril-Plus',
    genericSalt: 'Escitalopram (10mg) + Clonazepam (0.5mg)',
    category: 'Allergy & Asthma',
    brandedPrice: 195,
    genericPrice: 32,
    dosage: '10mg/0.5mg',
    packSize: '10 Tablets',
    usage: 'Dual anxiolytic calming acute anxiety tremors, severe insomnia, and heart racing panic.'
  },
  {
    id: 'ne-3',
    brandName: 'Alprax 0.25 / Restyl 0.25 / Trika 0.25',
    genericSalt: 'Alprazolam (0.25mg)',
    category: 'Allergy & Asthma',
    brandedPrice: 35,
    genericPrice: 7,
    dosage: '0.25mg',
    packSize: '15 Tablets',
    usage: 'Short-acting benzodiazepine providing immediate calming during acute panic episodes.'
  },
  {
    id: 'ne-4',
    brandName: 'Alprax 0.5 / Restyl 0.5',
    genericSalt: 'Alprazolam (0.5mg)',
    category: 'Allergy & Asthma',
    brandedPrice: 65,
    genericPrice: 11,
    dosage: '0.5mg',
    packSize: '15 Tablets',
    usage: 'Prescription anxiolytic for severe agitation and acute anxiety insomnia.'
  },
  {
    id: 'ne-5',
    brandName: 'Clona 0.5 / Lonazep 0.5 / Zapiz 0.5',
    genericSalt: 'Clonazepam (0.5mg)',
    category: 'Allergy & Asthma',
    brandedPrice: 55,
    genericPrice: 10,
    dosage: '0.5mg',
    packSize: '15 Tablets',
    usage: 'Long-acting anticonvulsant and muscle relaxant for nocturnal panic and restless legs.'
  },
  {
    id: 'ne-6',
    brandName: 'Sertima 50 / Daxid 50 / Zoloft 50',
    genericSalt: 'Sertraline (50mg)',
    category: 'Allergy & Asthma',
    brandedPrice: 165,
    genericPrice: 28,
    dosage: '50mg',
    packSize: '10 Tablets',
    usage: 'SSRI of choice for obsessive-compulsive disorder (OCD), PTSD, and social anxiety.'
  },
  {
    id: 'ne-7',
    brandName: 'Tryptomer 10 / Amitone 10',
    genericSalt: 'Amitriptyline Hydrochloride (10mg)',
    category: 'Allergy & Asthma',
    brandedPrice: 45,
    genericPrice: 8,
    dosage: '10mg',
    packSize: '30 Tablets',
    usage: 'Tricyclic drug widely used at low doses for chronic migraine prevention and tension headaches.'
  },
  {
    id: 'ne-8',
    brandName: 'Tryptomer 25 / Amitone 25',
    genericSalt: 'Amitriptyline Hydrochloride (25mg)',
    category: 'Allergy & Asthma',
    brandedPrice: 75,
    genericPrice: 12,
    dosage: '25mg',
    packSize: '30 Tablets',
    usage: 'Treatment of fibromyalgia pain, irritable bowel syndrome, and nighttime neuropathic pain.'
  },
  {
    id: 'ne-9',
    brandName: 'Zolfresh 10 / Nitrest 10 / Ambien 10',
    genericSalt: 'Zolpidem Tartrate (10mg)',
    category: 'Allergy & Asthma',
    brandedPrice: 140,
    genericPrice: 24,
    dosage: '10mg',
    packSize: '10 Tablets',
    usage: 'Non-benzodiazepine hypnotic for short-term initiation of sleep in severe chronic insomnia.'
  },
  {
    id: 'ne-10',
    brandName: 'Levera 500 / Epilive 500 / Keppra 500',
    genericSalt: 'Levetiracetam (500mg)',
    category: 'Allergy & Asthma',
    brandedPrice: 220,
    genericPrice: 38,
    dosage: '500mg',
    packSize: '10 Tablets',
    usage: 'Broad-spectrum anti-epileptic preventing partial-onset seizures with clean drug profile.'
  },
  {
    id: 'ne-11',
    brandName: 'Encorate Chrono 300 / Valparin 300',
    genericSalt: 'Sodium Valproate + Valproic Acid (300mg CR)',
    category: 'Allergy & Asthma',
    brandedPrice: 135,
    genericPrice: 24,
    dosage: '300mg CR',
    packSize: '10 Tablets',
    usage: 'Stabilizes mood in bipolar disorder and prevents generalized tonic-clonic epilepsy.'
  },
  {
    id: 'ne-12',
    brandName: 'Vertin 16 / Betavert 16',
    genericSalt: 'Betahistine Dihydrochloride (16mg)',
    category: 'Allergy & Asthma',
    brandedPrice: 195,
    genericPrice: 32,
    dosage: '16mg',
    packSize: '15 Tablets',
    usage: 'Histamine analogue improving microcirculation in the inner ear, relieving Vertigo and Ménière ringing.'
  },
  {
    id: 'ne-13',
    brandName: 'Vertin 8 / Betavert 8',
    genericSalt: 'Betahistine Dihydrochloride (8mg)',
    category: 'Allergy & Asthma',
    brandedPrice: 120,
    genericPrice: 20,
    dosage: '8mg',
    packSize: '15 Tablets',
    usage: 'Maintenance dosage for motion dizziness, spinning head sensation, and vestibular loss.'
  },
  {
    id: 'ne-14',
    brandName: 'Stugeron 25 / Vertigon 25',
    genericSalt: 'Cinnarizine (25mg)',
    category: 'Allergy & Asthma',
    brandedPrice: 65,
    genericPrice: 12,
    dosage: '25mg',
    packSize: '10 Tablets',
    usage: 'Prevents travel sickness, vomiting during bus/car rides, and labyrinthine vertigo.'
  },
  {
    id: 'ne-15',
    brandName: 'Ciplar 10 / Inderal 10',
    genericSalt: 'Propranolol Hydrochloride (10mg)',
    category: 'Blood Pressure',
    brandedPrice: 38,
    genericPrice: 8,
    dosage: '10mg',
    packSize: '15 Tablets',
    usage: 'Controls performance stage anxiety, hand tremors, social sweating, and migraine prevention.'
  },
  {
    id: 'ne-16',
    brandName: 'Ciplar 40 / Inderal 40',
    genericSalt: 'Propranolol Hydrochloride (40mg)',
    category: 'Blood Pressure',
    brandedPrice: 85,
    genericPrice: 15,
    dosage: '40mg',
    packSize: '15 Tablets',
    usage: 'Non-selective beta blocker for essential tremors, portal hypertension, and hyperthyroid tachycardia.'
  },
  {
    id: 'ne-17',
    brandName: 'Sibelium 10 / Flunarin 10',
    genericSalt: 'Flunarizine (10mg)',
    category: 'Pain & Swelling',
    brandedPrice: 145,
    genericPrice: 25,
    dosage: '10mg',
    packSize: '10 Tablets',
    usage: 'Selective calcium antagonist drastically reducing the frequency of severe throbbing migraines.'
  },
  {
    id: 'ne-18',
    brandName: 'Strocit 500 / Ceham 500 / Citistar 500',
    genericSalt: 'Citicoline (500mg)',
    category: 'Allergy & Asthma',
    brandedPrice: 640,
    genericPrice: 98,
    dosage: '500mg',
    packSize: '10 Tablets',
    usage: 'Neuroprotective agent accelerating brain tissue recovery following ischemic stroke or head trauma.'
  },

  // ==========================================
  // 9. UROLOGY, MEN & WOMEN'S HEALTH
  // ==========================================
  {
    id: 'ur-1',
    brandName: 'Urimax 0.4 / Flomaxtra 0.4',
    genericSalt: 'Tamsulosin Hydrochloride (0.4mg MR)',
    category: 'Gastro / Acidity',
    brandedPrice: 260,
    genericPrice: 38,
    dosage: '0.4mg',
    packSize: '15 Tablets',
    usage: 'Alpha-1 blocker relaxing bladder neck for smooth urine flow in enlarged prostate (BPH).'
  },
  {
    id: 'ur-2',
    brandName: 'Urimax-D / Dynapres-D / Telsan-D',
    genericSalt: 'Tamsulosin (0.4mg) + Dutasteride (0.5mg)',
    category: 'Gastro / Acidity',
    brandedPrice: 380,
    genericPrice: 58,
    dosage: 'Combo',
    packSize: '15 Tablets',
    usage: 'Dual therapy shrinking prostate size while immediately improving weak urine flow and night waking.'
  },
  {
    id: 'ur-3',
    brandName: 'Dutas 0.5 / Avodart 0.5',
    genericSalt: 'Dutasteride (0.5mg)',
    category: 'Gastro / Acidity',
    brandedPrice: 290,
    genericPrice: 42,
    dosage: '0.5mg',
    packSize: '15 Tablets',
    usage: '5-alpha reductase inhibitor reducing DHT hormones in prostate hyperplasia and male pattern hair loss.'
  },
  {
    id: 'ur-4',
    brandName: 'Silodal 8 / Rapaflo 8',
    genericSalt: 'Silodosin (8mg)',
    category: 'Gastro / Acidity',
    brandedPrice: 360,
    genericPrice: 54,
    dosage: '8mg',
    packSize: '10 Capsules',
    usage: 'Highly selective uro-specific blocker for severe prostate urinary hesitancy with fewer blood pressure drops.'
  },
  {
    id: 'ur-5',
    brandName: 'Manforce 50 / Caverta 50 / Revatio 50',
    genericSalt: 'Sildenafil Citrate (50mg)',
    category: 'Blood Pressure',
    brandedPrice: 180,
    genericPrice: 28,
    dosage: '50mg',
    packSize: '4 Tablets',
    usage: 'PDE-5 inhibitor improving arterial penile blood flow and treating pulmonary arterial hypertension.'
  },
  {
    id: 'ur-6',
    brandName: 'Manforce 100 / Caverta 100',
    genericSalt: 'Sildenafil Citrate (100mg)',
    category: 'Blood Pressure',
    brandedPrice: 260,
    genericPrice: 38,
    dosage: '100mg',
    packSize: '4 Tablets',
    usage: 'High strength PDE-5 blocker for erectile dysfunction and severe pelvic vascular insufficiency.'
  },
  {
    id: 'ur-7',
    brandName: 'Megalis 20 / Tadacip 20 / Cialis 20',
    genericSalt: 'Tadalafil (20mg)',
    category: 'Blood Pressure',
    brandedPrice: 290,
    genericPrice: 42,
    dosage: '20mg',
    packSize: '4 Tablets',
    usage: 'Long-acting 36-hour PDE5 inhibitor for erectile vitality and lower urinary tract symptoms.'
  },
  {
    id: 'ur-8',
    brandName: 'Megalis 5 / Tazzle 5',
    genericSalt: 'Tadalafil (5mg Daily)',
    category: 'Blood Pressure',
    brandedPrice: 240,
    genericPrice: 36,
    dosage: '5mg Daily',
    packSize: '10 Tablets',
    usage: 'Once-daily low-dose regimen treating both prostate enlargement (BPH) and sexual wellness.'
  },
  {
    id: 'ur-9',
    brandName: 'Pause 500 / Trapic 500',
    genericSalt: 'Tranexamic Acid (500mg)',
    category: 'Allergy & Asthma',
    brandedPrice: 180,
    genericPrice: 32,
    dosage: '500mg',
    packSize: '10 Tablets',
    usage: 'Antifibrinolytic stopping heavy menstrual bleeding (menorrhagia) and post-surgery hemorrhages.'
  },
  {
    id: 'ur-10',
    brandName: 'Pause-MF / Trapic-MF',
    genericSalt: 'Tranexamic Acid (500mg) + Mefenamic Acid (250mg)',
    category: 'Allergy & Asthma',
    brandedPrice: 265,
    genericPrice: 44,
    dosage: 'Combo',
    packSize: '10 Tablets',
    usage: 'First-line combination therapy immediately stopping heavy period bleeding and painful cramps.'
  },
  {
    id: 'ur-11',
    brandName: 'Primolut-N / Regestrone 5mg',
    genericSalt: 'Norethisterone (5mg)',
    category: 'Allergy & Asthma',
    brandedPrice: 110,
    genericPrice: 22,
    dosage: '5mg',
    packSize: '10 Tablets',
    usage: 'Synthetic progestin for period delay, irregular cycles, endometriosis, and dysfunctional uterine bleeding.'
  },
  {
    id: 'ur-12',
    brandName: 'Susten 200 / Gestofit 200 / Naturogest 200',
    genericSalt: 'Natural Micronized Progesterone (200mg)',
    category: 'Allergy & Asthma',
    brandedPrice: 420,
    genericPrice: 75,
    dosage: '200mg',
    packSize: '10 Softgels',
    usage: 'Luteal phase pregnancy support preventing recurrent miscarriages and supporting IVF implantation.'
  },
  {
    id: 'ur-13',
    brandName: 'Duphaston 10',
    genericSalt: 'Dydrogesterone (10mg)',
    category: 'Allergy & Asthma',
    brandedPrice: 780,
    genericPrice: 120,
    dosage: '10mg',
    packSize: '10 Tablets',
    usage: 'Retro-progesterone with high oral bioavailability treating threatened abortion and irregular periods.'
  },
  {
    id: 'ur-14',
    brandName: 'Novelon / Femilon',
    genericSalt: 'Desogestrel (0.15mg) + Ethinylestradiol (0.03mg)',
    category: 'Allergy & Asthma',
    brandedPrice: 280,
    genericPrice: 45,
    dosage: 'Low Dose Oral Contraceptive',
    packSize: '21 Tablets',
    usage: 'Reliable oral contraceptive pill regulating PCOS acne, hirsutism, and menstrual cycles.'
  },
  {
    id: 'ur-15',
    brandName: 'Fertomid 50 / Siphene 50',
    genericSalt: 'Clomiphene Citrate (50mg)',
    category: 'Allergy & Asthma',
    brandedPrice: 195,
    genericPrice: 34,
    dosage: '50mg',
    packSize: '10 Tablets',
    usage: 'Selective estrogen receptor modulator inducing ovulation in women struggling with PCOS infertility.'
  },
  {
    id: 'ur-16',
    brandName: 'Femara 2.5 / Letroz 2.5',
    genericSalt: 'Letrozole (2.5mg)',
    category: 'Allergy & Asthma',
    brandedPrice: 240,
    genericPrice: 38,
    dosage: '2.5mg',
    packSize: '5 Tablets',
    usage: 'Aromatase inhibitor stimulating robust follicle ovulation and treating estrogen-receptor positive breast health.'
  },

  // ==========================================
  // 10. DERMATOLOGY, OPHTHALMOLOGY & TOPICALS
  // ==========================================
  {
    id: 'de-1',
    brandName: 'Betnovate-N / Diprovate-Plus',
    genericSalt: 'Betamethasone (0.1%) + Neomycin (0.5%)',
    category: 'Allergy & Asthma',
    brandedPrice: 65,
    genericPrice: 14,
    dosage: '20g Tube',
    packSize: '1 Tube',
    usage: 'Topical steroid-antibiotic cream for infected eczema, dermatitis, insect stings, and itchy rashes.'
  },
  {
    id: 'de-2',
    brandName: 'Tenovate / Lobate / Powercort',
    genericSalt: 'Clobetasol Propionate (0.05% Cream)',
    category: 'Allergy & Asthma',
    brandedPrice: 135,
    genericPrice: 26,
    dosage: '30g Tube',
    packSize: '1 Tube',
    usage: 'Super-high potency topical corticosteroid for plaque psoriasis, recalcitrant eczema, and lichen planus.'
  },
  {
    id: 'de-3',
    brandName: 'Tenovate-S / Salicylix-SF',
    genericSalt: 'Clobetasol (0.05%) + Salicylic Acid (3%)',
    category: 'Allergy & Asthma',
    brandedPrice: 195,
    genericPrice: 34,
    dosage: '30g Ointment',
    packSize: '1 Tube',
    usage: 'Exfoliates hard cracked skin, thickened heel fissures, and stubborn scalp psoriasis scales.'
  },
  {
    id: 'de-4',
    brandName: 'T-Bact / Bactroban / Mupirox',
    genericSalt: 'Mupirocin (2% Ointment)',
    category: 'Allergy & Asthma',
    brandedPrice: 165,
    genericPrice: 30,
    dosage: '10g Ointment',
    packSize: '1 Tube',
    usage: 'Potent topical antibiotic healing impetigo, folliculitis, infected cuts, and MRSA skin boils.'
  },
  {
    id: 'de-5',
    brandName: 'Betadine 5% Ointment / Cipladine',
    genericSalt: 'Povidone Iodine (5% w/w Microbicidal)',
    category: 'Allergy & Asthma',
    brandedPrice: 95,
    genericPrice: 18,
    dosage: '20g Tube',
    packSize: '1 Tube',
    usage: 'Gold-standard antiseptic ointment preventing infections in open cuts, burns, wounds, and post-surgery stitches.'
  },
  {
    id: 'de-6',
    brandName: 'Silverex / Burnol Silver',
    genericSalt: 'Silver Sulfadiazine (1%) + Chlorhexidine',
    category: 'Allergy & Asthma',
    brandedPrice: 120,
    genericPrice: 22,
    dosage: '25g Tube',
    packSize: '1 Tube',
    usage: 'Broad antimicrobial cooling burn cream preventing dangerous bacterial colonization in skin burns.'
  },
  {
    id: 'de-7',
    brandName: 'Candid Cream / Canesten / Clocip',
    genericSalt: 'Clotrimazole (1% Anti-fungal)',
    category: 'Allergy & Asthma',
    brandedPrice: 95,
    genericPrice: 18,
    dosage: '30g Cream',
    packSize: '1 Tube',
    usage: 'Treats ringworm, groin sweat itch (jock itch), fungal armpit rashes, and athletes foot.'
  },
  {
    id: 'de-8',
    brandName: 'Lulifin / Lulican / Lulibet',
    genericSalt: 'Luliconazole (1% Cream)',
    category: 'Allergy & Asthma',
    brandedPrice: 290,
    genericPrice: 48,
    dosage: '20g Cream',
    packSize: '1 Tube',
    usage: 'Fastest 1-week fungal eradication cream for severe resistant tinea cruris and skin ringworm.'
  },
  {
    id: 'de-9',
    brandName: 'Nizral 2% / Ketocip / Scalpe+',
    genericSalt: 'Ketoconazole (2% Anti-dandruff Lotion)',
    category: 'Allergy & Asthma',
    brandedPrice: 280,
    genericPrice: 52,
    dosage: '100ml Bottle',
    packSize: '1 Bottle',
    usage: 'Eliminates stubborn fungal dandruff flakes, seborrheic dermatitis, and itchy scalp redness.'
  },
  {
    id: 'de-10',
    brandName: 'Scaboma / Permite / Zeroscab',
    genericSalt: 'Permethrin (5% w/w Anti-Scabies Lotion)',
    category: 'Allergy & Asthma',
    brandedPrice: 140,
    genericPrice: 25,
    dosage: '60ml Lotion',
    packSize: '1 Bottle',
    usage: 'Single overnight whole-body application eradicating scabies mites and severe itching.'
  },
  {
    id: 'de-11',
    brandName: 'Tugain 5% / Morr-F 5%',
    genericSalt: 'Minoxidil (5% Topical Solution)',
    category: 'Allergy & Asthma',
    brandedPrice: 650,
    genericPrice: 120,
    dosage: '60ml Bottle',
    packSize: '1 Bottle',
    usage: 'Stimulates scalp micro-capillary blood flow, halting androgenetic alopecia and regenerating hair follicles.'
  },
  {
    id: 'de-12',
    brandName: 'Finpecia 1mg / Propecia 1mg',
    genericSalt: 'Finasteride (1mg)',
    category: 'Allergy & Asthma',
    brandedPrice: 180,
    genericPrice: 32,
    dosage: '1mg',
    packSize: '10 Tablets',
    usage: 'Blocks 5-alpha reductase DHT conversion, stopping male hereditary crown and hairline thinning.'
  },
  {
    id: 'de-13',
    brandName: 'Refresh Tears / Tears Plus / Cellufresh',
    genericSalt: 'Carboxymethylcellulose (0.5% Eye Drops)',
    category: 'Allergy & Asthma',
    brandedPrice: 175,
    genericPrice: 30,
    dosage: '10ml Eye Drops',
    packSize: '1 Vial',
    usage: 'Preservative-free artificial tear lubricant relieving computer eye strain, dryness, and gritty burning.'
  },
  {
    id: 'de-14',
    brandName: 'Moxicip / Vigamox / Mahaflox',
    genericSalt: 'Moxifloxacin (0.5% Sterile Eye Drops)',
    category: 'Allergy & Asthma',
    brandedPrice: 185,
    genericPrice: 32,
    dosage: '5ml Eye Drops',
    packSize: '1 Vial',
    usage: 'Fourth-generation fluoroquinolone eye drop curing bacterial conjunctivitis (pink eye) & corneal ulcers.'
  },
  {
    id: 'de-15',
    brandName: 'Waxsol / Clearwax / Otorex',
    genericSalt: 'Paradichlorobenzene + Benzocaine + Chlorbutol',
    category: 'Allergy & Asthma',
    brandedPrice: 95,
    genericPrice: 18,
    dosage: '10ml Ear Drops',
    packSize: '1 Vial',
    usage: 'Gently dissolves hardened ear wax plugs without painful ear syringing.'
  }
];
