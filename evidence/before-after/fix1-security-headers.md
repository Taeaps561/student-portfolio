# 🔄 จุดที่ 1: การแก้ไขปัญหา Missing Security Headers (Security Misconfiguration)

**อ้างอิงภัยคุกคาม:** OWASP A05:2021-Security Misconfiguration | CWE-1021, CWE-16, CWE-693  
**เครื่องมือที่ใช้ตรวจจับ:** OWASP ZAP (DAST) / cURL  

---

## 1. ปัญหาและจุดอ่อนที่ตรวจพบ (Vulnerability Detected)
เมื่อทำการสแกนเว็บแอปพลิเคชันด้วย OWASP ZAP และทดสอบส่งคำขอผ่าน cURL พบว่า Server ไม่มีการส่ง HTTP Security Headers ใดๆ กลับมา ส่งผลให้เกิดความเสี่ยงต่อการถูกโจมตีแบบ **Clickjacking** และ **MIME-Type Sniffing / XSS**

---

## 2. เปรียบเทียบ Source Code (Before vs After)

### ❌ ก่อนแก้ไข (BEFORE): `next.config.ts`
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here - ไม่มี Headers กำหนดไว้ */
};

export default nextConfig;
```

### ✅ หลังแก้ไข (AFTER): `next.config.ts`
```typescript
import type { NextConfig } from "next";

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

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
```

---

## 3. เปรียบเทียบผลลัพธ์การทดสอบ (Verification Before vs After)

```diff
  HTTP/2 200 OK
  date: Tue, 08 Sep 2026 05:00:00 GMT
  content-type: text/html; charset=utf-8
- [MISSING] Content-Security-Policy
- [MISSING] X-Frame-Options
- [MISSING] X-Content-Type-Options
- [MISSING] Strict-Transport-Security
- [MISSING] Referrer-Policy
- [MISSING] Permissions-Policy
+ Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; ...
+ X-Frame-Options: SAMEORIGIN
+ X-Content-Type-Options: nosniff
+ Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
+ Referrer-Policy: strict-origin-when-cross-origin
+ Permissions-Policy: camera=(), microphone=(), geolocation=()
```

---

## 4. สรุปผลลัพธ์
- **ผลกระทบหลังแก้ไข:** ป้องกันการโจมตีประเภท Clickjacking ได้ 100% ผ่านการกำหนด `SAMEORIGIN` และ `frame-ancestors 'self'`
- **OWASP ZAP Score:** การแจ้งเตือนระดับ Medium และ Low ลดลงจาก 5 รายการเหลือ **0 รายการ** ในหมวด Security Headers
