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
    const { skillId, rubrics } = await req.json();

    if (!skillId || !rubrics) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { presentation, collaboration, logic } = rubrics;
    if (
      typeof presentation !== "number" ||
      typeof collaboration !== "number" ||
      typeof logic !== "number"
    ) {
      return NextResponse.json({ error: "Invalid rubric scores" }, { status: 400 });
    }

    // Calculate final scores
    // Each rubric is 1-5. Sum is 3-15.
    // Average score percentage = Math.round((sum / 15) * 100)
    const sum = presentation + collaboration + logic;
    const scorePercent = Math.round((sum / 15) * 100);
    const calculatedLevel = Math.round(sum / 3); // Average of 3 scores, rounded (1-5)

    const skill = await prisma.skill.findUnique({
      where: { id: skillId },
      include: {
        portfolio: {
          include: {
            user: true
          }
        }
      }
    });

    if (!skill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 444 });
    }

    const rubricJSON = JSON.stringify({ presentation, collaboration, logic });

    // Update student's skill record with evaluation results
    const updatedSkill = await prisma.skill.update({
      where: { id: skillId },
      data: {
        level: calculatedLevel,
        testScore: scorePercent,
        isVerified: true,
        status: "PASSED",
        rubricScores: rubricJSON
      }
    });

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id as string,
        action: "GRADE_SOFT_SKILL_ARTIFACT",
        details: `Graded soft skill "${skill.name}" for ${skill.portfolio.user.name} - Score: ${scorePercent}%`
      }
    });

    return NextResponse.json({
      success: true,
      message: "บันทึกคะแนนและยื่นเรื่องการประเมินทักษะสำเร็จ",
      skill: updatedSkill
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
