import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: portfolioId } = await params;

    const portfolio = await prisma.portfolio.findUnique({
      where: { id: portfolioId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
            role: true
          }
        },
        skills: {
          where: { isVerified: true },
          orderBy: { name: "asc" }
        },
        certificates: true
      }
    });

    if (!portfolio) {
      return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
    }

    // Cryptographic Signature generation
    // Sign the portfolio ID, Student Name, and GPAX to create a digital signature hash
    const institutionSecret = "skill-passport-institutional-secret-key-2026";
    const signaturePayload = `${portfolio.id}-${portfolio.userId}-${portfolio.gpa || "N/A"}`;
    const digitalSignature = crypto
      .createHmac("sha256", institutionSecret)
      .update(signaturePayload)
      .digest("hex");

    return NextResponse.json({
      success: true,
      portfolio: {
        id: portfolio.id,
        bio: portfolio.bio,
        isPublic: portfolio.isPublic,
        phoneNumber: portfolio.phoneNumber,
        gpa: portfolio.gpa,
        user: portfolio.user,
        skills: portfolio.skills,
        certificates: portfolio.certificates,
      },
      digitalSignature,
      verificationAuthority: "สถาบันการศึกษาเทคโนโลยีดิจิทัลแห่งชาติ (NDTI)"
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
