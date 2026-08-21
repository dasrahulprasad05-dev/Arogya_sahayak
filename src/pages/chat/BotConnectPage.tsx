import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import {
  Send,
  MessageSquare,
  Mic,
  Volume2,
  ShieldCheck,
  ExternalLink,
  Sparkles,
  ArrowLeft
} from 'lucide-react';

const BotConnectPage: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const [activeTab, setActiveTab] = useState<'voice' | 'telegram' | 'whatsapp'>('voice');

  // In-Browser Voice Simulation State
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [botResponse, setBotResponse] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Browser Web Speech recognition
  const handleToggleListening = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported on this browser. Please use Chrome/Edge or Telegram Voice Bot.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language === 'or' ? 'or-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
      setBotResponse(null);
    };

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      setIsListening(false);
      processSimulatedTriage(text);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const processSimulatedTriage = (query: string) => {
    let responseText = '';
    const q = query.toLowerCase();

    if (q.includes('headache') || q.includes('fever') || q.includes('মুଣ୍ଡ ବିନ୍ଧା') || q.includes('सिरदर्द')) {
      responseText =
        language === 'or'
          ? 'ମୁଣ୍ଡବିନ୍ଧା ଓ ଜ୍ୱର ପାଇଁ ପ୍ରଚୁର ପାଣି ପିଅନ୍ତୁ, ବିଶ୍ରାମ ନିଅନ୍ତୁ ଏବଂ ଅବସ୍ଥା ନ ସୁଧୁରିଲେ ପାରାସିଟାମୋଲ ନେଇ ଡାକ୍ତରଙ୍କ ସହ ପରାମର୍ଶ କରନ୍ତୁ।'
          : language === 'hi'
          ? 'सिरदर्द और हल्के बुखार के लिए पर्याप्त आराम करें, पानी पिएं और यदि आवश्यक हो तो पैरासिटामोल लें। लक्षण बने रहने पर डॉक्टर से परामर्श लें।'
          : 'For mild headache and fever, rest in a quiet room, hydrate with 2–3 glasses of water, and monitor temperature. Consult a physician if fever exceeds 101°F.';
    } else if (q.includes('cough') || q.includes('cold') || q.includes('କାଶ') || q.includes('खांसी')) {
      responseText =
        language === 'or'
          ? 'କାଶ ପାଇଁ ଗରମ ପାଣିରେ ଲୁଣ ମିଶାଇ ଗାର୍ଗଲ କରନ୍ତୁ, ଅଦା ମହୁ ଚା ପିଅନ୍ତୁ ଏବଂ ଭାମ୍ପ ନିଅନ୍ତୁ।'
          : language === 'hi'
          ? 'खांसी और जुकाम के लिए गर्म पानी की भाप लें, अदरक-शहद का सेवन करें और नमक के पानी से गरारे करें।'
          : 'For cough and throat congestion, take warm saline gargles twice daily, inhale steam, and take honey with warm water.';
    } else {
      responseText =
        language === 'or'
          ? `ଆପଣଙ୍କର ଲକ୍ଷଣ "${query}" ଗ୍ରହଣ କରାଗଲା। ପର୍ଯ୍ୟାପ୍ତ ଜଳପାନ କରନ୍ତୁ ଏବଂ ଉପଯୁକ୍ତ ସ୍ୱାସ୍ଥ୍ୟ ଯାଞ୍ଚ ପାଇଁ ଆମର ଆରୋଗ୍ୟ ସହାୟକ ଟ୍ରାକର ବ୍ୟବହାର କରନ୍ତୁ।`
          : language === 'hi'
          ? `आपके लक्षण "${query}" को दर्ज किया गया है। स्वास्थ्य दिशानिर्देशों का पालन करें और हाइड्रेटेड रहें।`
          : `Triage received for "${query}". Keep hydrated, monitor your symptoms, and consult an Arogya Sahayak verified specialist if discomfort persists.`;
    }

    setBotResponse(responseText);
    speakResponse(responseText);
  };

  const speakResponse = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'or' ? 'hi-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-body">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/chat')}
            className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground hover:text-foreground touch-target"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-foreground flex items-center gap-2">
              <span>WhatsApp & Telegram Voice Assistant</span>
              <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                100% Free Gateway
              </span>
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Consult clinical symptoms, check prescriptions, and receive audio health guidance directly on your favorite messenger.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 bg-primary/10 text-primary rounded-lg border border-primary/20 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> Zero-Cost Webhook Ready
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-muted/50 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab('voice')}
          className={`flex-1 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'voice' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Mic className="w-4 h-4 text-primary" /> In-Browser Voice Agent
        </button>
        <button
          onClick={() => setActiveTab('telegram')}
          className={`flex-1 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'telegram' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Send className="w-4 h-4 text-cyan-500" /> Telegram Free Bot
        </button>
        <button
          onClick={() => setActiveTab('whatsapp')}
          className={`flex-1 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'whatsapp' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-emerald-500" /> WhatsApp Direct Link
        </button>
      </div>

      {/* Tab 1: In-Browser Live Voice Simulation */}
      {activeTab === 'voice' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-5 text-center"
        >
          <div className="space-y-1">
            <h3 className="font-heading font-extrabold text-lg text-foreground">
              Speak with Arogya Voice Companion
            </h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Tap the microphone to speak symptoms in Odia, Hindi, or English. Arogya Sahayak will diagnose and speak guidance back aloud.
            </p>
          </div>

          {/* Big Voice Button */}
          <div className="py-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleToggleListening}
              className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center shadow-xl transition-all ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse shadow-rose-600/40'
                  : 'bg-gradient-to-tr from-primary to-violet-600 text-white hover:from-primary/90 shadow-primary/30'
              }`}
            >
              <Mic className="w-10 h-10" />
            </motion.button>
            <span className="text-xs font-bold text-muted-foreground mt-3 block">
              {isListening ? 'Listening... Speak your symptom now' : 'Click to Speak (Microphone)'}
            </span>
          </div>

          {/* Live Transcript & Spoken Response */}
          {(transcript || botResponse) && (
            <div className="space-y-3 max-w-lg mx-auto text-left">
              {transcript && (
                <div className="bg-muted/40 p-3 rounded-xl border border-border text-xs">
                  <span className="text-primary font-bold block mb-1">You said:</span>
                  <p className="text-foreground italic">"{transcript}"</p>
                </div>
              )}

              {botResponse && (
                <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Arogya Sahayak Advice:
                    </span>
                    <button
                      onClick={() => speakResponse(botResponse)}
                      className="text-primary hover:underline flex items-center gap-1 font-bold text-[11px]"
                    >
                      <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-bounce' : ''}`} /> Replay Audio
                    </button>
                  </div>
                  <p className="text-foreground leading-relaxed font-medium">{botResponse}</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}

      {/* Tab 2: Telegram Bot Integration */}
      {activeTab === 'telegram' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-5"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase font-mono">100% Free Forever</span>
              <h3 className="font-heading font-extrabold text-lg text-foreground">
                Telegram AI Health Bot (@ArogyaSahayakBot)
              </h3>
              <p className="text-xs text-muted-foreground">
                Telegram's free Bot API allows unlimited free voice message interactions and photo uploads for prescription and skin scanning.
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
              <Send className="w-6 h-6" />
            </div>
          </div>

          {/* 3 Step Setup Guide */}
          <div className="space-y-3 pt-2">
            <h4 className="font-heading font-bold text-xs text-foreground uppercase tracking-wider">How to connect in 3 steps:</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-muted/40 border border-border p-3.5 rounded-xl space-y-1">
                <span className="w-5 h-5 rounded-full bg-cyan-500 text-white font-bold text-[10px] flex items-center justify-center">1</span>
                <h5 className="font-bold text-xs text-foreground">Open Telegram</h5>
                <p className="text-[11px] text-muted-foreground">Search for <code>@ArogyaSahayakBot</code> or click the button below.</p>
              </div>

              <div className="bg-muted/40 border border-border p-3.5 rounded-xl space-y-1">
                <span className="w-5 h-5 rounded-full bg-cyan-500 text-white font-bold text-[10px] flex items-center justify-center">2</span>
                <h5 className="font-bold text-xs text-foreground">Send /start</h5>
                <p className="text-[11px] text-muted-foreground">Select your preferred language (Odia, Hindi, or English).</p>
              </div>

              <div className="bg-muted/40 border border-border p-3.5 rounded-xl space-y-1">
                <span className="w-5 h-5 rounded-full bg-cyan-500 text-white font-bold text-[10px] flex items-center justify-center">3</span>
                <h5 className="font-bold text-xs text-foreground">Voice / Photo Chat</h5>
                <p className="text-[11px] text-muted-foreground">Send voice notes or prescription photos anytime 24/7.</p>
              </div>
            </div>
          </div>

          <a
            href="https://t.me/ArogyaSahayakBot"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-heading font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md shadow-cyan-600/25 transition-all"
          >
            <Send className="w-4 h-4" /> Open @ArogyaSahayakBot on Telegram <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </motion.div>
      )}

      {/* Tab 3: WhatsApp Direct Connect */}
      {activeTab === 'whatsapp' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-5"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase font-mono">Zero Setup Required</span>
              <h3 className="font-heading font-extrabold text-lg text-foreground">
                WhatsApp 1-Tap Health Gateway
              </h3>
              <p className="text-xs text-muted-foreground">
                Connect directly through WhatsApp's universal Click-to-Chat protocol without storing numbers.
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-muted/40 p-4 rounded-xl border border-border space-y-3">
            <span className="text-xs font-bold text-foreground block">Preset Clinical Prompts:</span>
            <div className="space-y-2">
              <a
                href="https://wa.me/?text=Namaskar%2C%20I%20need%20Arogya%20Sahayak%20guidance%20for%20fever%20and%20cough."
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-card hover:bg-emerald-500/5 border border-border hover:border-emerald-500/30 rounded-xl text-xs flex items-center justify-between text-foreground transition-all group"
              >
                <span>"Namaskar, I need guidance for fever and cough."</span>
                <ArrowLeft className="w-3.5 h-3.5 rotate-180 text-emerald-500 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="https://wa.me/?text=Namaskar%2C%20I%20want%20to%20verify%20my%20prescription%20and%20generic%20alternatives."
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-card hover:bg-emerald-500/5 border border-border hover:border-emerald-500/30 rounded-xl text-xs flex items-center justify-between text-foreground transition-all group"
              >
                <span>"Namaskar, I want to verify generic medicine alternatives."</span>
                <ArrowLeft className="w-3.5 h-3.5 rotate-180 text-emerald-500 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default BotConnectPage;
