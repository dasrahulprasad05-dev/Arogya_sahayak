import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Volume2,
  VolumeX,
  CheckCircle2,
  ArrowRight,
  FileCheck,
  Heart,
  Shield,
  MessageCircle,
  Zap
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

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    // 1. If a custom Cloud Backend URL is configured, invoke it
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
        console.warn('Cloud backend unreachable, falling back to Supabase Cloud functions...');
      }
    }

    // 2. Default Cloud Execution: Supabase Cloud Edge Functions
    try {
      const { data, error } = await supabase.functions.invoke('symptom-checker', {
        body: { symptoms: [textToSend], notes: textToSend, lang: language }
      });

      if (error) throw error;

      const advisoryText = data?.advisory || 'Please drink plenty of fluids, rest, and consult a certified medical doctor.';
      const specialist = data?.recommended_specialist || 'General Physician';
      const isEmergency = data?.emergency_alert || false;

      setMessages(prev => [
        ...prev,
        {
          id: crypto.randomUUID(),
          sender: 'bot',
          structured: {
            content: advisoryText,
            confidence: 0.90,
            recommendations: [
              language === 'or' ? 'ପ୍ରଚୁର ପାଣି ଓ ସୁପାଚ୍ୟ ଖାଦ୍ୟ ଖାଆନ୍ତୁ।' : language === 'hi' ? 'खूब पानी पिएं और सुपाच्य भोजन लें।' : 'Drink plenty of water and stay well hydrated.',
              language === 'or' ? 'ସମ୍ପୂର୍ଣ୍ଣ ବିଶ୍ରାମ ନିଅନ୍ତୁ।' : language === 'hi' ? 'पर्याप्त विश्राम करें।' : 'Ensure adequate rest and monitor temperature.'
            ],
            warnings: [
              language === 'or' ? 'ଲକ୍ଷଣ ୩ ଦିନରୁ ଅଧିକ ରହିଲେ ଡାକ୍ତରଙ୍କୁ ଦେଖାନ୍ତୁ।' : language === 'hi' ? 'लक्षण 3 दिन से अधिक रहने पर डॉक्टर से मिलें।' : 'Consult a doctor if symptoms persist beyond 3 days.'
            ],
            sources: ['Supabase Cloud AI Health Engine', 'Odisha Public Health Guidelines'],
            followUp: language === 'or' ? 'ଆପଣ କ\'ଣ ଡାକ୍ତରଙ୍କ ସହ ପରାମର୍ଶ କରିବାକୁ ଚାହାଁନ୍ତି?' : language === 'hi' ? 'क्या आप डॉक्टर से परामर्श करना चाहते हैं?' : 'Would you like to book a doctor consultation?',
            emergency_sos: isEmergency,
            specialist: specialist
          },
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch {
      // 3. Resilient Offline/Cloud fallback
      setMessages(prev => [
        ...prev,
        {
          id: crypto.randomUUID(),
          sender: 'bot',
          structured: {
            content: language === 'or'
              ? 'ଆପଣଙ୍କର ସ୍ୱାସ୍ଥ୍ୟ ସୁରକ୍ଷା ପାଇଁ ପର୍ଯ୍ୟାପ୍ତ ପାଣି ପିଅନ୍ତୁ ଏବଂ ନିକଟସ୍ଥ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର (PHC/CHC) ରେ ଡାକ୍ତରଙ୍କ ପରାମର୍ଶ ନିଅନ୍ତୁ।'
              : language === 'hi'
              ? 'कृपया पर्याप्त आराम करें, खूब पानी पिएं और नजदीकी स्वास्थ्य केंद्र पर डॉक्टर से सलाह लें।'
              : 'Please ensure adequate rest, maintain hydration with water and ORS, and consult a qualified physician.',
            confidence: 0.85,
            recommendations: [
              language === 'or' ? 'ପ୍ରଚୁର ପାଣି ଓ ତରଳ ଖାଦ୍ୟ ଗ୍ରହଣ କରନ୍ତୁ।' : language === 'hi' ? 'खूब पानी और तरल पदार्थ लें।' : 'Drink plenty of fluids and ORS.',
              language === 'or' ? 'ଡାକ୍ତରଙ୍କ ବିନା ପରାମର୍ଶରେ ଔଷଧ ଖାଆନ୍ତୁ ନାହିଁ।' : language === 'hi' ? 'बिना डॉक्टर की सलाह के दवा न लें।' : 'Avoid unprescribed self-medication.'
            ],
            warnings: [
              language === 'or' ? 'ଜରୁରୀକାଳୀନ ପରିସ୍ଥିତିରେ ୧୦୮ କଲ୍ କରନ୍ତୁ।' : language === 'hi' ? 'आपातकाल में 108 डायल करें।' : 'In case of emergency, dial 108 immediately.'
            ],
            sources: ['Arogya Sahayak Public Health Database'],
            followUp: 'Would you like to view verified doctors?',
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

      {/* ── Premium Header ──────────────────────── */}
      <motion.div 
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 bg-gradient-to-r from-violet-600 via-purple-600 to-primary rounded-2xl p-4 sm:p-5 shadow-xl shadow-primary/15 mb-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-white shadow-inner border border-white/20">
                <Bot className="w-6 h-6" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-violet-600 animate-pulse" />
            </div>
            <div>
              <h1 className="font-heading font-extrabold text-white text-base sm:text-lg flex items-center gap-2">
                {language === 'or' ? 'AI ସ୍ୱାସ୍ଥ୍ୟ ସାଥୀ' : language === 'hi' ? 'AI स्वास्थ्य साथी' : 'AI Health Assistant'}
                <span className="text-[9px] font-bold px-2 py-0.5 bg-white/15 text-white/90 rounded-full border border-white/20 flex items-center gap-1 backdrop-blur-sm">
                  <Zap className="w-2.5 h-2.5" />
                  <span>Clinical AI</span>
                </span>
              </h1>
              <p className="text-white/70 text-[11px] sm:text-xs mt-0.5">
                {language === 'or' ? '২৪/৭ ସ୍ୱାସ୍ଥ୍ୟ ସହାୟତା • ଓଡ଼ିଆ, ହିନ୍ଦୀ, ଇଂରାଜୀ' : language === 'hi' ? '24/7 स्वास्थ्य सहायता • हिंदी, उड़िया, अंग्रेजी' : '24/7 clinical triage • English, Hindi & Odia'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <div className="flex items-center bg-white/10 backdrop-blur-sm p-1 rounded-xl border border-white/15">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                    language === l.code
                      ? 'bg-white text-violet-700 shadow-sm'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {l.name}
                </button>
              ))}
            </div>

            <button
              onClick={handleExportPdf}
              title="Download Consultation PDF"
              className="p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/15 text-white rounded-xl transition-all shadow-sm"
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
                        : 'bg-card border border-border text-foreground rounded-2xl rounded-bl-md px-4 py-3 shadow-sm'
                    }`}>
                      <p className="text-[13px] sm:text-sm leading-relaxed">{msg.text}</p>
                      {msg.sender === 'bot' && (
                        <button
                          type="button"
                          onClick={() => handleSpeak(msg.id, msg.text || '')}
                          className="absolute -bottom-2 -right-2 p-1.5 bg-card border border-border rounded-lg shadow-sm text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100 transition-all"
                          title={speakingMessageId === msg.id ? 'Stop speaking' : 'Listen audio'}
                        >
                          {speakingMessageId === msg.id ? <VolumeX className="w-3 h-3 text-rose-500 animate-pulse" /> : <Volume2 className="w-3 h-3" />}
                        </button>
                      )}
                    </div>
                  )}

                  {/* ── Structured Clinical Response Card ── */}
                  {msg.structured && (
                    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg">
                      {/* Confidence Header Strip */}
                      <div className={`bg-gradient-to-r ${getConfidenceColor(msg.structured.confidence)} px-4 py-2.5 flex items-center justify-between`}>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
                            <Shield className="w-3.5 h-3.5 text-white" />
                          </div>
                          <span className="text-white text-[11px] font-bold tracking-wide uppercase">
                            {Math.round(msg.structured.confidence * 100)}% Confidence
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleSpeak(msg.id, msg.structured?.content || '')}
                            className="p-1.5 bg-white/15 hover:bg-white/25 text-white rounded-lg transition-all backdrop-blur-sm"
                            title={speakingMessageId === msg.id ? 'Stop' : 'Listen'}
                          >
                            {speakingMessageId === msg.id ? <VolumeX className="w-3.5 h-3.5 animate-pulse" /> : <Volume2 className="w-3.5 h-3.5" />}
                          </button>

                          {msg.structured.emergency_sos ? (
                            <span className="px-2.5 py-1 bg-white/20 text-white font-extrabold text-[10px] rounded-full flex items-center gap-1 animate-pulse">
                              🚨 SOS
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 bg-white/20 text-white font-bold text-[10px] rounded-full flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Verified
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-4 sm:p-5 space-y-4">
                        {/* Source Tag */}
                        {msg.structured.sources && msg.structured.sources.length > 0 && (
                          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                            <FileCheck className="w-3 h-3 text-emerald-500" />
                            <span className="font-medium">{msg.structured.sources[0]}</span>
                          </div>
                        )}

                        {/* Main Clinical Content */}
                        <p className="text-foreground text-[13px] sm:text-sm leading-relaxed font-medium whitespace-pre-line">
                          {msg.structured.content}
                        </p>

                        {/* ── Safe Home Care (Green Card) ── */}
                        {msg.structured.recommendations && msg.structured.recommendations.length > 0 && (
                          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-500/10 dark:to-teal-500/5 border border-emerald-200/60 dark:border-emerald-500/20 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2.5">
                              <div className="w-6 h-6 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                                <Heart className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                              </div>
                              <span className="font-bold text-emerald-700 dark:text-emerald-400 text-xs">
                                {language === 'or' ? 'ଘରୋଇ ଉପଚାର ଓ ଆହାର' : language === 'hi' ? 'घरेलू उपचार एवं आहार' : 'Safe Home Care & Diet'}
                              </span>
                            </div>
                            <ul className="space-y-2">
                              {msg.structured.recommendations.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-xs text-foreground/85 leading-relaxed">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* ── Warning Signs (Amber Card) ── */}
                        {msg.structured.warnings && msg.structured.warnings.length > 0 && (
                          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-500/10 dark:to-orange-500/5 border border-amber-200/60 dark:border-amber-500/20 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2.5">
                              <div className="w-6 h-6 rounded-lg bg-amber-500/15 flex items-center justify-center">
                                <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                              </div>
                              <span className="font-bold text-amber-700 dark:text-amber-400 text-xs">
                                {language === 'or' ? 'ଡାକ୍ତରଙ୍କୁ କେବେ ଦେଖାଇବେ' : language === 'hi' ? 'डॉक्टर को कब दिखाएं' : 'When to See a Doctor'}
                              </span>
                            </div>
                            <ul className="space-y-2">
                              {msg.structured.warnings.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-xs text-foreground/85 leading-relaxed">
                                  <ShieldAlert className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* ── Follow-Up Prompt ── */}
                        {msg.structured.followUp && (
                          <div className="flex items-center justify-between gap-3 p-3.5 bg-muted/40 border border-border rounded-xl">
                            <div className="flex items-center gap-2">
                              <MessageCircle className="w-4 h-4 text-primary shrink-0" />
                              <span className="text-xs text-muted-foreground">{msg.structured.followUp}</span>
                            </div>
                            <button
                              onClick={() => navigate('/doctors', { 
                                state: { 
                                  prefillSpecialist: msg.structured?.specialist, 
                                  triageSummary: msg.structured?.content 
                                } 
                              })}
                              className="text-[11px] font-bold text-primary hover:text-primary/80 flex items-center gap-1 shrink-0 transition-colors"
                            >
                              <span>Find Doctors</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        )}

                        {/* ── CTA Action Buttons ── */}
                        <div className="flex flex-wrap gap-2 pt-1">
                          {msg.structured.emergency_sos && (
                            <a
                              href="tel:108"
                              className="flex-1 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs shadow-lg shadow-rose-500/25 transition-all animate-pulse"
                            >
                              <PhoneCall className="w-4 h-4" />
                              <span>Call 108 Emergency</span>
                            </a>
                          )}

                          <button
                            onClick={() => navigate('/doctors', { 
                              state: { 
                                prefillSpecialist: msg.structured?.specialist, 
                                triageSummary: msg.structured?.content 
                              } 
                            })}
                            className="flex-1 bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs shadow-lg shadow-primary/20 transition-all"
                          >
                            <Stethoscope className="w-4 h-4" />
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
            className="text-[11px] bg-card hover:bg-muted border border-border px-3.5 py-2 rounded-xl font-semibold text-foreground whitespace-nowrap shrink-0 shadow-sm transition-all hover:border-primary/40 hover:shadow-md flex items-center gap-1.5"
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
        className="relative flex items-center gap-2 bg-card border-2 border-border hover:border-primary/30 focus-within:border-primary/50 rounded-2xl p-2 shadow-xl shadow-black/5 transition-all"
      >
        {/* Voice Input */}
        <button
          type="button"
          onClick={toggleRecording}
          disabled={loading}
          className={`p-3 rounded-xl transition-all shrink-0 ${
            isRecording
              ? 'bg-gradient-to-br from-rose-500 to-red-500 text-white shadow-lg shadow-rose-500/30 animate-pulse'
              : 'bg-muted/70 hover:bg-muted text-muted-foreground hover:text-foreground'
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
          className="flex-1 bg-transparent text-sm text-foreground focus:outline-none px-2 placeholder:text-muted-foreground/60"
          disabled={loading}
        />

        {/* Send Button */}
        <button
          type="button"
          onClick={() => handleSendMessage()}
          disabled={!inputText.trim() || loading}
          className="p-3 bg-gradient-to-br from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90 disabled:opacity-40 disabled:from-muted disabled:to-muted text-white rounded-xl transition-all shrink-0 shadow-lg shadow-primary/25"
        >
          <Send className="w-4.5 h-4.5" />
        </button>
      </motion.div>

    </div>
  );
};

export default HealthChat;
