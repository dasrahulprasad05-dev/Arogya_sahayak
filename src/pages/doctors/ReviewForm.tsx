import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../../integrations/supabase/client';
import { useAuth } from '../../context/AuthContext';
import StarRating from '../../components/doctors/StarRating';
import {
  ArrowLeft, Star, Send, CheckCircle, ShieldAlert, Clock, Heart, Users
} from 'lucide-react';

const ReviewForm: React.FC = () => {
  const { doctorId, appointmentId } = useParams<{ doctorId: string; appointmentId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [rating, setRating] = useState(0);
  const [punctuality, setPunctuality] = useState(0);
  const [consultation, setConsultation] = useState(0);
  const [staff, setStaff] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [existingReview, setExistingReview] = useState(false);

  useEffect(() => {
    // Check if user already reviewed this appointment
    const check = async () => {
      if (!user || !appointmentId) return;
      const { data } = await supabase
        .from('doctor_reviews')
        .select('id')
        .eq('patient_id', user.id)
        .eq('appointment_id', appointmentId)
        .maybeSingle();
      if (data) setExistingReview(true);
    };
    check();
  }, [user, appointmentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !doctorId || !appointmentId || rating === 0) return;

    setLoading(true);
    setError(null);

    try {
      const { error: insertErr } = await supabase.from('doctor_reviews').insert({
        doctor_id: doctorId,
        patient_id: user.id,
        appointment_id: appointmentId,
        rating,
        punctuality_rating: punctuality || null,
        consultation_rating: consultation || null,
        staff_rating: staff || null,
        review_text: reviewText || null,
      });

      if (insertErr) throw insertErr;
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  if (existingReview) {
    return (
      <div className="max-w-lg mx-auto text-center py-20 space-y-4">
        <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto" />
        <h2 className="text-xl font-heading font-bold">Already Reviewed</h2>
        <p className="text-sm text-muted-foreground">You've already submitted a review for this appointment.</p>
        <button onClick={() => navigate('/booking-history')} className="text-primary hover:underline text-sm">Back to bookings</button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto text-center py-20 space-y-4">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
          <CheckCircle className="w-20 h-20 text-emerald-500 mx-auto" />
        </motion.div>
        <h2 className="text-xl font-heading font-bold">Thank You!</h2>
        <p className="text-sm text-muted-foreground">Your review helps other patients make informed decisions.</p>
        <button onClick={() => navigate('/booking-history')} className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg text-sm">
          Back to Bookings
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div>
        <h1 className="text-xl font-heading font-bold flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-500" /> Rate Your Experience
        </h1>
        <p className="text-sm text-muted-foreground">Help other patients by sharing your experience</p>
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" /><span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Overall Rating */}
        <div className="bg-card border border-border rounded-xl p-6 text-center">
          <h3 className="text-sm font-semibold mb-3">Overall Rating *</h3>
          <StarRating rating={rating} size="lg" interactive onChange={setRating} />
          <p className="text-xs text-muted-foreground mt-2">
            {rating === 0 ? 'Tap to rate' : rating <= 2 ? 'Poor' : rating === 3 ? 'Average' : rating === 4 ? 'Good' : 'Excellent!'}
          </p>
        </div>

        {/* Sub-ratings */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-5">
          <h3 className="text-sm font-semibold">Detailed Ratings (optional)</h3>

          <div className="flex items-center justify-between">
            <span className="text-sm flex items-center gap-2"><Clock className="w-4 h-4 text-muted-foreground" /> Punctuality</span>
            <StarRating rating={punctuality} size="sm" interactive onChange={setPunctuality} />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm flex items-center gap-2"><Heart className="w-4 h-4 text-muted-foreground" /> Consultation Quality</span>
            <StarRating rating={consultation} size="sm" interactive onChange={setConsultation} />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm flex items-center gap-2"><Users className="w-4 h-4 text-muted-foreground" /> Staff Behavior</span>
            <StarRating rating={staff} size="sm" interactive onChange={setStaff} />
          </div>
        </div>

        {/* Written Review */}
        <div>
          <label className="block text-sm font-semibold mb-2">Written Review (optional)</label>
          <textarea
            className="w-full p-3 rounded-xl border border-border bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm min-h-[100px] resize-y"
            placeholder="Share your experience with the doctor, hospital staff, treatment..."
            value={reviewText} onChange={e => setReviewText(e.target.value)} maxLength={1000}
          />
          <span className="text-[10px] text-muted-foreground">{reviewText.length}/1000</span>
        </div>

        <button type="submit" disabled={rating === 0 || loading}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/15 transition-all disabled:opacity-50 disabled:pointer-events-none">
          {loading ? 'Submitting...' : (<><Send className="w-4 h-4" /> Submit Review</>)}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
