import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Info, ShieldAlert, PhoneCall, Search } from 'lucide-react';

interface Protocol {
  title: Record<string, string>;
  steps: Record<string, string[]>;
}

const emergencyProtocols: Protocol[] = [
  {
    title: {
      or: 'ହୃଦ୍‌ଘାତ (CPR ପ୍ରକ୍ରିୟା)',
      hi: 'हृदयघात (CPR प्रक्रिया)',
      en: 'Heart Attack / Cardiac Arrest (CPR)'
    },
    steps: {
      or: [
        '୧. ତୁରନ୍ତ ୧୦୮ କୁ କଲ୍ କରି ଆମ୍ବୁଲାନସ୍ ଡାକନ୍ତୁ।',
        '୨. ରୋଗୀକୁ ଚଟାଣରେ ଚିତ୍ କରି ଶୁଆଇ ଦିଅନ୍ତୁ।',
        '୩. ଆପଣଙ୍କ ହାତକୁ ରୋଗୀର ଛାତି ମଝିରେ ରଖି ଜୋର୍‌ରେ ଚାପନ୍ତୁ (୧ ମିନିଟ୍‌ରେ ୧୦୦-୧୨୦ ଥର)।',
        '୪. ପ୍ରତି ୩୦ ଥର ଚାପିବା ପରେ ୨ ଥର ମୁହଁରେ ମୁହଁ ଲଗାଇ ନିଶ୍ୱାସ ଦିଅନ୍ତୁ (ଯଦି ସମ୍ଭବ)।',
        '୫. ଆମ୍ବୁଲାନସ୍ ଆସିବା ପର୍ଯ୍ୟନ୍ତ ଏହି ପ୍ରକ୍ରିୟା ଜାରି ରଖନ୍ତୁ।'
      ],
      hi: [
        '1. तुरंत 108 नंबर पर कॉल करके एम्बुलेंस बुलाएं।',
        '2. पीड़ित को पीठ के बल सख्त सतह पर सीधा लिटाएं।',
        '3. अपनी हथेलियों को छाती के बीच में रखकर तेजी से दबाएं (1 मिनट में 100-120 बार)।',
        '4. हर 30 बार दबाने के बाद 2 बार मुंह से सांस दें (यदि प्रशिक्षित हैं)।',
        '5. एम्बुलेंस आने या होश आने तक सीपीआर जारी रखें।'
      ],
      en: [
        '1. Call 108 immediately to request an emergency ambulance.',
        '2. Place the person flat on their back on a firm, flat surface.',
        '3. Give rapid chest compressions (100-120 per minute) in the center of the chest.',
        '4. Push hard (2 inches deep) and allow the chest to rise between compressions.',
        '5. If trained, give 2 rescue breaths after every 30 compressions. Repeat until help arrives.'
      ]
    }
  },
  {
    title: {
      or: 'ସର୍ପାଘାତ (ସାପ କାମୁଡ଼ା)',
      hi: 'सर्पदंश (साँप का काटना)',
      en: 'Snakebite Emergency'
    },
    steps: {
      or: [
        '୧. ରୋଗୀକୁ ଶାନ୍ତ ରଖନ୍ତୁ ଏବଂ କୌଣସି ହଲଚଲ କରାନ୍ତୁ ନାହିଁ (ଏହା ବିଷ ବ୍ୟାପିବାକୁ ରୋକିବ)।',
        '୨. କାମୁଡ଼ିଥିବା ସ୍ଥାନରୁ ଚୁଡ଼ି, ମୁଦି କିମ୍ବା ଟାଇଟ୍ ପୋଷାକ କାଢ଼ି ଦିଅନ୍ତୁ।',
        '୩. କାମୁଡ଼ିଥିବା ସ୍ଥାନକୁ ହୃଦୟର ସ୍ତରଠାରୁ ତଳେ ରଖନ୍ତୁ।',
        '୪. କ୍ଷତ ସ୍ଥାନରେ କୌଣସି ଚିରା କିମ୍ବା ବିଷ ଶୋଷିବାକୁ ଚେଷ୍ଟା କରନ୍ତୁ ନାହିଁ।',
        '୫. ତୁରନ୍ତ ଡାକ୍ତରଖାନାକୁ ନେଇ ଆଣ୍ଟି-ଭେନମ୍ ଚିକିତ୍ସା କରନ୍ତୁ।'
      ],
      hi: [
        '1. पीड़ित को शांत रखें और हिलने-डुलने न दें ताकि जहर तेजी से न फैले।',
        '2. घाव के आसपास से अंगूठी, चूड़ी या तंग कपड़े हटा दें।',
        '3. काटे गए हिस्से को हमेशा दिल के स्तर से नीचे रखें।',
        '4. घाव को काटने, चूसने या कसकर बांधने (टूर्निकेट) की कोशिश न करें।',
        '5. तुरंत नजदीकी सरकारी अस्पताल ले जाएं, जहाँ एंटी-स्नेक वेनम उपलब्ध हो।'
      ],
      en: [
        '1. Keep the person calm and completely still to slow down venom circulation.',
        '2. Remove tight rings, bracelets, or clothing near the bite area.',
        '3. Keep the bite site positioned at or below heart level.',
        '4. Clean the wound gently but DO NOT cut, suction, or apply a tight tourniquet.',
        '5. Transport immediately to a facility equipped with anti-venom.'
      ]
    }
  },
  {
    title: {
      or: 'ପାଣିରେ ବୁଡ଼ିଯିବା',
      hi: 'डूबना (Drowning)',
      en: 'Drowning / Water Inhalation'
    },
    steps: {
      or: [
        '୧. ବ୍ୟକ୍ତିଙ୍କୁ ପାଣିରୁ ବାହାର କରି ସମତଳ ଜାଗାରେ ଶୁଆଇ ଦିଅନ୍ତୁ।',
        '୨. ମୁଣ୍ଡକୁ ପଛକୁ କରି ଥୋଡ଼ି ଟେକି ନିଶ୍ୱାସ ନେବା ପଥ ପରିଷ୍କାର କରନ୍ତୁ।',
        '୩. ଯଦି ନିଶ୍ୱାସ ନେଉନାହାନ୍ତି, ତୁରନ୍ତ ୫ଟି କୃତ୍ରିମ ଶ୍ୱାସକ୍ରିୟା ଦିଅନ୍ତୁ।',
        '୪. ତା\'ପରେ ୩୦ ଥର ଛାତି ଚାପିବା ଏବଂ ୨ ଥର ଶ୍ୱାସ ଦେବା ପ୍ରକ୍ରିୟା ଜାରି ରଖନ୍ତୁ (CPR)।',
        '୫. ରୋଗୀକୁ ଓଦା ପୋଷାକ କାଢ଼ି ଗରମ କପଡ଼ାରେ ଘୋଡ଼ାଇ ଦିଅନ୍ତୁ।'
      ],
      hi: [
        '1. व्यक्ति को पानी से बाहर निकालकर समतल स्थान पर लिटाएं।',
        '2. मुंह खोलकर जांचें कि सांस की नली में पानी, रेत या कोई कचरा न फंसा हो।',
        '3. यदि व्यक्ति सांस नहीं ले रहा है, तो 5 बार मुंह से सांस (Rescue Breaths) दें।',
        '4. इसके बाद तुरंत छाती दबाने की सीपीआर (CPR) प्रक्रिया शुरू करें।',
        '5. गीले कपड़े बदलकर व्यक्ति को गर्म कंबल से ढकें।'
      ],
      en: [
        '1. Remove the person from water safely and lay them on a flat surface.',
        '2. Check for responsiveness. Tilt the head back and lift the chin to open the airway.',
        '3. If not breathing, start with 5 initial rescue breaths to ventilate the lungs.',
        '4. Begin CPR immediately: alternate 30 chest compressions with 2 rescue breaths.',
        '5. Remove wet clothes and cover the person with warm blankets to prevent hypothermia.'
      ]
    }
  },
  {
    title: {
      or: 'ଶ୍ୱାସରୁଦ୍ଧ (Choking)',
      hi: 'दम घुटना / गला रुंधना (Choking)',
      en: 'Choking / Airway Obstruction'
    },
    steps: {
      or: [
        '୧. ପିଠିରେ ୫ ଥର ହାତ ପାପୁଲିରେ ଜୋର୍‌ରେ ଥାପୁଡ଼ାନ୍ତୁ।',
        '୨. ଯଦି ବନ୍ଦ ବସ୍ତୁ ବାହାରୁ ନାହିଁ, ବ୍ୟକ୍ତିଙ୍କ ପଛରେ ଠିଆ ହୁଅନ୍ତୁ।',
        '୩. ତାଙ୍କ ପେଟ ମଝିରେ ମୁଠା କରି ଦୁଇ ହାତରେ ଜୋର୍‌ରେ ପଛ ଓ ଉପରକୁ ଟାଣନ୍ତୁ (Heimlich Maneuver - ୫ ଥର)।',
        '୪. ଏହି ଦୁଇଟି ପ୍ରକ୍ରିୟାକୁ ପର୍ଯ୍ୟାୟକ୍ରମେ ଦୋହରାନ୍ତୁ।',
        '୫. ଯଦି ରୋଗୀ ଅଚେତ ହୋଇଯାନ୍ତି, ତୁରନ୍ତ ଚେଷ୍ଟ ପ୍ରେସର (CPR) ଆରମ୍ଭ କରନ୍ତୁ।'
      ],
      hi: [
        '1. व्यक्ति के पीछे खड़े होकर उसे थोड़ा आगे झुकाएं और पीठ के बीच 5 बार थपथपाएं।',
        '2. यदि कचरा न निकले, तो व्यक्ति की कमर को पीछे से बाहों में जकड़ें।',
        '3. नाभि के ठीक ऊपर मुट्ठी रखकर ऊपर की ओर 5 बार झटका दें (Heimlich Maneuver)।',
        '4. पीठ थपथपाने और पेट दबाने की प्रक्रिया को बारी-बारी से दोहराएं।',
        '5. यदि व्यक्ति बेहोश हो जाए, तो तुरंत नीचे लिटाकर सीपीआर शुरू करें।'
      ],
      en: [
        '1. Give 5 sharp back blows between the shoulder blades with the heel of your hand.',
        '2. If the blockage is not dislodged, stand behind the person and wrap your arms around their waist.',
        '3. Perform the Heimlich Maneuver: place a fist above the navel and pull inward and upward quickly (5 times).',
        '4. Alternate 5 back blows with 5 abdominal thrusts until the blockage clears.',
        '5. If the person loses consciousness, perform standard chest compressions (CPR).'
      ]
    }
  }
];

