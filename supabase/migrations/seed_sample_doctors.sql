-- ==========================================
-- SAMPLE DOCTORS SEED DATA
-- Run this in Supabase SQL Editor
-- Creates 12 demo doctors across specialties
-- ==========================================

-- 1. Insert dummy users into auth.users to satisfy the foreign key constraint
-- Using a standard bcrypt hash for password 'password123'
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
VALUES
('d0000001-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'dr.arun.patel@demo.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"role":"doctor"}', now(), now(), '', '', '', ''),
('d0000001-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'dr.priya.sharma@demo.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"role":"doctor"}', now(), now(), '', '', '', ''),
('d0000001-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'dr.rajesh.mishra@demo.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"role":"doctor"}', now(), now(), '', '', '', ''),
('d0000001-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'dr.snehalata.das@demo.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"role":"doctor"}', now(), now(), '', '', '', ''),
('d0000001-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'dr.suchismita.mohanty@demo.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"role":"doctor"}', now(), now(), '', '', '', ''),
('d0000001-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'dr.biswajit.nayak@demo.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"role":"doctor"}', now(), now(), '', '', '', ''),
('d0000001-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'dr.ananya.tripathy@demo.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"role":"doctor"}', now(), now(), '', '', '', ''),
('d0000001-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'dr.manoj.behera@demo.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"role":"doctor"}', now(), now(), '', '', '', ''),
('d0000001-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'dr.sarita.pradhan@demo.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"role":"doctor"}', now(), now(), '', '', '', ''),
('d0000001-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'dr.suresh.sahoo@demo.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"role":"doctor"}', now(), now(), '', '', '', ''),
('d0000001-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'dr.laxmi.rath@demo.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"role":"doctor"}', now(), now(), '', '', '', ''),
('d0000001-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'dr.debasis.panda@demo.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"role":"doctor"}', now(), now(), '', '', '', '')
ON CONFLICT (id) DO NOTHING;


-- 2. Insert into public.doctors table
INSERT INTO public.doctors (id, full_name, email, specialty_id, qualification, experience_years, hospital_name, state, district, city, consultation_fee, bio, status, average_rating, total_reviews) VALUES

('d0000001-0000-0000-0000-000000000001', 'Dr. Arun Kumar Patel', 'dr.arun.patel@demo.com', 
 'cardiologist', 'MD (Cardiology), DM - AIIMS Delhi', 
 18, 'HeartCare Clinic', 'Odisha', 'Khordha', 'Bhubaneswar',
 500, 'Senior cardiologist with 18 years of experience in interventional cardiology. Specializes in angioplasty, pacemaker implantation, and preventive cardiac care.',
 'approved', 4.7, 42),

('d0000001-0000-0000-0000-000000000002', 'Dr. Priya Sharma', 'dr.priya.sharma@demo.com',
 'endocrinologist', 'MD (Endocrinology) - PGIMER Chandigarh',
 12, 'Diabetes & Wellness Center', 'Odisha', 'Cuttack', 'Cuttack',
 400, 'Expert in diabetes management, thyroid disorders, and metabolic syndromes. Pioneer of insulin pump therapy in Odisha.',
 'approved', 4.5, 35),

('d0000001-0000-0000-0000-000000000003', 'Dr. Rajesh Mishra', 'dr.rajesh.mishra@demo.com',
 'general_physician', 'MBBS, MD (General Medicine) - VIMSAR',
 8, 'City Health Clinic', 'Odisha', 'Khordha', 'Bhubaneswar',
 300, 'General physician specializing in fever management, infectious diseases (malaria, typhoid, dengue), and preventive healthcare. Fluent in Odia, Hindi, and English.',
 'approved', 4.3, 28),

('d0000001-0000-0000-0000-000000000004', 'Dr. Snehalata Das', 'dr.snehalata.das@demo.com',
 'pulmonologist', 'MD (Pulmonary Medicine), DNB - KIMS',
 15, 'Breathe Easy Lung Clinic', 'Odisha', 'Khordha', 'Bhubaneswar',
 450, 'Pulmonologist with expertise in asthma, COPD, and TB management. Active in rural lung health camps across Odisha.',
 'approved', 4.6, 31),

