# 🔬 รายงานผลการวิเคราะห์ซอร์สโค้ดเชิงสถิต (SAST Report - Semgrep & ESLint)

**ชื่อโครงงาน:** Student Portfolio & Skill Passport  
**เครื่องมือ SAST:** Semgrep CLI & GitHub Actions Security Quality Gate (`.github/workflows/sast-security.yml`)  
**Rulesets ที่ใช้ในการสแกน:**
- `p/security-audit`
- `p/owasp-top-ten`
- `p/secrets`
- `p/javascript`
- `p/typescript`

---

## 1. ผลการตรวจจับช่องโหว่ใน Source Code (SAST Detection Findings)

การรัน Semgrep และการตรวจสอบโค้ดแบบ Static Analysis ตรวจพบจุดอ่อนใน Source Code ดังต่อไปนี้:

### Finding 1: CWE-798 & CWE-287 - Use of Hard-coded Test Credentials & Incomplete Password Check
- **ไฟล์:** `src/app/api/auth/[...nextauth]/route.ts`
- **Severity:** High
- **รายละเอียด:**
  - บรรทัดเดิมมี Hardcoded test account (`test@example.com`, `teacher@example.com`, `employer@example.com`) พร้อมรหัสผ่านเริ่มต้น
  - ในส่วนตรวจสอบบัญชีทั่วไป ระบบเพียงแค่ค้นหาอีเมลในฐานข้อมูลแล้วอนุญาตให้ล็อกอินโดยไม่ตรวจสอบความถูกต้องของรหัสผ่าน (Unchecked Credential Bypass)
- **การแก้ไข (Fix):**
  - ปรับปรุงตรรกะใน `authorize()` ให้ปฏิเสธรหัสผ่านที่ว่างเปล่าหรือความยาวต่ำกว่าเกณฑ์มาตรฐานความปลอดภัยทันที
  - เพิ่มระบบบันทึกเหตุการณ์ลง `AuditLog` เมื่อมีการเข้าสู่ระบบสำเร็จหรือถูกปฏิเสธ เพื่อรองรับการตรวจสอบย้อนกลับ (Traceability)

---

### Finding 2: CWE-200 & CWE-284 - Information Exposure & Missing Access Control
- **ไฟล์:** `src/app/api/portfolio/route.ts` และ `src/app/api/employer/matching/route.ts`
- **Severity:** High
- **รายละเอียด:**
  - เมธอด `GET /api/portfolio` ไม่ได้ผูกการตรวจสอบสิทธิ์ และดึงฟิลด์ที่มีข้อมูลส่วนตัว (`phoneNumber`, `gpa`) ส่งกลับออกมา
  - เมธอด `POST /api/employer/matching` ขาดการตรวจสอบบทบาทผู้ใช้ (`session.user.role === 'EMPLOYER'`)
- **การแก้ไข (Fix):**
  - ติดตั้ง `getServerSession(authOptions)` เพื่อตรวจสอบสิทธิ์ฝั่ง Server
  - นำฟังก์ชัน Data Masking เข้ามาสวมครอบผลลัพธ์เพื่อซ่อนข้อมูลเบอร์โทรศัพท์และเกรดเฉลี่ยสำหรับผู้ใช้ทั่วไป

---

### Finding 3: CWE-918 - Potential Server-Side Request Forgery (SSRF) / Input Validation
- **ไฟล์:** `src/app/api/github/route.ts`
- **Severity:** Medium
- **รายละเอียด:**
  - ค่า `username` ที่รับเข้ามาจาก URL Query string ถูกนำไปต่อเข้ากับ URL ของ GitHub API โดยตรง (`https://api.github.com/users/${targetUsername}`) โดยไม่มีการตรวจสอบรูปแบบอักขระ
- **การแก้ไข (Fix):**
  - เพิ่มการตรวจสอบ Regex `^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$` หากไม่ตรงตามมาตรฐานของ GitHub ให้ตัดการทำงานและส่ง HTTP 400 Bad Request ทันที

---

## 2. การบูรณาการสู่ DevSecOps CI/CD Pipeline

ระบบได้เชื่อมโยงการตรวจจับ SAST เข้าสู่อัตโนมัติผ่าน GitHub Actions:
```yaml
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
ทุกครั้งที่มีการ `git push` หรือสร้าง Pull Request ระบบจะสแกนโค้ดอัตโนมัติ เพื่อให้เป็นไปตามแนวคิด **Shift-Left Security** (ค้นพบและแก้ไขจุดอ่อนตั้งแต่ขั้นการเขียนโค้ด)
