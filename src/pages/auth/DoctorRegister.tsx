import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../integrations/supabase/client';
import { INDIAN_STATES, getDistrictsForState } from '../../data/indianLocations';
import { DAY_NAMES } from '../../lib/types/doctor';
import {
  Mail, Lock, User as UserIcon, ShieldAlert, ArrowRight, Eye, EyeOff,
  Stethoscope, GraduationCap, Building2, MapPin, Clock, IndianRupee, ChevronDown, Plus, Trash2
} from 'lucide-react';

interface TimeSlotEntry {
  day_of_week: number;
  start_time: string;
  end_time: string;
  max_patients: number;
}

const SPECIALTIES = [
  { id: 'cardiologist', name: 'Cardiologist' },
  { id: 'diabetologist', name: 'Diabetologist / Endocrinologist' },
  { id: 'nephrologist', name: 'Nephrologist' },
  { id: 'hepatologist', name: 'Hepatologist / Gastroenterologist' },
  { id: 'hematologist', name: 'Hematologist' },
  { id: 'endocrinologist', name: 'Endocrinologist' },
  { id: 'oncologist', name: 'Oncologist' },
  { id: 'neurologist', name: 'Neurologist' },
  { id: 'pulmonologist', name: 'Pulmonologist' },
  { id: 'dermatologist', name: 'Dermatologist' },
  { id: 'gynecologist', name: 'Gynecologist / Obstetrician' },
  { id: 'psychiatrist', name: 'Psychiatrist' },
  { id: 'orthopedic', name: 'Orthopedic Surgeon' },
  { id: 'general_physician', name: 'General Physician' },
  { id: 'pediatrician', name: 'Pediatrician' },
  { id: 'ophthalmologist', name: 'Ophthalmologist' },
  { id: 'dentist', name: 'Dentist' },
  { id: 'ent', name: 'ENT Specialist' },
];

