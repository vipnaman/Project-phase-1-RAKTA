const steps = [
  { title: 'Register', description: 'Create an account and set up your donor or requester profile.' },
  { title: 'Find / Request', description: 'Search nearby donors or initiate an urgent blood request.' },
  { title: 'Connect', description: 'Use the platform to send and receive help requests in a secure flow.' },
  { title: 'Help', description: 'Coordinate with hospitals, donors, and community responders safely.' },
];

export default function HowItWorksPage() {
  return (
    <main className="container-shell py-16">
      <div className="mb-8 text-center">
        <div className="text-xs uppercase tracking-[0.2em] text-red-300">How it works</div>
        <h1 className="mt-2 text-4xl font-black uppercase tracking-[-0.05em] text-white">Four steps toward urgent help</h1>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {steps.map((step, index) => (
          <div key={step.title} className="panel p-6">
            <div className="text-xs uppercase tracking-[0.2em] text-red-200">Step {index + 1}</div>
            <div className="mt-4 text-2xl font-black text-white">{step.title}</div>
            <p className="mt-3 text-slate-300">{step.description}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
