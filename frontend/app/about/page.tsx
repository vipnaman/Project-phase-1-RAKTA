export default function AboutPage() {
  return (
    <main className="container-shell py-16">
      <div className="mx-auto max-w-4xl">
        <div className="text-xs uppercase tracking-[0.2em] text-red-300">About RAKTA</div>
        <h1 className="mt-2 text-4xl font-black uppercase tracking-[-0.05em] text-white">A secure, community-powered blood network</h1>
        <div className="mt-8 space-y-5 text-lg text-slate-300">
          <p>RAKTA connects people who need blood with verified donors in a privacy-first, humanitarian way. We simplify discovery without exposing sensitive personal information publicly.</p>
          <p>We connect people who need blood with potential donors. We do not replace hospitals, blood banks, or medical professionals. Every medical decision must be verified by trained clinicians and blood banks.</p>
        </div>
      </div>
    </main>
  );
}