const DoctorRegister: React.FC = () => {

  // Auth fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Profile fields
  const [fullName, setFullName] = useState('');
  const [specialtyId, setSpecialtyId] = useState('');
  const [qualification, setQualification] = useState('');
  const [experienceYears, setExperienceYears] = useState<number>(0);
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [consultationFee, setConsultationFee] = useState<number>(0);
  const [bio, setBio] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');

  // Time slots
  const [timeSlots, setTimeSlots] = useState<TimeSlotEntry[]>([
    { day_of_week: 1, start_time: '09:00', end_time: '13:00', max_patients: 20 }
  ]);

  // UI state
  const [step, setStep] = useState(1); // 1=auth, 2=profile, 3=slots
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const districts = state ? getDistrictsForState(state) : [];

  const addTimeSlot = () => {
    setTimeSlots(prev => [...prev, { day_of_week: 1, start_time: '09:00', end_time: '13:00', max_patients: 20 }]);
  };

  const removeTimeSlot = (index: number) => {
    setTimeSlots(prev => prev.filter((_, i) => i !== index));
  };

  const updateTimeSlot = (index: number, field: keyof TimeSlotEntry, value: any) => {
    setTimeSlots(prev => prev.map((slot, i) => i === index ? { ...slot, [field]: value } : slot));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: 'doctor'
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Registration failed. Please try again.');

      const userId = authData.user.id;

      // 2. Create doctor profile
      const { error: profileError } = await supabase.from('doctors').insert({
        id: userId,
        full_name: fullName,
        email,
        specialty_id: specialtyId,
        qualification,
        experience_years: experienceYears,
        registration_number: registrationNumber || null,
        hospital_name: hospitalName,
        consultation_fee: consultationFee,
        bio: bio || null,
        state,
        district,
        city,
        status: 'pending'
      });

      if (profileError) throw profileError;

      // 3. Create time slots
      if (timeSlots.length > 0) {
        const slotsToInsert = timeSlots.map(slot => ({
          doctor_id: userId,
          day_of_week: slot.day_of_week,
          start_time: slot.start_time + ':00',
          end_time: slot.end_time + ':00',
          max_patients: slot.max_patients,
          is_active: true
        }));

        const { error: slotsError } = await supabase.from('doctor_time_slots').insert(slotsToInsert);
        if (slotsError) throw slotsError;
      }

      setSuccessMsg('Registration successful! Your profile will be reviewed by admin. Please check your email to verify your account.');

    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const canProceedStep1 = email && password && password.length >= 8;
  const canProceedStep2 = fullName && specialtyId && qualification && hospitalName && state && district && city;
  const canSubmit = canProceedStep1 && canProceedStep2 && timeSlots.length > 0;

  const inputClass = "w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm";
  const selectClass = "w-full pl-10 pr-8 py-2.5 rounded-lg border border-border bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm appearance-none";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>

      <div className="w-full max-w-2xl bg-card border border-border rounded-2xl p-8 shadow-xl glass">
        {/* Header */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl mb-3">
            <Stethoscope className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold font-heading">Doctor Registration</h1>
          <p className="text-muted-foreground text-sm mt-1">Join Aarogya Sahayak as a healthcare provider</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map(s => (
            <React.Fragment key={s}>
              <button
                onClick={() => { if (s < step) setStep(s); }}
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  s === step ? 'bg-primary text-white shadow-lg shadow-primary/20' :
                  s < step ? 'bg-emerald-500 text-white' :
                  'bg-muted text-muted-foreground'
                }`}
              >
                {s < step ? '✓' : s}
              </button>
              {s < 3 && <div className={`w-12 h-0.5 ${s < step ? 'bg-emerald-500' : 'bg-muted'}`} />}
            </React.Fragment>
          ))}
        </div>

        {/* Messages */}
        {errorMsg && (
          <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg mb-4 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="p-4 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm rounded-lg mb-4 text-center">
            <p className="font-semibold">{successMsg}</p>
            <Link to="/doctor-login" className="text-primary hover:underline font-semibold mt-2 inline-block">
              Go to Doctor Login →
            </Link>
          </div>
        )}

        {!successMsg && (
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* ── STEP 1: Account ── */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2"><Mail className="w-5 h-5 text-primary" /> Account Details</h2>

                <div>
                  <label className="block text-sm font-medium mb-1.5">Full Name</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground"><UserIcon className="w-4 h-4" /></span>
                    <input type="text" required className={inputClass} placeholder="Dr. Priya Sharma" value={fullName} onChange={e => setFullName(e.target.value)} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">Email</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground"><Mail className="w-4 h-4" /></span>
                    <input type="email" required className={inputClass} placeholder="doctor@hospital.com" value={email} onChange={e => setEmail(e.target.value)} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">Password</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground"><Lock className="w-4 h-4" /></span>
                    <input type={showPassword ? 'text' : 'password'} required minLength={8} className={`${inputClass} pr-10`} placeholder="Min 8 characters" value={password} onChange={e => setPassword(e.target.value)} />
                    <button type="button" className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button type="button" disabled={!canProceedStep1} onClick={() => setStep(2)}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all mt-4 shadow-md disabled:opacity-50 disabled:pointer-events-none">
                  <span>Next: Professional Details</span><ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* ── STEP 2: Professional Details ── */}
            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2"><GraduationCap className="w-5 h-5 text-primary" /> Professional Details</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Specialty</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground"><Stethoscope className="w-4 h-4" /></span>
                      <select required className={selectClass} value={specialtyId} onChange={e => setSpecialtyId(e.target.value)}>
                        <option value="">Select specialty</option>
                        {SPECIALTIES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">Qualification</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground"><GraduationCap className="w-4 h-4" /></span>
                      <input type="text" required className={inputClass} placeholder="MBBS, MD (Cardiology)" value={qualification} onChange={e => setQualification(e.target.value)} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">Experience (years)</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground"><Clock className="w-4 h-4" /></span>
                      <input type="number" required min={0} max={60} className={inputClass} placeholder="e.g. 12" value={experienceYears || ''} onChange={e => setExperienceYears(Number(e.target.value))} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">Registration Number (NMC/MCI)</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground"><ShieldAlert className="w-4 h-4" /></span>
                      <input type="text" className={inputClass} placeholder="Optional" value={registrationNumber} onChange={e => setRegistrationNumber(e.target.value)} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">Hospital / Clinic Name</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground"><Building2 className="w-4 h-4" /></span>
                      <input type="text" required className={inputClass} placeholder="AIIMS, SCB Medical College" value={hospitalName} onChange={e => setHospitalName(e.target.value)} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">Consultation Fee (₹)</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground"><IndianRupee className="w-4 h-4" /></span>
                      <input type="number" required min={0} className={inputClass} placeholder="e.g. 500" value={consultationFee || ''} onChange={e => setConsultationFee(Number(e.target.value))} />
                    </div>
                  </div>
                </div>

                {/* Location */}
                <h3 className="text-sm font-semibold flex items-center gap-2 pt-2"><MapPin className="w-4 h-4 text-primary" /> Location</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">State</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground"><MapPin className="w-4 h-4" /></span>
                      <select required className={selectClass} value={state} onChange={e => { setState(e.target.value); setDistrict(''); }}>
                        <option value="">Select state</option>
                        {INDIAN_STATES.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">District</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground"><MapPin className="w-4 h-4" /></span>
                      <select required className={selectClass} value={district} onChange={e => setDistrict(e.target.value)} disabled={!state}>
                        <option value="">Select district</option>
                        {districts.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">City / Town</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground"><MapPin className="w-4 h-4" /></span>
                      <input type="text" required className={inputClass} placeholder="e.g. Bhubaneswar" value={city} onChange={e => setCity(e.target.value)} />
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">About / Bio (optional)</label>
                  <textarea className="w-full p-3 rounded-lg border border-border bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm min-h-[80px] resize-y"
                    placeholder="Brief introduction about your practice, specializations, achievements..."
                    value={bio} onChange={e => setBio(e.target.value)} maxLength={500} />
                  <span className="text-xs text-muted-foreground">{bio.length}/500</span>
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)} className="flex-1 bg-muted hover:bg-muted/80 font-medium py-2.5 px-4 rounded-lg transition-all text-sm">
                    Back
                  </button>
                  <button type="button" disabled={!canProceedStep2} onClick={() => setStep(3)}
                    className="flex-1 bg-primary hover:bg-primary/90 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50 disabled:pointer-events-none">
                    <span>Next: Time Slots</span><ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 3: Time Slots ── */}
            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2"><Clock className="w-5 h-5 text-primary" /> Availability Schedule</h2>
                <p className="text-xs text-muted-foreground">Define your weekly consultation schedule. Patients can book within these slots.</p>

                <div className="space-y-3">
                  {timeSlots.map((slot, idx) => (
                    <div key={idx} className="flex flex-wrap items-end gap-3 p-3 bg-muted/30 rounded-lg border border-border">
                      <div className="flex-1 min-w-[130px]">
                        <label className="block text-xs font-medium mb-1">Day</label>
                        <select className="w-full py-2 px-3 rounded-lg border border-border bg-background text-sm" value={slot.day_of_week} onChange={e => updateTimeSlot(idx, 'day_of_week', Number(e.target.value))}>
                          {DAY_NAMES.map((d, i) => <option key={i} value={i}>{d}</option>)}
                        </select>
                      </div>
                      <div className="min-w-[100px]">
                        <label className="block text-xs font-medium mb-1">Start</label>
                        <input type="time" className="w-full py-2 px-3 rounded-lg border border-border bg-background text-sm" value={slot.start_time} onChange={e => updateTimeSlot(idx, 'start_time', e.target.value)} />
                      </div>
                      <div className="min-w-[100px]">
                        <label className="block text-xs font-medium mb-1">End</label>
                        <input type="time" className="w-full py-2 px-3 rounded-lg border border-border bg-background text-sm" value={slot.end_time} onChange={e => updateTimeSlot(idx, 'end_time', e.target.value)} />
                      </div>
                      <div className="min-w-[80px]">
                        <label className="block text-xs font-medium mb-1">Max Patients</label>
                        <input type="number" min={1} max={100} className="w-full py-2 px-3 rounded-lg border border-border bg-background text-sm" value={slot.max_patients} onChange={e => updateTimeSlot(idx, 'max_patients', Number(e.target.value))} />
                      </div>
                      {timeSlots.length > 1 && (
                        <button type="button" onClick={() => removeTimeSlot(idx)} className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button type="button" onClick={addTimeSlot} className="w-full py-2 border border-dashed border-border hover:border-primary text-muted-foreground hover:text-primary rounded-lg flex items-center justify-center gap-2 text-sm transition-all">
                  <Plus className="w-4 h-4" /> Add Another Slot
                </button>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setStep(2)} className="flex-1 bg-muted hover:bg-muted/80 font-medium py-2.5 px-4 rounded-lg transition-all text-sm">
                    Back
                  </button>
                  <button type="submit" disabled={!canSubmit || loading}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-500/10 disabled:opacity-50 disabled:pointer-events-none">
                    {loading ? 'Registering...' : (<><span>Submit Registration</span><ArrowRight className="w-4 h-4" /></>)}
                  </button>
                </div>
              </div>
            )}
          </form>
        )}

        {/* Footer links */}
        <div className="flex flex-col items-center gap-2 mt-6 text-sm text-muted-foreground">
          <p>Already registered? <Link to="/doctor-login" className="text-primary hover:underline font-medium">Doctor Login</Link></p>
          <p>Are you a patient? <Link to="/login" className="text-primary hover:underline font-medium">Patient Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default DoctorRegister;
