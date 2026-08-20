import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Doctor } from '../../lib/types/doctor';
import StarRating from './StarRating';
import { MapPin, GraduationCap, Building2, Clock, IndianRupee, ChevronRight } from 'lucide-react';

interface DoctorCardProps {
  doctor: Doctor;
  index?: number;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, index = 0 }) => {
  const navigate = useNavigate();

  const initials = doctor.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  // Generate consistent color from specialty — each specialty has a unique color
  const colorMap: Record<string, string> = {
    cardiologist: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
    diabetologist: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
    nephrologist: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    hepatologist: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    hematologist: 'bg-pink-500/10 text-pink-600 dark:text-pink-400',
    endocrinologist: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
    oncologist: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    neurologist: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
    pulmonologist: 'bg-lime-500/10 text-lime-600 dark:text-lime-400',
    dermatologist: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    gynecologist: 'bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400',
    psychiatrist: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
    orthopedic: 'bg-stone-500/10 text-stone-600 dark:text-stone-400',
    general_physician: 'bg-teal-500/10 text-teal-600 dark:text-teal-400',
    pediatrician: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
    ophthalmologist: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
    dentist: 'bg-red-500/10 text-red-600 dark:text-red-400',
    ent: 'bg-slate-500/10 text-slate-600 dark:text-slate-400',
  };

  const avatarColor = colorMap[doctor.specialty_id] || 'bg-primary/10 text-primary';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onClick={() => navigate(`/doctors/${doctor.id}`)}
      className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer group"
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className={`w-14 h-14 rounded-xl ${avatarColor} flex items-center justify-center font-bold text-lg shrink-0`}>
          {initials}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-sm group-hover:text-primary transition-colors truncate">{doctor.full_name}</h3>
              <p className="text-xs text-muted-foreground capitalize">{doctor.specialty_id.replace(/_/g, ' ')}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
          </div>

          {/* Quick info chips */}
          <div className="flex flex-wrap gap-1.5">
            <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-muted px-2 py-0.5 rounded-md">
              <GraduationCap className="w-3 h-3" />{doctor.qualification}
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-muted px-2 py-0.5 rounded-md">
              <Clock className="w-3 h-3" />{doctor.experience_years} yrs
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-muted px-2 py-0.5 rounded-md">
              <Building2 className="w-3 h-3" />{doctor.hospital_name}
            </span>
          </div>

          {/* Rating & Location & Fee */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <div className="flex items-center gap-1">
              <StarRating rating={doctor.average_rating} size="sm" />
              <span className="text-xs font-medium">{doctor.average_rating > 0 ? doctor.average_rating.toFixed(1) : 'New'}</span>
              {doctor.total_reviews > 0 && (
                <span className="text-[10px] text-muted-foreground">({doctor.total_reviews})</span>
              )}
            </div>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3" />{doctor.city}, {doctor.state}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <IndianRupee className="w-3 h-3" />{doctor.consultation_fee === 0 ? 'Free' : `₹${doctor.consultation_fee}`}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DoctorCard;
