# 🔄 จุดที่ 2: การแก้ไข Broken Access Control และการทำ PDPA Data Masking

**อ้างอิงภัยคุกคาม:** OWASP A01:2021-Broken Access Control & พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA)  
**เครื่องมือที่ใช้ตรวจจับ:** Burp Suite Repeater / API Manual Testing  

---

## 1. ปัญหาและจุดอ่อนที่ตรวจพบ (Vulnerability Detected)
1. **Unrestricted Portfolio Query:** เมื่อบุคคลภายนอกเรียก `GET /api/portfolio` ระบบส่งข้อมูลแฟ้มสะสมงานส่วนบุคคลทั้งหมดออกมา รวมถึงโปรไฟล์ที่ผู้ใช้ตั้งค่าไว้เป็นส่วนตัว (`isPublic: false`)
2. **Plaintext Sensitive Exposure:** ข้อมูลเบอร์โทรศัพท์ (`phoneNumber`) และเกรดเฉลี่ยสะสม (`gpa`) ถูกส่งออกมาใน JSON Response เป็นข้อความธรรมดาโดยไม่มีการ Masking
3. **Missing Authentication on Employer Matching:** เมธอด `POST /api/employer/matching` สามารถถูกเรียกได้โดยตรงจากผู้ใช้ที่ไม่ได้ล็อกอิน ทำให้บุคคลภายนอกดึงรายชื่อและผลการประเมินทักษะของนักศึกษาทั้งหมดได้

---

## 2. เปรียบเทียบ Source Code (Before vs After)

### ❌ ก่อนแก้ไข (BEFORE): `src/app/api/portfolio/route.ts`
```typescript
export async function GET(request: Request) {
  // ไม่มีการเช็ค session และส่งฟิลด์ข้อมูลทั้งหมดโดยตรง
  const whereClause: any = {};
  if (searchParams.get("publicOnly") === "true") {
    whereClause.isPublic = true;
  }
  const portfolios = await prisma.portfolio.findMany({ where: whereClause, ... });
  return Response.json({ success: true, portfolios });
}
```

### ✅ หลังแก้ไข (AFTER): `src/app/api/portfolio/route.ts`
```typescript
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  const isPrivileged = session?.user?.role === "TEACHER" || session?.user?.role === "EMPLOYER";

  // บังคับกรองเฉพาะแฟ้มผลงานสาธารณะเสมอ หากไม่มีสิทธิ์ระดับสูง
  const whereClause: any = {};
  if (!session || !isPrivileged || publicOnly === "true") {
    whereClause.isPublic = true;
  }

  const portfolios = await prisma.portfolio.findMany({ where: whereClause, ... });

  // ดำเนินการทำ PDPA Data Masking ข้อมูลส่วนตัว
  const sanitizedPortfolios = portfolios.map((portfolio) => {
    const isOwner = session?.user?.id === portfolio.userId;
    const canViewSensitive = isOwner || isPrivileged;

    return {
      ...portfolio,
      phoneNumber: canViewSensitive
        ? portfolio.phoneNumber
        : portfolio.phoneNumber
        ? portfolio.phoneNumber.replace(/^(\d{3})\d{3}(\d{4})$/, "$1-XXX-$2")
        : null,
      gpa: canViewSensitive ? portfolio.gpa : null,
    };
  });

  return Response.json({ success: true, portfolios: sanitizedPortfolios });
}
```

---

## 3. เปรียบเทียบผลลัพธ์ HTTP Response (Before vs After)

### ❌ ผลลัพธ์ก่อนแก้ไข (BEFORE):
```json
{
  "success": true,
  "portfolios": [
    {
      "id": "port_01",
      "userId": "u1",
      "isPublic": false,
      "phoneNumber": "0812345678",
      "gpa": 3.85
    }
  ]
}
```

### ✅ ผลลัพธ์หลังแก้ไข (AFTER):
```json
{
  "success": true,
  "portfolios": [
    {
      "id": "port_02",
      "userId": "u2",
      "isPublic": true,
      "phoneNumber": "081-XXX-5678",
      "gpa": null
    }
  ]
}
```

---

## 4. การแก้ไข API ผู้ประกอบการ (`src/app/api/employer/matching/route.ts`)
เพิ่มการตรวจสอบสิทธิ์ Server-side RBAC:
```typescript
const session = await getServerSession(authOptions);
if (!session || !session.user) {
  return NextResponse.json({ error: "Unauthorized: กรุณาเข้าสู่ระบบก่อนใช้งาน" }, { status: 401 });
}
if (session.user.role !== "EMPLOYER" && session.user.role !== "TEACHER") {
  return NextResponse.json({ error: "Forbidden: สิทธิ์สงวนเฉพาะสถานประกอบการหรืออาจารย์" }, { status: 403 });
}
```

---

## 5. สรุปผลลัพธ์
- ป้องกันการเข้าถึงข้อมูลโปรไฟล์ส่วนตัวได้อย่างสมบูรณ์
- เป็นไปตามข้อกำหนด **PDPA (Thailand Personal Data Protection Act)** และ **OWASP A01:2021**
- บัญชีทั่วไปหรือผู้ใช้ภายนอกไม่สามารถขโมยข้อมูลเกรดหรือเบอร์โทรศัพท์ของนักศึกษาได้
