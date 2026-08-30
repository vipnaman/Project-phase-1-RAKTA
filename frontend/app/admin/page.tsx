'use client';

import { useEffect, useState } from 'react';

type Stats = Record<string, number>;
type Activity = { id: string; action: string; statusCode: number; createdAt: string; details: { message?: string | null } };
type RequestRecord = { id: string; requestId: string; bloodGroup: string; city: string; urgency: string; status: string; requesterId: string };
type HelpResponse = { id: string; requestId: string; donorId: string; requesterId: string; status: string };
type Donor = { id: string; name: string; bloodGroup: string; city: string; availability: string; verificationStatus: string };
type UserRecord = { id: string; name: string; email: string; role: string; status: string };

const api = (path: string) => `${process.env.NEXT_PUBLIC_API_URL || ''}/api${path}`;

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  const [stats, setStats] = useState<Stats>({});
  const [activities, setActivities] = useState<Activity[]>([]);
  const [requests, setRequests] = useState<RequestRecord[]>([]);
  const [responses, setResponses] = useState<HelpResponse[]>([]);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [users, setUsers] = useState<UserRecord[]>([]);

  useEffect(() => {
    setToken(localStorage.getItem('rakta_admin_token'));
  }, []);

  useEffect(() => {
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all(['/admin/stats', '/admin/activities', '/admin/requests', '/admin/help-responses', '/admin/donors', '/admin/users'].map((path) => fetch(api(path), { headers }).then((response) => response.json())))
      .then(([statsResult, activitiesResult, requestsResult, responsesResult, donorsResult, usersResult]) => {
        setStats(statsResult.data || {});
        setActivities(activitiesResult.data || []);
        setRequests(requestsResult.data || []);
        setResponses(responsesResult.data || []);
        setDonors(donorsResult.data || []);
        setUsers(usersResult.data || []);
      })
      .catch(() => undefined);
  }, [token]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await fetch(api('/admin/login'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
    const result = await response.json();
    if (!response.ok) { setLoginMessage(result?.error?.message || 'Admin login failed.'); return; }
    localStorage.setItem('rakta_admin_token', result.data.token);
    setToken(result.data.token);
    setLoginMessage('');
  };

  const updateRequest = async (id: string, status: string) => {
    if (!token) return;
    await fetch(api(`/admin/requests/${id}`), { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ status }) });
    const refreshed = await fetch(api('/admin/requests'), { headers: { Authorization: `Bearer ${token}` } });
    const result = await refreshed.json();
    setRequests(result.data || []);
  };

  const updateDonor = async (id: string, change: Record<string, string>) => {
    if (!token) return;
    await fetch(api(`/admin/donors/${id}`), { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(change) });
    setDonors((current) => current.map((donor) => donor.id === id ? { ...donor, ...change } : donor));
  };

  const updateUser = async (id: string, status: string) => {
    if (!token) return;
    await fetch(api(`/admin/users/${id}`), { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ status }) });
    setUsers((current) => current.map((user) => user.id === id ? { ...user, status } : user));
  };

  if (!token) return <main className="container-shell flex min-h-[80vh] items-center justify-center py-16"><form className="panel w-full max-w-md space-y-5 p-8" onSubmit={handleLogin}><div><div className="text-xs uppercase tracking-[0.2em] text-red-300">Restricted area</div><h1 className="mt-2 text-3xl font-black uppercase text-white">Admin access</h1></div><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Admin password" className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white placeholder:text-slate-500" required /><button className="btn-primary w-full" type="submit">Enter Admin Panel</button>{loginMessage ? <p className="text-sm text-red-200">{loginMessage}</p> : null}</form></main>;

  const metrics = [
    ['Total Users', stats.totalUsers], ['Total Donors', stats.totalDonors], ['Verified Donors', stats.verifiedDonors],
    ['Active Requests', stats.activeRequests], ['Critical Requests', stats.criticalRequests], ['Completed Requests', stats.completedRequests],
  ];

  return (
    <main className="container-shell py-16">
      <div className="mb-8"><div className="text-xs uppercase tracking-[0.2em] text-red-300">Admin Dashboard</div><h1 className="mt-2 text-4xl font-black uppercase tracking-[-0.05em] text-white">Live platform activity</h1></div>
      <div className="grid gap-5 md:grid-cols-3 xl:grid-cols-6">{metrics.map(([label, value]) => <div key={label} className="panel p-5"><div className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</div><div className="mt-3 text-3xl font-black text-white">{value ?? 0}</div></div>)}</div>
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <section className="panel p-6"><h2 className="text-xl font-bold text-white">Requests</h2><div className="mt-4 space-y-3">{requests.length ? requests.map((request) => <div key={request.id} className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300"><div className="flex justify-between gap-3"><strong className="text-white">{request.requestId}</strong><span className="text-red-300">{request.urgency}</span></div><div className="mt-2">{request.bloodGroup} · {request.city} · {request.status}</div><div className="mt-1 text-xs text-slate-500">Requester: {request.requesterId}</div><select value={request.status} onChange={(event) => updateRequest(request.id, event.target.value)} className="mt-3 rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-white"><option value="OPEN">Open</option><option value="MATCHED">Matched</option><option value="COMPLETED">Completed</option><option value="CANCELLED">Cancelled</option></select></div>) : <p className="text-sm text-slate-400">No requests recorded yet.</p>}</div></section>
        <section className="panel p-6"><h2 className="text-xl font-bold text-white">Donor responses</h2><div className="mt-4 space-y-3">{responses.length ? responses.map((response) => <div key={response.id} className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300"><div className="flex justify-between gap-3"><strong className="text-white">{response.requestId}</strong><span className="text-emerald-300">{response.status}</span></div><div className="mt-2">Donor: {response.donorId} · Requester: {response.requesterId}</div></div>) : <p className="text-sm text-slate-400">No donor responses recorded yet.</p>}</div></section>
      </div>
      <section className="panel mt-6 p-6"><h2 className="text-xl font-bold text-white">Recent logins and actions</h2><div className="mt-4 space-y-2">{activities.length ? activities.slice(0, 20).map((activity) => <div key={activity.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 py-3 text-sm"><span className="text-slate-200">{activity.action}</span><span className={activity.statusCode < 400 ? 'text-emerald-300' : 'text-red-300'}>{activity.statusCode} · {activity.details.message || 'Completed'}</span><time className="text-xs text-slate-500">{new Date(activity.createdAt).toLocaleString()}</time></div>) : <p className="text-sm text-slate-400">No activity recorded yet.</p>}</div></section>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="panel p-6"><h2 className="text-xl font-bold text-white">Donor controls</h2><div className="mt-4 space-y-3">{donors.map((donor) => <div key={donor.id} className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300"><strong className="text-white">{donor.name}</strong><div>{donor.bloodGroup} · {donor.city}</div><div className="mt-3 flex flex-wrap gap-2"><select value={donor.verificationStatus} onChange={(event) => updateDonor(donor.id, { verificationStatus: event.target.value })} className="rounded-lg bg-slate-900 px-2 py-2 text-white"><option>VERIFIED</option><option>PENDING</option><option>UNVERIFIED</option></select><select value={donor.availability} onChange={(event) => updateDonor(donor.id, { availability: event.target.value })} className="rounded-lg bg-slate-900 px-2 py-2 text-white"><option>AVAILABLE</option><option>RECENTLY_ACTIVE</option><option>UNAVAILABLE</option></select></div></div>)}</div></section>
        <section className="panel p-6"><h2 className="text-xl font-bold text-white">User controls</h2><div className="mt-4 space-y-3">{users.map((user) => <div key={user.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 p-4 text-sm"><div><strong className="text-white">{user.name}</strong><div className="text-slate-400">{user.email} · {user.role}</div></div><select value={user.status} onChange={(event) => updateUser(user.id, event.target.value)} className="rounded-lg bg-slate-900 px-2 py-2 text-white"><option>ACTIVE</option><option>SUSPENDED</option></select></div>)}</div></section>
      </div>
    </main>
  );
}
