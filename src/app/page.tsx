'use client';
// src/app/page.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { getTeachers, initializeFirebaseData } from '@/lib/db';
import { Teacher } from '@/types';
import toast from 'react-hot-toast';
import Image from 'next/image';
import logo from '../logo.png';

export default function LoginPage() {
  const { user, login } = useAuth();
  const router = useRouter();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) { router.replace('/dashboard'); return; }
    (async () => {
      try {
        await initializeFirebaseData();
        const t = await getTeachers();
        setTeachers(t);
      } catch (e) {
        toast.error('Firebase সংযোগে সমস্যা। .env.local চেক করুন।');
      } finally {
        setLoading(false);
      }
    })();
  }, [user, router]);

  const handleLogin = async () => {
    if (!selectedId) { toast.error('শিক্ষক নির্বাচন করুন'); return; }
    if (!password) { toast.error('পাসওয়ার্ড দিন'); return; }
    setSubmitting(true);
    const teacher = teachers.find(t => t.id === selectedId && t.pass === password);
    if (!teacher) {
      toast.error('❌ ভুল পাসওয়ার্ড! আবার চেষ্টা করুন।');
      setSubmitting(false);
      return;
    }
    login(teacher);
    toast.success(`স্বাগতম, ${teacher.name.split(' ')[0]}!`);
    router.push('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0f4527 0%, #1a6b3c 60%, #2d9659 100%)' }}>
        <div className="text-white text-center">
          <div className="w-12 h-12 rounded-full border-4 border-white/30 border-t-white animate-spin mx-auto mb-4" />
          <p className="text-lg">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: 'linear-gradient(135deg, #0f4527 0%, #1a6b3c 60%, #2d9659 100%)' }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px),
              radial-gradient(circle at 80% 20%, white 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative w-full max-w-md animate-fade-in">
        {/* Header card */}
        <div className="text-center mb-6">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 shadow-2xl"
            style={{ background: '#c9a227' }}
          >
            <Image
              src={logo}
              alt="BCB Ideal School Logo"
              width={80}
              height={80}
              className="object-contain"
              style={{ borderRadius: '50%' }}
            />
          </div>
          <h1
            className="text-2xl font-bold text-white mb-1"
            style={{ fontFamily: 'Noto Serif Bengali, serif' }}
          >
            বি.সি.বি আইডিয়াল স্কুল
          </h1>
          <p className="text-white/70 text-sm">বকশীগঞ্জ পশ্চিমপাড়া, মেরুরচর রোড, জামালপুর</p>
        </div>

        {/* Login form */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl" style={{ borderTop: '5px solid #c9a227' }}>
          <h2
            className="text-xl font-bold text-center mb-2"
            style={{ color: '#0f4527', fontFamily: 'Noto Serif Bengali, serif' }}
          >
            ফলাফল ব্যবস্থাপনা সিস্টেম
          </h2>
          <p className="text-gray-500 text-sm text-center mb-7">আপনার শিক্ষক অ্যাকাউন্টে লগইন করুন</p>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">শিক্ষক নির্বাচন করুন</label>
              <select
                value={selectedId}
                onChange={e => setSelectedId(e.target.value)}
                className="input-field"
              >
                <option value="">-- শিক্ষক নির্বাচন করুন --</option>
                {teachers.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">পাসওয়ার্ড</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                placeholder="পাসওয়ার্ড লিখুন"
                className="input-field"
              />
            </div>

            <button
              onClick={handleLogin}
              disabled={submitting}
              className="w-full py-3.5 rounded-xl text-white font-bold text-base transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60"
              style={{
                background: 'linear-gradient(135deg, #1a6b3c, #2d9659)',
                boxShadow: '0 4px 14px rgba(26,107,60,0.35)',
              }}
            >
              {submitting ? '...' : '🔐 লগইন করুন'}
            </button>
          </div>

          <p className="text-center mt-5 text-xs text-gray-600 font-semibold">
            <a href="https://www.facebook.com/SayedHasanDipto25" target='_blank'>Made by SayedHasanDipto</a>
          </p>
        </div>
      </div>
    </div>
  );
}
