import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { scanToolsConfig } from '../../lib/cnn/scanConfig';
import type { ScanTool } from '../../lib/cnn/scanConfig';
import { supabase } from '../../integrations/supabase/client';
import { useHealthDispatch } from '../../context/HealthDispatchContext';
import ImageScanner from '../../components/scan/ImageScanner';
import PredictionResult from '../../components/medical/PredictionResult';
import type { PredictionData } from '../../components/medical/PredictionResult';
import { 
  ChevronRight, 
  ArrowLeft, 
  ShieldAlert, 
  RefreshCw, 
  ScanLine, 
  Stethoscope, 
  Brain, 
  Eye, 
  Scan 
} from 'lucide-react';

const scanConfigs: Record<string, {
  icon: React.ComponentType<any>;
  rgb: string;
  colorHex: string;
  textClass: string;
  bgClass: string;
  gradientClass: string;
  glowClass: string;
}> = {
  skin: {
    icon: ScanLine,
    rgb: '244, 63, 94',
    colorHex: '#f43f5e',
    textClass: 'text-rose-600 dark:text-rose-400',
    bgClass: 'bg-rose-500/15',
    gradientClass: 'from-rose-500 to-pink-500',
    glowClass: 'shadow-[0_0_15px_rgba(244,63,94,0.3)]',
  },
  chest: {
    icon: Stethoscope,
    rgb: '14, 165, 233',
    colorHex: '#0ea5e9',
    textClass: 'text-sky-600 dark:text-sky-400',
    bgClass: 'bg-sky-500/15',
    gradientClass: 'from-sky-500 to-cyan-500',
    glowClass: 'shadow-[0_0_15px_rgba(14,165,233,0.3)]',
  },
  mri: {
    icon: Brain,
    rgb: '139, 92, 246',
    colorHex: '#8b5cf6',
    textClass: 'text-violet-600 dark:text-violet-400',
    bgClass: 'bg-violet-500/15',
    gradientClass: 'from-violet-500 to-purple-500',
    glowClass: 'shadow-[0_0_15px_rgba(139,92,246,0.3)]',
  },
  retina: {
    icon: Eye,
    rgb: '245, 158, 11',
    colorHex: '#f59e0b',
    textClass: 'text-amber-600 dark:text-amber-400',
    bgClass: 'bg-amber-500/15',
    gradientClass: 'from-amber-500 to-orange-500',
    glowClass: 'shadow-[0_0_15px_rgba(245,158,11,0.3)]',
  },
  oral: {
    icon: Scan,
    rgb: '16, 185, 129',
    colorHex: '#10b981',
    textClass: 'text-emerald-600 dark:text-emerald-400',
    bgClass: 'bg-emerald-500/15',
    gradientClass: 'from-emerald-500 to-teal-500',
    glowClass: 'shadow-[0_0_15px_rgba(16,185,129,0.3)]',
  },
};

