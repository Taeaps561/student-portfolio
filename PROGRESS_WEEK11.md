# 📋 รายงานความคืบหน้าโครงงาน (Project Status Report) — สัปดาห์ที่ 11
**รายวิชา:** DevSecOps  
**ชื่อโครงงาน:** Student Portfolio & Skill Passport (ระบบแฟ้มสะสมผลงานดิจิทัลและเครือข่ายวิชาชีพนักศึกษา มสด.)  
**กลุ่มที่:** 3 (Student Portfolio & Skill Passport)  
**GitHub Repository:** [https://github.com/Taeaps561/student-portfolio](https://github.com/Taeaps561/student-portfolio)  

---

## 👥 1. ข้อมูลโครงงานและรายชื่อสมาชิก (3 คน)

| ลำดับ | รหัสนักศึกษา | ชื่อ - นามสกุล | บทบาทหน้าที่ความรับผิดชอบ |
| :---: | :---: | :--- | :--- |
| 1 | 010 | นายอภิสิทธิ์ ศรีพัฒน์ | **Backend, Database & Security Lead:**<br>• พัฒนาระบบ Authentication & Multi-Role Registration (NextAuth.js, Credentials + Session Guards)<br>• ออกแบบ Prisma Schema & SQLite/PostgreSQL Database (User, Portfolio, Project, Certificate, AuditLog, Skill)<br>• พัฒนาระบบ Data Masking (ปิดบัง GPA / ข้อมูลสำคัญ) และ Cryptographic Digital Signature (SHA-256 Hashing) |
| 2 | 008 | นายปภังกร ทองเจริญ | **GitHub Integration & API Specialist:**<br>• พัฒนา Backend Service เชื่อมต่อ GitHub REST API (`/api/github`) ดึง Repositories, ภาษา และประวัติ Commit<br>• พัฒนาระบบ Audit Logging บันทึกเหตุการณ์ความปลอดภัย (Security Event Logs) ลงฐานข้อมูล<br>• จัดการ API Endpoints สำหรับระบบโพสต์ฟีด (`/api/posts`), ทักษะ (`/api/skills`) และใบรับรอง (`/api/certificates`) |
| 3 | 009 | นายปวีณวัชร์ เหลืองอุทัย | **Frontend, UX/UI & QA Lead:**<br>• พัฒนาหน้าจอ Responsive UI: หน้าแรกฟีด (`/feed`), ศูนย์อาจารย์ (`/teacher`, `/teacher/certificates`, `/teacher/advisees`), และสรรหาบุคลากร (`/employer/jobs`, `/employer/matching`)<br>• ออกแบบพรีวิวใบประกาศนียบัตรดิจิทัล มหาวิทยาลัยสวนดุสิต (Printable SDU Diploma Modal)<br>• ดูแล Flow การใช้งานโดยรวม และทำ System Testing ตรวจสอบสิทธิ์การเข้าถึงตามหลัก DevSecOps |

---

## 📊 2. สถานะความคืบหน้าของงาน (Task Progress)

### ✅ งานที่ทำเสร็จแล้ว (Completed Tasks - สัปดาห์ที่ 1-11)
1. **ระบบฐานข้อมูลและ Audit Logging (Database & ORM):**
   - ออกแบบ Schema ฐานข้อมูลด้วย Prisma ORM รองรับ User, Account, Session, Portfolio, Skill, Project, Certificate, Post, AuditLog
   - จัดเก็บ Config เชื่อมต่อใน `.env` และตั้งค่า `.gitignore` ไม่ให้หลุดขึ้น GitHub
2. **ระบบยืนยันตัวตนและสมัครสมาชิก (Authentication & Registration):**
   - พัฒนาระบบ Sign-In และ Registration พร้อม Role Selector (นักศึกษา, อาจารย์, นายจ้าง)
   - จัดเก็บ Password ปลอดภัย พร้อมแสดงข้อความแจ้งเตือนกลาง (Generic Neutral Error Message)
   - มี Server-side Session Guard ป้องกันการเข้าถึง Dashboard โดยตรงหากยังไม่ได้ Login
3. **การควบคุมสิทธิ์ตามบทบาท (Role-Based Access Control - RBAC):**
   - รองรับ 3 Roles: **Student**, **Teacher**, และ **Employer**
   - Smart Dashboard Routing แยกหน้าตามบทบาท (`/dashboard` ➡️ `/teacher` ➡️ `/employer`)
   - ระบบตรวจสอบสิทธิ์ที่ฝั่ง Server (Server-side Validation ส่ง 401 Unauthorized หากไม่มีสิทธิ์)
4. **ระบบใบรับรองและวุฒิบัตรดิจิทัล (Digital Certificates & SHA-256 Verification):**
   - รองรับใบรับรองสากลและแคมปัส (CCNA, CompTIA Security+, CEH, SDU DevSecOps Specialist)
   - สร้างรหัส Cryptographic SHA-256 Hash ประจำแต่ละใบรับรอง พร้อมเครื่องมือตรวจสอบความถูกต้อง
   - พรีวิวและพิมพ์ใบประกาศนียบัตรดิจิทัลของมหาวิทยาลัยสวนดุสิตพร้อม QR Verification Code
5. **ระบบฟีดข่าวสารวิชาการและกล่องข้อความ (Community Feed & Role-based Messenger):**
   - หน้าฟีดชุมชน มสด. บันทึกลงฐานข้อมูลจริง รองรับโพสต์อาจารย์, รับสมัครงานสหกิจศึกษา และโชว์ผลงาน
   - กล่องข้อความแยกชุดการสนทนาตามบทบาท พร้อมระบบ Auto-Reply ตอบกลับอัตโนมัติ

### 🔄 งานที่กำลังดำเนินการ (In-Progress Tasks)
1. การติดตั้ง DevSecOps Security Scanning Pipeline (SAST / GitHub Actions Workflow)
2. การปรับแต่งประสิทธิภาพการโหลดหน้าเว็บและแคช (Next.js Caching & Optimization)

### ⏳ งานที่ยังไม่ได้เริ่ม (Not Started Tasks)
1. ระบบ AI แนะนำทักษะและวิเคราะห์ตลาดงาน (Skill Recommendation Engine)
2. การ Deploy ขึ้น Production Cloud Server (Vercel / AWS / Supabase)

---

## ⚠️ 3. ปัญหาที่พบและแนวทางแก้ไข (Issues & Resolutions)

| ปัญหาที่พบ (Issue) | สาเหตุ (Root Cause) | แนวทางแก้ไข (Resolution) |
| :--- | :--- | :--- |
| 1. ผู้ใช้สามารถพิมพ์ URL เข้าหน้า Dashboard หรือหน้าอาจารย์ได้โดยตรง | การตรวจสอบสิทธิ์เดิมทำเพียงฝั่ง Client-side | เพิ่ม `getServerSession` ใน Server Components และตรวจสอบ `session.user.role` ทุกครั้ง หากไม่มีสิทธิ์จะ Redirect หรือส่ง `401 Unauthorized` |
| 2. ข้อมูล Mock ในระบบเดิมเป็นข้อมูลทั่วไป ไม่สะท้อนบริบท มสด. | ข้อมูลเริ่มต้นเป็น Placeholder สำเร็จรูป | ปรับปรุง Mock Dataset และ Database Seeding ให้เป็นบริบทจริงของ มสด. และ DevSecOps |
| 3. ปัญหาความเป็นส่วนตัวของข้อมูลนักศึกษา (PDPA) | การเปิดเผย GPA หรือเบอร์โทรศัพท์สู่สาธารณะ | ทำระบบ **Data Masking** และใช้ชื่อจำลอง "นักศึกษา ทดสอบ" ในระบบหน้าเว็บ |

---

## 📈 4. เปอร์เซ็นต์ความสำเร็จโดยรวม (Overall Progress)

```
[█████████████████░░░] 85%
```
- **Backend & Database:** 90%
- **Authentication & Security (DevSecOps):** 90%
- **Core CRUD & Digital Certificate:** 90%
- **Advanced Features (AI, CI/CD Pipeline):** 50%
- **ภาพรวมความสำเร็จของโครงการ:** **85%**

---

## 🗓️ 5. แผนการพัฒนาในสัปดาห์ที่ 12–13 (Future Roadmap)

### สัปดาห์ที่ 12: Security Hardening & CI/CD Pipeline
- ติดตั้ง GitHub Actions CI/CD ทำ Automated SAST Security Scanning (npm audit, Semgrep)
- ปรับแต่ง Security Headers (Helmet, CSRF Protection, Rate Limiting)

### สัปดาห์ที่ 13: Feature Completion & Deployment
- ปรับแต่ง Responsive UI และเชื่อมต่อ AI Career Path Recommender
- Deploy ระบบขึ้น Cloud Production (Vercel / Supabase) พร้อมจัดเตรียมเอกสารฉบับสมบูรณ์
