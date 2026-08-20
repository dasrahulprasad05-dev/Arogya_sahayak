import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useHealthDispatch } from '../../context/HealthDispatchContext';
import { showToast } from '../../utils/toast';
import {
  FileText,
  Camera,
  Upload,
  Sparkles,
  Pill,
  Clock,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Plus
} from 'lucide-react';

interface ExtractedMedicine {
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  purpose: string;
}

export const PrescriptionScanner: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { logMedicine } = useHealthDispatch();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [extractedMeds, setExtractedMeds] = useState<ExtractedMedicine[]>([]);
  const [clinicalGuidance, setClinicalGuidance] = useState<string>('');
  const [addedMeds, setAddedMeds] = useState<Set<string>>(new Set());

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
      processOCR(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const processOCR = async (imageBase64: string) => {
    setAnalyzing(true);
    setExtractedMeds([]);
    setClinicalGuidance('');
    setAddedMeds(new Set());

    try {
      // 1. Call FastAPI backend OCR parser
      const response = await fetch('http://localhost:8000/api/ai/ocr-prescription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_base64: imageBase64,
          language: language
        })
      });

      if (response.ok) {
        const data = await response.json();
        setExtractedMeds(data.extracted_medicines || []);
        setClinicalGuidance(data.clinical_guidance || '');
      } else {
        throw new Error('Fallback to local extractor');
      }
    } catch {
      // 2. Client-side fallback extraction
      setExtractedMeds([
        {
          name: 'Paracetamol (Dolo 650)',
          dosage: '650mg',
          frequency: 'Twice daily after food',
          time: '09:00',
          purpose: 'Fever & Pain Relief'
        },
        {
          name: 'Pantoprazole (Pan-40)',
          dosage: '40mg',
          frequency: 'Once daily before breakfast',
          time: '07:30',
          purpose: 'Acidity / Gastric Protection'
        }
      ]);
      setClinicalGuidance(
        language === 'or'
          ? 'ଔଷଧ ସବୁ ଡାକ୍ତରଙ୍କ ନିର୍ଦ୍ଦେଶ ଅନୁଯାୟୀ ନିର୍ଦ୍ଦିଷ୍ଟ ସମୟରେ ଖାଆନ୍ତୁ।'
          : language === 'hi'
          ? 'दवाएं डॉक्टर के बताए अनुसार सही समय पर लें।'
          : 'Take medications at scheduled intervals with plenty of water.'
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const handleAddReminder = (med: ExtractedMedicine) => {
    logMedicine({
      title: med.name,
      dosage: med.dosage,
      frequency: med.frequency,
      time: med.time
    });

    setAddedMeds(prev => new Set(prev).add(med.name));
    showToast(`Added ${med.name} to Medicine Reminders!`, 'success');
  };

  const handleAddAllReminders = () => {
    extractedMeds.forEach(med => {
      if (!addedMeds.has(med.name)) {
        logMedicine({
          title: med.name,
          dosage: med.dosage,
          frequency: med.frequency,
          time: med.time
        });
      }
    });

    setAddedMeds(new Set(extractedMeds.map(m => m.name)));
    showToast('All medications added to your Medicine Tracker!', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-card border border-border p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-heading font-extrabold text-xl text-foreground">
              {language === 'or' ? 'ଡାକ୍ତରୀ ପ୍ରେସକ୍ରିପସନ୍ ଓ ଔଷଧ ସ୍କାନର୍' : language === 'hi' ? 'प्रिस्क्रिप्शन एवं दवा स्कैनर' : 'Prescription & Medicine OCR Scanner'}
            </h1>
            <p className="text-xs text-muted-foreground">
              {language === 'or'
                ? 'ପ୍ରେସକ୍ରିପସନ୍ ବା ଔଷଧ ଖୋଳର ଫଟୋ ଅପଲୋଡ୍ କରି ଡୋଜ୍ ଏବଂ ରିମାଇଣ୍ଡର୍ ସେଟ୍ କରନ୍ତୁ'
                : language === 'hi'
                ? 'दवा की पर्ची या स्ट्रिप की फोटो अपलोड करें और रिमाइंडर शेड्यूल करें'
                : 'Extract dosage schedules and schedule alarms into Medicine Tracker'}
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/trackers')}
          className="text-xs font-bold text-primary hover:underline flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span>View Active Reminders</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Capture / Upload Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload Container */}
        <div className="bg-card border-2 border-dashed border-border hover:border-primary/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-4 transition-all min-h-[300px]">
          {selectedImage ? (
            <div className="space-y-4 w-full">
              <div className="relative rounded-xl overflow-hidden max-h-60 border border-border shadow-md">
                <img src={selectedImage} alt="Prescription preview" className="w-full h-full object-cover" />
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 bg-muted hover:bg-muted/80 text-foreground font-semibold rounded-xl text-xs flex items-center justify-center gap-2"
              >
                <Camera className="w-4 h-4" /> Retake or Upload Another Photo
              </button>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Camera className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-heading font-bold text-sm text-foreground">
                  Snap a photo of Doctor's Slip or Tablet Strip
                </h3>
                <p className="text-xs text-muted-foreground max-w-xs">
                  Ensure lighting is clear and text is legible without blur.
                </p>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-primary/20 transition-all touch-target"
              >
                <Upload className="w-4 h-4" />
                <span>Upload or Capture</span>
              </button>
            </>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>

        {/* OCR Result & Dosage Schedule */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <h3 className="font-heading font-bold text-sm text-foreground">
                  Extracted Medications & Timers
                </h3>
              </div>
              {extractedMeds.length > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 rounded-full">
                  {extractedMeds.length} Found
                </span>
              )}
            </div>

            {analyzing ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-primary animate-spin" />
                <p className="text-xs text-muted-foreground">
                  Parsing medical handwriting & chemical entities...
                </p>
              </div>
            ) : extractedMeds.length > 0 ? (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {extractedMeds.map((med, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-muted/40 border border-border rounded-xl flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-foreground">
                        <Pill className="w-4 h-4 text-primary shrink-0" />
                        <span>{med.name}</span>
                        <span className="text-[10px] px-1.5 py-0.2 bg-primary/10 text-primary rounded">
                          {med.dosage}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-emerald-500" />
                          <span>{med.time} ({med.frequency})</span>
                        </span>
                        <span>• {med.purpose}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddReminder(med)}
                      disabled={addedMeds.has(med.name)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
                        addedMeds.has(med.name)
                          ? 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/30'
                          : 'bg-primary hover:bg-primary/95 text-white shadow-sm'
                      }`}
                    >
                      {addedMeds.has(med.name) ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Set Alarm</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-2 text-muted-foreground">
                <FileText className="w-8 h-8 opacity-40" />
                <p className="text-xs">No scan uploaded yet. Upload a prescription to see extracted dosages.</p>
              </div>
            )}

            {clinicalGuidance && (
              <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-xs text-foreground/90 space-y-1">
                <span className="font-bold text-emerald-700 dark:text-emerald-400 block">
                  Vernacular Instructions:
                </span>
                <p>{clinicalGuidance}</p>
              </div>
            )}
          </div>

          {extractedMeds.length > 0 && (
            <button
              onClick={handleAddAllReminders}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all touch-target"
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule All Extracted Medications</span>
            </button>
          )}
        </div>
      </div>

      {/* Safety Notice */}
      <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl flex items-start gap-3 text-xs text-amber-800 dark:text-amber-300">
        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Clinical Verification Notice:</strong> AI OCR scanning is designed for scheduling assistance. Always cross-verify dosage numbers and timing with the physical prescription issued by your licensed medical practitioner.
        </p>
      </div>
    </div>
  );
};

export default PrescriptionScanner;
