'use client';
// src/components/ui/index.tsx
import clsx from 'clsx';
import { ReactNode, SelectHTMLAttributes, InputHTMLAttributes } from 'react';

// ── GradeBadge ────────────────────────────────────────────────
export function GradeBadge({ letter }: { letter: string }) {
  const colorMap: Record<string, string> = {
    'A+': 'background:#d1fae5;color:#065f46',
    'A': 'background:#dbeafe;color:#1e40af',
    'A-': 'background:#e0e7ff;color:#3730a3',
    'B': 'background:#fef3c7;color:#92400e',
    'C': 'background:#fed7aa;color:#9a3412',
    'D': 'background:#ffe4e6;color:#9f1239',
    'F': 'background:#fee2e2;color:#7f1d1d',
  };
  return (
    <span
      className="grade-badge"
      style={{ cssText: colorMap[letter] ?? 'background:#f3f4f6;color:#374151' } as React.CSSProperties}
    >
      {letter}
    </span>
  );
}

// ── Card ─────────────────────────────────────────────────────
export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={clsx(
        'bg-white rounded-2xl shadow-sm border border-gray-100 p-6',
        className
      )}
    >
      {children}
    </div>
  );
}

// ── SectionTitle ─────────────────────────────────────────────
export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2
      className="text-xl font-bold mb-5 pb-3 border-b-2 flex items-center gap-2"
      style={{
        color: '#0f4527',
        borderColor: '#2d9659',
        fontFamily: 'Noto Serif Bengali, serif',
      }}
    >
      {children}
    </h2>
  );
}

// ── Btn ───────────────────────────────────────────────────────
interface BtnProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'gold' | 'red' | 'blue' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  type?: 'button' | 'submit';
  className?: string;
}

export function Btn({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled,
  type = 'button',
  className,
}: BtnProps) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl border-none cursor-pointer transition-all duration-200 font-bangla';
  const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-5 py-2.5 text-sm', lg: 'px-6 py-3 text-base' };

  const variants: Record<string, string> = {
    primary: 'text-white shadow-md hover:-translate-y-0.5 hover:shadow-lg',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    gold: 'text-green-dark shadow-sm hover:-translate-y-0.5',
    red: 'bg-red-600 text-white hover:bg-red-700',
    blue: 'bg-blue-700 text-white hover:bg-blue-800',
    outline: 'bg-transparent border-2 border-current',
  };

  const styles: Record<string, React.CSSProperties> = {
    primary: { background: 'linear-gradient(135deg, #1a6b3c, #2d9659)' },
    gold: { background: 'linear-gradient(135deg, #c9a227, #f0c84a)', color: '#0f4527' },
    secondary: {},
    red: {},
    blue: {},
    outline: {},
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={styles[variant]}
      className={clsx(base, sizes[size], variants[variant], disabled && 'opacity-50 cursor-not-allowed', className)}
    >
      {children}
    </button>
  );
}

// ── Select ────────────────────────────────────────────────────
export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={clsx('input-field', className)}
      {...props}
    />
  );
}

// ── Input ─────────────────────────────────────────────────────
export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={clsx('input-field', className)}
      {...props}
    />
  );
}

// ── Label ────────────────────────────────────────────────────
export function Label({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-semibold text-gray-700 mb-1.5">
      {children}
    </label>
  );
}

// ── FormGroup ────────────────────────────────────────────────
export function FormGroup({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx('mb-4', className)}>{children}</div>;
}

// ── EmptyState ────────────────────────────────────────────────
export function EmptyState({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="text-center py-16 text-gray-400">
      <div className="text-6xl mb-3">{icon}</div>
      <p className="text-base">{text}</p>
    </div>
  );
}

// ── Tabs ─────────────────────────────────────────────────────
export function Tabs({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex gap-2 mb-5 flex-wrap">
      {tabs.map(t => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={clsx(
            'px-4 py-2 rounded-xl text-sm font-semibold transition-all border-2',
            active === t.id
              ? 'text-white border-transparent'
              : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
          )}
          style={
            active === t.id
              ? { background: 'linear-gradient(135deg, #0f4527, #1a6b3c)' }
              : {}
          }
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ── Loading spinner ───────────────────────────────────────────
export function Spinner({ text = 'লোড হচ্ছে...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <div
        className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
        style={{ borderColor: '#1a6b3c', borderTopColor: 'transparent' }}
      />
      <p className="text-sm text-gray-500">{text}</p>
    </div>
  );
}
