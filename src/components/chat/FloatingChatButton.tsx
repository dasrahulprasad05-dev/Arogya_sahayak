import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bot, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const FloatingChatButton: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();

  // Hide on chat page itself
  if (location.pathname === '/chat') return null;

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      onClick={() => navigate('/chat')}
      className="fixed bottom-20 md:bottom-6 right-5 z-50 bg-gradient-to-tr from-violet-600 to-primary text-white p-3.5 md:px-5 md:py-3.5 rounded-full shadow-xl shadow-primary/30 flex items-center gap-2.5 border border-white/20 backdrop-blur-sm touch-target"
      title="Open AI Medical Assistant"
    >
      <div className="relative">
        <Bot className="w-5 h-5 text-white" />
        <Sparkles className="w-2.5 h-2.5 text-amber-300 absolute -top-1 -right-1 animate-pulse" />
      </div>
      <span className="hidden md:inline font-heading font-bold text-xs">
        {language === 'or' ? 'AI ଡାକ୍ତର ସାଥୀ' : language === 'hi' ? 'AI डॉक्टर' : 'AI Health Assistant'}
      </span>
    </motion.button>
  );
};

export default FloatingChatButton;
