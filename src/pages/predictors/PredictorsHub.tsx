import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { genericPredictorConfig } from '../../lib/predictorConfig';
import PageShell from '../../components/ui/PageShell';
import SectionHeader from '../../components/ui/SectionHeader';
import FeatureCard from '../../components/ui/FeatureCard';
import { staggerContainer } from '../../components/ui/motion';
import { Activity, ClipboardCheck, Sparkles } from 'lucide-react';
import { dedicatedPredictors, dedicatedConfigs, genericConfigs } from './predictorsData';

const Grid: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div variants={staggerContainer} initial="hidden" animate="show"
    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
    {children}
  </motion.div>
);

const PredictorsHub: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  return (
    <PageShell title={t('nav.predictors')}
      subtitle="Run preventive risk assessments powered by standard diagnostic guidelines.">
      <div className="space-y-6">
        <SectionHeader icon={Activity} title="Dedicated Lab & Vitals Screeners" count={dedicatedPredictors.length} />
        <Grid>
          {dedicatedPredictors.map(p => {
            const cfg = dedicatedConfigs[p.id];
            return <FeatureCard key={p.id} icon={cfg.icon} rgb={cfg.rgb} textClass={cfg.textClass}
              title={p.name} desc={p.desc} ctaLabel="Run Screener" onClick={() => navigate(p.path)} />;
          })}
        </Grid>
      </div>
      <div className="space-y-6">
        <SectionHeader icon={ClipboardCheck} title="Symptom & Questionnaire Panels" />
        <Grid>
          {Object.values(genericPredictorConfig).map(p => {
            const cfg = genericConfigs[p.id] ?? { icon: Sparkles, rgb: '236, 72, 153', textClass: 'text-pink-500' };
            return <FeatureCard key={p.id} icon={cfg.icon} rgb={cfg.rgb} textClass={cfg.textClass}
              title={p.name} desc={p.description} ctaLabel="Open Assessment"
              onClick={() => navigate(`/predictors/generic/${p.id}`)} />;
          })}
        </Grid>
      </div>
    </PageShell>
  );
};
export default PredictorsHub;
