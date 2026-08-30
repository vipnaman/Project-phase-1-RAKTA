const requests = [
  { bloodGroup: 'O+', city: 'Lucknow', hospital: 'King George Medical University', units: 2, requiredBy: 'Today, 8:00 PM', urgency: 'CRITICAL' },
  { bloodGroup: 'AB-', city: 'Kanpur', hospital: 'Regency Hospital', units: 3, requiredBy: 'Tomorrow, 11:00 AM', urgency: 'URGENT' },
  { bloodGroup: 'B+', city: 'Varanasi', hospital: 'Heritage Hospital', units: 4, requiredBy: 'Tonight, 9:30 PM', urgency: 'CRITICAL' },
];

export default function EmergencyPage() {
  return (
    <main className="container-shell py-16">
      <div className="mb-8 text-center">
        <div className="text-xs uppercase tracking-[0.2em] text-red-300">Emergency Blood Requests</div>
        <h1 className="mt-2 text-4xl font-black uppercase tracking-[-0.05em] text-white">Urgent community support</h1>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {requests.map((request) => (
          <div key={`${request.city}-${request.bloodGroup}`} className="panel p-6">
            <div className="flex items-center justify-between">
              <span className="rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-red-200">{request.urgency}</span>
              <span className="text-sm text-slate-300">{request.bloodGroup}</span>
            </div>
            <div className="mt-5 space-y-3 text-sm text-slate-200">
              <div className="flex justify-between"><span>City</span><strong>{request.city}</strong></div>
              <div className="flex justify-between"><span>Hospital</span><strong>{request.hospital}</strong></div>
              <div className="flex justify-between"><span>Units Needed</span><strong>{request.units}</strong></div>
              <div className="flex justify-between"><span>Required By</span><strong>{request.requiredBy}</strong></div>
            </div>
            <button className="btn-primary mt-6 w-full">Help this request</button>
          </div>
        ))}
      </div>
    </main>
  );
}
