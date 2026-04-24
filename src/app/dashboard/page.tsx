'use client';
// src/app/dashboard/page.tsx
import { useEffect, useState } from 'react';
import ProtectedLayout from '@/components/layout/ProtectedLayout';
import { useAuth } from '@/lib/auth-context';
import { getStudents, getSubjects, getClasses, getTeachers, getMarks } from '@/lib/db';
import { getGrade, gradeColor } from '@/lib/grading';
import { Student, Subject, MarksMap } from '@/types';
import { Card, SectionTitle, GradeBadge, Spinner } from '@/components/ui';

interface StatCardProps {
  icon: string;
  label: string;
  value: number | string;
  color: string;
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  return (
    <div
      className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4 card-hover animate-fade-in"
      style={{ borderLeft: `4px solid ${color}` }}
    >
      <div className="text-4xl">{icon}</div>
      <div>
        <div className="text-sm text-gray-500">{label}</div>
        <div className="text-3xl font-bold" style={{ color: '#0f4527' }}>{value}</div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ students: 0, classes: 0, subjects: 0, marks: 0, teachers: 0 });
  const [recent, setRecent] = useState<Array<{ stu: Student; sub: Subject; total: number; grade: string }>>([]);

  useEffect(() => {
    (async () => {
      try {
        const [students, classes, subjects, teachers, marks] = await Promise.all([
          getStudents(), getClasses(), getSubjects(), getTeachers(), getMarks(),
        ]);
        setStats({
          students: students.length,
          classes: classes.length,
          subjects: subjects.length,
          marks: Object.keys(marks).length,
          teachers: teachers.filter(t => !t.isAdmin).length,
        });

        // Recent 8 entries
        const entries = Object.entries(marks).slice(-8).reverse();
        const recentData = entries.flatMap(([key, m]) => {
          const parts = key.split('_');
          const stu = students.find(s => s.id === parts[3]);
          const sub = subjects.find(s => s.id === parts[1]);
          if (!stu || !sub) return [];
          const total = (m.cq || 0) + (m.mcq || 0) + (m.practical || 0) + (m.classTest || 0);
          const g = getGrade(total, sub.full);
          return [{ stu, sub, total, grade: g.letter }];
        });
        setRecent(recentData);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <ProtectedLayout>
      <SectionTitle>📊 ড্যাশবোর্ড</SectionTitle>

      {loading ? (
        <Spinner />
      ) : (
        <>
          {/* Welcome banner */}
          <div
            className="rounded-2xl p-5 mb-6 text-white flex items-center gap-4 animate-fade-in"
            style={{ background: 'linear-gradient(135deg, #0f4527, #1a6b3c)' }}
          >
            <div className="text-4xl">👋</div>
            <div>
              <div className="font-bold text-lg" style={{ fontFamily: 'Noto Serif Bengali, serif' }}>
                স্বাগতম, {user?.name}!
              </div>
              <div className="text-sm opacity-80">
                {user?.isAdmin ? 'আপনি অ্যাডমিন হিসেবে লগইন করেছেন।' : `আপনার বিষয়: ${user?.subjects.length} টি`}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            <StatCard icon="👨‍🎓" label="মোট শিক্ষার্থী" value={stats.students} color="#1a6b3c" />
            <StatCard icon="📚" label="মোট ক্লাস" value={stats.classes} color="#c9a227" />
            <StatCard icon="📖" label="মোট বিষয়" value={stats.subjects} color="#8b5cf6" />
            <StatCard icon="👩‍🏫" label="শিক্ষক" value={stats.teachers} color="#3b82f6" />
            <StatCard icon="✏️" label="নম্বর এন্ট্রি" value={stats.marks} color="#ef4444" />
          </div>

          {/* Recent activity */}
          <Card>
            <div className="font-bold text-base mb-4" style={{ color: '#0f4527' }}>
              📌 সাম্প্রতিক নম্বর এন্ট্রি
            </div>
            {recent.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <div className="text-5xl mb-3">📭</div>
                <p>এখনো কোনো নম্বর দেওয়া হয়নি</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      {['শিক্ষার্থী', 'রোল', 'ক্লাস', 'বিষয়', 'মোট', 'গ্রেড'].map(h => (
                        <th
                          key={h}
                          className="text-left py-2.5 px-3 text-white text-xs font-semibold"
                          style={{ background: '#0f4527' }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map((r, i) => (
                      <tr key={i} className="border-b border-gray-50 hover:bg-green-50 transition-colors">
                        <td className="py-2.5 px-3 font-medium">{r.stu.name}</td>
                        <td className="py-2.5 px-3 text-gray-600">{r.stu.roll}</td>
                        <td className="py-2.5 px-3 text-gray-600">{r.stu.class}</td>
                        <td className="py-2.5 px-3 text-gray-600">{r.sub.name}</td>
                        <td className="py-2.5 px-3">{r.total}/{r.sub.full}</td>
                        <td className="py-2.5 px-3">
                          <GradeBadge letter={r.grade} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </>
      )}
    </ProtectedLayout>
  );
}
