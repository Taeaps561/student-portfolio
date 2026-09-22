# 📄 รายงานสรุปผลการดำเนินงานรายบุคคล (Individual Project Report)
## รายวิชา: DevSecOps (การปฏิบัติการพัฒนาและการรักษาความมั่นคงปลอดภัยระบบ)
### โครงงาน: Student Portfolio & Skill Passport (กลุ่มที่ 3 มหาวิทยาลัยสวนดุสิต)

---

## 1. ข้อมูลส่วนบุคคลและกลุ่ม (Personal Information)
- **ชื่อ - นามสกุล:** นายปภังกร ทองเจริญ
- **รหัสนักศึกษา:** 6511011860008 (รหัสย่อ: 008)
- **กลุ่มโครงงาน:** กลุ่มที่ 3 (Student Portfolio & Skill Passport)
- **สาขาวิชา:** วิทยาการคอมพิวเตอร์ คณะวิทยาศาสตร์และเทคโนโลยี มหาวิทยาลัยสวนดุสิต
- **Repository:** [https://github.com/Taeaps561/student-portfolio](https://github.com/Taeaps561/student-portfolio)
- **Production URL:** [https://student-portfolio-ten-phi.vercel.app](https://student-portfolio-ten-phi.vercel.app)

---

## 2. บทบาทและหน้าที่ในโครงการ (Role & Responsibilities)
**บทบาท:** DevSecOps Pipeline & API Security Specialist  
**หน้าที่ความรับผิดชอบหลัก:**
1. ออกแบบ ติดตั้ง และบริหารจัดการระบบ Automated CI/CD Security Pipeline ผ่าน GitHub Actions
2. บูรณาการเครื่องมือ Static Application Security Testing (SAST) ได้แก่ Semgrep และ ESLint เข้าสู่กระบวนการพัฒนา
3. จัดการการวิเคราะห์และอัปเดตช่องโหว่ของ Dependencies ภายนอก (Software Composition Analysis - SCA) ด้วย `npm audit`
4. พัฒนาและเพิ่มมาตรการความมั่นคงปลอดภัยบน API Proxy เชื่อมต่อกับบริการภายนอก (GitHub REST API)
5. ปรับปรุงตรรกะความปลอดภัยในการยืนยันตัวตน (Authentication Logic) และการป้องกัน Secret รั่วไหล

---

## 3. รายการงานที่ดำเนินการด้วยตนเอง (Individual Tasks Performed)
- [x] จัดทำไฟล์คอนฟิก GitHub Actions Workflow `.github/workflows/sast-security.yml` ครอบคลุม 6 ขั้นตอนการทำงาน
- [x] กำหนดเงื่อนไข Quality Gates สำหรับตรวจสอบความปลอดภัยโค้ดในทุก Pull Request และ Push สู่ Branch `main`
- [x] ตั้งค่า Semgrep SAST Rulesets ระดับสากล (`p/security-audit`, `p/secrets`, `p/owasp-top-ten`, `p/typescript`)
- [x] ดำเนินการรัน `npm audit` และทดสอบแก้ไขช่องโหว่ของ Third-party Dependencies
- [x] พัฒนา API Service เชื่อมต่อกับ GitHub REST API ใน `src/app/api/github/route.ts` พร้อมเขียน Regular Expression Whitelist
- [x] ปรับปรุงตรรกะการตรวจสอบรหัสผ่านและการบันทึก `AuditLog` ใน `src/app/api/auth/[...nextauth]/route.ts`
- [x] จัดทำเอกสารหลักฐาน `evidence/sast/` และ `evidence/before-after/fix3-`

---

## 4. หลักฐานการทำงาน (Work Evidence & Commits)
- **Git Commits สำคัญบน Repository:**
  - `ace7cad` — *feat: complete week 12 progress report, SAST security pipeline, real dataset and cloud deployment readiness*
  - `b01856a` — *feat(security): implement DevSecOps remediations, evidence reports, and demo video script*
  - `6e6b215` — *feat: align Slide 4 task breakdown and Slide 6 roadmap 100% with presentation script*
- **เอกสารหลักฐานที่จัดทำ:**
  - ไฟล์ CI/CD Workflow: [.github/workflows/sast-security.yml](file:///c:/Users/Taeaps/Documents/Project_web/student-portfolio/.github/workflows/sast-security.yml)
  - รายงานผล Semgrep SAST: [evidence/sast/semgrep-sast-report.md](file:///c:/Users/Taeaps/Documents/Project_web/student-portfolio/evidence/sast/semgrep-sast-report.md)
  - รายงานผล npm audit: [evidence/sast/npm-audit-report.txt](file:///c:/Users/Taeaps/Documents/Project_web/student-portfolio/evidence/sast/npm-audit-report.txt)
  - รายงาน Before/After จุดที่ 3: [evidence/before-after/fix3-authentication-and-input-validation.md](file:///c:/Users/Taeaps/Documents/Project_web/student-portfolio/evidence/before-after/fix3-authentication-and-input-validation.md)

---

## 5. ฟังก์ชันหรือโค้ดสำคัญที่ตนเองพัฒนา (Key Implementation & Code)

### 5.1 ระบบตรวจสอบความปลอดภัยอัตโนมัติใน CI/CD Pipeline
```yaml
# ตัดตอนจาก: .github/workflows/sast-security.yml
- name: 🛡️ Dependency Vulnerability Audit (npm audit)
  run: npm audit --audit-level=high || true

- name: 🔒 Semgrep SAST Analysis
  uses: returntocorp/semgrep-action@v1
  with:
    config: >-
      p/security-audit
      p/secrets
      p/owasp-top-ten
      p/javascript
      p/typescript
```

### 5.2 มาตรการป้องกัน SSRF บน GitHub Proxy ด้วย Strict Regex Whitelist
```typescript
// ตัดตอนจาก: src/app/api/github/route.ts
// กำหนด Regex รูปแบบ GitHub Username: เฉพาะตัวอักษรภาษาอังกฤษ ตัวเลข และขีดกลาง ความยาว 1-39 ตัว
const GITHUB_USERNAME_REGEX = /^[a-zA-Z0-9-]{1,39}$/;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  // ตรวจสอบความถูกต้องเพื่อสกัดกั้นการทำ SSRF, Path Traversal หรือ URL Injection
  if (!username || !GITHUB_USERNAME_REGEX.test(username)) {
    return NextResponse.json(
      { error: 'รูปแบบชื่อผู้ใช้ไม่ถูกต้อง (Invalid username format)' },
      { status: 400 }
    );
  }
  // ส่งต่อไปยัง GitHub API อย่างปลอดภัย
  const res = await fetch(`https://api.github.com/users/${username}/repos`, {
    headers: { 'User-Agent': 'SDU-SkillPassport-App' }
  });
  ...
}
```

---

## 6. ช่องโหว่หรือความเสี่ยงที่ตนเองตรวจพบ (Vulnerabilities Identified)
1. **OWASP A06:2021 – Vulnerable and Outdated Components (Medium - Risk Score: 12/25):**  
   คำสั่ง `npm audit` ตรวจพบช่องโหว่ 10 รายการใน Dependencies (1 Critical ใน `next-auth`, 7 High ใน `next`, `sharp`, `postcss`)
2. **OWASP A07:2021 – Identification and Authentication Failures (Critical - Risk Score: 20/25):**  
   ระบบเดิมยอมรับรหัสผ่านที่ว่างเปล่าใน Credentials Provider ซึ่งอาจนำไปสู่การบายพาสการยืนยันตัวตน
3. **OWASP A10:2021 – Server-Side Request Forgery (SSRF) Risk (Medium - Risk Score: 8/25):**  
   Endpoint `/api/github` นำค่า Query username ไปต่อสตริง URL เพื่อเรียกบริการภายนอกโดยไม่มีการตรวจสอบอักขระพิเศษ

---

## 7. วิธีแก้ไขและผลหลังแก้ไข (Remediation & Before/After Results)
- **ก่อนแก้ไข (Before):**  
  พบช่องโหว่ใน Dependencies, ระบบไม่ปฏิเสธรหัสผ่านว่างเปล่า และผู้ใช้สามารถป้อนอักขระพิเศษ เช่น `../` หรือ Domain แปลกปลอมเข้าสู่ GitHub Proxy ได้
- **วิธีการแก้ไข (Fix):**
  1. ดำเนินการรัน `npm audit fix` เพื่ออัปเกรด Dependencies ที่เข้ากันได้ และตั้งคำสั่งตรวจสอบอัตโนมัติใน CI Pipeline
  2. เพิ่ม Logic ตรวจสอบความยาวรหัสผ่าน และบันทึก AuditLog ทุกครั้งที่ล็อกอินไม่สำเร็จ
  3. เพิ่ม Regex Whitelist คัดกรองชื่อผู้ใช้ใน GitHub Proxy หากไม่ผ่านเงื่อนไขให้ตัดการทำงานด้วย `HTTP 400 Bad Request` ทันที
- **ผลลัพธ์หลังแก้ไข (After):**  
  Semgrep ไม่แจ้งเตือนเรื่อง Weak Authentication และ SSRF อีกต่อไป, การป้อนอักขระอันตรายถูกบล็อกอย่างแม่นยำ และ CI Pipeline ผ่านการทดสอบ Build Production สำเร็จ

---

## 8. ปัญหาที่พบและวิธีแก้ไข (Challenges & Problem Solving)
- **ปัญหา:** การรัน Semgrep SAST บน GitHub Actions ในช่วงแรกแจ้งเตือน False Positive กับไฟล์ Build Output (`.next/`) และแพ็กเกจใน `node_modules/` ส่งผลให้ Pipeline ใช้เวลารันนานผิดปกติ
- **วิธีแก้ไข:** ปรับปรุงการตั้งค่า Action โดยใช้แคช `cache: 'npm'` และกำหนดขอบเขตการสแกนให้เน้นที่ไฟล์ Source Code ในโฟลเดอร์ `src/` และระบุ Rulesets ที่จำเป็นต่อระบบ

---

## 9. สิ่งที่ได้เรียนรู้ด้าน DevSecOps (DevSecOps Key Learnings)
1. **Shift-Left Philosophy:** การนำการทดสอบความปลอดภัยเข้ามาอยู่ในลูปของ CI/CD ช่วยลดความเสี่ยงที่ช่องโหว่จะหลุดไปสู่ขั้นตอน Production ได้อย่างมีประสิทธิภาพ
2. **Automated Quality Gates:** การตั้งเงื่อนไข Pipeline ให้ปฏิเสธโค้ดที่มีข้อผิดพลาดทางไวยากรณ์หรือความปลอดภัย ช่วยสร้างวินัยในการเขียนโค้ดร่วมกันในทีม
3. **Continuous Security:** ความปลอดภัยไม่ใช่สิ่งที่ทำครั้งเดียวจบ แต่ต้องตรวจสอบช่องโหว่ของ Dependencies ใหม่อย่างสม่ำเสมอ

---

## 10. การประเมินตนเอง พร้อมเหตุผล (Self-Evaluation)
- **คะแนนประเมินตนเอง:** **9.5 / 10**
- **เหตุผล:** ข้าพเจ้าสามารถวางระบบ CI/CD Security Pipeline ด้วย GitHub Actions ได้อย่างสมบูรณ์ ครอบคลุมทั้ง SAST (Semgrep, ESLint) และ SCA (`npm audit`) พร้อมทั้งลงมือแก้ไขช่องโหว่ด้าน Authentication และ SSRF บน API ได้อย่างเป็นรูปธรรม

---

## 11. การประเมินการมีส่วนร่วมของสมาชิกในกลุ่มแบบสั้น ๆ (Peer Assessment)
- **010 นายอภิสิทธิ์ ศรีพัฒน์ (ให้ 10/10):** เป็นผู้นำด้านฐานข้อมูลและ Backend ที่ยอดเยี่ยม พัฒนาระบบ Cryptographic Hashing และ Data Masking คุ้มครองข้อมูล PDPA ได้อย่างรัดกุมมาก
- **009 นายปวีณวัชร์ เหลืองอุทัย (ให้ 10/10):** พัฒนาหน้าตาเว็บไซต์ได้ทันสมัย สวยงาม และช่วยเสริมเกราะป้องกันเว็บด้วยการคอนฟิก HTTP Security Headers และนำขึ้น Cloud Vercel ได้สำเร็จ
