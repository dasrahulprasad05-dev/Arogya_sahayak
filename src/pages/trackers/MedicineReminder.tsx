import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useHealthRead } from '../../context/HealthReadContext';
import { useHealthDispatch } from '../../context/HealthDispatchContext';
import { Bell, BellOff, Calendar, Info, Clock, Plus } from 'lucide-react';
import { showToast } from '../../utils/toast';

const MedicineReminder: React.FC = () => {
  const { t } = useLanguage();
  const { logs } = useHealthRead();
  const { logMedicine } = useHealthDispatch();

  const [title, setTitle] = useState('');
  const [dosage, setDosage] = useState('1 Tablet');
  const [frequency, setFrequency] = useState('Daily');
  const [time, setTime] = useState('08:00');
  
  const [notifGranted, setNotifGranted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Check notification status
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotifGranted(Notification.permission === 'granted');
    }
  }, []);

  // Update current time to keep countdowns accurate
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const requestNotifPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotifGranted(permission === 'granted');
    }
  };

  const activeReminders = logs.filter(log => log.type === 'medicine');

  const getCountdown = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    const target = new Date(currentTime);
    target.setHours(h, m, 0, 0);
    if (target.getTime() < currentTime.getTime()) {
      target.setDate(target.getDate() + 1);
    }
    const diffMs = target.getTime() - currentTime.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${diffHrs}h ${diffMins}m`;
  };

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    logMedicine({ title, dosage, frequency, time });

    // Set up local simulated notification
    if (notifGranted) {
      const [hours, minutes] = time.split(':').map(Number);
      const targetTime = new Date();
      targetTime.setHours(hours, minutes, 0, 0);

      if (targetTime.getTime() < Date.now()) {
        targetTime.setDate(targetTime.getDate() + 1);
      }

      const diffMs = targetTime.getTime() - Date.now();
      
      setTimeout(() => {
        new Notification("Aarogya Sahayak Medicine Reminder", {
          body: `Time to take your prescription: ${title} (${dosage})`,
          icon: '/pwa-192x192.png'
        });
      }, Math.min(diffMs, 2147483647));
    }

    setTitle('');
    showToast(
      navigator.onLine 
        ? `Reminder for ${title} scheduled successfully!`
        : `Reminder saved locally. Will sync online soon!`,
      'success'
    );
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-up-staggered">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-foreground">{t('tracker.medicine.title')}</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage prescription schedules and browser-based notifications.</p>
        </div>

        {/* Notifications toggle button */}
        {notifGranted ? (
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2 rounded-xl">
            <Bell className="w-4 h-4 shrink-0" />
            <span>Alert Notifications Active</span>
          </div>
        ) : (
          <button
            onClick={requestNotifPermission}
            className="flex items-center gap-1.5 text-amber-600 dark:text-amber-500 text-xs font-semibold bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 px-3.5 py-2 rounded-xl transition-all touch-target btn-elastic"
          >
            <BellOff className="w-4 h-4 shrink-0" />
            <span>Enable Reminders (Click here)</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Entry Form */}
        <form onSubmit={handleAddReminder} className="lg:col-span-7 bg-card border border-border rounded-2xl p-6 shadow-sm glass space-y-4">
          <h3 className="font-heading font-bold text-lg text-foreground flex items-center gap-2 border-b border-border pb-3">
            <Plus className="w-5 h-5 text-primary" />
            <span>Add Prescription Reminder</span>
          </h3>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold mb-1" htmlFor="medName">
                Medicine Name
              </label>
              <input
                id="medName"
                type="text"
                required
                className="w-full p-2.5 rounded-lg border border-border bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm input-accent-glow"
                placeholder="e.g., Metformin / Paracetamol"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Dosage */}
              <div>
                <label className="block text-xs font-semibold mb-1" htmlFor="dosage">
                  Dosage / Volume
                </label>
                <input
                  id="dosage"
                  type="text"
                  required
                  className="w-full p-2.5 rounded-lg border border-border bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm input-accent-glow"
                  placeholder="e.g., 1 Tablet"
                  value={dosage}
                  onChange={e => setDosage(e.target.value)}
                />
              </div>

              {/* Frequency */}
              <div>
                <label className="block text-xs font-semibold mb-1" htmlFor="frequency">
                  Frequency
                </label>
                <select
                  id="frequency"
                  className="w-full p-2.5 rounded-lg border border-border bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm input-accent-glow"
                  value={frequency}
                  onChange={e => setFrequency(e.target.value)}
                >
                  <option value="Daily">Daily</option>
                  <option value="Twice Daily">Twice Daily</option>
                  <option value="Three Times Daily">Three Times Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="As Needed (SOS)">As Needed (SOS)</option>
                </select>
              </div>

              {/* Time */}
              <div>
                <label className="block text-xs font-semibold mb-1" htmlFor="remTime">
                  Reminder Time
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-foreground pointer-events-none">
                    <Clock className="w-4 h-4" />
                  </span>
                  <input
                    id="remTime"
                    type="time"
                    required
                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-border bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm input-accent-glow font-number"
                    value={time}
                    onChange={e => setTime(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary/95 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md touch-target btn-elastic btn-pulse-glow"
              style={{ '--btn-glow-color': '139, 92, 246' } as React.CSSProperties}
            >
              <Bell className="w-4 h-4" />
              <span>Schedule Reminder</span>
            </button>
          </div>
        </form>

        {/* Reminders List */}
        <div className="lg:col-span-5 bg-card border border-border rounded-2xl p-6 shadow-sm glass">
          <h3 className="font-heading font-bold text-lg text-foreground mb-4 flex items-center gap-2 border-b border-border/40 pb-3">
            <Calendar className="w-5 h-5 text-primary" />
            <span>Prescription Reminders Schedule</span>
          </h3>

          {activeReminders.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-sm font-medium">
              No prescriptions scheduled. Add one on the left!
            </div>
          ) : (
            <div className="space-y-4 mt-4">
              {activeReminders.map(log => (
                <div 
                  key={log.id} 
                  className="p-4 border-2 border-primary/10 bg-muted/10 rounded-full flex items-center justify-between px-6 shadow-sm relative overflow-hidden group hover:border-primary/30 transition-all hover:scale-[1.01]"
                >
                  <div className="flex items-center gap-3">
                    {/* Pulsing Active Dot */}
                    <span className="relative flex h-2.5 w-2.5 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <div className="space-y-0.5">
                      <span className="text-sm font-extrabold text-foreground block leading-tight">{log.value.title}</span>
                      <div className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider flex items-center gap-2">
                        <span>{log.value.dosage}</span>
                        <span>•</span>
                        <span>{log.value.frequency}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Countdown Readout */}
                  <div className="flex flex-col items-end shrink-0 gap-1.5">
                    <div className="flex items-center gap-1 text-[11px] font-bold bg-primary/10 text-primary px-3 py-1 rounded-full font-number">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{log.value.time}</span>
                    </div>
                    <span className="text-[9px] text-muted-foreground/85 font-extrabold tracking-wider uppercase font-number bg-muted/30 px-2 py-0.5 rounded-full border border-border/20">
                      In: {getCountdown(log.value.time)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Guidelines info */}
      <div className="p-4 bg-muted/40 border border-border rounded-xl flex gap-3 text-xs leading-relaxed text-muted-foreground">
        <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-foreground block mb-1">Prescription Compliance Protocol:</span>
          Adhering to prescribed times keeps therapeutic drug levels stable in blood plasma. Skipping or delaying dosages (especially for hypertension, coronary disease, or diabetes) can result in rebound spikes or decreased efficacy. Use browser notifications to remind you.
        </div>
      </div>
    </div>
  );
};

export default MedicineReminder;
