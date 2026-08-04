import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../integrations/supabase/client';
import { Shield, Mail, Lock, ShieldAlert, ArrowRight, Eye, EyeOff } from 'lucide-react';

const AdminLogin: React.FC = () => {
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

      // Check if user is an admin
      const { data: admin, error: adminError } = await supabase
        .from('admin_users')
        .select('user_id')
        .eq('user_id', authData.user.id)
        .single();

      if (adminError || !admin) {
        await supabase.auth.signOut();
        throw new Error('This account does not have admin privileges.');
      }

      navigate('/admin');
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>

      <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-xl glass">
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl mb-3">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold font-heading">Admin Portal</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage doctor approvals and system</p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg mb-4 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" htmlFor="admin-email">Email</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground"><Mail className="w-4 h-4" /></span>
              <input id="admin-email" type="email" required
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                placeholder="admin@arogyasahayak.in" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium" htmlFor="admin-password">Password</label>
              <Link to="/forgot-password" className="text-xs text-amber-600 dark:text-amber-400 hover:underline font-medium">
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground"><Lock className="w-4 h-4" /></span>
              <input id="admin-password" type={showPassword ? 'text' : 'password'} required
                className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-border bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
              <button type="button" className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all mt-6 shadow-md shadow-amber-500/10 disabled:opacity-60 disabled:pointer-events-none">
            {loading ? 'Signing in...' : (<><span>Admin Login</span><ArrowRight className="w-4 h-4" /></>)}
          </button>
        </form>

        <div className="flex flex-col items-center gap-2 mt-6 text-sm text-muted-foreground">
          <p><Link to="/login" className="text-primary hover:underline font-medium">← Back to Patient Login</Link></p>
          <p>Are you a doctor? <Link to="/doctor-login" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">Doctor Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
