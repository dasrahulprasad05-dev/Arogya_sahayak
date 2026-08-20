import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import type { Language } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../integrations/supabase/client';
import { useHealthRead } from '../context/HealthReadContext';
import PredictionResult from '../components/medical/PredictionResult';
import { useFamily, type Relationship } from '../context/FamilyContext';
import {
  Sun,
  Moon,
  Globe,
  LogOut,
  ShieldAlert,
  CheckCircle2,
  Sparkles,
  X,
  History,
  Download,
  Eye,
  Calendar,
  Ticket,
  Users,
  Plus,
  Trash2,
  UserPlus,
  Scan,
  Bot,
  Stethoscope,
  Activity,
  BrainCircuit,
  Clock,
  Flame,
  ArrowUpRight
} from 'lucide-react';

/* ---------------------------------------------------
   Toast System (lightweight, local to this page)
--------------------------------------------------- */
type Toast = {
  id: number;
  type: 'success' | 'error';
  message: string;
};

const useToasts = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const pushToast = useCallback((type: Toast['type'], message: string) => {
    const id = ++idRef.current;
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3200);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return { toasts, pushToast, dismissToast };
};

const ToastContainer: React.FC<{ toasts: Toast[]; onDismiss: (id: number) => void }> = ({
  toasts,
  onDismiss,
}) => (
  <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 w-[calc(100%-2.5rem)] max-w-sm">
    <AnimatePresence>
      {toasts.map(toast => (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, x: 60, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 60, scale: 0.95, transition: { duration: 0.2 } }}
          transition={{ type: 'spring', stiffness: 300, damping: 26 }}
          className={`flex items-start gap-2.5 p-3.5 rounded-xl shadow-lg border backdrop-blur-md ${
            toast.type === 'success'
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
              : 'bg-destructive/15 border-destructive/30 text-destructive'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4.5 h-4.5 shrink-0 mt-0.5" />
          ) : (
            <ShieldAlert className="w-4.5 h-4.5 shrink-0 mt-0.5" />
          )}
          <p className="text-xs font-semibold leading-relaxed flex-1">{toast.message}</p>
          <button
            onClick={() => onDismiss(toast.id)}
            className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);

/* ---------------------------------------------------
   Skeleton Loader
--------------------------------------------------- */
const Shimmer: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`relative overflow-hidden bg-muted rounded-lg ${className}`}>
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent"
      animate={{ x: ['-100%', '100%'] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
    />
  </div>
);

const ProfileSkeleton: React.FC = () => (
  <div className="space-y-6 max-w-2xl mx-auto">
    <div>
      <Shimmer className="h-8 w-48 mb-2" />
      <Shimmer className="h-4 w-72" />
    </div>

    <div className="grid grid-cols-1 gap-6">
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-4 border-b border-border pb-6">
          <Shimmer className="w-16 h-16 rounded-2xl" />
          <div className="space-y-2 flex-1">
            <Shimmer className="h-4 w-40" />
            <Shimmer className="h-3 w-28" />
          </div>
        </div>
        <div className="space-y-2">
          <Shimmer className="h-3 w-16" />
          <Shimmer className="h-10 w-full rounded-lg" />
        </div>
        <Shimmer className="h-10 w-full rounded-xl" />
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
        <Shimmer className="h-5 w-48 pb-2" />
        <div className="flex items-center justify-between">
          <Shimmer className="h-4 w-24" />
          <Shimmer className="h-8 w-40 rounded-xl" />
        </div>
        <div className="flex items-center justify-between">
          <Shimmer className="h-4 w-24" />
          <Shimmer className="h-9 w-24 rounded-xl" />
        </div>
      </div>

      <Shimmer className="h-12 w-full rounded-2xl" />
    </div>
  </div>
);

const containerVariants: any = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

type HistoryTab = 'scans' | 'assistant' | 'predictors' | 'doctors';

const ProfilePage: React.FC = () => {
  const { user, signOut, loading: authLoading, isDevBypass } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { toasts, pushToast, dismissToast } = useToasts();

  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
  const [loading, setLoading] = useState(false);

  const { members, activeMember, setActiveMemberId, addFamilyMember, removeFamilyMember } = useFamily();
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRel, setNewMemberRel] = useState<Relationship>('father');
  const [newMemberAge, setNewMemberAge] = useState(55);
  const [newMemberGender, setNewMemberGender] = useState<'male' | 'female' | 'other'>('male');
  const [newMemberBlood, setNewMemberBlood] = useState('B+');

  const { logs } = useHealthRead();
  
  // Categorized Logs
  const scanLogs = logs.filter(log => log.type === 'scan');
  const predictionLogs = logs.filter(log => log.type === 'prediction');
  const assistantLogs = logs.filter(log => log.type === 'symptom' || log.type === 'stress' || log.type === 'vitals');

  const [activeHistoryTab, setActiveHistoryTab] = useState<HistoryTab>('scans');
  const [selectedPrediction, setSelectedPrediction] = useState<any>(null);

  // Doctor Appointments state
  const [doctorBookings, setDoctorBookings] = useState<any[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user) return;
      setBookingsLoading(true);
      try {
        const { data, error } = await supabase
          .from('appointments')
          .select(`
            *,
            doctors!inner(full_name, specialty_id)
          `)
          .eq('patient_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (!error && data) {
          const mapped = data.map((a: any) => ({
            ...a,
            doctor_name: a.doctors?.full_name,
            doctor_specialty: a.doctors?.specialty_id,
          }));
          setDoctorBookings(mapped);
        }
      } catch (err) {
        console.error('Error fetching appointments:', err);
      } finally {
        setBookingsLoading(false);
      }
    };

    fetchAppointments();
  }, [user]);

  const displayName = user?.user_metadata?.full_name || 'Health Companion User';
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isDevBypass) {
      pushToast('error', 'Profile edits are blocked in Developer Bypass mode.');
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName }
      });

      if (error) throw error;
      
      pushToast('success', 'Profile updated successfully!');
    } catch (err: any) {
      pushToast('error', err.message || t('state.error'));
    } finally {
      setLoading(false);
    }
  };

  const languages: { code: Language; label: string }[] = [
    { code: 'or', label: 'ଓଡ଼ିଆ' },
    { code: 'hi', label: 'हिंदी' },
    { code: 'en', label: 'English' },
  ];

  if (authLoading || !user) {
    return (
      <>
        <ProfileSkeleton />
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      </>
    );
  }

  return (
    <motion.div
      className="space-y-6 max-w-3xl mx-auto relative pb-12"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      {/* Decorative background glow */}
      <div className="pointer-events-none absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute top-40 -left-20 w-56 h-56 bg-emerald-400/10 rounded-full blur-3xl" />

      <motion.div variants={itemVariants} className="relative z-10">
        <h1 className="text-3xl font-bold font-heading text-foreground flex items-center gap-2">
          {t('nav.profile')}
          <Sparkles className="w-5 h-5 text-primary" />
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your health profile information, family records, and access historical diagnostic logs.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 relative z-10">
        {/* 1. Account Details Card */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -2 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="bg-card border border-border rounded-2xl p-6 shadow-sm glass"
        >
          <div className="flex items-center gap-4 border-b border-border pb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-heading font-extrabold text-2xl shadow-md">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-heading font-bold text-lg text-foreground truncate">
                {displayName}
              </h2>
              <p className="text-muted-foreground text-xs truncate mt-0.5">
                {user.email}
              </p>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="mt-6 space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-xs font-semibold text-foreground mb-1.5">
                {t('profile.name')}
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-medium"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 touch-target"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <span>{t('profile.update')}</span>
              )}
            </button>
          </form>
        </motion.div>

        {/* 2. Preferences Card */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -2 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="bg-card border border-border rounded-2xl p-6 shadow-sm glass space-y-6"
        >
          <h3 className="font-heading font-bold text-lg text-foreground border-b border-border pb-2">
            {t('profile.preferences')}
          </h3>

          {/* Theme Selector */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-muted text-foreground">
                {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{t('profile.theme')}</p>
                <p className="text-xs text-muted-foreground">Toggle Light or Dark mode</p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className="px-4 py-2 rounded-xl border border-border hover:bg-muted font-semibold text-xs transition-colors touch-target capitalize"
            >
              {theme} Mode
            </button>
          </div>

          {/* Language Selector */}
          <div className="flex items-center justify-between border-t border-border pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-muted text-foreground">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{t('profile.language')}</p>
                <p className="text-xs text-muted-foreground">Select interface language</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all touch-target ${
                    language === l.code
                      ? 'bg-primary text-white shadow-sm'
                      : 'border border-border hover:bg-muted text-muted-foreground'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 3. Family Health Profiles Card */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -2 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="bg-card border border-border rounded-2xl p-6 shadow-sm glass space-y-4"
        >
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <div>
                <h3 className="font-heading font-bold text-lg text-foreground">Family Health Profiles</h3>
                <p className="text-xs text-muted-foreground">Manage records for parents, children, and relatives</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddMember(!showAddMember)}
              className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              {showAddMember ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              {showAddMember ? 'Cancel' : 'Add Member'}
            </button>
          </div>

          {/* Add Member Form */}
          {showAddMember && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={(e) => {
                e.preventDefault();
                if (!newMemberName.trim()) return;
                addFamilyMember({
                  name: newMemberName.trim(),
                  relationship: newMemberRel,
                  age: newMemberAge,
                  gender: newMemberGender,
                  bloodGroup: newMemberBlood,
                  avatarColor: 'bg-indigo-500 text-white'
                });
                setNewMemberName('');
                setShowAddMember(false);
                pushToast('success', `Added ${newMemberName} to family profiles`);
              }}
              className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-3"
            >
              <h4 className="text-xs font-bold text-primary flex items-center gap-1.5">
                <UserPlus className="w-4 h-4" /> Add Family Member
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newMemberName}
                    onChange={e => setNewMemberName(e.target.value)}
                    placeholder="e.g. Ramesh Sharma"
                    className="w-full p-2 rounded-lg border border-border bg-card text-xs focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold mb-1">Relationship</label>
                  <select
                    value={newMemberRel}
                    onChange={e => setNewMemberRel(e.target.value as Relationship)}
                    className="w-full p-2 rounded-lg border border-border bg-card text-xs focus:border-primary outline-none capitalize"
                  >
                    {['father', 'mother', 'spouse', 'child', 'sibling', 'grandparent', 'other'].map(rel => (
                      <option key={rel} value={rel} className="capitalize">{rel}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold mb-1">Age</label>
                  <input
                    type="number"
                    min={1}
                    max={120}
                    value={newMemberAge}
                    onChange={e => setNewMemberAge(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-border bg-card text-xs focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold mb-1">Gender</label>
                  <select
                    value={newMemberGender}
                    onChange={e => setNewMemberGender(e.target.value as any)}
                    className="w-full p-2 rounded-lg border border-border bg-card text-xs focus:border-primary outline-none"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold mb-1">Blood Group</label>
                  <select
                    value={newMemberBlood}
                    onChange={e => setNewMemberBlood(e.target.value)}
                    className="w-full p-2 rounded-lg border border-border bg-card text-xs focus:border-primary outline-none"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-primary text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-sm"
              >
                <UserPlus className="w-3.5 h-3.5" /> Save Family Member
              </button>
            </motion.form>
          )}

          {/* Members List */}
          <div className="space-y-2">
            {members.map(member => (
              <div
                key={member.id}
                className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs transition-all ${
                  activeMember.id === member.id
                    ? 'border-primary/50 bg-primary/5 shadow-sm'
                    : 'border-border bg-card/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${member.avatarColor || 'bg-primary text-white'}`}>
                    {member.name.slice(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground">{member.name}</span>
                      {activeMember.id === member.id && (
                        <span className="px-1.5 py-0.2 bg-primary/15 text-primary text-[10px] font-bold rounded">
                          Active
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-muted-foreground capitalize">
                      {member.relationship} • {member.age} yrs • {member.bloodGroup || 'Blood: Unknown'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {activeMember.id !== member.id && (
                    <button
                      onClick={() => {
                        setActiveMemberId(member.id);
                        pushToast('success', `Switched active profile to ${member.name}`);
                      }}
                      className="px-2.5 py-1 bg-muted hover:bg-muted/80 rounded-lg text-[11px] font-semibold text-foreground transition-all"
                    >
                      Select
                    </button>
                  )}
                  {member.id !== 'self' && (
                    <button
                      onClick={() => {
                        removeFamilyMember(member.id);
                        pushToast('success', `Removed ${member.name}`);
                      }}
                      className="p-1.5 text-muted-foreground hover:text-destructive rounded-lg transition-all"
                      title="Remove Member"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ════════════════════════════════════════════════════════════════
            4. SEPARATE HEALTH ACTIVITY & HISTORY HUB (CNN, Assistant, Predictors, Doctors)
        ════════════════════════════════════════════════════════════════ */}
        <motion.div
          variants={itemVariants}
          className="bg-card border border-border rounded-2xl p-6 shadow-sm glass space-y-5"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
            <div className="flex items-center gap-2.5">
              <History className="w-5 h-5 text-primary" />
              <div>
                <h3 className="font-heading font-bold text-lg text-foreground">
                  Health Activity &amp; Records History
                </h3>
                <p className="text-xs text-muted-foreground">
                  Access past diagnostic scans, AI predictor screenings, triage chats, and doctor visits
                </p>
              </div>
            </div>

            <span className="text-[11px] font-mono px-2.5 py-1 bg-primary/10 text-primary font-bold rounded-lg border border-primary/20 shrink-0 self-start sm:self-auto">
              {scanLogs.length + predictionLogs.length + assistantLogs.length + doctorBookings.length} Total Records
            </span>
          </div>

          {/* 4 History Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-muted/40 p-1.5 rounded-xl border border-border">
            {/* Tab 1: CNN Scans */}
            <button
              onClick={() => setActiveHistoryTab('scans')}
              className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeHistoryTab === 'scans'
                  ? 'bg-card text-foreground shadow-md border border-border scale-[1.02]'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Scan className="w-3.5 h-3.5 text-rose-500" />
              <span>CNN Scans</span>
              <span className="text-[10px] bg-rose-500/15 text-rose-500 px-1.5 py-0.2 rounded-full font-extrabold">
                {scanLogs.length}
              </span>
            </button>

            {/* Tab 2: AI Predictors */}
            <button
              onClick={() => setActiveHistoryTab('predictors')}
              className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeHistoryTab === 'predictors'
                  ? 'bg-card text-foreground shadow-md border border-border scale-[1.02]'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <BrainCircuit className="w-3.5 h-3.5 text-violet-500" />
              <span>Predictors</span>
              <span className="text-[10px] bg-violet-500/15 text-violet-500 px-1.5 py-0.2 rounded-full font-extrabold">
                {predictionLogs.length}
              </span>
            </button>

            {/* Tab 3: AI Assistant */}
            <button
              onClick={() => setActiveHistoryTab('assistant')}
              className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeHistoryTab === 'assistant'
                  ? 'bg-card text-foreground shadow-md border border-border scale-[1.02]'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-cyan-500" />
              <span>Assistant</span>
              <span className="text-[10px] bg-cyan-500/15 text-cyan-500 px-1.5 py-0.2 rounded-full font-extrabold">
                {assistantLogs.length}
              </span>
            </button>

            {/* Tab 4: Doctors */}
            <button
              onClick={() => setActiveHistoryTab('doctors')}
              className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeHistoryTab === 'doctors'
                  ? 'bg-card text-foreground shadow-md border border-border scale-[1.02]'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5 text-emerald-500" />
              <span>Doctors</span>
              <span className="text-[10px] bg-emerald-500/15 text-emerald-500 px-1.5 py-0.2 rounded-full font-extrabold">
                {doctorBookings.length}
              </span>
            </button>
          </div>

          {/* TAB 1: CNN IMAGE SCANS HISTORY */}
          {activeHistoryTab === 'scans' && (
            <div className="space-y-3">
              {scanLogs.length === 0 ? (
                <div className="p-8 border border-dashed border-border rounded-xl text-center space-y-3">
                  <Scan className="w-8 h-8 text-rose-500 mx-auto opacity-70 animate-pulse" />
                  <div>
                    <span className="text-xs font-bold text-foreground block">No CNN Scans Recorded Yet</span>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Upload diagnostic radiographs, dermatoscopy, sputum, or blood smear photos.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/scan')}
                    className="py-2 px-4 bg-primary text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Launch 16 CNN Scanners</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                scanLogs.map((log) => {
                  const val = log.value;
                  const riskLevel = val.result?.risk || 'Moderate';
                  const riskColor = riskLevel === 'High' || riskLevel === 'Critical'
                    ? 'text-red-500 bg-red-500/10 border-red-500/20'
                    : riskLevel === 'Moderate'
                      ? 'text-amber-500 bg-amber-500/10 border-amber-500/20'
                      : 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';

                  return (
                    <div
                      key={log.id}
                      className="p-4 rounded-xl border border-border bg-card/60 hover:bg-muted/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-foreground capitalize flex items-center gap-1.5">
                            <Flame className="w-4 h-4 text-rose-500" />
                            {val.scanType ? `${val.scanType.replace('_', ' ')} CNN Scan` : 'Medical Image Scan'}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${riskColor}`}>
                            {riskLevel} Risk
                          </span>
                          <span className="text-[10px] font-mono bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                            {val.result?.confidence || Math.round((val.localScore || 0.78) * 100)}% Confidence
                          </span>
                        </div>

                        <p className="text-xs text-muted-foreground font-semibold">
                          Finding: <span className="text-foreground font-bold">{val.localLabel || 'Anatomical Feature Analyzed'}</span>
                        </p>

                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{new Date((log as any).logged_at || log.created_at).toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => {
                            setSelectedPrediction({
                              value: {
                                predictorId: val.scanType || 'image_analysis',
                                result: val.result || {
                                  risk: riskLevel,
                                  confidence: val.result?.confidence || 80,
                                  reasoning: [`Visual Finding: ${val.localLabel || 'Feature identified'}`],
                                  recommendations: ['Consult specialist for clinical physical evaluation.'],
                                  urgency: 'routine',
                                  disclaimer: 'AI Screening tool, not a clinical diagnosis.'
                                }
                              }
                            });
                          }}
                          className="px-3 py-1.5 rounded-lg border border-border hover:border-primary text-xs font-semibold text-foreground hover:text-primary transition-all flex items-center gap-1.5 shadow-sm"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Report</span>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedPrediction({
                              value: {
                                predictorId: val.scanType || 'image_analysis',
                                result: val.result
                              }
                            });
                            setTimeout(() => window.print(), 500);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>PDF</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 2: AI PREDICTORS HISTORY */}
          {activeHistoryTab === 'predictors' && (
            <div className="space-y-3">
              {predictionLogs.length === 0 ? (
                <div className="p-8 border border-dashed border-border rounded-xl text-center space-y-3">
                  <BrainCircuit className="w-8 h-8 text-violet-500 mx-auto opacity-70" />
                  <div>
                    <span className="text-xs font-bold text-foreground block">No Chronic Predictor Logs</span>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Check your risk for Diabetes, Hypertension, Heart Attack, Liver, or Kidney health.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/predictors')}
                    className="py-2 px-4 bg-primary text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Open AI Predictors Hub</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                predictionLogs.map((log) => {
                  const val = log.value;
                  const riskLevel = val.result?.risk || 'Moderate';
                  const riskColor = riskLevel === 'High' || riskLevel === 'Critical' 
                    ? 'text-red-500 bg-red-500/10 border-red-500/20' 
                    : riskLevel === 'Moderate'
                      ? 'text-amber-500 bg-amber-500/10 border-amber-500/20'
                      : 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';

                  return (
                    <div key={log.id} className="p-4 rounded-xl border border-border bg-card/60 hover:bg-muted/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1.5 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-foreground capitalize flex items-center gap-1.5">
                            <Activity className="w-4 h-4 text-violet-500" />
                            {val.predictorId.replace('-', ' ')}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${riskColor}`}>
                            {riskLevel} Risk
                          </span>
                          <span className="text-[10px] font-mono bg-violet-500/10 text-violet-500 px-2 py-0.5 rounded-full font-bold">
                            {val.result?.confidence || 85}% Confidence
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date((log as any).logged_at || log.created_at).toLocaleString()}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setSelectedPrediction(log)}
                          className="px-3 py-1.5 rounded-lg border border-border hover:border-primary text-xs font-semibold text-foreground hover:text-primary transition-all flex items-center gap-1.5 touch-target shadow-sm"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View PDF
                        </button>
                        <button
                          onClick={() => {
                            setSelectedPrediction(log);
                            setTimeout(() => window.print(), 500);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs font-bold transition-all flex items-center gap-1.5 touch-target shadow-sm"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 3: AI ASSISTANT & TRIAGE CHAT */}
          {activeHistoryTab === 'assistant' && (
            <div className="space-y-3">
              {assistantLogs.length === 0 ? (
                <div className="p-8 border border-dashed border-border rounded-xl text-center space-y-3">
                  <Bot className="w-8 h-8 text-cyan-500 mx-auto opacity-70 animate-bounce" />
                  <div>
                    <span className="text-xs font-bold text-foreground block">No Assistant Triage History</span>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Talk with our AI Medical Companion or check your symptoms in real-time.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/chat')}
                    className="py-2 px-4 bg-primary text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Start AI Health Consultation</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                assistantLogs.map((log) => {
                  const val = log.value;
                  return (
                    <div key={log.id} className="p-4 rounded-xl border border-border bg-card/60 hover:bg-muted/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1.5 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-foreground capitalize flex items-center gap-1.5">
                            <Bot className="w-4 h-4 text-cyan-500" />
                            {log.type === 'symptom' ? 'Symptom Triage' : log.type === 'stress' ? 'Stress Evaluation' : 'Vitals Triage'}
                          </span>
                          {val.symptoms && (
                            <span className="text-[10px] bg-cyan-500/10 text-cyan-500 px-2 py-0.5 rounded-full font-bold">
                              {val.symptoms.length} Symptoms Reported
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {log.type === 'symptom' ? (
                            `Symptoms: ${val.symptoms?.join(', ') || 'General evaluation'}`
                          ) : log.type === 'stress' ? (
                            `PSS-10 Stress Score: ${val.score}/40`
                          ) : (
                            `Vitals: BP ${val.systolic}/${val.diastolic} mmHg, HR ${val.heartRate} bpm, SpO2 ${val.spO2}%`
                          )}
                        </p>
                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{new Date((log as any).logged_at || log.created_at).toLocaleString()}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => navigate('/chat')}
                        className="px-3.5 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-500 border border-cyan-500/20 text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
                      >
                        <Bot className="w-3.5 h-3.5" />
                        <span>Open Chat</span>
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 4: DOCTOR APPOINTMENTS & VISITS */}
          {activeHistoryTab === 'doctors' && (
            <div className="space-y-3">
              {bookingsLoading ? (
                <div className="p-8 text-center text-muted-foreground text-xs">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <span>Loading Doctor Bookings...</span>
                </div>
              ) : doctorBookings.length === 0 ? (
                <div className="p-8 border border-dashed border-border rounded-xl text-center space-y-3">
                  <Stethoscope className="w-8 h-8 text-emerald-500 mx-auto opacity-70" />
                  <div>
                    <span className="text-xs font-bold text-foreground block">No Doctor Appointments Yet</span>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Book certified clinicians, specialists, and community health centers near you.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/doctors')}
                    className="py-2 px-4 bg-primary text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Find &amp; Book Doctors</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                doctorBookings.map((b) => (
                  <div
                    key={b.id}
                    className="p-4 rounded-xl border border-border bg-card/60 hover:bg-muted/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-foreground flex items-center gap-1.5">
                          <Stethoscope className="w-4 h-4 text-emerald-500" />
                          {b.doctor_name || 'Dr. Specialist'}
                        </span>
                        <span className="text-[10px] bg-emerald-500/15 text-emerald-500 font-bold px-2 py-0.5 rounded-full capitalize">
                          {b.status || 'Confirmed'}
                        </span>
                        <span className="text-[10px] font-mono bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                          Token: #{b.token_number || b.id.slice(0, 5)}
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground">
                        {b.doctor_specialty || 'General Medicine'} &bull; Scheduled for <strong className="text-foreground">{b.slot_date} at {b.slot_time}</strong>
                      </p>

                      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Booked on {new Date(b.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate('/booking-history')}
                      className="px-3.5 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
                    >
                      <Ticket className="w-3.5 h-3.5" />
                      <span>View Ticket &amp; QR</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </motion.div>

        {/* Action Sign Out Button */}
        <motion.button
          variants={itemVariants}
          onClick={signOut}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-destructive/10 hover:bg-destructive/20 border border-destructive/20 hover:border-destructive text-destructive font-semibold py-3 rounded-2xl text-sm transition-colors flex items-center justify-center gap-2 touch-target"
        >
          <LogOut className="w-4 h-4" />
          <span>{t('profile.logout')}</span>
        </motion.button>
      </div>
      
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Prediction / Scan Modal for PDF Viewing/Downloading */}
      <AnimatePresence>
        {selectedPrediction && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-background/80 backdrop-blur-sm hide-on-print">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-background border border-border shadow-2xl"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-background/90 backdrop-blur border-b border-border hide-on-print">
                <h3 className="font-heading font-bold text-lg flex items-center gap-2">
                  <History className="w-5 h-5 text-primary" />
                  Clinical Diagnostic Report
                </h3>
                <button
                  onClick={() => setSelectedPrediction(null)}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-4 sm:p-6 pb-20">
                <PredictionResult 
                  predictorId={selectedPrediction.value.predictorId}
                  data={selectedPrediction.value.result}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProfilePage;
