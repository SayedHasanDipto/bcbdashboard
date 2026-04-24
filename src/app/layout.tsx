import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'বি.সি.বি আইডিয়াল স্কুল - ফলাফল ব্যবস্থাপনা',
  description: 'বি.সি.বি আইডিয়াল স্কুল, বকশীগঞ্জ পশ্চিমপাড়া, মেরুরচর রোড, জামালপুর',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&family=Noto+Serif+Bengali:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                fontFamily: 'Hind Siliguri, sans-serif',
                fontSize: '14px',
              },
              success: { iconTheme: { primary: '#1a6b3c', secondary: 'white' } },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
