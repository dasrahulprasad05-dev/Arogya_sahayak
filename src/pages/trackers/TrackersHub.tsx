import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { healthTools } from '../../utils/diseaseData';
import PageShell from '../../components/ui/PageShell';
import SectionHeader from '../../components/ui/SectionHeader';
import FeatureCard from '../../components/ui/FeatureCard';
import { staggerContainer } from '../../components/ui/motion';
import { ClipboardList, Info, Activity } from 'lucide-react';
import { trackerConfigs } from './trackersData';

const Grid: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div variants={staggerContainer} initial="hidden" animate="show"
    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
    {children}
  </motion.div>
);

const TrackersHub: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const categories = [
    { id: 'tracker', name: 'Wellness Logs & Tools', icon: ClipboardList },
    { id: 'info', name: 'Reference & Guides', icon: Info }
  ];

  return (
    <PageShell title={t('nav.trackers')}
      subtitle="Select a widget below to log vitals, track daily targets, or read clinical guidance."
      gradient="from-teal-600 to-cyan-500 dark:from-teal-400 dark:to-cyan-400">
      
      {categories.map((category) => {
        const items = healthTools.filter(tool => tool.category === category.id);
        if (items.length === 0) return null;

        return (
          <div key={category.id} className="space-y-6">
            <SectionHeader icon={category.icon} title={category.name} count={items.length} />
            <Grid>
              {items.map((tool) => {
                const cfg = trackerConfigs[tool.id] || { icon: Activity, rgb: '14, 165, 233', textClass: 'text-sky-600 dark:text-sky-400', desc: 'Click to record or review entries.' };
                return (
                  <FeatureCard 
                    key={tool.id} 
                    icon={cfg.icon} 
                    rgb={cfg.rgb} 
                    textClass={cfg.textClass}
                    title={t(tool.nameKey)} 
                    desc={cfg.desc} 
                    ctaLabel="Open Tracker" 
                    onClick={() => navigate(tool.path)} 
                  />
                );
              })}
            </Grid>
          </div>
        );
      })}
    </PageShell>
  );
};

export default TrackersHub;
