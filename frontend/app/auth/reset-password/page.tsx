export default function ResetPasswordPage() {
  return (
    <main className="container-shell flex min-h-[80vh] items-center justify-center py-16">
      <div className="w-full max-w-md panel p-8">
        <div className="mb-6 text-center">
          <div className="text-xs uppercase tracking-[0.25em] text-red-300">New password</div>
          <h1 className="mt-2 text-3xl font-black uppercase tracking-[-0.05em] text-white">Reset password</h1>
        </div>
        <form className="space-y-5">
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-400">New password</label>
            <input type="password" className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white" />
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-400">Confirm password</label>
            <input type="password" className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white" />
          </div>
          <button className="btn-primary w-full">Update password</button>
        </form>
      </div>
    </main>
  );
}
