import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== "TEACHER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const courses = await prisma.course.findMany({
      where: { teacherId: session.user.id as string },
      include: {
        enrollments: {
          include: {
            student: {
              select: { name: true, email: true }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ courses });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== "TEACHER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, code, description } = await req.json();
    if (!name || !code || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if course code is unique
    const existing = await prisma.course.findUnique({
      where: { code: code.trim().toUpperCase() },
    });
    if (existing) {
      return NextResponse.json({ error: "รหัสวิชา/คอร์สนี้มีอยู่ในระบบแล้ว" }, { status: 400 });
    }

    const newCourse = await prisma.course.create({
      data: {
        name: name.trim(),
        code: code.trim().toUpperCase(),
        description: description.trim(),
        teacherId: session.user.id as string,
      },
    });

    // Audit Log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id as string,
        action: "CREATE_COURSE",
        details: `Created course: ${newCourse.name} (${newCourse.code})`,
      },
    });

    return NextResponse.json({ course: newCourse });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
