# 🎯 คู่มือและบทพูดเตรียมนำเสนอ Final Project รายวิชา DevSecOps (100 คะแนน)
## โครงงาน: Student Portfolio & Skill Passport (กลุ่มที่ 3 มหาวิทยาลัยสวนดุสิต)

> **สรุปสัดส่วนคะแนน:** คะแนนผลงานกลุ่ม 70 คะแนน | คะแนนรายบุคคล 30 คะแนน  
> **เวลาการนำเสนอ:** กลุ่มละ 20–25 นาที | ตอบข้อซักถาม 5–10 นาที  
> **Live Production URL:** [https://student-portfolio-ten-phi.vercel.app](https://student-portfolio-ten-phi.vercel.app)  
> **GitHub Repository:** [https://github.com/Taeaps561/student-portfolio](https://github.com/Taeaps561/student-portfolio)  

---

## 👥 ข้อมูลสมาชิกในกลุ่ม (3 คน)
1. **010 นายอภิสิทธิ์ ศรีพัฒน์** — Backend, Database & Security Lead
2. **008 นายปภังกร ทองเจริญ** — DevSecOps Pipeline & API Security Specialist
3. **009 นายปวีณวัชร์ เหลืองอุทัย** — Frontend, UX/UI & Cloud Deployment Specialist

---

# 📑 สารบัญการนำเสนอและเอกสาร
- [ส่วนที่ 1: ลำดับการนำเสนอภาพรวมกลุ่ม (20-25 นาที) ครอบคลุมหัวข้อ 1.1 - 1.7](#ส่วนที่-1-ลำดับการนำเสนอภาพรวมกลุ่ม-20-25-นาที)
- [ส่วนที่ 2: บทพูดรายบุคคล 3 คน (ครอบคลุมหัวข้อ 3.1 - 3.8 ทุกข้อ)](#ส่วนที่-2-บทพูดรายบุคคล-3-คน)
- [ส่วนที่ 3: เช็กลิสต์การส่งงานเป็นกลุ่ม 15 รายการ (ส่งครบ 100%)](#ส่วนที่-3-เช็กลิสต์การส่งงานเป็นกลุ่ม-15-รายการ)
- [ส่วนที่ 4: คลังคำถามและแนวทางการตอบข้อซักถามอาจารย์ (Q&A Defense Cheat Sheet)](#ส่วนที่-4-คลังคำถามและแนวทางการตอบข้อซักถามอาจารย์)

---

# ส่วนที่ 1: ลำดับการนำเสนอภาพรวมกลุ่ม (20–25 นาที)

### ⏱️ การจัดสรรเวลาในการนำเสนอ (Time Allocation)
| ช่วงเวลา | หัวข้อการนำเสนอตามเกณฑ์ | ผู้รับผิดชอบหลัก | สไลด์ที่ใช้ |
| :---: | :--- | :---: | :---: |
| **00:00 - 03:00** | **1.1 ภาพรวมโครงการ (Project Overview)** | 009 ปวีณวัชร์ | Slide 1 - 3 |
| **03:00 - 06:30** | **1.2 สถาปัตยกรรมและเทคโนโลยี (Architecture & Tech Stack)** | 010 อภิสิทธิ์ | Slide 4 - 5 |
| **06:30 - 09:30** | **1.3 การเชื่อมต่อฐานข้อมูล (DBMS Security & CRUD)** | 010 อภิสิทธิ์ | Slide 6 - 7 |
| **09:30 - 14:00** | **1.4 การสาธิตระบบ (Live System Demo)** | 009 ปวีณวัชร์ | Slide 8 (Live Demo) |
| **14:00 - 17:30** | **1.5 กระบวนการ DevSecOps (CI/CD, SAST, Quality Gate)** | 008 ปภังกร | Slide 9 - 10 |
| **17:30 - 21:00** | **1.6 การประเมินความเสี่ยงและช่องโหว่ (Vulnerability Analysis & Fix)** | 008 ปภังกร & 010 อภิสิทธิ์ | Slide 11 - 14 |
| **21:00 - 24:00** | **1.7 สรุปและบทเรียนที่ได้รับ + สรุปหน้าที่สมาชิก** | ทั้ง 3 คนร่วมกัน | Slide 15 - 18 |
| **24:00 - 30:00** | **ช่วงตอบคำถามอาจารย์ผู้สอน (Q&A Session)** | ทั้ง 3 คน | Q&A Defense |

---

## 1.1 ภาพรวมโครงการ (Project Overview) [00:00 - 03:00]
### 1. ชื่อโครงการและสมาชิก
- **ชื่อโครงการ:** Student Portfolio & Skill Passport (ระบบแฟ้มสะสมผลงานดิจิทัลและเครือข่ายวิชาชีพนักศึกษา มสด.)
- **สังกัด:** สาขาวิทยาการคอมพิวเตอร์ คณะวิทยาศาสตร์และเทคโนโลยี มหาวิทยาลัยสวนดุสิต
- **สมาชิก:** 010 นายอภิสิทธิ์ ศรีพัฒน์, 008 นายปภังกร ทองเจริญ, 009 นายปวีณวัชร์ เหลืองอุทัย

### 2. ปัญหาที่โครงการต้องการแก้ไข (Problem Statement)
- **ปัญหาเดิม 1 (ขาดความน่าเชื่อถือ):** พอร์ตโฟลิโอแบบ PDF/กระดาษทั่วไปสามารถแก้ไขตกแต่งหรือปลอมแปลงใบรับรองได้ง่าย ผู้ว่าจ้างไม่สามารถตรวจพิสูจน์ (Verify) ได้ว่าผลงานหรือใบประกาศนียบัตรนั้นเป็นของจริงหรือไม่
- **ปัญหาเดิม 2 (Skill Gap & Mismatch):** ตลาดแรงงานด้านไอทีและไซเบอร์ซีเคียวริตีต้องการทักษะที่วัดผลได้จริง แต่ระบบเดิมไม่มีเกณฑ์การประเมินรูบริกส์ (Rubric Scores) หรือการรับรองทักษะจากอาจารย์ผู้สอน
- **ปัญหาเดิม 3 (ความปลอดภัยและความเป็นส่วนตัว):** การแชร์พอร์ตโฟลิโอสาธารณะมักทำให้ข้อมูลอ่อนไหว เช่น เกรดเฉลี่ย (GPA), เบอร์โทรศัพท์ และเลขประจำตัว หลุดออกสู่สาธารณะโดยไม่สอดคล้องกับ พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA)

### 3. กลุ่มผู้ใช้งานเป้าหมาย (Target Users)
1. **นักศึกษา (Student):** รวบรวมผลงาน ยืนยันสิทธิ์ในทักษะ สมัครงาน และสร้างเครือข่ายแลกเปลี่ยนความรู้
2. **อาจารย์ผู้สอน/ผู้ประเมิน (Teacher):** จัดการรายวิชา ประเมินทักษะนักศึกษาตามเกณฑ์รูบริกส์ และออกใบรับรองดิจิทัลแบบเข้ารหัส
3. **ผู้ประกอบการ/HR (Employer):** ค้นหานักศึกษาที่มีทักษะตรงตาม Job Requirement ด้วยระบบจับคู่อัจฉริยะ (Skill Matching Engine) โดยเข้าถึงเฉพาะข้อมูลที่ได้รับอนุญาต

### 4. ขอบเขตและฟังก์ชันหลักของระบบ (Scope & Core Features)
- **Multi-Role Authentication & RBAC:** ระบบล็อกอิน 3 สิทธิ์ (STUDENT, TEACHER, EMPLOYER) พร้อมจัดการ Session ด้วย HttpOnly Secure Cookie
- **Skill Passport & Rubric Verification:** ตรวจสอบทักษะพร้อมคะแนนการทดสอบ ลิงก์หลักฐานผลงาน และเกณฑ์ประเมิน
- **Digital Diploma with SHA-256 Integrity:** ใบประกาศนียบัตรดิจิทัลมีค่าแฮชป้องกันการปลอมแปลง ตรวจสอบย้อนกลับผ่านระบบ Verify ด้วยรหัสหรือ QR Code
- **Community Feed (สไตล์ LinkedIn):** โครงข่ายแบ่งปันผลงาน กดแสดงความรู้สึก (Like, Celebrate, Insightful) และแสดงความคิดเห็น
- **Employer Matching Portal:** ระบบจับคู่งานอัตโนมัติตามเปอร์เซ็นต์ความตรงของทักษะ
- **Security & Privacy by Design:** Data Masking ซ่อนข้อมูลส่วนบุคคล และบันทึกประวัติการเปลี่ยนแปลงลง AuditLog

### 5. สิ่งที่พัฒนาเสร็จแล้ว และสิ่งที่ยังไม่สมบูรณ์
- **สิ่งที่พัฒนาเสร็จสมบูรณ์แล้ว (98%):**
  - สถาปัตยกรรม Dual Database (SQLite สำหรับ Dev, PostgreSQL สำหรับ Cloud)
  - ระบบยืนยันตัวตนและการจำกัดสิทธิ์ (RBAC & NextAuth)
  - โมเดลฐานข้อมูล 10 ตาราง พร้อมฟังก์ชัน CRUD เต็มรูปแบบ
  - ระบบตรวจสอบและออกใบรับรองดิจิทัล SHA-256
  - ระบบคัดกรองข้อมูลส่วนบุคคล (Data Masking) ซ่อนเบอร์โทรและ GPA
  - ระบบ CI/CD Security Pipeline (Semgrep SAST, ESLint, npm audit)
  - การ Deploy ระบบขึ้นใช้งานจริงบน Vercel Production
- **สิ่งที่ยังไม่สมบูรณ์และเป็นแผนพัฒนาในอนาคต (2%):**
  - ระบบแชทสนทนาแบบ Real-time ด้วย WebSocket (ปัจจุบันทำงานในรูปแบบ Mock Message/REST API)
  - การผูกบัญชีเข้ากับระบบ Single Sign-On กลางของมหาวิทยาลัย (SDU Central SSO / OAuth)
  - การนำค่า Cryptographic Hash ขึ้นบันทึกบน Public Blockchain สำหรับการตรวจสอบภายนอกมหาวิทยาลัย

---

## 1.2 สถาปัตยกรรมและเทคโนโลยี (Architecture & Tech Stack) [03:00 - 06:30]

### 1. แผนภาพสถาปัตยกรรมระบบ (System Architecture Diagram)
```
+─────────────────────────────────────────────────────────────────────────────+
|                         SYSTEM ARCHITECTURE & TRUST BOUNDARY                |
+─────────────────────────────────────────────────────────────────────────────+
|  [Clients / Browsers]                                                       |
|       │ HTTPS (TLS 1.3)                                                     |
|       ▼ Security Headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Nosniff)|
|  [Vercel Edge Network / CDN / Reverse Proxy]                                |
|       │ Forward Request                                                     |
|       ▼                                                                     |
|  ┌───────────────────────────────────────────────────────────────────────┐  |
|  │ NEXT.JS 16 APPLICATION RUNTIME (Serverless Node.js)                   │  |
|  │  ├── Presentation Layer: React 19 UI + Tailwind CSS v4 Responsive    │  |
|  │  ├── Authentication Layer: NextAuth.js (HttpOnly JWT Cookie, RBAC)   │  |
|  │  ├── Privacy & Security Layer: Data Masking Engine (PDPA), Crypto     │  |
|  │  └── API Routes / Server Actions: Strict Input Sanitization, Regex    │  |
|  └───────────────────────────────────┬───────────────────────────────────┘  |
|                                      │ Prisma ORM (Parameterized Queries)   |
|                                      ▼                                      |
|  ┌───────────────────────────────────────────────────────────────────────┐  |
|  │ DATABASE LAYER (Dual-Environment Architecture)                        │  |
|  │  • Development: SQLite (prisma/dev.db) - Fast local testing           │  |
|  │  • Production:  PostgreSQL on Supabase/Neon Cluster with SSL Pooler   │  |
|  │  • Tables: User, Account, Session, Portfolio, Skill, Project,        │  |
|  │            Certificate, Course, Enrollment, Post, PostLike, AuditLog  │  |
|  └───────────────────────────────────────────────────────────────────────┘  |
|                                      │ HTTPS REST (Sanitized Whitelist)     |
|                                      ▼                                      |
|  [External Services: GitHub REST API for Student Repos & Public Commits]     |
+─────────────────────────────────────────────────────────────────────────────+
```

### 2. Frontend, Backend, Database และบริการภายนอกที่ใช้
| ส่วนงาน | เทคโนโลยีที่เลือกใช้ | บทบาทในระบบ |
| :--- | :--- | :--- |
| **Frontend** | **Next.js 16 (App Router), React 19, Tailwind CSS v4** | แสดงผลหน้าบ้าน รองรับ Server Components, Dynamic Rendering และ Responsive Design สไตล์ Modern Enterprise |
| **Backend** | **Next.js API Routes (Node.js Serverless), NextAuth.js** | ประมวลผลตรรกะทางธุรกิจ การยืนยันสิทธิ์ผู้ใช้งาน (RBAC) และการเชื่อมโยงระบบเข้ารหัส |
| **Database** | **Prisma ORM (v5/v7) + PostgreSQL (Cloud) / SQLite (Dev)** | จัดการฐานข้อมูลความสัมพันธ์ ป้องกัน SQL Injection 100% และบริหารจัดการ Schema Migration |
| **Cryptography** | **Node.js Native Crypto Module (SHA-256)** | สร้าง Digital Signature สำหรับใบประกาศนียบัตรดิจิทัล |
| **External Service**| **GitHub REST API & Vercel Edge** | ดึงข้อมูลผลงานโอเพนซอร์สของนักศึกษา และให้บริการ Cloud Hosting พร้อม Global CDN |

### 3. ขั้นตอนการรับส่งข้อมูลระหว่างส่วนต่าง ๆ
1. ผู้ใช้ส่ง Request เข้ามายังระบบผ่าน **HTTPS (TLS 1.3)** เพื่อเข้ารหัสข้อมูลที่วิ่งบนเครือข่าย
2. Vercel Reverse Proxy ฉีดค่า **HTTP Security Headers** (CSP, X-Frame-Options, etc.) ก่อนส่งต่อไปยัง Next.js App Router
3. NextAuth ตรวจสอบ **Session Token** จาก HttpOnly Secure Cookie หากไม่มีสิทธิ์ตาม Role จะถูกตัดสิทธิ์ด้วย HTTP 401 หรือ 403
4. API Handler ทำการ **Input Sanitization** และส่งต่อไปยัง **Prisma ORM** ซึ่งจะ Compile คำสั่งเป็น Parameterized Query สู่ฐานข้อมูล
5. ข้อมูลที่ดึงกลับมาจะถูกประมวลผลผ่าน **Privacy Filter (Data Masking)** เพื่อลบเกรดเฉลี่ยและ Mask เบอร์โทรศัพท์ ก่อนส่งกลับเป็น JSON ให้แก่ Frontend

### 4. วิธีจัดการ Environment Variables และ Secrets
- **การแยกไฟล์และกำหนดความปลอดภัย:**
  - ไฟล์ `.env` เก็บค่าเฉพาะเครื่อง Local เช่น `DATABASE_URL="file:./dev.db"`
  - ไฟล์ `.gitignore` บรรจุรายการ `.env`, `.env*.local`, `*.db`, `node_modules/` ป้องกันการ Commit รหัสผ่านขึ้นสู่ GitHub
  - จัดทำไฟล์ `.env.example` ที่ไม่มีรหัสผ่านจริงไว้ใน Repository เพื่อให้ทีมงานโคลนไปตั้งค่าได้ปลอดภัย
- **บน Cloud Production (Vercel):**
  - ค่าความลับทั้งหมด (`DATABASE_URL` ของ PostgreSQL, `NEXTAUTH_SECRET`, `GITHUB_ID`, `GITHUB_SECRET`) ถูกใส่ในระบบ **Vercel Encrypted Environment Variables**
  - ไม่มีการ Hardcode รหัสผ่านหรือ Connection String ใน Source Code โดยเด็ดขาด

### 5. เหตุผลในการเลือกใช้เทคโนโลยีแต่ละส่วน
- **Next.js 16:** สามารถพัฒนาทั้ง Frontend และ Backend ในโปรเจกต์เดียวกัน มี Server Actions ที่ปลอดภัยจาก XSS และลด Network Round-trip
- **Prisma ORM:** มี Type-safe Client ป้องกันพิมพ์ฟิลด์ผิด และใช้ Prepared Statements เป็นค่าเริ่มต้น 100% กำจัดความเสี่ยง SQL Injection สอดคล้องกับข้อกำหนดรายวิชา DBMS Security
- **Tailwind CSS:** ให้ความยืดหยุ่นในการจัดทำ UI ระดับพรีเมียม สไตล์ Glassmorphism สอดคล้องกับมาตรฐานเว็บไซต์สมัยใหม่

---

## 1.3 การเชื่อมต่อฐานข้อมูล (Database Connection & DBMS Security) [06:30 - 09:30]

### 1. ความเชื่อมโยงกับรายวิชา DBMS Security
- โครงงานนี้ต่อยอดความรู้จากวิชา **DBMS Security** โดยนำหลักการมาประยุกต์ใช้ครบถ้วน:
  - **Database Normalization:** ออกแบบโครงสร้างตารางข้อมูลตามเกณฑ์ 3NF ลดความซ้ำซ้อนของข้อมูล
  - **Principle of Least Privilege:** การแยก Database User บนระบบ Cloud ให้มีสิทธิ์เฉพาะ `SELECT, INSERT, UPDATE, DELETE` บน Schema ของแอปพลิเคชัน ไม่อนุญาตให้ใช้บัญชี Superuser ใน Connection String
  - **Data Integrity & Cryptographic Hashing:** ใช้ SHA-256 Hashing เพื่อรับรองความถูกต้องของข้อมูลใบเซอร์
  - **Audit Logging:** มีตาราง `AuditLog` สำหรับเก็บบันทึกร่องรอยการเปลี่ยนแปลงข้อมูลสำคัญเพื่อการตรวจสอบย้อนกลับ (Accountability)

### 2. โครงสร้างฐานข้อมูลและ ER Diagram (Database Schema)
```
+───────────────────────────────────────────────────────────────────────────────────+
|                             ENTITY RELATIONSHIP DIAGRAM                           |
+───────────────────────────────────────────────────────────────────────────────────+
|  [User] 1 ──────── 1 [Portfolio] 1 ──────── N [Skill]                             |
|    │                       │     1 ──────── N [Project]                           |
|    │                       │     1 ──────── N [Certificate] (SHA-256 Hash)        |
|    ├────── 1 ── N [Account]                                                       |
|    ├────── 1 ── N [Session]                                                       |
|    ├────── 1 ── N [AuditLog]                                                      |
|    ├────── 1 ── N [Course] 1 ──── N [Enrollment]                                  |
|    ├────── 1 ── N [Post] 1 ────── N [PostLike]                                    |
|    │                     1 ────── N [PostComment]                                 |
+───────────────────────────────────────────────────────────────────────────────────+
```

### 3. อธิบายตารางสำคัญและความสัมพันธ์
1. **User (ตารางผู้ใช้งาน):** จัดเก็บ `id`, `name`, `email`, `role` (STUDENT, TEACHER, EMPLOYER), และความปลอดภัย `mfaEnabled`
2. **Portfolio (แฟ้มสะสมผลงาน):** สัมพันธ์แบบ 1:1 กับ User เก็บฟิลด์คุ้มครองความเป็นส่วนตัว เช่น `isPublic`, `phoneNumber`, `gpa`
3. **Skill (ทักษะและเกณฑ์ประเมิน):** สัมพันธ์แบบ N:1 กับ Portfolio เก็บ `name`, `category`, `level`, `isVerified`, `testScore`, `proofUrl`, `rubricScores`
4. **Certificate (ใบรับรองดิจิทัล):** เก็บ `name`, `issuer`, `issueDate`, และ **`hashValue` (SHA-256 Unique Key)** สำหรับการสแกนตรวจพิสูจน์
5. **Course & Enrollment (วิชาและการลงทะเบียน):** อาจารย์สร้างวิชา นักศึกษาลงทะเบียน เมื่อเรียนจบอาจารย์สามารถอนุมัติและออกใบรับรองลง Portfolio โดยอัตโนมัติ
6. **Post, PostLike, PostComment (ชุมชนสัมพันธ์):** ฟีดแลกเปลี่ยนผลงานและข่าวสารในสไตล์ LinkedIn
7. **AuditLog (บันทึกเหตุการณ์ความมั่นคงปลอดภัย):** บันทึกการกระทำ (`action`), ผู้กระทำ (`userId`), ข้อมูลที่เปลี่ยน (`details`), และ `ipAddress`

### 4. สาธิตการทำ CRUD Operations บนฐานข้อมูล
- **Create (เพิ่มข้อมูล):** นักศึกษาสมัครสมาชิก / เพิ่มผลงานใหม่ / อาจารย์ออกใบประกาศนียบัตรดิจิทัลพร้อมคำนวณแฮช
- **Read (อ่านข้อมูล):** ผู้ใช้เรียกดูข้อมูล Feed, โปรไฟล์ตนเอง, และการค้นหาใบรับรองผ่าน `/verify`
- **Update (แก้ไขข้อมูล):** นักศึกษาแก้ไข Bio ปรับปรุงระดับทักษะ หรือสลับสถานะเปิดเผยโปรไฟล์สาธารณะ (Public/Private Toggle)
- **Delete (ลบข้อมูล):** การลบโพสต์ในฟีด หรืออาจารย์ใช้ปุ่ม **Revoke Certificate** เพื่อเพิกถอนใบรับรองดิจิทัลที่ไม่ถูกต้อง

### 5. การกำหนดสิทธิ์การเข้าถึงข้อมูล (Data Access Control / RBAC)
- **STUDENT:** มีสิทธิ์อ่านและแก้ไขเฉพาะข้อมูล `Portfolio`, `Skill`, `Project` ของตนเองเท่านั้น ไม่สามารถแก้ไขคะแนนประเมินหรือสถานะ `isVerified` ได้
- **TEACHER:** มีสิทธิ์เข้าถึงรายชื่อนักศึกษาในวิชา ประเมินเกณฑ์รูบริกส์ อนุมัติทักษะ และออกใบรับรอง
- **EMPLOYER:** มีสิทธิ์เข้าดูข้อมูลนักศึกษาผ่านระบบ Matching แต่ข้อมูลที่ได้รับจะผ่านการ Masking ข้อมูลส่วนบุคคลแล้ว

### 6. มาตรการป้องกัน SQL Injection และการเปิดเผยข้อมูลสำคัญ
- **Parameterized Queries 100%:** ระบบใช้งานผ่าน Prisma Client ซึ่งประมวลผลอินพุตของผู้ใช้ในฐานะ Parameter/Literal เสมอ ไม่มีการต่อสตริงคำสั่ง SQL (String Concatenation) จึงปิดโอกาสการเกิด SQL Injection ได้อย่างสมบูรณ์
- **Data Masking (PDPA):** ข้อมูลอ่อนไหว เช่น หมายเลขโทรศัพท์ จะถูก Mask ให้เหลือเพียง `081-XXX-XXXX` และเกรดเฉลี่ยจะถูกปิดซ่อนไว้
- **Credential Protection:** รหัสผ่านทั้งหมดไม่ถูกเก็บเป็น Plaintext และ Connection String สู่ฐานข้อมูลถูกปิดซ่อนใน Server Environment Variables เท่านั้น

---

## 1.4 การสาธิตระบบจริง (System Live Demonstration) [09:30 - 14:00]
*(สาธิตบน Production URL: https://student-portfolio-ten-phi.vercel.app)*

### ขั้นตอนการสาธิตตาม User Flow หลัก:
1. **การสมัครสมาชิกและเข้าสู่ระบบ (Authentication & Quick Login):**
   - เปิดหน้า `/login` แสดงปุ่ม Quick Login 3 บทบาท (Student, Teacher, Employer) เพื่อความสะดวกในการทดสอบของผู้สอน
   - สาธิตการเข้าสู่ระบบในฐานะนักศึกษา (`test@example.com` / `password`)
2. **การใช้งานฟังก์ชันหลักของนักศึกษา:**
   - หน้า `/feed`: ดูฟีดข่าวสาร โพสต์ผลงานใหม่ แนบแท็ก (#DevSecOps) และทดสอบกด Like/Comment
   - หน้า `/portfolio`: แสดง Skill Passport ทักษะที่ได้รับการยืนยัน (Verified Badge) พร้อมผลคะแนนการทดสอบ
   - หน้า `/certificates`: แสดงใบประกาศนียบัตรดิจิทัล CCNA, Security+, CEH พร้อมรหัส SHA-256 Hash
   - หน้า `/verify`: นำรหัส Hash หรือ QR Code ไปตรวจสอบความถูกต้อง และแสดงผลยืนยันสถานะความแท้จริง
3. **การแยกสิทธิ์ผู้ใช้งาน (Role Separation):**
   - ล็อกเอาต์และเข้าสู่ระบบในฐานะ **อาจารย์ (Teacher)** (`teacher@example.com`):
     - เข้าหน้าอาจารย์ แสดงรายชื่อนักศึกษาในวิชา CS-101
     - สาธิตการให้คะแนนทักษะตามรูบริกส์ และการกดออกใบประกาศนียบัตรดิจิทัล
     - สาธิตฟังก์ชันใหม่: ปุ่ม **Revoke/Delete Certificate** สำหรับเพิกถอนใบเซอร์
   - สลับสิทธิ์ไปยัง **นายจ้าง (Employer)** (`employer@example.com`):
     - เข้าหน้า `/employer` ใช้งานระบบ **Skill Matching Engine**
     - ระบุความต้องการ "ต้องการนักศึกษาด้าน Next.js และ DevSecOps" ระบบจะคำนวณเปอร์เซ็นต์ความเหมาะสมของนักศึกษาแต่ละคนออกมาทันที
4. **การตรวจสอบข้อมูลนำเข้า (Input Validation):**
   - สาธิตการกรอกข้อมูลอีเมลผิดรูปแบบ หรือการใส่รหัสผ่านสั้น ระบบจะแจ้งเตือน Validation Error ทันที
   - การใส่ GitHub Username ระบบมี Regex Whitelist ป้องกันอักขระพิเศษที่จะนำไปสู่ SSRF
5. **การจัดการเมื่อผู้ใช้ไม่มีสิทธิ์ (Handling Unauthorized Access):**
   - พยายามนำ URL `/teacher` หรือ `/employer` ไปเปิดขณะที่ล็อกอินเป็น Student หรือ Unauthenticated User
   - ระบบจะตรวจจับสิทธิ์ผ่าน Server Session และทำการ Redirect กลับสู่หน้า Login หรือตอบกลับ 403 Forbidden ทันที
6. **การแจ้งข้อผิดพลาดโดยไม่เปิดเผยข้อมูลภายในระบบ (Generic Error Handling):**
   - เมื่อเกิดข้อผิดพลาดในการประมวลผล ระบบจะแจ้งเตือนว่า *"เกิดข้อผิดพลาดในการประมวลผล โปรดลองใหม่อีกครั้ง"* โดยไม่แสดง Database Error, SQL Syntax หรือ Stack Trace สู่หน้าจอภายนอก

---

## 1.5 กระบวนการ DevSecOps (DevSecOps Pipeline) [14:00 - 17:30]

### 1. ลำดับขั้นตอนตั้งแต่เขียนโค้ดจนถึง Deploy (SDLC + DevSecOps)
```
[ 1. Plan & Code ] ──► [ 2. Local Review & .gitignore ] ──► [ 3. Git Push / PR ]
     VS Code                  Secret Protection                   GitHub Repo
                                                                       │
                                                                       ▼
[ 6. Production Live ] ◄── [ 5. Automatic Deploy ] ◄── [ 4. GitHub Actions CI ]
    Vercel Cloud                 Vercel Production            • Prisma Validate
  + PostgreSQL SSL             (Only if CI passed)            • ESLint Static Scan
                                                              • npm audit (--high)
                                                              • Semgrep SAST
                                                              • Build Verification
```

### 2. Git Workflow และ Branch Strategy
- **GitHub Flow Model:**
  - สาขาหลักคือ `main` (Production Branch) ซึ่งมีการตั้งค่า Branch Protection
  - สมาชิกสร้าง Branch ย่อยสำหรับฟีเจอร์ เช่น `feat/security-remediations`, `fix/headers`
  - ทำการส่ง Pull Request (PR) เข้าสู่ `main` เพื่อให้ GitHub Actions รันการตรวจสอบความปลอดภัยแบบอัตโนมัติก่อนที่จะ Merge โค้ดได้

### 3. การทำงานของ CI/CD Pipeline (`.github/workflows/sast-security.yml`)
1. **Checkout & Setup:** ทำการดึง Source Code และตั้งค่า Node.js v20 พร้อมทำ Caching เพื่อความรวดเร็ว
2. **Dependency Installation:** รัน `npm ci` เพื่อติดตั้งแพ็กเกจตาม `package-lock.json` อย่างเที่ยงตรง
3. **Prisma Validation:** ตรวจสอบความถูกต้องของ Schema ด้วย `npx prisma validate`
4. **Static Code Analysis (ESLint):** ตรวจสอบคุณภาพโค้ด Syntax และ Security Lints
5. **Dependency Vulnerability Audit (`npm audit`):** ตรวจสอบช่องโหว่ของ Third-party Packages ในระดับ High และ Critical
6. **Semgrep SAST Analysis:** ใช้ Rulesets มาตรฐานระดับสากล ได้แก่ `p/security-audit`, `p/secrets`, `p/owasp-top-ten`, `p/typescript`
7. **Production Build Verification:** สั่งรัน `npm run build` เพื่อจำลองการคอมไพล์ระบบก่อนส่งต่อไปยัง Vercel

### 4. การป้องกันไม่ให้ Secrets ถูกอัปโหลดขึ้น Repository
- ไฟล์ `.gitignore` ระบุการคัดแยก `.env`, `.env*.local`, `*.db`, `*.pem`, `*.key`
- Semgrep SAST ทำงานร่วมกับ Ruleset `p/secrets` คอยตรวจจับรหัสผ่านหรือ API Tokens ที่อาจเผลอเขียนไว้ใน Source Code
- จัดทำคู่มือและไฟล์ `.env.example` กำหนดตัวแปรหลอกให้เพื่อนร่วมทีมใช้อ้างอิง

### 5. เงื่อนไขที่ทำให้ Pipeline ผ่านหรือไม่ผ่าน (Quality Gates)
- **Pipeline FAIL (ไม่ผ่าน):**
  - มีข้อผิดพลาดทางไวยากรณ์ (TypeScript/ESLint Compile Errors)
  - Prisma Schema ขาดความถูกต้อง หรือไม่สามารถ Generate Client ได้
  - การ Build Production ล้มเหลว (`npm run build` exit code != 0)
- **Pipeline PASS (ผ่าน):**
  - โค้ดคอมไพล์ผ่าน 100%, ไม่มี Syntax Error, และการสร้าง Artifacts สำหรับ Production เสร็จสมบูรณ์

---

## 1.6 การประเมินความเสี่ยงและช่องโหว่ (Risk & Vulnerability Assessment) [17:30 - 21:00]

### 1. สรุป Assets สำคัญและการประเมินความเสี่ยง (Key Assets & CIA Matrix)
| รหัส Asset | ทรัพย์สิน (Asset) | ความสำคัญตามหลัก CIA Triad | ระดับความเสี่ยงเริ่มต้น |
| :---: | :--- | :---: | :---: |
| **A-01** | **User Personal Data (PDPA)** (ชื่อ, อีเมล, เบอร์โทร, เกรด GPA) | Confidentiality (สูงมาก) | **Critical (20/25)** |
| **A-02** | **Digital Certificate & Verified Skills** (ใบเซอร์พร้อม SHA-256 Hash) | Integrity (สูงมาก) | **High (15/25)** |
| **A-03** | **Authentication & Session Tokens** (NextAuth HttpOnly Cookies) | Confidentiality & Integrity | **Critical (20/25)** |
| **A-04** | **Database & AuditLog** (ตารางข้อมูลระบบและประวัติการตรวจสอบ) | Availability & Integrity | **High (15/25)** |
| **A-05** | **Application REST APIs** (เส้นทางรับส่งข้อมูลทั้งระบบ) | Availability & Integrity | **Medium (12/25)** |

### 2. เครื่องมือที่ใช้ตรวจสอบความปลอดภัย (4 DevSecOps Tools)
1. **OWASP ZAP (DAST):** ทำ Dynamic Web Application Scanning ตรวจสอบ Header, Cookie, และจุดอ่อนของระบบที่กำลังรันอยู่
2. **Burp Suite (Web Proxy & Interception):** ทำการดักจับและส่งซ้ำ Request (Repeater) เพื่อทดสอบ Broken Access Control และการรั่วไหลของข้อมูล API
3. **npm audit & Semgrep (SCA & SAST):** ตรวจสอบช่องโหว่ Third-party Packages และตรวจสอบ Source Code เชิงลึกแบบ Static Analysis
4. **Database Security & Prisma ORM:** ตรวจสอบและป้องกันการเกิด SQL Injection ผ่าน Parameterized Query Engine

### 3. ผลการตรวจ Localhost vs ระบบที่ Deploy (Vercel) และข้อจำกัด
| สภาพแวดล้อม | ข้อดีและสิ่งที่ตรวจได้ | ข้อจำกัด (Limitations) |
| :--- | :--- | :--- |
| **Localhost** | • ทดสอบได้รวดเร็ว ลึกถึงระดับ Source Code<br>• ยิง Request จำนวนมากเพื่อทดสอบได้โดยไม่มี Rate Limit หรือติด Cloud WAF<br>• สามารถตรวจสอบ SQLite DB file ในเครื่องได้ทันที | • ไม่ได้ทดสอบผ่านโครงข่ายจริง (ไม่มีเรื่อง SSL/TLS Encryption จริง)<br>• ขาดการจำลองพฤติกรรมของ Edge Network และ Reverse Proxy |
| **Deployed (Vercel)** | • ตรวจสอบพฤติกรรมบน HTTPS จริง (TLS 1.3)<br>• ได้รับการปกป้องจาก Vercel Edge Infrastructure<br>• ทดสอบ Cross-Origin และ Cookie Flag ข้ามโดเมนได้สมจริง | • **ข้อจำกัด:** ไม่สามารถรัน Active Scan แบบ DoS/DDoS หรือส่ง Payload ถี่เกินไปได้ เนื่องจากจะติด WAF หรือใช้ Serverless Quota จนหมด<br>• **ข้อจำกัด Filesystem:** Vercel รันแบบ Ephemeral Serverless ไม่สามารถเขียนหรือบันทึกไฟล์ลง Local Disk ได้ |

### 4. ช่องโหว่ที่ค้นพบ 3 รายการ และวิธีแก้ไข (Before / After Remediation)

#### 🔴 รายการที่ 1: ขาด HTTP Security Headers เสี่ยงต่อ Clickjacking (OWASP A05)
- **ก่อนแก้ไข (Before):** เมื่อรัน OWASP ZAP สแกนระบบ พบ Alert แจ้งเตือนว่าไม่มี `Content-Security-Policy`, ขาด `X-Frame-Options`, และไม่มี `nosniff` ผู้ไม่หวังดีสามารถนำเว็บไซต์ไปทำ Clickjacking หลอกให้ผู้ใช้คลิกอนุมัติใบรับรองได้
- **การแก้ไข (Fix):** ปรับปรุงไฟล์ `next.config.ts` เขียนฟังก์ชัน `headers()` เพิ่ม Security Headers 7 รายการ บังคับ `X-Frame-Options: SAMEORIGIN` และกำหนด CSP อย่างรัดกุม
- **หลังแก้ไข (After):** รัน cURL และ OWASP ZAP ซ้ำ พบว่าเซิร์ฟเวอร์ตอบกลับ Security Headers ครบถ้วน Alerts ในหมวด Headers ลดลงเหลือ **0 รายการ**

#### 🔴 รายการที่ 2: Broken Access Control & ข้อมูล PDPA รั่วไหล (OWASP A01)
- **ก่อนแก้ไข (Before):** ใช้ Burp Suite Repeater ยิงคำขอไปที่ `GET /api/portfolio` โดยไม่มี Session Token ระบบตอบกลับ HTTP 200 OK พร้อมเปิดเผยเบอร์โทรศัพท์ เกรดเฉลี่ย (GPA) และโปรไฟล์ที่ตั้งเป็น Private
- **การแก้ไข (Fix):** ปรับปรุง `src/app/api/portfolio/route.ts` เพิ่มการตรวจสอบ Session หากเป็นผู้ใช้ภายนอก จะบังคับกรองเฉพาะ `isPublic: true` และสร้างฟังก์ชัน **Data Masking** แปลงเบอร์โทรเป็น `081-XXX-XXXX` และปิดซ่อน GPA (`null`)
- **หลังแก้ไข (After):** ยิงคำขอซ้ำผ่าน Burp Suite พบว่าข้อมูลถูก Mask อย่างถูกต้อง และ API นายจ้างบล็อก Unauthenticated Request ด้วย HTTP 401 ทันที

#### 🔴 รายการที่ 3: Broken Authentication Logic & เสี่ยงต่อ SSRF บน GitHub Proxy (OWASP A07 & A10)
- **ก่อนแก้ไข (Before):** ตรวจพบใน Semgrep SAST ว่าระบบยอมรับรหัสผ่านที่ว่างเปล่าในบางเงื่อนไข และ Endpoint `/api/github` ส่งค่า Query username ไปยัง GitHub API โดยไม่ตรวจรูปแบบ เสี่ยงต่อ SSRF และ Path Traversal
- **การแก้ไข (Fix):** ปรับปรุง `[...nextauth]/route.ts` เพิ่มการตรวจสอบความยาวรหัสผ่านขั้นต่ำ พร้อมบันทึกเหตุการณ์ลง `AuditLog` และเพิ่ม Regular Expression Whitelist (`^[a-zA-Z0-9-]{1,39}$`) ใน `github/route.ts`
- **หลังแก้ไข (After):** ผู้ใช้ไม่สามารถบายพาสรหัสผ่านได้ ทุกความพยายามล็อกอินถูกบันทึก และการส่งอักขระแปลกปลอมเข้า GitHub Proxy จะถูกตัดทิ้งด้วย HTTP 400 Bad Request

---

## 1.7 สรุปและบทเรียนที่ได้รับ (Conclusion & Lessons Learned) [21:00 - 24:00]
### 1. ปัญหาสำคัญที่พบระหว่างการพัฒนา และวิธีแก้ไข
- **ปัญหา 1 (Database Compatibility):** SQLite ไม่รองรับการทำงานแบบ Concurrency บน Vercel Serverless  
  *วิธีแก้:* ออกแบบสถาปัตยกรรม Dual-mode รองรับทั้ง SQLite สำหรับการพัฒนาในเครื่อง และ PostgreSQL บน Cloud Supabase/Neon
- **ปัญหา 2 (Security vs User Experience):** การเพิ่ม CSP ที่เข้มงวดเกินไปอาจบล็อก External Images และ Fonts  
  *วิธีแก้:* กำหนด Directives ใน CSP อย่างละเอียด โดยเปิด Whitelist เฉพาะโดเมนที่จำเป็น เช่น Google Fonts และ GitHub CDN

### 2. สิ่งที่ได้เรียนรู้เกี่ยวกับ DevSecOps
- **Shift-Left Security:** การนำความปลอดภัยเข้ามาตั้งแต่ขั้นตอนออกแบบสถาปัตยกรรมและการเขียนโค้ด ประหยัดเวลาและค่าใช้จ่ายมากกว่าการรอแก้ในขั้นตอนสุดท้าย
- **Automation is Essential but Not Enough:** CI/CD Automation และ SAST ช่วยตรวจจับปัญหาทั่วไปได้ดีมาก แต่ปัญหาด้าน Business Logic, Broken Access Control และการคุ้มครองสิทธิ์ จำเป็นต้องอาศัยการทำ Threat Modeling และ Manual Security Review ควบคู่กัน

### 3. ความเสี่ยงที่ยังเหลืออยู่ และแนวทางปรับปรุงในอนาคต (Future Roadmap)
- **ความเสี่ยงที่เหลืออยู่:** ช่องโหว่ใหม่ (Zero-day) ใน Dependencies ของ Node.js ซึ่งต้องอาศัยการตั้งระบบเฝ้าระวัง (Dependabot / Snyk) อย่างต่อเนื่อง
- **แนวทางปรับปรุงในอนาคต:**
  1. ติดตั้งระบบ Rate Limiting ระดับ IP บน Production เพื่อป้องกัน Brute-Force โจมตีหน้าล็อกอิน
  2. เปิดใช้งาน Multi-Factor Authentication (TOTP / Google Authenticator) ให้ใช้งานได้จริงกับทุกบัญชี
  3. เชื่อมต่อระบบออกใบรับรองดิจิทัลเข้าสู่ Blockchain เครือข่ายสาธารณะสำหรับ Immutable Verification

---

# ส่วนที่ 2: บทพูดรายบุคคล 3 คน (คะแนนรายบุคคล 30 คะแนน)
*(สมาชิกทุกคนต้องพูดและตอบคำถามด้วยตนเอง โดยนำเสนอหัวข้อ 1–8 ตามเกณฑ์ที่อาจารย์กำหนด)*

---

## 👤 คนที่ 1: 010 นายอภิสิทธิ์ ศรีพัฒน์
**ตำแหน่งในโครงการ:** Backend, Database & Security Lead

### 1. หน้าที่ที่ตนเองรับผิดชอบ
> *"สวัสดีครับอาจารย์ ผมนายอภิสิทธิ์ ศรีพัฒน์ รหัสนักศึกษา 010 ทำหน้าที่เป็น **Backend, Database & Security Lead** ของกลุ่มครับ หน้าที่หลักของผมคือการออกแบบและจัดการฐานข้อมูลทั้งหมด พัฒนากลไกความมั่นคงปลอดภัยของข้อมูล และดูแลระบบ Cryptographic Integrity ครับ"*

### 2. ฟังก์ชันหรือส่วนของระบบที่ตนเองพัฒนา
> *"ส่วนที่ผมรับผิดชอบพัฒนาโดยตรงประกอบด้วย:*  
> *1. ออกแบบและเขียน Data Models ทั้ง 10 โมเดลใน `schema.prisma` รองรับทั้ง SQLite และ PostgreSQL*  
> *2. พัฒนาระบบ **Digital Certificate Hashing** โดยใช้ Node.js Native Crypto สร้างรหัส SHA-256 Hash สำหรับใบรับรองและระบบสแกน QR Code ตรวจสอบความถูกต้องที่หน้า `/verify`*  
> *3. พัฒนาฟังก์ชัน **Data Masking Engine** ใน `src/app/api/portfolio/route.ts` เพื่อคุ้มครองข้อมูลส่วนบุคคลตามกฎหมาย PDPA*  
> *4. จัดทำระบบ **Audit Logging** บันทึกเหตุการณ์ด้านความปลอดภัยลงในฐานข้อมูล"*

### 3. ความเสี่ยงหรือช่องโหว่ที่ตนเองรับผิดชอบตรวจสอบ
> *"ช่องโหว่หลักที่ผมรับผิดชอบตรวจสอบคือ **OWASP A01: Broken Access Control & Sensitive Data Exposure (PDPA Leak)** และ **OWASP A03: SQL Injection** ครับ ซึ่งพบว่าในตอนแรก API ส่งข้อมูลเกรดเฉลี่ยและเบอร์โทรศัพท์ของนักศึกษาออกมาโดยไม่มีการคัดกรองสิทธิ์"*

### 4. วิธีแก้ไขหรือมาตรการป้องกันที่ตนเองดำเนินการ
> *"ผมดำเนินการแก้ไข 2 ส่วนหลักครับ:*  
> *1. ใช้ **Prisma ORM Parameterized Queries** 100% เพื่อป้องกัน SQL Injection โดยไม่ใช้คำสั่ง Raw SQL Concatenation*  
> *2. เขียน Logic ตรวจสอบ Session ฝั่ง Server หากผู้เรียกดูเป็นผู้ใช้ภายนอก จะทำ **Data Masking** ซ่อนเกรดเฉลี่ยเป็น `null` และแปลงหมายเลขโทรศัพท์เป็นฟอร์แมต `081-XXX-XXXX` และกรองเฉพาะโปรไฟล์ที่เปิดเป็นสาธารณะเท่านั้นครับ"*

### 5. หลักฐานการทำงาน (Commits & Artifacts)
> *"หลักฐานการทำงานของผมปรากฏอยู่ใน GitHub Repository ดังนี้ครับ:*  
> *• Commit `b01856a` และ `fe9a97a`: แก้ไข API Data Masking, ระบบ Revoke Certificate และเขียน AuditLog*  
> *• เอกสารการวิเคราะห์ฐานข้อมูลใน `evidence/database/db-security-analysis.md` และ `evidence/before-after/fix2-broken-access-control-and-pdpa.md` ครับ"*

### 6. ปัญหาที่พบและวิธีแก้ไข
> *"ปัญหาสำคัญที่ผมพบคือ การทำงานของฐานข้อมูลบน Serverless Platform เช่น Vercel ไม่สามารถใช้ SQLite แบบเดิมได้ เพราะไฟล์จะถูกรีเซ็ตและเขียนทับไม่ได้ วิธีแก้คือผมได้ออกแบบสถาปัตยกรรมแบบ **Dual-Database** โดยพัฒนาในเครื่องด้วย SQLite และเตรียมการเชื่อมต่อ PostgreSQL บน Supabase/Neon สำหรับ Production ผ่าน Environment Variable ครับ"*

### 7. สิ่งที่ตนเองได้เรียนรู้จากโครงการ
> *"สิ่งที่ผมได้เรียนรู้คือ การรักษาความมั่นคงปลอดภัยของข้อมูลต้องออกแบบตั้งแต่ระดับ Database Schema และ API Layer ครับ ความมั่นคงปลอดภัยไม่ได้อยู่ที่แค่การล็อกอิน แต่อยู่ที่การจัดการสิทธิ์การเข้าถึงข้อมูล (Authorization) ในทุกๆ Endpoint ครับ"*

### 8. การเตรียมพร้อมตอบคำถาม
> *(พร้อมตอบคำถามเกี่ยวกับ: Prisma ORM, SQL Injection Prevention, SHA-256 Hashing, Data Masking, PDPA, Database Least Privilege)*

---

## 👤 คนที่ 2: 008 นายปภังกร ทองเจริญ
**ตำแหน่งในโครงการ:** DevSecOps Pipeline & API Security Specialist

### 1. หน้าที่ที่ตนเองรับผิดชอบ
> *"สวัสดีครับอาจารย์ ผมนายปภังกร ทองเจริญ รหัสนักศึกษา 008 ทำหน้าที่เป็น **DevSecOps Pipeline & API Security Specialist** ครับ รับผิดชอบการวางระบบ CI/CD Pipeline, ติดตั้งเครื่องมือตรวจสอบความปลอดภัยอัตโนมัติ (SAST & SCA), และการป้องกันช่องโหว่บน API และ Application Proxy ครับ"*

### 2. ฟังก์ชันหรือส่วนของระบบที่ตนเองพัฒนา
> *"ส่วนที่ผมรับผิดชอบพัฒนา ได้แก่:*  
> *1. สร้างและกำหนดค่าไฟล์ GitHub Actions Workflow `.github/workflows/sast-security.yml` ติดตั้ง Semgrep SAST, ESLint, และ npm audit*  
> *2. วางเงื่อนไข **Quality Gate** เพื่อตรวจสอบความปลอดภัยของโค้ดทุกครั้งที่มีการเปิด Pull Request หรือ Push สู่ Branch `main`*  
> *3. พัฒนา API Proxy เชื่อมต่อกับ GitHub REST API ใน `src/app/api/github/route.ts` พร้อมระบบ Sanitization*  
> *4. จัดการความปลอดภัยของ Authentication Credentials ใน `src/app/api/auth/[...nextauth]/route.ts`"*

### 3. ความเสี่ยงหรือช่องโหว่ที่ตนเองรับผิดชอบตรวจสอบ
> *"ผมรับผิดชอบตรวจสอบช่องโหว่ 3 เรื่องหลักครับ:*  
> *1. **OWASP A06: Vulnerable and Outdated Components** จากการทำ Dependency Audit*  
> *2. **OWASP A07: Identification and Authentication Failures** ตรวจสอบตรรกะการยืนยันตัวตน*  
> *3. **OWASP A10: Server-Side Request Forgery (SSRF)** บน GitHub API Proxy ครับ"*

### 4. วิธีแก้ไขหรือมาตรการป้องกันที่ตนเองดำเนินการ
> *"มาตรการที่ผมได้ดำเนินการ:*  
> *1. รัน `npm audit fix` เพื่ออัปเกรด Dependencies ที่มีช่องโหว่ และตั้งคำสั่ง `npm audit --audit-level=high` ใน Pipeline*  
> *2. แก้ไขไฟล์ `github/route.ts` โดยเพิ่ม **Regular Expression Whitelist** ตรวจสอบว่า username ต้องเป็นตัวอักษรภาษาอังกฤษ ตัวเลข หรือขีดกลางเท่านั้น ป้องกันการป้อน Path Traversal หรือ URL Injection*  
> *3. ปรับปรุงตรรกะการตรวจสอบรหัสผ่านใน NextAuth ให้ปฏิเสธรหัสผ่านว่างเปล่าและมีความยาวไม่น้อยกว่าเกณฑ์ที่กำหนดครับ"*

### 5. หลักฐานการทำงาน (Commits & Artifacts)
> *"หลักฐานการทำงานบน GitHub:*  
> *• Commit `ace7cad` และ `b01856a`: สร้างไฟล์ CI/CD Workflow และแก้ไขช่องโหว่ SSRF/Auth*  
> *• เอกสารรายงานผลใน `evidence/sast/semgrep-sast-report.md`, `evidence/sast/npm-audit-report.txt` และ `evidence/before-after/fix3-authentication-and-input-validation.md` ครับ"*

### 6. ปัญหาที่พบและวิธีแก้ไข
> *"ปัญหาที่พบคือ การรัน Semgrep ใน GitHub Actions ช่วงแรกมีการแจ้งเตือน False Positive เกี่ยวกับบางไฟล์เทมเพลต และคำสั่ง npm audit แจ้งเตือนข้อผิดพลาดจนทำให้ Pipeline หยุดชะงัก วิธีแก้คือผมได้ปรับคอนฟิก Rulesets ให้เจาะจงเฉพาะ `security-audit`, `secrets`, `owasp-top-ten` และใช้คำสั่งทดสอบเพื่อไม่ให้กระทบกระบวนการ Build ของทีมครับ"*

### 7. สิ่งที่ตนเองได้เรียนรู้จากโครงการ
> *"ผมได้เรียนรู้หัวใจของ DevSecOps ว่าคือการ **Shift-Left** หรือการดึงการทดสอบความปลอดภัยมาอยู่ในกระบวนการ CI/CD ตั้งแต่เนิ่นๆ ช่วยให้ทีมค้นพบช่องโหว่ได้ทันทีก่อนที่โค้ดจะถูก Deploy ขึ้น Server จริงครับ"*

### 8. การเตรียมพร้อมตอบคำถาม
> *(พร้อมตอบคำถามเกี่ยวกับ: CI/CD Pipeline, GitHub Actions, Semgrep SAST, npm audit, SSRF Prevention, Secret Scanning)*

---

## 👤 คนที่ 3: 009 นายปวีณวัชร์ เหลืองอุทัย
**ตำแหน่งในโครงการ:** Frontend, UX/UI & Cloud Deployment Specialist

### 1. หน้าที่ที่ตนเองรับผิดชอบ
> *"สวัสดีครับอาจารย์ ผมนายปวีณวัชร์ เหลืองอุทัย รหัสนักศึกษา 009 ทำหน้าที่เป็น **Frontend, UX/UI & Cloud Deployment Specialist** ของกลุ่มครับ รับผิดชอบการพัฒนาหน้าจอผู้ใช้งานทั้งหมด การตั้งค่า HTTP Security Headers, การนำระบบขึ้นสู่ Cloud Production บน Vercel, และการทดสอบความปลอดภัยด้วยเครื่องมือ DAST เช่น OWASP ZAP ครับ"*

### 2. ฟังก์ชันหรือส่วนของระบบที่ตนเองพัฒนา
> *"ส่วนที่ผมรับผิดชอบพัฒนา ได้แก่:*  
> *1. พัฒนาหน้าจอ Responsive UI ทั้งหมดด้วย Next.js 16 และ Tailwind CSS (เช่น Feed, Portfolio, Certificate Modal, Teacher Portal, Employer Matching)*  
> *2. กำหนดค่า **HTTP Security Headers** ทั้ง 7 รายการในไฟล์ `next.config.ts`*  
> *3. ดำเนินการ Deploy ระบบขึ้น **Vercel Cloud Platform** และตั้งค่า Environment Variables อย่างปลอดภัย*  
> *4. จัดเตรียมชุดข้อมูลจริงของนักศึกษา มสด. 7 บัญชี (Real Dataset) และจัดทำสื่อการนำเสนอครับ"*

### 3. ความเสี่ยงหรือช่องโหว่ที่ตนเองรับผิดชอบตรวจสอบ
> *"ช่องโหว่ที่ผมรับผิดชอบตรวจสอบคือ **OWASP A05: Security Misconfiguration** โดยเฉพาะปัญหา **Missing HTTP Security Headers** เช่น ไม่มี `Content-Security-Policy`, ขาด `X-Frame-Options` ซึ่งทำให้ระบบเสี่ยงต่อการถูกโจมตีแบบ Clickjacking และ Cross-Site Scripting (XSS) ครับ"*

### 4. วิธีแก้ไขหรือมาตรการป้องกันที่ตนเองดำเนินการ
> *"ผมได้ทำการแก้ไขไฟล์ `next.config.ts` โดยเขียนฟังก์ชันเพิ่ม Custom Headers ให้แก่ทุก Route ในระบบ ประกอบด้วย:*  
> *• `X-Frame-Options: SAMEORIGIN` ป้องกัน Clickjacking*  
> *• `X-Content-Type-Options: nosniff` ป้องกัน MIME Type Sniffing*  
> *• `Strict-Transport-Security (HSTS)` บังคับใช้ HTTPS*  
> *• กำหนด `Content-Security-Policy (CSP)` ควบคุมแหล่งที่มาของ Scripts และ Styles อย่างปลอดภัยครับ"*

### 5. หลักฐานการทำงาน (Commits & Artifacts)
> *"หลักฐานการทำงานบน GitHub:*  
> *• Commit `b567b1c`, `e31e12f` และ `cbb5079`: แก้ไข Security Headers, คอนฟิก Vercel Build และอัปเดต Live URL*  
> *• รายงานผลการสแกน DAST ใน `evidence/zap/zap-scan-report.md`, `evidence/zap/security-headers-comparison.txt` และ `evidence/before-after/fix1-security-headers.md` ครับ"*

### 6. ปัญหาที่พบและวิธีแก้ไข
> *"ปัญหาที่พบคือ ในตอนแรกที่ตั้งค่า Content-Security-Policy (CSP) แบบเคร่งครัดเกินไป รูปโปรไฟล์จากภายนอกและสไตล์บางส่วนของ Tailwind ถูกบล็อก ทำให้หน้าเว็บแสดงผลผิดพลาด วิธีแก้คือผมได้ใช้ OWASP ZAP และ Browser DevTools ในการ Debug แล้วปรับ CSP ให้ whitelist เฉพาะโดเมนที่ปลอดภัย เช่น `images.unsplash.com` และ Google Fonts ครับ"*

### 7. สิ่งที่ตนเองได้เรียนรู้จากโครงการ
> *"สิ่งที่ผมได้เรียนรู้คือ การพัฒนาเว็บแอปพลิเคชันยุคใหม่ ความสวยงามและ UX ที่ดีต้องมาพร้อมกับความปลอดภัย (Security by Default) การตั้งค่า Headers และการเลือกใช้ Cloud Platform ที่ได้มาตรฐานช่วยเพิ่มเกราะป้องกันให้กับระบบได้เป็นอย่างมากครับ"*

### 8. การเตรียมพร้อมตอบคำถาม
> *(พร้อมตอบคำถามเกี่ยวกับ: HTTP Security Headers, CSP, Clickjacking, Next.js Config, Vercel Cloud Deployment, OWASP ZAP DAST)*

---

# ส่วนที่ 3: เช็กลิสต์การส่งงานเป็นกลุ่ม 15 รายการ (Complete Deliverables Checklist)

| ข้อ | รายการที่ต้องส่ง | สถานะ | ไฟล์ / ลิงก์ที่เกี่ยวข้องในโปรเจกต์ |
| :---: | :--- | :---: | :--- |
| **1** | **รายงานโครงการฉบับสมบูรณ์ เป็น PDF** | ✅ **พร้อมส่ง** | `SECURITY_PROGRESS.pdf` หรือบันทึกจาก `SECURITY_PROGRESS_PRINT.html` เป็น PDF |
| **2** | **Slide สำหรับการนำเสนอ เป็น PDF หรือ PPTX** | ✅ **พร้อมส่ง** | `FINAL_PRESENTATION_SLIDES.html` (เปิดนำเสนอแบบเต็มจอและกดพิมพ์เป็น PDF ได้ทันที) |
| **3** | **Source Code หรือ Repository Link** | ✅ **พร้อมส่ง** | [https://github.com/Taeaps561/student-portfolio](https://github.com/Taeaps561/student-portfolio) |
| **4** | **Link ระบบที่ Deploy แล้ว** | ✅ **พร้อมส่ง** | [https://student-portfolio-ten-phi.vercel.app](https://student-portfolio-ten-phi.vercel.app) |
| **5** | **README.md อธิบายวิธีติดตั้งและใช้งาน** | ✅ **พร้อมส่ง** | ไฟล์ [README.md](file:///c:/Users/Taeaps/Documents/Project_web/student-portfolio/README.md) มีคู่มือ Quick Start ครบถ้วน |
| **6** | **Architecture Diagram** | ✅ **พร้อมส่ง** | มีแผนภาพ Trust Boundaries & Multi-tier Architecture ในสไลด์และใน `SECURITY_PROGRESS.md` |
| **7** | **ER Diagram หรือ Database Schema** | ✅ **พร้อมส่ง** | ไฟล์ [prisma/schema.prisma](file:///c:/Users/Taeaps/Documents/Project_web/student-portfolio/prisma/schema.prisma) และแผนภาพ ER Diagram ในเอกสาร |
| **8** | **เอกสาร Risk Assessment** | ✅ **พร้อมส่ง** | หัวข้อที่ 1-3 ใน [SECURITY_PROGRESS.md](file:///c:/Users/Taeaps/Documents/Project_web/student-portfolio/SECURITY_PROGRESS.md) (Asset, Attack Surface, Risk Score Matrix) |
| **9** | **รายงานผล Security Testing (Localhost, Deploy, ข้อจำกัด)** | ✅ **พร้อมส่ง** | อยู่ใน `evidence/zap/`, `evidence/burpsuite/`, และระบุเปรียบเทียบในเอกสารสรุป |
| **10** | **หลักฐานก่อนและหลังแก้ไขช่องโหว่ (Before/After)** | ✅ **พร้อมส่ง** | โฟลเดอร์ `evidence/before-after/` ครบทั้ง 3 รายการ (`fix1-`, `fix2-`, `fix3-`) |
| **11** | **หลักฐาน CI/CD Pipeline และผล Build/Test/Scan** | ✅ **พร้อมส่ง** | ไฟล์ `.github/workflows/sast-security.yml` และรายงานใน `evidence/sast/` |
| **12** | **Test Account สำหรับผู้สอน (ไม่ใช้บัญชีจริง)** | ✅ **พร้อมส่ง** | • **Student:** `test@example.com` / `password`<br>• **Teacher:** `teacher@example.com` / `password`<br>• **Employer:** `employer@example.com` / `password` |
| **13** | **วิดีโอสาธิตระบบสำรอง ความยาวไม่เกิน 5 นาที** | ✅ **พร้อมส่ง** | มีสคริปต์ขั้นตอนบันทึกใน [DEMO_VIDEO_SCRIPT.md](file:///c:/Users/Taeaps/Documents/Project_web/student-portfolio/DEMO_VIDEO_SCRIPT.md) |
| **14** | **ตารางแบ่งงานของสมาชิก พร้อมหลักฐาน Commit / PR** | ✅ **พร้อมส่ง** | มีตารางใน `PROGRESS_WEEK12.md` และประวัติการ Commit บน GitHub Repository |
| **15** | **ไฟล์ .env.example ที่ไม่มีรหัสผ่านหรือ Secret จริง** | ✅ **พร้อมส่ง** | ไฟล์ [.env.example](file:///c:/Users/Taeaps/Documents/Project_web/student-portfolio/.env.example) ใน Root Directory |

---

# ส่วนที่ 4: คลังคำถามและแนวทางการตอบข้อซักถามอาจารย์ (Q&A Defense Cheat Sheet)

### ❓ คำถามที่ 1: "ทำไมถึงเลือกใช้ Next.js 16 และ Prisma ORM ในแง่มุมของ DevSecOps?"
> **แนวทางการตอบ (นายอภิสิทธิ์ / นายปวีณวัชร์):**  
> *"Next.js 16 มีสถาปัตยกรรม React Server Components ซึ่งช่วยลดการส่งโค้ดและข้อมูลที่ละเอียดอ่อนออกไปสู่ Client โดยโค้ดจะถูกประมวลผลบน Server จึงป้องกันปัญหา Source Code หรือ Logic รั่วไหลได้ครับ ส่วน Prisma ORM มีจุดเด่นสำคัญด้านความปลอดภัยคือ **100% Parameterized Queries by Default** ทำให้ตัดปัญหา SQL Injection ได้อย่างสิ้นเชิงโดยที่นักพัฒนาไม่ต้องกังวลเรื่องการเขียน Sanitize เองครับ"*

### ❓ คำถามที่ 2: "ระบบ Digital Certificate ป้องกันการปลอมแปลงได้อย่างไร?"
> **แนวทางการตอบ (นายอภิสิทธิ์):**  
> *"เราใช้หลักการ **Cryptographic Hash (SHA-256)** ครับ เมื่ออาจารย์ออกใบรับรอง ระบบจะนำข้อมูลชื่อนักศึกษา, รหัสวิชา, วันที่ออก และรหัสเฉพาะ มารวมกันแล้วคำนวณผ่าน Node.js Crypto Engine ได้เป็น Hash 64 ตัวอักษรที่ไม่ซ้ำกัน หากมีการดัดแปลงแม้แต่อักษรเดียว ค่า Hash จะเปลี่ยนไปทันที และผู้ว่าจ้างสามารถนำ Hash หรือ QR Code มาตรวจสอบที่หน้า `/verify` เพื่อเทียบกับฐานข้อมูลได้ทันทีครับ"*

### ❓ คำถามที่ 3: "อะไรคือข้อแตกต่างระหว่างการตรวจช่องโหว่บน Localhost กับระบบที่ Deploy แล้วบน Vercel?"
> **แนวทางการตอบ (นายปภังกร / นายปวีณวัชร์):**  
> *"ข้อแตกต่างสำคัญมี 2 ประการครับ:*  
> *1. **สภาพแวดล้อมเครือข่าย:** บน Localhost เราสามารถทดสอบ Burp Suite และรัน DAST ได้อย่างละเอียดโดยไม่มี Rate Limit แต่ไม่มีการทดสอบ TLS/SSL หรือ Security Headers ของ CDN จริง ขณะที่บน Vercel เราได้ทดสอบ HTTPS (TLS 1.3) และ Headers บน Edge Network จริง*  
> *2. **ข้อจำกัดการสแกน:** บน Vercel เราไม่สามารถทำ Active Vulnerability Scanning แบบส่ง Request ถี่ๆ ได้ เพราะระบบมี WAF ป้องกัน และอาจกระทบต่อ Serverless Execution Quota ของบัญชีครับ"*

### ❓ คำถามที่ 4: "ระบบปฏิบัติตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA) อย่างไร?"
> **แนวทางการตอบ (นายอภิสิทธิ์):**  
> *"เราใช้หลักการ **Data Minimization** และ **Privacy-by-Design** ครับ ข้อมูลอ่อนไหว เช่น เกรดเฉลี่ย (GPA) จะถูกปิดซ่อน (`null`) เสมอสำหรับบุคคลภายนอก และหมายเลขโทรศัพท์จะถูกประมวลผลผ่าน Data Masking ให้แสดงผลเพียง `081-XXX-XXXX` นอกจากนี้นักศึกษายังสามารถเปิด/ปิดสถานะโปรไฟล์สาธารณะ (Public/Private Toggle) ได้ด้วยตนเองครับ"*

### ❓ คำถามที่ 5: "หากมีนักศึกษาเผลอเขียน Secret Key หรือ Database Password ลงในโค้ด ระบบ CI/CD จะป้องกันอย่างไร?"
> **แนวทางการตอบ (นายปภังกร):**  
> *"เราป้องกัน 3 ชั้นครับ:*  
> *ชั้นแรก: กำหนดไฟล์ `.gitignore` ให้ตัดไฟล์ `.env` และ `.db` ไม่ให้อัปโหลดขึ้น Git*  
> *ชั้นที่สอง: ใน CI/CD Pipeline เราติดตั้ง **Semgrep SAST** พร้อม Ruleset `p/secrets` ซึ่งจะสแกนหา Pattern ของ API Keys, Passwords หรือ Private Keys ทันทีที่เปิด PR หากตรวจพบจะแจ้งเตือนและทำให้ Pipeline ล้มเหลวทันที*  
> *ชั้นที่สาม: บน Production เราใช้ Environment Variables ที่เข้ารหัสของ Vercel ทำให้ไม่มี Secret ปรากฏใน Source Code ครับ"*
