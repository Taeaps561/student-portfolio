import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== "TEACHER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { skillId, isVerified } = await req.json();
    if (!skillId) {
      return NextResponse.json({ error: "Missing skillId" }, { status: 400 });
    }

    const updatedSkill = await prisma.skill.update({
      where: { id: skillId },
      data: {
        isVerified: isVerified ?? true,
      },
      include: {
        portfolio: {
          include: {
            user: true,
          }
        }
      }
    });

    // Audit Log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id as string,
        action: "VERIFY_STUDENT_SKILL",
        details: `Verified skill "${updatedSkill.name}" (level ${updatedSkill.level}) for student ${updatedSkill.portfolio.user.name}`,
      },
    });

    if (updatedSkill.isVerified) {
      try {
        const { addBlock } = require("@/lib/blockchain");
        addBlock(
          updatedSkill.portfolio.user.name || "นักศึกษา",
          "TEACHER_VERIFIED",
          `ทักษะ ${updatedSkill.name} (ระดับ ${updatedSkill.level}) ได้รับการยืนยันผลประเมินโดยอาจารย์ ${session.user.name}`
        );
      } catch (bcErr) {
        console.error("Failed to write blockchain ledger:", bcErr);
      }
    }

    return NextResponse.json({ success: true, skill: updatedSkill });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
