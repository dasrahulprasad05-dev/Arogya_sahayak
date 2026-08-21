import { supabase } from '../integrations/supabase/client';
import type { Language } from '../context/LanguageContext';

export interface StructuredResponse {
  content: string;
  confidence: number;
  recommendations: string[];
  warnings: string[];
  sources: string[];
  followUp?: string;
  emergency_sos: boolean;
  specialist?: string;
}

// ── Medical Rule Matrix for Offline / High Reliability ───────
interface ClinicalTopic {
  keywords: string[];
  specialist: string;
  emergency: boolean;
  en: {
    summary: string;
    recs: string[];
    warnings: string[];
  };
  hi: {
    summary: string;
    recs: string[];
    warnings: string[];
  };
  or: {
    summary: string;
    recs: string[];
    warnings: string[];
  };
}

const CLINICAL_TOPICS: ClinicalTopic[] = [
  // 1. Eye / Vision
  {
    keywords: ['eye', 'vision', 'blind', 'cornea', 'cataract', 'glaucoma', 'conjunctiv', 'आंख', 'दृष्टि', 'ଆଖି', 'ଦୃଷ୍ଟି'],
    specialist: 'Ophthalmologist',
    emergency: false,
    en: {
      summary: 'Eye discomfort or pain can indicate dry eyes, conjunctivitis (eye infection), corneal abrasion, digital strain, or increased intraocular pressure.',
      recs: [
        'Rest eyes and follow 20-20-20 rule (look 20 feet away for 20 seconds every 20 minutes)',
        'Apply a clean, warm compress over closed eyelids for 5-10 minutes',
        'Use preservative-free lubricating artificial tears if prescribed',
        'Avoid rubbing your eyes or wearing contact lenses until examined'
      ],
      warnings: [
        'Sudden loss or blurring of vision',
        'Severe throbbing pain with nausea or halos around lights',
        'Green or yellow pus discharge with extreme redness'
      ]
    },
    hi: {
      summary: 'आंखों में दर्द या जलन ड्राई आई, नेत्र संक्रमण (कंजंक्टिवाइटिस), कॉर्नियल खरोंच या स्क्रीन स्ट्रेन के कारण हो सकती है।',
      recs: [
        'आंखों को आराम दें और 20-20-20 नियम का पालन करें',
        'बंद आंखों पर साफ गर्म कपड़े से हल्की सिकाई करें',
        'आंखों को बिल्कुल न रगड़ें और कॉन्टैक्ट लेंस न पहनें',
        'बिना डॉक्टर की सलाह के कोई आई ड्रॉप न डालें'
      ],
      warnings: [
        'अचानक दृष्टि कम होना या धुंधलापन',
        'तेज दर्द के साथ उल्टी या रोशनी के चारों ओर घेरे दिखना',
        'आंखों से पीला/हरा मवाद आना'
      ]
    },
    or: {
      summary: 'ଆଖି ବିନ୍ଧା ବା ଯନ୍ତ୍ରଣା ଆଖି ଶୁଷ୍କତା, ସଂକ୍ରମଣ (ଆଖି ଧରିବା), ଧୂଳି ପଡ଼ିବା କିମ୍ବା ଅତ୍ୟଧିକ ସ୍କ୍ରିନ୍ ଦେଖିବା ଯୋଗୁଁ ହୋଇପାରେ।',
      recs: [
        'ଆଖିକୁ ବିଶ୍ରାମ ଦିଅନ୍ତୁ ଏବଂ ୨୦ ମିନିଟ୍ ଅନ୍ତରରେ ଦୂରକୁ ଚାହାଁନ୍ତୁ',
        'ପରିଷ୍କାର ଉଷୁମ ପାଣିରେ କନା ଭିଜାଇ ଆଖି ଉପରେ ହାଲୁକା ସେକ ଦିଅନ୍ତୁ',
        'ଆଖିକୁ ଆଦୌ ଘସନ୍ତୁ ନାହିଁ ଏବଂ ଲେନ୍ସ ବ୍ୟବହାର ବନ୍ଦ କରନ୍ତୁ',
        'ଡାକ୍ତରଙ୍କ ବିନା ପରାମର୍ଶରେ ଆଖିରେ ଔଷଧ ପକାନ୍ତୁ ନାହିଁ'
      ],
      warnings: [
        'ହଠାତ୍ ଦୃଷ୍ଟିଶକ୍ତି ହ୍ରାସ ପାଇବା ବା ଝାପ୍ସା ଦେଖାଯିବା',
        'ତୀବ୍ର ଯନ୍ତ୍ରଣା ସହ ବାନ୍ତି କିମ୍ବା ଆଲୋକ ଚାରିପାଖେ ବଳୟ ଦେଖାଯିବା',
        'ଆଖିରୁ ହଳଦିଆ ବା ସବୁଜ ପୂଜ ବାହାରିବା'
      ]
    }
  },

  // 2. Stomach / Belly / Abdomen / Gastric
  {
    keywords: ['belly', 'stomach', 'abdomen', 'gastric', 'acidity', 'cramp', 'digest', 'vomit', 'diarrhea', 'पेट', 'गैस', 'एसिडिटी', 'दस्त', 'उल्टी', 'ପେଟ', 'ଗ୍ୟାସ', 'ବାନ୍ତି', 'ଝାଡା'],
    specialist: 'Gastroenterologist',
    emergency: false,
    en: {
      summary: 'Abdominal pain may stem from gastritis, hyperacidity, indigestion, food poisoning, gastroenteritis, or gallstones.',
      recs: [
        'Eat light meals (khichdi, curd rice, plain toast) and avoid oily/spicy foods',
        'Sip warm water, coconut water, or ORS solution to maintain hydration',
        'Use a hot water bag on the abdomen for muscle relaxation',
        'Avoid taking painkiller NSAIDs (like Brufen) which can irritate stomach lining'
      ],
      warnings: [
        'Severe acute pain localized in right lower abdomen (possible appendicitis)',
        'Vomiting blood or passing black, tarry stools',
        'High persistent fever with severe abdominal rigidity'
      ]
    },
    hi: {
      summary: 'पेट दर्द या मरोड़ गैस्ट्राइटिस, एसिडिटी, अपच, फूड पॉइजनिंग या आंतों के संक्रमण के कारण हो सकता है।',
      recs: [
        'हल्का और सुपाच्य भोजन लें (जैसे मूंग दाल खिचड़ी, दही चावल)',
        'पर्याप्त पानी, ओआरएस (ORS) और नारियल पानी पिएं',
        'पेट पर गर्म पानी की थैली से सिकाई करें',
        'बिना डॉक्टर की सलाह के पेनकिलर दवाएं न खाएं'
      ],
      warnings: [
        'पेट के निचले दाहिने हिस्से में असहनीय तेज दर्द',
        'उल्टी में खून आना या काले रंग का मल होना',
        'तेज बुखार के साथ पेट का कड़ा हो जाना'
      ]
    },
    or: {
      summary: 'ପେଟ ବିନ୍ଧା ବା ଯନ୍ତ୍ରଣା ଗ୍ୟାସ, ଅଜୀର୍ଣ୍ଣ, ଏସିଡିଟି, ଫୁଡ୍ ପଏଜନିଂ କିମ୍ବା ପେଟ ସଂକ୍ରମଣ ଯୋଗୁଁ ହୋଇପାରେ।',
      recs: [
        'ହାଲୁକା ଖାଦ୍ୟ ଖାଆନ୍ତୁ (ଯଥା: ମୁଗ ଡାଲି ଖେଚୁଡ଼ି, ଦହି ଭାତ) ଏବଂ ତେଲ ମସଲା ବାରଣ କରନ୍ତୁ',
        'ପର୍ଯ୍ୟାପ୍ତ ଓଆରଏସ (ORS), ଡାବ ପାଣି ଏବଂ ଉଷୁମ ପାଣି ପିଅନ୍ତୁ',
        'ପେଟ ଉପରେ ହାଲୁକା ଉଷୁମ ପାଣି ବ୍ୟାଗ ସେକ ଦିଅନ୍ତୁ',
        'ଡାକ୍ତରଙ୍କ ବିନା ପରାମର୍ଶରେ ପେନକିଲର ଔଷଧ ଖାଆନ୍ତୁ ନାହିଁ'
      ],
      warnings: [
        'ପେଟର ଡାହାଣ ପାର୍ଶ୍ୱ ତଳେ ଅସହ୍ୟ ଯନ୍ତ୍ରଣା (ଆପେଣ୍ଡିସାଇଟିସ ସଙ୍କେତ)',
        'ବାନ୍ତିରେ ରକ୍ତ ପଡ଼ିବା କିମ୍ବା କଳା ଝାଡ଼ା ହେବା',
        'ପେଟ ଟାଣ ହୋଇ ପ୍ରବଳ ଜ୍ୱର ହେବା'
      ]
    }
  },

  // 3. Chest Pain / Cardiac (EMERGENCY)
  {
    keywords: ['chest', 'heart', 'palpitation', 'angina', 'breathless', 'छाती', 'दिल', 'ଧଡ଼ପଡ଼', 'ଛାତି'],
    specialist: 'Cardiologist',
    emergency: true,
    en: {
      summary: 'CRITICAL: Chest discomfort or pressure requires immediate medical assessment to rule out acute cardiac conditions (angina/myocardial infarction).',
      recs: [
        'Sit down immediately in a comfortable, relaxed position and do not exert yourself',
        'Loosen tight clothing around neck and chest',
        'If prescribed Sorbitrate / Aspirin by your doctor, take as directed',
        'Call 108 Emergency ambulance or reach nearest hospital emergency room immediately'
      ],
      warnings: [
        'Chest pain radiating to left arm, jaw, shoulder, or back',
        'Associated sweating, breathlessness, dizziness, or nausea',
        'Crushing sensation like heavy weight on chest lasting over 5 minutes'
      ]
    },
    hi: {
      summary: 'गंभीर चेतावनी: छाती में दर्द या भारीपन दिल के दौरे (हार्ट अटैक) या एंजाइना का संकेत हो सकता है। तुरंत डॉक्टर से संपर्क करें।',
      recs: [
        'तुरंत शांत होकर बैठ जाएं, किसी भी तरह की शारीरिक मेहनत न करें',
        'गले और सीने के टाइट कपड़े ढीले कर दें',
        'यदि डॉक्टर द्वारा पूर्व-निर्धारित दवा हो तो तुरंत लें',
        'तुरंत 108 एम्बुलेंस बुलाएं या नजदीकी अस्पताल के इमरजेंसी वार्ड में जाएं'
      ],
      warnings: [
        'दर्द का बाएं हाथ, जबड़े, कंधे या पीठ की ओर फैलना',
        'दर्द के साथ अत्यधिक पसीना, घबराहट या सांस फूलना',
        'छाती पर भारी वजन महसूस होना जो 5 मिनट से ज्यादा रहे'
      ]
    },
    or: {
      summary: 'ଜରୁରୀ ସତର୍କତା: ଛାତିରେ ଯନ୍ତ୍ରଣା ବା ଚାପ ହୃଦଘାତ (Heart Attack) ର ଲକ୍ଷଣ ହୋଇପାରେ। ତୁରନ୍ତ ଡାକ୍ତରୀ ଚିକିତ୍ସା ନିଅନ୍ତୁ।',
      recs: [
        'ତୁରନ୍ତ ଶାନ୍ତ ଭାବେ ବସନ୍ତୁ ଏବଂ କୌଣସି ପରିଶ୍ରମ କରନ୍ତୁ ନାହିଁ',
        'ଛାତି ଓ ବେକର ଚିପା ପୋଷାକ ଢିଲା କରନ୍ତୁ',
        'ପୂର୍ବରୁ ଡାକ୍ତର ଦେଇଥିବା ଜରୁରୀ ହୃଦରୋଗ ଔଷଧ ଥିଲେ ନିଅନ୍ତୁ',
        'ତୁରନ୍ତ ୧୦୮ କଲ୍ କରି ଆମ୍ବୁଲାନ୍ସ ଡାକନ୍ତୁ ବା ହସ୍ପିଟାଲ ଜରୁରୀ ବିଭାଗକୁ ଯାଆନ୍ତୁ'
      ],
      warnings: [
        'ଯନ୍ତ୍ରଣା ବାମ ହାତ, ବେକ, କାନ୍ଧ ବା ପିଠିକୁ ବ୍ୟାପିବା',
        'ଅତ୍ୟଧିକ ଝାଳ ବୋହିବା, ନିଶ୍ୱାସ ନେବାରେ କଷ୍ଟ ଓ ମୁଣ୍ଡ ଘୁରାଇବା',
        'ଛାତି ଉପରେ ଭାରୀ ପଥର ଥୁଆ ହେଲା ଭଳି ଅନୁଭବ ହେବା'
      ]
    }
  },

  // 4. Fever / Chills / Dengue / Malaria
  {
    keywords: ['fever', 'shiver', 'chill', 'dengue', 'malaria', 'typhoid', 'temp', 'बुखार', 'ठंड', 'डेंगू', 'मलेरिया', 'ଜ୍ୱର', 'ଥଣ୍ଡା', 'ଡେଙ୍ଗୁ', 'ମ୍ୟାଲେରିଆ'],
    specialist: 'General Physician',
    emergency: false,
    en: {
      summary: 'Fever indicates your immune system is combating an infection, common with viral influenza, dengue, malaria, or bacterial illness.',
      recs: [
        'Take Paracetamol (500mg/650mg) as per medical advice for fever relief',
        'Apply room-temperature damp cloth sponge to forehead and neck',
        'Drink plenty of fluids (boiled water, ORS, fresh fruit juices)',
        'Get a Complete Blood Count (CBC) and Dengue/Malaria test if fever persists > 48 hours'
      ],
      warnings: [
        'Temperature exceeding 103°F (39.5°C) not responding to paracetamol',
        'Bleeding from gums/nose or red spots on skin (Dengue warning signs)',
        'Extreme lethargy, confusion, or stiff neck'
      ]
    },
    hi: {
      summary: 'बुखार शरीर में संक्रमण (वायरल, डेंगू, मलेरिया या टाइफाइड) से लड़ने की स्वाभाविक प्रतिक्रिया है।',
      recs: [
        'डॉक्टर के बताए अनुसार पैरासिटामोल लें और पूरा आराम करें',
        'माथे और गर्दन पर सामान्य पानी की ठंडी पट्टी रखें',
        'खूब पानी, ओआरएस (ORS) और नारियल पानी पिएं',
        '48 घंटे से अधिक बुखार रहने पर सीबीसी (CBC) और डेंगू जांच कराएं'
      ],
      warnings: [
        '103°F से अधिक तेज बुखार जो दवा से न उतरे',
        'मसूड़ों/नाक से खून आना या त्वचा पर लाल चकत्ते',
        'अत्यधिक कमजोरी, बेहोशी या गर्दन में अकड़न'
      ]
    },
    or: {
      summary: 'ଜ୍ୱର ହେଉଛି ଶରୀର ଭିତରେ ଭାଇରାଲ, ଡେଙ୍ଗୁ, ମ୍ୟାଲେରିଆ ବା ଜୀବାଣୁ ସଂକ୍ରମଣ ବିରୁଦ୍ଧରେ ରୋଗ ପ୍ରତିରୋଧକ ଶକ୍ତିର ଲଢ଼େଇ।',
      recs: [
        'ଡାକ୍ତରଙ୍କ ପରାମର୍ଶ ଅନୁସାରେ ପାରାସିଟାମଲ୍ ଖାଆନ୍ତୁ ଓ ବିଶ୍ରାମ ନିଅନ୍ତୁ',
        'ମୁଣ୍ଡ ଓ ବେକରେ ସାଧାରଣ ପାଣି ପଟି ପକାନ୍ତୁ',
        'ପ୍ରଚୁର ପାଣି, ଲେମ୍ବୁ ପାଣି, ଓଆରଏସ (ORS) ଓ ତରଳ ଖାଦ୍ୟ ପିଅନ୍ତୁ',
        '୨ ଦିନରୁ ଅଧିକ ଜ୍ୱର ରହିଲେ CBC ଏବଂ ଡେଙ୍ଗୁ/ମ୍ୟାଲେରିଆ ରକ୍ତ ପରୀକ୍ଷା କରାନ୍ତୁ'
      ],
      warnings: [
        '୧୦୩°F ରୁ ଅଧିକ ତେଜ ଜ୍ୱର ଯାହା କମୁନାହିଁ',
        'ନାକ ବା ମାଢ଼ିରୁ ରକ୍ତ ପଡ଼ିବା କିମ୍ବା ଚମଡ଼ାରେ ଲାଲ ଚିହ୍ନ',
        'ଅତ୍ୟଧିକ ଦୁର୍ବଳତା, ବେହୋସ ହେବା କିମ୍ବା ବେକ ଟାଣ ଲାଗିବା'
      ]
    }
  },

  // 5. Headache / Migraine
  {
    keywords: ['headache', 'migraine', 'head pain', 'dizziness', 'सिरदर्द', 'माइग्रेन', 'चक्कर', 'ମୁଣ୍ଡ', 'ମାଇଗ୍ରେନ'],
    specialist: 'Neurologist',
    emergency: false,
    en: {
      summary: 'Headaches are commonly caused by tension, dehydration, sleep deprivation, sinus congestion, or migraine attacks.',
      recs: [
        'Rest in a quiet, dark room with cool eye mask or temple massage',
        'Drink 2-3 glasses of water immediately to resolve dehydration',
        'Avoid bright screens, loud noises, and skipped meals',
        'Apply balm or take mild analgesic if approved by doctor'
      ],
      warnings: [
        'Sudden explosive "thunderclap" headache (worst headache of life)',
        'Headache accompanied by slurred speech, arm weakness, or facial droop (stroke warning)',
        'Headache after head trauma or with persistent vomiting and stiff neck'
      ]
    },
    hi: {
      summary: 'सिरदर्द आमतौर पर तनाव, पानी की कमी, नींद पूरी न होने, साइनस या माइग्रेन के कारण होता है।',
      recs: [
        'शांत और अंधेरे कमरे में आराम करें और आंखों को बंद रखें',
        'तुरंत 2-3 गिलास पानी पिएं ताकि डिहाइड्रेशन दूर हो',
        'मोबाइल और लैपटॉप स्क्रीन से दूर रहें',
        'माथे पर बाम लगाएं या डॉक्टर की सलाह से दवा लें'
      ],
      warnings: [
        'बिजली के झटके जैसा अचानक असहनीय तेज सिरदर्द',
        'सिरदर्द के साथ बोलने में लड़खड़ाहट या हाथ-पैर में कमजोरी',
        'सिर में चोट लगने के बाद लगातार सिरदर्द और उल्टी'
      ]
    },
    or: {
      summary: 'ମୁଣ୍ଡ ବିନ୍ଧା ସାଧାରଣତଃ ମାନସିକ ଚାପ, ନିଦ ଅଭାବ, ଡିହାଇଡ୍ରେସନ, ସାଇନସ କିମ୍ବା ମାଇଗ୍ରେନ ଯୋଗୁଁ ହୋଇଥାଏ।',
      recs: [
        'ଶାନ୍ତ ଓ ଅନ୍ଧାର କୋଠରୀରେ ବିଶ୍ରାମ ନିଅନ୍ତୁ',
        'ତୁରନ୍ତ ୨-୩ ଗ୍ଲାସ ପାଣି ପିଅନ୍ତୁ',
        'ମୋବାଇଲ ଓ ଟିଭି ସ୍କ୍ରିନ ଦେଖିବା ବନ୍ଦ କରନ୍ତୁ',
        'ମୁଣ୍ଡରେ ତେଲ ବା ବାମ୍ ମାଲିସ୍ କରନ୍ତୁ'
      ],
      warnings: [
        'ହଠାତ୍ ପ୍ରଚଣ୍ଡ ବିସ୍ଫୋରକ ମୁଣ୍ଡ ବିନ୍ଧା ହେବା',
        'ମୁଣ୍ଡ ବିନ୍ଧା ସହ କଥା କହିବାରେ ଅସୁବିଧା ବା ଗୋଟିଏ ପାଖ ଦୁର୍ବଳ ଲାଗିବା',
        'ମୁଣ୍ଡରେ ଆଘାତ ପରେ ଲଗାତାର ବାନ୍ତି ଓ ଯନ୍ତ୍ରଣା'
      ]
    }
  },

  // 6. Diabetes / Sugar
  {
    keywords: ['diabetes', 'sugar', 'glucose', 'insulin', 'मधुमेह', 'शुगर', 'ଡାଇବେଟିସ', 'ଚିନି'],
    specialist: 'Endocrinologist',
    emergency: false,
    en: {
      summary: 'Diabetes management requires continuous monitoring of blood glucose levels, a balanced low-glycemic index diet, and regular physical activity.',
      recs: [
        'Incorporate whole grains (millets/ragi/oats), green leafy vegetables, and high fiber',
        'Walk briskly for 30-45 minutes daily to improve insulin sensitivity',
        'Check fasting and post-prandial blood sugar regularly and log values',
        'Take prescribed antidiabetic medications at consistent daily timings'
      ],
      warnings: [
        'Symptoms of hypoglycemia: sudden cold sweating, shaking, extreme hunger, or confusion (take 15g sugar/juice immediately)',
        'Fasting blood glucose consistently above 250 mg/dL',
        'Non-healing foot ulcers or blisters'
      ]
    },
    hi: {
      summary: 'डायबिटीज (शुगर) को नियंत्रित रखने के लिए सही खानपान, नियमित व्यायाम और दवा का सही समय पर सेवन जरूरी है।',
      recs: [
        'भोजन में बाजरा, रागी, हरी सब्जियां और फाइबर युक्त आहार शामिल करें',
        'रोजाना 30-40 मिनट तेज चाल से टहलें',
        'नियमित रूप से फास्टिंग और खाने के बाद की शुगर चेक करें',
        'डॉक्टर द्वारा बताई गई दवाइयां नियमित रूप से लें'
      ],
      warnings: [
        'शुगर अचानक कम होने के लक्षण: कंपकंपी, पसीना, चक्कर (तुरंत ग्लूकोज या मीठा लें)',
        'शुगर का स्तर 250 mg/dL से ऊपर बना रहना',
        'पैरों में कोई ऐसा घाव जो जल्दी न भर रहा हो'
      ]
    },
    or: {
      summary: 'ଡାଇବେଟିସ୍ (ମଧୁମେହ) ନିୟନ୍ତ୍ରଣ ପାଇଁ ଉଚିତ୍ ଖାଦ୍ୟପେୟ, ନିୟମିତ ଚାଲିବା ଏବଂ ସମୟ ଅନୁଯାୟୀ ଔଷଧ ସେବନ ଅତ୍ୟନ୍ତ ଜରୁରୀ।',
      recs: [
        'ଖାଦ୍ୟରେ ମାଣ୍ଡିଆ (Ragi), ଓଟ୍ସ, ଶାଗ ଓ ପନିପରିବା ଅଧିକ ବ୍ୟବହାର କରନ୍ତୁ',
        'ପ୍ରତିଦିନ ସକାଳେ ୩୦-୪୦ ମିନିଟ୍ ଚାଲନ୍ତୁ',
        'ନିୟମିତ ଭାବେ ରକ୍ତ ଶର୍କରା (Sugar) ପରୀକ୍ଷା କରାନ୍ତୁ',
        'ଡାକ୍ତରଙ୍କ ନିର୍ଦ୍ଦେଶ ଅନୁସାରେ ଔଷଧ ନିୟମିତ ଖାଆନ୍ତୁ'
      ],
      warnings: [
        'ହଠାତ୍ ସୁଗାର କମିବା ଲକ୍ଷଣ: ଝାଳ ବୋହିବା, ଥରିବା, ମୁଣ୍ଡ ବୁଲାଇବା (ତୁରନ୍ତ ମିଠା ଖାଆନ୍ତୁ)',
        'ସୁଗାର ୨୫୦ ରୁ ଅଧିକ ରହିବା',
        'ଗୋଡ଼ରେ ଘା\' ହୋଇ ଶୁଖୁନଥିବା'
      ]
    }
  }
];

