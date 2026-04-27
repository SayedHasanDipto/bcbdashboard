// src/components/print/ResultSheet.tsx
import { Student, Subject, MarksMap, ExamType, EXAM_LABELS } from '@/types';
import { getGrade, calcGPA, gradeColorInline } from '@/lib/grading';
import Image from 'next/image';
import logo from '../../logo.png';

interface Props {
  student: Student;
  subjects: Subject[];
  marks: MarksMap;
  examType: ExamType;
  id?: string;
}

const GRADE_TABLE = [
  { range: '৮০-১০০', letter: 'A+', point: '৫.০০' },
  { range: '৭০-৭৯', letter: 'A', point: '৪.০০' },
  { range: '৬০-৬৯', letter: 'A-', point: '৩.৫০' },
  { range: '৫০-৫৯', letter: 'B', point: '৩.০০' },
  { range: '৪০-৪৯', letter: 'C', point: '২.০০' },
  { range: '৩৩-৩৯', letter: 'D', point: '১.০০' },
  { range: '০-৩২', letter: 'F', point: '০.০০' },
];

export default function ResultSheet({ student, subjects, marks, examType, id }: Props) {
  const rows = subjects.map(sub => {
    const key = `${student.class}_${sub.id}_${examType}_${student.id}`;
    const m = marks[key] || { cq: 0, mcq: 0, practical: 0, classTest: 0 };
    const total = (m.cq || 0) + (m.mcq || 0) + (m.practical || 0) + (m.classTest || 0);
    const g = getGrade(total, sub.full);
    return { sub, m, total, g };
  });

  const totalObtained = rows.reduce((a, r) => a + r.total, 0);
  const totalFull = rows.reduce((a, r) => a + r.sub.full, 0);
  const gpa = calcGPA(rows.map(r => r.g));
  const today = new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div
      id={id}
      style={{
        background: 'white',
        width: '100%',
        maxWidth: '720px',
        padding: '20px 24px',
        fontFamily: 'Hind Siliguri, sans-serif',
        fontSize: '12px',
        color: '#1f2937',
        margin: '0 auto',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '2px solid #0f4527', marginBottom: '12px' }}>
        <div style={{ width: 56, height: 56, background: '#0f4527', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '24px' }}>
          <Image
            src={logo}
            alt="BCB Ideal School Logo"
            width={80}
            height={80}
            className="object-contain"
          />
        </div>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#0f4527', fontFamily: 'Noto Serif Bengali, serif' }}>
            বি.সি.বি আইডিয়াল স্কুল
          </div>
          <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>
            বকশীগঞ্জ পশ্চিমপাড়া, মেরুরচর রোড, জামালপুর
          </div>
        </div>
        {/* Grade table */}
        <table style={{ fontSize: '9px', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['নম্বর', 'গ্রেড', 'GPA'].map(h => (
                <th key={h} style={{ border: '1px solid #d1d5db', padding: '2px 5px', background: '#e5e7eb' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {GRADE_TABLE.map(g => (
              <tr key={g.letter}>
                <td style={{ border: '1px solid #d1d5db', padding: '1px 5px', textAlign: 'center' }}>{g.range}</td>
                <td style={{ border: '1px solid #d1d5db', padding: '1px 5px', textAlign: 'center', fontWeight: 700 }}>{g.letter}</td>
                <td style={{ border: '1px solid #d1d5db', padding: '1px 5px', textAlign: 'center' }}>{g.point}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Exam title */}
      <div style={{ textAlign: 'center', fontWeight: 700, fontSize: '14px', color: '#0f4527', margin: '8px 0', fontFamily: 'Noto Serif Bengali, serif' }}>
        {EXAM_LABELS[examType]} — ফলাফল বিবরণী
      </div>

      {/* Student info */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', margin: '10px 0' }}>
        {[
          { label: 'শিক্ষার্থীর নাম', value: student.name },
          { label: 'শ্রেণি', value: student.class },
          { label: 'রোল নম্বর', value: student.roll },
        ].map(info => (
          <div key={info.label} style={{ border: '1.5px solid #0f4527', padding: '6px 10px', borderRadius: '4px' }}>
            <div style={{ fontSize: '10px', color: '#6b7280' }}>{info.label}</div>
            <div style={{ fontWeight: 700, fontSize: '14px', color: '#0f4527' }}>{info.value}</div>
          </div>
        ))}
      </div>

      {/* Marks table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', marginTop: '8px' }}>
        <thead>
          <tr>
            {['বিষয়', 'MCQ', 'CQ', 'ব্যবহারিক', 'শ্রেণি কার্য', 'মোট', 'পূর্ণ', 'গ্রেড', 'GPA'].map(h => (
              <th key={h} style={{ background: '#0f4527', color: 'white', padding: '6px 8px', textAlign: 'center', border: '1px solid #0f4527', fontSize: '11px' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(({ sub, m, total, g }, i) => {
            const gc = gradeColorInline(g.letter);
            return (
              <tr key={sub.id} style={{ background: i % 2 === 0 ? 'white' : '#f9fafb' }}>
                <td style={{ padding: '5px 8px', border: '1px solid #d1d5db', textAlign: 'left' }}>{sub.name}</td>
                <td style={{ padding: '5px 8px', border: '1px solid #d1d5db', textAlign: 'center' }}>{m.mcq || '-'}</td>
                <td style={{ padding: '5px 8px', border: '1px solid #d1d5db', textAlign: 'center' }}>{m.cq || '-'}</td>
                <td style={{ padding: '5px 8px', border: '1px solid #d1d5db', textAlign: 'center' }}>{m.practical || '-'}</td>
                <td style={{ padding: '5px 8px', border: '1px solid #d1d5db', textAlign: 'center' }}>{m.classTest || '-'}</td>
                <td style={{ padding: '5px 8px', border: '1px solid #d1d5db', textAlign: 'center', fontWeight: 700 }}>{total}</td>
                <td style={{ padding: '5px 8px', border: '1px solid #d1d5db', textAlign: 'center' }}>{sub.full}</td>
                <td style={{ padding: '5px 8px', border: '1px solid #d1d5db', textAlign: 'center' }}>
                  <span style={{ background: gc.bg, color: gc.color, padding: '1px 8px', borderRadius: '12px', fontWeight: 700, fontSize: '11px' }}>
                    {g.letter}
                  </span>
                </td>
                <td style={{ padding: '5px 8px', border: '1px solid #d1d5db', textAlign: 'center' }}>{g.point.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr style={{ background: '#f0fdf4' }}>
            <td colSpan={5} style={{ padding: '6px 8px', border: '1px solid #d1d5db', fontWeight: 700, textAlign: 'right' }}>সর্বমোট:</td>
            <td style={{ padding: '6px 8px', border: '1px solid #d1d5db', textAlign: 'center', fontWeight: 700 }}>{totalObtained}</td>
            <td style={{ padding: '6px 8px', border: '1px solid #d1d5db', textAlign: 'center', fontWeight: 700 }}>{totalFull}</td>
            <td colSpan={2} style={{ padding: '6px 8px', border: '1px solid #d1d5db', textAlign: 'center', fontWeight: 700 }}>GPA: {gpa}</td>
          </tr>
        </tfoot>
      </table>

      {/* Remarks */}
      <div style={{ marginTop: '10px', display: 'grid', gap: '6px' }}>
        {[{ label: 'মেধা স্থান:' }, { label: 'মন্তব্য:' }].map(r => (
          <div key={r.label} style={{ border: '1.5px solid #0f4527', padding: '5px 10px', borderRadius: '4px', minHeight: '28px' }}>
            <span style={{ fontSize: '10px', color: '#6b7280' }}>{r.label}</span>
          </div>
        ))}
      </div>

      {/* Signatures */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '60px', fontSize: '11px' }}>        {['শ্রেণি শিক্ষকের স্বাক্ষর ও তারিখ', 'প্রধান শিক্ষকের স্বাক্ষর ও তারিখ'].map(s => (
        <div key={s} style={{ textAlign: 'center' }}>
          <div style={{ width: '140px', borderTop: '1px solid #1f2937', margin: '0 auto 4px' }} />
          {s}
        </div>
      ))}
      </div>
    </div>
  );
}
