-- ==========================================
-- AAROGYA SAHAYAK - PRODUCTION FIX
-- Doctor registration via secure auth trigger
-- + Admin approval RLS policies
-- Run this in Supabase SQL Editor
-- ==========================================

-- ──────────────────────────────────────────
-- 1. LOCK DOWN DIRECT INSERTS ON public.doctors
-- Registration will now go through the
-- handle_new_doctor() trigger (SECURITY DEFINER),
-- so anonymous/client-side inserts are no longer needed.
-- ──────────────────────────────────────────
DROP POLICY IF EXISTS "Anyone can register as doctor" ON public.doctors;

CREATE POLICY "Doctors can insert own profile (fallback)" ON public.doctors
  FOR INSERT WITH CHECK (auth.uid() = id);
-- ^ kept as a safety net for any direct client insert with an active session;
--   normal registration flow will never hit this because the trigger below
--   creates the row before the client can.


-- ──────────────────────────────────────────
-- 2. ADMIN POLICIES
-- Admins need to see pending/rejected doctors
-- and update their status. Without these,
-- the admin dashboard silently only sees
-- already-approved doctors and approve/reject
-- actions affect zero rows.
-- ──────────────────────────────────────────
-- Note: Dropping the old policies in case they exist from the previous fix.
DROP POLICY IF EXISTS "Admins read all doctors" ON public.doctors;
DROP POLICY IF EXISTS "Admins update all doctors" ON public.doctors;
DROP POLICY IF EXISTS "Admins view all doctors" ON public.doctors;
DROP POLICY IF EXISTS "Admins update any doctor" ON public.doctors;

CREATE POLICY "Admins view all doctors" ON public.doctors
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins update any doctor" ON public.doctors
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
  );


-- ──────────────────────────────────────────
-- 3. TRIGGER: auto-create doctor profile + time slots
-- Fires as SECURITY DEFINER (bypasses RLS) right when
-- the auth.users row is created, so it works regardless
-- of whether email confirmation is required or whether
-- the browser has an active session yet.
-- ──────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_doctor()
RETURNS TRIGGER AS $$
DECLARE
  slot JSONB;
BEGIN
  -- Only act on signups that registered as a doctor
  IF (new.raw_user_meta_data->>'role') = 'doctor' THEN

    INSERT INTO public.doctors (
      id, full_name, email, specialty_id, qualification,
      experience_years, registration_number, hospital_name,
      consultation_fee, bio, state, district, city, status
    )
    VALUES (
      new.id,
      new.raw_user_meta_data->>'full_name',
      new.email,
      new.raw_user_meta_data->>'specialty_id',
      new.raw_user_meta_data->>'qualification',
      COALESCE((new.raw_user_meta_data->>'experience_years')::int, 0),
      new.raw_user_meta_data->>'registration_number',
      new.raw_user_meta_data->>'hospital_name',
      COALESCE((new.raw_user_meta_data->>'consultation_fee')::int, 0),
      new.raw_user_meta_data->>'bio',
      new.raw_user_meta_data->>'state',
      new.raw_user_meta_data->>'district',
      new.raw_user_meta_data->>'city',
      'pending'   -- always forced server-side; never trust client-supplied status
    )
    ON CONFLICT (id) DO NOTHING;

    -- Unpack time slots array (sent as JSON) into doctor_time_slots
    FOR slot IN SELECT * FROM jsonb_array_elements(
      COALESCE(new.raw_user_meta_data->'time_slots', '[]'::jsonb)
    )
    LOOP
      INSERT INTO public.doctor_time_slots (
        doctor_id, day_of_week, start_time, end_time, max_patients, is_active
      )
      VALUES (
        new.id,
        (slot->>'day_of_week')::int,
        (slot->>'start_time')::time,
        (slot->>'end_time')::time,
        COALESCE((slot->>'max_patients')::int, 20),
        true
      )
      ON CONFLICT (doctor_id, day_of_week, start_time) DO NOTHING;
    END LOOP;

  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_doctor_created ON auth.users;
CREATE TRIGGER on_auth_doctor_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_doctor();


-- ──────────────────────────────────────────
-- 4. (OPTIONAL, MANUAL) Bootstrap your admin account
-- Uncomment and run ONCE with your own auth user id.
-- Find it via: SELECT id, email FROM auth.users WHERE email = 'you@example.com';
-- ──────────────────────────────────────────
-- INSERT INTO public.admin_users (user_id, role)
-- VALUES ('YOUR_AUTH_UID_HERE', 'admin')
-- ON CONFLICT (user_id) DO NOTHING;
