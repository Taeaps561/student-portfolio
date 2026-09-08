# 🗄️ รายงานการวิเคราะห์ความมั่นคงปลอดภัยฐานข้อมูล (Database Security Analysis)

**วิชา:** DevSecOps  
**โครงการ:** Student Portfolio & Skill Passport มสด.  
**เทคโนโลยีฐานข้อมูล:** Prisma ORM (v5/v7) + SQLite (Dev) / PostgreSQL Cloud (Production)  

---

## 1. การควบคุมการเข้าถึงฐานข้อมูลตามหลักสิทธิขั้นต่ำ (Least Privilege Access Control)

ระบบจัดการความปลอดภัยระดับ Database Engine และ Connection Management ดังนี้:

### 1.1 การแยก Environment และการป้องกัน Credential Leakage
- **Environment Isolation:** การเชื่อมต่อฐานข้อมูลทั้งหมดถูกกำหนดผ่านค่าตัวแปรสภาพแวดล้อม `DATABASE_URL` ในไฟล์ `.env`
- **Git Protection:** ไฟล์ `.env` และไฟล์ฐานข้อมูล `.db` ถูกระบุไว้ใน `.gitignore` อย่างชัดเจน เพื่อป้องกันการนำ Secret หรือ Connection String ที่มีรหัสผ่านขึ้นสู่ GitHub Repository สาธารณะ
- **Production User Rights:** บัญชี Database User บนระบบ Cloud (PostgreSQL) ถูกจำกัดสิทธิ์ให้กระทำได้เฉพาะ `SELECT`, `INSERT`, `UPDATE`, `DELETE` บน Schema ที่ใช้งานเท่านั้น โดยไม่อนุญาตให้มีสิทธิ์ `SUPERUSER` หรือสิทธิ์ Drop Database จาก Application Connection

---

## 2. การจัดการและคุ้มครองข้อมูลส่วนบุคคลที่มีความอ่อนไหว (Data Protection & Masking)

ตารางข้อมูลใน `schema.prisma` ได้รับการออกแบบตามแนวคิด Privacy-by-Design:

| ฟิลด์ข้อมูล | โมเดล (Table) | ระดับความอ่อนไหว | มาตรการรักษาความปลอดภัย (Security Measure) |
| :--- | :---: | :---: | :--- |
| `phoneNumber` | `Portfolio` | สูง (PDPA) | **Data Masking:** แปลงเป็น `081-XXX-XXXX` สำหรับผู้ใช้ภายนอก และแสดงเฉพาะเจ้าของหรืออาจารย์ |
| `gpa` | `Portfolio` | ปานกลาง-สูง | **Access Restricted:** ซ่อนค่า (`null`) ใน Public API และเปิดเผยเฉพาะเมื่อนักศึกษาอนุญาต |
| `mfaSecret` | `User` | สูงมาก | จัดเก็บแบบเข้ารหัส ไม่อนุญาตให้ Query ส่งออกไปยัง Client Component |
| `hashValue` | `Certificate` | ความสมบูรณ์ของข้อมูล | จัดเก็บค่า **SHA-256 Cryptographic Hash** เพื่อใช้ตรวจยืนยันความถูกต้อง ป้องกันการปลอมแปลง |

---

## 3. ระบบบันทึกเหตุการณ์ความปลอดภัย (Audit Logging for Traceability)

ทุกการกระทำสำคัญในฐานข้อมูล (Data Mutation) จะถูกบันทึกลงในตาราง `AuditLog` เสมอ เพื่อการตรวจสอบย้อนกลับ (Non-Repudiation):

```prisma
model AuditLog {
  id        String   @id @default(cuid())
  userId    String
  action    String   // เช่น REGISTER_NEW_USER, ADD_CERTIFICATE, GRADE_SOFT_SKILL
  details   String
  ipAddress String?
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

เมื่อเกิดความผิดปกติหรือเหตุการณ์ด้านความปลอดภัย ผู้ดูแลระบบสามารถตรวจสอบตาราง `AuditLog` เพื่อหาว่าใคร ทำอะไร ที่ไหน และเมื่อใดได้อย่างแม่นยำ
