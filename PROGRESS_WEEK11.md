# 📋 รายงานความคืบหน้าโครงงาน (Project Status Report) — สัปดาห์ที่ 11
**รายวิชา:** DevSecOps  
**ชื่อโครงงาน:** Student Portfolio & Skill Passport (ระบบแฟ้มสะสมผลงานดิจิทัลและเครือข่ายวิชาชีพนักศึกษา มสด.)  
**กลุ่มที่:** 3 (Student Portfolio & Skill Passport)  

---

## 👥 1. ข้อมูลโครงงานและรายชื่อสมาชิก (3 คน)

| ลำดับ | รหัสนักศึกษา | ชื่อ - นามสกุล | บทบาทหน้าที่ความรับผิดชอบ |
| :---: | :---: | :--- | :--- |
| 1 | 010 | นายอภิสิทธิ์ ศรีพัฒน์ | **Backend, Database & Security Lead:**<br>• ติดตั้งและตั้งค่า NextAuth.js (GitHub OAuth + Credentials Login สำหรับนักศึกษา/อาจารย์/นายจ้าง)<br>• ออกแบบและดูแล Prisma Schema (User, Portfolio, Project, AuditLog, Skill)<br>• ทำระบบ Privacy & Data Masking (ปิดบัง GPA / เบอร์โทรศัพท์สำหรับผู้ที่ไม่มีสิทธิ์) และเขียน API พื้นฐานของ Portfolio |
| 2 | 008 | นายปภังกร ทองเจริญ | **GitHub Integration & API Specialist:**<br>• พัฒนา Backend Service เชื่อมต่อ GitHub REST API (`/api/github`) ดึง Repos, คำนวณสถิติภาษา (%) และประวัติ Commit<br>• ทำตาราง Contribution Heatmap และระบบ 1-Click Import นำเข้า Repo สู่ Database<br>• พัฒนาหน้าจอ `/github` ให้เชื่อมต่อและตอบสนองกับผู้ใช้ได้อย่างสมบูรณ์ |
| 3 | 009 | นายปวีณวัชร์ เหลืองอุทัย | **Frontend, UX/UI & QA Lead:**<br>• พัฒนาและตกแต่งหน้าจอหลัก `/portfolio` (Digital Skill Passport Showcase), `/dashboard` และ `/login` ด้วยดีไซน์ทันสมัยและ Responsive<br>• พัฒนา Component แสดงผลการ์ดผลงาน, แถบวัดระดับทักษะ (Skill Bars) และแท็กภาษาโปรแกรม<br>• ดูแล Flow การใช้งานโดยรวม และทำ System Testing (QA) ตรวจสอบความถูกต้องของระบบ |

---

## 📊 2. สถานะความคืบหน้าของงาน (Task Progress)

### ✅ งานที่ทำเสร็จแล้ว (Completed Tasks - สัปดาห์ที่ 1-11)
1. **ระบบฐานข้อมูลและการเชื่อมต่อ (Database & ORM):**
   - ออกแบบ Schema ฐานข้อมูลด้วย Prisma ORM รองรับ User, Account, Session, Portfolio, Skill, Project, Certificate, Course, Post
   - จัดเก็บ Environment Variable (`DATABASE_URL`, NextAuth Secrets) ใน `.env` และตั้งค่า `.gitignore` เรียบร้อย
2. **ระบบการยืนยันตัวตนและการจัดการเซสชัน (Authentication & Session):**
   - ติดตั้งและตั้งค่า NextAuth.js รองรับทั้ง Credentials Login และ GitHub OAuth
   - ระบบจัดเก็บ Password แบบปลอดภัย และส่งข้อความแจ้งเตือนกลาง (Generic error message)
   - หน้า Login ป้องกันการเข้าถึง Dashboard ผ่าน URL โดยตรงถ้ายังไม่ได้ Login
   - ระบบ Logout เคลียร์ Session สำเร็จ
3. **ระบบการควบคุมสิทธิ์ตามบทบาท (Role-Based Access Control - RBAC):**
   - รองรับ 3 Roles: **Student (นักศึกษา)**, **Teacher (อาจารย์)**, และ **Employer (นายจ้าง)**
   - แยกการแสดงผลแถบเมนู (Navbar) ตามสิทธิ์ของแต่ละบทบาท
   - ป้องกันการเข้าถึงหน้า Server/API Route ที่ไม่มีสิทธิ์ (Server-side validation คืนค่า 401 Unauthorized)
