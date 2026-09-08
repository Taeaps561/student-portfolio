# 🛡️ รายงานความคืบหน้าความมั่นคงปลอดภัยของโครงงาน (DevSecOps Security Progress Report)
## Sprint Security Review & Vulnerability Remediation

**รายวิชา:** DevSecOps (การปฏิบัติการพัฒนาและการรักษาความมั่นคงปลอดภัยระบบ)  
**ชื่อโครงงาน:** Student Portfolio & Skill Passport (ระบบแฟ้มสะสมผลงานดิจิทัลและเครือข่ายวิชาชีพนักศึกษา มสด.)  
**กลุ่มที่:** 3  
**GitHub Repository:** [https://github.com/Taeaps561/student-portfolio](https://github.com/Taeaps561/student-portfolio)  
**Production URL:** [https://student-portfolio-ten-phi.vercel.app](https://student-portfolio-ten-phi.vercel.app)  

### 👥 รายชื่อสมาชิกในกลุ่ม (3 คน)
1. **010 นายอภิสิทธิ์ ศรีพัฒน์** (Backend, Database & Security Lead)
2. **008 นายปภังกร ทองเจริญ** (DevSecOps Pipeline & API Security)
3. **009 นายปวีณวัชร์ เหลืองอุทัย** (Frontend, UX/UI & Deployment)

---

## 📊 ตารางสรุปการส่งงานตามเกณฑ์การให้คะแนน (คิดคะแนนเต็ม 50 คะแนน)

| เกณฑ์การตรวจให้คะแนน | คะแนนเต็ม | หัวข้อในเอกสารที่รายงาน | สถานะการดำเนินงาน |
| :--- | :---: | :--- | :---: |
| **1. Risk Assessment** | **5** | หัวข้อที่ 1: Asset, Attack Surface, OWASP Top 10, Risk Register (L × I) | ✅ ดำเนินการครบถ้วน |
| **2. Vulnerability Analysis** | **5** | หัวข้อที่ 2: วิเคราะห์ช่องโหว่คืออะไร เกิดที่ส่วนใด มีผลกระทบอย่างไร | ✅ ดำเนินการครบถ้วน |
| **3. Security Tools** | **5** | หัวข้อที่ 3: วงจร DevSecOps `Tool → Detect → Analyze → Fix` (4 เครื่องมือ) | ✅ ดำเนินการครบถ้วน |
| **4. Security Remediation** | **5** | หัวข้อที่ 4: แสดง Before / After เปรียบเทียบโค้ดและผลรันจริง 2 จุดขึ้นไป | ✅ ดำเนินการครบถ้วน |
| **5. Evidence + GitHub + Demo** | **30** | หัวข้อที่ 5: โครงสร้าง Evidence/, Git Commit History, คลิปสาธิต 5-8 นาที | ✅ ดำเนินการครบถ้วน |
| **รวมคะแนนความคืบหน้า** | **50** | **ส่งมอบครบถ้วนทั้ง 4 ส่วนงานตามเกณฑ์รายวิชา** | **สมบูรณ์ 100%** |

---

## 🏗️ 1. สถาปัตยกรรมระบบและทรัพย์สินสำคัญ (Architecture & Key Assets)

```
+─────────────────────────────────────────────────────────────────────────────+
|                        SYSTEM ARCHITECTURE & TRUST BOUNDARIES               |
+─────────────────────────────────────────────────────────────────────────────+
|  [Clients / Browsers]                                                       |
|       │                                                                     |
|       ▼ HTTPS (TLS 1.3) + Security Headers (CSP, HSTS, X-Frame-Options)     |
|  [Vercel Edge Network / Reverse Proxy]                                      |
|       │                                                                     |
|       ▼ Next.js 16 App Router (React Server Components & API Handlers)      |
|  ┌───────────────────────────────────────────────────────────────────────┐  |
|  │ Application Security Layer:                                           │  |
|  │  • NextAuth.js v4 (Secure Cookie JWT, Role-Based Access Control)      │  |
|  │  • Input Validation & Regex Sanitization (Anti-SSRF, Anti-XSS)        │  |
|  │  • PDPA Privacy Filter (GPA & Phone Number Data Masking Engine)       │  |
|  │  • Cryptographic Engine (SHA-256 Digital Certificate Signature)       │  |
|  └───────────────────────────────────────────────────────────────────────┘  |
|       │ Prisma ORM (100% Parameterized Queries / Prepared Statements)       |
|       ▼                                                                     |
|  [Database: SQLite (Dev) / PostgreSQL Cloud (Production)]                   |
|  • Least Privilege Database User                                            |
|  • Sensitive Data Isolation in .env                                         |
|  • Security Audit Log Records (AuditTrail)                                  |
+─────────────────────────────────────────────────────────────────────────────+
```

### 📦 รายการ Asset สำคัญของระบบ (Identified Key Assets)

| รหัส Asset | ทรัพย์สิน (Asset) | รายละเอียดและความสำคัญ | ระดับความสำคัญ (CIA) |
| :---: | :--- | :--- | :---: |
| **A-01** | **User Personal Data (PDPA)** | ข้อมูลส่วนบุคคลของนักศึกษา อาจารย์ นายจ้าง (ชื่อ, อีเมล, เบอร์โทรศัพท์, เกรดเฉลี่ย GPA) | **Confidentiality (สูง)** |
| **A-02** | **Digital Certificates & Verified Skills** | ข้อมูลใบประกาศนียบัตรดิจิทัลและตราประทับทักษะที่ผ่านการประเมิน พร้อมรหัส SHA-256 Signature | **Integrity (สูงมาก)** |
| **A-03** | **Authentication & Session Tokens** | Session Cookie (`next-auth.session-token`), JWT Secret, OAuth Provider Credentials | **Confidentiality / Integrity** |
| **A-04** | **Database & Prisma ORM** | โครงสร้างฐานข้อมูล ตารางข้อมูลความสัมพันธ์ 10 ตาราง และตาราง `AuditLog` | **Availability / Integrity** |
| **A-05** | **Application REST APIs** | เส้นทาง API ให้บริการข้อมูล (`/api/portfolio`, `/api/certificates`, `/api/teacher`, `/api/employer`) | **Availability / Integrity** |
| **A-06** | **Web Application Frontend** | หน้าจอแสดงผล Responsive UI สไตล์ LinkedIn สำหรับนักศึกษา อาจารย์ และสถานประกอบการ | **Availability** |

---

## 🎯 2. การวิเคราะห์พื้นผิวการโจมตี (Attack Surface Analysis)

การวิเคราะห์จุดที่ผู้โจมตี (Attackers) หรือบุคคลภายนอกสามารถส่งข้อมูลเข้ามาปฏิสัมพันธ์กับระบบได้:

| จุดเชื่อมต่อ (Surface Entry Point) | ประเภทโพรโทคอล | ข้อมูลนำเข้า (Input Vectors) | ความเสี่ยงที่อาจเกิดขึ้น | มาตรการควบคุม |
| :--- | :---: | :--- | :--- | :--- |
| **Login & Register Forms** | HTTP POST | Email, Password, Role | Credential Stuffing, Brute Force, User Enumeration | Generic Error Messages, JWT Token, Input Validation |
| **Community Feed & Comments** | HTTP POST | Post content, Comment text, Tag, Image URL | Stored XSS, HTML Injection, Excessive Payload | Content Sanitization, Trim string, React JSX auto-escaping |
| **Portfolio & Data Listing API** | HTTP GET | Query parameters (`publicOnly`, `tag`, `type`) | Broken Object Level Authorization, Information Exposure (PDPA) | บังคับตรวจสอบ Session, คัดกรอง `isPublic: true`, ทำ Data Masking |
| **Employer Matching Engine** | HTTP POST | Job Description text, Skill filters, Min score | Unauthorized Data Scraping, Broken Access Control | บังคับสิทธิ์ `EMPLOYER`/`TEACHER` เท่านั้น, Masking ข้อมูลอ่อนไหว |
| **Digital Certificate Verification** | HTTP GET | Certificate SHA-256 Hash query (`?hash=...`) | Parameter Tampering, SQL Injection, Hash Collision | Parameterized Query ผ่าน Prisma, Hex hash validation |
| **GitHub Integration Proxy** | HTTP GET | GitHub username (`?username=...`) | SSRF (Server-Side Request Forgery), Path Traversal | Regular Expression Whitelist (`^[a-zA-Z0-9-]{1,39}$`) |
| **Client HTTP Headers** | HTTP Any | Referer, Host, Cookie, User-Agent | Clickjacking, MIME Sniffing, SSL Strip | เพิ่ม 7 HTTP Security Headers ใน `next.config.ts` |

---

## 📋 3. ทะเบียนความเสี่ยง (Risk Register) — ประเมินตามกรอบ OWASP Top 10

เกณฑ์การประเมิน:  
- **Likelihood (โอกาสเกิด):** 1 (น้อยมาก) ถึง 5 (เกิดบ่อยมาก)  
- **Impact (ผลกระทบ):** 1 (น้อยมาก) ถึง 5 (รุนแรงร้ายแรง)  
- **Risk Score = Likelihood × Impact:**  
  - 1–6: **Low** | 7–12: **Medium** | 13–19: **High** | 20–25: **Critical**

| ID | Asset ที่เกี่ยวข้อง | ภัยคุกคาม / จุดอ่อน (Threat / Vulnerability) | OWASP Category | Likelihood (1-5) | Impact (1-5) | Risk Score / Level | แนวทางการแก้ไข (Mitigation / Remediation) | สถานะ (Status) |
| :---: | :---: | :--- | :---: | :---: | :---: | :---: | :--- | :---: |
| **R01** | Web Server / Browser | **Missing HTTP Security Headers:** ขาด CSP, Anti-Clickjacking (`X-Frame-Options`), nosniff, HSTS | **A05:2021 Security Misconfiguration** | 4 | 3 | **12 (Medium)** | กำหนดค่า Security Headers แบบรวมศูนย์ใน `next.config.ts` ครอบคลุมทุก Route | **FIXED** |
| **R02** | User Data / API | **Broken Object Level Authorization & PDPA Leak:** API ส่งข้อมูลเบอร์โทรศัพท์ เกรดเฉลี่ย และโปรไฟล์ส่วนตัวให้คนภายนอก | **A01:2021 Broken Access Control** | 4 | 5 | **20 (Critical)** | บังคับกรองเฉพาะ `isPublic: true` และทำ Data Masking ซ่อน GPA/เบอร์โทร | **FIXED** |
| **R03** | Authentication / Login | **Broken Authentication Logic:** ระบบไม่ตรวจสอบความถูกต้องของรหัสผ่านในบางโฟลว์ล็อกอิน | **A07:2021 Identification & Auth Failures** | 4 | 5 | **20 (Critical)** | ปรับปรุงตรรกะ Credentials Validation ให้ปฏิเสธรหัสผ่านว่างเปล่า และบันทึก AuditLog | **FIXED** |
| **R04** | Dependencies / Packages | **Vulnerable Third-Party Packages:** ตรวจพบ 10 ช่องโหว่จาก `npm audit` (next-auth critical, next.js high, sharp) | **A06:2021 Vulnerable Components** | 3 | 4 | **12 (Medium)** | รัน `npm audit fix`, ตั้ง Security Quality Gate ใน CI Pipeline ตรวจจับก่อน Build | **FIXED / MITIGATED** |
| **R05** | API / External Proxy | **Potential SSRF on GitHub Proxy:** พารามิเตอร์ username ไม่ได้ Validate รูปแบบอักขระก่อนส่งต่อไปยัง GitHub | **A10:2021 Server-Side Request Forgery** | 2 | 4 | **8 (Medium)** | เพิ่ม Regex Validation ตรวจสอบรูปแบบ GitHub username อย่างเคร่งครัด | **FIXED** |
| **R06** | Database | **SQL Injection Risk:** การโจมตีฐานข้อมูลผ่าน Input ฟอร์มค้นหาและล็อกอิน | **A03:2021 Injection** | 3 | 5 | **15 (High)** | ใช้ **Prisma ORM Prepared Statements** 100% ป้องกัน SQL Injection ได้อย่างสมบูรณ์ | **FIXED** |

---

## 🛠️ 4. การใช้งานเครื่องมือความมั่นคงปลอดภัยตามวงจร DevSecOps
### (Tool → Detect → Analyze → Fix)

เอกสารนี้แสดงการใช้งานเครื่องมือจริงบนระบบโปรเจกต์ของตนเอง ครอบคลุมทั้ง **Detection (ตรวจจับ)** และ **Prevention (ป้องกัน)**:

### 4.1 เครื่องมือที่ 1: OWASP ZAP (DAST - Dynamic Application Security Testing)
- **Tool:** OWASP ZAP (Zed Attack Proxy) v2.14+
- **Detect:** ทำการสแกนระบบจริงตรวจพบ Alert ระดับ Medium/Low จำนวน 5 รายการ:
  - *Missing Anti-Clickjacking Header (`X-Frame-Options`)*
  - *Missing Content Security Policy (CSP)*
  - *Missing `X-Content-Type-Options: nosniff`*
  - *Missing `Strict-Transport-Security` (HSTS)*
- **Analyze:** ประเมินความเสี่ยงพบว่า ผู้ไม่หวังดีสามารถนำเว็บแอปพลิเคชันไปทำ Clickjacking หลอกให้ผู้ใช้คลิกอนุมัติใบประกาศนียบัตร หรืออาศัย MIME Sniffing รันสคริปต์อันตรายได้
- **Fix:** ปรับปรุง `next.config.ts` เพิ่ม Security Headers ทุก Route
- **Verification:** สแกนซ้ำ (Rescan) ผลการแจ้งเตือนในหมวด Security Headers ลดลงเหลือ **0 Alerts**
- 📁 *หลักฐานฉบับเต็ม:* [evidence/zap/zap-scan-report.md](file:///c:/Users/Taeaps/Documents/Project_web/student-portfolio/evidence/zap/zap-scan-report.md) และ [evidence/zap/security-headers-comparison.txt](file:///c:/Users/Taeaps/Documents/Project_web/student-portfolio/evidence/zap/security-headers-comparison.txt)

---

### 4.2 เครื่องมือที่ 2: Burp Suite (Web Testing & Interception)
- **Tool:** Burp Suite Professional / Community Edition
- **Detect:** ใช้ Repeater ส่ง Request เข้าสู่ `GET /api/portfolio` และ `POST /api/employer/matching` โดยไม่มี Session Token พบว่า Server ตอบกลับ HTTP 200 OK พร้อมข้อมูลนักศึกษาแบบ Unmasked (เบอร์โทร, GPA)
- **Analyze:** เข้าข่ายช่องโหว่ร้ายแรง **OWASP A01:2021 Broken Access Control** และละเมิดกฎหมาย **PDPA** ผู้ไม่ประสงค์ดีสามารถ Scrap ข้อมูลส่วนบุคคลของนักศึกษาทั้งสถาบันได้
- **Fix:** 
  1. เพิ่ม `getServerSession(authOptions)` ตรวจสอบสิทธิ์ Server-side
  2. กำหนดเงื่อนไข `where: { isPublic: true }` หากไม่มีสิทธิ์พิเศษ
  3. ติดตั้งฟังก์ชัน Masking เบอร์โทรศัพท์เป็น `081-XXX-XXXX` และซ่อน GPA
- **Verification:** ส่ง Request ซ้ำผ่าน Burp Repeater พบว่า API ตอบกลับ HTTP 401 Unauthorized สำหรับเส้นทางนายจ้าง และตอบกลับข้อมูลที่ Mask เรียบร้อยแล้วสำหรับเส้นทางสาธารณะ
- 📁 *หลักฐานฉบับเต็ม:* [evidence/burpsuite/burp-request-response.md](file:///c:/Users/Taeaps/Documents/Project_web/student-portfolio/evidence/burpsuite/burp-request-response.md) และ [evidence/burpsuite/raw-http-traffic.txt](file:///c:/Users/Taeaps/Documents/Project_web/student-portfolio/evidence/burpsuite/raw-http-traffic.txt)

---

### 4.3 เครื่องมือที่ 3: npm audit & Semgrep (SCA & SAST Code Analysis)
- **Tool:** `npm audit` (Software Composition Analysis) และ Semgrep CLI / GitHub Actions
- **Detect:**
  - `npm audit` ตรวจพบ 10 ช่องโหว่ (1 Critical ใน `next-auth`, 7 High ใน `next`, `sharp`, `postcss`)
  - Semgrep SAST ตรวจพบจุดอ่อนรหัสผ่านใน `[...nextauth]/route.ts` (CWE-287) และช่องโหว่ Input ใน `github/route.ts` (CWE-918)
- **Analyze:**
  - `next-auth` มีช่องโหว่ Unicode homoglyph bypass (GHSA-7rqj-j65f-68wh)
  - พารามิเตอร์ภายนอกที่ส่งเข้า GitHub API อาจนำไปสู่ SSRF
- **Fix:**
  1. รัน `npm audit fix` เพื่ออัปเกรด Dependencies ที่เข้ากันได้
  2. เสริมการป้องกันที่ Application Layer: ตรวจสอบความยาวและรูปแบบรหัสผ่าน
  3. เพิ่ม Regular Expression Whitelist สำหรับพารามิเตอร์ `username`
  4. ตั้งค่า Security Quality Gate ใน `.github/workflows/sast-security.yml` ให้ตรวจสอบโค้ดอัตโนมัติทุก Commit
- 📁 *หลักฐานฉบับเต็ม:* [evidence/sast/semgrep-sast-report.md](file:///c:/Users/Taeaps/Documents/Project_web/student-portfolio/evidence/sast/semgrep-sast-report.md) และ [evidence/sast/npm-audit-report.txt](file:///c:/Users/Taeaps/Documents/Project_web/student-portfolio/evidence/sast/npm-audit-report.txt)

---

### 4.4 เครื่องมือที่ 4: Database Security & Prisma ORM (Prevention)
- **Tool:** Prisma ORM Parameterized Query Engine & SQLite / PostgreSQL Security
- **Detect:** ทดสอบ SQL Injection Payload ทั่วไป (`' OR '1'='1' --`) ในฟอร์มค้นหาและล็อกอิน
- **Analyze:** การเกิด SQLi จะทำให้ผู้โจมตีเข้าถึงตาราง `User`, `Portfolio`, `AuditLog` ทั้งหมด
- **Fix:** ใช้ Prisma Query Builders (`prisma.user.findUnique`, `prisma.portfolio.findMany`) ซึ่งบังคับใช้ Prepared Statements / Parameterized Queries 100% โดยไม่อนุญาตให้รัน Raw Query String Interpolation
- **Verification:** Payload ทั้งหมดถูกมองเป็น Literal String และคืนค่า `null` อย่างปลอดภัย
- 📁 *หลักฐานฉบับเต็ม:* [evidence/database/db-security-analysis.md](file:///c:/Users/Taeaps/Documents/Project_web/student-portfolio/evidence/database/db-security-analysis.md) และ [evidence/database/prisma-sqli-prevention.md](file:///c:/Users/Taeaps/Documents/Project_web/student-portfolio/evidence/database/prisma-sqli-prevention.md)

---

## 🔄 5. สรุปหลักฐานเปรียบเทียบก่อนและหลังแก้ไข (Before / After Evidence)

| จุดที่แก้ไข | รายละเอียดช่องโหว่เดิม (Before) | วิธีการแก้ไขใน Source Code (Remediation) | ผลลัพธ์หลังแก้ไข (After) | เอกสารหลักฐาน |
| :---: | :--- | :--- | :--- | :---: |
| **จุดที่ 1** | **Missing HTTP Security Headers:**<br>ไม่มี CSP, X-Frame-Options, nosniff, HSTS เสี่ยงต่อ Clickjacking | แก้ไข `next.config.ts` เพิ่ม HTTP Security Headers 7 รายการส่งให้ทุก Route | cURL และ OWASP ZAP ยืนยันว่าพบ Security Headers ครบถ้วน (Alerts = 0) | [fix1-security-headers.md](file:///c:/Users/Taeaps/Documents/Project_web/student-portfolio/evidence/before-after/fix1-security-headers.md) |
| **จุดที่ 2** | **Broken Access Control & PDPA Leak:**<br>API ส่งข้อมูลเกรด GPA เบอร์โทร และโปรไฟล์ส่วนตัวให้ผู้ใช้ภายนอก | แก้ไข `api/portfolio` และ `api/employer/matching` เพิ่ม Server Session check, คัดกรอง `isPublic` และทำ Masking ข้อมูล | ผู้ใช้ทั่วไปไม่เห็น GPA และเบอร์โทรถูก Mask เป็น `081-XXX-XXXX`, API นายจ้างบล็อก unauthenticated ด้วย 401 | [fix2-broken-access-control-and-pdpa.md](file:///c:/Users/Taeaps/Documents/Project_web/student-portfolio/evidence/before-after/fix2-broken-access-control-and-pdpa.md) |
| **จุดที่ 3** | **Broken Auth & Unchecked SSRF:**<br>API Credentials ขาดการตรวจรหัสผ่าน และ GitHub API ขาดการตรวจสอบ Input | ปรับปรุง `[...nextauth]/route.ts` ตรวจสอบรหัสผ่านขั้นต่ำ + บันทึก `AuditLog` และเพิ่ม Regex Whitelist ใน `github/route.ts` | ป้องกันการบายพาสรหัสผ่านสำเร็จ มี Audit Log ติดตามย้อนกลับ และตัดการโจมตี SSRF ด้วย 400 Bad Request | [fix3-authentication-and-input-validation.md](file:///c:/Users/Taeaps/Documents/Project_web/student-portfolio/evidence/before-after/fix3-authentication-and-input-validation.md) |

---

## 📁 6. โครงสร้างโฟลเดอร์หลักฐานในโปรเจกต์ (Evidence Directory Structure)

```
student-portfolio/
├── SECURITY_PROGRESS.md                          # เอกสารรายงานความมั่นคงปลอดภัยฉบับสมบูรณ์
├── DEMO_VIDEO_SCRIPT.md                          # บทและขั้นตอนการอัดคลิปวิดีโอสาธิต 5-8 นาที
├── next.config.ts                                # [แก้ไขจริง] กำหนดค่า Security Headers
├── evidence/
│   ├── zap/
│   │   ├── zap-scan-report.md                    # รายงานผลสแกน DAST ก่อน-หลัง
│   │   └── security-headers-comparison.txt       # หลักฐาน Raw Header Comparison
│   ├── burpsuite/
│   │   ├── burp-request-response.md              # ผลการทดสอบ Intercept API Request/Response
│   │   └── raw-http-traffic.txt                  # บันทึก Raw HTTP Traffic Logs
│   ├── sast/
│   │   ├── semgrep-sast-report.md                # รายงานผล Static Code Analysis (Semgrep)
│   │   └── npm-audit-report.txt                  # รายงานช่องโหว่ Dependency จาก npm audit
│   ├── database/
│   │   ├── db-security-analysis.md               # การวิเคราะห์ความปลอดภัยฐานข้อมูลและ Least Privilege
│   │   └── prisma-sqli-prevention.md             # กลไกป้องกัน SQL Injection ด้วย Parameterized Query
│   └── before-after/
│       ├── fix1-security-headers.md              # หลักฐานก่อน-หลัง จุดที่ 1 (Security Headers)
│       ├── fix2-broken-access-control-and-pdpa.md# หลักฐานก่อน-หลัง จุดที่ 2 (Access Control & PDPA)
│       └── fix3-authentication-and-input-validation.md # จุดที่ 3 (Authentication & SSRF Input Validation)
└── src/
    └── app/
        └── api/
            ├── auth/[...nextauth]/route.ts       # [แก้ไขจริง] ปรับปรุงตรรกะ Authentication & AuditLog
            ├── portfolio/route.ts                # [แก้ไขจริง] เพิ่ม Public Filter & PDPA Data Masking
            ├── employer/matching/route.ts        # [แก้ไขจริง] เพิ่ม Server RBAC Check (EMPLOYER role)
            └── github/route.ts                   # [แก้ไขจริง] เพิ่ม Strict Regex Whitelist ป้องกัน SSRF
```

---

## 🚀 7. การเชื่อมโยงสู่วงจร DevSecOps CI/CD Pipeline ใน Sprint ถัดไป

```
[ Developer Push ] ──► [ GitHub Actions CI ] ──► [ Quality Gate: SAST & SCA ] ──► [ Build & Deploy ] ──► [ DAST & Monitoring ]
      git push               Run Automated              • Semgrep SAST                 Vercel Cloud          • OWASP ZAP Scan
                             Security Pipeline          • npm audit (--high)           Production URL        • Database AuditLogs
```

ระบบที่ปรับปรุงแล้วพร้อมเชื่อมต่อเข้าสู่ขั้นตอน Automated DevSecOps Pipeline เต็มรูปแบบ ช่วยให้ตรวจพบและแก้ไขจุดอ่อนความปลอดภัยได้ทันทีในทุกรอบของการพัฒนา (Continuous Security).
