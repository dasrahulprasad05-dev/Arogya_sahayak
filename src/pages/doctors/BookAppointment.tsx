import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../../integrations/supabase/client';
import { useAuth } from '../../context/AuthContext';
import { INDIAN_STATES, getDistrictsForState } from '../../data/indianLocations';
import type { Doctor, DoctorTimeSlot } from '../../lib/types/doctor';
import { DAY_NAMES } from '../../lib/types/doctor';
import {
  ArrowLeft, Calendar, Clock, User, Phone, MapPin, CreditCard,
  Ticket, ChevronDown, ShieldAlert, CheckCircle, Fingerprint
} from 'lucide-react';

const BookAppointment: React.FC = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [timeSlots, setTimeSlots] = useState<DoctorTimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ ticketId: string; tokenNumber: number } | null>(null);

  // Form fields
  const [patientName, setPatientName] = useState(user?.user_metadata?.full_name || '');
  const [aadhaar, setAadhaar] = useState('');
  const [mobile, setMobile] = useState('');
  const [patientState, setPatientState] = useState('');
  const [patientDistrict, setPatientDistrict] = useState('');
  const [address, setAddress] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [selectedSlotId, setSelectedSlotId] = useState('');

  const districts = patientState ? getDistrictsForState(patientState) : [];

  useEffect(() => {
    const fetch = async () => {
      if (!doctorId) return;
      setLoading(true);
      try {
        const [docRes, slotsRes] = await Promise.all([
          supabase.from('doctors').select('*').eq('id', doctorId).single(),
          supabase.from('doctor_time_slots').select('*').eq('doctor_id', doctorId).eq('is_active', true).order('day_of_week'),
        ]);
        if (docRes.error) throw docRes.error;
        setDoctor(docRes.data as Doctor);
        setTimeSlots((slotsRes.data || []) as DoctorTimeSlot[]);
      } catch {
        setDoctor(null);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [doctorId]);

  // Get available slots for selected date
  const availableSlots = useMemo(() => {
    if (!appointmentDate) return [];
    const date = new Date(appointmentDate);
    const dayOfWeek = date.getDay();
    return timeSlots.filter(s => s.day_of_week === dayOfWeek);
  }, [appointmentDate, timeSlots]);

  // Mask aadhaar as user types: 1234 5678 9012
  const handleAadhaarChange = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 12);
    const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    setAadhaar(formatted);
  };

  // Minimum date = tomorrow
  const minDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }, []);

  // Max date = 30 days from now
  const maxDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !doctor || !selectedSlotId) return;

    setSubmitting(true);
    setErrorMsg(null);

    try {
      // 1. Check for existing booking
      const { data: existing } = await supabase
        .from('appointments')
        .select('id, status')
        .eq('patient_id', user.id)
        .eq('doctor_id', doctor.id)
        .eq('appointment_date', appointmentDate)
        .eq('slot_id', selectedSlotId)
        .not('status', 'in', '("cancelled","rejected")')
        .maybeSingle();

      if (existing) {
        setErrorMsg('You already have a booking with this doctor on this date and time slot. Check your booking history.');
        setSubmitting(false);
        return;
      }

      // 2. Check slot capacity
      const { data: countData } = await supabase.rpc('get_slot_booking_count', {
        p_doctor_id: doctor.id,
        p_date: appointmentDate,
        p_slot_id: selectedSlotId
      });

      const slot = timeSlots.find(s => s.id === selectedSlotId);
      if (slot && countData !== null && countData >= slot.max_patients) {
        setErrorMsg('This time slot is fully booked. Please select another slot or date.');
        setSubmitting(false);
        return;
      }

      // 3. Get token number atomically
      const { data: tokenNumber, error: tokenError } = await supabase.rpc('assign_token', {
        p_doctor_id: doctor.id,
        p_appointment_date: appointmentDate
      });

      if (tokenError) throw tokenError;

      // 4. Mask aadhaar for storage
      const cleanAadhaar = aadhaar.replace(/\s/g, '');
      const maskedAadhaar = `XXXX-XXXX-${cleanAadhaar.slice(-4)}`;

      // 5. Create appointment
      const { data: appointment, error: insertError } = await supabase
        .from('appointments')
        .insert({
          patient_id: user.id,
          doctor_id: doctor.id,
          slot_id: selectedSlotId,
          appointment_date: appointmentDate,
          token_number: tokenNumber,
          patient_name: patientName,
          patient_aadhaar: maskedAadhaar,
          patient_mobile: mobile,
          patient_state: patientState,
          patient_district: patientDistrict,
          patient_address: address || null,
          status: 'pending',
          payment_status: 'free',
          payment_amount: 0,
        })
        .select('id, token_number')
        .single();

      if (insertError) throw insertError;

      setSuccess({ ticketId: appointment.id, tokenNumber: appointment.token_number });
    } catch (err: any) {
      setErrorMsg(err.message || 'Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="space-y-4 animate-pulse"><div className="h-8 bg-muted rounded-lg w-48" /><div className="h-96 bg-muted rounded-xl" /></div>;
  }

  if (!doctor) {
    return <div className="text-center py-20 text-muted-foreground">Doctor not found</div>;
  }

  // Success screen
  if (success) {
    return (
      <div className="max-w-lg mx-auto text-center space-y-6 py-12">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
          <CheckCircle className="w-20 h-20 text-emerald-500 mx-auto" />
        </motion.div>
        <h2 className="text-2xl font-heading font-bold">Booking Submitted!</h2>
        <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
          <div className="text-5xl font-mono font-bold text-primary">#{success.tokenNumber}</div>
          <p className="text-sm text-muted-foreground">Token Number</p>
          <p className="text-xs text-muted-foreground">Your appointment is <span className="text-amber-500 font-semibold">pending approval</span> from the doctor. You will be able to download your QR ticket once approved.</p>
        </div>
        <div className="flex gap-3 justify-center">
          <button onClick={() => navigate('/booking-history')} className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-all text-sm">
            View Booking History
          </button>
          <button onClick={() => navigate('/doctors')} className="px-6 py-2.5 bg-muted hover:bg-muted/80 font-medium rounded-lg transition-all text-sm">
            Back to Doctors
          </button>
        </div>
      </div>
    );
  }

  const inputClass = "w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm";
  const selectClass = "w-full pl-10 pr-8 py-2.5 rounded-lg border border-border bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm appearance-none";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div>
        <h1 className="text-xl font-heading font-bold flex items-center gap-2">
          <Ticket className="w-5 h-5 text-primary" /> Book Appointment
        </h1>
        <p className="text-sm text-muted-foreground">with Dr. {doctor.full_name} — {doctor.specialty_id.replace(/_/g, ' ')}</p>
      </div>

      {errorMsg && (
        <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" /><span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Patient Details */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold flex items-center gap-2"><User className="w-4 h-4 text-primary" /> Patient Details</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground"><User className="w-4 h-4" /></span>
                <input type="text" required className={inputClass} value={patientName} onChange={e => setPatientName(e.target.value)} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Aadhaar Number</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground"><Fingerprint className="w-4 h-4" /></span>
                <input type="text" required className={inputClass} placeholder="1234 5678 9012" value={aadhaar} onChange={e => handleAadhaarChange(e.target.value)}
                  pattern="\d{4}\s\d{4}\s\d{4}" title="12-digit Aadhaar number" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Mobile Number</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground"><Phone className="w-4 h-4" /></span>
                <input type="tel" required className={inputClass} placeholder="+91 9876543210" value={mobile}
                  onChange={e => setMobile(e.target.value.replace(/[^\d+]/g, '').slice(0, 13))} pattern="[\+]?[0-9]{10,13}" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">State</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground"><MapPin className="w-4 h-4" /></span>
                <select required className={selectClass} value={patientState} onChange={e => { setPatientState(e.target.value); setPatientDistrict(''); }}>
                  <option value="">Select</option>
                  {INDIAN_STATES.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">District</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground"><MapPin className="w-4 h-4" /></span>
                <select required className={selectClass} value={patientDistrict} onChange={e => setPatientDistrict(e.target.value)} disabled={!patientState}>
                  <option value="">Select</option>
                  {districts.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Address (optional)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground"><MapPin className="w-4 h-4" /></span>
                <input type="text" className={inputClass} placeholder="Village/Street, Pin code" value={address} onChange={e => setAddress(e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        {/* Date & Slot Selection */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /> Select Date & Time Slot</h3>

          <div>
            <label className="block text-xs font-medium mb-1">Appointment Date</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground"><Calendar className="w-4 h-4" /></span>
              <input type="date" required className={inputClass} min={minDate} max={maxDate}
                value={appointmentDate} onChange={e => { setAppointmentDate(e.target.value); setSelectedSlotId(''); }} />
            </div>
          </div>

          {appointmentDate && (
            <div>
              <label className="block text-xs font-medium mb-2">Available Time Slots for {DAY_NAMES[new Date(appointmentDate).getDay()]}</label>
              {availableSlots.length === 0 ? (
                <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">No slots available on this day. Please select another date.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {availableSlots.map(slot => (
                    <button key={slot.id} type="button" onClick={() => setSelectedSlotId(slot.id)}
                      className={`px-4 py-2.5 rounded-lg border text-sm font-medium transition-all flex items-center gap-2 ${
                        selectedSlotId === slot.id
                          ? 'bg-primary text-white border-primary shadow-md'
                          : 'bg-card border-border hover:border-primary/50'
                      }`}>
                      <Clock className="w-3.5 h-3.5" />
                      {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Payment (Placeholder) */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold flex items-center gap-2 mb-2"><CreditCard className="w-4 h-4 text-primary" /> Payment</h3>
          <div className="flex items-center gap-3 p-3 bg-emerald-500/10 rounded-lg">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
            <div>
              <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Free Consultation Ticket</p>
              <p className="text-[10px] text-muted-foreground">Payment integration coming soon. All tickets are free for now.</p>
            </div>
          </div>
        </div>

        <button type="submit" disabled={submitting || !selectedSlotId || !aadhaar || !mobile || !patientName}
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/15 transition-all disabled:opacity-50 disabled:pointer-events-none">
          {submitting ? 'Generating Ticket...' : (<><Ticket className="w-5 h-5" /> Generate Ticket</>)}
        </button>
      </form>
    </div>
  );
};

export default BookAppointment;
