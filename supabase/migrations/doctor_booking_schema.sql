-- ==========================================
-- AAROGYA SAHAYAK - DOCTOR BOOKING SYSTEM SCHEMA
-- Execute this script in your Supabase SQL Editor
-- ==========================================

-- ──────────────────────────────────────────
-- 1. DOCTOR SPECIALTIES LOOKUP TABLE
-- Maps predictor IDs to doctor specialties
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.doctor_specialties (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT -- lucide icon name for UI
);

INSERT INTO public.doctor_specialties (id, name, description, icon) VALUES
  ('cardiologist', 'Cardiologist', 'Heart and cardiovascular system specialist', 'HeartPulse'),
  ('diabetologist', 'Diabetologist / Endocrinologist', 'Diabetes and hormonal disorders specialist', 'Droplets'),
  ('nephrologist', 'Nephrologist', 'Kidney and renal function specialist', 'Filter'),
  ('hepatologist', 'Hepatologist / Gastroenterologist', 'Liver and digestive system specialist', 'FlaskConical'),
  ('hematologist', 'Hematologist', 'Blood disorders and anemia specialist', 'Syringe'),
  ('endocrinologist', 'Endocrinologist', 'Thyroid and hormonal disorders specialist', 'Zap'),
  ('oncologist', 'Oncologist', 'Cancer treatment specialist', 'Microscope'),
  ('neurologist', 'Neurologist', 'Brain and nervous system specialist', 'Brain'),
  ('pulmonologist', 'Pulmonologist', 'Lung and respiratory specialist', 'Wind'),
  ('dermatologist', 'Dermatologist', 'Skin disorders specialist', 'Scan'),
  ('gynecologist', 'Gynecologist / Obstetrician', 'Women health and pregnancy specialist', 'Baby'),
  ('psychiatrist', 'Psychiatrist', 'Mental health and behavioral specialist', 'SmilePlus'),
  ('orthopedic', 'Orthopedic Surgeon', 'Bone and joint specialist', 'Bone'),
  ('general_physician', 'General Physician', 'Primary care and general health', 'Stethoscope'),
  ('pediatrician', 'Pediatrician', 'Child health specialist', 'Baby'),
  ('ophthalmologist', 'Ophthalmologist', 'Eye care specialist', 'Eye'),
  ('dentist', 'Dentist', 'Oral and dental health specialist', 'Smile'),
  ('ent', 'ENT Specialist', 'Ear, nose and throat specialist', 'Ear')
ON CONFLICT (id) DO NOTHING;


-- ──────────────────────────────────────────
-- 2. DOCTORS TABLE
-- Stores doctor profiles linked to auth.users
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.doctors (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  specialty_id TEXT REFERENCES public.doctor_specialties(id) NOT NULL,
  qualification TEXT NOT NULL,          -- e.g. 'MBBS, MD (Cardiology)'
  experience_years INTEGER NOT NULL DEFAULT 0,
  registration_number TEXT,             -- NMC/State Medical Council number
  hospital_name TEXT NOT NULL,
  consultation_fee INTEGER NOT NULL DEFAULT 0, -- in INR (₹)
  bio TEXT,
  state TEXT NOT NULL,
  district TEXT NOT NULL,
  city TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',  -- pending | approved | rejected
  average_rating NUMERIC(2,1) DEFAULT 0.0,
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

  CONSTRAINT valid_doctor_status CHECK (status IN ('pending', 'approved', 'rejected'))
);

ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;

-- Anyone can read approved doctors
CREATE POLICY "Anyone can view approved doctors" ON public.doctors
  FOR SELECT USING (status = 'approved');

-- Doctors can read their own profile regardless of status
CREATE POLICY "Doctors read own profile" ON public.doctors
  FOR SELECT USING (auth.uid() = id);

-- Doctors can update their own profile
CREATE POLICY "Doctors update own profile" ON public.doctors
  FOR UPDATE USING (auth.uid() = id);

-- Anyone can insert (register as doctor)
CREATE POLICY "Anyone can register as doctor" ON public.doctors
  FOR INSERT WITH CHECK (auth.uid() = id);


