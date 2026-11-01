// ──────────────────────────────────────────
// Doctor & Appointment TypeScript Types
// ──────────────────────────────────────────

export type DoctorStatus = 'pending' | 'approved' | 'rejected';
export type AppointmentStatus = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'scanned' | 'completed';
export type PaymentStatus = 'free' | 'paid' | 'refunded';

export interface DoctorSpecialty {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface Doctor {
  id: string;
  full_name: string;
  email: string;
  specialty_id: string;
  qualification: string;
  experience_years: number;
  registration_number?: string;
  hospital_name: string;
  consultation_fee: number;
  bio?: string;
  state: string;
  district: string;
  city: string;
  status: DoctorStatus;
  average_rating: number;
  total_reviews: number;
  created_at: string;
  updated_at: string;
  // Joined data
  specialty?: DoctorSpecialty;
  time_slots?: DoctorTimeSlot[];
}

export interface DoctorTimeSlot {
  id: string;
  doctor_id: string;
  day_of_week: number; // 0=Sunday ... 6=Saturday
  start_time: string;  // HH:MM:SS
  end_time: string;    // HH:MM:SS
  max_patients: number;
  is_active: boolean;
}

export interface DoctorCalendarBlock {
  id: string;
  doctor_id: string;
  blocked_date: string;  // YYYY-MM-DD
  reason?: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  slot_id: string;
  appointment_date: string;  // YYYY-MM-DD
  token_number: number;
  patient_name: string;
  patient_aadhaar: string;
  patient_mobile: string;
  patient_state: string;
  patient_district: string;
  patient_address?: string;
  status: AppointmentStatus;
  payment_status: PaymentStatus;
  payment_amount: number;
  qr_data?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  doctor?: Doctor;
  slot?: DoctorTimeSlot;
}

export interface DoctorReview {
  id: string;
  doctor_id: string;
  patient_id: string;
  appointment_id: string;
  rating: number;
  punctuality_rating?: number;
  consultation_rating?: number;
  staff_rating?: number;
  review_text?: string;
  created_at: string;
  // Joined data for display
  patient_name?: string;
}

export interface BookingFormData {
  patient_name: string;
  patient_aadhaar: string;
  patient_mobile: string;
  patient_state: string;
  patient_district: string;
  patient_address: string;
  appointment_date: string;
  slot_id: string;
}

// Predictor ID → Doctor Specialty mapping
export const PREDICTOR_SPECIALTY_MAP: Record<string, string[]> = {
  'diabetes': ['diabetologist', 'endocrinologist'],
  'heart-attack': ['cardiologist'],
  'ecg': ['cardiologist'],
  'cancer': ['oncologist'],
  'kidney': ['nephrologist'],
  'liver': ['hepatologist'],
  'anemia': ['hematologist'],
  'thyroid': ['endocrinologist'],
  'hypertension': ['cardiologist'],
  'stroke': ['neurologist'],
  'tuberculosis': ['pulmonologist'],
  'dengue': ['general_physician'],
  'pcos': ['gynecologist'],
  'phq9': ['psychiatrist'],
  'gad7': ['psychiatrist'],
  'stopbang': ['pulmonologist'],
  'vitaminD': ['orthopedic', 'endocrinologist'],
  'osteoporosis': ['orthopedic'],
  // New 10 predictors
  'malaria': ['general_physician'],
  'chikungunya': ['general_physician'],
  'typhoid': ['general_physician'],
  'jaundice': ['hepatologist'],
  'asthma_copd': ['pulmonologist'],
  'pregnancy_risk': ['gynecologist'],
  'malnutrition': ['pediatrician'],
  'diabetic_retinopathy': ['ophthalmologist'],
  'dental_health': ['dentist'],
  'skin_fungal': ['dermatologist'],
};

// Day names for time slots
export const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const DAY_NAMES_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Helper to normalize any specialist string (from AI chat, triage, or clinical AI)
// to a valid doctor_specialties id
export const normalizeSpecialtyId = (input?: string | null): string => {
  if (!input || typeof input !== 'string') return '';
  const clean = input.toLowerCase().trim().replace(/[-_\s]+/g, ' ');

  // Exact ID match first
  const validIds = [
    'cardiologist', 'diabetologist', 'nephrologist', 'hepatologist',
    'hematologist', 'endocrinologist', 'oncologist', 'neurologist',
    'pulmonologist', 'dermatologist', 'gynecologist', 'psychiatrist',
    'orthopedic', 'general_physician', 'pediatrician', 'ophthalmologist',
    'dentist', 'ent'
  ];
  if (validIds.includes(clean)) return clean;

  // Eye / Vision
  if (clean.includes('ophthal') || clean.includes('opthal') || clean.includes('optho') || clean.includes('eye') || clean.includes('retin') || clean.includes('vision') || clean.includes('cataract')) {
    return 'ophthalmologist';
  }

  // Heart
  if (clean.includes('cardio') || clean.includes('heart') || clean.includes('ecg')) {
    return 'cardiologist';
  }

  // Kidney
  if (clean.includes('nephro') || clean.includes('kidney') || clean.includes('renal')) {
    return 'nephrologist';
  }

  // Liver / Gastro
  if (clean.includes('hepato') || clean.includes('gastro') || clean.includes('liver') || clean.includes('digest') || clean.includes('stomach') || clean.includes('jaundice')) {
    return 'hepatologist';
  }

  // Lungs / Respiratory
  if (clean.includes('pulmon') || clean.includes('lung') || clean.includes('respirat') || clean.includes('chest') || clean.includes('asthma') || clean.includes('cough') || clean.includes('tuberculosis')) {
    return 'pulmonologist';
  }

  // Diabetes / Sugar
  if (clean.includes('diabet') || clean.includes('sugar')) {
    return 'diabetologist';
  }

  // Hormones / Thyroid / Endocrine
  if (clean.includes('endocrin') || clean.includes('thyroid') || clean.includes('hormon')) {
    return 'endocrinologist';
  }

  // Women / Pregnancy / Gynecologist
  if (clean.includes('gyne') || clean.includes('obgyn') || clean.includes('obstetric') || clean.includes('pregnan') || clean.includes('pcos') || clean.includes('women')) {
    return 'gynecologist';
  }

  // Brain / Neuro
  if (clean.includes('neuro') || clean.includes('brain') || clean.includes('stroke')) {
    return 'neurologist';
  }

  // Skin
  if (clean.includes('derma') || clean.includes('skin') || clean.includes('fungal')) {
    return 'dermatologist';
  }

  // Bone / Ortho
  if (clean.includes('ortho') || clean.includes('bone') || clean.includes('joint') || clean.includes('fracture')) {
    return 'orthopedic';
  }

  // Mental Health
  if (clean.includes('psych') || clean.includes('mental') || clean.includes('depress') || clean.includes('anxiety')) {
    return 'psychiatrist';
  }

  // Dental / Teeth
  if (clean.includes('dent') || clean.includes('oral') || clean.includes('teeth') || clean.includes('tooth')) {
    return 'dentist';
  }

  // Pediatric / Children
  if (clean.includes('pediat') || clean.includes('child') || clean.includes('baby') || clean.includes('infant')) {
    return 'pediatrician';
  }

  // Cancer / Oncology
  if (clean.includes('onco') || clean.includes('cancer') || clean.includes('tumor')) {
    return 'oncologist';
  }

  // Blood / Hematology
  if (clean.includes('hemat') || clean.includes('blood') || clean.includes('anemia')) {
    return 'hematologist';
  }

  // ENT
  if (clean.includes('ent') || clean.includes('ear') || clean.includes('throat')) {
    return 'ent';
  }

  // General Physician
  if (clean.includes('physician') || clean.includes('general') || clean.includes('primary') || clean.includes('mbbs')) {
    return 'general_physician';
  }

  return '';
};
