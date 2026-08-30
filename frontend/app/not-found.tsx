import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <main className="container-shell flex min-h-screen items-center justify-center py-16">
      <div className="panel max-w-lg p-10 text-center">
        <div className="text-xs uppercase tracking-[0.25em] text-red-300">404</div>
        <h1 className="mt-4 text-4xl font-black uppercase tracking-[-0.05em] text-white">Page not found</h1>
        <p className="mt-4 text-slate-300">The page you are looking for does not exist or has moved.</p>
        <Link href="/" className="btn-primary mt-6">Back to home</Link>
      </div>
    </main>
  );
}
