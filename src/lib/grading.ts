// src/lib/grading.ts
import { GradeResult } from '@/types';

export function getGrade(marks: number, full: number): GradeResult {
  const pct = (marks / full) * 100;
  if (pct >= 80) return { letter: 'A+', point: 5.0 };
  if (pct >= 70) return { letter: 'A', point: 4.0 };
  if (pct >= 60) return { letter: 'A-', point: 3.5 };
  if (pct >= 50) return { letter: 'B', point: 3.0 };
  if (pct >= 40) return { letter: 'C', point: 2.0 };
  if (pct >= 33) return { letter: 'D', point: 1.0 };
  return { letter: 'F', point: 0.0 };
}

export function calcGPA(grades: GradeResult[]): string {
  if (!grades.length) return '0.00';
  if (grades.some(g => g.letter === 'F')) return '0.00';
  const sum = grades.reduce((a, g) => a + g.point, 0);
  return (sum / grades.length).toFixed(2);
}

export function gradeColor(letter: string): string {
  const map: Record<string, string> = {
    'A+': 'bg-emerald-100 text-emerald-800',
    'A': 'bg-blue-100 text-blue-800',
    'A-': 'bg-indigo-100 text-indigo-800',
    'B': 'bg-amber-100 text-amber-800',
    'C': 'bg-orange-100 text-orange-800',
    'D': 'bg-rose-100 text-rose-800',
    'F': 'bg-red-100 text-red-900',
  };
  return map[letter] ?? 'bg-gray-100 text-gray-700';
}

export function gradeColorInline(letter: string): { bg: string; color: string } {
  const map: Record<string, { bg: string; color: string }> = {
    'A+': { bg: '#d1fae5', color: '#065f46' },
    'A': { bg: '#dbeafe', color: '#1e40af' },
    'A-': { bg: '#e0e7ff', color: '#3730a3' },
    'B': { bg: '#fef3c7', color: '#92400e' },
    'C': { bg: '#fed7aa', color: '#9a3412' },
    'D': { bg: '#ffe4e6', color: '#9f1239' },
    'F': { bg: '#fee2e2', color: '#7f1d1d' },
  };
  return map[letter] ?? { bg: '#f3f4f6', color: '#374151' };
}
