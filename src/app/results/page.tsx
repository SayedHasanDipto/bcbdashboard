'use client';
// src/app/results/page.tsx
import { useEffect, useState, useRef } from 'react';
import ProtectedLayout from '@/components/layout/ProtectedLayout';
import { getClasses, getSubjects, getStudents, getMarks } from '@/lib/db';
import { Student, Subject, MarksMap, ExamType, EXAM_LABELS } from '@/types';
import { getGrade, calcGPA } from '@/lib/grading';
import { Card, SectionTitle, GradeBadge, Select, Label, Spinner, Btn, Tabs, EmptyState } from '@/components/ui';
import ResultSheet from '@/components/print/ResultSheet';

export default function ResultsPage() {
  const [classes, setClasses] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [marks, setMarks] = useState<MarksMap>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('class');

  // Class result filters
  const [classFilter, setClassFilter] = useState('');
  const [examFilter, setExamFilter] = useState<ExamType>('annual');

  // Student result filters
  const [stuClass, setStuClass] = useState('');
  const [stuRoll, setStuRoll] = useState('');
  const [stuExam, setStuExam] = useState<ExamType>('annual');
  const [foundStudent, setFoundStudent] = useState<Student | null>(null);
  const [showSheet, setShowSheet] = useState(false);

  const sheetRef = useRef<HTMLDivElement>(null);
  const classResultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const [cls, subs, stus, mrk] = await Promise.all([
        getClasses(), getSubjects(), getStudents(), getMarks(),
      ]);
      setClasses(cls);
      setSubjects(subs);
      setStudents(stus);
      setMarks(mrk);
      setLoading(false);
    })();
  }, []);

  // ── Class result table ──────────────────────────────────────
  const classStudents = students
    .filter(s => s.class === classFilter)
    .sort((a, b) => a.roll - b.roll);

  const classRows = classStudents.map(stu => {
    const subGrades = subjects.map(sub => {
      const key = `${stu.class}_${sub.id}_${examFilter}_${stu.id}`;
      const m = marks[key] || { cq: 0, mcq: 0, practical: 0, classTest: 0 };
      const total = (m.cq || 0) + (m.mcq || 0) + (m.practical || 0) + (m.classTest || 0);
      return getGrade(total, sub.full);
    });
    const totalObtained = subjects.reduce((acc, sub) => {
      const key = `${stu.class}_${sub.id}_${examFilter}_${stu.id}`;
      const m = marks[key] || {};
      return acc + (m.cq || 0) + (m.mcq || 0) + (m.practical || 0) + (m.classTest || 0);
    }, 0);
    const gpa = calcGPA(subGrades);
    return { stu, totalObtained, gpa };
  }).sort((a, b) => parseFloat(b.gpa) - parseFloat(a.gpa));

  // ── Student result lookup ───────────────────────────────────
  const handleFindStudent = () => {
    if (!stuClass || !stuRoll) return;
    const found = students.find(s => s.class === stuClass && s.roll === parseInt(stuRoll));
    setFoundStudent(found || null);
    setShowSheet(!!found);
  };

  // ── Print helpers ───────────────────────────────────────────
  const printSingleSheet = () => {
    if (!sheetRef.current) return;
    const win = window.open('', '_blank')!;
    win.document.write(`<html><head>
      <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&family=Noto+Serif+Bengali:wght@700&display=swap" rel="stylesheet">
      <style>body{margin:0;padding:10mm;font-family:'Hind Siliguri',sans-serif} @page{margin:10mm;size:A4}</style>
    </head><body>${sheetRef.current.innerHTML}</body></html>`);
    win.document.close();
    setTimeout(() => { win.print(); }, 600);
  };

  const printClassTable = () => {
    if (!classResultRef.current) return;
    const win = window.open('', '_blank')!;
    win.document.write(`<html><head>
      <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&family=Noto+Serif+Bengali:wght@700&display=swap" rel="stylesheet">
      <style>
        body{margin:0;padding:10mm;font-family:'Hind Siliguri',sans-serif}
        table{width:100%;border-collapse:collapse;font-size:11px}
        th{background:#0f4527;color:white;padding:5px 7px;text-align:center;border:1px solid #0f4527}
        td{padding:4px 7px;border:1px solid #ccc;text-align:center}
        h2{font-family:'Noto Serif Bengali',serif;color:#0f4527;margin-bottom:8px}
        @page{margin:10mm;size:A4 landscape}
      </style>
    </head><body>
      <h2>শ্রেণি ${classFilter} — ${EXAM_LABELS[examFilter]} — সামগ্রিক ফলাফল</h2>
      ${classResultRef.current.innerHTML}
    </body></html>`);
    win.document.close();
    setTimeout(() => { win.print(); }, 600);
  };

  if (loading) return <ProtectedLayout><Spinner /></ProtectedLayout>;

  return (
    <ProtectedLayout>
      <SectionTitle>📋 ফলাফল দেখুন</SectionTitle>

      <Tabs
        tabs={[
          { id: 'class', label: '📚 ক্লাসভিত্তিক ফলাফল' },
          { id: 'student', label: '👤 শিক্ষার্থীর ফলাফল' },
        ]}
        active={activeTab}
        onChange={setActiveTab}
      />

      {/* ── CLASS RESULT ── */}
      {activeTab === 'class' && (
        <Card>
          <div className="flex flex-wrap gap-4 mb-5 items-end">
            <div>
              <Label>ক্লাস নির্বাচন</Label>
              <Select value={classFilter} onChange={e => setClassFilter(e.target.value)}>
                <option value="">-- ক্লাস --</option>
                {classes.map(c => <option key={c} value={c}>{c}</option>)}
              </Select>
            </div>
            <div>
              <Label>পরীক্ষার ধরণ</Label>
              <Select value={examFilter} onChange={e => setExamFilter(e.target.value as ExamType)}>
                {Object.entries(EXAM_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </Select>
            </div>
            {classFilter && (
              <Btn variant="gold" size="sm" onClick={printClassTable}>🖨️ প্রিন্ট</Btn>
            )}
          </div>

          {!classFilter ? (
            <EmptyState icon="📚" text="ক্লাস নির্বাচন করুন" />
          ) : classRows.length === 0 ? (
            <EmptyState icon="📭" text="এই ক্লাসে কোনো শিক্ষার্থী নেই" />
          ) : (
            <div ref={classResultRef} className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    {['মেধা স্থান', 'রোল', 'নাম', ...subjects.map(s => s.name), 'মোট নম্বর', 'GPA', 'ফলাফল'].map((h, i) => (
                      <th
                        key={i}
                        className="py-2.5 px-2 text-white text-xs font-semibold whitespace-nowrap"
                        style={{ background: '#0f4527' }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {classRows.map(({ stu, totalObtained, gpa }, rank) => (
                    <tr key={stu.id} className="border-b border-gray-50 hover:bg-green-50 transition-colors">
                      <td className="py-2 px-2 text-center font-bold text-green-800">{rank + 1}</td>
                      <td className="py-2 px-2 text-center">{stu.roll}</td>
                      <td className="py-2 px-2 text-left font-medium whitespace-nowrap">{stu.name}</td>
                      {subjects.map(sub => {
                        const key = `${stu.class}_${sub.id}_${examFilter}_${stu.id}`;
                        const m = marks[key] || {};
                        const total = (m.cq || 0) + (m.mcq || 0) + (m.practical || 0) + (m.classTest || 0);
                        const g = total > 0 ? getGrade(total, sub.full) : null;
                        return (
                          <td key={sub.id} className="py-2 px-2 text-center">
                            {total > 0 ? (
                              <div>
                                <div className="font-semibold">{total}</div>
                                {g && <GradeBadge letter={g.letter} />}
                              </div>
                            ) : <span className="text-gray-300">—</span>}
                          </td>
                        );
                      })}
                      <td className="py-2 px-2 text-center font-bold">{totalObtained}</td>
                      <td className="py-2 px-2 text-center font-bold">{gpa}</td>
                      <td className="py-2 px-2 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${parseFloat(gpa) > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {parseFloat(gpa) > 0 ? 'উত্তীর্ণ' : 'অকৃতকার্য'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {/* ── STUDENT RESULT ── */}
      {activeTab === 'student' && (
        <Card>
          <div className="flex flex-wrap gap-4 mb-5 items-end">
            <div>
              <Label>ক্লাস</Label>
              <Select value={stuClass} onChange={e => { setStuClass(e.target.value); setShowSheet(false); }}>
                <option value="">-- ক্লাস --</option>
                {classes.map(c => <option key={c} value={c}>{c}</option>)}
              </Select>
            </div>
            <div>
              <Label>রোল নম্বর</Label>
              <input
                type="number"
                value={stuRoll}
                onChange={e => { setStuRoll(e.target.value); setShowSheet(false); }}
                onKeyDown={e => e.key === 'Enter' && handleFindStudent()}
                placeholder="রোল লিখুন"
                className="input-field"
                style={{ maxWidth: '130px' }}
              />
            </div>
            <div>
              <Label>পরীক্ষার ধরণ</Label>
              <Select value={stuExam} onChange={e => { setStuExam(e.target.value as ExamType); setShowSheet(false); }}>
                {Object.entries(EXAM_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </Select>
            </div>
            <Btn variant="primary" onClick={handleFindStudent}>🔍 খুঁজুন</Btn>
          </div>

          {showSheet && foundStudent ? (
            <>
              <div className="flex gap-3 mb-4 no-print flex-wrap">
                <Btn variant="gold" onClick={printSingleSheet}>🖨️ প্রিন্ট করুন</Btn>
                <Btn variant="secondary" onClick={() => setShowSheet(false)}>✖ বন্ধ করুন</Btn>
              </div>
              <div ref={sheetRef}>
                <ResultSheet
                  student={foundStudent}
                  subjects={subjects}
                  marks={marks}
                  examType={stuExam}
                />
              </div>
            </>
          ) : stuClass && stuRoll && !foundStudent && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
              ❌ এই ক্লাসে রোল {stuRoll} পাওয়া যায়নি।
            </div>
          )}

          {!showSheet && !stuClass && (
            <EmptyState icon="👤" text="ক্লাস ও রোল নম্বর দিন" />
          )}
        </Card>
      )}
    </ProtectedLayout>
  );
}
