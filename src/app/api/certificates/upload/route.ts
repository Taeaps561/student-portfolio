/**
 * Secure Certificate File Upload API
 * ======================================
 * DevSecOps Security Controls:
 * - OWASP A01: Access Control - ตรวจสอบ session ก่อนทุก request
 * - OWASP A03: Injection - Sanitize filename ป้องกัน Path Traversal
 * - OWASP A04: Insecure Design - จำกัดประเภทไฟล์ (PDF, JPG, PNG เท่านั้น)
 * - OWASP A05: Security Misconfiguration - จำกัดขนาดไฟล์ (5MB)
 * - Integrity: SHA-256 hash ของไฟล์เพื่อ verify ความถูกต้อง
 * - Audit: บันทึก Log ผู้อัปโหลด, IP, hash ทุกครั้ง
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import path from "path";

// --- Security Constants ---
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = new Set(["application/pdf", "image/jpeg", "image/png"]);
const ALLOWED_EXTENSIONS = new Set([".pdf", ".jpg", ".jpeg", ".png"]);

/**
 * Sanitizes a filename to prevent Path Traversal and injection attacks.
 * Strips directory separators, null bytes, and non-alphanumeric characters.
 */
function sanitizeFilename(originalName: string): string {
  // 1. ดึงเฉพาะ basename (ป้องกัน ../../etc/passwd)
  const basename = path.basename(originalName);

  // 2. ตัด null bytes และอักขระอันตราย
  const safe = basename
    .replace(/\0/g, "")                      // null bytes
    .replace(/[^a-zA-Z0-9.\-_\u0E00-\u0E7F]/g, "_") // เหลือแค่ alphanumeric + ภาษาไทย + . - _
    .substring(0, 100);                        // จำกัดความยาว

  // 3. บังคับให้มีนามสกุล
  const ext = path.extname(safe).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    throw new Error(`ประเภทไฟล์ไม่ได้รับอนุญาต: ${ext}`);
  }

  return safe;
}

/**
 * Computes SHA-256 hash of a Buffer (for integrity verification).
 */
