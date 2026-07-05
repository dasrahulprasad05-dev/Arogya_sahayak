import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { genericPredictorConfig } from '../../lib/predictorConfig';
import FeatureCard from '../../components/ui/FeatureCard';
import { Activity, ClipboardCheck, Sparkles, Search, X } from 'lucide-react';
import { dedicatedPredictors, dedicatedConfigs, genericConfigs } from './predictorsData';

const PredictorsHub: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const filteredDedicated = useMemo(() => {
    if (!query.trim()) return dedicatedPredictors;
    const q = query.toLowerCase();
    return dedicatedPredictors.filter(p => p.name.toLowerCase().includes(q));
  }, [query]);

  const filteredGeneric = useMemo(() => {
    if (!query.trim()) return Object.values(genericPredictorConfig);
    const q = query.toLowerCase();
    return Object.values(genericPredictorConfig).filter(p => p.name.toLowerCase().includes(q));
  }, [query]);

  const hasResults = filteredDedicated.length > 0 || filteredGeneric.length > 0;

  return (
    <div className="space-y-12 relative overflow-hidden pb-12">
      {/* Background drifting blobs */}
      <div className="absolute top-[-10%] left-[-15%] w-[450px] h-[450px] bg-rose-500/[0.03] dark:bg-rose-500/10 rounded-full blur-[100px] pointer-events-none -z-10 animate-mesh-move" />
      <div
        className="absolute top-[35%] right-[-10%] w-[550px] h-[550px] bg-fuchsia-500/[0.03] dark:bg-fuchsia-500/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-mesh-move"
        style={{ animationDuration: '25s', animationDelay: '-5s' }}
      />
      <div
        className="absolute bottom-[-10%] left-[15%] w-[500px] h-[500px] bg-indigo-500/[0.03] dark:bg-indigo-500/10 rounded-full blur-[110px] pointer-events-none -z-10 animate-mesh-move"
        style={{ animationDuration: '30s', animationDelay: '-10s' }}
      />

      {/* ── Header ─────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="space-y-4"
      >
        <div className="space-y-2">
          <h1
            className="text-4xl md:text-5xl font-extrabold font-heading tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-fuchsia-500 to-indigo-500 bg-[length:200%_auto]"
            style={{ animation: 'gradient-shift 6s ease infinite' }}
          >
            {t('nav.predictors')}
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl leading-relaxed">
            Run preventive risk assessments powered by standard diagnostic guidelines.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search AI predictors..."
            className="w-full pl-10 pr-9 py-3 rounded-2xl bg-card/60 border border-border backdrop-blur-md text-sm font-medium input-accent-glow outline-none transition-all"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground touch-target"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </motion.div>

      {/* ── Dedicated Predictors ──────────────────────── */}
      {filteredDedicated.length > 0 && (
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.4 }}
            className="relative pl-5 flex items-center justify-between"
          >
            <div className="absolute left-0 top-0.5 bottom-0.5 w-1 bg-gradient-to-b from-rose-500 to-orange-500 rounded-full" />
            <div className="flex items-center gap-3">
              <Activity className="w-6 h-6 text-rose-600 dark:text-rose-400 shrink-0" />
              <h2 className="text-xl md:text-2xl font-bold font-heading text-foreground">
                Dedicated Lab & Vitals Screeners
              </h2>
            </div>
            <span className="text-xs font-semibold text-muted-foreground bg-muted/60 border border-border px-2.5 py-1 rounded-full">
              {filteredDedicated.length} {filteredDedicated.length === 1 ? 'item' : 'items'}
            </span>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredDedicated.map((p, index) => {
              const cfg = dedicatedConfigs[p.id];
              return (
                <FeatureCard
                  key={p.id}
                  icon={cfg.icon}
                  title={p.name}
                  description={p.desc}
                  rgb={cfg.rgb}
                  index={index}
                  footerLabel="Run Screener"
                  onClick={() => navigate(p.path)}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* ── Generic Predictors ──────────────────────── */}
      {filteredGeneric.length > 0 && (
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.4 }}
            className="relative pl-5 flex items-center justify-between"
          >
            <div className="absolute left-0 top-0.5 bottom-0.5 w-1 bg-gradient-to-b from-fuchsia-500 to-indigo-500 rounded-full" />
            <div className="flex items-center gap-3">
              <ClipboardCheck className="w-6 h-6 text-fuchsia-600 dark:text-fuchsia-400 shrink-0" />
              <h2 className="text-xl md:text-2xl font-bold font-heading text-foreground">
                Symptom & Questionnaire Panels
              </h2>
            </div>
            <span className="text-xs font-semibold text-muted-foreground bg-muted/60 border border-border px-2.5 py-1 rounded-full">
              {filteredGeneric.length} {filteredGeneric.length === 1 ? 'item' : 'items'}
            </span>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredGeneric.map((p, index) => {
              const cfg = genericConfigs[p.id] ?? { icon: Sparkles, rgb: '236, 72, 153' };
              return (
                <FeatureCard
                  key={p.id}
                  icon={cfg.icon}
                  title={p.name}
                  description={p.description}
                  rgb={cfg.rgb}
                  index={index}
                  footerLabel="Open Assessment"
                  onClick={() => navigate(`/predictors/generic/${p.id}`)}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* ── Empty state ────────────────────────────── */}
      {!hasResults && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 text-muted-foreground"
        >
          <p className="text-lg font-semibold">No predictors found for &quot;{query}&quot;</p>
          <p className="text-sm mt-1">Try a different search term.</p>
        </motion.div>
      )}
    </div>
  );
};

export default PredictorsHub;
