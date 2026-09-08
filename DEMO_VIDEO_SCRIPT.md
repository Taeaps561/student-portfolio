# 🎬 บทและลำดับการบันทึกคลิปวิดีโอสาธิต DevSecOps (Demo Video Script: 5–8 นาที)

**วิชา:** DevSecOps  
**โครงงาน:** Student Portfolio & Skill Passport (กลุ่มที่ 3)  
**ความยาวคลิปที่แนะนำ:** 5–8 นาที  
**โครงสร้างการนำเสนอตามเกณฑ์อาจารย์:**  
$$\text{ระบบจริง} \rightarrow \text{เครื่องมือ} \rightarrow \text{จุดอ่อนที่พบ} \rightarrow \text{การลงมือแก้ไขโค้ด} \rightarrow \text{ผลลัพธ์หลังแก้ไข}$$

---

## ⏱️ ไทม์ไลน์และสคริปต์การพูดทีละช่วง (Scene-by-Scene Script)

### 🟢 ช่วงที่ 1: แนะนำตัว โครงงาน และสถาปัตยกรรมระบบ (0:00 – 1:15 นาที)
- **หน้าจอที่เปิดแสดง:** หน้าแรกของระบบบน Live URL (`https://student-portfolio-ten-phi.vercel.app`) หรือ `localhost:3000`
- **บทพูด:**
  > *"สวัสดีครับอาจารย์และเพื่อนๆ ทุกคน วันนี้กลุ่มที่ 3 จะมานำเสนอความคืบหน้าด้าน DevSecOps สำหรับโครงงาน **Student Portfolio & Skill Passport** หรือระบบแฟ้มสะสมผลงานดิจิทัลและเครือข่ายวิชาชีพนักศึกษา มสด.*  
  >  
  > *ระบบของเราพัฒนาด้วย Next.js 16, React 19, Prisma ORM และเชื่อมต่อฐานข้อมูล มีการใช้งานจริงบน Vercel และรองรับผู้ใช้ 3 กลุ่มคือ นักศึกษา, อาจารย์, และสถานประกอบการ*  
  >  
  > *ในสปรินต์นี้ เราได้นำแนวคิด DevSecOps Cycle เข้ามาประยุกต์ใช้ โดยไม่เพียงแค่สแกนหาช่องโหว่ แต่เราได้ทำการวิเคราะห์ความเสี่ยง ลงมือแก้ไข Source Code จริง และทดสอบซ้ำตามวงจร **Tool → Detect → Analyze → Fix** ครับ"*

---

### 🟡 ช่วงที่ 2: การใช้เครื่องมือตรวจจับจุดอ่อน (Detection Phase) (1:15 – 3:00 นาที)
- **หน้าจอที่เปิดแสดง:**
  1. โปรแกรม **OWASP ZAP** แสดง Alerts
  2. Terminal รันคำสั่ง `npm audit`
  3. โปรแกรม **Burp Suite Repeater** แสดง HTTP Response ของ `/api/portfolio`
- **บทพูด:**
  > *"ในขั้นตอนการตรวจจับ (Detection) เราใช้เครื่องมือจริง 4 ตัวกับระบบของเราครับ:*  
  >  
  > *1. **OWASP ZAP:** เมื่อรัน DAST Baseline Scan บนระบบ เราพบ Alert ระดับ Medium และ Low ถึง 5 รายการ โดยเฉพาะ **Missing Security Headers** ไม่มีทั้ง Content-Security-Policy และ Anti-Clickjacking (`X-Frame-Options`)*  
  >  
  > *2. **npm audit (SCA):** ในการตรวจสอบ Dependencies ในโค้ด เราพบช่องโหว่ 10 รายการ โดยมี Critical ในแพ็กเกจ `next-auth` และ High ใน `next.js`*  
  >  
  > *3. **Burp Suite:** เราทำการทดสอบส่งคำขอไปที่ `GET /api/portfolio` และ `POST /api/employer/matching` โดยไม่ล็อกอิน สิ่งที่น่าตกใจคือ ระบบส่งข้อมูลส่วนตัวนักศึกษาออกมาหมดเลย ทั้งเบอร์โทรศัพท์ และเกรดเฉลี่ย GPA แถมโปรไฟล์ที่นักศึกษาตั้งเป็น Private ก็หลุดออกมาด้วย ถือเป็นช่องโหว่ร้ายแรงด้าน **Broken Access Control** และผิด พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA) ครับ"*

---

