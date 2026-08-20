import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import type { Language } from '../../context/LanguageContext';
import { supabase } from '../../integrations/supabase/client';
import jsPDF from 'jspdf';
import {
  Bot,
  User,
  Send,
  Mic,
  MicOff,
  Sparkles,
  PhoneCall,
  ShieldAlert,
  Download,
  Stethoscope,
  RefreshCw,
  HelpCircle,
  Volume2,
  VolumeX,
  CheckCircle2,
  ArrowRight,
  FileCheck
} from 'lucide-react';

interface StructuredResponse {
  content: string;
  confidence: number;
  recommendations: string[];
  warnings: string[];
  sources: string[];
  followUp?: string;
  emergency_sos: boolean;
  specialist?: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text?: string;
  structured?: StructuredResponse;
  timestamp: string;
}

const HealthChat: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [quickTopics, setQuickTopics] = useState<{ label: string; query: string }[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Welcome Message & Quick Topics based on active language
  useEffect(() => {
    const welcomeText = language === 'or' 
      ? 'ନମସ୍କାର! ମୁଁ ଆପଣଙ୍କର AI ସ୍ୱାସ୍ଥ୍ୟ ସହାୟକ। ଆପଣଙ୍କର ଯେକୌଣସି ରୋଗର ଲକ୍ଷଣ, ଘରୋଇ ଉପଚାର କିମ୍ବା ଡାକ୍ତରୀ ପରାମର୍ଶ ବିଷୟରେ ଓଡ଼ିଆ, ହିନ୍ଦୀ ବା ଇଂରାଜୀରେ ପଚାରନ୍ତୁ।'
      : language === 'hi'
      ? 'नमस्ते! मैं आपका AI स्वास्थ्य सहायक हूँ। आप किसी भी बीमारी के लक्षण, घरेलू उपचार या डॉक्टर की सलाह के बारे में हिंदी, उड़िया या अंग्रेजी में पूछ सकते हैं।'
      : 'Hello! I am your AI Health Assistant. Ask me about any symptoms, safe home care, diet tips, or medical guidance in English, Hindi, or Odia.';

    setMessages([
      {
        id: 'welcome-msg',
        sender: 'bot',
        text: welcomeText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    // Localized quick prompts
    if (language === 'or') {
      setQuickTopics([
        { label: 'ମୋତେ ୩ ଦିନ ହେଲା ପ୍ରବଳ ଜ୍ୱର ଓ ଗଣ୍ଠି ବିନ୍ଧା (Dengue/Malaria)', query: 'ମୋତେ ୩ ଦିନ ହେଲା ପ୍ରବଳ ଜ୍ୱର ଏବଂ ଗଣ୍ଠି ବିନ୍ଧା ହେଉଛି' },
        { label: 'ଡାଇବେଟିସ୍ ପାଇଁ ଘରୋଇ ଖାଦ୍ୟ ତାଲିକା (Diabetes Diet)', query: 'ଡାଇବେଟିସ୍ ନିୟନ୍ତ୍ରଣ ପାଇଁ ଘରୋଇ ଖାଦ୍ୟ ତାଲିକା କ\'ଣ?' },
        { label: 'ଓଡ଼ିଶା ମମତା ଯୋଜନା ଓ ଗର୍ଭବତୀ ଯତ୍ନ (Maternal Health)', query: 'ଓଡ଼ିଶାରେ ଗର୍ଭବତୀ ମହିଳାଙ୍କ ପାଇଁ ମମତା ଯୋଜନା ବିଷୟରେ କୁହନ୍ତୁ' },
        { label: 'ବିଜୁ ସ୍ୱାସ୍ଥ୍ୟ କଲ୍ୟାଣ ଯୋଜନା (BSKY Guide)', query: 'ବିଜୁ ସ୍ୱାସ୍ଥ୍ୟ କଲ୍ୟାଣ ଯୋଜନା BSKY କାର୍ଡରେ ମାଗଣା ଚିକିତ୍ସା କିପରି ପାଇବେ?' }
      ]);
    } else if (language === 'hi') {
      setQuickTopics([
        { label: '3 दिन से तेज बुखार और सिरदर्द (Dengue/Malaria)', query: 'मुझे 3 दिन से तेज बुखार और सिरदर्द है, क्या करें?' },
        { label: 'डायबिटीज (शुगर) डाइट प्लान (Diabetes Diet)', query: 'डायबिटीज कंट्रोल करने के लिए भारतीय घरेलू डाइट प्लान बताएं' },
        { label: 'गर्भावस्था देखभाल एवं ममता योजना (Maternal Health)', query: 'गर्भावस्था के दौरान जरूरी देखभाल और ममता योजना के बारे में बताएं' },
        { label: 'आयुष्मान भारत कार्ड से मुफ्त इलाज (PM-JAY)', query: 'आयुष्मान भारत योजना के तहत मुफ्त अस्पताल में इलाज कैसे मिलता है?' }
      ]);
    } else {
      setQuickTopics([
        { label: 'High fever & body chills for 3 days', query: 'I have high fever and severe shivering for 3 days' },
        { label: 'Indian diet plan for Type 2 Diabetes', query: 'What is the best Indian diet and home remedies for managing diabetes?' },
        { label: 'Maternal health & Odisha MAMATA scheme', query: 'Tell me about maternal health guidelines and MAMATA scheme in Odisha' },
        { label: 'Ayushman Bharat PM-JAY hospital coverage', query: 'How to get free cashless treatment under Ayushman Bharat scheme?' }
      ]);
    }
  }, [language]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // 🔊 Text-to-Speech (TTS) Voice Readout Function
  const handleSpeak = (messageId: string, textToSpeak: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported on this browser.');
      return;
    }

    if (speakingMessageId === messageId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = textToSpeak.replace(/[*_#`•\[\]\(\)]/g, ' ').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Set voice language
    if (language === 'or') utterance.lang = 'or-IN';
    else if (language === 'hi') utterance.lang = 'hi-IN';
    else utterance.lang = 'en-IN';

    utterance.rate = 0.95; // Slightly slower for clinical clarity
    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    setSpeakingMessageId(messageId);
    window.speechSynthesis.speak(utterance);
  };

  // 🎤 Voice Input Setup (Web Speech API STT)
  const toggleRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice recognition is not supported on this browser. Please use Google Chrome or Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = false;
    recognition.interimResults = false;

    // Set recognition language
    if (language === 'or') recognition.lang = 'or-IN';
    else if (language === 'hi') recognition.lang = 'hi-IN';
    else recognition.lang = 'en-IN';

    recognition.onstart = () => setIsRecording(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      setIsRecording(false);
    };
    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);

    recognition.start();
  };

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputText;
    if (!textToSend.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      // 1. Invoke FastAPI LangGraph Backend /api/chat/message
      const response = await fetch('http://localhost:8000/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: textToSend, language })
      });

      if (response.ok) {
        const data: StructuredResponse = await response.json();
        setMessages(prev => [
          ...prev,
          {
            id: crypto.randomUUID(),
            sender: 'bot',
            structured: data,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        throw new Error('Local FastAPI RAG service unavailable, routing to edge fallback...');
      }
    } catch {
      // 2. Cloud Supabase Edge Function Fallback
      try {
        const { data } = await supabase.functions.invoke('symptom-checker', {
          body: { symptoms: [textToSend], notes: textToSend, lang: language }
        });

        const advisoryText = data?.advisory || 'Please drink plenty of water, rest, and consult a qualified doctor.';
        setMessages(prev => [
          ...prev,
          {
            id: crypto.randomUUID(),
            sender: 'bot',
            text: advisoryText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } catch (cloudErr: any) {
        setMessages(prev => [
          ...prev,
          {
            id: crypto.randomUUID(),
            sender: 'bot',
            text: '⚠️ Could not connect to AI health services. If you are experiencing an emergency, please dial 108 or 112 immediately.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Export consultation history as PDF
  const handleExportPdf = () => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    let y = 16;

    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageW, 24, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('AAROGYA SAHAYAK — CLINICAL CONSULTATION SUMMARY', 14, 12);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on: ${new Date().toLocaleString('en-IN')}`, 14, 18);

    y = 34;

    messages.forEach((msg) => {
      if (msg.sender === 'user') {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(99, 57, 249);
        doc.text(`Patient (${msg.timestamp}):`, 14, y);
        y += 5;
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(30, 41, 59);
        const lines = doc.splitTextToSize(msg.text || '', pageW - 28);
        doc.text(lines, 14, y);
        y += lines.length * 4.5 + 4;
      } else if (msg.structured) {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(16, 185, 129);
        doc.text(`AI Clinical Assessment:`, 14, y);
        y += 5;
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(51, 65, 85);
        const overviewLines = doc.splitTextToSize(msg.structured.content, pageW - 28);
        doc.text(overviewLines, 14, y);
        y += overviewLines.length * 4.5 + 4;

        if (msg.structured.recommendations && msg.structured.recommendations.length > 0) {
          doc.setFont('helvetica', 'bold');
          doc.text('Safe Home Care Guidance:', 14, y);
          y += 4.5;
          doc.setFont('helvetica', 'normal');
          msg.structured.recommendations.forEach(item => {
            const hLines = doc.splitTextToSize(`• ${item}`, pageW - 28);
            doc.text(hLines, 14, y);
            y += hLines.length * 4.5;
          });
          y += 3;
        }

        if (msg.structured.warnings && msg.structured.warnings.length > 0) {
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(220, 38, 38);
          doc.text('When to See a Doctor (Warning Signs):', 14, y);
          y += 4.5;
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(51, 65, 85);
          msg.structured.warnings.forEach(item => {
            const rLines = doc.splitTextToSize(`• ${item}`, pageW - 28);
            doc.text(rLines, 14, y);
            y += rLines.length * 4.5;
          });
          y += 3;
        }
      } else if (msg.text) {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(16, 185, 129);
        doc.text(`AI Assistant:`, 14, y);
        y += 5;
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(51, 65, 85);
        const lines = doc.splitTextToSize(msg.text, pageW - 28);
        doc.text(lines, 14, y);
        y += lines.length * 4.5 + 4;
      }
    });

    doc.save(`Arogya_Consultation_${Date.now()}.pdf`);
  };

  const languages: { code: Language; label: string; name: string }[] = [
    { code: 'en', label: 'EN', name: 'English' },
    { code: 'hi', label: 'हि', name: 'हिंदी' },
    { code: 'or', label: 'ଓ', name: 'ଓଡ଼ିଆ' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-12">
      
      {/* ── Top Header & Language Bar ──────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card border border-border p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-violet-600 to-primary flex items-center justify-center text-white shadow-md shadow-primary/20 shrink-0">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading font-extrabold text-lg text-foreground">
                {language === 'or' ? 'AI ସ୍ୱାସ୍ଥ୍ୟ ପରାମର୍ଶ ସାଥୀ' : language === 'hi' ? 'AI स्वास्थ्य परामर्श साथी' : 'AI Health Consultation Assistant'}
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-500/30 flex items-center gap-1">
                <FileCheck className="w-3 h-3" />
                <span>LangGraph RAG</span>
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {language === 'or' ? 'ଓଡ଼ିଆ, ହିନ୍ଦୀ ଏବଂ ଇଂରାଜୀରେ ୨୪/୭ ସ୍ୱାସ୍ଥ୍ୟ ସହାୟତା' : language === 'hi' ? 'हिंदी, उड़िया और अंग्रेजी में 24/7 स्वास्थ्य सहायता' : '24/7 Clinical triage in English, Hindi & Odia'}
            </p>
          </div>
        </div>

        {/* Action buttons & Language Switcher */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <div className="flex items-center bg-muted/60 p-1 rounded-xl border border-border">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => setLanguage(l.code)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  language === l.code
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {l.name}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportPdf}
            title="Download Consultation PDF"
            className="p-2 bg-card hover:bg-muted border border-border text-foreground rounded-xl transition-all shadow-sm"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Chat Messages Container ───────────────── */}
      <div className="bg-card border border-border rounded-2xl p-4 md:p-6 shadow-md min-h-[480px] max-h-[580px] overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
              msg.sender === 'user' 
                ? 'bg-primary text-white shadow-md shadow-primary/20' 
                : 'bg-violet-500/15 text-violet-600 dark:text-violet-400 border border-violet-500/25'
            }`}>
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Content Bubble */}
            <div className={`max-w-[85%] sm:max-w-[78%] space-y-2`}>
              {/* Text Message */}
              {msg.text && (
                <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm relative group ${
                  msg.sender === 'user'
                    ? 'bg-primary text-white rounded-tr-none'
                    : 'bg-muted/60 text-foreground border border-border rounded-tl-none'
                }`}>
                  <span>{msg.text}</span>
                  {msg.sender === 'bot' && (
                    <button
                      type="button"
                      onClick={() => handleSpeak(msg.id, msg.text || '')}
                      className="ml-2 p-1 text-muted-foreground hover:text-foreground inline-flex items-center align-middle"
                      title={speakingMessageId === msg.id ? 'Stop speaking' : 'Listen audio'}
                    >
                      {speakingMessageId === msg.id ? <VolumeX className="w-3.5 h-3.5 text-rose-500 animate-pulse" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
              )}

              {/* Structured Clinical Response Card */}
              {msg.structured && (
                <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-lg space-y-4 text-xs sm:text-sm">
                  {/* Top Bar: Confidence Score & Verification Badge */}
                  <div className="flex items-center justify-between gap-3 border-b border-border pb-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-primary/10 text-primary font-extrabold text-[10px] rounded-md border border-primary/20">
                        {Math.round(msg.structured.confidence * 100)}% Match Confidence
                      </span>
                      {msg.structured.sources && msg.structured.sources.length > 0 && (
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          <span>{msg.structured.sources[0]}</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* TTS Audio button */}
                      <button
                        type="button"
                        onClick={() => handleSpeak(msg.id, msg.structured?.content || '')}
                        className="p-1.5 bg-muted/60 hover:bg-muted text-foreground rounded-lg border border-border text-[11px] flex items-center gap-1 transition-all"
                        title={speakingMessageId === msg.id ? 'Stop speaking' : 'Listen to response'}
                      >
                        {speakingMessageId === msg.id ? <VolumeX className="w-3.5 h-3.5 text-rose-500 animate-pulse" /> : <Volume2 className="w-3.5 h-3.5 text-primary" />}
                        <span className="text-[10px] font-semibold">{speakingMessageId === msg.id ? 'Stop' : 'Listen'}</span>
                      </button>

                      {msg.structured.emergency_sos ? (
                        <span className="px-3 py-1 bg-rose-500/15 text-rose-600 dark:text-rose-400 font-extrabold text-xs rounded-full border border-rose-500/30 shrink-0">
                          🚨 EMERGENCY
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs rounded-full border border-emerald-500/30 shrink-0">
                          Verified Triage
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Main Clinical Content */}
                  <p className="text-foreground leading-relaxed font-medium whitespace-pre-line">
                    {msg.structured.content}
                  </p>

                  {/* Safe Home Care Recommendations (Green Action Card) */}
                  {msg.structured.recommendations && msg.structured.recommendations.length > 0 && (
                    <div className="space-y-2 bg-emerald-500/5 border border-emerald-500/20 p-3.5 rounded-xl">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400 text-xs">
                        <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>
                          {language === 'or' ? 'ଘରୋଇ ଉପଚାର ଓ ଆହାର ପରାମର୍ଶ:' : language === 'hi' ? 'घरेलू उपचार एवं आहार सलाह:' : 'Safe Home Care & Diet Guidance:'}
                        </span>
                      </div>
                      <ul className="space-y-1.5 pl-4 text-xs text-foreground/85 list-disc leading-relaxed">
                        {msg.structured.recommendations.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Red Flag Warnings (Red Alert Card) */}
                  {msg.structured.warnings && msg.structured.warnings.length > 0 && (
                    <div className="space-y-2 bg-amber-500/5 border border-amber-500/20 p-3.5 rounded-xl">
                      <div className="flex items-center gap-1.5 font-bold text-amber-700 dark:text-amber-400 text-xs">
                        <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                        <span>
                          {language === 'or' ? 'ଡାକ୍ତରଙ୍କୁ କେବେ ଦେଖାଇବେ (ବିପଦ ସଙ୍କେତ):' : language === 'hi' ? 'डॉक्टर को कब दिखाएं (चेतावनी के लक्षण):' : 'When to See a Doctor (Red Flags):'}
                        </span>
                      </div>
                      <ul className="space-y-1.5 pl-4 text-xs text-foreground/85 list-disc leading-relaxed">
                        {msg.structured.warnings.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Interactive Follow-Up Chip Prompt */}
                  {msg.structured.followUp && (
                    <div className="p-3 bg-muted/40 border border-border rounded-xl flex items-center justify-between gap-2">
                      <span className="text-xs text-muted-foreground italic">
                        {msg.structured.followUp}
                      </span>
                      <button
                        onClick={() => navigate('/doctors', { 
                          state: { 
                            prefillSpecialist: msg.structured?.specialist, 
                            triageSummary: msg.structured?.content 
                          } 
                        })}
                        className="text-xs font-bold text-primary hover:underline flex items-center gap-1 shrink-0"
                      >
                        <span>Find Doctors</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {/* Action CTA Buttons */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                    {msg.structured.emergency_sos && (
                      <a
                        href="tel:108"
                        className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs shadow-md shadow-rose-500/20 transition-all touch-target animate-pulse"
                      >
                        <PhoneCall className="w-4 h-4" />
                        <span>Call 108 Emergency Ambulance</span>
                      </a>
                    )}

                    <button
                      onClick={() => navigate('/doctors', { 
                        state: { 
                          prefillSpecialist: msg.structured?.specialist, 
                          triageSummary: msg.structured?.content 
                        } 
                      })}
                      className="flex-1 bg-primary hover:bg-primary/95 text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs shadow-md shadow-primary/20 transition-all touch-target"
                    >
                      <Stethoscope className="w-4 h-4" />
                      <span>{msg.structured.specialist || 'Consult Specialist Doctor'}</span>
                    </button>
                  </div>
                </div>
              )}

              <span className="text-[10px] text-muted-foreground block px-1">
                {msg.timestamp}
              </span>
            </div>
          </motion.div>
        ))}

        {/* Loading Spinner */}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground p-3 bg-muted/40 rounded-xl w-fit">
            <RefreshCw className="w-4 h-4 text-primary animate-spin" />
            <span>
              {language === 'or' ? 'LangGraph ସ୍ୱାସ୍ଥ୍ୟ ତଥ୍ୟ ଯାଞ୍ଚ କରାଯାଉଛି...' : language === 'hi' ? 'LangGraph स्वास्थ्य जानकारी जांची जा रही है...' : 'Running LangGraph clinical state machine...'}
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Quick Symptom Chips ───────────────────── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-[11px] font-bold text-muted-foreground shrink-0 flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-primary" />
          <span>Suggestions:</span>
        </span>
        {quickTopics.map((topic, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(topic.query)}
            disabled={loading}
            className="text-xs bg-card hover:bg-muted border border-border px-3 py-1.5 rounded-full font-medium text-foreground whitespace-nowrap shrink-0 shadow-sm transition-all hover:border-primary/50"
          >
            {topic.label}
          </button>
        ))}
      </div>

      {/* ── Input Bar ─────────────────────────────── */}
      <div className="relative flex items-center gap-2 bg-card border border-border rounded-2xl p-2 shadow-lg">
        {/* Voice Input Button */}
        <button
          type="button"
          onClick={toggleRecording}
          disabled={loading}
          className={`p-3 rounded-xl transition-all shrink-0 ${
            isRecording
              ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/30'
              : 'bg-muted/70 hover:bg-muted text-foreground'
          }`}
          title={isRecording ? 'Listening... Click to stop' : `Voice input in ${language.toUpperCase()}`}
        >
          {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* Text Input */}
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder={
            isRecording
              ? 'Listening to voice...'
              : language === 'or'
              ? 'ଲକ୍ଷଣ ବା ସ୍ୱାସ୍ଥ୍ୟ ପ୍ରଶ୍ନ ଲେଖନ୍ତୁ (ଯଥା: ମୁଣ୍ଡ ବିନ୍ଧା, ଜ୍ୱର, ମମତା ଯୋଜନା)...'
              : language === 'hi'
              ? 'लक्षण या बीमारी के बारे में लिखें (जैसे: सिरदर्द, बुखार, ममता योजना)...'
              : 'Type your symptoms or health query (e.g., fever, chest pain, diabetes diet)...'
          }
          className="flex-1 bg-transparent text-sm text-foreground focus:outline-none px-2 placeholder:text-muted-foreground"
          disabled={loading}
        />

        {/* Send Button */}
        <button
          type="button"
          onClick={() => handleSendMessage()}
          disabled={!inputText.trim() || loading}
          className="p-3 bg-primary hover:bg-primary/95 disabled:opacity-50 text-white rounded-xl transition-all shrink-0 shadow-md shadow-primary/20 touch-target"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};

export default HealthChat;
