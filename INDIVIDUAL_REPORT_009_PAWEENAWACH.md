# 📄 รายงานสรุปผลการดำเนินงานรายบุคคล (Individual Project Report)
## รายวิชา: DevSecOps (การปฏิบัติการพัฒนาและการรักษาความมั่นคงปลอดภัยระบบ)
### โครงงาน: Student Portfolio & Skill Passport (กลุ่มที่ 3 มหาวิทยาลัยสวนดุสิต)

---

## 1. ข้อมูลส่วนบุคคลและกลุ่ม (Personal Information)
- **ชื่อ - นามสกุล:** นายปวีณวัชร์ เหลืองอุทัย
- **รหัสนักศึกษา:** 6511011860009 (รหัสย่อ: 009)
- **กลุ่มโครงงาน:** กลุ่มที่ 3 (Student Portfolio & Skill Passport)
- **สาขาวิชา:** วิทยาการคอมพิวเตอร์ คณะวิทยาศาสตร์และเทคโนโลยี มหาวิทยาลัยสวนดุสิต
- **Repository:** [https://github.com/Taeaps561/student-portfolio](https://github.com/Taeaps561/student-portfolio)
- **Production URL:** [https://student-portfolio-ten-phi.vercel.app](https://student-portfolio-ten-phi.vercel.app)

---

## 2. บทบาทและหน้าที่ในโครงการ (Role & Responsibilities)
**บทบาท:** Frontend, UX/UI & Cloud Deployment Specialist  
**หน้าที่ความรับผิดชอบหลัก:**
1. ออกแบบและพัฒนาประสบการณ์ผู้ใช้งาน (UX) และส่วนติดต่อผู้ใช้งาน (UI) ทั้งหมดด้วย Next.js 16 และ Tailwind CSS
2. กำหนดค่าและติดตั้ง HTTP Security Headers ทั้ง 7 รายการบน Next.js Web Server เพื่อป้องกันการโจมตีฝั่งไคลเอนต์
3. บริหารจัดการการนำระบบขึ้นใช้งานจริงบนระบบคลาวด์ (Cloud Deployment) ผ่าน Vercel Platform
4. ทำการทดสอบความปลอดภัยแบบไดนามิก (Dynamic Application Security Testing - DAST) ด้วยเครื่องมือ OWASP ZAP
5. จัดทำชุดข้อมูลจริง (Real Dataset) ของนักศึกษา มสด. 7 บัญชี และจัดทำสื่อการนำเสนอระบบ

---

## 3. รายการงานที่ดำเนินการด้วยตนเอง (Individual Tasks Performed)
- [x] พัฒนาหน้าจอ Responsive UI ครบทุกโมดูล: หน้าแรก (`/feed`), พอร์ตโฟลิโอ (`/portfolio`), ใบรับรองดิจิทัล (`/certificates`), ตรวจสอบสิทธิ์ (`/verify`), หน้าจัดการอาจารย์ (`/teacher`), และหน้านายจ้าง (`/employer`)
- [x] เขียนฟังก์ชันกำหนดค่า HTTP Security Headers ใน `next.config.ts` ครอบคลุม Content-Security-Policy (CSP), Anti-Clickjacking (`X-Frame-Options`), nosniff, และ HSTS
- [x] ดำเนินการตั้งค่า Build & Production Deployment บน Vercel Cloud Platform พร้อมเชื่อมโยงตัวแปรสภาพแวดล้อม
- [x] ใช้ OWASP ZAP ทำการสแกนระบบ (DAST Baseline Scan) ทั้งบน Localhost และ Production URL
- [x] จัดเตรียมและรัน Script นำเข้าชุดข้อมูลจริงนักศึกษา มสด. 7 บัญชี พร้อมทักษะและใบรับรองดิจิทัล
- [x] พัฒนาระบบปุ่ม Quick Login 3 บทบาท (Student, Teacher, Employer) เพื่ออำนวยความสะดวกในการทดสอบของผู้สอน
- [x] จัดทำเอกสารหลักฐาน `evidence/zap/` และ `evidence/before-after/fix1-`

---

## 4. หลักฐานการทำงาน (Work Evidence & Commits)
- **Git Commits สำคัญบน Repository:**
  - `b567b1c` — *fix(build): add prisma generate to build and postinstall scripts for Vercel deployment*
  - `e31e12f` — *docs: update PROGRESS_WEEK12 PDF and markdown with Live Vercel Production URL*
  - `cbb5079` — *docs(security): add filled Security Checklist DOCX, PDF, and generator scripts*
- **เอกสารหลักฐานที่จัดทำ:**
  - รายงานการสแกน OWASP ZAP: [evidence/zap/zap-scan-report.md](file:///c:/Users/Taeaps/Documents/Project_web/student-portfolio/evidence/zap/zap-scan-report.md)
  - รายงานเปรียบเทียบ Security Headers: [evidence/zap/security-headers-comparison.txt](file:///c:/Users/Taeaps/Documents/Project_web/student-portfolio/evidence/zap/security-headers-comparison.txt)
  - รายงาน Before/After จุดที่ 1: [evidence/before-after/fix1-security-headers.md](file:///c:/Users/Taeaps/Documents/Project_web/student-portfolio/evidence/before-after/fix1-security-headers.md)

---

## 5. ฟังก์ชันหรือโค้ดสำคัญที่ตนเองพัฒนา (Key Implementation & Code)

### 5.1 การกำหนดค่า HTTP Security Headers แบบรวมศูนย์ใน Next.js
```typescript
// ตัดตอนจาก: next.config.ts
const securityHeaders = [
  // ป้องกันการนำเว็บไปแสดงผลใน iframe ของผู้อื่น (Anti-Clickjacking)
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  // ป้องกันการเดา MIME Type ของเบราว์เซอร์ (MIME Sniffing Protection)
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // บังคับใช้งานโพรโทคอล HTTPS เสมอ
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  // ควบคุมการส่งข้อมูล Referrer
  { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
  // ป้องกันการเข้าถึงกล้อง ไมโครโฟน หรือพิกัดตำแหน่งโดยไม่ได้รับอนุญาต
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  // กำหนด Content Security Policy (CSP) อย่างรัดกุม
  { 
    key: 'Content-Security-Policy', 
    value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: https://images.unsplash.com;" 
  }
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};
```

---

## 6. ช่องโหว่หรือความเสี่ยงที่ตนเองตรวจพบ (Vulnerabilities Identified)
1. **OWASP A05:2021 – Security Misconfiguration (Missing HTTP Security Headers) (Medium - Risk Score: 12/25):**  
   จากการใช้เครื่องมือ OWASP ZAP ทำการสแกนระบบจริง ตรวจพบ Alert แจ้งเตือน 5 รายการ เนื่องจากเซิร์ฟเวอร์ไม่ได้ส่ง Security Headers เช่น ขาด `Content-Security-Policy`, ขาด `X-Frame-Options`, และไม่มี `X-Content-Type-Options: nosniff` ซึ่งเปิดโอกาสให้ผู้ไม่หวังดีทำ Clickjacking หลอกให้ผู้ใช้กดอนุมัติข้อมูล หรือทำ MIME Sniffing โจมตี XSS ได้

---

## 7. วิธีแก้ไขและผลหลังแก้ไข (Remediation & Before/After Results)
- **ก่อนแก้ไข (Before):**  
  เมื่อเรียกดูคำขอผ่านคำสั่ง `curl -I http://localhost:3000` ไม่พบ Security Headers สำคัญ และ OWASP ZAP รายงานผล Alert ระดับ Medium/Low จำนวน 5 รายการ
- **วิธีการแก้ไข (Fix):**  
  เขียนฟังก์ชัน `headers()` ในไฟล์ `next.config.ts` เพิ่ม HTTP Security Headers ทั้ง 7 รายการให้ถูกฉีดไปกับทุกคำขอของระบบ
- **ผลลัพธ์หลังแก้ไข (After):**  
  เมื่อทดสอบยิงคำขอด้วย `curl -I` ซ้ำ พบว่าเซิร์ฟเวอร์ส่งค่า `Content-Security-Policy`, `X-Frame-Options: SAMEORIGIN`, และ `Strict-Transport-Security` ครบถ้วน และเมื่อนำ OWASP ZAP มาสแกนซ้ำ ผลการแจ้งเตือนในหมวด Security Headers ลดลงเหลือ **0 รายการ** อย่างสมบูรณ์

---

## 8. ปัญหาที่พบและวิธีแก้ไข (Challenges & Problem Solving)
- **ปัญหา:** ในช่วงแรกที่มีการกำหนดค่า Content-Security-Policy (CSP) แบบเข้มงวด ส่งผลให้ภาพโปรไฟล์จากภายนอก (Unsplash) และฟอนต์ Google Fonts ถูกบล็อก ไม่สามารถเรนเดอร์บนหน้าเว็บได้ หน้าจอจึงแสดงผลผิดเพี้ยน
- **วิธีแก้ไข:** ใช้ Browser Developer Tools ในการตรวจสอบ CSP Violation Errors แล้วปรับปรุง Directives ใน `next.config.ts` โดยกำหนด Whitelist โดเมนที่จำเป็นอย่างเจาะจง ได้แก่ `https://images.unsplash.com`, `https://fonts.googleapis.com` และ `https://fonts.gstatic.com` ทำให้หน้าเว็บแสดงผลได้สวยงามควบคู่กับความปลอดภัย

---

## 9. สิ่งที่ได้เรียนรู้ด้าน DevSecOps (DevSecOps Key Learnings)
1. **Security by Default:** การพัฒนาแอปพลิเคชันที่มีความมั่นคงปลอดภัยสูง ไม่ได้หมายถึงแค่โค้ดฝั่งหลังบ้าน แต่การตั้งค่า Web Server และ HTTP Headers มีบทบาทสำคัญในการป้องกันการโจมตีฝั่งผู้ใช้งาน (Client-side Security)
2. **Usability & Security Coexistence:** ระบบที่ดีต้องให้ความสะดวกแก่ผู้ใช้ (High Usability) ควบคู่กับความปลอดภัยที่รัดกุม เช่น การสร้างปุ่ม Quick Login เพื่อความสะดวกในการทดสอบโดยที่ยังคงระบบ RBAC ไว้เต็มรูปแบบ

---

## 10. การประเมินตนเอง พร้อมเหตุผล (Self-Evaluation)
- **คะแนนประเมินตนเอง:** **9.5 / 10**
- **เหตุผล:** ข้าพเจ้าสามารถออกแบบและพัฒนาหน้าจอระบบทั้งหมดให้มีความสวยงาม ทันสมัย รองรับการใช้งานจริง พร้อมทั้งดูแลการ Deploy ขึ้น Cloud Vercel ได้สำเร็จ และแก้ไขปัญหาความปลอดภัยด้าน Security Headers จน Alert ใน OWASP ZAP ลดลงเหลือ 0 รายการ

---

## 11. การประเมินการมีส่วนร่วมของสมาชิกในกลุ่มแบบสั้น ๆ (Peer Assessment)
- **010 นายอภิสิทธิ์ ศรีพัฒน์ (ให้ 10/10):** รับผิดชอบงานฐานข้อมูลได้อย่างยอดเยี่ยม สามารถแก้ไขปัญหาความไม่เข้ากันของ SQLite บน Vercel และเขียนฟังก์ชัน Data Masking ปกป้องข้อมูล PDPA ได้อย่างสมบูรณ์แบบ
- **008 นายปภังกร ทองเจริญ (ให้ 10/10):** จัดการระบบ CI/CD Pipeline และ Semgrep SAST ได้อย่างเป็นมืออาชีพ ช่วยให้โค้ดของทีมได้รับการตรวจสอบความปลอดภัยโดยอัตโนมัติในทุกขั้นตอน
