'use client';

import Link from 'next/link';
import { Search, MapPin, ShieldCheck, Clock3 } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { uttarPradeshDistricts } from '../../lib/uttarPradeshDistricts';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

type DonorResult = {
  id: string;
  name: string;
  bloodGroup: string;
  city: string;
  area: string;
  availability: string;
  verified: boolean;
  lastActive: string;
  donations: number;
};

export default function FindDonorPage() {
  const [search, setSearch] = useState({ bloodGroup: 'O+', city: 'Lucknow', area: '' });
  const [donors, setDonors] = useState<DonorResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSearch = async (event?: FormEvent) => {
    event?.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const query = new URLSearchParams({
        bloodGroup: search.bloodGroup,
        city: search.city,
        area: search.area,
      });

      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const response = await fetch(`${apiBaseUrl}/api/search/donors?${query.toString()}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error?.message || 'Search failed.');
      }

      setDonors(result.data.results || []);
      setMessage(`${result.data.total ?? 0} potential donors found.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Search failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container-shell animate-page py-16">
      <div className="mb-8">
        <div className="text-xs uppercase tracking-[0.2em] text-red-300">Find Donor</div>
        <h1 className="mt-2 text-4xl font-black uppercase tracking-[-0.05em] text-white">Search the right donor</h1>
      </div>

      <form className="panel p-6" onSubmit={handleSearch}>
        <div className="grid gap-4 lg:grid-cols-5">
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-400">Blood Group</label>
            <select value={search.bloodGroup} onChange={(e) => setSearch({ ...search, bloodGroup: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white">
              {bloodGroups.map((group) => <option key={group}>{group}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-400">City</label>
            <select value={search.city} onChange={(e) => setSearch({ ...search, city: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white">
              {uttarPradeshDistricts.map((district) => <option key={district}>{district}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-400">Area</label>
            <input value={search.area} onChange={(e) => setSearch({ ...search, area: e.target.value })} placeholder="Optional area" className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white placeholder:text-slate-500" />
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-400">Availability</label>
            <select className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white">
              <option>Available</option>
              <option>Recently active</option>
              <option>Any</option>
            </select>
          </div>
          <div className="flex items-end">
            <button type="submit" className="btn-primary w-full" disabled={loading}>{loading ? 'Searching...' : 'Search Donors'}</button>
          </div>
        </div>
      </form>

      <div className="mt-8 mb-4 text-sm text-slate-300">{message || 'Search for available donors across supported areas.'}</div>

      <div className="grid gap-5">
        {donors.map((donor) => (
          <div key={donor.id} className="panel flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-red-400 text-xl font-black text-white">{donor.name.charAt(0)}</div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-white">{donor.name}</h3>
                  {donor.verified && <ShieldCheck className="h-4 w-4 text-emerald-400" />}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-slate-300">
                  <span className="rounded-full bg-red-500/10 px-2 py-1 font-bold text-red-200">{donor.bloodGroup}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-4 w-4 text-slate-400" /> {donor.city}</span>
                  <span>{donor.area}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 text-sm text-slate-300 md:items-end">
              <div className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-slate-400" /> {donor.lastActive}</div>
              <div className="flex items-center gap-2"><Search className="h-4 w-4 text-slate-400" /> {donor.donations} donations</div>
              <div className="flex items-center gap-3">
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-xs uppercase tracking-[0.15em] text-emerald-300">{donor.availability}</span>
                <Link className="btn-primary" href={`/request-blood?bloodGroup=${encodeURIComponent(donor.bloodGroup)}&city=${encodeURIComponent(donor.city)}&donorId=${encodeURIComponent(donor.id)}`}>Request Help</Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center text-sm text-slate-400">
        <Link href="/request-blood" className="text-red-300">Need help urgently? Create a request</Link>
      </div>
    </main>
  );
}
