'use client';

import { FormEvent, useEffect, useState } from 'react';
import { uttarPradeshDistricts } from '../../lib/uttarPradeshDistricts';

const initialForm = {
  requesterId: 'user-requester-1',
  requesterEmail: 'riya@rakta.local',
  requesterPhone: '9123456780',
  bloodGroup: 'O+',
  unitsRequired: 2,
  city: 'Lucknow',
  state: 'Uttar Pradesh',
  country: 'India',
  area: 'Hazratganj',
  hospitalName: 'King George Medical University',
  hospitalAddress: 'Gomti Nagar, Lucknow, Uttar Pradesh',
  urgency: 'URGENT',
  requiredDate: '2026-08-31',
};

export default function RequestBloodPage() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [createdRequest, setCreatedRequest] = useState<{ requestId: string; matches: string[] } | null>(null);

  const downloadRequest = () => {
    window.print();
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const bloodGroup = searchParams.get('bloodGroup');
    const city = searchParams.get('city');
    if (bloodGroup || city) {
      setForm((current) => ({ ...current, ...(bloodGroup ? { bloodGroup } : {}), ...(city ? { city, hospitalAddress: `Gomti Nagar, ${city}, Uttar Pradesh` } : {}) }));
    }
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const response = await fetch(`${apiBaseUrl}/api/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.error?.message || 'Unable to create request.');
      }

      setCreatedRequest({ requestId: result.data.requestId, matches: result.data.matches || [] });
      setMessage(`Blood request created successfully: ${result.data.requestId}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to create request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container-shell py-16">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <div className="text-xs uppercase tracking-[0.2em] text-red-300">Request Blood</div>
          <h1 className="mt-2 text-4xl font-black uppercase tracking-[-0.05em] text-white">Create a blood request</h1>
        </div>

        <form className="panel space-y-6 p-6 md:p-8" onSubmit={handleSubmit}>
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-400">Requester ID</label>
              <input value={form.requesterId} onChange={(e) => setForm({ ...form, requesterId: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white" required />
            </div>
            <div><label className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-400">Requester email</label><input type="email" value={form.requesterEmail} onChange={(e) => setForm({ ...form, requesterEmail: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white" required /></div>
            <div><label className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-400">Requester mobile</label><input type="tel" value={form.requesterPhone} onChange={(e) => setForm({ ...form, requesterPhone: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white" required /></div>
            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-400">Blood Group Required</label>
              <select value={form.bloodGroup} onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white">
                <option>O+</option>
                <option>O-</option>
                <option>A+</option>
                <option>A-</option>
                <option>B+</option>
                <option>B-</option>
                <option>AB+</option>
                <option>AB-</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-400">Units Required</label>
              <input type="number" value={form.unitsRequired} onChange={(e) => setForm({ ...form, unitsRequired: Number(e.target.value) })} className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white" required />
            </div>
            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-400">Urgency</label>
              <select value={form.urgency} onChange={(e) => setForm({ ...form, urgency: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white">
                <option value="NORMAL">Normal</option>
                <option value="URGENT">Urgent</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-400">City</label>
              <select value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white" required>{uttarPradeshDistricts.map((district) => <option key={district}>{district}</option>)}</select>
            </div>
            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-400">State</label>
              <input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white" required />
            </div>
            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-400">Area</label>
              <input value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white" required />
            </div>
            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-400">Required Date</label>
              <input type="date" value={form.requiredDate} onChange={(e) => setForm({ ...form, requiredDate: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white" required />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-400">Hospital Name</label>
              <input value={form.hospitalName} onChange={(e) => setForm({ ...form, hospitalName: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white" required />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-400">Hospital Address</label>
              <textarea rows={3} value={form.hospitalAddress} onChange={(e) => setForm({ ...form, hospitalAddress: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white" required />
            </div>
          </div>

          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-slate-200">
            Important: RAKTA supports matching and connection, but actual transfusion compatibility must be confirmed by qualified medical professionals or blood banks.
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Creating request...' : 'Create Request'}</button>
          {message ? <p className="text-sm text-red-200">{message}</p> : null}
          {createdRequest ? <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-emerald-100"><strong>Request response</strong><div className="mt-2">ID: {createdRequest.requestId}</div><div className="mt-1">Compatible donor groups: {createdRequest.matches.join(', ') || 'Matching review pending.'}</div></div> : null}
          {createdRequest ? <button type="button" className="btn-secondary no-print" onClick={downloadRequest}>Download / print request</button> : null}
        </form>
      </div>
    </main>
  );
}
