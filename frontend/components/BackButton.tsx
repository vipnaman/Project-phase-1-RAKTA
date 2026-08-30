'use client';

import { ArrowLeft } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === '/') return null;

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push('/');
  };

  return (
    <button type="button" className="back-button" onClick={handleBack} aria-label="Go back to the previous page">
      <ArrowLeft className="h-4 w-4" />
      Back
    </button>
  );
}
