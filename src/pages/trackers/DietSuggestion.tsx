import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { useHealthDispatch } from '../../context/HealthDispatchContext';
import { supabase } from '../../integrations/supabase/client';
import {
  Info, Calculator, Utensils, Sparkles, CheckCircle, TrendingUp,
  Scale, Ruler, ChevronRight, Leaf, Sun, Waves, Mountain, Send, Bot, RefreshCw
} from 'lucide-react';
import { showToast } from '../../utils/toast';

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const regionalDiets = [
  {
    region: 'North India',
    sub: 'उत्तर भारत',
    icon: Mountain,
    accent: '#f97316',
    meals: [
      { type: 'Breakfast', menu: 'Stuffed Missi Roti (chana flour) or Oatmeal with almonds & milk' },
      { type: 'Lunch', menu: 'Dal Tadka, Mixed vegetable sabzi, Roti (whole wheat or multigrain), Curd' },
      { type: 'Dinner', menu: 'Lauki (bottle gourd) sabzi, Paneer bhurji, Roti or bowl of Brown Rice' }
    ]
  },
  {
    region: 'South India',
    sub: 'दक्षिण भारत',
    icon: Leaf,
    accent: '#10b981',
    meals: [
      { type: 'Breakfast', menu: 'Ragi Idli with coconut chutney or Vegetable Upma (semolina)' },
      { type: 'Lunch', menu: 'Sambar, Rasam, Beetroot Poriyal, Boiled Red Rice, Buttermilk' },
      { type: 'Dinner', menu: 'Cabbage Kootu, Roasted Bengal Gram curry, small bowl of Rice or multigrain chapati' }
    ]
  },
  {
    region: 'East India',
    sub: 'पूर्व भारत — Odisha & Bengal',
    icon: Waves,
    accent: '#06b6d4',
    meals: [
      { type: 'Breakfast', menu: 'Chuda Santula (poha with vegetables) or Suji Halwa with low sugar' },
      { type: 'Lunch', menu: 'Dalma (lentils with papaya, brinjal), boiled rice, saga bhaja (leafy greens)' },
      { type: 'Dinner', menu: 'Potala (pointed gourd) curry, grilled fish (optional) or paneer, chapati' }
    ]
  },
  {
    region: 'West India',
    sub: 'पश्चिम भारत',
    icon: Sun,
    accent: '#f59e0b',
    meals: [
      { type: 'Breakfast', menu: 'Methi Thepla with curd or Sprouted Moong Usal' },
      { type: 'Lunch', menu: 'Gujarati/Rajasthani Kadhi, Bajra Rotla, Bhindi (okra) masala' },
      { type: 'Dinner', menu: 'Khichdi (moong dal and rice) with ghee, roasted Papad, cucumber salad' }
    ]
  },
  {
    region: 'Maharashtra',
    sub: 'महाराष्ट्र',
    icon: Sun,
    accent: '#d97706',
    meals: [
      { type: 'Breakfast', menu: 'Poha with peanuts or Thalipeeth with curd' },
      { type: 'Lunch', menu: 'Jowar Bhakri, Pitla, Bharli Vangi (stuffed eggplant), Solkadhi' },
      { type: 'Dinner', menu: 'Varan Bhaat (dal rice) with ghee, Koshimbir (salad)' }
    ]
  },
  {
    region: 'Punjab',
    sub: 'ਪੰਜਾਬ / पंजाब',
    icon: Mountain,
    accent: '#eab308',
    meals: [
      { type: 'Breakfast', menu: 'Stuffed Gobi Paratha with fresh curd (no butter)' },
      { type: 'Lunch', menu: 'Sarson ka Saag, Makki ki Roti, Salad, Lassi' },
      { type: 'Dinner', menu: 'Rajma or Dal Makhani (lightly cooked), Jeera Rice, Phulka' }
    ]
  },
  {
    region: 'Kerala',
    sub: 'കേരളം',
    icon: Waves,
    accent: '#14b8a6',
    meals: [
      { type: 'Breakfast', menu: 'Puttu with Kadala Curry or Appam with Veg Stew' },
      { type: 'Lunch', menu: 'Kerala Matta Rice, Fish Curry, Avial, Cabbage Thoran' },
      { type: 'Dinner', menu: 'Kanji (rice gruel) with green gram or Chapati with Veg Kurma' }
    ]
  },
  {
    region: 'Tamil Nadu',
    sub: 'தமிழ்நாடு',
    icon: Leaf,
    accent: '#84cc16',
    meals: [
      { type: 'Breakfast', menu: 'Pongal with Sambar or Idli with Mint Chutney' },
      { type: 'Lunch', menu: 'Rice, Keerai Masiyal (spinach), Vatha Kuzhambu, Poriyal' },
      { type: 'Dinner', menu: 'Dosa or Idiyappam with vegetable stew' }
    ]
  },
  {
    region: 'Karnataka',
    sub: 'ಕರ್ನಾಟಕ',
    icon: Sun,
    accent: '#f59e0b',
    meals: [
      { type: 'Breakfast', menu: 'Bisi Bele Bath or Neer Dosa with coconut chutney' },
      { type: 'Lunch', menu: 'Ragi Mudde, Bassaru (greens and lentil curry), Palya' },
      { type: 'Dinner', menu: 'Jolada Rotti (Sorghum) with Yennegai (stuffed eggplant)' }
    ]
  },
  {
    region: 'Andhra Pradesh',
    sub: 'ఆంధ్రప్రదేశ్',
    icon: Mountain,
    accent: '#ef4444',
    meals: [
      { type: 'Breakfast', menu: 'Pesarattu (moong dal dosa) with Upma' },
      { type: 'Lunch', menu: 'Rice, Gongura Pachadi, Pappu (Dal), Tomato Rasam' },
      { type: 'Dinner', menu: 'Chapati or Rice with Gutti Vankaya Kura' }
    ]
  },
  {
    region: 'Telangana',
    sub: 'తెలంగాణ',
    icon: Leaf,
    accent: '#f97316',
    meals: [
      { type: 'Breakfast', menu: 'Sarva Pindi or Jowar Roti' },
      { type: 'Lunch', menu: 'Rice, Bachali Kura, Pachi Pulusu, Vepudu (fry)' },
      { type: 'Dinner', menu: 'Sajja Roti (Pearl millet) with Chicken or Soya curry' }
    ]
  },
  {
    region: 'Gujarat',
    sub: 'ગુજરાત',
    icon: Sun,
    accent: '#eab308',
    meals: [
      { type: 'Breakfast', menu: 'Khaman Dhokla or Khandvi with green chutney' },
      { type: 'Lunch', menu: 'Dal Dhokli, Undhiyu, Bajra Rotla, Chaas' },
      { type: 'Dinner', menu: 'Khichdi, Kadhi, Ringan no Olo (mashed eggplant)' }
    ]
  },
  {
    region: 'Rajasthan',
    sub: 'राजस्थान',
    icon: Mountain,
    accent: '#c2410c',
    meals: [
      { type: 'Breakfast', menu: 'Poha or Moong Dal Cheela' },
      { type: 'Lunch', menu: 'Dal Bati Churma (baked, less ghee), Gatte ki Sabzi' },
      { type: 'Dinner', menu: 'Missi Roti with Panchmel Dal and Ker Sangri' }
    ]
  },
  {
    region: 'Bihar',
    sub: 'बिहार',
    icon: Leaf,
    accent: '#65a30d',
    meals: [
      { type: 'Breakfast', menu: 'Sattu Paratha or Chura Matar' },
      { type: 'Lunch', menu: 'Litti Chokha (roasted, not fried), Dal, Rice' },
      { type: 'Dinner', menu: 'Roti with Nenua (sponge gourd) Sabzi or Fish curry' }
    ]
  },
  {
    region: 'Assam',
    sub: 'অসম',
    icon: Waves,
    accent: '#10b981',
    meals: [
      { type: 'Breakfast', menu: 'Jolpan (Flattened rice with curd and jaggery)' },
      { type: 'Lunch', menu: 'Rice, Masor Tenga (sour fish curry), Khar, Dhekia Saak' },
      { type: 'Dinner', menu: 'Roti with Aloo Pitika (mashed potatoes) and Dal' }
    ]
  },
  {
    region: 'Kashmir',
    sub: 'کشمیر / कश्मीर',
    icon: Mountain,
    accent: '#06b6d4',
    meals: [
      { type: 'Breakfast', menu: 'Noon Chai (Pink Tea) with Girda (Kashmiri bread)' },
      { type: 'Lunch', menu: 'Rice, Haak Saag, Nadru (lotus stem) Yakhni' },
      { type: 'Dinner', menu: 'Roti with Dum Aloo or Rajma' }
    ]
  },
  {
    region: 'Goa',
    sub: 'गोंय',
    icon: Waves,
    accent: '#0ea5e9',
    meals: [
      { type: 'Breakfast', menu: 'Poha or Sanna with coconut chutney' },
      { type: 'Lunch', menu: 'Goan Fish Curry, Ukada (parboiled) Rice, Solkadhi' },
      { type: 'Dinner', menu: 'Chapati with Khatkhate (mixed vegetable stew)' }
    ]
  },
  {
    region: 'Chhattisgarh',
    sub: 'छत्तीसगढ़',
    icon: Leaf,
    accent: '#22c55e',
    meals: [
      { type: 'Breakfast', menu: 'Muthia (steamed dumplings) or Chila (rice flour crepe)' },
      { type: 'Lunch', menu: 'Rice, Dubki Kadi, Kochai Patta (Taro leaves) curry' },
      { type: 'Dinner', menu: 'Roti with Lal Bhaji (red spinach) and Dal' }
    ]
  },
  {
    region: 'Madhya Pradesh',
    sub: 'मध्य प्रदेश',
    icon: Sun,
    accent: '#d97706',
    meals: [
      { type: 'Breakfast', menu: 'Poha Jalebi (keep jalebi limited for sugar) or Sabudana Khichdi' },
      { type: 'Lunch', menu: 'Dal Bafla (baked), Bhutta ka Kees, Rice' },
      { type: 'Dinner', menu: 'Roti with Palak Paneer or Mixed veg sabzi' }
    ]
  }
];