('d0000001-0000-0000-0000-000000000005', 'Dr. Suchismita Mohanty', 'dr.suchismita.mohanty@demo.com',
 'gynecologist', 'MS (OBG), DNB - SCB Medical College',
 20, 'Matri Seva Hospital', 'Odisha', 'Cuttack', 'Cuttack',
 500, 'Senior gynecologist with 20 years experience in high-risk pregnancy management, laparoscopic surgery, and infertility treatment.',
 'approved', 4.8, 55),

('d0000001-0000-0000-0000-000000000006', 'Dr. Biswajit Nayak', 'dr.biswajit.nayak@demo.com',
 'pediatrician', 'MD (Pediatrics) - Hi-Tech Medical College',
 10, 'Little Stars Child Care', 'Odisha', 'Khordha', 'Bhubaneswar',
 350, 'Child health specialist focusing on malnutrition, immunization, and childhood infections. Active in polio eradication programs.',
 'approved', 4.4, 22),

('d0000001-0000-0000-0000-000000000007', 'Dr. Ananya Tripathy', 'dr.ananya.tripathy@demo.com',
 'dermatologist', 'MD (Dermatology) - AIIMS Bhubaneswar',
 7, 'SkinGlow Derma Clinic', 'Odisha', 'Khordha', 'Bhubaneswar',
 400, 'Dermatologist specializing in fungal infections (ringworm, tinea), eczema, psoriasis, and acne treatment.',
 'approved', 4.2, 18),

('d0000001-0000-0000-0000-000000000008', 'Dr. Manoj Kumar Behera', 'dr.manoj.behera@demo.com',
 'ophthalmologist', 'MS (Ophthalmology), FICO - LV Prasad Eye Institute',
 14, 'ClearVision Eye Hospital', 'Odisha', 'Ganjam', 'Berhampur',
 350, 'Eye surgeon with expertise in diabetic retinopathy screening, cataract surgery, and glaucoma management.',
 'approved', 4.6, 38),

('d0000001-0000-0000-0000-000000000009', 'Dr. Sarita Pradhan', 'dr.sarita.pradhan@demo.com',
 'dentist', 'BDS, MDS (Periodontics) - SCB Dental College',
 9, 'SmileCare Dental Clinic', 'Odisha', 'Khordha', 'Bhubaneswar',
 250, 'Dentist specializing in gum disease, oral cancer screening (gutka/pan masala related), root canal, and dental implants.',
 'approved', 4.3, 15),

('d0000001-0000-0000-0000-000000000010', 'Dr. Suresh Chandra Sahoo', 'dr.suresh.sahoo@demo.com',
 'hepatologist', 'DM (Gastroenterology) - PGI Chandigarh',
 16, 'Liver & GI Care Center', 'Odisha', 'Khordha', 'Bhubaneswar',
 600, 'Gastroenterologist with special focus on hepatitis, jaundice, and liver cirrhosis. Runs free hepatitis screening camps.',
 'approved', 4.5, 27),

('d0000001-0000-0000-0000-000000000011', 'Dr. Laxmi Narayan Rath', 'dr.laxmi.rath@demo.com',
 'nephrologist', 'DM (Nephrology) - AIIMS Delhi',
 13, 'Kidney Care Hospital', 'Odisha', 'Cuttack', 'Cuttack',
 550, 'Nephrologist specializing in chronic kidney disease, dialysis management, and kidney transplant evaluation.',
 'approved', 4.7, 33),

('d0000001-0000-0000-0000-000000000012', 'Dr. Debasis Panda', 'dr.debasis.panda@demo.com',
 'psychiatrist', 'MD (Psychiatry) - NIMHANS Bangalore',
 11, 'MindWell Mental Health Clinic', 'Odisha', 'Khordha', 'Bhubaneswar',
 400, 'Psychiatrist specializing in depression, anxiety disorders, and addiction treatment. Conducts tele-psychiatry for rural patients.',
 'approved', 4.4, 20)

ON CONFLICT (id) DO NOTHING;


-- 3. Insert time slots for all doctors
INSERT INTO public.doctor_time_slots (doctor_id, day_of_week, start_time, end_time, max_patients) VALUES
('d0000001-0000-0000-0000-000000000001', 1, '09:00', '13:00', 15),
('d0000001-0000-0000-0000-000000000001', 1, '16:00', '19:00', 10),
('d0000001-0000-0000-0000-000000000001', 3, '09:00', '13:00', 15),
('d0000001-0000-0000-0000-000000000001', 5, '09:00', '13:00', 15),

