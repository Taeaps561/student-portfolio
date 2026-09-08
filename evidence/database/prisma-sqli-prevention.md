# 🛡️ มาตรการป้องกัน SQL Injection ด้วย Parameterized Queries ผ่าน Prisma ORM

**วิชา:** DevSecOps  
**หัวข้อ:** การป้องกัน SQL Injection (OWASP A03:2021-Injection / CWE-89)  

---

## 1. กลไกการเกิดช่องโหว่ SQL Injection (The Vulnerability)

SQL Injection เกิดขึ้นเมื่อแอปพลิเคชันนำข้อมูลนำเข้าจากผู้ใช้ (Untrusted User Input) ไปต่อสตริง (String Concatenation) เข้ากับคำสั่ง SQL โดยตรง:

```sql
-- ตัวอย่างโค้ดที่ไม่ปลอดภัย (Vulnerable Raw Query):
SELECT * FROM "User" WHERE email = '' OR '1'='1' --' AND password = 'xxx';
```
ผลลัพธ์ทำให้ผู้โจมตีสามารถข้ามขั้นตอนการล็อกอิน หรือดึงข้อมูลทั้งหมดในฐานข้อมูลออกมาได้

---

## 2. วิธีการป้องกันในโปรเจกต์: Parameterized Queries 100% ผ่าน Prisma ORM

ในระบบ Student Portfolio ทีมพัฒนาเลือกใช้ **Prisma ORM** ในการติดต่อสื่อสารกับฐานข้อมูลทั้งหมด โดยไม่มีการเขียน Raw SQL แบบ String Interpolation เลยแม้แต่จุดเดียว

### 2.1 โค้ดตัวอย่างการ Query ในระบบ
```typescript
// src/app/api/auth/[...nextauth]/route.ts
const user = await prisma.user.findUnique({
  where: { 
    email: credentials.email.trim().toLowerCase() 
  }
});
```

### 2.2 สิ่งที่ Prisma สร้างขึ้นส่งไปยัง Database Engine (Under the Hood)
Prisma จะแปลงคำสั่งข้างต้นให้กลายเป็น Prepared Statement พร้อม Parameterized Placeholder:

```sql
-- SQLite Engine:
SELECT "id", "name", "email", "role" FROM "User" WHERE "email" = ? LIMIT 1;
-- Parameters: ['test@example.com']

-- PostgreSQL Engine:
SELECT "id", "name", "email", "role" FROM "User" WHERE "email" = $1 LIMIT 1;
-- Parameters: ['test@example.com']
```

### 2.3 ผลลัพธ์เมื่อถูกโจมตีด้วย SQL Injection Payloads
หากผู้โจมตีป้อนค่าต่อไปนี้ในช่อง Email:
`' OR '1'='1' --` หรือ `admin' UNION SELECT 1,2,3--`

- ฐานข้อมูลจะถือว่าสตริงดังกล่าวเป็นเพียง **"ข้อความธรรมดา (Literal Value)"** ของอีเมล ไม่ใช่คำสั่ง SQL Executable
- ผลการค้นหาจะคืนค่า `null` (ไม่พบอีเมลชื่อนั้น) โดยไม่มีผลกระทบใดๆ ต่อฐานข้อมูล
- **ระดับการป้องกัน:** ป้องกัน SQL Injection ได้ 100% อย่างสมบูรณ์
