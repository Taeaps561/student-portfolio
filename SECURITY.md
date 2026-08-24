# 🛡️ นโยบายความมั่นคงปลอดภัย (Security Policy) - SkillPassport

เอกสารนี้ระบุมาตรการความมั่นคงปลอดภัยและการจัดการช่องโหว่ (DevSecOps Practices) สำหรับโครงการ **Student Portfolio & Skill Passport** มหาวิทยาลัยสวนดุสิต

---

## 1. การรายงานช่องโหว่ความปลอดภัย (Reporting a Vulnerability)
หากพบช่องโหว่หรือความผิดปกติด้านความมั่นคงปลอดภัยในระบบ กรุณาแจ้งมาที่ทีมงานผู้พัฒนาโดยตรง:
- **Email:** devsecops-team@sdu.ac.th / student-portfolio@example.com
- **เวลาตอบกลับ:** ภายใน 24-48 ชั่วโมง
- **มาตรการ:** กรุณาอย่าเปิดเผยข้อมูลช่องโหว่ต่อสาธารณะ (Responsible Disclosure) จนกว่าทีมงานจะออกแพตช์แก้ไขเรียบร้อย

---

## 2. มาตรการรักษาความมั่นคงปลอดภัยที่นำมาใช้ (Security Implementations)

### 🔐 2.1 การยืนยันตัวตนและการจัดการเซสชัน (Authentication & Session Management)
- **Password Hashing:** ไม่จัดเก็บรหัสผ่านในรูปแบบ Plain text ใช้การเข้ารหัสผ่านแบบปลอดภัย (เช่น bcrypt / PBKDF2)
- **Generic Error Messages:** หน้า Login แสดงข้อความแจ้งเตือนแบบกลาง เช่น *"อีเมลหรือรหัสผ่านไม่ถูกต้อง"* เพื่อป้องกัน User Enumeration Attack
- **Secure Session Management:** ใช้ NextAuth.js ในการสร้างและจัดการ Session Token แบบ JWT/Database Session พร้อมตั้งค่า `HttpOnly`, `SameSite=Lax`, และ `Secure` (บน HTTPS)
- **Session Termination:** เมื่อผู้ใช้กด Logout ระบบจะทำลาย Session Cookie ทันที และเคลียร์สถานะในระบบ

### 🛡️ 2.2 การควบคุมการเข้าถึงตามสิทธิ์ (Role-Based Access Control - RBAC)
- **Multi-Role Separation:** รองรับ 3 บทบาท ได้แก่ `STUDENT` (นักศึกษา), `TEACHER` (อาจารย์), และ `EMPLOYER` (นายจ้าง)
- **Server-Side Authorization:** ระบบตรวจสอบสิทธิ์ที่ฝั่ง Server/API Route ทุกครั้งที่มีการร้องขอข้อมูล (`session.user.role === 'TEACHER'`) ไม่พึ่งพาเพียงแค่การซ่อนเมนูฝั่ง Client
- **Route Protection:** ผู้ใช้ที่ไม่ผ่านการ Login จะถูก Redirect ออกจากหน้าที่ต้องยืนยันตัวตน (เช่น `/dashboard`, `/teacher`, `/employer`) ทันที

### 🗄️ 2.3 ความปลอดภัยของฐานข้อมูล (Database & Data Protection)
- **Environment Isolation:** จัดเก็บ URL และ Credential ของฐานข้อมูลไว้ในไฟล์ `.env` ซึ่งถูกระบุไว้ใน `.gitignore` เพื่อป้องกันการ Leak ข้อมูลสู่ GitHub
- **SQL Injection Prevention:** ใช้ **Prisma ORM** ซึ่งใช้ Parameterized Queries / Prepared Statements ป้องกันการโจมตีประเภท SQL Injection 100%
- **Data Masking:** ข้อมูลส่วนบุคคลที่มีความอ่อนไหว (เช่น เกรดเฉลี่ย GPA, เบอร์โทรศัพท์) มีการ Masking ซ่อนไว้ และเปิดเผยเฉพาะผู้ที่ได้รับอนุญาต

### 🔗 2.4 ความถูกต้องสมบูรณ์ของข้อมูล (Data Integrity)
- **Certificate Hashing:** เอกสารและใบรับรอง (Certificates) มีการคำนวณและจัดเก็บค่า Hash (Digital Signature) เพื่อใช้ในการตรวจสอบ QR Code ป้องกันการปลอมแปลงใบรับรอง
- **Audit Logging:** บันทึกประวัติการกระทำที่สำคัญของผู้ใช้ (Audit Log) เช่น การแก้ไขข้อมูล การอนุมัติทักษะ

---

## 3. Checklist ความปลอดภัยสำหรับนักพัฒนา (Developer Security Checklist)
- [x] ตรวจสอบว่า `.env` ไม่ถูก Commit ขึ้น Git (`git status`)
- [x] ไม่มี API Key หรือ Secret Hardcoded อยู่ใน Source Code
- [x] ทุก API Route ที่เข้าถึงข้อมูลส่วนตัวมีการเช็ค `getServerSession`
- [x] ฟอร์มรับข้อมูลมีการ Validate ข้อมูลทั้งฝั่ง Client และ Server