('d0000001-0000-0000-0000-000000000002', 1, '10:00', '14:00', 20),
('d0000001-0000-0000-0000-000000000002', 2, '10:00', '14:00', 20),
('d0000001-0000-0000-0000-000000000002', 3, '10:00', '14:00', 20),
('d0000001-0000-0000-0000-000000000002', 4, '10:00', '14:00', 20),
('d0000001-0000-0000-0000-000000000002', 5, '10:00', '14:00', 20),

('d0000001-0000-0000-0000-000000000003', 1, '08:00', '12:00', 25),
('d0000001-0000-0000-0000-000000000003', 1, '17:00', '20:00', 15),
('d0000001-0000-0000-0000-000000000003', 2, '08:00', '12:00', 25),
('d0000001-0000-0000-0000-000000000003', 3, '08:00', '12:00', 25),
('d0000001-0000-0000-0000-000000000003', 4, '08:00', '12:00', 25),
('d0000001-0000-0000-0000-000000000003', 5, '08:00', '12:00', 25),
('d0000001-0000-0000-0000-000000000003', 6, '08:00', '12:00', 20),

('d0000001-0000-0000-0000-000000000004', 1, '09:00', '14:00', 15),
('d0000001-0000-0000-0000-000000000004', 3, '09:00', '14:00', 15),
('d0000001-0000-0000-0000-000000000004', 5, '09:00', '14:00', 15),

('d0000001-0000-0000-0000-000000000005', 1, '09:00', '13:00', 20),
('d0000001-0000-0000-0000-000000000005', 2, '09:00', '13:00', 20),
('d0000001-0000-0000-0000-000000000005', 3, '09:00', '13:00', 20),
('d0000001-0000-0000-0000-000000000005', 4, '09:00', '13:00', 20),
('d0000001-0000-0000-0000-000000000005', 5, '09:00', '13:00', 20),
('d0000001-0000-0000-0000-000000000005', 6, '09:00', '12:00', 10),

('d0000001-0000-0000-0000-000000000006', 1, '10:00', '13:00', 20),
('d0000001-0000-0000-0000-000000000006', 2, '10:00', '13:00', 20),
('d0000001-0000-0000-0000-000000000006', 3, '10:00', '13:00', 20),
('d0000001-0000-0000-0000-000000000006', 4, '10:00', '13:00', 20),
('d0000001-0000-0000-0000-000000000006', 5, '10:00', '13:00', 20),

('d0000001-0000-0000-0000-000000000007', 2, '10:00', '14:00', 15),
('d0000001-0000-0000-0000-000000000007', 4, '10:00', '14:00', 15),
('d0000001-0000-0000-0000-000000000007', 6, '10:00', '13:00', 10),

('d0000001-0000-0000-0000-000000000008', 1, '09:00', '13:00', 18),
('d0000001-0000-0000-0000-000000000008', 3, '09:00', '13:00', 18),
('d0000001-0000-0000-0000-000000000008', 5, '09:00', '13:00', 18),

('d0000001-0000-0000-0000-000000000009', 1, '10:00', '13:00', 12),
('d0000001-0000-0000-0000-000000000009', 2, '10:00', '13:00', 12),
('d0000001-0000-0000-0000-000000000009', 3, '10:00', '13:00', 12),
('d0000001-0000-0000-0000-000000000009', 4, '10:00', '13:00', 12),
('d0000001-0000-0000-0000-000000000009', 5, '10:00', '13:00', 12),

('d0000001-0000-0000-0000-000000000010', 1, '09:00', '13:00', 12),
('d0000001-0000-0000-0000-000000000010', 3, '09:00', '13:00', 12),
('d0000001-0000-0000-0000-000000000010', 5, '09:00', '13:00', 12),

('d0000001-0000-0000-0000-000000000011', 2, '09:00', '14:00', 10),
('d0000001-0000-0000-0000-000000000011', 4, '09:00', '14:00', 10),
('d0000001-0000-0000-0000-000000000011', 6, '09:00', '12:00', 8),

('d0000001-0000-0000-0000-000000000012', 1, '11:00', '14:00', 8),
('d0000001-0000-0000-0000-000000000012', 2, '11:00', '14:00', 8),
('d0000001-0000-0000-0000-000000000012', 3, '11:00', '14:00', 8),
('d0000001-0000-0000-0000-000000000012', 4, '11:00', '14:00', 8),
('d0000001-0000-0000-0000-000000000012', 5, '11:00', '14:00', 8)

ON CONFLICT DO NOTHING;
