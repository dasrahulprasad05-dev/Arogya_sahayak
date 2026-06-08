import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import type { SyncItem } from '../../utils/syncQueue';
import { Calendar, Eye, Droplet, Moon, Smile, Thermometer, Heart, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RecentTimelineProps {
  logs: SyncItem[];
}

const RecentTimelineWidget: React.FC<RecentTimelineProps> = ({ logs }) => {
  const { t, formatDate, formatNumber } = useLanguage();
  const navigate = useNavigate();

  // Get last 5 items
  const recentLogs = logs.slice(0, 5);

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'water': return <Droplet className="w-4 h-4 text-blue-500" />;
      case 'sleep': return <Moon className="w-4 h-4 text-indigo-500" />;
      case 'mood': return <Smile className="w-4 h-4 text-pink-500" />;
      case 'temperature': return <Thermometer className="w-4 h-4 text-orange-500" />;
      case 'vitals': return <Heart className="w-4 h-4 text-emerald-500" />;
      default: return <Activity className="w-4 h-4 text-teal-500" />;
    }
  };

  const renderLogContent = (item: SyncItem) => {
    switch (item.type) {
      case 'water':
        return `${formatNumber(item.value.glasses)} Glasses of Water`;
      case 'sleep':
        return `${formatNumber(item.value.duration)} hours Sleep (Grade ${formatNumber(item.value.quality)}/5)`;
      case 'mood':
        return `Mood logged as ${item.value.mood}${item.value.notes ? `: "${item.value.notes}"` : ''}`;
      case 'temperature':
        return `Body Temperature: ${formatNumber(item.value.temperature)}°C`;
      case 'vitals':
        return `Vitals: Blood Pressure ${item.value.systolic}/${item.value.diastolic} mmHg, Heart Rate ${formatNumber(item.value.heartRate)} bpm`;
      case 'stress':
        return `Stress Index: PSS-10 Score ${formatNumber(item.value.score)}`;
      case 'symptom':
        return `Symptom Check: Checked ${item.value.symptoms?.join(', ')}`;
      case 'medicine':
        return `Prescription reminder saved: ${item.value.title}`;
      case 'exercise':
        return `Exercise logged: ${item.value.routine}`;
      default:
        return `Health entry saved`;
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm glass">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-heading font-bold text-lg text-foreground flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          <span>Recent Vitals & Logs</span>
        </h3>
        <button
          onClick={() => navigate('/history')}
          className="text-xs text-primary hover:underline font-semibold flex items-center gap-1 touch-target"
        >
          <Eye className="w-4 h-4" />
          View History
        </button>
      </div>

      {recentLogs.length === 0 ? (
        <div className="py-8 text-center text-muted-foreground text-sm font-medium">
          {t('state.no_data')} Log some water or vitals above!
        </div>
      ) : (
        <div className="relative border-l border-muted ml-3 pl-6 space-y-6">
          {recentLogs.map((item) => (
            <div key={item.id} className="relative group">
              {/* Dot */}
              <span className="absolute -left-[33px] top-1 p-1 bg-card border border-border rounded-full shadow-sm group-hover:border-primary transition-colors">
                {getLogIcon(item.type)}
              </span>
              
              <div>
                <time className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                  {formatDate(item.created_at, { dateStyle: 'medium', timeStyle: 'short' })}
                </time>
                <p className="text-sm font-semibold text-foreground mt-1">
                  {renderLogContent(item)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentTimelineWidget;
