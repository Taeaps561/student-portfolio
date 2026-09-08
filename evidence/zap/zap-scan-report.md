# 🛡️ รายงานผลการทดสอบความปลอดภัยด้วย OWASP ZAP (DAST Scan Report)

**ชื่อระบบที่ทดสอบ:** Student Portfolio & Skill Passport (ระบบแฟ้มสะสมผลงานดิจิทัล มสด.)  
**เป้าหมายการทดสอบ (Target URL):** `https://student-portfolio-ten-phi.vercel.app` และ `http://localhost:3000`  
**ประเภทการทดสอบ:** Dynamic Application Security Testing (DAST)  
**เครื่องมือ:** OWASP ZAP (Zed Attack Proxy) v2.14+  
**วันที่ทดสอบ:** กันยายน 2026  

---

## 1. ผลการตรวจจับช่องโหว่ก่อนการแก้ไข (Before Remediation - Initial Baseline Scan)

ผลการทดสอบแบบ Baseline Scan และ Passive Scan บนหน้าหลักและ API Endpoints ตรวจพบ Alert ด้านความมั่นคงปลอดภัยดังนี้:

| Alert ID | Alert Description | Risk Level | Confidence | OWASP Category | CWE |
| :---: | :--- | :---: | :---: | :--- | :---: |
| **ZAP-10038** | Content Security Policy (CSP) Header Not Set | **Medium** | High | A05:2021-Security Misconfiguration | CWE-693 |
| **ZAP-10020** | Anti-Clickjacking: Missing X-Frame-Options Header | **Medium** | High | A05:2021-Security Misconfiguration | CWE-1021 |
| **ZAP-10021** | X-Content-Type-Options Header Missing | **Low** | High | A05:2021-Security Misconfiguration | CWE-16 |
| **ZAP-10035** | Strict-Transport-Security Header Not Set | **Low** | High | A05:2021-Security Misconfiguration | CWE-319 |
| **ZAP-10063** | Permissions-Policy Header Not Set | **Informational** | Medium | A05:2021-Security Misconfiguration | CWE-693 |
| **ZAP-10044** | Big Redirect Detected (OAuth Flow Redirection) | **Informational** | Low | A01:2021-Broken Access Control | CWE-601 |

---

## 2. การวิเคราะห์จุดอ่อนและความเสี่ยง (Vulnerability & Threat Analysis)

### 2.1 Missing Content-Security-Policy (CSP) & X-Frame-Options
- **จุดที่ตรวจพบ:** ทุก Route ในเว็บแอปพลิเคชัน (`/`, `/feed`, `/portfolio`, `/login`)
- **การวิเคราะห์ผลกระทบ:**
  - **Clickjacking (UI Redressing):** หากไม่มี `X-Frame-Options: SAMEORIGIN` หรือ `frame-ancestors 'self'` ผู้โจมตีสามารถนำเว็บแอปพลิเคชันไปฝังลงใน `<iframe>` บนเว็บไซต์ปลอม แล้วหลอกล่อให้ผู้ใช้คลิกปุ่มอนุมัติทักษะ หรือกดแก้ไขข้อมูลโดยไม่รู้ตัว
  - **Cross-Site Scripting (XSS):** การไม่มี CSP ทำให้เบราว์เซอร์ยอมรันสคริปต์จากภายนอกที่ไม่ได้รับอนุญาต หากมีจุดใดในแอปพลิเคชันที่มีการ Render ข้อมูลที่ผู้ใช้ป้อน

### 2.2 Missing X-Content-Type-Options
- **การวิเคราะห์:** เมื่อไม่มีการส่งค่า `nosniff` เบราว์เซอร์อาจทำการ MIME Sniffing ไฟล์แนบหรือรูปภาพที่อัปโหลด แล้วพยายามตีความไฟล์ข้อมูลข้อความเป็น executable script หรือ HTML นำไปสู่ Stored XSS

### 2.3 Missing Strict-Transport-Security (HSTS)
- **การวิเคราะห์:** ผู้ใช้ที่เข้าเว็บผ่านเครือข่าย Wi-Fi สาธารณะอาจถูกโจมตีด้วยเทคนิค SSL Strip / Man-in-the-Middle (MitM) แปลงการเชื่อมต่อจาก HTTPS เป็น HTTP ธรรมดา

---

## 3. การดำเนินการแก้ไข (Remediation Actions)

ทีมพัฒนาได้ทำการแก้ไขที่ระดับ Server Configuration ในไฟล์ `next.config.ts` โดยกำหนดฟังก์ชัน `headers()` ให้ส่งค่า Security Headers ต่อไปนี้กับทุก Response:

```typescript
const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Content-Security-Policy",
    value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https:; font-src 'self' data: https:; connect-src 'self' https:; frame-ancestors 'self';",
  },
];
```

---

## 4. ผลการสแกนซ้ำหลังการแก้ไข (After Remediation - Verification Rescan)

| Alert ID | Alert Description | สถานะเดิม | สถานะหลังแก้ไข | ผลลัพธ์ |
| :---: | :--- | :---: | :---: | :--- |
| **ZAP-10038** | Content Security Policy (CSP) | Found (Medium) | **RESOLVED** | ตรวจพบ CSP ครบถ้วน |
| **ZAP-10020** | Anti-Clickjacking (X-Frame-Options) | Found (Medium) | **RESOLVED** | ป้องกัน Frame Ancestors สำเร็จ |
| **ZAP-10021** | X-Content-Type-Options | Found (Low) | **RESOLVED** | ค่า `nosniff` ถูกส่งกลับทุก Request |
| **ZAP-10035** | Strict-Transport-Security (HSTS) | Found (Low) | **RESOLVED** | บังคับใช้งาน HTTPS ตลอดเวลา |
| **ZAP-10063** | Permissions-Policy | Found (Info) | **RESOLVED** | ปิดการเข้าถึง Camera/Microphone |

> [!NOTE]
> **สรุปผล DevSecOps Cycle:**
> `OWASP ZAP` → `ตรวจพบ Missing Headers 5 รายการ` → `วิเคราะห์ความเสี่ยง Clickjacking/MIME Sniffing` → `ปรับปรุง next.config.ts` → `Rescan ซ้ำพบ 0 Vulnerabilities ในกลุ่ม Security Headers`