// Fallback dynamic generator for unmatched queries
function generateKeywordFallback(query: string, language: Language): StructuredResponse {
  const qLower = query.toLowerCase();
  
  // Find matching clinical topic
  const match = CLINICAL_TOPICS.find(topic => 
    topic.keywords.some(k => qLower.includes(k.toLowerCase()))
  );

  if (match) {
    const data = match[language] || match.en;
    return {
      content: data.summary,
      confidence: 0.92,
      recommendations: data.recs,
      warnings: data.warnings,
      sources: ['Arogya Sahayak Clinical Knowledge Engine', 'ICMR / WHO Clinical Protocols'],
      followUp: language === 'or' ? 'ଆପଣ କ\'ଣ ବିଶେଷଜ୍ଞ ଡାକ୍ତରଙ୍କ ସହ ପରାମର୍ଶ କରିବାକୁ ଚାହାଁନ୍ତି?' : language === 'hi' ? 'क्या आप विशेषज्ञ डॉक्टर से परामर्श करना चाहते हैं?' : 'Would you like to book an appointment with a specialist?',
      emergency_sos: match.emergency,
      specialist: match.specialist
    };
  }

  // Generic dynamic fallback
  return {
    content: language === 'or'
      ? `ଆପଣଙ୍କର ପ୍ରଶ୍ନ "${query}" ସମ୍ବନ୍ଧରେ: ଏହା ଏକ ସ୍ୱାସ୍ଥ୍ୟ ସମସ୍ୟା ହୋଇପାରେ। ସଠିକ ନିରୂପଣ ଓ ଚିକିତ୍ସା ପାଇଁ ଜଣେ ଯୋଗ୍ୟ ଡାକ୍ତରଙ୍କ ପରାମର୍ଶ ନିଅନ୍ତୁ।`
      : language === 'hi'
      ? `आपके सवाल "${query}" के संबंध में: कृपया उचित जांच और उपचार के लिए एक योग्य डॉक्टर से परामर्श लें।`
      : `Regarding "${query}": For proper clinical evaluation and diagnosis, please consult a verified healthcare professional.`,
    confidence: 0.82,
    recommendations: [
      language === 'or' ? 'ପର୍ଯ୍ୟାପ୍ତ ବିଶ୍ରାମ ଓ ସୁପାଚ୍ୟ ଖାଦ୍ୟ ଖାଆନ୍ତୁ।' : language === 'hi' ? 'पर्याप्त आराम करें और सुपाच्य भोजन लें।' : 'Ensure adequate rest and stay hydrated.',
      language === 'or' ? 'ବିନା ଡାକ୍ତରୀ ପରାମର୍ଶରେ ଔଷଧ ସେବନ କରନ୍ତୁ ନାହିଁ।' : language === 'hi' ? 'बिना डॉक्टर की सलाह के दवा न लें।' : 'Avoid self-medication without professional advice.',
      language === 'or' ? 'ନିକଟସ୍ଥ PHC ବା CHC ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ରକୁ ଯାଆନ୍ତୁ।' : language === 'hi' ? 'नजदीकी स्वास्थ्य केंद्र (PHC/CHC) जाएं।' : 'Visit your nearest Community Health Center.'
    ],
    warnings: [
      language === 'or' ? 'ଲକ୍ଷଣ ବୃଦ୍ଧି ପାଇଲେ ତୁରନ୍ତ ଡାକ୍ତରଙ୍କୁ ଦେଖାନ୍ତୁ।' : language === 'hi' ? 'लक्षण बिगड़ने पर तुरंत डॉक्टर से मिलें।' : 'Seek urgent medical attention if symptoms worsen.',
      language === 'or' ? 'ଜରୁରୀ ପରିସ୍ଥିତିରେ ୧୦୮ କୁ କଲ୍ କରନ୍ତୁ।' : language === 'hi' ? 'आपातकाल में 108 डायल करें।' : 'In case of emergency, dial 108 / 112 immediately.'
    ],
    sources: ['Arogya Sahayak Public Health Database'],
    followUp: language === 'or' ? 'ଡାକ୍ତର ଖୋଜିବାକୁ ଚାହାଁନ୍ତି?' : language === 'hi' ? 'डॉक्टर खोजना चाहते हैं?' : 'Would you like to find nearby doctors?',
    emergency_sos: false,
    specialist: 'General Physician'
  };
}

