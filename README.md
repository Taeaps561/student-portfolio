# 🎓 Suan Dusit University - Student Portfolio & Professional Network
> ระบบแฟ้มสะสมผลงานดิจิทัลและเครือข่ายวิชาชีพนักศึกษา มหาวิทยาลัยสวนดุสิต (SkillPassport)

---

## 🚀 วิธีการติดตั้งและรันโปรเจกต์ (Quick Start for Developers)

### 1. Clone Repository
```bash
git clone <repository-url>
cd student-portfolio
```

### 2. ติดตั้ง Dependencies
```bash
npm install
```

### 3. ตั้งค่า Environment Variables
คัดลอกไฟล์ `.env.example` เป็น `.env`
```bash
cp .env.example .env
```

### 4. เตรียมฐานข้อมูล Prisma (SQLite)
```bash
npx prisma generate
npx prisma db push
```

*(ตัวเลือกเสริม) รัน Seed Data เพื่อเพิ่มข้อมูลตัวอย่าง:*
```bash
npm run seed
```

### 5. เริ่มรันเซิร์ฟเวอร์สำหรับพัฒนา (Dev Server)
```bash
npm run dev
```
เปิดบราวเซอร์ไปที่ [http://localhost:3000](http://localhost:3000)

---

## 🔑 บัญชีสำหรับทดสอบระบบ (Test Accounts)

สามารถกดปุ่มทดสอบระบบด่วนที่หน้า `/login` หรือล็อกอินด้วย:
- **บัญชีนักศึกษา (Student):** `test@example.com` / `password`
- **บัญชีอาจารย์ (Teacher):** `teacher@example.com` / `password`
- **บัญชีนายจ้าง (Employer/Recruiter):** `employer@example.com` / `password`

---

## 📂 โครงสร้างเมนูหลัก (Navigation Hierarchy)
- **🏠 หน้าแรก (`/feed`)** — ฟีดข่าวสาร โพสต์ผลงาน บทความ และกิจกรรม
- **📜 ใบรับรอง & วุฒิบัตร (`/certificates`)** — จัดการและตรวจสอบใบรับรองดิจิทัล SHA-256 (CCNA, Sec+, CEH)
- **💬 ข้อความ (`/messaging`)** — ระบบสนทนาระหว่างนักศึกษา อาจารย์ และผู้ประกอบการ
- **👥 บุคคล (`/explore`)** — ค้นหานักศึกษา อาจารย์ และเครือข่ายศิษย์เก่า มสด.
- **💼 งาน (`/employer`)** — ค้นหาตำแหน่งงาน สหกิจศึกษา และระบบจับคู่นักศึกษากับผู้ประกอบการ
- **👤 โปรไฟล์ (`/u/[id]` หรือ `/portfolio`)** — หน้าพอร์ตโฟลิโอส่วนตัวและทักษะที่ผ่านการรับรอง

---

## 👥 ทีมผู้พัฒนา (Development Team)
1. **นายอภิสิทธิ์ ศรีพัฒน์ (010)** — Backend, Database & Security Lead
2. **นายปภังกร ทองเจริญ (008)** — GitHub Integration & API Specialist
3. **นายปวีณวัชร์ เหลืองอุทัย (009)** — Frontend, UX/UI & QA Lead

