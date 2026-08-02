import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../../integrations/supabase/client';
import { useAuth } from '../../context/AuthContext';
import { generateQRDataUrl } from '../../utils/qrGenerator';
import { generateTicketPdf } from '../../utils/ticketPdf';
import type { Appointment, Doctor, DoctorTimeSlot } from '../../lib/types/doctor';
import {
  ArrowLeft, Clock, Download, Loader2
} from 'lucide-react';

const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  pending: { label: 'Pending Doctor Approval', color: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-500/10' },
  approved: { label: 'Approved — Ready to Visit', color: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-500/10' },
  rejected: { label: 'Rejected by Doctor', color: 'text-rose-600 dark:text-rose-400', bgColor: 'bg-rose-500/10' },
  cancelled: { label: 'Cancelled', color: 'text-muted-foreground', bgColor: 'bg-muted' },
  scanned: { label: 'Visited — Ticket Scanned', color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-500/10' },
  completed: { label: 'Completed', color: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-500/10' },
};

const TicketStatus: React.FC = () => {
  const { ticketId } = useParams<{ ticketId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [slot, setSlot] = useState<DoctorTimeSlot | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchTicket = async () => {
      if (!ticketId || !user) return;
      setLoading(true);
      try {
        const { data: apt, error } = await supabase
          .from('appointments')
          .select('*')
          .eq('id', ticketId)
          .eq('patient_id', user.id)
          .single();

        if (error) throw error;
        setAppointment(apt as Appointment);

        // Fetch doctor & slot
        const [docRes, slotRes] = await Promise.all([
          supabase.from('doctors').select('*').eq('id', apt.doctor_id).single(),
          supabase.from('doctor_time_slots').select('*').eq('id', apt.slot_id).single(),
        ]);

        if (docRes.data) setDoctor(docRes.data as Doctor);
        if (slotRes.data) setSlot(slotRes.data as DoctorTimeSlot);

        // Generate QR if approved
        if (apt.status === 'approved' || apt.status === 'scanned' || apt.status === 'completed') {
          const qr = await generateQRDataUrl({
            ticketId: apt.id,
            tokenNumber: apt.token_number,
            doctorId: apt.doctor_id,
            patientId: apt.patient_id,
            appointmentDate: apt.appointment_date,
            timestamp: new Date().toISOString(),
          });
          setQrDataUrl(qr);
        }
      } catch {
        setAppointment(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [ticketId, user]);

  const handleDownloadPdf = async () => {
    if (!appointment || !doctor || !qrDataUrl) return;
    setDownloading(true);
    try {
      await generateTicketPdf({
        ticketId: appointment.id,
        tokenNumber: appointment.token_number,
        patientName: appointment.patient_name,
        patientMobile: appointment.patient_mobile,
        doctorName: doctor.full_name,
        doctorSpecialty: doctor.specialty_id.replace(/_/g, ' '),
        hospitalName: doctor.hospital_name,
        appointmentDate: appointment.appointment_date,
        timeSlot: slot ? `${slot.start_time.slice(0, 5)} - ${slot.end_time.slice(0, 5)}` : 'N/A',
        qrDataUrl,
      });
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return <div className="space-y-4 animate-pulse"><div className="h-8 bg-muted rounded-lg w-48" /><div className="h-64 bg-muted rounded-xl" /></div>;
  }

  if (!appointment) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <p>Ticket not found</p>
        <button onClick={() => navigate('/booking-history')} className="text-primary hover:underline text-sm mt-2">Back to bookings</button>
      </div>
    );
  }

  const config = statusConfig[appointment.status] || statusConfig.pending;

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden">

        {/* Status Banner */}
        <div className={`${config.bgColor} px-6 py-4 text-center`}>
          <p className={`text-sm font-bold ${config.color}`}>{config.label}</p>
        </div>

        {/* Token Number */}
        <div className="text-center py-8">
          <p className="text-6xl font-mono font-extrabold text-primary">#{appointment.token_number}</p>
          <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider font-semibold">Token Number</p>
        </div>

        {/* Details */}
        <div className="px-6 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">Patient</p>
              <p className="font-medium">{appointment.patient_name}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">Mobile</p>
              <p className="font-medium">{appointment.patient_mobile}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">Doctor</p>
              <p className="font-medium">{doctor?.full_name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">Specialty</p>
              <p className="font-medium capitalize">{doctor?.specialty_id?.replace(/_/g, ' ') || 'N/A'}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">Date</p>
              <p className="font-medium">{new Date(appointment.appointment_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">Time Slot</p>
              <p className="font-medium">{slot ? `${slot.start_time.slice(0, 5)} - ${slot.end_time.slice(0, 5)}` : 'N/A'}</p>
            </div>
          </div>

          {/* QR Code */}
          {qrDataUrl && (
            <div className="flex flex-col items-center pt-4 border-t border-dashed border-border">
              <img src={qrDataUrl} alt="Ticket QR Code" className="w-48 h-48 rounded-lg" />
              <p className="text-[10px] text-muted-foreground mt-2">Show this QR at doctor's reception</p>
            </div>
          )}

          {/* Ticket ID */}
          <div className="text-center pt-2">
            <p className="text-[10px] text-muted-foreground">Ticket ID: {appointment.id.slice(0, 8).toUpperCase()}</p>
          </div>
        </div>

        {/* Actions */}
        {(appointment.status === 'approved' || appointment.status === 'scanned') && qrDataUrl && (
          <div className="px-6 pb-6">
            <button onClick={handleDownloadPdf} disabled={downloading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/15 transition-all disabled:opacity-50">
              {downloading ? (<><Loader2 className="w-4 h-4 animate-spin" /> Generating PDF...</>) : (<><Download className="w-5 h-5" /> Download PDF Ticket</>)}
            </button>
          </div>
        )}

        {appointment.status === 'pending' && (
          <div className="px-6 pb-6">
            <div className="bg-amber-500/10 text-amber-600 dark:text-amber-400 p-4 rounded-xl text-center text-sm">
              <Clock className="w-5 h-5 mx-auto mb-1" />
              <p className="font-semibold">Waiting for doctor approval</p>
              <p className="text-xs mt-1 text-muted-foreground">You'll be able to download the QR ticket once approved</p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default TicketStatus;