-- ──────────────────────────────────────────
-- 3. DOCTOR TIME SLOTS TABLE
-- Available time slots per doctor per day-of-week
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.doctor_time_slots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE NOT NULL,
  day_of_week INTEGER NOT NULL,  -- 0=Sunday, 1=Monday ... 6=Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  max_patients INTEGER NOT NULL DEFAULT 20,
  is_active BOOLEAN DEFAULT true,

  CONSTRAINT valid_day CHECK (day_of_week >= 0 AND day_of_week <= 6),
  CONSTRAINT valid_time_range CHECK (start_time < end_time),
  UNIQUE(doctor_id, day_of_week, start_time)
);

ALTER TABLE public.doctor_time_slots ENABLE ROW LEVEL SECURITY;

-- Anyone can read time slots of approved doctors
CREATE POLICY "Anyone can view doctor time slots" ON public.doctor_time_slots
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.doctors WHERE id = doctor_id AND status = 'approved')
  );

-- Doctors can manage their own time slots
CREATE POLICY "Doctors manage own time slots" ON public.doctor_time_slots
  FOR ALL USING (auth.uid() = doctor_id);


-- ──────────────────────────────────────────
-- 4. DOCTOR CALENDAR BLOCKS TABLE
-- Days when doctor is unavailable (holidays, leave)
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.doctor_calendar_blocks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE NOT NULL,
  blocked_date DATE NOT NULL,
  reason TEXT,

  UNIQUE(doctor_id, blocked_date)
);

ALTER TABLE public.doctor_calendar_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view calendar blocks" ON public.doctor_calendar_blocks
  FOR SELECT USING (true);

CREATE POLICY "Doctors manage own calendar blocks" ON public.doctor_calendar_blocks
  FOR ALL USING (auth.uid() = doctor_id);


-- ──────────────────────────────────────────
-- 5. APPOINTMENT COUNTER TABLE
-- Atomic counter for sequential token numbers
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.appointment_counter (
  doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE NOT NULL,
  appointment_date DATE NOT NULL,
  last_token INTEGER NOT NULL DEFAULT 0,

  PRIMARY KEY (doctor_id, appointment_date)
);

ALTER TABLE public.appointment_counter ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages counters" ON public.appointment_counter
  FOR ALL USING (true);


-- ──────────────────────────────────────────
-- 6. APPOINTMENTS TABLE
-- Booking tickets with token numbers and QR codes
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE NOT NULL,
  slot_id UUID REFERENCES public.doctor_time_slots(id) NOT NULL,
  appointment_date DATE NOT NULL,
  token_number INTEGER NOT NULL,
  
  -- Patient details (snapshot at booking time)
  patient_name TEXT NOT NULL,
  patient_aadhaar TEXT NOT NULL,  -- stored masked: XXXX-XXXX-1234
  patient_mobile TEXT NOT NULL,
  patient_state TEXT NOT NULL,
  patient_district TEXT NOT NULL,
  patient_address TEXT,

  -- Status lifecycle: pending → approved → scanned (or → rejected/cancelled)
  status TEXT NOT NULL DEFAULT 'pending',
  
  -- Payment
  payment_status TEXT NOT NULL DEFAULT 'free',  -- free | paid | refunded
  payment_amount INTEGER DEFAULT 0,

  -- QR code data (populated after doctor approval)
  qr_data TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

  CONSTRAINT valid_appointment_status CHECK (
    status IN ('pending', 'approved', 'rejected', 'cancelled', 'scanned', 'completed')
  ),
  CONSTRAINT valid_payment_status CHECK (
    payment_status IN ('free', 'paid', 'refunded')
  ),
  -- Prevent duplicate booking: same patient, same doctor, same date, same slot (unless cancelled/rejected)
  UNIQUE(patient_id, doctor_id, appointment_date, slot_id)
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Patients can read their own appointments
CREATE POLICY "Patients read own appointments" ON public.appointments
  FOR SELECT USING (auth.uid() = patient_id);

-- Doctors can read appointments booked with them
CREATE POLICY "Doctors read their appointments" ON public.appointments
  FOR SELECT USING (auth.uid() = doctor_id);

-- Patients can create appointments
CREATE POLICY "Patients create appointments" ON public.appointments
  FOR INSERT WITH CHECK (auth.uid() = patient_id);

