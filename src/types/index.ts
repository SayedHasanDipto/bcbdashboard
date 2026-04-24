// src/types/index.ts

export interface Teacher {
  id: string;
  name: string;
  pass: string;
  subjects: string[];
  isAdmin: boolean;
}

export interface Student {
  id: string;
  name: string;
  class: string;
  roll: number;
}

export interface Subject {
  id: string;
  name: string;
  full: number;
  mcq: number;
  cq: number;
  practical: number;
}

export interface MarkEntry {
  cq: number;
  mcq: number;
  practical: number;
  classTest: number;
  updatedAt?: number;
  updatedBy?: string;
}

export type MarksMap = Record<string, MarkEntry>;

export type ExamType = 'annual' | 'half' | 'test1' | 'test2';

export const EXAM_LABELS: Record<ExamType, string> = {
  annual: 'বার্ষিক পরীক্ষা',
  half: 'অর্ধবার্ষিক',
  test1: '১ম সাময়িক',
  test2: '২য় সাময়িক',
};

export interface GradeResult {
  letter: string;
  point: number;
}

export const DEFAULT_CLASSES = ['ষষ্ঠ', 'সপ্তম', 'অষ্টম', 'নবম', 'দশম'];

export const DEFAULT_SUBJECTS: Subject[] = [
  { id: 'bangla1', name: 'বাংলা ১ম পত্র', full: 100, mcq: 30, cq: 70, practical: 0 },
  { id: 'bangla2', name: 'বাংলা ২য় পত্র', full: 50, mcq: 0, cq: 50, practical: 0 },
  { id: 'english1', name: 'ইংরেজি ১ম পত্র', full: 100, mcq: 30, cq: 70, practical: 0 },
  { id: 'english2', name: 'ইংরেজি ২য় পত্র', full: 50, mcq: 0, cq: 50, practical: 0 },
  { id: 'math', name: 'গণিত', full: 100, mcq: 30, cq: 70, practical: 0 },
  { id: 'science', name: 'বিজ্ঞান', full: 100, mcq: 30, cq: 70, practical: 0 },
  { id: 'ict', name: 'তথ্য ও যোগাযোগ', full: 50, mcq: 25, cq: 25, practical: 25 },
  { id: 'religion', name: 'ধর্ম ও নৈতিক শিক্ষা', full: 100, mcq: 30, cq: 70, practical: 0 },
  { id: 'history', name: 'বাং ও বিশ্ব পরিচয়', full: 100, mcq: 30, cq: 70, practical: 0 },
  { id: 'agri', name: 'কৃষি শিক্ষা', full: 100, mcq: 30, cq: 70, practical: 0 },
];

export const DEFAULT_TEACHERS: Teacher[] = [
  { id: 'admin', name: 'প্রধান শিক্ষক (Admin)', pass: '1234', subjects: [], isAdmin: true },
  { id: 't1', name: 'মোঃ রহিম উদ্দিন', pass: '1234', subjects: ['bangla1', 'bangla2'], isAdmin: false },
  { id: 't2', name: 'মোসাম্মৎ খাদিজা বেগম', pass: '1234', subjects: ['english1', 'english2'], isAdmin: false },
  { id: 't3', name: 'মোঃ করিম হোসেন', pass: '1234', subjects: ['math'], isAdmin: false },
  { id: 't4', name: 'মোছাঃ সালমা আক্তার', pass: '1234', subjects: ['science'], isAdmin: false },
  { id: 't5', name: 'মোঃ জাহাঙ্গীর আলম', pass: '1234', subjects: ['ict', 'agri'], isAdmin: false },
  { id: 't6', name: 'মোছাঃ রুমানা পারভীন', pass: '1234', subjects: ['religion', 'history'], isAdmin: false },
];
