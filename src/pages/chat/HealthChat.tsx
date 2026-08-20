import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import type { Language } from '../../context/LanguageContext';
import { getClinicalAssessment } from '../../services/clinicalAIService';
import type { StructuredResponse } from '../../services/clinicalAIService';
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
  Volume2,
  VolumeX,
  CheckCircle2,
  Zap
} from 'lucide-react';

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
  const [quickTopics, setQuickTopics] = useState<{ label: string; query: string; icon: string }[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Welcome Message & Quick Topics based on active language
  useEffect(() => {
    const welcomeText = language === 'or' 
      ? 'ନମସ୍କାର! ମୁଁ ଆପଣଙ୍କର AI ସ୍ୱାସ୍ଥ୍ୟ ସହାୟକ। ଆପଣଙ୍କର ଯେକୌଣସି ରୋଗର ଲକ୍ଷଣ, ଘରୋଇ ଉପଚାର କିମ୍ବା ଡାକ୍ତରୀ ପରାମର୍ଶ ବିଷୟରେ ଓଡ଼ିଆ, ହିନ୍ଦୀ ବା ଇଂରାଜୀରେ ପଚାରନ୍ତୁ।'
      : language === 'hi'
      ? 'नमस्ते! मैं आपका AI स्वास्थ्य सहायक हूँ। आप किसी भी बीमारी के लक्षण, घरेलू उपचार या डॉक्टर की सलाह के बारे में हिंदी, उड़िया या अंग्रेजी में पूछ सकते हैं।'
      : 'Hello! I\'m your AI Health Assistant powered by clinical intelligence. Ask me about symptoms, home remedies, diet guidance, or when to see a doctor — in English, Hindi, or Odia.';

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
        { label: 'ଜ୍ୱର ଓ ଗଣ୍ଠି ବିନ୍ଧା', query: 'ମୋତେ ୩ ଦିନ ହେଲା ପ୍ରବଳ ଜ୍ୱର ଏବଂ ଗଣ୍ଠି ବିନ୍ଧା ହେଉଛି', icon: '🤒' },
        { label: 'ଡାଇବେଟିସ୍ ଡାଏଟ୍', query: 'ଡାଇବେଟିସ୍ ନିୟନ୍ତ୍ରଣ ପାଇଁ ଘରୋଇ ଖାଦ୍ୟ ତାଲିକା କ\'ଣ?', icon: '🍽️' },
        { label: 'ମମତା ଯୋଜନା', query: 'ଓଡ଼ିଶାରେ ଗର୍ଭବତୀ ମହିଳାଙ୍କ ପାଇଁ ମମତା ଯୋଜନା ବିଷୟରେ କୁହନ୍ତୁ', icon: '🤰' },
        { label: 'BSKY କାର୍ଡ', query: 'ବିଜୁ ସ୍ୱାସ୍ଥ୍ୟ କଲ୍ୟାଣ ଯୋଜନା BSKY କାର୍ଡରେ ମାଗଣା ଚିକିତ୍ସା କିପରି ପାଇବେ?', icon: '🏥' }
      ]);
    } else if (language === 'hi') {
      setQuickTopics([
        { label: 'बुखार और सिरदर्द', query: 'मुझे 3 दिन से तेज बुखार और सिरदर्द है, क्या करें?', icon: '🤒' },
        { label: 'डायबिटीज डाइट', query: 'डायबिटीज कंट्रोल करने के लिए भारतीय घरेलू डाइट प्लान बताएं', icon: '🍽️' },
        { label: 'गर्भावस्था देखभाल', query: 'गर्भावस्था के दौरान जरूरी देखभाल और ममता योजना के बारे में बताएं', icon: '🤰' },
        { label: 'आयुष्मान भारत', query: 'आयुष्मान भारत योजना के तहत मुफ्त अस्पताल में इलाज कैसे मिलता है?', icon: '🏥' }
      ]);
    } else {
      setQuickTopics([
        { label: 'Fever & Chills', query: 'I have high fever and severe shivering for 3 days', icon: '🤒' },
        { label: 'Diabetes Diet', query: 'What is the best Indian diet and home remedies for managing diabetes?', icon: '🍽️' },
        { label: 'Maternal Health', query: 'Tell me about maternal health guidelines and MAMATA scheme in Odisha', icon: '🤰' },
        { label: 'Ayushman Bharat', query: 'How to get free cashless treatment under Ayushman Bharat scheme?', icon: '🏥' }
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

    utterance.rate = 0.95;
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
      // 1. If a custom Cloud Backend URL is configured, try it first
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      if (backendUrl) {
        try {
          const response = await fetch(`${backendUrl.replace(/\/$/, '')}/api/chat/message`, {
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
            setLoading(false);
            return;
          }
        } catch (e) {
          console.warn('Backend URL unreachable, proceeding to Cloud AI clinical engine...');
        }
      }

      // 2. Multi-tier Cloud AI & Clinical Assessment (Groq Cloud AI -> Supabase Edge -> Clinical Engine)
      const clinicalData = await getClinicalAssessment(textToSend, language);

      setMessages(prev => [
        ...prev,
        {
          id: crypto.randomUUID(),
          sender: 'bot',
          structured: clinicalData,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      console.error('Chat evaluation error:', err);
      // Fallback emergency message
      setMessages(prev => [
        ...prev,
        {
          id: crypto.randomUUID(),
          sender: 'bot',
          structured: {
            content: language === 'or'
              ? `"${textToSend}" ସମ୍ବନ୍ଧରେ ଡାକ୍ତରଙ୍କ ପରାମର୍ଶ ନିଅନ୍ତୁ। ପର୍ଯ୍ୟାପ୍ତ ବିଶ୍ରାମ ଓ ପାଣି ପିଅନ୍ତୁ।`
              : language === 'hi'
              ? `"${textToSend}" के संबंध में कृपया डॉक्टर से परामर्श लें और पर्याप्त आराम करें।`
              : `Regarding "${textToSend}": Please consult a qualified doctor for proper diagnosis and care.`,
            confidence: 0.80,
            recommendations: [
              language === 'or' ? 'ପର୍ଯ୍ୟାପ୍ତ ବିଶ୍ରାମ କରନ୍ତୁ।' : language === 'hi' ? 'पर्याप्त आराम करें।' : 'Ensure adequate rest and hydration.',
              language === 'or' ? 'ଡାକ୍ତରଙ୍କ ସହିତ ଯୋଗାଯୋଗ କରନ୍ତୁ।' : language === 'hi' ? 'डॉक्टर से मिलें।' : 'Consult a certified doctor.'
            ],
            warnings: [
              language === 'or' ? 'ଲକ୍ଷଣ ବଢ଼ିଲେ ୧୦୮ କଲ୍ କରନ୍ତୁ।' : language === 'hi' ? 'आपातकाल में 108 डायल करें।' : 'In emergency, call 108 immediately.'
            ],
            sources: ['Arogya Sahayak Public Health Database'],
            emergency_sos: false,
            specialist: 'General Physician'
          },
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
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

  const getConfidenceColor = (c: number) => {
    if (c >= 0.85) return 'from-emerald-500 to-teal-500';
    if (c >= 0.6) return 'from-amber-500 to-orange-500';
    return 'from-rose-500 to-red-500';
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-120px)] relative">
      
      {/* ── Decorative Background Blurs ──────────── */}
      <div className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-violet-500/15 to-primary/10 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -left-10 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-teal-400/10 rounded-full blur-3xl" />

      {/* ── Premium Header with Continuous Live Gradient Animation ── */}
      <motion.div 
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 animate-live-gradient rounded-2xl p-4 sm:p-5 shadow-2xl shadow-primary/25 mb-4 overflow-hidden border border-white/20"
      >
        {/* Floating Aurora Glow Orbs */}
        <div className="pointer-events-none absolute -top-12 -left-12 w-48 h-48 bg-white/20 rounded-full blur-2xl animate-float-slow" />
        <div className="pointer-events-none absolute -bottom-12 -right-12 w-48 h-48 bg-cyan-300/25 rounded-full blur-2xl animate-float" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-32 bg-fuchsia-400/20 rounded-full blur-3xl animate-pulse-slow" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner border border-white/30">
                <Bot className="w-6 h-6" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white animate-pulse" />
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full animate-ping opacity-75" />
            </div>
            <div>
              <h1 className="font-heading font-extrabold text-white text-base sm:text-lg flex items-center gap-2 drop-shadow-sm">
                {language === 'or' ? 'AI ସ୍ୱାସ୍ଥ୍ୟ ସାଥୀ' : language === 'hi' ? 'AI स्वास्थ्य साथी' : 'AI Health Assistant'}
                <span className="text-[9px] font-bold px-2.5 py-0.5 bg-white/20 text-white rounded-full border border-white/30 flex items-center gap-1 backdrop-blur-md shadow-sm">
                  <Zap className="w-2.5 h-2.5 text-amber-300 animate-pulse" />
                  <span>Clinical AI</span>
                </span>
              </h1>
              <p className="text-white/90 text-[11px] sm:text-xs mt-0.5 font-medium flex items-center gap-1.5 drop-shadow-xs">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                <span>
                  {language === 'or' ? '২৪/୭ ସ୍ୱାସ୍ଥ୍ୟ ସହାୟତା • ଓଡ଼ିଆ, ହିନ୍ଦୀ, ଇଂରାଜୀ' : language === 'hi' ? '24/7 स्वास्थ्य सहायता • हिंदी, उड़िया, अंग्रेजी' : '24/7 clinical triage • English, Hindi & Odia'}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <div className="flex items-center bg-black/15 backdrop-blur-md p-1 rounded-xl border border-white/20 shadow-inner">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all outline-none focus:outline-none ${
                    language === l.code
                      ? 'bg-white text-violet-700 shadow-md font-extrabold'
                      : 'text-white/80 hover:text-white hover:bg-white/15'
                  }`}
                >
                  {l.name}
                </button>
              ))}
            </div>

            <button
              onClick={handleExportPdf}
              title="Download Consultation PDF"
              className="p-2.5 bg-white/15 hover:bg-white/25 active:scale-95 backdrop-blur-md border border-white/25 text-white rounded-xl transition-all shadow-sm outline-none focus:outline-none"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* ── Chat Messages Container ────────────── */}
      <div className="flex-1 bg-card/60 backdrop-blur-sm border border-border rounded-2xl shadow-lg overflow-hidden flex flex-col mb-3">
        <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-5">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className={`flex items-end gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 400, damping: 20 }}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 shadow-md ${
                    msg.sender === 'user' 
                      ? 'bg-gradient-to-br from-primary to-violet-600 text-white' 
                      : 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white'
                  }`}
                >
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </motion.div>

                {/* Content Bubble */}
                <div className={`max-w-[82%] sm:max-w-[75%] space-y-2`}>
                  {/* Plain Text Message */}
                  {msg.text && (
                    <div className={`relative group ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-br from-primary to-violet-600 text-white rounded-2xl rounded-br-md px-4 py-3 shadow-lg shadow-primary/15'
                        : 'bg-card border border-border/80 text-foreground rounded-2xl rounded-bl-md px-4 py-3 shadow-sm'
                    }`}>
                      <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-body font-normal">
                        {msg.text}
                      </p>

                      {/* TTS Speak Button for Bot Messages */}
                      {msg.sender === 'bot' && (
                        <button
                          onClick={() => handleSpeak(msg.id, msg.text || '')}
                          className="mt-2 text-[11px] text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors outline-none focus:outline-none"
                          title="Listen to message"
                        >
                          {speakingMessageId === msg.id ? (
                            <>
                              <VolumeX className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                              <span className="text-rose-500 font-semibold">Stop Voice</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>Listen</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  )}

                  {/* Structured Clinical Response Card */}
                  {msg.structured && (
                    <div className="bg-card border border-border rounded-2xl rounded-bl-md p-4 sm:p-5 shadow-md space-y-4">
                      
                      {/* Card Header & Confidence */}
                      <div className="flex items-center justify-between pb-3 border-b border-border/60">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-xs font-bold font-heading text-foreground">
                            Clinical Health Guidance
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-16 sm:w-20 bg-muted rounded-full h-1.5 overflow-hidden">
                            <div 
                              className={`h-full bg-gradient-to-r ${getConfidenceColor(msg.structured.confidence || 0.85)}`}
                              style={{ width: `${Math.round((msg.structured.confidence || 0.85) * 100)}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-mono font-bold text-muted-foreground">
                            {Math.round((msg.structured.confidence || 0.85) * 100)}%
                          </span>
                        </div>
                      </div>

                      {/* Primary Clinical Advice */}
                      <div className="space-y-1">
                        <p className="text-xs sm:text-sm text-foreground/90 font-medium leading-relaxed">
                          {msg.structured.content}
                        </p>
                      </div>

                      {/* Safe Home Care Recommendations */}
                      {msg.structured.recommendations && msg.structured.recommendations.length > 0 && (
                        <div className="bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3.5 space-y-2">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                            <span>Recommended Care & Remedies</span>
                          </div>
                          <ul className="space-y-1.5">
                            {msg.structured.recommendations.map((rec, i) => (
                              <li key={i} className="text-xs text-foreground/80 flex items-start gap-2">
                                <span className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Red Flags / Warning Signs */}
                      {msg.structured.warnings && msg.structured.warnings.length > 0 && (
                        <div className="bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/20 rounded-xl p-3.5 space-y-2">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400">
                            <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                            <span>When to Consult a Doctor (Red Flags)</span>
                          </div>
                          <ul className="space-y-1.5">
                            {msg.structured.warnings.map((warn, i) => (
                              <li key={i} className="text-xs text-foreground/80 flex items-start gap-2">
                                <span className="w-1 h-1 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                                <span>{warn}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Actions Footer: TTS + SOS + Doctor Direct Appointment */}
                      <div className="pt-2 border-t border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <button
                          onClick={() => handleSpeak(msg.id, `${msg.structured?.content}. Care guidance: ${msg.structured?.recommendations?.join(', ')}`)}
                          className="text-[11px] text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors outline-none focus:outline-none"
                        >
                          {speakingMessageId === msg.id ? (
                            <>
                              <VolumeX className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                              <span className="text-rose-500 font-semibold">Stop Voice</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>Listen to Assessment</span>
                            </>
                          )}
                        </button>

                        <div className="flex items-center gap-2">
                          {/* 108 Emergency Call */}
                          <a
                            href="tel:108"
                            className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 px-3 rounded-xl flex items-center gap-1.5 text-[11px] shadow-sm transition-all outline-none focus:outline-none"
                          >
                            <PhoneCall className="w-3.5 h-3.5" />
                            <span>108 SOS</span>
                          </a>

                          {/* Pre-fill Doctor Booking */}
                          <button
                            onClick={() => navigate('/doctors', { 
                              state: { 
                                specialist: msg.structured?.specialist, 
                                triageSummary: msg.structured?.content 
                              } 
                            })}
                            className="bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90 text-white font-bold py-2 px-3 rounded-xl flex items-center gap-1.5 text-[11px] shadow-md shadow-primary/20 transition-all outline-none focus:outline-none"
                          >
                            <Stethoscope className="w-3.5 h-3.5" />
                            <span>{msg.structured.specialist || 'Consult Specialist'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <span className="text-[10px] text-muted-foreground/70 block px-1 mt-1">
                    {msg.timestamp}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* ── Typing Indicator ──────────────────── */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex items-end gap-2.5"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-card border border-border rounded-2xl rounded-bl-md px-5 py-3.5 shadow-sm">
                  <div className="flex items-center gap-1.5">
                    <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} className="w-2 h-2 bg-primary/60 rounded-full" />
                    <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }} className="w-2 h-2 bg-primary/60 rounded-full" />
                    <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }} className="w-2 h-2 bg-primary/60 rounded-full" />
                    <span className="text-[11px] text-muted-foreground ml-2 font-medium">
                      {language === 'or' ? 'ବିଶ୍ଳେଷଣ ହେଉଛି...' : language === 'hi' ? 'विश्लेषण हो रहा है...' : 'Analyzing...'}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ── Quick Suggestion Chips ─────────────── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar mb-2">
        <span className="text-[10px] font-bold text-muted-foreground shrink-0 flex items-center gap-1 uppercase tracking-wider">
          <Sparkles className="w-3 h-3 text-primary" />
          <span>Quick Ask</span>
        </span>
        {quickTopics.map((topic, idx) => (
          <motion.button
            key={idx}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleSendMessage(topic.query)}
            disabled={loading}
            className="text-[11px] bg-card hover:bg-muted border border-border px-3.5 py-2 rounded-xl font-semibold text-foreground whitespace-nowrap shrink-0 shadow-sm transition-all hover:border-primary/40 hover:shadow-md flex items-center gap-1.5 outline-none focus:outline-none"
          >
            <span>{topic.icon}</span>
            <span>{topic.label}</span>
          </motion.button>
        ))}
      </div>

      {/* ── Premium Input Bar ──────────────────── */}
      <motion.div 
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="relative flex items-center gap-2 bg-card border-2 border-border/80 hover:border-primary/40 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/15 rounded-2xl p-2 shadow-xl shadow-black/5 transition-all duration-200"
      >
        {/* Voice Input */}
        <button
          type="button"
          onClick={toggleRecording}
          disabled={loading}
          className={`p-3 rounded-xl transition-all shrink-0 outline-none focus:outline-none ${
            isRecording
              ? 'bg-gradient-to-br from-rose-500 to-red-500 text-white shadow-lg shadow-rose-500/30 animate-pulse'
              : 'bg-muted/70 hover:bg-muted text-muted-foreground hover:text-foreground active:scale-95'
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
              ? (language === 'or' ? 'ଶୁଣୁଛି...' : language === 'hi' ? 'सुन रहा हूँ...' : 'Listening...')
              : language === 'or'
              ? 'ଲକ୍ଷଣ ବା ସ୍ୱାସ୍ଥ୍ୟ ପ୍ରଶ୍ନ ଲେଖନ୍ତୁ...'
              : language === 'hi'
              ? 'लक्षण या स्वास्थ्य प्रश्न लिखें...'
              : 'Describe your symptoms or ask a health question...'
          }
          className="chat-input-field flex-1 bg-transparent text-sm text-foreground outline-none border-none ring-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 shadow-none px-2 placeholder:text-muted-foreground/60"
          disabled={loading}
        />

        {/* Send Button */}
        <button
          type="button"
          onClick={() => handleSendMessage()}
          disabled={!inputText.trim() || loading}
          className="p-3 bg-gradient-to-br from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90 disabled:opacity-40 disabled:from-muted disabled:to-muted text-white rounded-xl transition-all shrink-0 shadow-lg shadow-primary/25 outline-none focus:outline-none active:scale-95"
        >
          <Send className="w-4.5 h-4.5" />
        </button>
      </motion.div>

    </div>
  );
};

export default HealthChat;
