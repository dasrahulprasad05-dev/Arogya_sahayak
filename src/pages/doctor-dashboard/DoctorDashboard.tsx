import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../../integrations/supabase/client';
import { useAuth } from '../../context/AuthContext';
import type { Appointment, Doctor } from '../../lib/types/doctor';
import { DAY_NAMES } from '../../lib/types/doctor';
import { formatTime12h } from '../../utils/formatTime';
import {
  Stethoscope, Calendar, CheckCircle, XCircle, Clock, ScanLine,
  Users, LogOut, RefreshCw, ChevronLeft, ChevronRight, QrCode,
  ClipboardList, BarChart3, Settings, Plus, Trash2, Save
} from 'lucide-react';

type Tab = 'appointments' | 'calendar' | 'stats' | 'schedule';
const DAY_NAMES_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface EditableSlot {
  day_of_week: number;
  start_time: string;
  end_time: string;
  max_patients: number;
}

const DoctorDashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('appointments');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filterDate, setFilterDate] = useState<string>('');

  // Schedule editing state
  const [editSlots, setEditSlots] = useState<EditableSlot[]>([]);
  const [savingSlots, setSavingSlots] = useState(false);
  const [slotMsg, setSlotMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Calendar state
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [selectedCalDate, setSelectedCalDate] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [docRes, aptRes, slotsRes] = await Promise.all([
        supabase.from('doctors').select('*').eq('id', user.id).single(),
        supabase.from('appointments').select('*').eq('doctor_id', user.id).order('appointment_date', { ascending: true }).order('token_number'),
        supabase.from('doctor_time_slots').select('*').eq('doctor_id', user.id).order('day_of_week'),
      ]);
      if (docRes.data) setDoctor(docRes.data as Doctor);
      setAppointments((aptRes.data || []) as Appointment[]);
      if (slotsRes.data && slotsRes.data.length > 0) {
        setEditSlots(slotsRes.data.map((s: any) => ({
          day_of_week: s.day_of_week,
          start_time: s.start_time?.slice(0, 5) || '09:00',
          end_time: s.end_time?.slice(0, 5) || '13:00',
          max_patients: s.max_patients,
        })));
      }
    } catch { }
    finally { setLoading(false); }
  }, [user]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAction = async (id: string, status: 'approved' | 'rejected') => {
    setActionLoading(id);
    try {
      const updates: any = { status, updated_at: new Date().toISOString() };

      // Generate QR data string on approval
      if (status === 'approved') {
        const apt = appointments.find(a => a.id === id);
        if (apt) {
          updates.qr_data = JSON.stringify({
            t: id, n: apt.token_number, d: apt.doctor_id,
            p: apt.patient_id, dt: apt.appointment_date, ts: new Date().toISOString(), v: 1
          });
        }
      }

      await supabase.from('appointments').update(updates).eq('id', id);
      await fetchData();
    } catch { }
    finally { setActionLoading(null); }
  };

  const handleLogout = async () => { await signOut(); navigate('/doctor-login'); };

  // Stats
  const today = new Date().toISOString().split('T')[0];
  const pendingCount = appointments.filter(a => a.status === 'pending').length;
  const todayApts = appointments.filter(a => a.appointment_date === today);
  const totalScanned = appointments.filter(a => a.status === 'scanned' || a.status === 'completed').length;

  // Calendar logic
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(calYear, calMonth, 1).getDay();
  const monthName = new Date(calYear, calMonth).toLocaleString('en', { month: 'long', year: 'numeric' });

  // Count appointments per date
  const aptsByDate = appointments.reduce((acc, a) => {
    acc[a.appointment_date] = (acc[a.appointment_date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const selectedDateApts = selectedCalDate
    ? appointments.filter(a => a.appointment_date === selectedCalDate)
    : [];

  // Filtered appointments for the list tab
  const pendingApts = appointments.filter(a => a.status === 'pending');
  const filteredApts = filterDate
    ? appointments.filter(a => a.appointment_date === filterDate)
    : pendingApts;

  const tabs = [
    { id: 'appointments' as Tab, label: 'Appointments', icon: ClipboardList, badge: pendingCount },
    { id: 'calendar' as Tab, label: 'Calendar', icon: Calendar },
    { id: 'schedule' as Tab, label: 'Schedule', icon: Settings },
    { id: 'stats' as Tab, label: 'Stats', icon: BarChart3 },
  ];

  // Schedule editing helpers
  const addEditSlot = () => setEditSlots(prev => [...prev, { day_of_week: 1, start_time: '09:00', end_time: '13:00', max_patients: 20 }]);
  const removeEditSlot = (idx: number) => setEditSlots(prev => prev.filter((_, i) => i !== idx));
  const updateEditSlot = (idx: number, field: keyof EditableSlot, value: any) => {
    setEditSlots(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  };

  const handleSaveSchedule = async () => {
    if (!user || editSlots.length === 0) return;
    setSavingSlots(true);
    setSlotMsg(null);
    try {
      // Delete existing slots
      await supabase.from('doctor_time_slots').delete().eq('doctor_id', user.id);
      // Insert new slots
      const { error } = await supabase.from('doctor_time_slots').insert(
        editSlots.map(s => ({
          doctor_id: user.id,
          day_of_week: s.day_of_week,
          start_time: s.start_time + ':00',
          end_time: s.end_time + ':00',
          max_patients: s.max_patients,
          is_active: true,
        }))
      );
      if (error) throw error;
      setSlotMsg({ type: 'success', text: 'Schedule updated successfully!' });
    } catch (err: any) {
      setSlotMsg({ type: 'error', text: err.message || 'Failed to save schedule.' });
    } finally {
      setSavingSlots(false);
    }
  };

  if (loading && !doctor) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-base">Dr. {doctor?.full_name?.split(' ').slice(-1)[0] || 'Dashboard'}</h1>
              <p className="text-[10px] text-muted-foreground capitalize">{doctor?.specialty_id?.replace(/_/g, ' ')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/doctor-scanner')} className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors" title="QR Scanner">
              <QrCode className="w-4 h-4" />
            </button>
            <button onClick={fetchData} className="p-2 hover:bg-muted rounded-lg" title="Refresh">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={handleLogout} className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-destructive" title="Logout">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Tabs */}
        <div className="flex gap-1 bg-muted/50 p-1 rounded-xl">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all relative ${
                activeTab === tab.id ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}>
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              {tab.badge && tab.badge > 0 && (
                <span className="w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{tab.badge}</span>
              )}
            </button>
          ))}
        </div>

        {/* ── Appointments Tab ── */}
        {activeTab === 'appointments' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold flex-1">
                {filterDate ? `Appointments for ${new Date(filterDate + 'T00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}` : `Pending Approvals (${pendingCount})`}
              </h2>
              <div className="flex items-center gap-2">
                <input type="date" className="px-3 py-1.5 text-xs rounded-lg border border-border bg-card" value={filterDate} onChange={e => setFilterDate(e.target.value)} />
                {filterDate && <button onClick={() => setFilterDate('')} className="text-xs text-primary hover:underline">Clear</button>}
              </div>
            </div>

            {filteredApts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <CheckCircle className="w-10 h-10 mx-auto mb-2 opacity-20" />
                <p className="text-sm">No {filterDate ? '' : 'pending '}appointments</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredApts.map(apt => (
                  <motion.div key={apt.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="bg-card border border-border rounded-xl p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-mono font-bold text-primary">#{apt.token_number}</span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                            apt.status === 'pending' ? 'bg-amber-500/10 text-amber-600' :
                            apt.status === 'approved' ? 'bg-emerald-500/10 text-emerald-600' :
                            apt.status === 'scanned' ? 'bg-blue-500/10 text-blue-600' :
                            'bg-muted text-muted-foreground'
                          }`}>{apt.status}</span>
                        </div>
                        <p className="text-sm font-semibold">{apt.patient_name}</p>
                        <p className="text-xs text-muted-foreground">{apt.patient_mobile} • {apt.patient_district}, {apt.patient_state}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(apt.appointment_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>

                      {apt.status === 'pending' && (
                        <div className="flex gap-2 shrink-0">
                          <button onClick={() => handleAction(apt.id, 'approved')} disabled={actionLoading === apt.id}
                            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1 disabled:opacity-50">
                            <CheckCircle className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button onClick={() => handleAction(apt.id, 'rejected')} disabled={actionLoading === apt.id}
                            className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1 disabled:opacity-50">
                            <XCircle className="w-3.5 h-3.5" /> Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Calendar Tab ── */}
        {activeTab === 'calendar' && (
          <div className="space-y-4">
            {/* Month navigation */}
            <div className="flex items-center justify-between">
              <button onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); } else setCalMonth(m => m - 1); }}
                className="p-2 hover:bg-muted rounded-lg"><ChevronLeft className="w-4 h-4" /></button>
              <h2 className="font-semibold">{monthName}</h2>
              <button onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); } else setCalMonth(m => m + 1); }}
                className="p-2 hover:bg-muted rounded-lg"><ChevronRight className="w-4 h-4" /></button>
            </div>

            {/* Calendar grid */}
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="grid grid-cols-7 gap-1 mb-2">
                {DAY_NAMES_SHORT.map(d => <div key={d} className="text-center text-[10px] text-muted-foreground font-semibold py-1">{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDayOfWeek }, (_, i) => <div key={`e-${i}`} />)}
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const day = i + 1;
                  const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  const count = aptsByDate[dateStr] || 0;
                  const isSelected = selectedCalDate === dateStr;
                  const isToday = dateStr === today;

                  return (
                    <button key={day} onClick={() => setSelectedCalDate(isSelected ? null : dateStr)}
                      className={`relative aspect-square rounded-lg flex flex-col items-center justify-center text-sm transition-all ${
                        isSelected ? 'bg-primary text-white shadow-md' :
                        isToday ? 'bg-primary/10 text-primary font-bold' :
                        count > 0 ? 'hover:bg-muted' : 'hover:bg-muted/50 text-muted-foreground'
                      }`}>
                      {day}
                      {count > 0 && !isSelected && (
                        <span className={`absolute bottom-0.5 w-1.5 h-1.5 rounded-full ${count >= 15 ? 'bg-rose-500' : count >= 8 ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                      )}
                      {isSelected && count > 0 && (
                        <span className="text-[8px] font-bold">{count}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected date patients */}
            {selectedCalDate && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">
                  {new Date(selectedCalDate + 'T00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                  <span className="text-muted-foreground font-normal ml-2">({selectedDateApts.length} patients)</span>
                </h3>
                {selectedDateApts.length === 0 ? (
                  <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">No appointments on this date</p>
                ) : (
                  <div className="space-y-2">
                    {selectedDateApts.map(apt => (
                      <div key={apt.id} className="bg-card border border-border rounded-lg p-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-primary text-sm">#{apt.token_number}</span>
                          <div>
                            <p className="text-sm font-medium">{apt.patient_name}</p>
                            <p className="text-[10px] text-muted-foreground">{apt.patient_mobile}</p>
                          </div>
                        </div>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                          apt.status === 'approved' ? 'bg-emerald-500/10 text-emerald-600' :
                          apt.status === 'scanned' ? 'bg-blue-500/10 text-blue-600' :
                          apt.status === 'pending' ? 'bg-amber-500/10 text-amber-600' :
                          'bg-muted text-muted-foreground'
                        }`}>{apt.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Stats Tab ── */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Total Patients', value: appointments.length, icon: Users, color: 'text-primary' },
                { label: 'Pending', value: pendingCount, icon: Clock, color: 'text-amber-500' },
                { label: "Today's Queue", value: todayApts.length, icon: Calendar, color: 'text-blue-500' },
                { label: 'Total Scanned', value: totalScanned, icon: ScanLine, color: 'text-emerald-500' },
              ].map((stat, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-4 text-center">
                  <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-2`} />
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-[10px] text-muted-foreground font-medium">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Today's Queue */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Today's Queue</h3>
              {todayApts.length === 0 ? (
                <p className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg text-center">No appointments today</p>
              ) : (
                <div className="space-y-2">
                  {todayApts.map(apt => (
                    <div key={apt.id} className="bg-card border border-border rounded-lg p-3 flex items-center gap-3">
                      <span className="font-mono font-bold text-primary w-10 text-center">#{apt.token_number}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{apt.patient_name}</p>
                      </div>
                      {apt.status === 'scanned' ? (
                        <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold"><CheckCircle className="w-3 h-3" /> Visited</span>
                      ) : apt.status === 'approved' ? (
                        <span className="flex items-center gap-1 text-[10px] text-amber-600 font-semibold"><Clock className="w-3 h-3" /> Waiting</span>
                      ) : (
                        <span className="text-[10px] text-muted-foreground">{apt.status}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Schedule Tab ── */}
        {activeTab === 'schedule' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold flex items-center gap-2"><Settings className="w-5 h-5 text-primary" /> Your Schedule</h2>
                <p className="text-xs text-muted-foreground">Edit your weekly consultation availability. Changes affect future bookings only.</p>
              </div>
            </div>

            {slotMsg && (
              <div className={`p-3 text-sm rounded-lg ${slotMsg.type === 'success' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-destructive/10 text-destructive'}`}>
                {slotMsg.text}
              </div>
            )}

            <div className="space-y-3">
              {editSlots.map((slot, idx) => (
                <div key={idx} className="flex flex-wrap items-end gap-3 p-3 bg-card border border-border rounded-lg">
                  <div className="flex-1 min-w-[130px]">
                    <label className="block text-xs font-medium mb-1">Day</label>
                    <select className="w-full py-2 px-3 rounded-lg border border-border bg-background text-sm" value={slot.day_of_week} onChange={e => updateEditSlot(idx, 'day_of_week', Number(e.target.value))}>
                      {DAY_NAMES.map((d, i) => <option key={i} value={i}>{d}</option>)}
                    </select>
                  </div>
                  <div className="min-w-[100px]">
                    <label className="block text-xs font-medium mb-1">Start</label>
                    <input type="time" className="w-full py-2 px-3 rounded-lg border border-border bg-background text-sm" value={slot.start_time} onChange={e => updateEditSlot(idx, 'start_time', e.target.value)} />
                    <span className="text-[10px] text-muted-foreground mt-0.5 block">{formatTime12h(slot.start_time)}</span>
                  </div>
                  <div className="min-w-[100px]">
                    <label className="block text-xs font-medium mb-1">End</label>
                    <input type="time" className="w-full py-2 px-3 rounded-lg border border-border bg-background text-sm" value={slot.end_time} onChange={e => updateEditSlot(idx, 'end_time', e.target.value)} />
                    <span className="text-[10px] text-muted-foreground mt-0.5 block">{formatTime12h(slot.end_time)}</span>
                  </div>
                  <div className="min-w-[80px]">
                    <label className="block text-xs font-medium mb-1">Max Patients</label>
                    <input type="number" min={1} max={100} className="w-full py-2 px-3 rounded-lg border border-border bg-background text-sm" value={slot.max_patients} onChange={e => updateEditSlot(idx, 'max_patients', Number(e.target.value))} />
                  </div>
                  {editSlots.length > 1 && (
                    <button type="button" onClick={() => removeEditSlot(idx)} className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button type="button" onClick={addEditSlot} className="w-full py-2 border border-dashed border-border hover:border-primary text-muted-foreground hover:text-primary rounded-lg flex items-center justify-center gap-2 text-sm transition-all">
              <Plus className="w-4 h-4" /> Add Another Slot
            </button>

            <button onClick={handleSaveSchedule} disabled={savingSlots || editSlots.length === 0}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50">
              {savingSlots ? 'Saving...' : <><Save className="w-4 h-4" /> Save Schedule</>}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
