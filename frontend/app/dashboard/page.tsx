'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';

type Account = {
  user: { id: string; name: string; email: string; phone: string; city?: string; area?: string; address?: string; createdAt: string; lastLoginAt?: string };
  donor: { id: string; bloodGroup: string; city: string; availability: string; donationCount: number; verificationStatus: string } | null;
  requests: Array<{ id: string; requestId: string; bloodGroup: string; city: string; unitsRequired: number; urgency: string; status: string; createdAt: string }>;
  helpResponses: Array<{ id: string; requestId: string; status: string; createdAt: string }>;
  notifications: Array<{ id: string; title: string; message: string; read: boolean; createdAt: string; channels?: Array<{ channel: string; status: string }> }>;
  activities: Array<{ id: string; action: string; statusCode: number; createdAt: string; details: { message?: string | null } }>;
  certificateEligible: boolean;
};

export default function DashboardPage() {
  const [account, setAccount] = useState<Account | null>(null);
  const [message, setMessage] = useState('Loading account...');
  const [actionMessage, setActionMessage] = useState('');
  const [notificationFilter, setNotificationFilter] = useState('all');

  useEffect(() => {
    const user = localStorage.getItem('rakta_user');
    if (!user) { window.location.href = '/auth/login'; return; }
    const userId = JSON.parse(user).id;
    apiFetch(`/account/${userId}`)
      .then(async (response) => { const result = await response.json(); if (!response.ok) throw new Error(result?.error?.message || 'Could not load account.'); return result.data; })
      .then((data) => { setAccount(data); setMessage(''); })
      .catch((error) => setMessage(error instanceof Error ? error.message : 'Could not load account.'));
  }, []);

  const logout = () => { localStorage.removeItem('rakta_user'); localStorage.removeItem('rakta_token'); localStorage.removeItem('rakta_refresh_token'); window.location.href = '/auth/login'; };
  const notificationAction = async (path: string, method = 'PATCH') => {
    setActionMessage('Updating notifications...');
    const response = await apiFetch(`/notifications${path}`, { method });
    if (!response.ok) { setActionMessage('Could not update notifications.'); return; }
    const user = JSON.parse(localStorage.getItem('rakta_user') || '{}');
    const refreshed = await apiFetch(`/account/${user.id}`);
    const result = await refreshed.json();
    if (refreshed.ok) setAccount(result.data);
    setActionMessage('Notifications updated.');
  };
  if (!account) return <main className="container-shell py-16"><div className="panel p-8 text-center text-slate-300">{message}</div></main>;
  const visibleNotifications = account.notifications.filter((notification) => notificationFilter === 'all' || (notificationFilter === 'unread' && !notification.read) || (notificationFilter === 'read' && notification.read));

  return (
    <main className="container-shell py-16">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><div className="text-xs uppercase tracking-[0.2em] text-red-300">My RAKTA account</div><h1 className="mt-2 text-4xl font-black uppercase tracking-[-0.05em] text-white">Welcome, {account.user.name}</h1><p className="mt-2 text-slate-400">{account.user.email} · {account.user.phone} · {account.user.city || 'Location not added'}</p><p className="mt-2 text-xs text-slate-500">Registered {new Date(account.user.createdAt).toLocaleDateString()} · Last login {account.user.lastLoginAt ? new Date(account.user.lastLoginAt).toLocaleString() : 'This session'}</p></div><button type="button" className="btn-secondary" onClick={logout}>Log out</button></div>
      <div className="grid gap-5 md:grid-cols-4"><div className="panel p-5"><div className="text-xs uppercase tracking-[0.18em] text-slate-400">My requests</div><div className="mt-3 text-3xl font-black text-white">{account.requests.length}</div></div><div className="panel p-5"><div className="text-xs uppercase tracking-[0.18em] text-slate-400">Donations</div><div className="mt-3 text-3xl font-black text-white">{account.donor?.donationCount || 0}</div></div><div className="panel p-5"><div className="text-xs uppercase tracking-[0.18em] text-slate-400">Help responses</div><div className="mt-3 text-3xl font-black text-white">{account.helpResponses.length}</div></div><div className="panel p-5"><div className="text-xs uppercase tracking-[0.18em] text-slate-400">Notifications</div><div className="mt-3 text-3xl font-black text-white">{account.notifications.filter((item) => !item.read).length}</div></div></div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2"><section className="panel p-6"><h2 className="text-xl font-bold text-white">My blood requests</h2><div className="mt-4 space-y-3">{account.requests.length ? account.requests.map((request) => <div key={request.id} className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300"><div className="flex justify-between"><strong className="text-white">{request.requestId}</strong><span className="text-red-300">{request.status}</span></div><div className="mt-2">{request.bloodGroup} · {request.unitsRequired} unit(s) · {request.city} · {request.urgency}</div></div>) : <p className="text-slate-400">No requests yet.</p>}</div><Link href="/request-blood" className="btn-primary mt-5">Create a request</Link></section><section className="panel p-6"><h2 className="text-xl font-bold text-white">My donor work</h2>{account.donor ? <><div className="mt-4 text-slate-300">{account.donor.bloodGroup} donor in {account.donor.city}</div><div className="mt-2 text-slate-300">Availability: {account.donor.availability}</div><div className="mt-2 text-slate-300">Verification: {account.donor.verificationStatus}</div><div className="mt-2 text-slate-300">Completed donations: {account.donor.donationCount}</div>{account.certificateEligible ? <Link href={`/donate?donorId=${account.donor.id}`} className="btn-secondary mt-5">Get my certificate</Link> : <p className="mt-5 text-sm text-slate-400">Complete three donations to unlock your certificate.</p>}</> : <><p className="mt-4 text-slate-400">You have not created a donor profile yet.</p><Link href="/donate" className="btn-primary mt-5">Become a donor</Link></>}</section></div>
      <section className="panel mt-6 p-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><div className="text-xs uppercase tracking-[0.18em] text-red-300">Inbox</div><h2 className="mt-1 text-xl font-bold text-white">Notifications and matches</h2></div><div className="flex flex-wrap gap-2"><button type="button" className="btn-secondary" onClick={() => notificationAction('/read-all')}>Mark all read</button><button type="button" className="btn-secondary" onClick={() => notificationAction('/read', 'DELETE')}>Delete read</button></div></div><div className="mt-5 flex flex-wrap gap-2">{['all', 'unread', 'read'].map((filter) => <button key={filter} type="button" className={notificationFilter === filter ? 'btn-primary' : 'btn-secondary'} onClick={() => setNotificationFilter(filter)}>{filter === 'all' ? 'All updates' : filter === 'unread' ? 'Unread' : 'Read'}</button>)}</div>{actionMessage ? <p className="mt-3 text-sm text-emerald-200">{actionMessage}</p> : null}<div className="mt-5 space-y-3">{visibleNotifications.length ? visibleNotifications.map((notification) => <div key={notification.id} className={`rounded-xl border border-white/10 bg-white/5 p-4 text-sm ${notification.read ? 'opacity-60' : ''}`}><div className="flex items-start justify-between gap-4"><div><div className="flex flex-wrap items-center gap-2"><div className="font-semibold text-white">{notification.title}</div><span className="rounded-full border border-red-400/30 px-2 py-1 text-[10px] uppercase tracking-wider text-red-200">{notification.read ? 'Read' : 'New'}</span></div><div className="mt-2 text-slate-300">{notification.message}</div><div className="mt-2 text-xs text-slate-500">{notification.channels?.map((channel) => `${channel.channel}: ${channel.status}`).join(' · ') || 'In-app notification'}</div></div><div className="flex shrink-0 flex-wrap gap-2"><button type="button" className="text-xs text-red-200" onClick={() => notificationAction(`/${notification.id}`, 'DELETE')}>Delete</button>{!notification.read ? <button type="button" className="text-xs text-amber-200" onClick={() => notificationAction(`/${notification.id}/read`)}>Mark read</button> : null}</div></div></div>) : <p className="text-slate-400">No notifications in this section.</p>}</div></section>
      <section className="panel mt-6 p-6"><h2 className="text-xl font-bold text-white">My recent activity</h2><div className="mt-4 space-y-2">{account.activities.length ? account.activities.map((activity) => <div key={activity.id} className="flex flex-wrap justify-between gap-3 border-b border-white/10 py-3 text-sm"><span className="text-slate-200">{activity.action}</span><span className="text-slate-400">{activity.details.message || 'Completed'} · {new Date(activity.createdAt).toLocaleString()}</span></div>) : <p className="text-slate-400">Your activity will appear here.</p>}</div></section>
    </main>
  );
}
