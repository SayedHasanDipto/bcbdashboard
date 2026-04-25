'use client';
// src/components/layout/Footer.tsx

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="no-print mt-auto" style={{ background: 'linear-gradient(135deg, #0f4527 0%, #1a6b3c 100%)' }}>
      {/* Top divider line */}
      <div style={{ height: '3px', background: 'linear-gradient(90deg, #c9a227, #f0c84a, #c9a227)' }} />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* School info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: '#c9a227' }}
              >
                🏫
              </div>
              <div>
                <h3
                  className="font-bold text-white text-base leading-tight"
                  style={{ fontFamily: 'Noto Serif Bengali, serif' }}
                >
                  বি.সি.বি আইডিয়াল স্কুল
                </h3>
                <p className="text-white/60 text-xs">ফলাফল ব্যবস্থাপনা সিস্টেম</p>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              📍 বকশীগঞ্জ পশ্চিমপাড়া,<br />
              মেরুরচর রোড, জামালপুর
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4
              className="font-bold text-white mb-4 pb-2 text-sm"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.15)' }}
            >
              🔗 দ্রুত লিঙ্ক
            </h4>
            <ul className="space-y-2 text-sm max-sm:grid max-sm:grid-cols-2 max-sm:items-center max-sm:justify-center">
              {[
                { href: '/dashboard', label: '📊 ড্যাশবোর্ড' },
                { href: '/enter-marks', label: '✏️ নম্বর প্রদান' },
                { href: '/results', label: '📋 ফলাফল দেখুন' },
                { href: '/admin', label: '⚙️ অ্যাডমিন প্যানেল' },
              ].map(item => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-white/70 hover:text-yellow-300 transition-colors duration-200"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Grade scale */}
          <div>
            <h4
              className="font-bold text-white mb-4 pb-2 text-sm"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.15)' }}
            >
              📊 গ্রেড স্কেল
            </h4>
            <div className="grid grid-cols-2 gap-1 text-xs">
              {[
                { range: '৮০–১০০', letter: 'A+', point: '৫.০০', bg: '#d1fae5', color: '#065f46' },
                { range: '৭০–৭৯', letter: 'A', point: '৪.০০', bg: '#dbeafe', color: '#1e40af' },
                { range: '৬০–৬৯', letter: 'A-', point: '৩.৫০', bg: '#e0e7ff', color: '#3730a3' },
                { range: '৫০–৫৯', letter: 'B', point: '৩.০০', bg: '#fef3c7', color: '#92400e' },
                { range: '৪০–৪৯', letter: 'C', point: '২.০০', bg: '#fed7aa', color: '#9a3412' },
                { range: '৩৩–৩৯', letter: 'D', point: '১.০০', bg: '#ffe4e6', color: '#9f1239' },
                { range: '০–৩২', letter: 'F', point: '০.০০', bg: '#fee2e2', color: '#7f1d1d' },
              ].map(g => (
                <div
                  key={g.letter}
                  className="flex items-center gap-1.5 p-1 rounded"
                  style={{ background: 'rgba(255,255,255,0.07)' }}
                >
                  <span
                    className="px-1.5 py-0.5 rounded font-bold text-xs flex-shrink-0"
                    style={{ background: g.bg, color: g.color }}
                  >
                    {g.letter}
                  </span>
                  <span className="text-white/60">{g.range}</span>
                  <span className="text-white/40 ml-auto">{g.point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-8 pt-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs"
          style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}
        >
          <p className="text-white/50">
            © {year} বি.সি.বি আইডিয়াল স্কুল। সর্বস্বত্ব সংরক্ষিত।
          </p>
          <p className="text-white/50">
            <a href="https://www.facebook.com/SayedHasanDipto25" target="_blank">Developed with ❤️ by Sayed Hasan Dipto</a>
          </p>
          <p className="text-white/40">
            Powered by{' '}
            <span className="text-yellow-400/70 font-medium">Firebase</span>
            {' & '}
            <span className="text-white/60 font-medium">Next.js</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
