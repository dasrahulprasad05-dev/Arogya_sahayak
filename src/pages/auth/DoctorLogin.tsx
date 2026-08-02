import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../integrations/supabase/client';
import { Stethoscope, Mail, Lock, ShieldAlert, ArrowRight, Eye, EyeOff } from 'lucide-react';

const DoctorLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;

      // Check if user is a registered doctor
      const { data: doctor, error: docError } = await supabase
        .from('doctors')
        .select('id, status')
        .eq('id', authData.user.id)
        .single();

      if (docError || !doctor) {
        await supabase.auth.signOut();
        throw new Error('This account is not registered as a doctor. Please use Patient Login or register as a doctor first.');
      }

      if (doctor.status === 'pending') {
        await supabase.auth.signOut();
        throw new Error('Your doctor registration is pending admin approval. Please wait for approval before logging in.');
      }

      if (doctor.status === 'rejected') {
        await supabase.auth.signOut();
        throw new Error('Your doctor registration was rejected. Please contact support.');
      }

      navigate('/doctor-dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>

      <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-xl glass">
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl mb-3">
            <Stethoscope className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold font-heading">Doctor Portal</h1>
          <p className="text-muted-foreground text-sm mt-1">Access your doctor dashboard</p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg mb-4 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" htmlFor="doc-email">Email</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground"><Mail className="w-4 h-4" /></span>
              <input id="doc-email" type="email" required
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                placeholder="doctor@hospital.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" htmlFor="doc-password">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground"><Lock className="w-4 h-4" /></span>
              <input id="doc-password" type={showPassword ? 'text' : 'password'} required
                className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-border bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
              <button type="button" className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all mt-6 shadow-md shadow-emerald-500/10 disabled:opacity-60 disabled:pointer-events-none">
            {loading ? 'Signing in...' : (<><span>Doctor Login</span><ArrowRight className="w-4 h-4" /></>)}
          </button>
        </form>

        <div className="flex flex-col items-center gap-2 mt-6 text-sm text-muted-foreground">
          <p>Not registered? <Link to="/doctor-register" className="text-primary hover:underline font-medium">Register as Doctor</Link></p>
          <p>Are you a patient? <Link to="/login" className="text-primary hover:underline font-medium">Patient Login</Link></p>
          <p>Admin? <Link to="/admin-login" className="text-primary hover:underline font-medium">Admin Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default DoctorLogin;
