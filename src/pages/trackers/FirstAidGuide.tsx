import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

import { Info, ShieldAlert, PhoneCall, Search, ChevronDown, X, AlertTriangle, Send, Bot, RefreshCw } from 'lucide-react';

interface Protocol {
  title: Record<string, string>;
  steps: Record<string, string[]>;
}

const emergencyProtocols: Protocol[] = [
  {
    title: {
      or: 'ହୃଦ୍ଘାତ (CPR ପ୍ରକ୍ରିୟା)',
      hi: 'हृदयघात (CPR प्रक्रिया)',
      en: 'Heart Attack / Cardiac Arrest (CPR)'
    },
    steps: {
      or: [
        '୧. ତୁରନ୍ତ ୧୦୮ କୁ କଲ୍ କରି ଆମ୍ବୁଲାନସ୍ ଡାକନ୍ତୁ।',
        '୨. ରୋଗୀକୁ ଚଟାଣରେ ଚିତ୍ କରି ଶୁଆଇ ଦିଅନ୍ତୁ।',
        '୩. ଆପଣଙ୍କ ହାତକୁ ରୋଗୀର ଛାତି ମଝିରେ ରଖି ଜୋର୍ରେ ଚାପନ୍ତୁ (୧ ମିନିଟ୍ରେ ୧୦୦-୧୨୦ ଥର)।',
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
        '୧. ପିଠିରେ ୫ ଥର ହାତ ପାପୁଲିରେ ଜୋର୍ରେ ଥାପୁଡ଼ାନ୍ତୁ।',
        '୨. ଯଦି ବନ୍ଦ ବସ୍ତୁ ବାହାରୁ ନାହିଁ, ବ୍ୟକ୍ତିଙ୍କ ପଛରେ ଠିଆ ହୁଅନ୍ତୁ।',
        '୩. ତାଙ୍କ ପେଟ ମଝିରେ ମୁଠା କରି ଦୁଇ ହାତରେ ଜୋର୍ରେ ପଛ ଓ ଉପରକୁ ଟାଣନ୍ତୁ (Heimlich Maneuver - ୫ ଥର)।',
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
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchEmergency, setSearchEmergency] = useState('');
  const [aiFirstAid, setAiFirstAid] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleGetAiFirstAid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchEmergency.trim()) return;

    setIsAiLoading(true);
    setAiFirstAid('');
    
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("Missing VITE_GEMINI_API_KEY in .env");
      }

      const systemPrompt = `ROLE: First Aid & Emergency Assistant; Context: Initial Emergency Stabilization; Language: en
You provide IMMEDIATE, step-by-step first aid instructions for emergencies before professional help arrives.
CRITICAL INSTRUCTION: ALWAYS begin your response by advising the user to call an ambulance (108/112 in India) if the situation is life-threatening.
Structure your response as follows:
(1) Immediate Action (Call ambulance if needed)
(2) Step-by-step stabilization instructions (Max 4-5 steps)
(3) What NOT to do
Keep it concise, calm, and actionable. Do NOT diagnose.`;
      
      const userMessage = `Emergency situation: ${searchEmergency}. Please provide immediate first aid steps.`;

      const response = await fetch(
        `https://api.groq.com/openai/v1/chat/completions`,
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userMessage }
            ]
          })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Groq API Error Response:", response.status, errorText);
        throw new Error(`Groq API call failed: ${response.status}`);
      }
      
      const data = await response.json();
      const responseText = data.choices?.[0]?.message?.content || 'No suggestion received.';
      
      let index = 0;
      const interval = setInterval(() => {
        setAiFirstAid(prev => prev + responseText.charAt(index));
        index++;
        if (index >= responseText.length) {
          clearInterval(interval);
          setIsAiLoading(false);
        }
      }, 10);
      
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("VITE_GEMINI_API_KEY")) {
         setAiFirstAid('⚠️ Missing API Key.\n\nPlease add VITE_GEMINI_API_KEY=your_key_here to your .env file to enable AI suggestions.');
      } else {
         setAiFirstAid('⚠️ AI Service Unavailable.\n\nPlease refer to the general emergency protocols below.');
      }
      setIsAiLoading(false);
    }
  };

  const filteredProtocols = emergencyProtocols.filter(proto => {
    const title = proto.title[language] || proto.title['en'];
    return title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const toggleExpand = (idx: number) => {
    setExpandedIdx(expandedIdx === idx ? null : idx);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">

      {/* Top Banner and Call Button */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-br from-rose-500/15 via-rose-500/10 to-transparent border border-rose-500/20 p-6 rounded-2xl overflow-hidden"
      >
        {/* Ambient pulse background */}
        <motion.div
          className="absolute -top-16 -right-16 w-40 h-40 bg-rose-500/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <AlertTriangle className="w-6 h-6 text-rose-600 dark:text-rose-400" />
            </motion.div>
            <h1 className="text-3xl font-bold font-heading text-rose-700 dark:text-rose-400">
              {t('tracker.firstaid.title')}
            </h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Localized step-by-step emergency instructions.
          </p>
        </div>

        <motion.a
          href="tel:108"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          className="relative z-10 bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 shadow-lg shadow-rose-500/30 transition-colors touch-target overflow-hidden group"
        >
          <motion.span
            className="absolute inset-0 bg-white/20"
            initial={{ x: '-100%' }}
            whileHover={{ x: '100%' }}
            transition={{ duration: 0.6 }}
          />
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            <PhoneCall className="w-5 h-5" />
          </motion.div>
          <span className="relative">Call Ambulance (108)</span>
        </motion.a>
      </motion.div>

      {/* AI Emergency Search */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm glass space-y-4">
        <h3 className="font-heading font-bold text-lg text-foreground flex items-center gap-2 border-b border-border/40 pb-3">
          <Bot className="w-5 h-5 text-rose-500" />
          <span>Ask AI for Custom Emergency First Aid</span>
        </h3>

        <form onSubmit={handleGetAiFirstAid} className="flex gap-2">
          <input
            type="text"
            placeholder="Describe the emergency (e.g., swallowed a coin, severe burn)..."
            className="flex-1 p-2.5 rounded-xl border border-border bg-background/50 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none transition-all text-sm input-accent-glow"
            value={searchEmergency}
            onChange={(e) => setSearchEmergency(e.target.value)}
          />
          <button
            type="submit"
            disabled={isAiLoading || !searchEmergency.trim()}
            className="bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold px-4 rounded-xl text-sm flex items-center gap-2 transition-all shadow-sm"
          >
            {isAiLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span className="hidden sm:inline">Get Help</span>
          </button>
        </form>

        <AnimatePresence>
          {(isAiLoading || aiFirstAid) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 border border-border/60 bg-muted/20 rounded-xl overflow-hidden"
            >
              <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap text-foreground font-sans">
                {aiFirstAid}
                {isAiLoading && !aiFirstAid && <span className="animate-pulse text-muted-foreground">Generating custom first aid plan...</span>}
                {isAiLoading && aiFirstAid && <span className="inline-block w-1.5 h-4 bg-rose-500 animate-pulse ml-0.5 align-middle" />}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Search bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="relative max-w-md"
      >
        <motion.div
          animate={{
            color: isSearchFocused ? 'rgb(244 63 94)' : undefined,
            scale: isSearchFocused ? 1.1 : 1
          }}
          className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-foreground pointer-events-none"
        >
          <Search className="w-4 h-4" />
        </motion.div>
        <input
          type="text"
          className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-border bg-card/50 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none transition-all text-sm"
          placeholder="Search emergency protocols (e.g., CPR, snakebite)..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
        />
        <AnimatePresence>
          {searchTerm && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-rose-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Protocols checklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredProtocols.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="col-span-full py-12 text-center text-muted-foreground text-sm font-semibold"
            >
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                No emergency instructions matches found.
              </motion.div>
            </motion.div>
          ) : (
            filteredProtocols.map((proto, idx) => {
              const isExpanded = expandedIdx === idx;
              const steps = proto.steps[language] || proto.steps['en'];
              const visibleSteps = isExpanded ? steps : steps.slice(0, 3);

              return (
                <motion.div
                  key={proto.title.en}
                  layout
                  initial={{ opacity: 0, y: 24, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: idx * 0.06, ease: 'easeOut' }}
                  whileHover={{ y: -4 }}
                  className="bg-card border border-border rounded-2xl p-6 shadow-sm glass flex flex-col justify-between relative overflow-hidden group"
                >
                  {/* Hover glow */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between gap-2 mb-4">
                      <h3 className="font-heading font-bold text-lg text-rose-600 dark:text-rose-400 flex items-center gap-2">
                        <motion.div
                          whileHover={{ rotate: [0, -15, 15, 0] }}
                          transition={{ duration: 0.4 }}
                        >
                          <ShieldAlert className="w-5 h-5 shrink-0" />
                        </motion.div>
                        <span>{proto.title[language] || proto.title['en']}</span>
                      </h3>
                    </div>

                    <div className="space-y-2.5 mb-4">
                      <AnimatePresence initial={false}>
                        {visibleSteps.map((step, sIdx) => (
                          <motion.div
                            key={sIdx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.25, delay: sIdx * 0.05 }}
                            className="flex gap-2"
                          >
                            <motion.span
                              className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5"
                              animate={{ scale: [1, 1.3, 1] }}
                              transition={{ duration: 2, repeat: Infinity, delay: sIdx * 0.2 }}
                            />
                            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                              {step}
                            </p>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>

                    {steps.length > 3 && (
                      <motion.button
                        onClick={() => toggleExpand(idx)}
                        whileTap={{ scale: 0.97 }}
                        className="flex items-center gap-1 text-xs font-semibold text-rose-500 hover:text-rose-600 mb-4 transition-colors"
                      >
                        <span>{isExpanded ? 'Show less' : `Show ${steps.length - 3} more steps`}</span>
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </motion.div>
                      </motion.button>
                    )}
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-3 bg-rose-500/5 rounded-xl text-[10px] text-rose-800 dark:text-rose-400 font-semibold text-center border border-rose-500/10 relative z-10"
                  >
                    Action alert: Do not delay call to emergency ambulance services (108 / 112).
                  </motion.div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Guidelines info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="p-4 bg-muted/40 border border-border rounded-xl flex gap-3 text-xs leading-relaxed text-muted-foreground"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
        >
          <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        </motion.div>
        <div>
          <span className="font-bold text-foreground block mb-1">Emergency Medical Action:</span>
          First Aid represents emergency stabilization procedures executed before professional paramedic support arrives. Ensure safety of bystanders, avoid transferring critical neck injuries without stabilization, and call 108 or national emergency line 112 as the very first step.
        </div>
      </motion.div>
    </div>
  );
};

export default FirstAidGuide;
