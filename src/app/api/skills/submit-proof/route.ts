import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { skillId, proofUrl, proofDesc } = await req.json();

    if (!skillId || !proofUrl || !proofDesc) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify ownership of the skill portfolio
    const skill = await prisma.skill.findUnique({
      where: { id: skillId },
      include: {
        portfolio: true
      }
    });

    if (!skill || skill.portfolio.userId !== session.user.id) {
      return NextResponse.json({ error: "Skill not found or unauthorized" }, { status: 403 });
    }

    // Update skill with proof details and change status
    const updatedSkill = await prisma.skill.update({
      where: { id: skillId },
      data: {
        proofUrl,
        proofDesc,
        status: "PENDING_TEACHER_REVIEW"
      }
    });

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id as string,
        action: "SUBMIT_SOFT_SKILL_PROOF",
        details: `Submitted artifact proof for soft skill "${skill.name}"`
      }
    });

    return NextResponse.json({
      success: true,
      message: "ส่งหลักฐานผลสัมฤทธิ์แล้ว รออาจารย์ตรวจประเมิน",
      skill: updatedSkill
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
