export default function ForgotPasswordPage() {
  return (
    <main className="container-shell flex min-h-[80vh] items-center justify-center py-16">
      <div className="w-full max-w-md panel p-8">
        <div className="mb-6 text-center">
          <div className="text-xs uppercase tracking-[0.25em] text-red-300">Reset access</div>
          <h1 className="mt-2 text-3xl font-black uppercase tracking-[-0.05em] text-white">Forgot password</h1>
        </div>
        <form className="space-y-5">
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-400">Email</label>
            <input type="email" className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white" />
          </div>
          <button className="btn-primary w-full">Send reset link</button>
        </form>
      </div>
    </main>
  );
}
