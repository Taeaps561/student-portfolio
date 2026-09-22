import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

/**
 * Secure Certificate File Retrieval API
 * =====================================
 * DevSecOps Access Control (OWASP A01: Broken Access Control Prevention):
 * - เฉพาะเจ้าของ Certificate (Owner) หรือ อาจารย์/ผู้ดูแลระบบ (TEACHER/ADMIN) เท่านั้นที่เข้าถึงได้
 * - ป้องกันไม่ให้ผู้ใช้อื่น (Insecure Direct Object References - IDOR) แอบเปิดหรือดาวน์โหลดไฟล์
 * - เพิ่ม Security Headers ป้องกัน MIME Sniffing และ XSS
 */
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await context.params;
  const certId = resolvedParams?.id;

  // 1. ตรวจสอบสิทธิ์การเข้าสู่ระบบ (Authentication)
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized: กรุณาเข้าสู่ระบบก่อนเข้าถึงไฟล์" },
      { status: 401 }
    );
  }

  if (!certId) {
    return NextResponse.json(
      { error: "Bad Request: รหัสใบรับรองไม่ถูกต้อง" },
      { status: 400 }
    );
  }

  try {
    // 2. ค้นหาข้อมูล Certificate และเจ้าของ Portfolio
    const cert = await prisma.certificate.findUnique({
      where: { id: certId },
      include: {
        portfolio: {
          select: {
            userId: true,
            isPublic: true,
          },
        },
      },
    });

    if (!cert) {
      return NextResponse.json(
        { error: "Not Found: ไม่พบใบรับรองนี้ในระบบ" },
        { status: 404 }
      );
    }

    const currentUserId = session.user.id;
    const currentUserRole = session.user.role || "STUDENT";
    const ownerUserId = cert.portfolio.userId;

    // 3. ตรวจสอบสิทธิ์การเข้าถึง (Authorization Check - RBAC & IDOR Prevention)
    const isOwner = currentUserId === ownerUserId;
    const isPrivileged = currentUserRole === "TEACHER" || currentUserRole === "ADMIN";

    if (!isOwner && !isPrivileged) {
      // บันทึก Security Audit Log ความพยายามเข้าถึงไฟล์โดยไม่ได้รับอนุญาต
      const clientIp =
        req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
        req.headers.get("x-real-ip") ??
        "unknown";

      await prisma.auditLog.create({
        data: {
          userId: currentUserId,
          action: "CERT_UNAUTHORIZED_ACCESS_ATTEMPT",
          details: `User ${currentUserId} (Role: ${currentUserRole}) attempted to access Certificate ${certId} owned by ${ownerUserId}`,
          ipAddress: clientIp,
        },
      });

      return NextResponse.json(
        { error: "Forbidden: คุณไม่มีสิทธิ์เข้าถึงไฟล์ Certificate นี้ (Access Denied)" },
        { status: 403 }
      );
    }

    // 4. ดึงข้อมูลไฟล์ (จาก Local Disk หรือ Base64 ใน DB)
    let fileBuffer: Buffer | null = null;
    let contentType = "application/pdf";

    // กรณีเป็น Base64 Data URL ที่เก็บใน DB
    if (cert.fileUrl && cert.fileUrl.startsWith("data:")) {
      const matches = cert.fileUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        contentType = matches[1];
        fileBuffer = Buffer.from(matches[2], "base64");
      }
    }

    // กรณีอ่านจาก Local Uploads Directory
    if (!fileBuffer) {
      const uploadDir = path.join(process.cwd(), "uploads", "certificates");
      // ค้นหาไฟล์ที่ขึ้นต้นด้วย certId หรือเช็คไฟล์
      if (fs.existsSync(uploadDir)) {
        const files = fs.readdirSync(uploadDir);
        const matched = files.find((f) => f.includes(certId));
        if (matched) {
          const filePath = path.join(uploadDir, matched);
          // ตรวจสอบ Path Traversal ป้องกันการหลุดออกนอก uploadDir
          const normalizedPath = path.normalize(filePath);
          if (normalizedPath.startsWith(uploadDir)) {
            fileBuffer = fs.readFileSync(normalizedPath);
            const ext = path.extname(matched).toLowerCase();
            if (ext === ".png") contentType = "image/png";
            else if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
            else contentType = "application/pdf";
          }
        }
      }
    }

    if (!fileBuffer) {
      return NextResponse.json(
        { error: "Not Found: ไม่พบไฟล์ต้นฉบับในเซิร์ฟเวอร์" },
        { status: 404 }
      );
    }

    // 5. ส่งไฟล์กลับพร้อม Security Headers
    return new NextResponse(new Uint8Array(fileBuffer), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="certificate_${cert.id}${contentType === "image/png" ? ".png" : contentType === "image/jpeg" ? ".jpg" : ".pdf"}"`,
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
        "Content-Security-Policy": "default-src 'none'; sandbox",
      },
    });
  } catch (error: any) {
    console.error("[CertFileAPI] Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
