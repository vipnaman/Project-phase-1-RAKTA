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
    const issuedDate = new Date(certificate.issuedAt).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    const html = `
      <!doctype html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>${certificate.certificateId}</title>
          <style>
            * { box-sizing: border-box; }
            body {
              margin: 0;
              min-height: 100vh;
              display: grid;
              place-items: center;
              background: linear-gradient(135deg, #fef2f2 0%, #f5f3ff 35%, #fefce8 100%);
              font-family: Georgia, 'Times New Roman', serif;
              color: #1f2937;
              padding: 32px;
            }
            .certificate {
              width: min(1120px, 92vw);
              min-height: 760px;
              background: linear-gradient(180deg, rgba(255,255,255,0.97), rgba(255,249,245,0.96));
              border: 16px solid #7f1d1d;
              border-radius: 32px;
              position: relative;
              box-shadow: 0 30px 80px rgba(69, 10, 10, 0.18);
              overflow: hidden;
              padding: 48px 56px 36px;
            }
            .certificate::before,
            .certificate::after {
              content: "";
              position: absolute;
              inset: 18px;
              border: 2px solid rgba(180, 122, 31, 0.75);
              border-radius: 24px;
              pointer-events: none;
            }
            .certificate::after {
              inset: 30px;
              border-color: rgba(180, 122, 31, 0.4);
            }
            .badge {
              width: 120px;
              height: 120px;
              margin: 0 auto 14px;
              border-radius: 50%;
              border: 3px solid rgba(180, 122, 31, 0.8);
              display: grid;
              place-items: center;
              background: radial-gradient(circle at center, #fffaf0 0%, #fef3c7 55%, #fbbf24 100%);
              color: #7f1d1d;
              font-weight: 700;
              letter-spacing: 0.18em;
              font-size: 20px;
              box-shadow: inset 0 0 18px rgba(255,255,255,0.9), 0 8px 22px rgba(180, 122, 31, 0.25);
            }
            .eyebrow {
              margin: 0;
              text-align: center;
              font-size: 14px;
              letter-spacing: 0.35em;
              text-transform: uppercase;
              color: #7f1d1d;
            }
            h1 {
              margin: 20px 0 12px;
              text-align: center;
              font-size: clamp(3rem, 4vw, 5rem);
              text-transform: uppercase;
              letter-spacing: 0.1em;
              color: #4c0519;
              line-height: 1;
            }
            .subtitle {
              margin: 0;
              text-align: center;
              font-size: 1.05rem;
              letter-spacing: 0.18em;
              text-transform: uppercase;
              color: #766f63;
            }
            .recognition {
              margin: 30px 0 12px;
              text-align: center;
              font-size: 1.05rem;
              color: #4b5563;
              letter-spacing: 0.08em;
            }
            .donor-name {
              margin: 0;
              text-align: center;
              font-size: clamp(2.2rem, 3vw, 3.3rem);
              color: #7f1d1d;
              letter-spacing: 0.06em;
              text-transform: uppercase;
            }
            .statement {
              max-width: 760px;
              margin: 24px auto 0;
              text-align: center;
              font-size: 1.15rem;
              line-height: 1.8;
              color: #374151;
            }
            .statement strong { color: #7f1d1d; }
            .details {
              margin-top: 36px;
              display: grid;
              grid-template-columns: repeat(3, minmax(0, 1fr));
              gap: 18px;
            }
            .detail {
              border-top: 2px solid rgba(180, 122, 31, 0.7);
              padding-top: 14px;
              text-align: center;
            }
            .detail span {
              display: block;
              margin-bottom: 8px;
              font-size: 0.72rem;
              text-transform: uppercase;
              letter-spacing: 0.2em;
              color: #7c6e63;
            }
            .detail strong {
              font-size: 1rem;
              color: #1f2937;
            }
            .footer {
              margin-top: 42px;
              display: flex;
              justify-content: space-between;
              align-items: end;
              gap: 30px;
            }
            .signature {
              flex: 1;
              text-align: center;
              border-top: 2px solid rgba(31, 41, 55, 0.8);
              padding-top: 10px;
              max-width: 240px;
            }
            .signature .line {
              display: block;
              font-size: 1.15rem;
              font-weight: 700;
              color: #1f2937;
              margin-bottom: 8px;
            }
            .signature small {
              font-size: 0.7rem;
              letter-spacing: 0.22em;
              text-transform: uppercase;
              color: #6b7280;
            }
            .seal {
              width: 125px;
              height: 125px;
              border: 3px solid rgba(180, 122, 31, 0.75);
              border-radius: 50%;
              display: grid;
              place-items: center;
              color: #7f1d1d;
              font-size: 12px;
              font-weight: 700;
              letter-spacing: 0.18em;
              text-transform: uppercase;
              text-align: center;
              line-height: 1.6;
              box-shadow: inset 0 0 12px rgba(180, 122, 31, 0.2);
            }
            @media print {
              body { background: white; }
              .certificate { box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <main class="certificate">
            <div class="badge">RAKTA</div>
            <p class="eyebrow">Certificate of Appreciation</p>
            <h1>RAKTA</h1>
            <p class="subtitle">Life-Saving Contribution</p>

            <p class="recognition">This certificate recognizes</p>
            <h2 class="donor-name">${certificate.donorName}</h2>

            <p class="statement">
              for completing <strong>${certificate.donationCount}</strong> verified blood donations and helping save lives
              with compassion, courage, and unwavering commitment to community care.
            </p>

            <div class="details">
              <div class="detail">
                <span>Certificate ID</span>
                <strong>${certificate.certificateId}</strong>
              </div>
              <div class="detail">
                <span>Donation Count</span>
                <strong>${certificate.donationCount}</strong>
              </div>
              <div class="detail">
                <span>Issued</span>
                <strong>${issuedDate}</strong>
              </div>
            </div>

            <div class="footer">
              <div class="signature">
                <span class="line">Dr. Aanya Verma</span>
                <small>Medical Director</small>
              </div>
              <div class="seal">Certified<br />Hero</div>
              <div class="signature">
                <span class="line">RAKTA Foundation</span>
                <small>Community Care</small>
              </div>
            </div>
          </main>
        </body>
      </html>
    `;

    const blob = new Blob([html], { type: 'text/html' });
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
