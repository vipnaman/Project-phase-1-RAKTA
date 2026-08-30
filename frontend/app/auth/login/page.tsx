'use client';

import { FormEvent, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', phone: '', password: '' });
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdmin, setShowAdmin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [adminMessage, setAdminMessage] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const result = await response.json();
      if (!response.ok) throw new Error(result?.error?.message || 'Login failed.');
      localStorage.setItem('rakta_user', JSON.stringify(result.data.user));
      localStorage.setItem('rakta_token', result.data.token);
      window.location.href = '/dashboard';
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Login failed.'); }
    finally { setLoading(false); }
  };

  const handleAdminLogin = async (event: FormEvent) => {
    event.preventDefault();
    setAdminLoading(true);
    setAdminMessage('');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/admin/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: adminPassword }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result?.error?.message || 'Admin login failed.');
      localStorage.setItem('rakta_admin_token', result.data.token);
      window.location.href = '/admin';
    } catch (error) { setAdminMessage(error instanceof Error ? error.message : 'Admin login failed.'); }
    finally { setAdminLoading(false); }
  };

  return (
    <main className="container-shell flex min-h-[80vh] items-center justify-center py-16">
      <div className="panel w-full max-w-md p-8">
        <div className="mb-6 text-center">
          <div className="text-xs uppercase tracking-[0.25em] text-red-300">Welcome back</div>
          <div className="login-switch mt-4" role="tablist" aria-label="Account access type">
            <button type="button" role="tab" aria-selected={!showAdmin} className={!showAdmin ? 'login-tab active' : 'login-tab'} onClick={() => { setShowAdmin(false); setAdminMessage(''); }}>Login</button>
            <button type="button" role="tab" aria-selected={showAdmin} className={showAdmin ? 'login-tab active' : 'login-tab'} onClick={() => { setShowAdmin(true); setMessage(''); }}>Admin</button>
          </div>
        </div>
        {!showAdmin ? <form className="space-y-5" onSubmit={handleSubmit}>
          <div><label className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-400">Email or mobile number</label><input type="text" value={form.email || form.phone} onChange={(event) => { const value = event.target.value; setForm({ ...form, email: value.includes('@') ? value : '', phone: value.includes('@') ? '' : value }); }} className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white" placeholder="you@example.com or 9876543210" required /></div>
          <div><label className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-400">Password</label><div className="password-field"><input type={showPassword ? 'text' : 'password'} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white" required /><button type="button" className="password-toggle" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div></div>
          <button type="submit" className="btn-primary w-full" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
          {message ? <p className="text-sm text-red-200">{message}</p> : null}
        </form> : <form className="space-y-5" onSubmit={handleAdminLogin}>
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-100">Restricted admin access</div>
          <div className="password-field"><input type={showAdminPassword ? 'text' : 'password'} autoFocus value={adminPassword} onChange={(event) => setAdminPassword(event.target.value)} placeholder="Admin password" className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white placeholder:text-slate-500" required /><button type="button" className="password-toggle" onClick={() => setShowAdminPassword((value) => !value)} aria-label={showAdminPassword ? 'Hide admin password' : 'Show admin password'}>{showAdminPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div>
          <button type="submit" className="btn-primary w-full" disabled={adminLoading}>{adminLoading ? 'Checking access...' : 'Open Admin Panel'}</button>
          {adminMessage ? <p className="text-sm text-red-200">{adminMessage}</p> : null}
        </form>}
      </div>
    </main>
  );
}
