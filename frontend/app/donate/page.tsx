'use client';

import { FormEvent, useState } from 'react';
import { uttarPradeshDistricts } from '../../lib/uttarPradeshDistricts';

const initialForm = {
  userId: 'user-donor-1',
  name: 'Aarav Singh',
  bloodGroup: 'O+',
  city: 'Lucknow',
  state: 'Uttar Pradesh',
  country: 'India',
  area: 'Hazratganj',
  availability: 'AVAILABLE',
};

export default function BecomeDonorPage() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [donorId, setDonorId] = useState('donor-1');
  const [donationCount, setDonationCount] = useState(0);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const response = await fetch(`${apiBaseUrl}/api/donors/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.error?.message || 'Could not create donor profile.');
      }

      setMessage('Donor profile created successfully.');
      setDonorId(result.data.id);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not create donor profile.');
    } finally {
      setLoading(false);
    }
  };

  const recordDonation = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/donors/${donorId}/donations/complete`, { method: 'POST' });
    const result = await response.json();
    if (!response.ok) { setMessage(result?.error?.message || 'Could not record donation.'); return; }
    setDonationCount(result.data.donor.donationCount);
    setMessage(`Completed donation recorded. Total: ${result.data.donor.donationCount}.`);
  };

  const downloadCertificate = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/donors/${donorId}/certificate`);
    const result = await response.json();
    if (!response.ok) { setMessage(result?.error?.message || 'Certificate is not available.'); return; }
    const certificate = result.data;
    const html = `<main style="font-family: Georgia, serif; text-align: center; border: 12px solid #991b1b; padding: 80px; color: #450a0a"><h1>RAKTA</h1><h2>Certificate of Life-Saving Contribution</h2><p>This certificate recognizes</p><h1>${certificate.donorName}</h1><p>for completing ${certificate.donationCount} blood donations and helping people through difficult times.</p><p>Certificate ID: ${certificate.certificateId}</p><p>Issued: ${new Date(certificate.issuedAt).toLocaleDateString()}</p></main>`;
    const blob = new Blob([`<!doctype html><html><body>${html}</body></html>`], { type: 'text/html' });
    const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `${certificate.certificateId}.html`; link.click(); URL.revokeObjectURL(link.href);
  };

  return (
    <main className="container-shell py-16">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <div className="text-xs uppercase tracking-[0.2em] text-red-300">Become a donor</div>
          <h1 className="mt-2 text-4xl font-black uppercase tracking-[-0.05em] text-white">Register to save lives</h1>
        </div>

        <div className="panel p-6 md:p-8">
          <div className="mb-6 grid gap-4 md:grid-cols-6">
            {['Account', 'Blood', 'Location', 'Availability', 'Preferences', 'Acknowledge'].map((step, index) => (
              <div key={step} className="rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2 text-center text-xs uppercase tracking-[0.15em] text-slate-300">
                {index + 1}. {step}
              </div>
            ))}
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-400">Full Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white" required />
              </div>
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-400">User ID</label>
                <input value={form.userId} onChange={(e) => setForm({ ...form, userId: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white" required />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-400">Blood Group</label>
                <select value={form.bloodGroup} onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white">
                  <option>A+</option>
                  <option>A-</option>
                  <option>B+</option>
                  <option>B-</option>
                  <option>O+</option>
                  <option>O-</option>
                  <option>AB+</option>
                  <option>AB-</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-400">Availability</label>
                <select value={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white">
                  <option value="AVAILABLE">AVAILABLE</option>
                  <option value="RECENTLY_ACTIVE">RECENTLY_ACTIVE</option>
                  <option value="UNAVAILABLE">UNAVAILABLE</option>
                </select>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-400">City</label>
                <select value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white" required>{uttarPradeshDistricts.map((district) => <option key={district}>{district}</option>)}</select>
              </div>
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-400">State</label>
                <input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white" required />
              </div>
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-400">Country</label>
                <input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white" required />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-400">Area</label>
              <input value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white" required />
            </div>

            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-slate-200">
              I understand that actual blood donation eligibility is determined by the blood bank or qualified medical professional. This registration does not certify the user as medically eligible.
            </div>

            <button className="btn-primary" type="submit" disabled={loading}>{loading ? 'Saving profile...' : 'Create Donor Profile'}</button>
            {message ? <p className="text-sm text-red-200">{message}</p> : null}
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-slate-200"><strong className="text-amber-200">Donation recognition</strong><p className="mt-1">Completed donations: {donationCount} / 3</p><button type="button" className="btn-secondary mt-3" onClick={recordDonation}>Record completed donation</button>{donationCount >= 3 ? <button type="button" className="btn-primary ml-3 mt-3" onClick={downloadCertificate}>Download certificate</button> : null}</div>
          </form>
        </div>
      </div>
    </main>
  );
}
