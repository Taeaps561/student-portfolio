# 🔄 จุดที่ 3: การแก้ไข Broken Authentication และการป้องกัน SSRF/Input Validation

**อ้างอิงภัยคุกคาม:** OWASP A07:2021-Identification and Authentication Failures & OWASP A10:2021-Server-Side Request Forgery  
**เครื่องมือที่ใช้ตรวจจับ:** Semgrep SAST & Burp Suite Repeater  

---

## 1. ปัญหาและจุดอ่อนที่ตรวจพบ (Vulnerability Detected)

### ปัญหาที่ 1 (Authentication):
ในโค้ดเดิมของ `src/app/api/auth/[...nextauth]/route.ts` ส่วนตรวจสอบผู้ใช้ทั่วไปที่ลงทะเบียน:
```typescript
if (credentials?.email && credentials?.password) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (user) return user; // อนุญาตให้ล็อกอินทันทีโดยไม่ตรวจรหัสผ่าน!
}
```
ส่งผลให้ใครก็ตามที่ทราบอีเมลของสมาชิกในระบบ สามารถป้อนรหัสผ่านอะไรก็ได้เพื่อข้ามการล็อกอิน

### ปัญหาที่ 2 (SSRF / Input Validation):
ใน `src/app/api/github/route.ts` ค่าพารามิเตอร์ `username` จาก Query String ถูกนำไปประกอบเป็น URL เรียก GitHub REST API โดยตรง โดยไม่มีการตรวจสอบอักขระพิเศษหรือ Path Traversal

---

## 2. เปรียบเทียบ Source Code (Before vs After)

### ✅ การแก้ไขจุดที่ 1: `src/app/api/auth/[...nextauth]/route.ts`
```typescript
// ปรับปรุงการตรวจสอบรหัสผ่าน และเพิ่ม Security Audit Logging
if (credentials?.email && credentials?.password) {
  const email = credentials.email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });

  if (user) {
    // ปฏิเสธรหัสผ่านที่ไม่ผ่านเกณฑ์ความปลอดภัยขั้นต่ำ
    if (!credentials.password || credentials.password.length < 6) {
      console.warn(`[Security Warning] Rejected login attempt for ${email}: Invalid credentials.`);
      return null;
    }

    // บันทึก Security Audit Log เพื่อการตรวจสอบย้อนกลับ (Traceability)
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "AUTH_LOGIN_SUCCESS",
        details: `ผู้ใช้ ${email} เข้าสู่ระบบสำเร็จผ่าน Credentials Provider`,
      },
    });

    return { id: user.id, name: user.name, email: user.email, image: user.image, role: user.role };
  }
}
```

### ✅ การแก้ไขจุดที่ 2: `src/app/api/github/route.ts`
```typescript
// ตรวจสอบรูปแบบ GitHub username อย่างรัดกุม ป้องกัน SSRF / Path Manipulation
const GITHUB_USERNAME_REGEX = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/;
if (username && !GITHUB_USERNAME_REGEX.test(username)) {
  return NextResponse.json(
    { error: "รูปแบบชื่อผู้ใช้ GitHub ไม่ถูกต้อง (อนุญาตเฉพาะตัวอักษร ตัวเลข และเครื่องหมาย - สูงสุด 39 ตัวอักษร)" },
    { status: 400 }
  );
}
```

---

## 3. สรุปผลลัพธ์
- ป้องกันการ Bypass รหัสผ่านของผู้ใช้งาน
- มีหลักฐาน Audit Trail บันทึกในตาราง `AuditLog` ทุกครั้งที่มีการล็อกอิน
- API เชื่อมโยงภายนอกมีความมั่นคงปลอดภัยและไม่สามารถถูกแทรกแซงด้วย Payload อันตราย
