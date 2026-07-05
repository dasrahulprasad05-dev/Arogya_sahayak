import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { healthTools } from '../../utils/diseaseData';
import FeatureCard from '../../components/ui/FeatureCard';
import { trackerConfigs } from './trackersData';
import {
  ClipboardList,
  Info,
  Activity,
  Search,
  X,
} from 'lucide-react';

const DEFAULT_CFG = {
  icon: Activity,
  rgb: '14, 165, 233',
  desc: 'Click to record or review entries.',
};

const categories = [
  {
    id: 'tracker',
    name: 'Wellness Logs & Tools',
    icon: ClipboardList,
    gradient: 'from-teal-500 to-cyan-600',
  },
  {
    id: 'info',
    name: 'Reference & Guides',
    icon: Info,
    gradient: 'from-purple-500 to-pink-500',
  },
];

const TrackersHub: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const filteredTools = useMemo(() => {
    if (!query.trim()) return healthTools;
    const q = query.toLowerCase();
    return healthTools.filter(tool => t(tool.nameKey).toLowerCase().includes(q));
  }, [query, t]);

  return (
    <div className="space-y-12 relative overflow-hidden pb-12">
      {/* Background drifting blobs */}
      <div className="absolute top-[-10%] left-[-15%] w-[450px] h-[450px] bg-cyan-500/[0.03] dark:bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none -z-10 animate-mesh-move" />
      <div
        className="absolute top-[35%] right-[-10%] w-[550px] h-[550px] bg-purple-500/[0.03] dark:bg-purple-500/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-mesh-move"
        style={{ animationDuration: '25s', animationDelay: '-5s' }}
      />
      <div
        className="absolute bottom-[-10%] left-[15%] w-[500px] h-[500px] bg-pink-500/[0.03] dark:bg-pink-500/10 rounded-full blur-[110px] pointer-events-none -z-10 animate-mesh-move"
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
            className="text-4xl md:text-5xl font-extrabold font-heading tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-cyan-500 to-purple-500 bg-[length:200%_auto]"
            style={{ animation: 'gradient-shift 6s ease infinite' }}
          >
            {t('nav.trackers')}
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl leading-relaxed">
            Select a widget below to log vitals, track daily targets, or read clinical guidance.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search trackers & guides..."
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

      {/* ── Category sections ──────────────────────── */}
      {categories.map(category => {
        const CatIcon = category.icon;
        const items = filteredTools.filter(tool => tool.category === category.id);
        if (items.length === 0) return null;

        return (
          <div key={category.id} className="space-y-6">
            {/* Section heading */}
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4 }}
              className="relative pl-5 flex items-center justify-between"
            >
              <div
                className={`absolute left-0 top-0.5 bottom-0.5 w-1 bg-gradient-to-b ${category.gradient} rounded-full`}
              />
              <div className="flex items-center gap-3">
                <CatIcon className="w-6 h-6 text-teal-600 dark:text-teal-400 shrink-0" />
                <h2 className="text-xl md:text-2xl font-bold font-heading text-foreground">
                  {category.name}
                </h2>
              </div>
              <span className="text-xs font-semibold text-muted-foreground bg-muted/60 border border-border px-2.5 py-1 rounded-full">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </motion.div>

            {/* Card grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {items.map((tool, index) => {
                const cfg = trackerConfigs[tool.id] ?? DEFAULT_CFG;
                return (
                  <FeatureCard
                    key={tool.id}
                    icon={cfg.icon}
                    title={t(tool.nameKey)}
                    description={cfg.desc}
                    rgb={cfg.rgb}
                    index={index}
                    footerLabel="Open Tracker"
                    onClick={() => navigate(tool.path)}
                  />
                );
              })}
            </div>
          </div>
        );
      })}

      {/* ── Empty state ────────────────────────────── */}
      {filteredTools.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 text-muted-foreground"
        >
          <p className="text-lg font-semibold">No trackers found for &quot;{query}&quot;</p>
          <p className="text-sm mt-1">Try a different search term.</p>
        </motion.div>
      )}
    </div>
  );
};

export default TrackersHub;
