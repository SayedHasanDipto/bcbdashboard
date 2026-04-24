'use client';
// src/components/layout/Header.tsx
import { useAuth } from '@/lib/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import clsx from 'clsx';

const navItems = [
  { href: '/dashboard', label: '📊 ড্যাশবোর্ড', adminOnly: false },
  { href: '/enter-marks', label: '✏️ নম্বর দিন', adminOnly: false },
  { href: '/results', label: '📋 ফলাফল', adminOnly: false },
  { href: '/admin', label: '⚙️ অ্যাডমিন', adminOnly: true },
];

export default function Header() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!user) return null;

  return (
    <header className="sticky top-0 z-50 shadow-lg no-print">
      <div
        style={{
          background: 'linear-gradient(135deg, #0f4527 0%, #1a6b3c 60%, #2d9659 100%)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0 shadow-md"
              style={{ background: '#c9a227' }}
            >
              🏫
            </div>
            <div className="text-white">
              <h1
                className="text-lg font-bold leading-tight"
                style={{ fontFamily: 'Noto Serif Bengali, serif' }}
              >
                বি.সি.বি আইডিয়াল স্কুল
              </h1>
              <p className="text-xs opacity-80">বকশীগঞ্জ পশ্চিমপাড়া, মেরুরচর রোড, জামালপুর</p>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex items-center gap-2 flex-wrap">
            <span
              className="px-3 py-1 rounded-full text-xs font-bold mr-1"
              style={{ background: '#c9a227', color: '#0f4527' }}
            >
              👤 {user.name.split(' ')[0]}
            </span>

            {navItems.map(item => {
              if (item.adminOnly && !user.isAdmin) return null;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-all border whitespace-nowrap',
                    isActive
                      ? 'bg-white/25 border-yellow-300 text-yellow-200'
                      : 'bg-white/10 border-white/25 text-white hover:bg-white/20 hover:border-white/50'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-white border transition-all whitespace-nowrap"
              style={{
                background: 'rgba(220,38,38,0.3)',
                borderColor: 'rgba(220,38,38,0.5)',
              }}
              onMouseEnter={e => ((e.target as HTMLElement).style.background = 'rgba(220,38,38,0.5)')}
              onMouseLeave={e => ((e.target as HTMLElement).style.background = 'rgba(220,38,38,0.3)')}
            >
              🚪 লগআউট
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