const homeRemedies = [
  { concern: 'Indigestion / Gas', remedy: 'Jeera (cumin) water. Boil 1 spoon of cumin in water, cool and drink after meals.' },
  { concern: 'Sore Throat / Cold', remedy: 'Ginger, black pepper and honey mixture. Take 1 spoon twice daily.' },
  { concern: 'Joint Pain / Soreness', remedy: 'Apply warm sesame oil infused with garlic or consume ginger tea.' },
  { concern: 'Fatigue / Low Energy', remedy: 'Soak 5 almonds overnight and eat in the morning with warm milk.' }
];

const bmiRanges = [
  { label: 'Underweight', max: 18.5, color: '#f59e0b' },
  { label: 'Normal', max: 24.9, color: '#10b981' },
  { label: 'Overweight', max: 29.9, color: '#f97316' },
  { label: 'Obese', max: 100, color: '#f43f5e' }
];

const getBmiStatus = (val: number) => {
  const found = bmiRanges.find(r => val < r.max) || bmiRanges[bmiRanges.length - 1];
  return found;
};

// ---------------------------------------------------------------------------
// Animation Variants
// ---------------------------------------------------------------------------

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring' as const, stiffness: 280, damping: 24 } }
};

// ---------------------------------------------------------------------------
// Animated Number
// ---------------------------------------------------------------------------

