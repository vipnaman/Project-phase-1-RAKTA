'use client';

import { FormEvent, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { uttarPradeshDistricts } from '../../../lib/uttarPradeshDistricts';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '', city: 'Lucknow', area: '', address: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const response = await fetch(`${apiBaseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.error?.message || 'Registration failed.');
      }

      localStorage.setItem('rakta_user', JSON.stringify(result.data.user));
      localStorage.setItem('rakta_token', result.data.token);
      window.location.href = '/dashboard';
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container-shell flex min-h-[80vh] items-center justify-center py-16">
      <div className="w-full max-w-lg panel p-8">
        <div className="mb-6 text-center">
          <div className="text-xs uppercase tracking-[0.25em] text-red-300">Join RAKTA</div>
          <h1 className="mt-2 text-3xl font-black uppercase tracking-[-0.05em] text-white">Create account</h1>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-400">Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white" required />
            </div>
            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-400">Phone</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white" required />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-400">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white" required />
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-400">Password</label>
            <div className="password-field"><input type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white" required /><button type="button" className="password-toggle" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-400">City</label>
              <select value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white" required>
                {uttarPradeshDistricts.map((district) => <option key={district}>{district}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-400">Area</label>
              <input value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} placeholder="Your area or locality" className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white placeholder:text-slate-500" required />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-400">Full address</label>
            <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="House, street and nearby landmark" className="min-h-24 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white placeholder:text-slate-500" required />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
          {message ? <p className="text-sm text-red-200">{message}</p> : null}
        </form>
      </div>
    </main>
  );
}
