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
  domainLabels?: string[];
  toolId?: string;
  rgb: string;
  textClass: string;
  bgClass: string;
  gradientClass: string;
  glowClass: string;
}

const ImageScanner: React.FC<ImageScannerProps> = ({ 
  onScanComplete, 
  guidance,
  domainLabels,
  toolId,
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
  const lastInferredSrcRef = useRef<string | null>(null);

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
    lastInferredSrcRef.current = null;
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
    lastInferredSrcRef.current = null;
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRunInference = async () => {
    if (!imageRef.current || !modelReady || !imageSrc) return;
    
    // Prevent re-triggering inference if the image has already been analyzed
    if (lastInferredSrcRef.current === imageSrc) return;
    lastInferredSrcRef.current = imageSrc;

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

      // 2. Run local MobileNet feature extraction + Grad-CAM generation with domain mapping
      const result = await extractFeatures(imageRef.current, domainLabels, toolId);

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
                {/* Base Image */}
                <img 
                  ref={imageRef}
                  src={imageSrc} 
                  alt="Upload preview" 
                  className={`max-h-[260px] w-auto object-contain rounded-lg transition-opacity duration-300 ${showHeatmapPreview ? 'opacity-0' : 'opacity-100'}`}
                  onLoad={handleRunInference}
                />

                {/* Heatmap Overlay View */}
                {showHeatmapPreview && activeHeatmapUrl && (
                  <img 
                    src={activeHeatmapUrl} 
                    alt="Grad-CAM Heatmap Overlay" 
                    className="absolute inset-0 max-h-[260px] w-auto mx-auto my-auto object-contain rounded-lg shadow-lg"
                  />
                )}

                {/* Local scan badge */}
                <div className="absolute top-3 right-3 bg-card/90 backdrop-blur px-2.5 py-1 rounded-full border border-border text-[10px] font-bold text-foreground shadow-sm">
                  {showHeatmapPreview ? '🔥 Grad-CAM Overlay' : 'Local Scan View'}
                </div>

                {/* Heatmap Preview Toggle if available */}
                {activeHeatmapUrl && !processing && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowHeatmapPreview(!showHeatmapPreview);
                    }}
                    className="absolute bottom-3 right-3 bg-card/95 hover:bg-card border border-border px-3 py-1.5 rounded-xl text-xs font-bold text-foreground shadow-lg flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer z-20"
                  >
                    {showHeatmapPreview ? (
                      <>
                        <Eye className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Show Original Scan</span>
                      </>
                    ) : (
                      <>
                        <Flame className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                        <span>Preview Heatmap</span>
                      </>
                    )}
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

            {/* In-flight scanning laser & spinner */}
            {processing && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-30">
                <div className="relative">
                  <div className={`w-12 h-12 rounded-full ${bgClass} flex items-center justify-center`}>
                    <RefreshCw className={`w-6 h-6 ${textClass} animate-spin`} />
                  </div>
                </div>
                <span className="text-xs font-bold text-foreground tracking-wide">
                  Extracting 1024-D CNN Activation Tensor...
                </span>
              </div>
            )}
          </div>

          {/* 3. Quality & Edge Feedback Flags */}
          {qualityReport && (
            <div className="p-3 bg-card/60 border border-border rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                {qualityReport.isAcceptable ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                )}
                <span className="font-semibold text-foreground">
                  Image Quality: <strong className="capitalize">{qualityReport.status}</strong>
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-mono">
                <span>Sharpness: {qualityReport.blurScore}</span>
                <span>Brightness: {qualityReport.brightnessScore}</span>
              </div>
            </div>
          )}

          {/* Error display */}
          {errorMsg && (
            <div className="p-3.5 bg-destructive/10 border border-destructive/20 rounded-xl flex items-start gap-2.5 text-xs text-red-500 dark:text-red-400">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{errorMsg}</span>
            </div>
          )}

          {/* Action button bar */}
          {imageSrc && !processing && (
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  setImageSrc(null);
                  setQualityReport(null);
                  setErrorMsg(null);
                  setActiveHeatmapUrl(null);
                  setShowHeatmapPreview(false);
                  lastInferredSrcRef.current = null;
                }}
                className="px-4 py-2 border border-border text-xs font-semibold rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
              >
                Retake / Upload New Scan
              </button>

              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground bg-muted/60 px-3 py-1.5 rounded-lg font-mono flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-emerald-500" />
                  On-Device Neural Inference &bull; Zero Cloud Image Upload
                </span>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default ImageScanner;
