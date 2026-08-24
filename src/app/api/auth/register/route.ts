import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" }, { status: 400 });
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json({ error: "อีเมลนี้มีผู้ใช้งานในระบบแล้ว" }, { status: 409 });
    }

    const assignedRole = role === "TEACHER" || role === "EMPLOYER" ? role : "STUDENT";

    // Create new user in database
    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role: assignedRole,
        image: `https://ui-avatars.com/api/?name=${encodeURIComponent(name.trim())}&background=0a66c2&color=fff`,
        portfolio: assignedRole === "STUDENT" ? {
          create: {
            bio: `สวัสดีครับ/ค่ะ ฉันคือ ${name.trim()} นักศึกษา มหาวิทยาลัยสวนดุสิต`,
            isPublic: true,
          }
        } : undefined,
      },
    });

    // Create Audit Log for DevSecOps compliance
    await prisma.auditLog.create({
      data: {
        userId: newUser.id,
        action: "REGISTER_NEW_USER",
        details: `Registered account: ${newUser.email} (Role: ${newUser.role})`,
      },
    });

    return NextResponse.json({
      success: true,
      message: "ลงทะเบียนสมาชิกสำเร็จ",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    }, { status: 201 });
  } catch (error: any) {
    console.error("Register Error:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการลงทะเบียน" }, { status: 500 });
  }
}