4. **ฟังก์ชันหลักของระบบ (Core Features):**
   - หน้า Digital Passport Dashboard แสดงผลงาน, ทักษะ, ใบรับรอง
   - หน้าเพิ่ม/แก้ไข/ลบ ข้อมูลทักษะ (Skills) และผลงาน (Projects) บันทึกลงฐานข้อมูลจริง
   - หน้าอาจารย์ (Teacher Portal) สำหรับตรวจสอบและอนุมัติรับรองทักษะนักศึกษา

### 🔄 งานที่กำลังดำเนินการ (In-Progress Tasks)
1. การเชื่อมต่อระบบตรวจสอบใบรับรองดิจิทัลผ่านระบบ Hashing / QR Code แบบเต็มรูปแบบ
2. ปรับปรุงระบบแจ้งเตือน (Notifications) และระบบข้อความ (Messaging) ระหว่างนักศึกษาและอาจารย์
3. การทำ Automated Testing และ Security Scanning ด้วย DevSecOps Pipeline (SAST / GitHub Actions)

### ⏳ งานที่ยังไม่ได้เริ่ม (Not Started Tasks)
1. ระบบ AI แนะนำทักษะและวิเคราะห์ตลาดงาน (Skill Recommendation Engine)
2. ระบบจับคู่งานและฝึกงานอัจฉริยะสำหรับผู้ประกอบการ (AI Matching) แบบสมบูรณ์
3. การ Deploy ขึ้น Cloud Production Server พร้อมระบบ CI/CD

---

## ⚠️ 3. ปัญหาที่พบและแนวทางแก้ไข (Issues & Resolutions)

| ปัญหาที่พบ (Issue) | สาเหตุ (Root Cause) | แนวทางแก้ไข (Resolution) |
| :--- | :--- | :--- |
| 1. ผู้ใช้สามารถเดา URL เข้าหน้า Dashboard หรือหน้าอาจารย์ได้โดยตรง | การตรวจสอบสิทธิ์ทำเพียงแค่ฝั่ง Client-side (UI) | เพิ่ม `getServerSession` ใน Server Components และเพิ่มเงื่อนไขตรวจ `session.user.role` ใน API Route หากไม่มีสิทธิ์จะ Redirect ไป `/login` หรือส่งสถานะ `401 Unauthorized` |
| 2. ปัญหาความปลอดภัยของรหัสผ่านและความลับในโค้ด | อาจเผลอ Push ไฟล์ `.env` ขึ้น Git Repository | เพิ่ม `.env*` ใน `.gitignore` อย่างรัดกุม พร้อมทำ `.env.example` เป็นแม่แบบให้ทีมงาน |
| 3. การแสดงผลข้อมูลส่วนบุคคลของนักศึกษา | ข้อมูลบางอย่าง เช่น GPA, เบอร์โทรศัพท์ ควรมีความเป็นส่วนตัว | ทำระบบ **Data Masking** ซ่อนข้อมูลดังกล่าวในหน้า Public Profile |

---

## 📈 4. เปอร์เซ็นต์ความสำเร็จโดยรวม (Overall Progress)

```
[████████████████░░░░] 75%
```
- **Backend & Database:** 85%
- **Authentication & Security (DevSecOps):** 85%
- **Core CRUD & Business Logic:** 80%
- **Advanced Features (AI, Matching, Automation CI/CD):** 40%
- **ภาพรวมความสำเร็จของโครงการ:** **75%**

---

## 🗓️ 5. แผนการพัฒนาในสัปดาห์ที่ 12–13 (Future Roadmap)

### สัปดาห์ที่ 12: Security Hardening & CI/CD Pipeline
- ติดตั้ง GitHub Actions Workflow ทำ SAST (Static Application Security Testing) เช่น Snyk / Semgrep / npm audit
- ปรับแต่งระบบตรวจจับและป้องกัน CSRF, Rate Limiting และ Security Headers (Helmet/Next Config)
- เพิ่มระบบ Digital Signature Verification สำหรับใบรับรองอิเล็กทรอนิกส์

### สัปดาห์ที่ 13: Feature Completion & Deployment
- พัฒนาระบบ AI Career Path / Skill Recommender ให้สมบูรณ์
- ปรับแต่ง UX/UI สำหรับการใช้งานบนมือถือ (Responsive Web Design)
- Deploy ระบบขึ้น Production Cloud (Vercel / AWS / VPS) พร้อมตั้งค่า Database บน Cloud (PostgreSQL / Supabase)
- ทดสอบระบบ End-to-End Testing และเตรียมนำเสนอผลงานฉบับสมบูรณ์
