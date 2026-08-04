import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../integrations/supabase/client';
import { useAuth } from '../../context/AuthContext';
import type { Doctor } from '../../lib/types/doctor';
import { DAY_NAMES_SHORT } from '../../lib/types/doctor';
import { formatTime12h } from '../../utils/formatTime';
import {
  Shield, CheckCircle, XCircle, Clock, Users, Stethoscope, MapPin,
  GraduationCap, Building2, LogOut, Search, RefreshCw, Calendar
} from 'lucide-react';

type Tab = 'pending' | 'approved' | 'rejected';

const AdminDashboard: React.FC = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('pending');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 });

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch all doctors (admin can see all via RLS bypass or direct policy)
      const { data, error } = await supabase
        .from('doctors')
        .select('*, doctor_time_slots(*)')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const allDocs = (data || []) as Doctor[];
      setDoctors(allDocs);
      setStats({
        pending: allDocs.filter(d => d.status === 'pending').length,
        approved: allDocs.filter(d => d.status === 'approved').length,
        rejected: allDocs.filter(d => d.status === 'rejected').length,
      });
    } catch {
      // If RLS prevents reading all, show empty
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDoctors(); }, [fetchDoctors]);

  const handleAction = async (doctorId: string, action: 'approved' | 'rejected') => {
    setActionLoading(doctorId);
    try {
      const { error } = await supabase
        .from('doctors')
        .update({ status: action, updated_at: new Date().toISOString() })
        .eq('id', doctorId);

      if (error) throw error;
      await fetchDoctors();
    } catch (err: any) {
      console.error('Action failed:', err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/admin-login');
  };

  const filteredDoctors = doctors
    .filter(d => d.status === activeTab)
    .filter(d => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return d.full_name.toLowerCase().includes(q) ||
             d.email.toLowerCase().includes(q) ||
             d.specialty_id.toLowerCase().includes(q) ||
             d.city.toLowerCase().includes(q);
    });

  const tabs: { id: Tab; label: string; icon: React.ComponentType<any>; color: string }[] = [
    { id: 'pending', label: 'Pending', icon: Clock, color: 'text-amber-500' },
    { id: 'approved', label: 'Approved', icon: CheckCircle, color: 'text-emerald-500' },
    { id: 'rejected', label: 'Rejected', icon: XCircle, color: 'text-rose-500' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-lg">Admin Dashboard</h1>
              <p className="text-xs text-muted-foreground">Manage doctor registrations</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchDoctors} className="p-2 hover:bg-muted rounded-lg transition-colors" title="Refresh">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={handleLogout} className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-destructive" title="Logout">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`p-4 rounded-xl border transition-all text-left ${
                activeTab === tab.id ? 'bg-card border-primary shadow-lg shadow-primary/5' : 'bg-card/50 border-border hover:bg-card'
              }`}>
              <tab.icon className={`w-5 h-5 ${tab.color} mb-2`} />
              <p className="text-2xl font-bold">{stats[tab.id]}</p>
              <p className="text-xs text-muted-foreground font-medium">{tab.label}</p>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Search by name, email, specialty, city..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>

        {/* Doctors List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No {activeTab} doctors found</p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredDoctors.map(doctor => (
                <motion.div key={doctor.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                          {doctor.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">{doctor.full_name}</h3>
                          <p className="text-xs text-muted-foreground">{doctor.email}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md">
                          <Stethoscope className="w-3 h-3" />{doctor.specialty_id.replace('_', ' ')}
                        </span>
                        <span className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md">
                          <GraduationCap className="w-3 h-3" />{doctor.qualification}
                        </span>
                        <span className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md">
                          <Building2 className="w-3 h-3" />{doctor.hospital_name}
                        </span>
                        <span className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md">
                          <MapPin className="w-3 h-3" />{doctor.city}, {doctor.district}, {doctor.state}
                        </span>
                        <span className="bg-muted px-2 py-1 rounded-md">{doctor.experience_years} yrs exp</span>
                        <span className="bg-muted px-2 py-1 rounded-md">₹{doctor.consultation_fee}</span>
                        {doctor.registration_number && (
                          <span className="bg-muted px-2 py-1 rounded-md">Reg: {doctor.registration_number}</span>
                        )}
                      </div>

                      {doctor.bio && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{doctor.bio}</p>
                      )}

                      <p className="text-[10px] text-muted-foreground">
                        Registered: {new Date(doctor.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>

                      {/* Time slots / schedule info */}
                      {(doctor as any).doctor_time_slots && (doctor as any).doctor_time_slots.length > 0 && (
                        <div className="mt-2 p-2.5 bg-primary/5 border border-primary/10 rounded-lg space-y-1">
                          <p className="text-[10px] font-semibold text-primary flex items-center gap-1"><Calendar className="w-3 h-3" /> Availability</p>
                          <div className="flex flex-wrap gap-1.5">
                            {(doctor as any).doctor_time_slots.map((slot: any, si: number) => (
                              <span key={si} className="text-[10px] bg-muted px-2 py-0.5 rounded-md">
                                {DAY_NAMES_SHORT[slot.day_of_week]} {formatTime12h(slot.start_time?.slice(0, 5))} – {formatTime12h(slot.end_time?.slice(0, 5))}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    {activeTab === 'pending' && (
                      <div className="flex sm:flex-col gap-2 shrink-0">
                        <button
                          onClick={() => handleAction(doctor.id, 'approved')}
                          disabled={actionLoading === doctor.id}
                          className="flex-1 sm:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button
                          onClick={() => handleAction(doctor.id, 'rejected')}
                          disabled={actionLoading === doctor.id}
                          className="flex-1 sm:flex-none px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    )}

                    {activeTab === 'rejected' && (
                      <button
                        onClick={() => handleAction(doctor.id, 'approved')}
                        disabled={actionLoading === doctor.id}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all disabled:opacity-50"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Approve
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