const AnimatedNumber: React.FC<{ value: number }> = ({ value }) => {
  const mv = useMotionValue(0);
  const [display, setDisplay] = useState('0.0');

  React.useEffect(() => {
    const controls = animate(mv, value, {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: v => setDisplay(v.toFixed(1))
    });
    return () => controls.stop();
  }, [value, mv]);

  return <span>{display}</span>;
};

// ---------------------------------------------------------------------------
// BMI Gauge
// ---------------------------------------------------------------------------

const BmiGauge: React.FC<{ bmi: number; color: string }> = ({ bmi, color }) => {
  const pct = Math.min(bmi / 40, 1);
  const circumference = 2 * Math.PI * 54;
  return (
    <div className="relative w-32 h-32 mx-auto">
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
        <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="10" className="text-muted/20" />
        <motion.circle
          cx="60" cy="60" r="54" fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - pct) }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          key={bmi}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.3 }}
          className="text-2xl font-extrabold font-number"
          style={{ color }}
        >
          <AnimatedNumber value={bmi} />
        </motion.div>
        <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold mt-0.5">
          BMI Score
        </span>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

const DietSuggestion: React.FC = () => {
  const { t } = useLanguage();
  const { logDiet } = useHealthDispatch();

  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(170);
  const [bmi, setBmi] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);
  const [searchState, setSearchState] = useState('');
  const [aiDiet, setAiDiet] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleGetAiDiet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchState.trim()) return;

    setIsAiLoading(true);
    setAiDiet('');
    
    try {
      const { data, error } = await supabase.functions.invoke('diet-suggestion', {
        body: { state: searchState, lang: 'en' }
      });
      if (error) throw error;
      
      let index = 0;
      const responseText = data?.suggestion || 'No suggestion received.';
      const interval = setInterval(() => {
        setAiDiet(prev => prev + responseText.charAt(index));
        index++;
        if (index >= responseText.length) {
          clearInterval(interval);
          setIsAiLoading(false);
        }
      }, 10);
      
    } catch (err) {
      console.error(err);
      setAiDiet('⚠️ AI Service Unavailable.\n\nPlease refer to the general regional diets below.');
      setIsAiLoading(false);
    }
  };

  const calculateBmi = () => {
    const heightM = height / 100;
    const bmiVal = weight / (heightM * heightM);
    setBmi(Number(bmiVal.toFixed(1)));
    setSaved(false);
    showToast('BMI Score Calculated!', 'info');
  };

  const handleSaveLog = () => {
    if (bmi === null) return;
    logDiet(weight, height, bmi);
    setSaved(true);
    showToast(
      navigator.onLine
        ? `Saved BMI of ${bmi} to health logs successfully!`
        : `Vitals saved locally. Will sync online soon!`,
      'success'
    );
  };

  const status = bmi !== null ? getBmiStatus(bmi) : null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-up-staggered">
      <div>
        <h1 className="text-3xl font-bold font-heading text-foreground">{t('tracker.diet.title')}</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Calculate BMI and explore balanced regional Indian diet schedules.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* BMI Calculator (5 cols) — CARD UNCHANGED, CONTENT REDESIGNED */}
        <div className="lg:col-span-5 bg-card border border-border rounded-2xl p-6 shadow-sm glass space-y-6">
          <h3 className="font-heading font-bold text-lg text-foreground flex items-center gap-2 border-b border-border pb-3">
            <Calculator className="w-5 h-5 text-primary" />
            <span>BMI Calculator</span>
          </h3>

          <motion.div initial="hidden" animate="show" variants={containerVariants} className="space-y-4">
            <motion.div variants={itemVariants}>
              <label className="flex items-center gap-1.5 text-xs font-semibold mb-1.5 text-muted-foreground" htmlFor="bmiWeight">
                <Scale className="w-3.5 h-3.5" /> Weight (kg)
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                id="bmiWeight"
                type="number"
                inputMode="numeric"
                className="w-full p-2.5 rounded-lg border border-border bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm input-accent-glow font-number"
                value={weight}
                onChange={e => setWeight(Number(e.target.value))}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="flex items-center gap-1.5 text-xs font-semibold mb-1.5 text-muted-foreground" htmlFor="bmiHeight">
                <Ruler className="w-3.5 h-3.5" /> Height (cm)
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                id="bmiHeight"
                type="number"
                inputMode="numeric"
                className="w-full p-2.5 rounded-lg border border-border bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm input-accent-glow font-number"
                value={height}
                onChange={e => setHeight(Number(e.target.value))}
              />
            </motion.div>

            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={calculateBmi}
              className="w-full bg-primary hover:bg-primary/95 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md touch-target relative overflow-hidden"
            >
              <motion.span
                className="absolute inset-0 bg-white/15"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />
              <TrendingUp className="w-4 h-4" />
              <span>Calculate BMI</span>
            </motion.button>
          </motion.div>

          <AnimatePresence mode="wait">
            {bmi !== null && status && (
              <motion.div
                key="result"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                className="p-4 border border-border bg-muted/30 rounded-xl text-center space-y-3 overflow-hidden"
              >
                <BmiGauge bmi={bmi} color={status.color} />

                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                  style={{ background: `${status.color}18`, color: status.color }}
                >
                  {status.label}
                </motion.div>

                <p className="text-[10px] text-muted-foreground leading-relaxed pt-1.5 border-t border-border/40 font-medium">
                  Standard range: Underweight (&lt;18.5), Normal (18.5–24.9), Overweight (25–29.9), Obese (&gt;30).
                </p>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleSaveLog}
                  disabled={saved}
                  className={`w-full font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm touch-target transition-colors ${
                    saved ? 'bg-emerald-500/20 text-emerald-600' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  <motion.span animate={saved ? { scale: [1, 1.3, 1] } : {}} transition={{ duration: 0.4 }}>
                    <CheckCircle className="w-4 h-4" />
                  </motion.span>
                  <span>{saved ? 'Saved to Health Logs' : 'Save to Health Logs'}</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Diet Guidelines (7 cols) */}
        <div className="lg:col-span-7 space-y-6">

          {/* AI Custom Diet Request */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm glass space-y-4">
            <h3 className="font-heading font-bold text-lg text-foreground flex items-center gap-2 border-b border-border/40 pb-3">
              <Bot className="w-5 h-5 text-indigo-500" />
              <span>Ask AI for State-Specific Diet</span>
            </h3>

            <form onSubmit={handleGetAiDiet} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter a state (e.g., Punjab, Kerala)..."
                className="flex-1 p-2.5 rounded-xl border border-border bg-background/50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm input-accent-glow"
                value={searchState}
                onChange={(e) => setSearchState(e.target.value)}
              />
              <button
                type="submit"
                disabled={isAiLoading || !searchState.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold px-4 rounded-xl text-sm flex items-center gap-2 transition-all shadow-sm"
              >
                {isAiLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span className="hidden sm:inline">Get Diet</span>
              </button>
            </form>

            <AnimatePresence>
              {(isAiLoading || aiDiet) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 p-4 border border-border/60 bg-muted/20 rounded-xl overflow-hidden"
                >
                  <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap text-foreground font-sans">
                    {aiDiet}
                    {isAiLoading && !aiDiet && <span className="animate-pulse text-muted-foreground">Generating custom diet plan...</span>}
                    {isAiLoading && aiDiet && <span className="inline-block w-1.5 h-4 bg-indigo-500 animate-pulse ml-0.5 align-middle" />}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Regional Diet Schedules — CARD UNCHANGED, CONTENT REDESIGNED */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm glass space-y-6">
            <h3 className="font-heading font-bold text-lg text-foreground flex items-center gap-2 border-b border-border/40 pb-3">
              <Utensils className="w-5 h-5 text-amber-500" />
              <span>Balanced Regional Indian Diets</span>
            </h3>

            <motion.div
              initial="hidden"
              animate="show"
              variants={containerVariants}
              className="space-y-4 max-h-[400px] overflow-y-auto pr-1 custom-scroll"
            >
              {regionalDiets.map((reg, idx) => {
                const Icon = reg.icon;
                return (
                  <motion.div
                    key={idx}
                    variants={itemVariants}
                    className="relative rounded-2xl p-4 border overflow-hidden"
                    style={{
                      borderColor: `${reg.accent}30`,
                      background: `linear-gradient(135deg, ${reg.accent}08, transparent 60%)`
                    }}
                  >
                    <div className="flex items-center gap-3 pb-3 mb-3 border-b border-border/30">
                      <motion.div
                        whileHover={{ rotate: 12, scale: 1.1 }}
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: `${reg.accent}18` }}
                      >
                        <Icon className="w-4.5 h-4.5" style={{ color: reg.accent }} />
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-extrabold text-foreground truncate">{reg.region}</h4>
                        <p className="text-[10px] text-muted-foreground font-medium truncate">{reg.sub}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {reg.meals.map((m, mIdx) => (
                        <motion.div
                          key={mIdx}
                          whileHover={{ y: -4, scale: 1.02 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                          className="relative bg-card/60 backdrop-blur-md border border-border/50 rounded-xl p-3 flex flex-col gap-1 shadow-sm overflow-hidden group cursor-default"
                        >
                          <div className="absolute top-0 left-0 h-full w-0.5 opacity-70" style={{ background: reg.accent }} />
                          <motion.div
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            style={{ background: `radial-gradient(circle at 30% 20%, ${reg.accent}12, transparent 70%)` }}
                          />
                          <span className="text-[9px] font-bold uppercase tracking-wider relative z-10" style={{ color: reg.accent }}>
                            {m.type}
                          </span>
                          <p className="text-xs text-foreground font-semibold leading-relaxed relative z-10">
                            {m.menu}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Traditional Home Remedies — CARD UNCHANGED, CONTENT REDESIGNED */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm glass space-y-4">
            <h3 className="font-heading font-bold text-lg text-foreground flex items-center gap-2 border-b border-border/40 pb-3">
              <Sparkles className="w-5 h-5 text-teal-500" />
              <span>Traditional AYUSH Home Remedies</span>
            </h3>

            <motion.div
              initial="hidden"
              animate="show"
              variants={containerVariants}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {homeRemedies.map((rem, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  whileHover={{ y: -3, borderColor: 'rgba(20,184,166,0.4)' }}
                  className="p-3 border border-border/60 bg-muted/20 rounded-xl relative overflow-hidden group"
                >
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: 'radial-gradient(circle at 20% 20%, rgba(20,184,166,0.08), transparent 70%)' }}
                  />
                  <span className="text-xs font-extrabold text-foreground flex items-center gap-1.5 mb-1 relative z-10">
                    <ChevronRight className="w-3.5 h-3.5 text-teal-500" />
                    {rem.concern}
                  </span>
                  <p className="text-[11px] leading-relaxed text-muted-foreground font-medium relative z-10">
                    {rem.remedy}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>

        </div>

      </div>

      {/* Guidelines info — untouched */}
      <div className="p-4 bg-muted/40 border border-border rounded-xl flex gap-3 text-xs leading-relaxed text-muted-foreground">
        <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-foreground block mb-1">Nutrition Protocol Guide:</span>
          A healthy diet provides critical macronutrients and micronutrients that defend against metabolic cardiovascular disease (like type-2 diabetes, hypertension, and hyperlipidemia). Regional diets focus on whole grains, high-fiber lentils, and fresh local vegetables while reducing refined flour (maida), saturated fats, and high sodium index inputs.
        </div>
      </div>
    </div>
  );
};

export default DietSuggestion;
