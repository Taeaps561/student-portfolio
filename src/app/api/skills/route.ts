import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// Helper to get portfolio ID for the current user
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
    const skills = await prisma.skill.findMany({
      where: { portfolioId },
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ skills });
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
    const { name, category, level } = await req.json();
    if (!name || !category || !level) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const portfolioId = await getOrCreatePortfolioId(session.user.id as string);
    
    const newSkill = await prisma.skill.create({
      data: {
        portfolioId,
        name,
        category,
        level: parseInt(level),
        isVerified: false, // Default unverified until approved
      },
    });

    // Write to audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id as string,
        action: "ADD_SKILL",
        details: `Added skill: ${name} (Level ${level})`,
      },
    });

    return NextResponse.json({ skill: newSkill });
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

    // Verify ownership before deleting
    const portfolioId = await getOrCreatePortfolioId(session.user.id as string);
    const skill = await prisma.skill.findUnique({
      where: { id },
    });

    if (!skill || skill.portfolioId !== portfolioId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.skill.delete({
      where: { id },
    });

    // Write to audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id as string,
        action: "DELETE_SKILL",
        details: `Deleted skill: ${skill.name}`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
