'use client';
// src/components/layout/ProtectedLayout.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Header from './Header';
import { Spinner } from '@/components/ui';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      // small delay to let session storage load
      const t = setTimeout(() => {
        if (!sessionStorage.getItem('bcb_user')) router.replace('/');
      }, 100);
      return () => clearTimeout(t);
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner text="অনুগ্রহ করে অপেক্ষা করুন..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#f4f7f0' }}>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
