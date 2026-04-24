'use client';
// src/app/enter-marks/page.tsx
import { useEffect, useState, useCallback } from 'react';
import ProtectedLayout from '@/components/layout/ProtectedLayout';
import { useAuth } from '@/lib/auth-context';
import { getClasses, getSubjects, getStudents, getMarks, saveMarksBatch } from '@/lib/db';
import { Student, Subject, MarksMap, MarkEntry, ExamType, EXAM_LABELS } from '@/types';
import { getGrade } from '@/lib/grading';
import { Card, SectionTitle, GradeBadge, Select, Label, Spinner, Btn } from '@/components/ui';
import toast from 'react-hot-toast';

interface LocalMark { cq: string; mcq: string; practical: string; classTest: string; }

export default function EnterMarksPage() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [allMarks, setAllMarks] = useState<MarksMap>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [selClass, setSelClass] = useState('');
  const [selSub, setSelSub] = useState('');
  const [examType, setExamType] = useState<ExamType>('annual');
  const [localMarks, setLocalMarks] = useState<Record<string, LocalMark>>({});

  const filteredSubjects = user?.isAdmin
    ? subjects
    : subjects.filter(s => user?.subjects.includes(s.id));

  const curSubject = subjects.find(s => s.id === selSub);
  const curStudents = students.filter(s => s.class === selClass).sort((a, b) => a.roll - b.roll);

  useEffect(() => {
    (async () => {
      const [cls, subs, stus, marks] = await Promise.all([
        getClasses(), getSubjects(), getStudents(), getMarks(),
      ]);
      setClasses(cls);
      setSubjects(subs);
      setStudents(stus);
      setAllMarks(marks);
      setLoading(false);
    })();
  }, []);

  // Build local marks state when selection changes
  useEffect(() => {
    if (!selClass || !selSub) { setLocalMarks({}); return; }
    const init: Record<string, LocalMark> = {};
    curStudents.forEach(stu => {
      const key = `${selClass}_${selSub}_${examType}_${stu.id}`;
      const m = allMarks[key] || {};
      init[stu.id] = {
        cq: m.cq !== undefined ? String(m.cq) : '',
        mcq: m.mcq !== undefined ? String(m.mcq) : '',
        practical: m.practical !== undefined ? String(m.practical) : '',
        classTest: m.classTest !== undefined ? String(m.classTest) : '',
      };
    });
    setLocalMarks(init);
  }, [selClass, selSub, examType, allMarks]);

  const handleMarkChange = (stuId: string, field: keyof LocalMark, val: string) => {
    setLocalMarks(prev => ({ ...prev, [stuId]: { ...prev[stuId], [field]: val } }));
  };

  const handleSave = async () => {
    if (!selClass || !selSub) return;
    setSaving(true);
    try {
      const entries: Record<string, MarkEntry> = {};
      curStudents.forEach(stu => {
        const lm = localMarks[stu.id] || {};
        const key = `${selClass}_${selSub}_${examType}_${stu.id}`;
        entries[key] = {
          cq: parseFloat(lm.cq) || 0,
          mcq: parseFloat(lm.mcq) || 0,
          practical: parseFloat(lm.practical) || 0,
          classTest: parseFloat(lm.classTest) || 0,
          updatedAt: Date.now(),
          updatedBy: user?.id,
        };
      });
      await saveMarksBatch(entries);
      setAllMarks(prev => ({ ...prev, ...entries }));
      toast.success('✅ নম্বর সফলভাবে সংরক্ষণ হয়েছে!');
    } catch {
      toast.error('সংরক্ষণে সমস্যা হয়েছে');
    } finally {
      setSaving(false);
    }
  };

  const getTotal = (stuId: string) => {
    const lm = localMarks[stuId];
    if (!lm) return 0;
    return (parseFloat(lm.cq) || 0) + (parseFloat(lm.mcq) || 0) +
      (parseFloat(lm.practical) || 0) + (parseFloat(lm.classTest) || 0);
  };

  if (loading) return <ProtectedLayout><Spinner /></ProtectedLayout>;

  return (
    <ProtectedLayout>
      <SectionTitle>✏️ নম্বর প্রদান</SectionTitle>

      <Card className="mb-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label>ক্লাস</Label>
            <Select value={selClass} onChange={e => setSelClass(e.target.value)}>
              <option value="">-- ক্লাস --</option>
              {classes.map(c => <option key={c} value={c}>{c}</option>)}
            </Select>
          </div>
          <div>
            <Label>বিষয়</Label>
            <Select value={selSub} onChange={e => setSelSub(e.target.value)}>
              <option value="">-- বিষয় --</option>
              {filteredSubjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </Select>
          </div>
          <div>
            <Label>পরীক্ষার ধরণ</Label>
            <Select value={examType} onChange={e => setExamType(e.target.value as ExamType)}>
              {Object.entries(EXAM_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </Select>
          </div>
        </div>
      </Card>

      {!selClass || !selSub ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-6xl mb-3">👆</div>
          <p>উপরে ক্লাস ও বিষয় নির্বাচন করুন</p>
        </div>
      ) : !user?.isAdmin && !user?.subjects.includes(selSub) ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
          ❌ আপনি এই বিষয়ে নম্বর দেওয়ার অনুমতি নেই।
        </div>
      ) : curStudents.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-6xl mb-3">👤</div>
          <p>এই ক্লাসে কোনো শিক্ষার্থী নেই</p>
        </div>
      ) : (
        <>
          {/* Subject info bar */}
          <div
            className="rounded-xl p-3 mb-4 flex flex-wrap gap-4 text-sm font-medium text-white"
            style={{ background: 'linear-gradient(135deg, #0f4527, #1a6b3c)' }}
          >
            <span>📖 {curSubject?.name}</span>
            <span>📝 পূর্ণ নম্বর: {curSubject?.full}</span>
            <span>📋 {EXAM_LABELS[examType]}</span>
            <span>👨‍🎓 মোট শিক্ষার্থী: {curStudents.length}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-5">
            {curStudents.map(stu => {
              const lm = localMarks[stu.id] || { cq: '', mcq: '', practical: '', classTest: '' };
              const total = getTotal(stu.id);
              const grade = curSubject && total > 0 ? getGrade(total, curSubject.full) : null;

              return (
                <div
                  key={stu.id}
                  className="bg-white rounded-2xl p-4 shadow-sm border-2 transition-all hover:border-green-300 animate-fade-in"
                  style={{ borderColor: 'transparent' }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-bold text-base" style={{ color: '#0f4527' }}>{stu.name}</div>
                      <div className="text-xs text-gray-500">রোল: {stu.roll} | ক্লাস: {stu.class}</div>
                    </div>
                    <div className="text-right">
                      {grade && <GradeBadge letter={grade.letter} />}
                      <div className="text-xs text-gray-500 mt-0.5">{total}/{curSubject?.full}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {(curSubject?.cq || 0) > 0 && (
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">CQ (/{curSubject?.cq})</label>
                        <input
                          type="number" min="0" max={curSubject?.cq}
                          value={lm.cq}
                          onChange={e => handleMarkChange(stu.id, 'cq', e.target.value)}
                          className="w-full border-2 border-gray-200 rounded-lg px-2 py-1.5 text-center text-sm focus:border-green-500 outline-none transition-colors"
                          placeholder="0"
                        />
                      </div>
                    )}
                    {(curSubject?.mcq || 0) > 0 && (
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">MCQ (/{curSubject?.mcq})</label>
                        <input
                          type="number" min="0" max={curSubject?.mcq}
                          value={lm.mcq}
                          onChange={e => handleMarkChange(stu.id, 'mcq', e.target.value)}
                          className="w-full border-2 border-gray-200 rounded-lg px-2 py-1.5 text-center text-sm focus:border-green-500 outline-none transition-colors"
                          placeholder="0"
                        />
                      </div>
                    )}
                    {(curSubject?.practical || 0) > 0 && (
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">ব্যবহারিক (/{curSubject?.practical})</label>
                        <input
                          type="number" min="0" max={curSubject?.practical}
                          value={lm.practical}
                          onChange={e => handleMarkChange(stu.id, 'practical', e.target.value)}
                          className="w-full border-2 border-gray-200 rounded-lg px-2 py-1.5 text-center text-sm focus:border-green-500 outline-none transition-colors"
                          placeholder="0"
                        />
                      </div>
                    )}
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">শ্রেণি কার্য (/20)</label>
                      <input
                        type="number" min="0" max="20"
                        value={lm.classTest}
                        onChange={e => handleMarkChange(stu.id, 'classTest', e.target.value)}
                        className="w-full border-2 border-gray-200 rounded-lg px-2 py-1.5 text-center text-sm focus:border-green-500 outline-none transition-colors"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="sticky bottom-4 flex justify-center">
            <Btn
              variant="primary"
              size="lg"
              onClick={handleSave}
              disabled={saving}
              className="shadow-2xl px-10"
            >
              {saving ? '⏳ সংরক্ষণ হচ্ছে...' : '💾 সকল নম্বর সংরক্ষণ করুন'}
            </Btn>
          </div>
        </>
      )}
    </ProtectedLayout>
  );
}
