import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role } = await req.json();

    // --- Input Validation ---
    if (!name || !email || !password) {
      return NextResponse.json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json({ error: "รูปแบบอีเมลไม่ถูกต้อง" }, { status: 400 });
    }

    // --- Check Duplicate Email ---
    const existingUser = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json({ error: "อีเมลนี้มีผู้ใช้งานในระบบแล้ว" }, { status: 409 });
    }

    // --- Hash Password (OWASP A02: Cryptographic Failures Prevention) ---
    const hashedPassword = await bcrypt.hash(password, 12);

    const assignedRole = role === "TEACHER" || role === "EMPLOYER" ? role : "STUDENT";

    // --- Create User ---
    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: hashedPassword,
        role: assignedRole,
        image: `https://ui-avatars.com/api/?name=${encodeURIComponent(name.trim())}&background=0a66c2&color=fff`,
        portfolio: assignedRole === "STUDENT"
          ? {
              create: {
                bio: `สวัสดีครับ/ค่ะ ฉันคือ ${name.trim()} นักศึกษา มหาวิทยาลัยสวนดุสิต`,
                isPublic: true,
              },
            }
          : undefined,
      },
    });

    // --- Audit Log ---
    await prisma.auditLog.create({
      data: {
        userId: newUser.id,
        action: "REGISTER_NEW_USER",
        details: `Registered: ${newUser.email} (Role: ${newUser.role})`,
        ipAddress: req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "unknown",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "ลงทะเบียนสมาชิกสำเร็จ",
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Register Error:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการลงทะเบียน" }, { status: 500 });
  }
}
