# 🔍 รายงานการทดสอบความปลอดภัยด้วย Burp Suite (Web Testing & Interception)

**ชื่อระบบที่ทดสอบ:** Student Portfolio & Skill Passport  
**เครื่องมือ:** Burp Suite Professional / Community Edition v2024+  
**โมดูลที่ใช้งาน:** Proxy, Repeater, Intruder  
**ประเภทการทดสอบ:** Manual Web Application Penetration Testing & API Security Assessment  

---

## 1. กรณีทดสอบที่ 1: การรั่วไหลของข้อมูลส่วนบุคคล (Broken Access Control & PDPA Violation)

### 1.1 วัตถุประสงค์
ทดสอบการเรียกใช้งาน `GET /api/portfolio` โดยผู้ใช้ภายนอกที่ไม่ระบุตัวตน (Unauthenticated Public User) ว่าสามารถเข้าถึงข้อมูลแฟ้มสะสมงานส่วนตัว (`isPublic: false`) และข้อมูลส่วนบุคคลที่มีความอ่อนไหว เช่น เบอร์โทรศัพท์ และเกรดเฉลี่ย (GPA) ได้หรือไม่

### 1.2 Before Remediation (ผลการทดสอบก่อนแก้ไข - พบบั๊กความปลอดภัย)
ผู้ทดสอบใช้ Burp Repeater ส่ง HTTP Request ดังนี้:

```http
GET /api/portfolio HTTP/1.1
Host: student-portfolio-ten-phi.vercel.app
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)
Accept: application/json
```

**HTTP Response ก่อนแก้:**
```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "success": true,
  "portfolios": [
    {
      "id": "cm1portfolio001",
      "userId": "user_somchai",
      "bio": "Full-Stack Developer",
      "isPublic": false,
      "phoneNumber": "0812345678",
      "gpa": 3.85,
      "user": {
        "id": "user_somchai",
        "name": "นายสมชาย ยอดนักโค้ด",
        "role": "STUDENT"
      }
    }
  ]
}
```
🚩 **ผลการวิเคราะห์ใน Burp Suite:**
- ระบบส่งข้อมูลโปรไฟล์ที่มี `isPublic: false` ออกมาให้ผู้ใช้ทั่วไป
- ค่า `phoneNumber` (เบอร์โทรจริง) และ `gpa` (3.85) แสดงออกมาเป็น Plaintext ชัดเจน ถือเป็นการละเมิด **OWASP A01:2021-Broken Access Control** และ **พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA)**

---

### 1.3 After Remediation (ผลการทดสอบหลังปรับปรุง Source Code)
หลังปรับปรุงโค้ดใน `src/app/api/portfolio/route.ts` ให้คัดกรองเฉพาะ `isPublic: true` และทำการ Masking ข้อมูล

**HTTP Response หลังแก้:**
```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff

{
  "success": true,
  "portfolios": [
    {
      "id": "cm1portfolio002",
      "userId": "user_saifah",
      "bio": "Cybersecurity & Pentester",
      "isPublic": true,
      "phoneNumber": "081-XXX-5678",
      "gpa": null,
      "user": {
        "id": "user_saifah",
        "name": "นายสายฟ้า แฮกเกอร์",
        "role": "STUDENT"
      }
    }
  ]
}
```
✅ **ผลลัพธ์หลังแก้ไข:**
- โปรไฟล์ส่วนตัว (`isPublic: false`) ถูกกรองออกโดยสมบูรณ์
- เบอร์โทรศัพท์ถูก Mask เป็นรูปแบบ `081-XXX-XXXX` และเกรดเฉลี่ย `gpa` ถูกปิดซ่อน (`null`) ให้เห็นเฉพาะเจ้าของบัญชีหรืออาจารย์ที่ล็อกอินแล้วเท่านั้น

---

## 2. กรณีทดสอบที่ 2: การตรวจสอบสิทธิ์ของ API ผู้ประกอบการ (`POST /api/employer/matching`)

### 2.1 วัตถุประสงค์
ทดสอบการส่งคำขอจับคู่ทักษะผู้สมัครงานโดยไม่มี Session Token ของนายจ้าง

### 2.2 Before Remediation (ก่อนแก้)
**HTTP Request:**
```http
POST /api/employer/matching HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{"jobDescription": "React Next.js Developer"}
```
**HTTP Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{"success": true, "candidates": [ ...รายการนักศึกษาทั้งหมดพร้อม GPA... ]}
```
🚩 **ช่องโหว่:** ไม่มีการตรวจสอบสิทธิ์ (Missing Authentication Check) ทำให้บุคคลภายนอกสามารถดูรายชื่อและประวัตินักศึกษาได้โดยไม่ต้องล็อกอิน

### 2.3 After Remediation (หลังแก้)
**HTTP Response:**
```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
  "error": "Unauthorized: กรุณาเข้าสู่ระบบก่อนใช้งานระบบค้นหาผู้สมัคร"
}
```
✅ **ผลลัพธ์:** ปฏิเสธการเข้าถึงด้วย HTTP 401 Unauthorized ทันทีหากไม่มีเซสชันที่ถูกต้อง และตอบกลับ 403 Forbidden หากไม่ใช่บัญชีผู้ประกอบการ (`EMPLOYER`) หรืออาจารย์ (`TEACHER`)

---

## 3. สรุปกระบวนการตามแนวทาง DevSecOps (Burp Suite)

$$\text{Burp Suite Proxy/Repeater} \rightarrow \text{Intercept ตรวจพบ Sensitive Data Leak & Missing Auth} \rightarrow \text{Analyze Impact (PDPA/OWASP A01)} \rightarrow \text{Implement RBAC & Data Masking} \rightarrow \text{Retest HTTP Response สำเร็จ}$$
