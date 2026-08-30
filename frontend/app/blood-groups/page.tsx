const groups = [
  { group: 'A+', description: 'Can receive A+, A-, O+, O-' },
  { group: 'A-', description: 'Can receive A-, O-' },
  { group: 'B+', description: 'Can receive B+, B-, O+, O-' },
  { group: 'B-', description: 'Can receive B-, O-' },
  { group: 'AB+', description: 'Universal recipient' },
  { group: 'AB-', description: 'Can receive A-, B-, AB-, O-' },
  { group: 'O+', description: 'Can receive O+, O-' },
  { group: 'O-', description: 'Universal donor' },
];

export default function BloodGroupsPage() {
  return (
    <main className="container-shell py-16">
      <div className="mb-8 text-center">
        <div className="text-xs uppercase tracking-[0.2em] text-red-300">Blood Group Information</div>
        <h1 className="mt-2 text-4xl font-black uppercase tracking-[-0.05em] text-white">Compatibility overview</h1>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {groups.map((item) => (
          <div key={item.group} className="panel p-6 text-center">
            <div className="text-4xl font-black text-red-400">{item.group}</div>
            <p className="mt-4 text-sm text-slate-300">{item.description}</p>
          </div>
        ))}
      </div>

      <div className="panel mt-8 p-6 text-sm text-slate-200">
        Compatibility information is for general matching awareness only and must be confirmed by the treating hospital, blood bank, or qualified medical professional before transfusion.
      </div>
    </main>
  );
}
