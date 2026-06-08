import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useHealthDispatch } from '../../context/HealthDispatchContext';
import { Info, Calculator, Utensils, Sparkles, CheckCircle } from 'lucide-react';
import { showToast } from '../../utils/toast';

const regionalDiets = [
  {
    region: 'North India (ଉତ୍ତର ଭାରତ / उत्तर भारत)',
    meals: [
      { type: 'Breakfast', menu: 'Stuffed Missi Roti (chana flour) or Oatmeal with almonds & milk' },
      { type: 'Lunch', menu: 'Dal Tadka, Mixed vegetable sabzi, Roti (whole wheat or multigrain), Curd' },
      { type: 'Dinner', menu: 'Lauki (bottle gourd) sabzi, Paneer bhurji, Roti or bowl of Brown Rice' }
    ]
  },
  {
    region: 'South India (ଦକ୍ଷିଣ ଭାରତ / दक्षिण भारत)',
    meals: [
      { type: 'Breakfast', menu: 'Ragi Idli with coconut chutney or Vegetable Upma (semolina)' },
      { type: 'Lunch', menu: 'Sambar, Rasam, Beetroot Poriyal, Boiled Red Rice, Buttermilk' },
      { type: 'Dinner', menu: 'Cabbage Kootu, Roasted Bengal Gram curry, small bowl of Rice or multigrain chapati' }
    ]
  },
  {
    region: 'East India (ପୂର୍ବ ଭାରତ / पूर्व भारत - Odisha & Bengal)',
    meals: [
      { type: 'Breakfast', menu: 'Chuda Santula (poha with vegetables) or Suji Halwa with low sugar' },
      { type: 'Lunch', menu: 'Dalma (lentils cooked with vegetables like papaya, brinjal), boiled rice, saga bhaja (leafy greens)' },
      { type: 'Dinner', menu: 'Potala (pointed gourd) curry, grilled fish (optional) or paneer, chapati' }
    ]
  },
  {
    region: 'West India (ପଶ୍ଚିମ ଭାରତ / पश्चिम भारत)',
    meals: [
      { type: 'Breakfast', menu: 'Methi Thepla with curd or Sprouted Moong Usal' },
      { type: 'Lunch', menu: 'Gujarati/Rajasthani Kadhi, Bajra Rotla, Bhindi (okra) masala' },
      { type: 'Dinner', menu: 'Khichdi (moong dal and rice) with ghee, roasted Papad, cucumber salad' }
    ]
  }
];

const homeRemedies = [
  { concern: 'Indigestion / Gas', remedy: 'Jeera (cumin) water. Boil 1 spoon of cumin in water, cool and drink after meals.' },
  { concern: 'Sore Throat / Cold', remedy: 'Ginger, black pepper and honey mixture. Take 1 spoon twice daily.' },
  { concern: 'Joint Pain / Soreness', remedy: 'Apply warm sesame oil infused with garlic or consume ginger tea.' },
  { concern: 'Fatigue / Low Energy', remedy: 'Soak 5 almonds overnight and eat in the morning with warm milk.' }
];

