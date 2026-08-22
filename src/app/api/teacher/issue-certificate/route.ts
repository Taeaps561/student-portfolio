import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

async function getOrCreatePortfolioId(userId: string) {
  let portfolio = await prisma.portfolio.findUnique({
    where: { userId },
  });
  if (!portfolio) {
    portfolio = await prisma.portfolio.create({
      data: {
        userId,
        bio: "สวัสดี! ฉันเป็นนักศึกษาที่หลงใหลในการเขียนโค้ดและสร้างสรรค์นวัตกรรมใหม่ๆ",
        isPublic: true,
      },
    });
  }
  return portfolio.id;
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== "TEACHER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { enrollmentId } = await req.json();
    if (!enrollmentId) {
      return NextResponse.json({ error: "Missing enrollmentId" }, { status: 400 });
    }

    // Find enrollment
    const enrollment = await prisma.enrollment.findUnique({
      where: { id: enrollmentId },
      include: {
        course: true,
        student: true,
      }
    });

    if (!enrollment) {
      return NextResponse.json({ error: "ไม่พบข้อมูลการลงทะเบียนเรียน" }, { status: 404 });
    }

    // Verify course belongs to this teacher
    if (enrollment.course.teacherId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (enrollment.isCompleted) {
      return NextResponse.json({ error: "นักศึกษารายนี้ได้รับใบรับรองไปแล้ว" }, { status: 400 });
    }

    const studentPortfolioId = await getOrCreatePortfolioId(enrollment.studentId);

    // Generate cryptographic hash signature
    const hashInput = `${enrollment.course.name}-${enrollment.course.code}-${enrollment.studentId}-${Date.now()}`;
    const hashValue = `cert_hash_${crypto.createHash("sha256").update(hashInput).digest("hex").substring(0, 32)}`;

    // Create Certificate
    const certificate = await prisma.certificate.create({
      data: {
        portfolioId: studentPortfolioId,
        name: `ใบประกาศนียบัตร: หลักสูตร ${enrollment.course.name}`,
        issuer: `${session.user.name} (${enrollment.course.code})`,
        issueDate: new Date(),
        fileUrl: "#",
        hashValue,
      }
    });

    // Update Enrollment
    await prisma.enrollment.update({
      where: { id: enrollmentId },
      data: {
        isCompleted: true,
        issuedCertId: certificate.id,
      }
    });

    // Audit Log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id as string,
        action: "ISSUE_COURSE_CERTIFICATE",
        details: `Issued course certificate for ${enrollment.course.name} to student ${enrollment.student.name}`,
      },
    });

    return NextResponse.json({ success: true, certificate });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
