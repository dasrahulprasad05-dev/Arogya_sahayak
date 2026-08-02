import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../integrations/supabase/client';
import { useAuth } from '../../context/AuthContext';
import type { Appointment } from '../../lib/types/doctor';
import {
  Ticket, Clock, CheckCircle, XCircle, ScanLine,
  Calendar, Download, Star, RotateCcw
} from 'lucide-react';

const statusConfig: Record<string, { label: string; color: string; icon: React.ComponentType<any> }> = {
  pending: { label: 'Pending Approval', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20', icon: Clock },
  approved: { label: 'Approved', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20', icon: XCircle },
  cancelled: { label: 'Cancelled', color: 'bg-muted text-muted-foreground border-border', icon: XCircle },
  scanned: { label: 'Visited', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20', icon: ScanLine },
  completed: { label: 'Completed', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20', icon: CheckCircle },
};

const BookingHistory: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<(Appointment & { doctor_name?: string; doctor_specialty?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('appointments')
          .select(`
            *,
            doctors!inner(full_name, specialty_id)
          `)
          .eq('patient_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const mapped = (data || []).map((a: any) => ({
          ...a,
          doctor_name: a.doctors?.full_name,
          doctor_specialty: a.doctors?.specialty_id,
        }));
        setAppointments(mapped);
      } catch {
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  const handleCancel = async (appointmentId: string) => {
    try {
      await supabase
        .from('appointments')
        .update({ status: 'cancelled', updated_at: new Date().toISOString() })
        .eq('id', appointmentId)
        .eq('patient_id', user?.id);

      setAppointments(prev => prev.map(a => a.id === appointmentId ? { ...a, status: 'cancelled' as const } : a));
    } catch {}
  };

  const filtered = filter === 'all' ? appointments : appointments.filter(a => a.status === filter);

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'approved', label: 'Approved' },
    { id: 'scanned', label: 'Visited' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-xl font-heading font-bold flex items-center gap-2">
          <Ticket className="w-5 h-5 text-primary" /> Booking History
        </h1>
        <p className="text-sm text-muted-foreground">Your doctor appointment bookings</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {filters.map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              filter === f.id ? 'bg-primary text-white' : 'bg-muted hover:bg-muted/80'
            }`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-4">{[1, 2, 3].map(i => <div key={i} className="h-28 bg-muted rounded-xl animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Ticket className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="font-medium">No bookings found</p>
          <button onClick={() => navigate('/doctors')} className="text-primary hover:underline text-sm mt-2">Browse Doctors</button>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((apt) => {
              const config = statusConfig[apt.status] || statusConfig.pending;
              const StatusIcon = config.icon;
              return (
                <motion.div key={apt.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-card border border-border rounded-xl p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-mono font-bold text-primary">#{apt.token_number}</span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${config.color}`}>
                          <StatusIcon className="w-3 h-3" />{config.label}
                        </span>
                      </div>
                      <p className="text-sm font-semibold">{apt.doctor_name || 'Doctor'}</p>
                      <p className="text-xs text-muted-foreground capitalize">{apt.doctor_specialty?.replace(/_/g, ' ')}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(apt.appointment_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 shrink-0">
                      {apt.status === 'approved' && (
                        <button onClick={() => navigate(`/ticket/${apt.id}`)}
                          className="px-3 py-1.5 bg-primary hover:bg-primary/90 text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition-all">
                          <Download className="w-3 h-3" /> Ticket
                        </button>
                      )}
                      {apt.status === 'pending' && (
                        <button onClick={() => handleCancel(apt.id)}
                          className="px-3 py-1.5 bg-muted hover:bg-destructive/10 text-muted-foreground hover:text-destructive text-xs font-semibold rounded-lg transition-all">
                          Cancel
                        </button>
                      )}
                      {(apt.status === 'scanned' || apt.status === 'completed') && (
                        <button onClick={() => navigate(`/doctors/${apt.doctor_id}/review/${apt.id}`)}
                          className="px-3 py-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold rounded-lg flex items-center gap-1 hover:bg-amber-500/20 transition-all">
                          <Star className="w-3 h-3" /> Review
                        </button>
                      )}
                      {(apt.status === 'completed' || apt.status === 'scanned') && (
                        <button onClick={() => navigate(`/doctors/${apt.doctor_id}/book`)}
                          className="px-3 py-1.5 bg-muted hover:bg-muted/80 text-xs font-semibold rounded-lg flex items-center gap-1 transition-all">
                          <RotateCcw className="w-3 h-3" /> Re-book
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default BookingHistory;