const DietSuggestion: React.FC = () => {
  const { t, formatNumber } = useLanguage();
  const { logDiet } = useHealthDispatch();

  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(170); // in cm
  const [bmi, setBmi] = useState<number | null>(null);

  const calculateBmi = () => {
    const heightM = height / 100;
    const bmiVal = weight / (heightM * heightM);
    setBmi(Number(bmiVal.toFixed(1)));
    showToast("BMI Score Calculated!", "info");
  };

  const handleSaveLog = () => {
    if (bmi === null) return;
    logDiet(weight, height, bmi);
    showToast(
      navigator.onLine 
        ? `Saved BMI of ${bmi} to health logs successfully!`
        : `Vitals saved locally. Will sync online soon!`,
      'success'
    );
  };

  const getBmiStatus = (val: number) => {
    if (val < 18.5) return { label: 'Underweight', color: 'text-amber-500' };
    if (val < 24.9) return { label: 'Normal Weight', color: 'text-emerald-500' };
    if (val < 29.9) return { label: 'Overweight', color: 'text-orange-500' };
    return { label: 'Obese', color: 'text-rose-500' };
  };

  const getRegionTheme = (regionName: string) => {
    if (regionName.includes('North')) return { flag: '🇮🇳 🌾', style: 'border-orange-500/20 bg-orange-500/5 text-orange-600 dark:text-orange-400' };
    if (regionName.includes('South')) return { flag: '🇮🇳 🌴', style: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400' };
    if (regionName.includes('East')) return { flag: '🇮🇳 🌊', style: 'border-cyan-500/20 bg-cyan-500/5 text-cyan-600 dark:text-cyan-400' };
    return { flag: '🇮🇳 🏜️', style: 'border-amber-500/20 bg-amber-500/5 text-amber-600 dark:text-amber-400' };
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-up-staggered">
      <div>
        <h1 className="text-3xl font-bold font-heading text-foreground">{t('tracker.diet.title')}</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Calculate BMI and explore balanced regional Indian diet schedules.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* BMI Calculator (5 cols) */}
        <div className="lg:col-span-5 bg-card border border-border rounded-2xl p-6 shadow-sm glass space-y-6">
          <h3 className="font-heading font-bold text-lg text-foreground flex items-center gap-2 border-b border-border pb-3">
            <Calculator className="w-5 h-5 text-primary" />
            <span>BMI Calculator</span>
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1" htmlFor="bmiWeight">
                Weight (kg)
              </label>
              <input
                id="bmiWeight"
                type="number"
                inputMode="numeric"
                className="w-full p-2.5 rounded-lg border border-border bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm input-accent-glow font-number"
                value={weight}
                onChange={e => setWeight(Number(e.target.value))}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1" htmlFor="bmiHeight">
                Height (cm)
              </label>
              <input
                id="bmiHeight"
                type="number"
                inputMode="numeric"
                className="w-full p-2.5 rounded-lg border border-border bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm input-accent-glow font-number"
                value={height}
                onChange={e => setHeight(Number(e.target.value))}
              />
            </div>

            <button
              onClick={calculateBmi}
              className="w-full bg-primary hover:bg-primary/95 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md touch-target btn-elastic"
            >
              <span>Calculate BMI</span>
            </button>
          </div>

          {bmi !== null && (
            <div className="p-4 border border-border bg-muted/30 rounded-xl text-center space-y-3 animate-slide-up">
              <span className="text-[10px] text-muted-foreground font-semibold uppercase">Your BMI score</span>
              <div className="text-3xl font-extrabold font-number text-primary">{formatNumber(bmi)}</div>
              <div className={`text-sm font-bold ${getBmiStatus(bmi).color}`}>
                {getBmiStatus(bmi).label}
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed pt-1.5 border-t border-border/40 font-medium">
                Standard range: Underweight (&lt;18.5), Normal (18.5–24.9), Overweight (25–29.9), Obese (&gt;30).
              </p>
              
              <button
                onClick={handleSaveLog}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm touch-target btn-elastic btn-pulse-glow"
                style={{ '--btn-glow-color': '16, 185, 129' } as React.CSSProperties}
              >
                <CheckCircle className="w-4 h-4" />
                <span>Save to Health Logs</span>
              </button>
            </div>
          )}
        </div>

        {/* Diet Guidelines (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Regional Diet Schedules */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm glass space-y-6">
            <h3 className="font-heading font-bold text-lg text-foreground flex items-center gap-2 border-b border-border/40 pb-3">
              <Utensils className="w-5 h-5 text-amber-500" />
              <span>Balanced Regional Indian Diets</span>
            </h3>

            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-1">
              {regionalDiets.map((reg, idx) => {
                const theme = getRegionTheme(reg.region);
                return (
                  <div key={idx} className={`space-y-4 p-4 border rounded-2xl ${theme.style} shadow-sm`}>
                    <div className="flex justify-between items-center border-b border-border/30 pb-2">
                      <span className="text-xs font-extrabold block uppercase tracking-wide">
                        {reg.region}
                      </span>
                      <span className="text-base font-semibold">{theme.flag}</span>
                    </div>
                    
                    {/* Glassmorphic meal cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                      {reg.meals.map((m, mIdx) => (
                        <div 
                          key={mIdx} 
                          className="bg-card/40 backdrop-blur-md border border-border/60 rounded-xl p-3 flex flex-col gap-1 shadow-sm hover:scale-[1.02] hover:bg-card/60 transition-all text-left"
                        >
                          <span className="text-[9px] font-bold text-muted-foreground/80 dark:text-muted-foreground uppercase tracking-wider">{m.type}</span>
                          <p className="text-xs text-foreground font-semibold leading-relaxed">{m.menu}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Traditional Home Remedies */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm glass space-y-4">
            <h3 className="font-heading font-bold text-lg text-foreground flex items-center gap-2 border-b border-border/40 pb-3">
              <Sparkles className="w-5 h-5 text-teal-500" />
              <span>Traditional AYUSH Home Remedies</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {homeRemedies.map((rem, idx) => (
                <div key={idx} className="p-3 border border-border/60 bg-muted/20 rounded-xl hover:scale-[1.01] hover:border-teal-500/20 transition-all">
                  <span className="text-xs font-extrabold text-foreground block mb-1">
                    {rem.concern}
                  </span>
                  <p className="text-[11px] leading-relaxed text-muted-foreground font-medium">
                    {rem.remedy}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Guidelines info */}
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