function computeSha256(buffer: Buffer): string {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

export async function POST(req: NextRequest) {
  // --- 1. Authentication Check ---
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized: กรุณาเข้าสู่ระบบก่อนอัปโหลด" },
      { status: 401 }
    );
  }

  const userId = session.user.id as string;
  const clientIp =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  try {
    // --- 2. Parse multipart/form-data ---
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const certName = (formData.get("name") as string)?.trim();
    const certIssuer = (formData.get("issuer") as string)?.trim();
    const certIssueDate = (formData.get("issueDate") as string)?.trim();

    // --- 3. Required fields check ---
    if (!file || !certName || !certIssuer || !certIssueDate) {
      return NextResponse.json(
        { error: "ข้อมูลไม่ครบถ้วน: กรุณากรอก ชื่อใบรับรอง, ผู้ออก, วันที่ และไฟล์" },
        { status: 400 }
      );
    }

    // --- 4. File Size Validation ---
    if (file.size > MAX_FILE_SIZE_BYTES) {
      await prisma.auditLog.create({
        data: {
          userId,
          action: "CERT_UPLOAD_REJECTED_SIZE",
          details: `ไฟล์ ${file.name} มีขนาด ${(file.size / 1024 / 1024).toFixed(2)}MB เกิน 5MB`,
          ipAddress: clientIp,
        },
      });
      return NextResponse.json(
        { error: `ไฟล์มีขนาดใหญ่เกินไป (${(file.size / 1024 / 1024).toFixed(2)}MB) กรุณาใช้ไฟล์ขนาดไม่เกิน 5MB` },
        { status: 413 }
      );
    }

    // --- 5. MIME Type Validation (ตรวจสอบ Content-Type จริง ไม่ใช่แค่นามสกุล) ---
    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      await prisma.auditLog.create({
        data: {
          userId,
          action: "CERT_UPLOAD_REJECTED_TYPE",
          details: `Blocked file type: ${file.type} (file: ${file.name})`,
          ipAddress: clientIp,
        },
      });
      return NextResponse.json(
        { error: "ประเภทไฟล์ไม่ได้รับอนุญาต กรุณาอัปโหลดเฉพาะ PDF, JPG หรือ PNG เท่านั้น" },
        { status: 415 }
      );
    }

    // --- 6. Filename Sanitization ---
    let safeFilename: string;
    try {
      safeFilename = sanitizeFilename(file.name);
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }

    // --- 7. Read file bytes and compute SHA-256 hash ---
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);
    const fileHash = computeSha256(fileBuffer);

    // --- 8. Magic bytes verification (ตรวจสอบ file signature จริง ป้องกัน spoofed MIME) ---
    const magicBytes = fileBuffer.slice(0, 8);
    const isPdf = magicBytes.slice(0, 4).toString("ascii") === "%PDF";
    const isJpeg = magicBytes[0] === 0xff && magicBytes[1] === 0xd8;
    const isPng =
      magicBytes[0] === 0x89 &&
      magicBytes[1] === 0x50 &&
      magicBytes[2] === 0x4e &&
      magicBytes[3] === 0x47;

    const mimeMatchesMagic =
      (file.type === "application/pdf" && isPdf) ||
      (file.type === "image/jpeg" && isJpeg) ||
      (file.type === "image/png" && isPng);

    if (!mimeMatchesMagic) {
      await prisma.auditLog.create({
        data: {
          userId,
          action: "CERT_UPLOAD_REJECTED_MAGIC",
          details: `Magic bytes mismatch for declared MIME ${file.type} (file: ${safeFilename})`,
          ipAddress: clientIp,
        },
      });
      return NextResponse.json(
        { error: "ตรวจพบไฟล์ที่อาจเป็นอันตราย: ประเภทไฟล์จริงไม่ตรงกับนามสกุล" },
        { status: 415 }
      );
    }

    // --- 9. Ownership check: ผู้ใช้ต้องมี Portfolio ---
    let portfolio = await prisma.portfolio.findUnique({ where: { userId } });
    if (!portfolio) {
      portfolio = await prisma.portfolio.create({
        data: {
          userId,
          bio: "Portfolio ของฉัน",
          isPublic: true,
        },
      });
    }

    // --- 10. Unique hash check (ป้องกัน duplicate certificate) ---
    const existing = await prisma.certificate.findUnique({
      where: { hashValue: fileHash },
    });
    if (existing) {
      return NextResponse.json(
        { error: "ใบรับรองนี้มีอยู่ในระบบแล้ว (ตรวจพบ hash ซ้ำ)" },
        { status: 409 }
      );
    }

    // --- 11. In Production: upload to Supabase Storage / S3 ---
    // For local dev: store as base64 data URL (ไม่แนะนำสำหรับ production)
    // TODO: Replace with Supabase Storage upload when deploying to Vercel
    const base64Data = `data:${file.type};base64,${fileBuffer.toString("base64")}`;
    // In production: const fileUrl = await uploadToSupabase(fileBuffer, safeFilename, file.type);
    const fileUrl = base64Data;

    // --- 12. Save Certificate record to database ---
    const certificate = await prisma.certificate.create({
      data: {
        portfolioId: portfolio.id,
        name: certName,
        issuer: certIssuer,
        issueDate: new Date(certIssueDate),
        fileUrl,
        hashValue: fileHash,
      },
    });

    // --- 13. Audit Log: บันทึกทุก upload สำเร็จ ---
    await prisma.auditLog.create({
      data: {
        userId,
        action: "CERT_UPLOAD_SUCCESS",
        details: JSON.stringify({
          certId: certificate.id,
          certName,
          issuer: certIssuer,
          filename: safeFilename,
          fileSizeKb: Math.round(file.size / 1024),
          mimeType: file.type,
          sha256: fileHash,
        }),
        ipAddress: clientIp,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "อัปโหลดใบรับรองสำเร็จ",
        certificate: {
          id: certificate.id,
          name: certificate.name,
          issuer: certificate.issuer,
          issueDate: certificate.issueDate,
          hashValue: certificate.hashValue,
          // ไม่ส่ง fileUrl กลับโดยตรงเพื่อความปลอดภัย
        },
        security: {
          sha256: fileHash,
          sanitizedFilename: safeFilename,
          fileSizeKb: Math.round(file.size / 1024),
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[CertUpload] Unexpected error:", error);

    // Audit log สำหรับ error
    try {
      await prisma.auditLog.create({
        data: {
          userId,
          action: "CERT_UPLOAD_ERROR",
          details: error.message ?? "Unknown error",
          ipAddress: clientIp,
        },
      });
    } catch {}

    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการอัปโหลด กรุณาลองใหม่อีกครั้ง" },
      { status: 500 }
    );
  }
}