const FirstAidGuide: React.FC = () => {
  const { language, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProtocols = emergencyProtocols.filter(proto => {
    const title = proto.title[language] || proto.title['en'];
    return title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Top Banner and Call Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-rose-500/10 border border-rose-500/20 p-6 rounded-2xl">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold font-heading text-rose-700 dark:text-rose-400">
            {t('tracker.firstaid.title')}
          </h1>
          <p className="text-muted-foreground text-sm">
            Localized step-by-step emergency instructions.
          </p>
        </div>

        <a
          href="tel:108"
          className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 shadow-lg shadow-rose-500/20 transition-all touch-target"
        >
          <PhoneCall className="w-5 h-5 animate-bounce" />
          <span>Call Ambulance (108)</span>
        </a>
      </div>

      {/* Search bar */}
      <div className="relative max-w-md">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-foreground pointer-events-none">
          <Search className="w-4 h-4" />
        </span>
        <input
          type="text"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
          placeholder="Search emergency protocols (e.g., CPR, snakebite)..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Protocols checklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProtocols.length === 0 ? (
          <div className="col-span-full py-12 text-center text-muted-foreground text-sm font-semibold">
            No emergency instructions matches found.
          </div>
        ) : (
          filteredProtocols.map((proto, idx) => (
            <div key={idx} className="bg-card border border-border rounded-2xl p-6 shadow-sm glass flex flex-col justify-between">
              <div>
                <h3 className="font-heading font-bold text-lg text-rose-600 dark:text-rose-400 mb-4 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 shrink-0" />
                  <span>{proto.title[language] || proto.title['en']}</span>
                </h3>

                <div className="space-y-3 mb-6">
                  {(proto.steps[language] || proto.steps['en']).map((step, sIdx) => (
                    <p key={sIdx} className="text-xs text-muted-foreground leading-relaxed pl-1 font-medium">
                      {step}
                    </p>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-rose-500/5 rounded-xl text-[10px] text-rose-800 dark:text-rose-400 font-semibold text-center border border-rose-500/10">
                Action alert: Do not delay call to emergency ambulance services (108 / 112).
              </div>
            </div>
          ))
        )}
      </div>

      {/* Guidelines info */}
      <div className="p-4 bg-muted/40 border border-border rounded-xl flex gap-3 text-xs leading-relaxed text-muted-foreground">
        <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-foreground block mb-1">Emergency Medical Action:</span>
          First Aid represents emergency stabilization procedures executed before professional paramedic support arrives. Ensure safety of bystanders, avoid transferring critical neck injuries without stabilization, and call 108 or national emergency line 112 as the very first step.
        </div>
      </div>
    </div>
  );
};

export default FirstAidGuide;
