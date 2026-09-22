# 📄 รายงานสรุปผลการดำเนินงานรายบุคคล (Individual Project Report)
## รายวิชา: DevSecOps (การปฏิบัติการพัฒนาและการรักษาความมั่นคงปลอดภัยระบบ)
### โครงงาน: Student Portfolio & Skill Passport (กลุ่มที่ 3 มหาวิทยาลัยสวนดุสิต)

---

## 1. ข้อมูลส่วนบุคคลและกลุ่ม (Personal Information)
- **ชื่อ - นามสกุล:** นายอภิสิทธิ์ ศรีพัฒน์
- **รหัสนักศึกษา:** 6511011860010 (รหัสย่อ: 010)
- **กลุ่มโครงงาน:** กลุ่มที่ 3 (Student Portfolio & Skill Passport)
- **สาขาวิชา:** วิทยาการคอมพิวเตอร์ คณะวิทยาศาสตร์และเทคโนโลยี มหาวิทยาลัยสวนดุสิต
- **Repository:** [https://github.com/Taeaps561/student-portfolio](https://github.com/Taeaps561/student-portfolio)
- **Production URL:** [https://student-portfolio-ten-phi.vercel.app](https://student-portfolio-ten-phi.vercel.app)

---

## 2. บทบาทและหน้าที่ในโครงการ (Role & Responsibilities)
**บทบาท:** Backend, Database & Security Lead  
**หน้าที่ความรับผิดชอบหลัก:**
1. ออกแบบและบริหารจัดการโครงสร้างฐานข้อมูล (Database Schema) ทั้งหมด 10 โมเดล ผ่าน Prisma ORM
2. วางสถาปัตยกรรมฐานข้อมูลแบบ Dual-Database (SQLite สำหรับ Local Dev และ PostgreSQL สำหรับ Cloud Production)
3. ออกแบบและพัฒนาระบบรักษาความสมบูรณ์ของข้อมูล (Data Integrity) ด้วย SHA-256 Cryptographic Hashing
4. พัฒนาระบบคุ้มครองข้อมูลส่วนบุคคล (PDPA Data Masking Engine) และการบันทึกประวัติความปลอดภัย (Audit Logging)
5. ประเมินความมั่นคงปลอดภัยของฐานข้อมูลตามหลักสิทธิขั้นต่ำ (Least Privilege) จากวิชา DBMS Security

---

## 3. รายการงานที่ดำเนินการด้วยตนเอง (Individual Tasks Performed)
- [x] ออกแบบโครงสร้างตารางและความสัมพันธ์ 10 ตารางใน `prisma/schema.prisma` (User, Account, Session, Portfolio, Skill, Project, Certificate, Course, Enrollment, AuditLog)
- [x] พัฒนากลไกการคำนวณและตรวจสอบ Digital Signature (SHA-256 Hash) สำหรับใบประกาศนียบัตรดิจิทัล
- [x] พัฒนาฟังก์ชัน Server-side Data Masking ซ่อนเกรดเฉลี่ย (GPA) และแปลงเบอร์โทรศัพท์เป็น `081-XXX-XXXX` ใน `src/app/api/portfolio/route.ts`
- [x] พัฒนาระบบ Role-Based Access Control (RBAC) กรองสิทธิ์ในฝั่ง Server และ Endpoint `/api/employer/matching/route.ts`
- [x] เพิ่มระบบจัดการสถานะใบรับรองและการเพิกถอน (Revoke Certificate) ในฝั่งอาจารย์
- [x] ทำการทดสอบเจาะช่องโหว่ SQL Injection และบันทึกหลักฐานการป้องกันผ่าน Parameterized Queries
- [x] จัดทำเอกสารหลักฐาน `evidence/database/` และ `evidence/before-after/fix2-`

---

## 4. หลักฐานการทำงาน (Work Evidence & Commits)
- **Git Commits สำคัญบน Repository:**
  - `b01856a` — *feat(security): implement DevSecOps remediations, evidence reports, and demo video script*
  - `fe9a97a` — *feat: add delete and revoke button for issued certificates in teacher portal*
  - `ace7cad` — *feat: complete week 12 progress report, SAST security pipeline, real dataset and cloud deployment readiness*
- **เอกสารหลักฐานที่จัดทำ:**
  - รายงานความมั่นคงปลอดภัยฐานข้อมูล: [evidence/database/db-security-analysis.md](file:///c:/Users/Taeaps/Documents/Project_web/student-portfolio/evidence/database/db-security-analysis.md)
  - รายงานการป้องกัน SQL Injection: [evidence/database/prisma-sqli-prevention.md](file:///c:/Users/Taeaps/Documents/Project_web/student-portfolio/evidence/database/prisma-sqli-prevention.md)
  - รายงาน Before/After จุดที่ 2: [evidence/before-after/fix2-broken-access-control-and-pdpa.md](file:///c:/Users/Taeaps/Documents/Project_web/student-portfolio/evidence/before-after/fix2-broken-access-control-and-pdpa.md)

---

## 5. ฟังก์ชันหรือโค้ดสำคัญที่ตนเองพัฒนา (Key Implementation & Code)

### 5.1 ฟังก์ชัน Data Masking คุ้มครองข้อมูลส่วนบุคคล (PDPA Filter)
```typescript
// ตัดตอนจาก: src/app/api/portfolio/route.ts
// ตรวจสอบสิทธิ์ Session: หากไม่ใช่เจ้าของหรืออาจารย์ จะทำการ Masking ข้อมูลทันที
const isPrivileged = session?.user?.email === targetUser.email || session?.user?.role === 'TEACHER';

const sanitizedPortfolio = {
  ...portfolio,
  // ซ่อนเกรดเฉลี่ย GPA หากไม่มีสิทธิ์เข้าถึง
  gpa: isPrivileged ? portfolio.gpa : null,
  // Mask เบอร์โทรศัพท์เป็น 081-XXX-XXXX เพื่อสอดคล้องกับ พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล
  phoneNumber: isPrivileged 
    ? portfolio.phoneNumber 
    : portfolio.phoneNumber?.replace(/(\d{3})\d{3}(\d{4})/, '$1-XXX-$2')
};
```

### 5.2 กลไก Digital Certificate SHA-256 Hashing (Data Integrity)
```typescript
// ฟังก์ชันคำนวณ Cryptographic Hash ป้องกันการแก้ไขหรือปลอมแปลงใบรับรอง
import crypto from 'crypto';

export function generateCertificateHash(studentName: string, courseCode: string, issueDate: Date): string {
  const payload = `${studentName}:${courseCode}:${issueDate.toISOString()}:${process.env.CERT_SALT || 'sdu-salt'}`;
  return crypto.createHash('sha256').update(payload).digest('hex');
}
```

---

## 6. ช่องโหว่หรือความเสี่ยงที่ตนเองตรวจพบ (Vulnerabilities Identified)
1. **OWASP A01:2021 – Broken Access Control & PDPA Data Exposure (Critical - Risk Score: 20/25):**  
   จากการทดสอบส่งคำขอ `GET /api/portfolio` และ `POST /api/employer/matching` ผ่าน Burp Suite โดยไม่มี Session Token พบว่า Server ตอบกลับ HTTP 200 พร้อมเปิดเผยเกรดเฉลี่ย เบอร์โทรศัพท์ และโปรไฟล์ส่วนตัวของนักศึกษาทั้งหมด
2. **OWASP A03:2021 – SQL Injection Risk (High - Risk Score: 15/25):**  
   ความเสี่ยงจากการที่ผู้ไม่หวังดีป้อน SQL Injection Payload ในช่องค้นหาทักษะหรือหน้าล็อกอิน

---

## 7. วิธีแก้ไขและผลหลังแก้ไข (Remediation & Before/After Results)
- **ก่อนแก้ไข (Before):** บุคคลภายนอกสามารถดึงเบอร์โทรศัพท์และเกรดเฉลี่ยของนักศึกษาทั้งระบบได้โดยตรง ขาดการตรวจสอบสิทธิ์
- **วิธีการแก้ไข (Fix):**
  1. เพิ่มคำสั่ง `getServerSession(authOptions)` ตรวจสอบสิทธิ์ฝั่ง Server
  2. กำหนดเงื่อนไข `where: { isPublic: true }` สำหรับคำขอภายนอก
  3. เขียนฟังก์ชัน Data Masking แปลงเบอร์โทรศัพท์และซ่อน GPA
  4. ใช้ Prisma ORM บังคับ Prepared Statements 100% ป้องกัน SQL Injection
- **ผลลัพธ์หลังแก้ไข (After):**  
  เมื่อทดสอบส่งคำขอผ่าน Burp Suite ซ้ำ พบว่า API ของนายจ้างตอบกลับ `HTTP 401 Unauthorized` ทันที และ API สาธารณะแสดงเบอร์โทรศัพท์ในรูปแบบ Masked (`081-XXX-XXXX`) ส่วน GPA คืนค่าเป็น `null` อย่างปลอดภัย

---

## 8. ปัญหาที่พบและวิธีแก้ไข (Challenges & Problem Solving)
- **ปัญหา:** การใช้งาน SQLite เป็นฐานข้อมูลหลักบน Vercel เกิดข้อจำกัดเนื่องจาก Vercel รันแบบ Serverless Ephemeral Filesystem ทำให้ไฟล์ฐานข้อมูล SQLite ถูกรีเซ็ตและไม่รองรับการเขียนข้อมูลพร้อมกัน
- **วิธีแก้ไข:** ปรับโครงสร้างระบบเป็น **Dual-Database Architecture** โดยในเครื่องพัฒนา (Local) ใช้ SQLite เพื่อความรวดเร็ว และเตรียมความพร้อมสำหรับ Cloud ด้วย PostgreSQL บน Supabase/Neon ผ่านการกำหนดไดรเวอร์ `@prisma/adapter-pg` ในไฟล์คอนฟิก

---

## 9. สิ่งที่ได้เรียนรู้ด้าน DevSecOps (DevSecOps Key Learnings)
1. **Security by Design:** การรักษาความปลอดภัยต้องเริ่มต้นตั้งแต่การออกแบบ Schema ฐานข้อมูลและการจัดทำ Data Normalization
2. **Defense in Depth:** การมีระบบ Authentication เพียงอย่างเดียวไม่เพียงพอ แต่ต้องมี Authorization และ Data Minimization ในทุกๆ Endpoint เพื่อให้สอดคล้องกับกฎหมายคุ้มครองข้อมูลส่วนบุคคล (PDPA)
3. **Auditability:** ตาราง `AuditLog` มีความสำคัญอย่างยิ่งในการพิสูจน์ความรับผิดชอบ (Non-Repudiation) เมื่อเกิดเหตุการณ์ผิดปกติ

---

## 10. การประเมินตนเอง พร้อมเหตุผล (Self-Evaluation)
- **คะแนนประเมินตนเอง:** **9.5 / 10**
- **เหตุผล:** ข้าพเจ้าได้รับผิดชอบงานในส่วนแกนหลักของระบบ ทั้งการออกแบบสถาปัตยกรรมฐานข้อมูล 10 ตาราง, การพัฒนาระบบ Digital Certificate Integrity (SHA-256), การแก้ไขช่องโหว่ระดับ Critical (Broken Access Control & PDPA) จนผ่านการทดสอบซ้ำอย่างสมบูรณ์ และจัดทำเอกสารหลักฐานอย่างเป็นระบบ

---

## 11. การประเมินการมีส่วนร่วมของสมาชิกในกลุ่มแบบสั้น ๆ (Peer Assessment)
- **008 นายปภังกร ทองเจริญ (ให้ 10/10):** รับผิดชอบการวางระบบ CI/CD Pipeline, Semgrep SAST และการแก้ไขช่องโหว่บน API Proxy ได้อย่างมีประสิทธิภาพ ช่วยให้ทีมตรวจสอบความปลอดภัยโค้ดได้รวดเร็ว
- **009 นายปวีณวัชร์ เหลืองอุทัย (ให้ 10/10):** พัฒนาหน้าจอ UI/UX ได้อย่างสวยงาม พรีเมียม และจัดการเรื่อง HTTP Security Headers รวมถึงการ Deploy ระบบขึ้น Cloud Vercel ได้อย่างราบรื่น