### 🟠 ช่วงที่ 3: การวิเคราะห์และลงมือแก้ไข Source Code (Remediation Phase) (3:00 – 5:00 นาที)
- **หน้าจอที่เปิดแสดง:** โปรแกรม **VS Code** เปิดไฟล์โค้ดที่แก้ไขจริง:
  1. `next.config.ts`
  2. `src/app/api/portfolio/route.ts`
  3. `src/app/api/employer/matching/route.ts`
  4. `src/app/api/auth/[...nextauth]/route.ts`
- **บทพูด:**
  > *"เมื่อเราทราบปัญหาแล้ว เราจึงทำการแก้ไขที่ตัวโค้ดจริง 3 จุดหลัก ไม่ใช่เพียงแค่นำภาพมารายงานครับ:*  
  >  
  > *• **จุดที่ 1:** ในไฟล์ `next.config.ts` เราได้เขียนฟังก์ชัน `headers()` เพิ่มเติม เพื่อฉีด Security Headers 7 ตัว ครอบคลุมทั้ง CSP, X-Frame-Options เป็น `SAMEORIGIN`, nosniff, และ HSTS*  
  >  
  > *• **จุดที่ 2:** ใน `src/app/api/portfolio/route.ts` เราแก้ปัญหา Access Control โดยเพิ่มการตรวจสอบ Session หากเป็นผู้ใช้ทั่วไป จะบังคับกรองเฉพาะโปรไฟล์สาธารณะ (`isPublic: true`) เท่านั้น และเขียน Logic ทำ **Data Masking** ซ่อน GPA และแปลงเบอร์โทรศัพท์เป็นรูปแบบ `081-XXX-XXXX`*  
  >  
  > *• **จุดที่ 3:** ใน `src/app/api/employer/matching/route.ts` เราเพิ่มการตรวจสอบสิทธิ์ Server-side RBAC ให้เฉพาะ Role `EMPLOYER` หรือ `TEACHER` เท่านั้นที่เข้าถึงข้อมูลผู้สมัครได้ หากไม่มีสิทธิ์จะถูกตอบกลับด้วย HTTP 401 หรือ 403 ทันทีครับ"*

---

### 🔵 ช่วงที่ 4: การทดสอบซ้ำและแสดงผลลัพธ์หลังแก้ไข (Before vs After) (5:00 – 6:45 นาที)
- **หน้าจอที่เปิดแสดง:**
  1. Terminal หรือ Postman/cURL ทดสอบยิง Request และเปิดไฟล์ในโฟลเดอร์ `evidence/before-after/`
  2. Burp Suite Repeater ส่งคำขอซ้ำ
- **บทพูด:**
  > *"มาดูผลลัพธ์หลังแก้ไขกันครับ:*  
  >  
  > *• เมื่อยิงคำขอ `curl -I` ตรวจสอบ Header ตอนนี้ Server ส่งค่า `Content-Security-Policy`, `X-Frame-Options: SAMEORIGIN` และ `X-Content-Type-Options: nosniff` ครบถ้วนแล้ว และผลการสแกนซ้ำใน OWASP ZAP Alert ลดลงเหลือ **0 รายการ**!*  
  >  
  > *• เมื่อทดสอบผ่าน Burp Suite อีกครั้ง จะเห็นว่าเบอร์โทรศัพท์ถูก Mask เรียบร้อยแล้ว เกรดเฉลี่ยถูกปิดซ่อน (`null`) และหากพยายามเรียก API ของนายจ้างโดยไม่ล็อกอิน ระบบจะบล็อกทันทีด้วย HTTP 401 Unauthorized*  
  >  
  > *และในส่วนฐานข้อมูล เราใช้ Prisma ORM ซึ่งสร้าง Parameterized Queries 100% ทำให้ป้องกันการโจมตี SQL Injection ได้อย่างสมบูรณ์แบบครับ"*

---

### 🟣 ช่วงที่ 5: สรุปงานและส่งมอบตามเกณฑ์ (6:45 – 7:30 นาที)
- **หน้าจอที่เปิดแสดง:**
  1. หน้า **GitHub Repository** แสดงโฟลเดอร์ `evidence/`, ไฟล์ `SECURITY_PROGRESS.md` และ Git Commit History
