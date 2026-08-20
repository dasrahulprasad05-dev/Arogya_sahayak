import React, { useState, useRef, useEffect, useMemo } from 'react';
import { loadMobileNetModel, extractFeatures } from '../../lib/cnn/mobilenet';
import { checkImageQuality } from '../../lib/cnn/imageQuality';
import type { ImageQualityReport } from '../../lib/cnn/imageQuality';
import type { GradCamResult } from '../../lib/cnn/gradcam';
import { Upload, RefreshCw, ShieldAlert, Sparkles, Lock, CheckCircle2, AlertTriangle, Eye, Flame } from 'lucide-react';

export interface ScanCompletePayload {
  vector: number[];
  score: number;
  label: string;
  gradCam?: GradCamResult;
  quality?: ImageQualityReport;
  originalImage: string;
}

interface ImageScannerProps {
  onScanComplete: (result: ScanCompletePayload) => void;
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
  const [qualityReport, setQualityReport] = useState<ImageQualityReport | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showHeatmapPreview, setShowHeatmapPreview] = useState(false);
  const [activeHeatmapUrl, setActiveHeatmapUrl] = useState<string | null>(null);

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
    setQualityReport(null);
    setActiveHeatmapUrl(null);
    setShowHeatmapPreview(false);
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
    setQualityReport(null);
    setActiveHeatmapUrl(null);
    setShowHeatmapPreview(false);
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
      // 1. Pre-Inference Image Quality Check (Laplacian Blur & Illumination Gate)
      const quality = checkImageQuality(imageRef.current);
      setQualityReport(quality);

      if (!quality.isAcceptable) {
        setErrorMsg(quality.warnings.join(' • ') || 'Image failed clinical quality inspection (too blurry or poor lighting).');
        setProcessing(false);
        return;
      }

      // 2. Run local MobileNet feature extraction + Grad-CAM generation
      const result = await extractFeatures(imageRef.current);

      if (result.gradCam) {
        setActiveHeatmapUrl(result.gradCam.compositeDataUrl);
      }

      // 3. Success callback sending feature vector, quality, and Grad-CAM
      onScanComplete({
        vector: result.vector,
        score: result.score,
        label: result.label,
        gradCam: result.gradCam,
        quality,
        originalImage: imageSrc || '',
      });
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
    <div className="bg-card/40 border border-border rounded-2xl p-6 shadow-xl backdrop-blur-md space-y-6">
      
      {/* 1. Model Loading Progress Indicator */}
      {!modelReady && (
        <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 border border-border/50 bg-card/30 rounded-xl backdrop-blur-sm">
          <div className="relative w-20 h-20">
            <svg className="w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
              <circle
                cx="40" cy="40" r="34"
                fill="transparent"
                stroke="currentColor"
                className="text-muted/40"
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
              <span className="font-mono text-sm font-bold text-foreground">{modelProgress}%</span>
            </div>
          </div>
          <div>
            <span className="font-bold text-sm text-foreground block">{stageLabel}</span>
            <p className="text-[10px] text-muted-foreground mt-1">MobileNetV2 (~17MB) caches in browser for offline use.</p>
          </div>
        </div>
      )}

      {/* 2. Model Ready Scanner Panel */}
      {modelReady && (
        <div className="space-y-5">
          
          {/* Guidance Banner */}
          <div 
            className="relative p-3.5 bg-muted/40 backdrop-blur-sm border border-border rounded-xl flex items-start gap-2.5"
            style={{ borderLeft: `3.5px solid rgb(${rgb})` }}
          >
            <Sparkles className={`w-5 h-5 ${textClass} shrink-0 mt-0.5`} />
            <div className="text-xs leading-relaxed font-semibold">
              <span className="block mb-0.5 text-foreground font-bold">Clinician Capture Guidance:</span>
              <p className="text-muted-foreground">{guidance}</p>
            </div>
          </div>

          {/* Upload / Stream Target Container */}
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className="border-2 border-dashed rounded-2xl min-h-[270px] flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300 bg-card/20"
            style={{ 
              borderColor: isDragOver ? `rgb(${rgb})` : `rgba(${rgb}, 0.35)`,
              boxShadow: isDragOver ? `0 0 20px rgba(${rgb}, 0.25)` : 'none'
            }}
          >
            {imageSrc ? (
              <div className="w-full h-full min-h-[270px] relative group flex items-center justify-center p-2">
                <img 
                  ref={imageRef}
                  src={showHeatmapPreview && activeHeatmapUrl ? activeHeatmapUrl : imageSrc} 
                  alt="Upload preview" 
                  className="max-h-[260px] w-auto object-contain rounded-lg"
                  onLoad={handleRunInference}
                />

                {/* Local scan badge */}
                <div className="absolute top-3 right-3 bg-card/90 backdrop-blur px-2.5 py-1 rounded-full border border-border text-[10px] font-bold text-foreground shadow-sm">
                  {showHeatmapPreview ? '🔥 Grad-CAM Overlay' : 'Local Scan View'}
                </div>

                {/* Heatmap Preview Toggle if available */}
                {activeHeatmapUrl && !processing && (
                  <button
                    type="button"
                    onClick={() => setShowHeatmapPreview(!showHeatmapPreview)}
                    className="absolute bottom-3 right-3 bg-card/90 hover:bg-card border border-border px-3 py-1.5 rounded-xl text-xs font-bold text-foreground shadow-md flex items-center gap-1.5 transition-all"
                  >
                    {showHeatmapPreview ? <Eye className="w-3.5 h-3.5" /> : <Flame className="w-3.5 h-3.5 text-rose-500" />}
                    <span>{showHeatmapPreview ? 'Show Original' : 'Preview Heatmap'}</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center text-center p-6 space-y-4">
                <div className={`w-14 h-14 rounded-full ${bgClass} flex items-center justify-center transition-transform duration-350 ${isDragOver ? 'scale-110' : ''}`}>
                  <Upload className={`w-7 h-7 ${textClass}`} />
                </div>
                <div>
                  <span className="text-sm font-bold text-foreground block">Upload or Capture Medical Image</span>
                  <p className="text-[10px] text-muted-foreground mt-1">Accepts clinical photos, radiographs, or Dermatoscope scans (PNG/JPG)</p>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  type="button"
                  className={`text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-all bg-gradient-to-r ${gradientClass} ${glowClass} hover:scale-[1.02] transform touch-target shadow-md`}
                >
                  Select Scan Image
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

            {/* Spinner Overlay during prediction */}
            {processing && (
              <div className="absolute inset-0 bg-card/85 backdrop-blur-sm flex flex-col items-center justify-center text-foreground text-xs font-bold gap-3 z-10">
                <div 
                  className="absolute left-0 right-0 h-0.5 animate-scan-sweep"
                  style={{ 
                    background: `linear-gradient(90deg, transparent, rgb(${rgb}), transparent)`,
                    boxShadow: `0 0 12px rgb(${rgb})`
                  }}
                />
                <RefreshCw className={`w-8 h-8 ${textClass} animate-spin`} />
                <span className="tracking-wide text-foreground">Extracting CNN features &amp; generating Grad-CAM...</span>
                <span className="text-[10px] text-muted-foreground">Laplacian Quality: Validated</span>
              </div>
            )}
          </div>

          {/* Image Quality Gate Diagnostics */}
          {qualityReport && (
            <div className="bg-card border border-border rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-bold">
                  {qualityReport.isAcceptable ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                  )}
                  <span>Image Quality Inspection</span>
                </div>
                <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                  qualityReport.status === 'excellent' ? 'bg-emerald-500/10 text-emerald-500' :
                  qualityReport.status === 'acceptable' ? 'bg-amber-500/10 text-amber-500' :
                  'bg-rose-500/10 text-rose-500'
                }`}>
                  {qualityReport.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1 text-[10px] text-muted-foreground">
                <div className="bg-muted/50 p-2 rounded-lg text-center">
                  <span className="block font-semibold">Sharpness</span>
                  <span className="font-mono font-bold text-foreground">{qualityReport.blurScore}/100</span>
                </div>
                <div className="bg-muted/50 p-2 rounded-lg text-center">
                  <span className="block font-semibold">Luminance</span>
                  <span className="font-mono font-bold text-foreground">{qualityReport.brightnessScore}/255</span>
                </div>
                <div className="bg-muted/50 p-2 rounded-lg text-center">
                  <span className="block font-semibold">Contrast</span>
                  <span className="font-mono font-bold text-foreground">{qualityReport.contrastScore}/100</span>
                </div>
              </div>
            </div>
          )}

          {/* Privacy Badge */}
          <div className="flex items-center justify-center gap-1.5 text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 rounded-lg py-1.5 px-3 w-fit mx-auto">
            <Lock className="w-3.5 h-3.5 text-emerald-500" />
            <span>On-Device Neural Inference • Zero Cloud Image Upload</span>
          </div>

          {/* Error Alert */}
          {errorMsg && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs rounded-xl flex items-start gap-2.5">
              <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-rose-500" />
              <div>
                <span className="font-bold block mb-0.5">Quality Gate Rejection</span>
                <p className="leading-relaxed opacity-95">{errorMsg}</p>
              </div>
            </div>
          )}

          {/* Reset / Retake Button */}
          {imageSrc && !processing && (
            <button
              onClick={() => {
                setImageSrc(null);
                setQualityReport(null);
                setErrorMsg(null);
                setActiveHeatmapUrl(null);
                setShowHeatmapPreview(false);
              }}
              className="w-full border border-border bg-muted/40 hover:bg-muted text-foreground font-semibold py-2.5 rounded-xl text-xs transition-all touch-target"
            >
              Retake / Upload New Scan
            </button>
          )}

        </div>
      )}

    </div>
  );
};

export default ImageScanner;
