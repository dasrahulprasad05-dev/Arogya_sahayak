import React, { useState, useRef, useEffect, useMemo } from 'react';
import { loadMobileNetModel, extractFeatures } from '../../lib/cnn/mobilenet';
import { Upload, RefreshCw, ShieldAlert, Sparkles, Lock } from 'lucide-react';

interface ImageScannerProps {
  onScanComplete: (result: { vector: number[]; score: number; label: string }) => void;
  guidance: string;
  rgb: string;
  textClass: string;
  bgClass: string;
  gradientClass: string;
  glowClass: string;
}

const ImageScanner: React.FC<ImageScannerProps> = ({ 
  onScanComplete, 
  guidance,
  rgb,
  textClass,
  bgClass,
  gradientClass,
  glowClass
}) => {
  const [modelProgress, setModelProgress] = useState(0);
  const [modelReady, setModelReady] = useState(false);
  
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Lazy load model when scanner mounts
  useEffect(() => {
    const initModel = async () => {
      try {
        await loadMobileNetModel((progress) => {
          setModelProgress(progress);
        });
        setModelReady(true);
      } catch (err) {
        console.error(err);
        setErrorMsg('Failed to initialize local TensorFlow.js engine.');
      }
    };
    initModel();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRunInference = async () => {
    if (!imageRef.current || !modelReady) return;

    setProcessing(true);
    setErrorMsg(null);

    try {
      // 1. Run local MobileNet feature extraction
      const result = await extractFeatures(imageRef.current);
      console.log('Local CNN Inference complete:', result);

      // 2. Reject image if local classification confidence score < 0.55
      if (result.score < 0.55) {
        setErrorMsg('Scan rejected (confidence < 0.55). Please retake in better lighting, center the target, and minimize blur.');
        setProcessing(false);
        return;
      }

      // 3. Success callback sending feature vector up
      onScanComplete(result);
    } catch (err) {
      console.error(err);
      setErrorMsg('Error running local CNN classification engine.');
    } finally {
      setProcessing(false);
    }
  };

  // Model download stage label
  const stageLabel = useMemo(() => {
    if (modelProgress < 30) return 'Downloading TensorFlow.js engine...';
    if (modelProgress < 50) return 'Preparing WebGL backend...';
    if (modelProgress < 70) return 'Loading MobileNetV2 weights...';
    if (modelProgress < 100) return 'Warming up classifier...';
    return 'Ready!';
  }, [modelProgress]);

  return (
    <div className="bg-card/40 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-md space-y-6">
      
      {/* 1. Model Loading Progress Indicator */}
      {!modelReady && (
        <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 border border-slate-800/50 bg-slate-900/30 rounded-xl backdrop-blur-sm">
          {/* Circular progress */}
          <div className="relative w-20 h-20">
            <svg className="w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
              <circle
                cx="40" cy="40" r="34"
                fill="transparent"
                stroke="currentColor"
                className="text-slate-800"
                strokeWidth="5"
              />
              <circle
                cx="40" cy="40" r="34"
                fill="transparent"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={213.6}
                strokeDashoffset={213.6 - (213.6 * modelProgress) / 100}
                style={{ 
                  stroke: `rgb(${rgb})`,
                  transition: 'stroke-dashoffset 0.3s ease',
                  filter: `drop-shadow(0 0 6px rgba(${rgb}, 0.5))`
                }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-mono text-sm font-bold text-white">{modelProgress}%</span>
            </div>
          </div>
          <div>
            <span className="font-bold text-sm text-white block">{stageLabel}</span>
            <p className="text-[10px] text-slate-400 mt-1">MobileNetV2 (~17MB) caches in browser for offline use.</p>
          </div>
        </div>
      )}

      {/* 2. Model Ready Scanner Panel */}
      {modelReady && (
        <div className="space-y-5">
          
          {/* Guidance Banner */}
          <div 
            className="relative p-3 bg-slate-900/50 backdrop-blur-sm border border-slate-800/85 rounded-xl flex items-start gap-2.5"
            style={{ borderLeft: `3px solid rgb(${rgb})` }}
          >
            <Sparkles className={`w-5 h-5 ${textClass} shrink-0 mt-0.5`} />
            <div className="text-xs leading-relaxed font-semibold">
              <span className="block mb-0.5 text-white font-bold">Clinician Guidance:</span>
              <p className="text-slate-400 opacity-90">{guidance}</p>
            </div>
          </div>

          {/* Upload / Stream Target Container */}
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className="border-2 border-dashed rounded-2xl h-64 flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300"
            style={{ 
              borderColor: isDragOver ? `rgb(${rgb})` : `rgba(${rgb}, 0.3)`,
              backgroundColor: isDragOver ? `rgba(${rgb}, 0.08)` : `rgba(${rgb}, 0.02)`,
              boxShadow: isDragOver ? `0 0 20px rgba(${rgb}, 0.25)` : 'none'
            }}
          >
            {imageSrc ? (
              <div className="w-full h-full relative group">
                <img 
                  ref={imageRef}
                  src={imageSrc} 
                  alt="Upload preview" 
                  className="w-full h-full object-contain"
                  onLoad={handleRunInference}
                />
                <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur px-2.5 py-1 rounded-full border border-slate-800 text-[10px] text-white">
                  Local Scan Mode
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center p-6 space-y-4">
                <div className={`w-14 h-14 rounded-full ${bgClass} flex items-center justify-center transition-transform duration-350 ${isDragOver ? 'scale-110' : ''}`}>
                  <Upload className={`w-7 h-7 ${textClass}`} />
                </div>
                <div>
                  <span className="text-sm font-bold text-white block">Drag & Drop Scan Image</span>
                  <p className="text-[10px] text-slate-400 mt-1">Accepts raw clinical photographs (PNG, JPG, or JPEG)</p>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  type="button"
                  className={`text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-all bg-gradient-to-r ${gradientClass} ${glowClass} hover:scale-[1.02] transform touch-target`}
                >
                  Choose File
                </button>
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileUpload}
                />
              </div>
            )}

            {/* Spinner Overlay during prediction — scanning line sweep */}
            {processing && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center text-white text-xs font-bold gap-3">
                {/* Scanning sweep line */}
                <div 
                  className="absolute left-0 right-0 h-0.5 animate-scan-sweep"
                  style={{ 
                    background: `linear-gradient(90deg, transparent, rgb(${rgb}), transparent)`,
                    boxShadow: `0 0 12px rgb(${rgb})`
                  }}
                />
                <RefreshCw className={`w-8 h-8 ${textClass} animate-spin`} />
                <span className="tracking-wide text-slate-200">Analyzing image features...</span>
                <span className="text-[10px] text-slate-400">Running 1024-dim feature extraction</span>
              </div>
            )}
          </div>

          {/* Privacy Badge */}
          <div className="flex items-center justify-center gap-1.5 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg py-1.5 px-3 w-fit mx-auto">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Images never leave your device (100% Client-Side Privacy)</span>
          </div>

          {/* Local validation error warning alerts */}
          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl flex items-start gap-2.5 animate-slide-up">
              <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
              <div>
                <span className="font-bold block mb-0.5 text-rose-300">Scan Rejected</span>
                <p className="leading-relaxed opacity-95 text-rose-400">{errorMsg}</p>
              </div>
            </div>
          )}

          {/* Reset button if image exists */}
          {imageSrc && !processing && (
            <button
              onClick={() => setImageSrc(null)}
              className="w-full border border-slate-800 bg-slate-900/50 hover:bg-slate-900 text-white font-semibold py-2.5 rounded-xl text-xs transition-all touch-target"
            >
              Reset / Retake Image
            </button>
          )}

        </div>
      )}

    </div>
  );
};

export default ImageScanner;
