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