-- Patients can cancel their own pending appointments
CREATE POLICY "Patients cancel own appointments" ON public.appointments
  FOR UPDATE USING (auth.uid() = patient_id);

-- Doctors can update appointment status (approve/reject/scan)
CREATE POLICY "Doctors update appointment status" ON public.appointments
  FOR UPDATE USING (auth.uid() = doctor_id);


-- ──────────────────────────────────────────
-- 7. DOCTOR REVIEWS TABLE
-- Patient reviews and ratings for doctors
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.doctor_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE NOT NULL,
  patient_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL,
  punctuality_rating INTEGER,
  consultation_rating INTEGER,
  staff_rating INTEGER,
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

  CONSTRAINT valid_rating CHECK (rating >= 1 AND rating <= 5),
  CONSTRAINT valid_punctuality CHECK (punctuality_rating IS NULL OR (punctuality_rating >= 1 AND punctuality_rating <= 5)),
  CONSTRAINT valid_consultation CHECK (consultation_rating IS NULL OR (consultation_rating >= 1 AND consultation_rating <= 5)),
  CONSTRAINT valid_staff CHECK (staff_rating IS NULL OR (staff_rating >= 1 AND staff_rating <= 5)),
  UNIQUE(patient_id, appointment_id)  -- One review per appointment
);

ALTER TABLE public.doctor_reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can read reviews
CREATE POLICY "Anyone can read reviews" ON public.doctor_reviews
  FOR SELECT USING (true);

-- Patients can write reviews for their own appointments
CREATE POLICY "Patients write reviews" ON public.doctor_reviews
  FOR INSERT WITH CHECK (auth.uid() = patient_id);

-- Patients can update their own reviews
CREATE POLICY "Patients update own reviews" ON public.doctor_reviews
  FOR UPDATE USING (auth.uid() = patient_id);


-- ──────────────────────────────────────────
-- 8. ADMIN USERS TABLE
-- Admin user IDs for approval access
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Admins can read admin table
CREATE POLICY "Admins read admin table" ON public.admin_users
  FOR SELECT USING (auth.uid() = user_id);


-- ──────────────────────────────────────────
-- 9. DATABASE FUNCTIONS
-- ──────────────────────────────────────────

-- Function: Atomic token assignment (prevents race conditions)
CREATE OR REPLACE FUNCTION public.assign_token(
  p_doctor_id UUID,
  p_appointment_date DATE
) RETURNS INTEGER AS $$
DECLARE
  v_token INTEGER;
BEGIN
  -- Upsert counter row for this doctor+date
  INSERT INTO public.appointment_counter (doctor_id, appointment_date, last_token)
  VALUES (p_doctor_id, p_appointment_date, 0)
  ON CONFLICT (doctor_id, appointment_date) DO NOTHING;

  -- Atomically increment and return the new token
  UPDATE public.appointment_counter
  SET last_token = last_token + 1
  WHERE doctor_id = p_doctor_id AND appointment_date = p_appointment_date
  RETURNING last_token INTO v_token;

  RETURN v_token;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Function: Update doctor average rating after new review
CREATE OR REPLACE FUNCTION public.update_doctor_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.doctors
  SET 
    average_rating = (
      SELECT ROUND(AVG(rating)::numeric, 1)
      FROM public.doctor_reviews
      WHERE doctor_id = NEW.doctor_id
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM public.doctor_reviews
      WHERE doctor_id = NEW.doctor_id
    ),
    updated_at = now()
  WHERE id = NEW.doctor_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Auto-update doctor rating when review is inserted/updated
CREATE OR REPLACE TRIGGER on_review_change
  AFTER INSERT OR UPDATE ON public.doctor_reviews
  FOR EACH ROW EXECUTE PROCEDURE public.update_doctor_rating();


-- Function: Get appointment count for a doctor on a specific date + slot
CREATE OR REPLACE FUNCTION public.get_slot_booking_count(
  p_doctor_id UUID,
  p_date DATE,
  p_slot_id UUID
) RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER
  FROM public.appointments
  WHERE doctor_id = p_doctor_id
    AND appointment_date = p_date
    AND slot_id = p_slot_id
    AND status NOT IN ('cancelled', 'rejected');
$$ LANGUAGE sql STABLE;
