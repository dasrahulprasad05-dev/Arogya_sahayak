import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useHealthDispatch } from '../../context/HealthDispatchContext';
import { supabase } from '../../integrations/supabase/client';
import { 
  Activity, 
  AlertTriangle, 
  Info, 
  RefreshCw, 
  Send, 
  ArrowRight,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { showToast } from '../../utils/toast';

type BodyRegion = 'head' | 'chest' | 'stomach' | 'back' | 'arms' | 'legs' | 'skin' | 'general';

const symptomsByRegion: Record<BodyRegion, { id: string; label: string }[]> = {
  head: [
    { id: 'headache', label: 'Severe Headache' },
    { id: 'dizziness', label: 'Dizziness / Vertigo' },
    { id: 'fever', label: 'High Fever' },
    { id: 'blurry_vision', label: 'Blurry Vision' },
    { id: 'sore_throat', label: 'Sore Throat / Cough' }
  ],
  chest: [
    { id: 'chest_pain', label: 'Chest Pain / Pressure' },
    { id: 'short_breath', label: 'Shortness of Breath' },
    { id: 'cough', label: 'Dry or Productive Cough' },
    { id: 'palpitations', label: 'Rapid Heartbeats' }
  ],
  stomach: [
    { id: 'stomach_ache', label: 'Severe Stomach Ache' },
    { id: 'nausea', label: 'Nausea / Vomiting' },
    { id: 'diarrhea', label: 'Diarrhea / Loose Stool' },
    { id: 'bloating', label: 'Bloating / Acid Reflux' }
  ],
  back: [
    { id: 'lower_back', label: 'Lower Back Pain' },
    { id: 'spine_stiff', label: 'Spine Stiffness' },
    { id: 'neck_pain', label: 'Neck Pain / Stiffness' }
  ],
  arms: [
    { id: 'arm_pain', label: 'Muscle Ache / Cramps in Arms' },
    { id: 'arm_numbness', label: 'Numbness / Tingling in Hands' },
    { id: 'arm_joint', label: 'Joint Stiffness' }
  ],
  legs: [
    { id: 'leg_pain', label: 'Muscle Cramps / Ache in Legs' },
    { id: 'leg_numbness', label: 'Numbness / Tingling in Feet' },
    { id: 'leg_swelling', label: 'Swelling in Feet / Ankles' }
  ],
  skin: [
    { id: 'skin_rash', label: 'Skin Rash or Itching' },
    { id: 'skin_dry', label: 'Extreme Dryness or Peeling' },
    { id: 'skin_color', label: 'Redness / Color Changes' }
  ],
  general: [
    { id: 'fatigue', label: 'Severe Fatigue / Weakness' },
    { id: 'appetite', label: 'Loss of Appetite' },
    { id: 'weight_loss', label: 'Sudden Weight Loss' },
    { id: 'chills', label: 'Chills / Shivering' }
  ]
};

const SymptomChecker: React.FC = () => {
  const { language } = useLanguage();
  const { logSymptom } = useHealthDispatch();

  // Wizard state: 1 = Region, 2 = Symptoms, 3 = Notes, 4 = AI Results
  const [step, setStep] = useState<number>(1);
  const [selectedRegion, setSelectedRegion] = useState<BodyRegion>('head');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [streamingResult, setStreamingResult] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRegionSelect = (region: BodyRegion) => {
    setSelectedRegion(region);
    setStep(2);
  };

  const handleSymptomToggle = (label: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(label) ? prev.filter(s => s !== label) : [...prev, label]
    );
  };

  const handleTriageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSymptoms.length === 0 && !additionalNotes) {
      setErrorMsg('Please select at least one symptom or enter notes.');
      return;
    }

    setStep(4);
    setLoading(true);
    setErrorMsg(null);
    setStreamingResult('');

    if (!isOnline) {
      setTimeout(() => {
        let advisory = `⚠️ OFFLINE MODE ADVISORY\n\n`;
        advisory += `Because you are offline, we cannot connect to the Gemini AI Triage model. Here is the clinical guideline checklist:\n\n`;
        
        const hasRedFlags = selectedSymptoms.some(s => 
          s.includes('Chest Pain') || s.includes('Shortness') || s.includes('Numbness')
        );

        if (hasRedFlags) {
          advisory += `🚨 EMERGENCY RED FLAG DETECTED:\n`;
          advisory += `- Your selected symptoms may suggest a critical emergency.\n`;
          advisory += `- ACTION: PLEASE DIAL 108 OR GO TO THE NEAREST CLINIC IMMEDIATELY.\n\n`;
        } else {
          advisory += `📌 GENERAL CARE GUIDANCE:\n`;
          advisory += `- Keep hydrated, rest, and log temperature/vitals twice daily.\n`;
          advisory += `- Watch for warning signs like worsening fever or breathing trouble.\n`;
          advisory += `- Action: Consult a clinician when you are online or visit an eSanjeevani portal.\n\n`;
        }
        
        advisory += `DISCLAIMER: Aarogya Sahayak provides screening guides. Consult a doctor for any diagnosis.`;
        setStreamingResult(advisory);
        logSymptom(selectedSymptoms, { offline: true, summary: advisory });
        setLoading(false);
        showToast("Symptom report logged locally (offline mode).", "info");
      }, 1200);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('symptom-checker', {
        body: { 
          symptoms: selectedSymptoms, 
          notes: additionalNotes,
          lang: language 
        }
      });

      if (error) throw error;

      const textResponse = data?.advisory || 'Unable to fetch advisory. Please try again.';
      
      let index = 0;
      const interval = setInterval(() => {
        setStreamingResult(prev => prev + textResponse.charAt(index));
        index++;
        if (index >= textResponse.length) {
          clearInterval(interval);
          setLoading(false);
          logSymptom(selectedSymptoms, { offline: false, summary: textResponse });
          showToast("AI Triage summary generated and logged!", "success");
        }
      }, 10);
      
    } catch (err: any) {
      console.error(err);
      setErrorMsg('AI service unavailable. Falling back to clinical guidelines.');
      let advisory = `⚠️ OFFLINE CHECKLIST FALLBACK\n\n`;
      advisory += `1. Possible Causes: Varies based on selected symptoms (${selectedSymptoms.join(', ')}).\n`;
      advisory += `2. Warning Signs: Difficulty breathing, continuous high fever, chest tightness.\n`;
      advisory += `3. Action: Rest, drink fluids, monitor vitals.\n`;
      advisory += `4. Emergencies: Dial 108 immediately if symptoms escalate.`;
      setStreamingResult(advisory);
      logSymptom(selectedSymptoms, { error: true, summary: advisory });
      setLoading(false);
      showToast("Triage report saved successfully.", "success");
    }
  };

  const getRegionEmoji = (region: BodyRegion) => {
    switch (region) {
      case 'head': return '🧠';
      case 'chest': return '🫁';
      case 'stomach': return '🤢';
      case 'back': return '🦴';
      case 'arms': return '💪';
      case 'legs': return '🦵';
      case 'skin': return '🧴';
      case 'general': return '🏥';
    }
  };

  const getRegionColorClass = (region: BodyRegion) => {
    switch (region) {
      case 'head': return 'hover:border-purple-500 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] bg-purple-500/5 dark:bg-purple-950/10 border-purple-500/30';
      case 'chest': return 'hover:border-rose-500 hover:shadow-[0_0_15px_rgba(244,63,94,0.4)] bg-rose-500/5 dark:bg-rose-950/10 border-rose-500/30';
      case 'stomach': return 'hover:border-emerald-500 hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] bg-emerald-500/5 dark:bg-emerald-950/10 border-emerald-500/30';
      case 'back': return 'hover:border-amber-500 hover:shadow-[0_0_15px_rgba(245,158,11,0.4)] bg-amber-500/5 dark:bg-amber-950/10 border-amber-500/30';
      case 'arms': return 'hover:border-blue-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] bg-blue-500/5 dark:bg-blue-950/10 border-blue-500/30';
      case 'legs': return 'hover:border-indigo-500 hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] bg-indigo-500/5 dark:bg-indigo-950/10 border-indigo-500/30';
      case 'skin': return 'hover:border-pink-500 hover:shadow-[0_0_15px_rgba(236,72,153,0.4)] bg-pink-500/5 dark:bg-pink-950/10 border-pink-500/30';
      case 'general': return 'hover:border-teal-500 hover:shadow-[0_0_15px_rgba(20,184,166,0.4)] bg-teal-500/5 dark:bg-teal-950/10 border-teal-500/30';
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-up-staggered">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-primary/10 to-transparent p-6 rounded-2xl border border-primary/10 flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-heading text-foreground">AI Symptom Checker</h1>
          <p className="text-muted-foreground text-sm mt-1">Describe your symptoms for AI-powered health insights.</p>
        </div>
        <div className="hidden sm:flex items-center gap-1 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Powered by Gemini AI</span>
        </div>
      </div>

      {/* Step Progress Wizard (Animated step progress line) */}
      <div className="flex justify-between items-center bg-card border border-border rounded-xl p-4 max-w-lg mx-auto relative overflow-hidden">
        {/* Background active line */}
        <div className="absolute top-[27px] left-10 right-10 h-0.5 bg-muted z-0">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out animate-progress-shimmer" 
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          />
        </div>

        {[1, 2, 3, 4].map(s => (
          <div key={s} className="flex items-center gap-2 z-10 bg-card dark:bg-card px-2">
            <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
              step >= s ? 'bg-primary text-white scale-110 shadow-sm' : 'bg-muted text-muted-foreground'
            }`}>
              {s}
            </span>
          </div>
        ))}
      </div>

      {/* Wizard Step Content */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm glass">
        
        {/* STEP 1: Region Selection Cards */}
        {step === 1 && (
          <div className="space-y-6 animate-slide-up">
            <h3 className="text-lg font-bold font-heading text-foreground text-center">
              Select the body region where you're experiencing symptoms:
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {([
                'head', 'chest', 'stomach', 'back',
                'arms', 'legs', 'skin', 'general'
              ] as BodyRegion[]).map(region => (
                <button
                  key={region}
                  onClick={() => handleRegionSelect(region)}
                  className={`p-5 border rounded-2xl flex flex-col items-center justify-center text-center gap-3 transition-all hover:-translate-y-1 hover:shadow-md touch-target group btn-elastic ${getRegionColorClass(region)}`}
                >
                  <span className="text-3xl transition-transform group-hover:scale-125 duration-200">
                    {getRegionEmoji(region)}
                  </span>
                  <span className="text-xs font-bold text-foreground capitalize">
                    {region}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Symptom Checkboxes */}
        {step === 2 && (
          <div className="space-y-6 animate-slide-up">
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <h3 className="text-lg font-bold font-heading text-foreground capitalize">
                Select Symptoms: {selectedRegion}
              </h3>
              <button
                onClick={() => setStep(1)}
                className="text-xs text-muted-foreground hover:text-foreground font-semibold flex items-center gap-1 touch-target btn-elastic"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Change Region
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {symptomsByRegion[selectedRegion].map(symp => {
                const checked = selectedSymptoms.includes(symp.label);
                return (
                  <button
                    key={symp.id}
                    onClick={() => handleSymptomToggle(symp.label)}
                    className={`p-4 border rounded-xl flex items-center justify-between text-left text-xs transition-all touch-target btn-elastic ${
                      checked
                        ? 'border-primary bg-primary/10 text-primary font-bold shadow-[0_0_12px_rgba(139,92,246,0.15)]'
                        : 'border-border bg-background/50 hover:bg-muted/50 text-muted-foreground'
                    }`}
                  >
                    <span>{symp.label}</span>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {}}
                      className="rounded border-border text-primary focus:ring-primary w-4.5 h-4.5 pointer-events-none"
                    />
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border/40">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 border border-border rounded-xl text-xs font-semibold hover:bg-muted/50 transition-all touch-target btn-elastic"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-5 py-2 bg-primary hover:bg-primary/95 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 touch-target shadow-md btn-elastic"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Additional Notes & Submit */}
        {step === 3 && (
          <form onSubmit={handleTriageSubmit} className="space-y-6 animate-slide-up">
            <div className="border-b border-border/40 pb-4">
              <h3 className="text-lg font-bold font-heading text-foreground">
                Add Description Notes
              </h3>
              <p className="text-muted-foreground text-xs mt-0.5">Provide optional details about symptom onset, duration, and severity.</p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-destructive/10 text-destructive text-xs rounded-lg animate-pulse">
                {errorMsg}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="additional_notes" className="text-xs font-semibold text-muted-foreground uppercase">
                Describe your condition (Optional)
              </label>
              <textarea
                id="additional_notes"
                rows={4}
                className="w-full p-3 rounded-xl border border-border bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-xs leading-relaxed input-accent-glow"
                placeholder="e.g. Headache started yesterday evening, feels throbbing, worsens in light..."
                value={additionalNotes}
                onChange={e => setAdditionalNotes(e.target.value)}
              />
            </div>

            <div className="flex justify-between gap-3 pt-4 border-t border-border/40">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 border border-border rounded-xl text-xs font-semibold hover:bg-muted/50 transition-all touch-target btn-elastic"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-primary hover:bg-primary/95 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 touch-target shadow-md btn-elastic btn-pulse-glow"
                style={{ '--btn-glow-color': '139, 92, 246' } as React.CSSProperties}
              >
                <span>Run AI Triage</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 4: AI Streaming Advisory Output */}
        {step === 4 && (
          <div className="space-y-6 animate-slide-up">
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <h3 className="text-lg font-bold font-heading text-foreground flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary shrink-0 animate-pulse" />
                <span>AI Clinical Advisory</span>
              </h3>
              {!loading && (
                <button
                  onClick={() => {
                    setStep(1);
                    setSelectedSymptoms([]);
                    setAdditionalNotes('');
                    setStreamingResult('');
                  }}
                  className="text-xs text-primary hover:underline font-semibold touch-target btn-elastic"
                >
                  Start New Triage
                </button>
              )}
            </div>

            <div className="text-sm leading-relaxed whitespace-pre-wrap font-medium p-4 border border-border/60 bg-muted/20 rounded-xl font-sans min-h-[150px]">
              {streamingResult}
              {loading && !streamingResult && (
                <span className="flex items-center gap-2 text-muted-foreground text-xs font-semibold animate-pulse">
                  <RefreshCw className="w-4 h-4 animate-spin text-primary" />
                  Generating triage advisory...
                </span>
              )}
              {loading && streamingResult && (
                <span className="inline-block w-1.5 h-4 bg-primary animate-pulse ml-0.5 align-middle"></span>
              )}
            </div>

            {!loading && streamingResult && (
              <div className="p-4 bg-rose-500/5 border border-rose-500/10 rounded-xl flex items-start gap-3 animate-fade-in shadow-sm">
                <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold text-xs text-rose-750 dark:text-rose-450 block mb-1 uppercase tracking-wide">🚨 Emergency Red Flag Action</span>
                  <p className="text-[11px] leading-relaxed text-muted-foreground">
                    If you exhibit crushing radiating chest pain, sudden numbness in face or arms, or severe respiratory gasping, call 108/112 immediately.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Footer Guidelines */}
      <div className="p-4 bg-muted/40 border border-border rounded-xl flex gap-3 text-xs leading-relaxed text-muted-foreground">
        <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-foreground block mb-1">Triage Protocol Framework:</span>
          Aarogya Sahayak follows ICMR and National Health Portal guidelines for primary medical screening. AI outputs represent risk indicators, not definitive diagnoses. Always consult a licensed clinical practitioner for therapeutic decisions.
        </div>
      </div>

    </div>
  );
};

export default SymptomChecker;