/**
 * Multi-Tiered AI Clinical Assessment Service
 */
export async function getClinicalAssessment(query: string, language: Language): Promise<StructuredResponse> {
  const groqKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GROQ_API_KEY;

  // ── Tier 1: Direct Groq Cloud AI Engine (Ultra-Fast) ────────
  if (groqKey) {
    try {
      const languageName = language === 'or' ? 'Odia (ଓଡ଼ିଆ)' : language === 'hi' ? 'Hindi (हिंदी)' : 'English';
      
      const systemPrompt = `You are Arogya Sahayak, an advanced clinical AI health assistant for Indian healthcare.
CRITICAL INSTRUCTION: Analyze the patient's specific health concern and return a STRICT, VALID JSON object only.
Language required: ${languageName}.
All text in 'content', 'recommendations', 'warnings', and 'followUp' MUST be naturally written in ${languageName}.

CRITICAL FORMATTING REQUIREMENT: In 'content', NEVER output a long continuous paragraph. You MUST write 3 to 4 crisp, pointwise bullet items separated by newlines (each starting with a bullet symbol '•'). 
Example:
• Likely Causes: [Brief explanation of potential triggers]
• Clinical Mechanism: [Briefly what happens in the body]
• What You Should Do: [Clear, immediate guidance]

JSON Schema:
{
  "content": "• Likely Causes: [point 1]\n• What is happening: [point 2]\n• What you should do: [point 3] in ${languageName}",
  "confidence": 0.92,
  "recommendations": ["Actionable safe home remedy 1", "Actionable safe home remedy 2", "Actionable safe home remedy 3"],
  "warnings": ["Specific red flag symptom 1", "Specific red flag symptom 2"],
  "sources": ["ICMR Clinical Guidelines", "AIIMS Protocol"],
  "emergency_sos": false,
  "specialist": "Ophthalmologist | Cardiologist | Gastroenterologist | Neurologist | General Physician | Dermatologist | Orthopedic | Gynecologist",
  "followUp": "Helpful question asking if they want to book this specialist in ${languageName}"
}`;

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-20b',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Patient concern: ${query}` }
          ]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const rawContent = data.choices?.[0]?.message?.content || '';
        
        // Strip markdown blocks if any
        const cleaned = rawContent
          .replace(/^```json\s*/i, '')
          .replace(/^```\s*/i, '')
          .replace(/\s*```$/i, '')
          .trim();

        const parsed = JSON.parse(cleaned);
        if (parsed.content && Array.isArray(parsed.recommendations)) {
          return {
            content: parsed.content,
            confidence: parsed.confidence || 0.90,
            recommendations: parsed.recommendations,
            warnings: parsed.warnings || ['Consult a doctor if symptoms persist.'],
            sources: parsed.sources || ['Arogya Sahayak AI Clinical Model', 'ICMR'],
            emergency_sos: parsed.emergency_sos || false,
            specialist: parsed.specialist || 'General Physician',
            followUp: parsed.followUp
          };
        }
      }
    } catch (e) {
      console.warn('Groq AI API error, falling back to next tier...', e);
    }
  }

  // ── Tier 2: Supabase Edge Function ──────────────────────────
  try {
    const { data, error } = await supabase.functions.invoke('symptom-checker', {
      body: { symptoms: [query], notes: query, lang: language }
    });

    if (!error && data) {
      const advisory = data.advisory || data.response || data.message;
      if (advisory && !advisory.includes('Possible causes: Mild viral infection')) {
        return {
          content: advisory,
          confidence: data.confidence || 0.88,
          recommendations: data.recommendations || [
            language === 'or' ? 'ପର୍ଯ୍ୟାପ୍ତ ବିଶ୍ରାମ ଓ ପାଣି ପିଅନ୍ତୁ।' : language === 'hi' ? 'पर्याप्त आराम करें और पानी पिएं।' : 'Ensure adequate rest and stay hydrated.'
          ],
          warnings: data.warnings || [
            language === 'or' ? 'ଲକ୍ଷଣ ବଢ଼ିଲେ ଡାକ୍ତରଙ୍କୁ ଦେଖାନ୍ତୁ।' : language === 'hi' ? 'लक्षण बिगड़ने पर डॉक्टर से मिलें।' : 'Consult a doctor if symptoms worsen.'
          ],
          sources: data.sources || ['Supabase Clinical Engine'],
          emergency_sos: data.emergency_alert || false,
          specialist: data.recommended_specialist || 'General Physician'
        };
      }
    }
  } catch (e) {
    console.warn('Supabase edge function unreachable, using local clinical knowledge base...');
  }

  // ── Tier 3: Deep Offline Clinical Rule Engine ───────────────
  return generateKeywordFallback(query, language);
}
