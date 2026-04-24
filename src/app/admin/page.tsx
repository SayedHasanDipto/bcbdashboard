'use client';
// src/app/admin/page.tsx
import { useEffect, useState } from 'react';
import ProtectedLayout from '@/components/layout/ProtectedLayout';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import {
  getStudents, saveStudent, deleteStudent as dbDeleteStudent,
  getTeachers, saveTeacher, deleteTeacher as dbDeleteTeacher,
  getSubjects, saveSubject, deleteSubject as dbDeleteSubject,
  getClasses, saveClasses,
} from '@/lib/db';
import { Student, Teacher, Subject, DEFAULT_SUBJECTS } from '@/types';
import { Card, SectionTitle, Btn, Tabs, Input, Label, Spinner, EmptyState } from '@/components/ui';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('students');
  const [loading, setLoading] = useState(true);

  // Data
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<string[]>([]);

  // Forms
  const [newStu, setNewStu] = useState({ name: '', class: '', roll: '' });
  const [showStuForm, setShowStuForm] = useState(false);
  const [newClass, setNewClass] = useState('');
  const [newSub, setNewSub] = useState({ name: '', full: '', mcq: '', cq: '', practical: '' });
  const [showSubForm, setShowSubForm] = useState(false);
  const [newTeacher, setNewTeacher] = useState({ name: '', pass: '', isAdmin: false });
  const [showTeacherForm, setShowTeacherForm] = useState(false);

  useEffect(() => {
    if (!user?.isAdmin) { router.replace('/dashboard'); return; }
    loadAll();
  }, [user]);

  const loadAll = async () => {
    setLoading(true);
    const [stus, tchs, subs, cls] = await Promise.all([
      getStudents(), getTeachers(), getSubjects(), getClasses(),
    ]);
    setStudents(stus);
    setTeachers(tchs);
    setSubjects(subs);
    setClasses(cls);
    setLoading(false);
  };

  // ── Students ──────────────────────────────────────────────
  const addStudent = async () => {
    if (!newStu.name || !newStu.class || !newStu.roll) { toast.error('সব তথ্য পূরণ করুন'); return; }
    const stu: Student = { id: 's' + Date.now(), name: newStu.name, class: newStu.class, roll: parseInt(newStu.roll) };
    await saveStudent(stu);
    setStudents(prev => [...prev, stu]);
    setNewStu({ name: '', class: '', roll: '' });
    setShowStuForm(false);
    toast.success('শিক্ষার্থী যোগ হয়েছে');
  };

  const removeStudent = async (id: string) => {
    if (!confirm('এই শিক্ষার্থীকে মুছে দিতে চান?')) return;
    await dbDeleteStudent(id);
    setStudents(prev => prev.filter(s => s.id !== id));
    toast.success('মুছে ফেলা হয়েছে');
  };

  // ── Classes ───────────────────────────────────────────────
  const addClass = async () => {
    if (!newClass.trim()) return;
    if (classes.includes(newClass.trim())) { toast.error('এই ক্লাস আগেই আছে'); return; }
    const updated = [...classes, newClass.trim()];
    await saveClasses(updated);
    setClasses(updated);
    setNewClass('');
    toast.success('ক্লাস যোগ হয়েছে');
  };

  const removeClass = async (c: string) => {
    if (!confirm(`"${c}" ক্লাস মুছে দিতে চান?`)) return;
    const updated = classes.filter(x => x !== c);
    await saveClasses(updated);
    setClasses(updated);
    toast.success('মুছে ফেলা হয়েছে');
  };

  // ── Subjects ──────────────────────────────────────────────
  const addSubject = async () => {
    if (!newSub.name || !newSub.full) { toast.error('নাম ও পূর্ণ নম্বর দিন'); return; }
    const sub: Subject = {
      id: 'sub' + Date.now(),
      name: newSub.name,
      full: parseInt(newSub.full),
      mcq: parseInt(newSub.mcq) || 0,
      cq: parseInt(newSub.cq) || 0,
      practical: parseInt(newSub.practical) || 0,
    };
    await saveSubject(sub);
    setSubjects(prev => [...prev, sub]);
    setNewSub({ name: '', full: '', mcq: '', cq: '', practical: '' });
    setShowSubForm(false);
    toast.success('বিষয় যোগ হয়েছে');
  };

  const removeSubject = async (id: string) => {
    if (!confirm('এই বিষয় মুছে দিতে চান?')) return;
    await dbDeleteSubject(id);
    setSubjects(prev => prev.filter(s => s.id !== id));
    toast.success('মুছে ফেলা হয়েছে');
  };

  // ── Teachers ──────────────────────────────────────────────
  const addTeacher = async () => {
    if (!newTeacher.name || !newTeacher.pass) { toast.error('নাম ও পাসওয়ার্ড দিন'); return; }
    const t: Teacher = { id: 't' + Date.now(), name: newTeacher.name, pass: newTeacher.pass, subjects: [], isAdmin: newTeacher.isAdmin };
    await saveTeacher(t);
    setTeachers(prev => [...prev, t]);
    setNewTeacher({ name: '', pass: '', isAdmin: false });
    setShowTeacherForm(false);
    toast.success('শিক্ষক যোগ হয়েছে');
  };

  const removeTeacher = async (id: string) => {
    if (id === 'admin') { toast.error('প্রধান অ্যাডমিন মুছা যাবে না'); return; }
    if (!confirm('এই শিক্ষককে মুছে দিতে চান?')) return;
    await dbDeleteTeacher(id);
    setTeachers(prev => prev.filter(t => t.id !== id));
    toast.success('মুছে ফেলা হয়েছে');
  };

  const sortedStudents = [...students].sort((a, b) => a.class.localeCompare(b.class) || a.roll - b.roll);

  if (loading) return <ProtectedLayout><Spinner /></ProtectedLayout>;

  return (
    <ProtectedLayout>
      <SectionTitle>⚙️ অ্যাডমিন প্যানেল</SectionTitle>

      <Tabs
        tabs={[
          { id: 'students', label: '👨‍🎓 শিক্ষার্থী' },
          { id: 'teachers', label: '👩‍🏫 শিক্ষক' },
          { id: 'subjects', label: '📚 বিষয়' },
          { id: 'classes', label: '🏫 ক্লাস' },
        ]}
        active={activeTab}
        onChange={setActiveTab}
      />

      {/* ── STUDENTS ── */}
      {activeTab === 'students' && (
        <Card>
          <div className="flex justify-between items-center mb-4">
            <strong>শিক্ষার্থীর তালিকা ({students.length} জন)</strong>
            <Btn variant="primary" size="sm" onClick={() => setShowStuForm(!showStuForm)}>+ নতুন শিক্ষার্থী</Btn>
          </div>

          {showStuForm && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
                <div>
                  <Label>নাম</Label>
                  <Input value={newStu.name} onChange={e => setNewStu(p => ({ ...p, name: e.target.value }))} placeholder="শিক্ষার্থীর নাম" />
                </div>
                <div>
                  <Label>ক্লাস</Label>
                  <select className="input-field" value={newStu.class} onChange={e => setNewStu(p => ({ ...p, class: e.target.value }))}>
                    <option value="">-- ক্লাস --</option>
                    {classes.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <Label>রোল</Label>
                  <Input type="number" value={newStu.roll} onChange={e => setNewStu(p => ({ ...p, roll: e.target.value }))} placeholder="রোল নম্বর" />
                </div>
                <Btn variant="primary" size="sm" onClick={addStudent}>সংরক্ষণ</Btn>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  {['রোল', 'নাম', 'ক্লাস', 'মুছুন'].map(h => (
                    <th key={h} className="py-2.5 px-3 text-white text-xs font-semibold text-center" style={{ background: '#0f4527' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedStudents.map(s => (
                  <tr key={s.id} className="border-b border-gray-50 hover:bg-green-50">
                    <td className="py-2 px-3 text-center">{s.roll}</td>
                    <td className="py-2 px-3">{s.name}</td>
                    <td className="py-2 px-3 text-center">{s.class}</td>
                    <td className="py-2 px-3 text-center">
                      <button onClick={() => removeStudent(s.id)} className="text-red-500 hover:text-red-700 text-lg">🗑</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ── TEACHERS ── */}
      {activeTab === 'teachers' && (
        <Card>
          <div className="flex justify-between items-center mb-4">
            <strong>শিক্ষকের তালিকা ({teachers.length} জন)</strong>
            <Btn variant="primary" size="sm" onClick={() => setShowTeacherForm(!showTeacherForm)}>+ নতুন শিক্ষক</Btn>
          </div>

          {showTeacherForm && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                <div>
                  <Label>নাম</Label>
                  <Input value={newTeacher.name} onChange={e => setNewTeacher(p => ({ ...p, name: e.target.value }))} placeholder="শিক্ষকের নাম" />
                </div>
                <div>
                  <Label>পাসওয়ার্ড</Label>
                  <Input value={newTeacher.pass} onChange={e => setNewTeacher(p => ({ ...p, pass: e.target.value }))} placeholder="পাসওয়ার্ড" />
                </div>
                <Btn variant="primary" size="sm" onClick={addTeacher}>সংরক্ষণ</Btn>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  {['নাম', 'বিষয়সমূহ', 'পাসওয়ার্ড', 'ভূমিকা', 'মুছুন'].map(h => (
                    <th key={h} className="py-2.5 px-3 text-white text-xs font-semibold text-center" style={{ background: '#0f4527' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {teachers.map(t => (
                  <tr key={t.id} className="border-b border-gray-50 hover:bg-green-50">
                    <td className="py-2 px-3 font-medium">{t.name}</td>
                    <td className="py-2 px-3 text-left text-xs text-gray-600">
                      {t.isAdmin ? 'সব বিষয়' : t.subjects.map(id => subjects.find(s => s.id === id)?.name || id).join(', ') || '—'}
                    </td>
                    <td className="py-2 px-3 text-center font-mono">{t.pass}</td>
                    <td className="py-2 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${t.isAdmin ? 'bg-gold-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}
                        style={t.isAdmin ? { background: '#fef3c7', color: '#92400e' } : {}}>
                        {t.isAdmin ? 'অ্যাডমিন' : 'শিক্ষক'}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <button onClick={() => removeTeacher(t.id)} className="text-red-500 hover:text-red-700 text-lg">🗑</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ── SUBJECTS ── */}
      {activeTab === 'subjects' && (
        <Card>
          <div className="flex justify-between items-center mb-4">
            <strong>বিষয়ের তালিকা ({subjects.length} টি)</strong>
            <Btn variant="primary" size="sm" onClick={() => setShowSubForm(!showSubForm)}>+ নতুন বিষয়</Btn>
          </div>

          {showSubForm && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4 animate-fade-in">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 items-end">
                <div className="sm:col-span-2">
                  <Label>বিষয়ের নাম</Label>
                  <Input value={newSub.name} onChange={e => setNewSub(p => ({ ...p, name: e.target.value }))} placeholder="বিষয়ের নাম" />
                </div>
                <div>
                  <Label>পূর্ণ নম্বর</Label>
                  <Input type="number" value={newSub.full} onChange={e => setNewSub(p => ({ ...p, full: e.target.value }))} placeholder="100" />
                </div>
                <div>
                  <Label>MCQ</Label>
                  <Input type="number" value={newSub.mcq} onChange={e => setNewSub(p => ({ ...p, mcq: e.target.value }))} placeholder="0" />
                </div>
                <Btn variant="primary" size="sm" onClick={addSubject}>সংরক্ষণ</Btn>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  {['বিষয়', 'পূর্ণ নম্বর', 'MCQ', 'CQ', 'ব্যবহারিক', 'মুছুন'].map(h => (
                    <th key={h} className="py-2.5 px-3 text-white text-xs font-semibold text-center" style={{ background: '#0f4527' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {subjects.map(s => (
                  <tr key={s.id} className="border-b border-gray-50 hover:bg-green-50">
                    <td className="py-2 px-3 text-left font-medium">{s.name}</td>
                    <td className="py-2 px-3 text-center">{s.full}</td>
                    <td className="py-2 px-3 text-center">{s.mcq || '—'}</td>
                    <td className="py-2 px-3 text-center">{s.cq || '—'}</td>
                    <td className="py-2 px-3 text-center">{s.practical || '—'}</td>
                    <td className="py-2 px-3 text-center">
                      <button onClick={() => removeSubject(s.id)} className="text-red-500 hover:text-red-700 text-lg">🗑</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ── CLASSES ── */}
      {activeTab === 'classes' && (
        <Card>
          <div className="font-bold mb-4">ক্লাসের তালিকা</div>
          <div className="flex gap-3 mb-5">
            <Input
              value={newClass}
              onChange={e => setNewClass(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addClass()}
              placeholder="নতুন ক্লাসের নাম (যেমন: একাদশ)"
              className="max-w-xs"
            />
            <Btn variant="primary" size="sm" onClick={addClass}>+ যোগ করুন</Btn>
          </div>
          <div className="flex flex-wrap gap-3">
            {classes.map(c => (
              <div
                key={c}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl font-semibold text-white"
                style={{ background: 'linear-gradient(135deg, #0f4527, #1a6b3c)' }}
              >
                {c}
                <button
                  onClick={() => removeClass(c)}
                  className="text-white/60 hover:text-white text-sm ml-1 transition-colors"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </ProtectedLayout>
  );
}
