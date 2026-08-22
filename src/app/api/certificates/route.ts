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

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const portfolioId = await getOrCreatePortfolioId(session.user.id as string);
    const certificates = await prisma.certificate.findMany({
      where: { portfolioId },
      orderBy: { issueDate: "desc" },
    });
    return NextResponse.json({ certificates });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, issuer, issueDate, fileUrl } = await req.json();
    if (!name || !issuer || !issueDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const portfolioId = await getOrCreatePortfolioId(session.user.id as string);

    // Generate a secure cryptographic SHA-256 hash for verification signature
    const hashInput = `${name}-${issuer}-${issueDate}-${session.user.id}-${Date.now()}`;
    const hashValue = `cert_hash_${crypto.createHash("sha256").update(hashInput).digest("hex").substring(0, 32)}`;

    const newCert = await prisma.certificate.create({
      data: {
        portfolioId,
        name,
        issuer,
        issueDate: new Date(issueDate),
        fileUrl: fileUrl || "#",
        hashValue,
      },
    });

    // Write to audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id as string,
        action: "ADD_CERTIFICATE",
        details: `Added certificate: ${name} (Issuer: ${issuer})`,
      },
    });

    return NextResponse.json({ certificate: newCert });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    const portfolioId = await getOrCreatePortfolioId(session.user.id as string);
    const cert = await prisma.certificate.findUnique({
      where: { id },
    });

    if (!cert || cert.portfolioId !== portfolioId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.certificate.delete({
      where: { id },
    });

    // Write to audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id as string,
        action: "DELETE_CERTIFICATE",
        details: `Deleted certificate: ${cert.name}`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
