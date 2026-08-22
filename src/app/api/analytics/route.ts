import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    // 1. Fetch total students and overall portfolio averages
    const studentCount = await prisma.user.count({
      where: { role: "STUDENT" }
    });

    const portfolios = await prisma.portfolio.findMany({
      where: {
        user: { role: "STUDENT" }
      },
      select: { gpa: true }
    });

    const validGPAs = portfolios.map(p => p.gpa).filter((gpa): gpa is number => gpa !== null && gpa !== undefined);
    const averageGPAX = validGPAs.length > 0 
      ? Number((validGPAs.reduce((sum, val) => sum + val, 0) / validGPAs.length).toFixed(2))
      : 3.00;

    // 2. Fetch all verified skills to compute metrics
    const skills = await prisma.skill.findMany();

    const skillGroupNames = ["React", "Next.js", "Node.js", "SQL", "Problem Solving", "Communication", "Teamwork"];
    
    const skillMetrics = skillGroupNames.map(name => {
      const skillInstances = skills.filter(s => s.name.toLowerCase() === name.toLowerCase());
      const registeredCount = skillInstances.length;
      
      const verifiedInstances = skillInstances.filter(s => s.isVerified);
      const verifiedCount = verifiedInstances.length;

      const scores = verifiedInstances.map(s => s.testScore).filter((s): s is number => s !== null && s !== undefined);
      const avgScore = scores.length > 0 
        ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
        : 75; // Mock fallback if no scores yet

      const advancedCount = verifiedInstances.filter(s => s.level >= 4).length;
      const advancedPercent = verifiedCount > 0 
        ? Math.round((advancedCount / verifiedCount) * 100) 
        : 0;

      // Determine Curriculum action
      let status = "Good";
      let suggestion = "";
      if (avgScore < 70) {
        status = "Urgent";
        suggestion = `พบปัญหานักศึกษาสอบไม่ผ่านบ่อยที่สุด ควรเพิ่มภาคปฏิบัติ Lab (เช่น Coding Practice/Case Studies) ในสัปดาห์ที่ 6-9 ของหลักสูตรหลัก`;
      } else if (avgScore < 80) {
        status = "Warning";
        suggestion = `ระดับคะแนนปานกลาง แนะนำให้ปรับเพิ่มชั่วโมงปรึกษาพิเศษ (Office Hours) หรือเพิ่มคำถามจำลองทบทวนก่อนสอบวัดสมรรถนะ`;
      } else {
        status = "Good";
        suggestion = `การจัดกิจกรรมการเรียนรู้มีผลสัมฤทธิ์ดีเยี่ยม รักษามาตรฐานและอัปเดตเวอร์ชันเทคโนโลยีในสไลด์ให้สอดคล้องกับอุตสาหกรรม`;
      }

      return {
        name,
        registeredCount,
        verifiedCount,
        avgScore,
        advancedPercent,
        status,
        suggestion
      };
    }).sort((a, b) => a.avgScore - b.avgScore); // Show lowest scores first for Gaps Identification

    return NextResponse.json({
      success: true,
      studentCount,
      averageGPAX,
      skillMetrics
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
