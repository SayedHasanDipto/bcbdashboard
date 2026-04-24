# বি.সি.বি আইডিয়াল স্কুল — ফলাফল ব্যবস্থাপনা সিস্টেম

## 🚀 ফিচারসমূহ

- ✅ Firebase Realtime Database (অনলাইন, রিয়েলটাইম)
- ✅ শিক্ষক লগইন সিস্টেম (বিষয়ভিত্তিক অনুমতি)
- ✅ নম্বর প্রদান — MCQ, CQ, ব্যবহারিক, শ্রেণি কার্য
- ✅ বার্ষিক / অর্ধবার্ষিক / সাময়িক পরীক্ষা
- ✅ ক্লাসভিত্তিক সামগ্রিক ফলাফল (মেধা তালিকা)
- ✅ একক শিক্ষার্থীর রেজাল্ট শিট
- ✅ প্রিন্ট (ব্রাউজার প্রিন্ট + নতুন উইন্ডো প্রিন্ট)
- ✅ GPA ও গ্রেড স্বয়ংক্রিয় হিসাব
- ✅ অ্যাডমিন প্যানেল — শিক্ষার্থী / শিক্ষক / বিষয় / ক্লাস ম্যানেজমেন্ট
- ✅ Vercel Deploy রেডি

---

## 📦 ধাপ ১: Firebase প্রজেক্ট তৈরি করুন

1. **[firebase.google.com](https://firebase.google.com)** → "Get Started" → Google অ্যাকাউন্টে লগইন

2. **নতুন প্রজেক্ট তৈরি:**
   - "Add project" ক্লিক করুন
   - প্রজেক্ট নাম দিন: `bcb-school`
   - Google Analytics: অফ করতে পারেন
   - "Create project" ক্লিক করুন

3. **Realtime Database চালু করুন:**
   - বাম মেনু → "Build" → "Realtime Database"
   - "Create Database" ক্লিক করুন
   - Location: `asia-south1 (Mumbai)` বা `us-central1`
   - Security rules: **"Start in test mode"** সিলেক্ট করুন ✅
   - "Enable" ক্লিক করুন

4. **Web App যোগ করুন:**
   - Project Overview → `</>` (Web) আইকন ক্লিক করুন
   - App nickname: `bcb-web`
   - "Register app" ক্লিক করুন
   - **firebaseConfig কপি করুন** (এটা পরে লাগবে)

---

## ⚙️ ধাপ ২: প্রজেক্ট সেটআপ

### `.env.local` ফাইল তৈরি করুন

`.env.local.example` ফাইলটি কপি করে `.env.local` নামে সেভ করুন:

```bash
cp .env.local.example .env.local
```

তারপর `.env.local` খুলে Firebase config এর মান বসান:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=bcb-school-xxxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://bcb-school-xxxx-default-rtdb.asia-southeast1.firebasedatabase.app
NEXT_PUBLIC_FIREBASE_PROJECT_ID=bcb-school-xxxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=bcb-school-xxxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### ডিপেন্ডেন্সি ইন্সটল করুন

```bash
npm install
```

### লোকাল রান করুন

```bash
npm run dev
```

ব্রাউজারে যান: [http://localhost:3000](http://localhost:3000)

---

## 🌐 ধাপ ৩: Vercel এ Deploy করুন

### পদ্ধতি ১ — GitHub থেকে (সবচেয়ে সহজ)

1. **GitHub এ Push করুন:**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/আপনার-username/bcb-school.git
git push -u origin main
```

2. **[vercel.com](https://vercel.com)** → "New Project" → GitHub রিপো import করুন

3. **Environment Variables যোগ করুন:**
   - Vercel Dashboard → Settings → Environment Variables
   - `.env.local` এর সব variable গুলো এখানে যোগ করুন

4. **Deploy!** → Vercel স্বয়ংক্রিয়ভাবে build করবে

### পদ্ধতি ২ — Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

Deploy করার সময় environment variables সেট করতে বলবে।

---

## 🔒 Firebase Security Rules (Production এর জন্য)

Firebase Console → Realtime Database → Rules এ নিচের rules বসান:

```json
{
  "rules": {
    "bcb": {
      ".read": true,
      ".write": true
    }
  }
}
```

> ⚠️ এটি টেস্ট মোড। Production এ proper authentication rules ব্যবহার করুন।

---

## 👤 ডিফল্ট লগইন

| শিক্ষক | পাসওয়ার্ড |
|--------|-----------|
| প্রধান শিক্ষক (Admin) | 1234 |
| মোঃ রহিম উদ্দিন | 1234 |
| মোসাম্মৎ খাদিজা বেগম | 1234 |
| সব শিক্ষক | 1234 |

---

## 📁 প্রজেক্ট স্ট্রাকচার

```
src/
├── app/
│   ├── page.tsx          # লগইন পেজ
│   ├── dashboard/        # ড্যাশবোর্ড
│   ├── enter-marks/      # নম্বর প্রদান
│   ├── results/          # ফলাফল দেখুন
│   └── admin/            # অ্যাডমিন প্যানেল
├── components/
│   ├── layout/           # Header, ProtectedLayout
│   ├── print/            # ResultSheet
│   └── ui/               # Btn, Card, Select...
├── lib/
│   ├── firebase.ts       # Firebase init
│   ├── db.ts             # Database operations
│   ├── grading.ts        # GPA & Grade calculation
│   └── auth-context.tsx  # Auth state
└── types/
    └── index.ts          # TypeScript types
```

---

## 🛠️ টেকনোলজি স্ট্যাক

- **Framework:** Next.js 14 (App Router)
- **Database:** Firebase Realtime Database
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Fonts:** Hind Siliguri + Noto Serif Bengali
- **Deploy:** Vercel
