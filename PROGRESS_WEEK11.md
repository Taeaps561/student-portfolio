# 📋 รายงานความคืบหน้าโครงงาน (Project Status Report) — สัปดาห์ที่ 11
**รายวิชา:** การพัฒนาเว็บแอปพลิเคชันให้มีความมั่นคงปลอดภัย (Secure Web Application Development)  
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

### ✅ ส่วนหลักที่พัฒนาเสร็จแล้ว (Completed Tasks — 85%)
1. **Authentication:** ระบบสามารถ Login และ Logout ได้ รวมถึงมีการจัดการ Session ของผู้ใช้งานอย่างปลอดภัยด้วย NextAuth.js
2. **RBAC (Role-Based Access Control):** ระบบแบ่งสิทธิ์ออกเป็น Student, Teacher และ Employer และแต่ละ Role สามารถเข้าถึง Feature ที่แตกต่างกัน
3. **Database:** ระบบมี Backend เชื่อมต่อกับ SQLite ผ่าน Prisma ORM และสามารถอ่านและเขียนข้อมูลจริงลงฐานข้อมูลได้
4. **Digital Certificate:** ระบบสามารถออก Certificate และสร้าง SHA-256 Cryptographic Hash สำหรับใช้ตรวจสอบความถูกต้องของข้อมูลและป้องกันการปลอมแปลง
5. **Route Protection:** ระบบมีการป้องกัน Route ที่ต้อง Login และตรวจสอบสิทธิ์ Role ที่ฝั่ง Server ก่อนอนุญาตให้เข้าถึง Resource ที่สำคัญ

### 🔄 งานที่กำลังดำเนินการ (In-Progress Tasks)
1. การติดตั้ง Automated SAST (Static Application Security Testing) ผ่าน GitHub Actions
2. การปรับแต่งความปลอดภัยของระบบและการจัดการ Session Header

### ⏳ งานที่ยังไม่ได้เริ่ม (Not Started Tasks)
1. การเตรียมระบบสำหรับ Production Deployment ขึ้น Cloud Server
2. การทดสอบเจาะระบบและประเมินความปลอดภัยรอบสุดท้ายก่อนส่งมอบ

---

## ⚠️ 3. ปัญหาที่พบและแนวทางแก้ไข (Issues & Resolutions)

| ปัญหาที่พบ (Issue) | สาเหตุ (Root Cause) | แนวทางแก้ไข (Resolution) |
| :--- | :--- | :--- |
| 1. ผู้ใช้สามารถพิมพ์ URL เข้าหน้า Dashboard หรือหน้าอาจารย์ได้โดยตรง | การตรวจสอบสิทธิ์เดิมทำเพียงฝั่ง Client-side | เพิ่ม `getServerSession` ใน Server Components และตรวจสอบ `session.user.role` ทุกครั้ง หากไม่มีสิทธิ์จะ Redirect หรือส่ง `401 Unauthorized` |
| 2. ข้อมูล Mock ในระบบเดิมเป็นข้อมูลทั่วไป ไม่สะท้อนบริบท มสด. | ข้อมูลเริ่มต้นเป็น Placeholder สำเร็จรูป | ปรับปรุง Mock Dataset และ Database Seeding ให้เป็นบริบทจริงของ มสด. (7 บัญชีนักศึกษา พร้อมทักษะ CCNA, CEH) |
| 3. ปัญหาความเป็นส่วนตัวของข้อมูลนักศึกษา (PDPA) | การเปิดเผย GPA หรือเบอร์โทรศัพท์สู่สาธารณะ | ทำระบบ **Data Masking** ซ่อนข้อมูลสำคัญ และเปิดเผยเฉพาะบทบาทที่ได้รับอนุญาต |

---

## 📈 4. เปอร์เซ็นต์ความสำเร็จโดยรวม (Overall Progress)

```
[█████████████████░░░] 85%
```
- **Authentication & RBAC:** 90%
- **Backend & Database (Prisma SQLite):** 90%
- **Digital Certificates (SHA-256):** 90%
- **Route Protection & Security:** 90%
- **ภาพรวมความสำเร็จของโครงการ:** **85%**

---

## 🗓️ 5. แผนการพัฒนาในสัปดาห์ที่ 12–13 (Future Roadmap)

### สัปดาห์ที่ 12: Security Testing (Automated SAST)
- ติดตั้ง Automated SAST (Static Application Security Testing) เพื่อตรวจสอบ Source Code และค้นหาประเด็นด้าน Security ได้แบบอัตโนมัติก่อนนำระบบขึ้น Production
- ทำ Security Code Review และทดสอบการจัดการสิทธิ์ความปลอดภัย

### สัปดาห์ที่ 13: Production Deployment & Final Testing
- เตรียมระบบสำหรับ Production Deployment (Vercel / Supabase Cloud)
- ทดสอบระบบความปลอดภัยและฟังก์ชันทั้งหมดอีกครั้งอย่างละเอียดก่อนส่งมอบ
- จัดทำเอกสารและคู่มือการส่งมอบโปรเจกต์ฉบับสมบูรณ์