const ScanPage: React.FC = () => {
  const { t } = useLanguage();
  const { logScan } = useHealthDispatch();
  
  const [selectedTool, setSelectedTool] = useState<ScanTool | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleScanComplete = async (cnnResult: { vector: number[]; score: number; label: string }) => {
    if (!selectedTool) return;

    setLoading(true);
    setErrorMsg(null);
    setResult(null);

    try {
      // Send 1024-dimensional feature vector to Supabase edge function medical-predictor under image_analysis mode
      const { data, error } = await supabase.functions.invoke('medical-predictor', {
        body: {
          predictorId: 'image_analysis',
          scanType: selectedTool.id,
          vector: cnnResult.vector,
          localLabel: cnnResult.label
        }
      });

      if (error) throw error;

      // Blend confidence scores: final = 0.35 * cnn_score + 0.65 * llm_score
      const cnnPct = cnnResult.score * 100;
      const llmPct = data.confidence || 75; // fallback
      const blendedPct = Math.round(0.35 * cnnPct + 0.65 * llmPct);

      const finalResult = {
        ...data,
        confidence: blendedPct
      };

      setResult(finalResult);
      logScan(selectedTool.id, cnnResult.label, cnnResult.score, finalResult);

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to submit feature vectors to cloud analyzer.');
      
      // Fallback
      const fallbackResult: PredictionData = {
        risk: 'Insufficient Data',
        confidence: Math.round(cnnResult.score * 100),
        reasoning: [
          `Local CNN classified as: ${cnnResult.label}`,
          'Could not connect to Supabase edge function for blended interpretation.'
        ],
        recommendations: [
          'Ensure network connection is online.',
          'Please present physical radiograph film or skin scans to a physician.'
        ],
        urgency: 'routine',
        disclaimer: t('disclaimer.text')
      };
      setResult(fallbackResult);
      logScan(selectedTool.id, cnnResult.label, cnnResult.score, fallbackResult);
    } finally {
      setLoading(false);
    }
  };

  const activeCfg = selectedTool ? scanConfigs[selectedTool.id] : null;
  const ActiveIcon = activeCfg ? activeCfg.icon : null;

  return (
    <div className="space-y-8 max-w-5xl mx-auto relative overflow-hidden pb-12">
      
      {/* Background drifting blobs */}
      <div className="absolute top-[-10%] left-[-15%] w-[450px] h-[450px] bg-rose-500/3 dark:bg-rose-500/10 rounded-full blur-[100px] pointer-events-none -z-10 animate-mesh-move"></div>
      <div className="absolute top-[35%] right-[-10%] w-[550px] h-[550px] bg-violet-500/3 dark:bg-violet-500/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-mesh-move" style={{ animationDuration: '25s', animationDelay: '-5s' }}></div>
      <div className="absolute bottom-[-10%] left-[15%] w-[500px] h-[500px] bg-cyan-500/3 dark:bg-cyan-500/10 rounded-full blur-[110px] pointer-events-none -z-10 animate-mesh-move" style={{ animationDuration: '30s', animationDelay: '-10s' }}></div>

      {/* ⚠️ PROMINENT DISCLAIMER — This is NOT a diagnostic tool */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3">
        <ShieldAlert className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-amber-600 dark:text-amber-400">⚠️ This is NOT a medical diagnosis tool</p>
          <p className="text-xs text-amber-600/80 dark:text-amber-400/80 leading-relaxed mt-1">
            This scanner uses a general-purpose MobileNetV2 model (trained on everyday objects, not medical images). 
            Results are <strong>experimental image quality assessments</strong>, not clinical diagnoses. 
            Always consult a qualified healthcare professional. If you notice concerning symptoms, 
            please visit your nearest Primary Health Centre (PHC).
          </p>
        </div>
      </div>

      {/* Header Area */}
      <div className="flex items-center gap-4 animate-fade-in">
        {selectedTool && (
          <button 
            onClick={() => {
              setSelectedTool(null);
              setResult(null);
              setErrorMsg(null);
            }}
            className="p-2.5 bg-transparent hover:bg-slate-200/50 dark:hover:bg-slate-800/40 text-slate-500 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white rounded-xl transition-all border border-slate-300 dark:border-slate-800/60 touch-target flex items-center justify-center shrink-0"
            aria-label="Back to scans menu"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            {selectedTool && ActiveIcon && (
              <ActiveIcon className={`w-8 h-8 ${activeCfg?.textClass}`} />
            )}
            <h1 className="text-3xl md:text-4xl font-extrabold font-heading tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-violet-600 to-cyan-500 dark:from-rose-400 dark:via-violet-400 dark:to-cyan-400">
              {selectedTool ? selectedTool.name : t('nav.scanners')}
            </h1>
            <span className="text-[9px] font-bold px-2 py-0.5 bg-amber-500/15 text-amber-600 dark:text-amber-400 rounded-full border border-amber-500/30 uppercase tracking-wider">
              Experimental Preview
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-2xl leading-relaxed">
            {selectedTool 
              ? 'Upload an image for on-device feature extraction. Results provide general guidance only — this is NOT a diagnosis. Please consult a doctor for clinical interpretation.' 
              : 'Experimental image triage tools running entirely on-device. These provide general observations only and cannot replace a trained medical professional.'
            }
          </p>
        </div>
      </div>

      {!selectedTool ? (
        // Grid of tools menu
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {Object.values(scanToolsConfig).map((tool, index) => {
            const cfg = scanConfigs[tool.id] || {
              icon: Scan,
              rgb: '139, 92, 246',
              colorHex: '#8b5cf6',
              textClass: 'text-violet-600 dark:text-violet-400',
              bgClass: 'bg-violet-500/15',
              gradientClass: 'from-violet-500 to-purple-500',
              glowClass: 'shadow-[0_0_15px_rgba(139,92,246,0.3)]',
            };
            const ToolIcon = cfg.icon;

            return (
              <button
                key={tool.id}
                onClick={() => setSelectedTool(tool)}
                style={{ 
                  '--scan-accent-rgb': cfg.rgb,
                  animationDelay: `${index * 75}ms`
                } as React.CSSProperties}
                className="p-6 scan-card rounded-2xl flex flex-col justify-between text-left touch-target group animate-slide-up relative"
              >
                {/* On-device CNN Badge */}
                <div 
                  className="absolute top-4 right-4 text-[9px] font-bold px-2 py-0.5 rounded-full border"
                  style={{
                    borderColor: `rgba(${cfg.rgb}, 0.3)`,
                    backgroundColor: `rgba(${cfg.rgb}, 0.1)`,
                    color: `rgb(${cfg.rgb})`
                  }}
                >
                  Experimental • On-Device
                </div>

                <div className="space-y-4">
                  {/* Icon container: 48x48px with 15% opacity background */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${cfg.bgClass} shrink-0`}>
                    <ToolIcon className={`w-6 h-6 ${cfg.textClass} group-hover:scale-110 transition-transform duration-300`} />
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-heading font-bold text-lg text-slate-800 dark:text-white leading-snug">
                      {tool.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed min-h-[36px]">
                      {tool.description}
                    </p>
                  </div>
                </div>

                {/* Bottom link with arrow slide animation */}
                <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between w-full">
                  <span className={`text-xs font-bold ${cfg.textClass} flex items-center gap-1`}>
                    Open Scanner
                    <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        // Active Scanner Panel
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-slide-up">
          
          {/* Scanner Capture Box (7 cols) */}
          <div className="lg:col-span-7">
            {activeCfg && (
              <ImageScanner 
                guidance={selectedTool.guidance} 
                onScanComplete={handleScanComplete} 
                rgb={activeCfg.rgb}
                textClass={activeCfg.textClass}
                bgClass={activeCfg.bgClass}
                gradientClass={activeCfg.gradientClass}
                glowClass={activeCfg.glowClass}
              />
            )}
          </div>

          {/* Report Outcome Box (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {loading && (
              <div className="bg-card/40 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-8 text-center text-xs font-semibold py-20 backdrop-blur-md flex flex-col items-center justify-center gap-4">
                <RefreshCw className={`w-8 h-8 ${activeCfg?.textClass} animate-spin`} />
                <span className="text-slate-600 dark:text-slate-300">Blended CNN & LLM analysis in progress...</span>
              </div>
            )}

            {errorMsg && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive-foreground text-xs rounded-xl flex items-start gap-2.5 animate-slide-up">
                <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-red-500 dark:text-red-400" />
                <span className="text-red-500 dark:text-red-400 leading-relaxed">{errorMsg}</span>
              </div>
            )}

            {result && !loading && (
              <div className="animate-slide-up">
                <PredictionResult predictorId={selectedTool.id} data={result} />
              </div>
            )}

            {!result && !loading && activeCfg && (
              <div className="bg-white/40 dark:bg-card/40 border border-dashed border-slate-300 dark:border-slate-800/80 rounded-2xl p-8 text-center text-slate-500 dark:text-slate-400 text-xs font-semibold py-20 backdrop-blur-md flex flex-col items-center justify-center gap-4">
                <div className={`w-12 h-12 rounded-full ${activeCfg.bgClass} flex items-center justify-center animate-pulse`}>
                  {ActiveIcon && <ActiveIcon className={`w-6 h-6 ${activeCfg.textClass}`} />}
                </div>
                <span className="max-w-xs leading-relaxed">
                  Awaiting scan... Upload or capture a clear diagnostic photo to start local CNN feature extraction immediately.
                </span>
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
};

export default ScanPage;
