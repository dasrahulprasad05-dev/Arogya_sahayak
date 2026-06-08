import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Activity } from 'lucide-react';

const NotFound: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center p-4">
      <div className="p-4 bg-primary/10 rounded-full text-primary mb-6 animate-bounce">
        <Activity className="w-12 h-12" />
      </div>
      <h1 className="text-4xl font-extrabold font-heading text-primary mb-2">404</h1>
      <h2 className="text-xl font-bold mb-4">Page Not Found</h2>
      <p className="text-muted-foreground max-w-sm mb-8">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link 
        to="/" 
        className="bg-primary hover:bg-primary/95 text-white font-semibold py-2.5 px-6 rounded-xl transition-all shadow-md touch-target"
      >
        {t('nav.landing')}
      </Link>
    </div>
  );
};

export default NotFound;
