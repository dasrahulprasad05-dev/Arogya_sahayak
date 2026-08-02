import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../../integrations/supabase/client';
import type { Doctor, DoctorTimeSlot, DoctorReview } from '../../lib/types/doctor';
import { DAY_NAMES } from '../../lib/types/doctor';
import StarRating from '../../components/doctors/StarRating';
import {
  ArrowLeft, GraduationCap, Building2, MapPin, Clock,
  IndianRupee, Calendar, MessageSquare, ChevronRight, ShieldCheck
} from 'lucide-react';

const DoctorProfile: React.FC = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [timeSlots, setTimeSlots] = useState<DoctorTimeSlot[]>([]);
  const [reviews, setReviews] = useState<DoctorReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctor = async () => {
      if (!doctorId) return;
      setLoading(true);
      try {
        const [docRes, slotsRes, reviewsRes] = await Promise.all([
          supabase.from('doctors').select('*').eq('id', doctorId).single(),
          supabase.from('doctor_time_slots').select('*').eq('doctor_id', doctorId).eq('is_active', true).order('day_of_week'),
          supabase.from('doctor_reviews').select('*').eq('doctor_id', doctorId).order('created_at', { ascending: false }).limit(10),
        ]);

        if (docRes.error) throw docRes.error;
        setDoctor(docRes.data as Doctor);
        setTimeSlots((slotsRes.data || []) as DoctorTimeSlot[]);
        setReviews((reviewsRes.data || []) as DoctorReview[]);
      } catch {
        setDoctor(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [doctorId]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-muted rounded-lg w-48" />
        <div className="h-48 bg-muted rounded-xl" />
        <div className="h-32 bg-muted rounded-xl" />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Doctor not found</p>
        <button onClick={() => navigate('/doctors')} className="text-primary hover:underline text-sm mt-2">Back to directory</button>
      </div>
    );
  }

  const initials = doctor.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  // Group time slots by day
  const slotsByDay = timeSlots.reduce((acc, slot) => {
    if (!acc[slot.day_of_week]) acc[slot.day_of_week] = [];
    acc[slot.day_of_week].push(slot);
    return acc;
  }, {} as Record<number, DoctorTimeSlot[]>);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Back button */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Doctor Header Card */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-2xl p-6 shadow-md">
        <div className="flex items-start gap-5">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-2xl shrink-0">
            {initials}
          </div>
          <div className="flex-1 space-y-2">
            <h1 className="text-xl font-heading font-bold">{doctor.full_name}</h1>
            <p className="text-sm text-muted-foreground capitalize">{doctor.specialty_id.replace(/_/g, ' ')}</p>

            <div className="flex flex-wrap gap-2 text-xs">
              <span className="inline-flex items-center gap-1 bg-muted px-2.5 py-1 rounded-lg font-medium">
                <GraduationCap className="w-3.5 h-3.5" />{doctor.qualification}
              </span>
              <span className="inline-flex items-center gap-1 bg-muted px-2.5 py-1 rounded-lg font-medium">
                <Clock className="w-3.5 h-3.5" />{doctor.experience_years} years experience
              </span>
              <span className="inline-flex items-center gap-1 bg-muted px-2.5 py-1 rounded-lg font-medium">
                <Building2 className="w-3.5 h-3.5" />{doctor.hospital_name}
              </span>
              <span className="inline-flex items-center gap-1 bg-muted px-2.5 py-1 rounded-lg font-medium">
                <MapPin className="w-3.5 h-3.5" />{doctor.city}, {doctor.district}, {doctor.state}
              </span>
              {doctor.registration_number && (
                <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-lg font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />Verified: {doctor.registration_number}
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 pt-1">
              <div className="flex items-center gap-1.5">
                <StarRating rating={doctor.average_rating} size="md" />
                <span className="text-sm font-bold">{doctor.average_rating > 0 ? doctor.average_rating.toFixed(1) : 'New'}</span>
                <span className="text-xs text-muted-foreground">({doctor.total_reviews} reviews)</span>
              </div>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <IndianRupee className="w-4 h-4" />
                {doctor.consultation_fee === 0 ? 'Free Consultation' : `₹${doctor.consultation_fee}`}
              </span>
            </div>
          </div>
        </div>

        {doctor.bio && (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground leading-relaxed">{doctor.bio}</p>
          </div>
        )}
      </motion.div>

      {/* Availability Schedule */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <h2 className="font-heading font-bold flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-primary" /> Weekly Schedule
        </h2>

        {timeSlots.length === 0 ? (
          <p className="text-sm text-muted-foreground">No schedule available</p>
        ) : (
          <div className="space-y-2">
            {Object.entries(slotsByDay).map(([day, slots]) => (
              <div key={day} className="flex items-center gap-4 py-2 border-b border-border last:border-0">
                <span className="text-sm font-semibold w-24">{DAY_NAMES[Number(day)]}</span>
                <div className="flex flex-wrap gap-2">
                  {slots.map(slot => (
                    <span key={slot.id} className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-xs font-medium">
                      {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                      <span className="text-muted-foreground ml-1">(max {slot.max_patients})</span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Book Appointment CTA */}
      <motion.button
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        onClick={() => navigate(`/doctors/${doctor.id}/book`)}
        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-primary/15 transition-all text-base"
      >
        <Calendar className="w-5 h-5" />
        Book Appointment
        <ChevronRight className="w-5 h-5" />
      </motion.button>

      {/* Reviews Section */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <h2 className="font-heading font-bold flex items-center gap-2 mb-4">
          <MessageSquare className="w-5 h-5 text-primary" /> Patient Reviews
          <span className="text-xs text-muted-foreground font-normal">({reviews.length})</span>
        </h2>

        {reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No reviews yet. Be the first to review!</p>
        ) : (
          <div className="space-y-4">
            {reviews.map(review => (
              <div key={review.id} className="border-b border-border last:border-0 pb-4 last:pb-0">
                <div className="flex items-center gap-2 mb-1">
                  <StarRating rating={review.rating} size="sm" />
                  <span className="text-xs text-muted-foreground">
                    {new Date(review.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                {review.review_text && (
                  <p className="text-sm text-muted-foreground mt-1">{review.review_text}</p>
                )}
                {(review.punctuality_rating || review.consultation_rating || review.staff_rating) && (
                  <div className="flex gap-4 mt-2 text-[10px] text-muted-foreground">
                    {review.punctuality_rating && <span>Punctuality: {review.punctuality_rating}/5</span>}
                    {review.consultation_rating && <span>Consultation: {review.consultation_rating}/5</span>}
                    {review.staff_rating && <span>Staff: {review.staff_rating}/5</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default DoctorProfile;
