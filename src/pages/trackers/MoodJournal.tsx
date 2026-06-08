import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useHealthRead } from '../../context/HealthReadContext';
import { useHealthDispatch } from '../../context/HealthDispatchContext';
import { 
  Smile, 
  Info, 
  Heart, 
  MessageSquare, 
  Flame, 
  TrendingUp, 
  Calendar,
  Sparkles,
  Award,
  BookOpen
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { showToast } from '../../utils/toast';

const moodOptions = [
  { id: 'Awful', label: 'Awful', emoji: '😢', color: 'text-rose-500', activeClass: 'border-rose-500 bg-rose-500/15 scale-105 shadow-[0_0_15px_rgba(244,63,94,0.5)] text-rose-400 font-bold glow-rose ring-2 ring-rose-500/30' },
  { id: 'Low', label: 'Low', emoji: '😕', color: 'text-orange-500', activeClass: 'border-orange-500 bg-orange-500/15 scale-105 shadow-[0_0_15px_rgba(249,115,22,0.5)] text-orange-400 font-bold glow-orange ring-2 ring-orange-500/30' },
  { id: 'Okay', label: 'Okay', emoji: '😐', color: 'text-amber-500', activeClass: 'border-amber-500 bg-amber-500/15 scale-105 shadow-[0_0_15px_rgba(245,158,11,0.5)] text-amber-400 font-bold glow-amber ring-2 ring-amber-500/30' },
  { id: 'Good', label: 'Good', emoji: '🙂', color: 'text-emerald-500', activeClass: 'border-emerald-500 bg-emerald-500/15 scale-105 shadow-[0_0_15px_rgba(16,185,129,0.5)] text-emerald-400 font-bold glow-emerald ring-2 ring-emerald-500/30' },
  { id: 'Great', label: 'Great', emoji: '😀', color: 'text-teal-500', activeClass: 'border-teal-500 bg-teal-500/15 scale-105 shadow-[0_0_15px_rgba(20,184,166,0.5)] text-teal-400 font-bold glow-teal ring-2 ring-teal-500/30' }
];

const getMoodScore = (mood: string): number => {
  const m = mood.toLowerCase();
  if (m === 'great' || m === 'happy') return 5;
  if (m === 'good' || m === 'calm') return 4;
  if (m === 'okay') return 3;
  if (m === 'low' || m === 'anxious') return 2;
  if (m === 'awful' || m === 'sad' || m === 'angry') return 1;
  return 3;
};

const getMoodEmoji = (mood: string): string => {
  const m = mood.toLowerCase();
  if (m === 'great') return '😀';
  if (m === 'good') return '🙂';
  if (m === 'okay') return '😐';
  if (m === 'low') return '😕';
  if (m === 'awful') return '😢';
  if (m === 'happy') return '😊';
  if (m === 'calm') return '😌';
  if (m === 'anxious') return '😰';
  if (m === 'sad') return '😢';
  if (m === 'angry') return '😡';
  return '😌';
};

const getMoodLabel = (mood: string): string => {
  const m = mood.toLowerCase();
  if (m === 'great') return 'Great';
  if (m === 'good') return 'Good';
  if (m === 'okay') return 'Okay';
  if (m === 'low') return 'Low';
  if (m === 'awful') return 'Awful';
  if (m === 'happy') return 'Happy';
  if (m === 'calm') return 'Calm';
  if (m === 'anxious') return 'Anxious';
  if (m === 'sad') return 'Sad';
  if (m === 'angry') return 'Angry';
  return mood;
};

const getMoodLabelByScore = (score: number): string => {
  if (score === 5) return 'Great';
  if (score === 4) return 'Good';
  if (score === 3) return 'Okay';
  if (score === 2) return 'Low';
  if (score === 1) return 'Awful';
  return 'Okay';
};

const getMoodBgClass = (mood: string): string => {
  const m = mood.toLowerCase();
  if (m === 'great' || m === 'happy') return 'bg-teal-500/10 border-teal-500/30 text-teal-400 shadow-[0_0_10px_rgba(20,184,166,0.25)] hover:shadow-[0_0_15px_rgba(20,184,166,0.45)]';
  if (m === 'good' || m === 'calm') return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.25)] hover:shadow-[0_0_15px_rgba(16,185,129,0.45)]';
  if (m === 'okay') return 'bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.25)] hover:shadow-[0_0_15px_rgba(245,158,11,0.45)]';
  if (m === 'low' || m === 'anxious') return 'bg-orange-500/10 border-orange-500/30 text-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.25)] hover:shadow-[0_0_15px_rgba(249,115,22,0.45)]';
  if (m === 'awful' || m === 'sad' || m === 'angry') return 'bg-rose-500/10 border-rose-500/30 text-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.25)] hover:shadow-[0_0_15px_rgba(244,63,94,0.45)]';
  return 'bg-muted/20 border-border text-muted-foreground';
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    if (data.score === null) return null;
    return (
      <div className="bg-card border border-border p-3 rounded-xl shadow-lg text-xs space-y-1">
        <p className="font-bold text-foreground">{data.date}</p>
        <div className="flex items-center gap-1.5 font-semibold">
          <span>Mood:</span>
          <span>{getMoodEmoji(getMoodLabelByScore(data.score))}</span>
          <span className="capitalize">{getMoodLabelByScore(data.score)}</span>
        </div>
      </div>
    );
  }
  return null;
};