- **บทพูด:**
  > *"สรุปผลการดำเนินงาน กลุ่มเราได้จัดทำเอกสารและหลักฐานครบทั้ง 4 ส่วนตามที่อาจารย์กำหนด:*  
  > *1. ไฟล์ `SECURITY_PROGRESS.md` สรุปรายงานความมั่นคงปลอดภัยทั้งหมด*  
  > *2. โฟลเดอร์ `evidence/` ที่มีหลักฐานของ ZAP, Burp Suite, SAST, Database และ Before/After ครบถ้วน*  
  > *3. คลิปวิดีโอสาธิตนี้*  
  > *4. ประวัติ Git Commit บน GitHub ที่ยืนยันว่ามีการแก้ไขโค้ดจริง*  
  >  
  > *ในสปรินต์ถัดไป เราพร้อมที่จะนำ GitHub Actions Pipeline ของเราต่อยอดเป็น CI/CD Security Pipeline เต็มรูปแบบครับ กลุ่มที่ 3 ขอจบการนำเสนอเพียงเท่านี้ ขอบคุณครับ"*

---

## 🧰 สรุปเครื่องมือ (Tools) และคำสั่งที่ต้องใช้ในการบันทึกคลิปสาธิต

| เครื่องมือ (Tool) | ประเภท / หมวดหมู่ | หน้าที่และสิ่งที่ต้องแสดงบนหน้าจอ | ช่วงในคลิป | คำสั่ง / สิ่งที่ต้องเปิด |
| :--- | :---: | :--- | :---: | :--- |
| **1. OBS Studio** | Screen Recording | บันทึกหน้าจอ 1080p, อัดเสียงไมค์, เปิดกล้องหน้าเว็บแคมมุมจอ (PIP) | ตลอดคลิป (5–8 นาที) | โหมด Display Capture + Video Capture Device |
| **2. OWASP ZAP (v2.14+)** | DAST / Detection | โชว์หน้าต่าง Alerts พบ Missing Security Headers 5 ตัว ➔ สแกนซ้ำเหลือ 0 Alerts | ช่วงที่ 2 & 4 | หน้าต่าง Alerts หรือ `evidence/zap/zap-scan-report.md` |
| **3. Burp Suite (Community)** | Web Testing / Intercept | โชว์ Repeater: `/api/portfolio` ข้อมูลหลุด ➔ หลังแก้ Mask เบอร์โทรและบล็อก 401 | ช่วงที่ 2 & 4 | แท็บ Repeater ส่งคำขอไปยัง `/api/portfolio` |
| **4. npm audit** | SCA / Dependency Scan | รันคำสั่ง `npm audit` ใน Terminal โชว์ 10 ช่องโหว่ (Critical ใน next-auth) | ช่วงที่ 2 | `npm audit` |
| **5. VS Code** | IDE / Remediation | เปิดไฟล์แก้จริง: `next.config.ts`, `portfolio/route.ts`, `matching/route.ts` | ช่วงที่ 3 | เปิดไฟล์โค้ด 4 แท็บ |
| **6. Terminal (cURL)** | CLI Verification | รันคำสั่ง cURL ยืนยัน Header 7 ตัวตอบกลับจาก Server | ช่วงที่ 4 | `curl -I https://student-portfolio-ten-phi.vercel.app` |
| **7. Web Browser (Chrome/Edge)** | Live Web & GitHub | เปิดเว็บจริงบน Vercel, หน้า GitHub Repo, โฟลเดอร์ `evidence/` และ Git Commits | ช่วงที่ 1 & 5 | Live URL + GitHub URL |

---

## 💡 Checklist สิ่งที่ต้องเปิดรอบนหน้าจอคอมพิวเตอร์ก่อนกด Record (อัดคลิป)
- [ ] **1. เบราว์เซอร์แท็บ 1:** หน้าแรกเว็บจริง ([https://student-portfolio-ten-phi.vercel.app](https://student-portfolio-ten-phi.vercel.app) หรือ `localhost:3000`)
- [ ] **2. เบราว์เซอร์แท็บ 2:** GitHub Repo แสดงโฟลเดอร์ `evidence/`, ไฟล์ `SECURITY_PROGRESS.md` และ Commits History
- [ ] **3. หน้าต่าง VS Code:** เปิดไฟล์ `next.config.ts` และ `src/app/api/portfolio/route.ts` รอไว้ในแท็บ
- [ ] **4. โปรแกรม Burp Suite:** เปิดแท็บ Repeater ยิงคำขอ `GET /api/portfolio` ค้างไว้
- [ ] **5. โปรแกรม OWASP ZAP:** เปิดหน้าจอ Alerts (หรือเปิดไฟล์รายงาน `evidence/zap/zap-scan-report.md`)
- [ ] **6. หน้าต่าง Terminal:** เตรียมคำสั่ง `npm audit` และ `curl -I <URL>`
- [ ] **7. การส่งงาน:** อัปโหลดคลิปขึ้น YouTube (ตั้งค่า Unlisted) หรือ Google Drive แล้วนำลิงก์มาแนบส่งในระบบส่งงานของรายวิชา

