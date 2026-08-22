import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const hash = searchParams.get("hash");

  if (!hash) {
    return NextResponse.json({ error: "Missing hash parameter" }, { status: 400 });
  }

  try {
    const certificate = await prisma.certificate.findUnique({
      where: { hashValue: hash },
      include: {
        portfolio: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!certificate) {
      return NextResponse.json({ 
        verified: false, 
        error: "ไม่พบใบรับรองในระบบ Skill Passport ของเรา หรือรหัส Hash ไม่ถูกต้อง" 
      }, { status: 404 });
    }

    return NextResponse.json({
      verified: true,
      certificate: {
        id: certificate.id,
        name: certificate.name,
        issuer: certificate.issuer,
        issueDate: certificate.issueDate,
        studentName: certificate.portfolio.user.name,
        studentEmail: certificate.portfolio.user.email,
        hashValue: certificate.hashValue,
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