const MoodJournal: React.FC = () => {
  const { t, formatDate, formatNumber } = useLanguage();
  const { logs } = useHealthRead();
  const { logMood } = useHealthDispatch();

  const [selectedMood, setSelectedMood] = useState('Okay');
  const [notes, setNotes] = useState('');

  const moodLogs = useMemo(() => {
    return logs.filter(log => log.type === 'mood').slice(0, 5);
  }, [logs]);

  // Compute metrics from log history
  const stats = useMemo(() => {
    const allMoods = logs.filter(log => log.type === 'mood');
    if (allMoods.length === 0) {
      return { avgMood: 0, streak: 0, bestDay: '--' };
    }

    const totalScore = allMoods.reduce((acc, log) => acc + getMoodScore(log.value.mood), 0);
    const avgMood = Math.round((totalScore / allMoods.length) * 10) / 10;

    const logsByDate: { [dateStr: string]: number } = {};
    allMoods.forEach(log => {
      const dateStr = new Date(log.created_at).toDateString();
      const score = getMoodScore(log.value.mood);
      if (!logsByDate[dateStr] || score > logsByDate[dateStr]) {
        logsByDate[dateStr] = score;
      }
    });

    const uniqueDates = Object.keys(logsByDate).map(d => new Date(d)).sort((a, b) => b.getTime() - a.getTime());

    let streak = 0;
    if (uniqueDates.length > 0) {
      const today = new Date();
      const todayStr = today.toDateString();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();

      const latestDateStr = uniqueDates[0].toDateString();
      const hasActiveStreak = latestDateStr === todayStr || latestDateStr === yesterdayStr;

      if (hasActiveStreak) {
        let current = new Date(uniqueDates[0]);
        while (true) {
          const currentStr = current.toDateString();
          const score = logsByDate[currentStr];
          if (score && score >= 4) {
            streak++;
            current.setDate(current.getDate() - 1);
          } else {
            break;
          }
        }
      }
    }

    const weekdayScores: { [day: number]: { total: number; count: number } } = {};
    allMoods.forEach(log => {
      const day = new Date(log.created_at).getDay();
      const score = getMoodScore(log.value.mood);
      if (!weekdayScores[day]) {
        weekdayScores[day] = { total: 0, count: 0 };
      }
      weekdayScores[day].total += score;
      weekdayScores[day].count += 1;
    });

    let bestDayIdx = -1;
    let bestAvg = 0;
    for (let i = 0; i < 7; i++) {
      if (weekdayScores[i]) {
        const avg = weekdayScores[i].total / weekdayScores[i].count;
        if (avg > bestAvg) {
          bestAvg = avg;
          bestDayIdx = i;
        }
      }
    }

    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const bestDay = bestDayIdx !== -1 ? weekdays[bestDayIdx] : '--';

    return { avgMood, streak, bestDay };
  }, [logs]);

  // Compute 14-day trends for the chart
  const chartData = useMemo(() => {
    const data = [];
    const allMoods = logs.filter(log => log.type === 'mood');

    const logsByDate: { [dateStr: string]: number } = {};
    allMoods.forEach(log => {
      const dateStr = new Date(log.created_at).toDateString();
      const score = getMoodScore(log.value.mood);
      if (logsByDate[dateStr]) {
        logsByDate[dateStr] = (logsByDate[dateStr] + score) / 2;
      } else {
        logsByDate[dateStr] = score;
      }
    });

    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toDateString();
      const shortLabel = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      
      data.push({
        date: shortLabel,
        score: logsByDate[dateStr] || null,
      });
    }
    return data;
  }, [logs]);

  // Mood calendar for current month
  const calendarDays = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const firstDay = new Date(year, month, 1);
    const startDayOfWeek = firstDay.getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push({ day: null, date: null, mood: null });
    }

    const allMoods = logs.filter(log => log.type === 'mood');
    const moodByDay: { [dayNum: number]: string } = {};
    allMoods.forEach(log => {
      const logDate = new Date(log.created_at);
      if (logDate.getFullYear() === year && logDate.getMonth() === month) {
        const dayNum = logDate.getDate();
        moodByDay[dayNum] = log.value.mood;
      }
    });

    for (let d = 1; d <= totalDays; d++) {
      const dateObj = new Date(year, month, d);
      days.push({
        day: d,
        date: dateObj,
        mood: moodByDay[d] || null
      });
    }

    return days;
  }, [logs]);

  const handleLog = () => {
    logMood(selectedMood, notes);
    setNotes('');
    showToast(
      navigator.onLine 
        ? `Saved mood journal entry successfully!`
        : `Saved mood entry locally. Will sync online soon!`,
      'success'
    );
  };

  const yAxisTickFormatter = (value: number) => {
    const labels = ['', '😢', '😕', '😐', '🙂', '😀'];
    return labels[value] || '';
  };

  const currentMonthName = new Date().toLocaleString(undefined, { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-up-staggered relative">
      {/* Background atmospheric blobs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-slow"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-slow" style={{ animationDelay: '2.5s' }}></div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-pink-500/20 via-primary/10 to-transparent p-6 rounded-2xl border border-pink-500/20 flex items-center justify-between shadow-lg shadow-pink-950/20 relative overflow-hidden backdrop-blur-sm">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-pink-500 to-rose-500"></div>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-heading text-foreground drop-shadow-sm">{t('tracker.mood.title')}</h1>
          <p className="text-muted-foreground text-sm mt-1 font-medium">Reflect on your emotional states and thoughts daily to understand mental well-being.</p>
        </div>
        <div className="p-3 bg-pink-500/10 text-pink-400 rounded-2xl animate-float border border-pink-500/20 shadow-[0_0_15px_rgba(236,72,153,0.15)]">
          <Smile className="w-6 h-6" />
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Avg Mood Card */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm glass flex items-center justify-between hover:-translate-y-0.5 hover:border-pink-500/30 hover:shadow-[0_0_15px_rgba(236,72,153,0.1)] transition-all duration-300 group relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-pink-500/40 group-hover:bg-pink-500 transition-colors"></div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Avg Mood</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold font-number text-foreground">
                {stats.avgMood > 0 ? formatNumber(stats.avgMood) : '--'}
              </span>
              {stats.avgMood > 0 && <span className="text-xs text-muted-foreground">/ 5.0</span>}
            </div>
            <p className="text-[10px] text-muted-foreground font-semibold">
              {stats.avgMood > 0 ? `Mainly feeling ${getMoodLabel(getMoodLabelByScore(Math.round(stats.avgMood)))}` : 'No logs recorded'}
            </p>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl group-hover:scale-110 transition-transform">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Happy Streak Card */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm glass flex items-center justify-between hover:-translate-y-0.5 hover:border-pink-500/30 hover:shadow-[0_0_15px_rgba(236,72,153,0.1)] transition-all duration-300 group relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-rose-500/40 group-hover:bg-rose-500 transition-colors"></div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Happy Streak</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold font-number text-foreground">
                {formatNumber(stats.streak)}
              </span>
              <span className="text-xs text-muted-foreground">days</span>
            </div>
            <p className="text-[10px] text-muted-foreground font-semibold">Good/Great days logged in a row</p>
          </div>
          <div className="p-3 bg-orange-500/10 text-orange-400 rounded-xl group-hover:scale-110 transition-transform animate-pulse-slow">
            <Flame className="w-5 h-5" />
          </div>
        </div>

        {/* Best Day Card */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm glass flex items-center justify-between hover:-translate-y-0.5 hover:border-pink-500/30 hover:shadow-[0_0_15px_rgba(236,72,153,0.1)] transition-all duration-300 group relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-pink-500/40 group-hover:bg-pink-500 transition-colors"></div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Best Day</span>
            <div className="text-2xl font-extrabold text-foreground drop-shadow-sm font-heading">
              {stats.bestDay}
            </div>
            <p className="text-[10px] text-muted-foreground font-semibold">Highest average mood weekday</p>
          </div>
          <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl group-hover:scale-110 transition-transform">
            <Award className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Logger Form Card */}
        <div className="lg:col-span-7 bg-card border border-border rounded-2xl p-6 shadow-sm glass flex flex-col justify-between space-y-6 relative overflow-hidden group hover:border-pink-500/30 transition-all duration-300">
          <div className="absolute top-0 left-0 w-2 h-2 bg-pink-500 rounded-tl-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 bg-pink-500 rounded-br-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>

          <div className="space-y-6">
            <h3 className="font-heading font-bold text-lg text-foreground flex items-center gap-2 border-b border-border pb-3">
              <BookOpen className="w-5 h-5 text-pink-400" />
              <span>Record Your Mood</span>
            </h3>

            {/* Emoji Row Selector */}
            <div className="space-y-2.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase">How are you feeling?</label>
              <div className="grid grid-cols-5 gap-2">
                {moodOptions.map(m => {
                  const isActive = selectedMood === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedMood(m.id)}
                      className={`p-3 border rounded-xl flex flex-col items-center gap-1.5 transition-all duration-300 touch-target hover:scale-[1.04] active:scale-[0.96] btn-elastic ${
                        isActive 
                          ? m.activeClass 
                          : 'border-border bg-background/30 text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                      }`}
                      aria-label={`Select mood ${m.label}`}
                    >
                      <span className="text-3xl transition-transform duration-300 hover:scale-110 drop-shadow-sm">{m.emoji}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider">{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Daily Notes Textarea */}
            <div className="space-y-2">
              <label htmlFor="notes" className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-pink-400" />
                <span>Daily Notes (Optional)</span>
              </label>
              <textarea
                id="notes"
                rows={4}
                className="w-full p-3 rounded-xl border border-border bg-background/30 focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/30 outline-none transition-all text-sm input-accent-glow"
                placeholder="Write down any thoughts, triggers, or gratitude items..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleLog}
              className="w-full bg-gradient-to-r from-pink-600 to-primary hover:from-pink-500 hover:to-primary/95 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-pink-500/25 hover:shadow-pink-500/35 hover:scale-[1.01] active:scale-[0.99] touch-target btn-elastic btn-pulse-glow"
              style={{ '--btn-glow-color': '236, 72, 153' } as React.CSSProperties}
            >
              <Heart className="w-4 h-4" />
              <span>Save Journal Entry</span>
            </button>
          </div>
        </div>

        {/* Mood Calendar Card */}
        <div className="lg:col-span-5 bg-card border border-border rounded-2xl p-6 shadow-sm glass flex flex-col justify-between space-y-4 relative overflow-hidden group hover:border-pink-500/30 transition-all duration-300">
          <div className="absolute top-0 right-0 w-2 h-2 bg-pink-500 rounded-tr-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div className="absolute bottom-0 left-0 w-2 h-2 bg-pink-500 rounded-bl-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>

          <div>
            <h3 className="font-heading font-bold text-lg text-foreground flex items-center gap-2 border-b border-border pb-3 mb-4">
              <Calendar className="w-5 h-5 text-pink-400" />
              <span>Mood Calendar</span>
            </h3>
            
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-foreground">{currentMonthName}</span>
              <span className="text-[9px] bg-pink-500/10 text-pink-400 font-bold px-2 py-0.5 rounded-full">Current Month</span>
            </div>

            {/* Monospace Weekday Header */}
            <div className="grid grid-cols-7 gap-1.5 text-center text-[9px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                <div key={day} className="py-1">{day}</div>
              ))}
            </div>

            {/* Monospace Calendar Days with Glow Rings */}
            <div className="grid grid-cols-7 gap-1.5">
              {calendarDays.map((cell, idx) => {
                const loggedMood = cell.mood;
                return cell.day ? (
                  <div 
                    key={idx}
                    className={`h-10 rounded-xl flex flex-col items-center justify-center relative border text-[9px] font-bold select-none transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                      loggedMood 
                        ? `${getMoodBgClass(loggedMood)} ring-2 ${
                            loggedMood.toLowerCase() === 'great' ? 'ring-teal-400/80 shadow-[0_0_10px_rgba(20,184,166,0.6)]' :
                            loggedMood.toLowerCase() === 'good' ? 'ring-emerald-400/80 shadow-[0_0_10px_rgba(16,185,129,0.6)]' :
                            loggedMood.toLowerCase() === 'okay' ? 'ring-amber-400/80 shadow-[0_0_10px_rgba(245,158,11,0.6)]' :
                            loggedMood.toLowerCase() === 'low' ? 'ring-orange-400/80 shadow-[0_0_10px_rgba(249,115,22,0.6)]' :
                            'ring-rose-400/80 shadow-[0_0_10px_rgba(244,63,94,0.6)]'
                          }`
                        : 'bg-background/20 border-border/40 hover:bg-muted/30 text-foreground/80'
                    }`}
                    title={loggedMood ? `${cell.day}: ${getMoodLabel(loggedMood)}` : `${cell.day}`}
                  >
                    <span className="absolute top-1 left-1.5 text-[8px] text-muted-foreground/60 font-mono">{cell.day}</span>
                    {loggedMood && (
                      <span className="text-base mt-2 animate-pulse" role="img" aria-label={loggedMood}>
                        {getMoodEmoji(loggedMood)}
                      </span>
                    )}
                  </div>
                ) : (
                  <div key={idx} className="h-10 opacity-0 pointer-events-none" />
                );
              })}
            </div>
          </div>

          <div className="pt-2 text-[10px] text-muted-foreground/80 leading-relaxed italic text-center">
            Logged days shine with mood-specific rings.
          </div>
        </div>

      </div>

      {/* 14-day Line Chart Card */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm glass relative overflow-hidden group hover:border-pink-500/30 transition-all duration-300">
        <div className="absolute top-0 left-0 w-2 h-2 bg-pink-500 rounded-tl-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
        <div className="absolute bottom-0 right-0 w-2 h-2 bg-pink-500 rounded-br-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>

        <div className="flex items-center justify-between mb-6">
          <h3 className="font-heading font-bold text-sm text-foreground uppercase tracking-wider">
            Emotional Trends (Last 14 Days)
          </h3>
          <span className="text-[10px] bg-pink-500/10 text-pink-400 font-bold px-2.5 py-0.5 rounded-lg">
            Trend Line
          </span>
        </div>

        {logs.filter(log => log.type === 'mood').length === 0 ? (
          <div className="h-64 w-full flex flex-col items-center justify-center border border-dashed border-border rounded-xl bg-background/30 text-muted-foreground text-xs space-y-1">
            <Sparkles className="w-8 h-8 text-pink-400/40 animate-pulse-slow mb-2" />
            <span className="font-bold">No Mood Logs Found</span>
            <span>Record your daily mood to visualize your emotional trajectory.</span>
          </div>
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <filter id="pinkGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#ec4899" floodOpacity="0.5" />
                  </filter>
                  <linearGradient id="pinkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/10 dark:stroke-muted/20" />
                <XAxis dataKey="date" className="text-[9px] font-mono font-semibold" />
                <YAxis 
                  domain={[1, 5]} 
                  tickCount={5}
                  tickFormatter={yAxisTickFormatter}
                  className="text-sm font-semibold select-none font-number"
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="url(#pinkGradient)" 
                  strokeWidth={4}
                  filter="url(#pinkGlow)"
                  dot={{ fill: '#ec4899', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#ec4899' }}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* History List Card */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm glass relative overflow-hidden group hover:border-pink-500/30 transition-all duration-300">
        <div className="absolute top-0 right-0 w-2 h-2 bg-pink-500 rounded-tr-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
        <div className="absolute bottom-0 left-0 w-2 h-2 bg-pink-500 rounded-bl-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>

        <h3 className="font-heading font-bold text-lg text-foreground mb-4">Mood Logs History</h3>

        {moodLogs.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground text-sm font-medium">
            No emotional entries saved yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {moodLogs.map(log => {
              const moodLabel = getMoodLabel(log.value.mood);
              const emoji = getMoodEmoji(log.value.mood);
              const bgClass = getMoodBgClass(log.value.mood);
              return (
                <div key={log.id} className="p-4 border border-border/50 bg-muted/10 rounded-xl flex flex-col gap-2 hover:scale-[1.01] transition-all duration-300 hover:border-pink-500/25">
                  <div className="flex items-center justify-between">
                    <time className="text-[10px] text-muted-foreground font-semibold">
                      {formatDate(log.created_at, { dateStyle: 'medium', timeStyle: 'short' })}
                    </time>
                    <div className={`flex items-center gap-1.5 text-xs font-bold px-2 py-0.5 rounded-lg border ${bgClass}`}>
                      <span>{emoji}</span>
                      <span className="capitalize">{moodLabel}</span>
                    </div>
                  </div>
                  {log.value.notes && (
                    <p className="text-xs text-muted-foreground italic bg-background/50 border border-border/60 p-2.5 rounded-lg leading-relaxed">
                      "{log.value.notes}"
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Wellness Info Banner */}
      <div className="p-5 bg-gradient-to-r from-pink-500/5 to-rose-500/5 border border-pink-500/10 rounded-2xl flex gap-3 text-xs leading-relaxed text-muted-foreground relative overflow-hidden backdrop-blur-sm shadow-sm">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-pink-500/20 via-rose-500/20 to-transparent"></div>
        <Info className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-foreground block mb-1 tracking-wide">Mind-Body Connection:</span>
          Emotional stress immediately releases cortisol and epinephrine which elevates blood pressure and glycemic markers. Journaling and naming emotions helps downstream cerebral regulation, lowering sympathetic hyper-arousal.
        </div>
      </div>
    </div>
  );
};

export default MoodJournal;
