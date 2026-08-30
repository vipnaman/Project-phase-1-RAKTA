export default function ContactPage() {
  return (
    <main className="container-shell py-16">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <div className="text-xs uppercase tracking-[0.2em] text-red-300">Contact</div>
          <h1 className="mt-2 text-4xl font-black uppercase tracking-[-0.05em] text-white">Talk to the RAKTA team</h1>
        </div>
        <div className="panel p-8">
          <form className="space-y-5">
            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-400">Name</label>
              <input className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white" />
            </div>
            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-400">Email</label>
              <input type="email" className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white" />
            </div>
            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-400">Message</label>
              <textarea rows={5} className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white" />
            </div>
            <button className="btn-primary">Send message</button>
          </form>
        </div>
      </div>
    </main>
  );
}
