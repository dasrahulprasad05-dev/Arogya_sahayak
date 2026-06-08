import React, { useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useHealthRead } from '../context/HealthReadContext';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  BarChart, 
  Bar 
} from 'recharts';
import { Info } from 'lucide-react';

const WeeklyReport: React.FC = () => {
  const { t } = useLanguage();
  const { logs } = useHealthRead();

  // Create last 7 days calendar entries
  const last7DaysData = useMemo(() => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toDateString();
      const label = d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' });

      // Gather logs for this day
      let water = 0;
      let sleep = 0;
      let stress = 0;

      logs.forEach(log => {
        const logDate = new Date(log.created_at).toDateString();
        if (logDate === dateStr) {
          if (log.type === 'water') {
            water += Number(log.value.glasses || 0);
          } else if (log.type === 'sleep') {
            sleep = Number(log.value.duration || 0);
          } else if (log.type === 'stress') {
            stress = Number(log.value.score || 0);
          }
        }
      });

      data.push({
        date: label,
        water,
        sleep,
        stress: stress || null // show blank if no evaluation taken
      });
    }
    return data;
  }, [logs]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-heading text-foreground">{t('nav.report')}</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Review your 7-day wellness trends and metabolic indices.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Water */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm glass">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading font-bold text-sm text-foreground uppercase tracking-wider">
              Water Consumption Trend (Glasses)
            </h3>
            <span className="text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold px-2 py-0.5 rounded">
              7 Days
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={last7DaysData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorWater" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-[10px] font-mono font-semibold" />
                <YAxis className="text-[10px] font-mono" />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="water" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorWater)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Sleep */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm glass">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading font-bold text-sm text-foreground uppercase tracking-wider">
              Sleep Duration Trend (Hours)
            </h3>
            <span className="text-xs bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold px-2 py-0.5 rounded">
              7 Days
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last7DaysData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-[10px] font-mono font-semibold" />
                <YAxis className="text-[10px] font-mono" />
                <Tooltip />
                <Bar 
                  dataKey="sleep" 
                  fill="#6366f1" 
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Stress */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm glass lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading font-bold text-sm text-foreground uppercase tracking-wider">
              Perceived Stress Scale Indices (PSS-10)
            </h3>
            <span className="text-xs bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold px-2 py-0.5 rounded">
              7 Days
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={last7DaysData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-[10px] font-mono font-semibold" />
                <YAxis domain={[0, 40]} className="text-[10px] font-mono" />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="stress" 
                  stroke="#a855f7" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorStress)" 
                  connectNulls
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Guidelines info */}
      <div className="p-4 bg-muted/40 border border-border rounded-xl flex gap-3 text-xs leading-relaxed text-muted-foreground">
        <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-foreground block mb-1">Weekly Trends Advisory:</span>
          A weekly assessment helps observe metabolic cycles. Maintaining stable hydration levels and adequate 7-9 hours sleep reduces cardiac strain and improves glucose homeostasis. Consult a medical professional for therapeutic advice.
        </div>
      </div>
    </div>
  );
};

export default WeeklyReport;
