import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useHealthRead } from '../context/HealthReadContext';
import { 
  Search, 
  Calendar, 
  Info
} from 'lucide-react';

const HealthHistory: React.FC = () => {
  const { t, formatDate, formatNumber } = useLanguage();
  const { logs } = useHealthRead();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  const logTypes = ['All', 'water', 'sleep', 'mood', 'temperature', 'vitals', 'stress', 'symptom', 'medicine', 'exercise', 'prediction', 'scan'];

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchSearch = log.type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchType = filterType === 'All' || log.type === filterType;
      return matchSearch && matchType;
    });
  }, [logs, searchTerm, filterType]);

  const getLogColor = (type: string) => {
    switch (type) {
      case 'water': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'sleep': return 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20';
      case 'mood': return 'bg-pink-500/10 text-pink-600 border-pink-500/20';
      case 'temperature': return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      case 'vitals': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'stress': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      case 'prediction': return 'bg-violet-500/10 text-violet-600 border-violet-500/20';
      case 'scan': return 'bg-rose-500/10 text-rose-600 border-rose-500/20';
      default: return 'bg-teal-500/10 text-teal-600 border-teal-500/20';
    }
  };

  const getLogLabel = (type: string) => {
    switch (type) {
      case 'water': return 'Water Hydration';
      case 'sleep': return 'Sleep Log';
      case 'mood': return 'Mood Journal';
      case 'temperature': return 'Body Temp';
      case 'vitals': return 'Vitals Check';
      case 'stress': return 'Stress Test';
      case 'symptom': return 'Symptom Triage';
      case 'medicine': return 'Prescription';
      case 'exercise': return 'Exercise routine';
      case 'prediction': return 'AI Prediction';
      case 'scan': return 'Image Scan';
      default: return type;
    }
  };

  const renderLogDetails = (log: any) => {
    const val = log.value;
    switch (log.type) {
      case 'water':
        return `${formatNumber(val.glasses)} Glasses of water logged`;
      case 'sleep':
        return `${formatNumber(val.duration)} hours of sleep, Quality: ${formatNumber(val.quality)}/5`;
      case 'mood':
        return `Mood is ${val.mood}${val.notes ? ` — "${val.notes}"` : ''}`;
      case 'temperature':
        return `Body Temperature: ${formatNumber(val.temperature)}°C`;
      case 'vitals':
        return `Blood Pressure: ${val.systolic}/${val.diastolic} mmHg, HR: ${formatNumber(val.heartRate)} bpm, SpO2: ${formatNumber(val.spO2)}%`;
      case 'stress':
        return `PSS-10 Stress Scale Score: ${formatNumber(val.score)}/40`;
      case 'symptom':
        return `AI Triage symptoms: ${val.symptoms?.join(', ')}`;
      case 'medicine':
        return `Prescription: ${val.title} (${val.dosage}), scheduled ${val.frequency} at ${val.time}`;
      case 'exercise':
        return `Exercise: ${val.routine} (${formatNumber(val.duration)} mins)`;
      case 'prediction':
        return `AI Risk assessment for ${val.predictorId}: Risk is ${val.result?.risk || 'N/A'}, Confidence: ${val.result?.confidence || 0}%`;
      case 'scan':
        return `AI Image Scan (${val.scanType}): Local Label: "${val.localLabel}" (${Math.round((val.localScore || 0) * 100)}% match), Overall Blended Confidence: ${val.result?.confidence || 0}%`;
      default:
        return JSON.stringify(val);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-heading text-foreground">{t('nav.history')}</h1>
        <p className="text-muted-foreground text-sm mt-1">Review all your historical entries, vitals logs, and diagnostic checklists.</p>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between bg-card border border-border p-4 rounded-2xl shadow-sm glass">
        
        {/* Search */}
        <div className="relative max-w-xs w-full">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-foreground pointer-events-none">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-xs"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters Grid */}
        <div className="flex gap-1.5 flex-wrap items-center text-xs">
          <span className="font-semibold text-muted-foreground mr-1">Filter Type:</span>
          {logTypes.map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-2.5 py-1.5 rounded-lg border font-semibold capitalize transition-all touch-target ${
                filterType === type
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-background/50 hover:bg-muted/50'
              }`}
            >
              {type === 'All' ? 'All Logs' : type}
            </button>
          ))}
        </div>

      </div>

      {/* History List */}
      <div className="bg-card border border-border rounded-2xl shadow-sm glass overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/20">
          <h3 className="font-heading font-bold text-sm text-foreground flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            <span>Timeline Logs ({filteredLogs.length})</span>
          </h3>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground text-sm font-semibold">
            No health records matched your criteria.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredLogs.map(log => (
              <div key={log.id} className="p-4 flex items-start justify-between gap-4 hover:bg-muted/10 transition-colors">
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 border rounded-md uppercase tracking-wider ${getLogColor(log.type)}`}>
                      {getLogLabel(log.type)}
                    </span>
                    <time className="text-[10px] text-muted-foreground font-semibold">
                      {formatDate(log.created_at, { dateStyle: 'long', timeStyle: 'short' })}
                    </time>
                  </div>
                  <p className="text-sm font-semibold text-foreground leading-relaxed break-words">
                    {renderLogDetails(log)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Guidelines info */}
      <div className="p-4 bg-muted/40 border border-border rounded-xl flex gap-3 text-xs leading-relaxed text-muted-foreground">
        <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-foreground block mb-1">Health Records Protocol:</span>
          Preventive health tracking focuses on registering daily logs over long timelines to identify changes in blood pressure, glycemic, and body temperature metrics. This history assists clinical practitioners in reviewing metabolic indices.
        </div>
      </div>
    </div>
  );
};

export default HealthHistory;
