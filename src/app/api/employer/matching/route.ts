import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const SKILL_KEYWORDS: { name: string; patterns: string[] }[] = [
  { name: "React", patterns: ["react", "frontend", "ui", "ux", "js", "ts", "javascript", "typescript"] },
  { name: "Next.js", patterns: ["next", "next.js", "nextjs", "ssr", "ssg", "frontend"] },
  { name: "Node.js", patterns: ["node", "node.js", "nodejs", "backend", "express", "server", "api"] },
  { name: "SQL", patterns: ["sql", "database", "mysql", "postgres", "sqlite", "query", "db", "prisma"] },
  { name: "Problem Solving", patterns: ["problem", "solve", "solving", "analytical", "logic", "แก้ปัญหา", "คิดวิเคราะห์"] },
  { name: "Communication", patterns: ["communication", "communicate", "talk", "speak", "presentation", "สื่อสาร", "นำเสนอ"] },
  { name: "Teamwork", patterns: ["team", "teamwork", "collaborate", "group", "cooperate", "ร่วมมือ", "ทำงานร่วมกัน"] }
];

export async function POST(req: NextRequest) {
  try {
    const { jobDescription, selectedSkill, minLevel, minScore } = await req.json();

    // 1. Keyword extraction from Job Description
    const requiredSkills: string[] = [];
    if (jobDescription && jobDescription.trim().length > 0) {
      const text = jobDescription.toLowerCase();
      SKILL_KEYWORDS.forEach(sk => {
        const matches = sk.patterns.some(pattern => text.includes(pattern));
        if (matches) {
          requiredSkills.push(sk.name);
        }
      });
    }

    // If a specific skill filter is requested, ensure it's in the required list
    if (selectedSkill && !requiredSkills.includes(selectedSkill)) {
      requiredSkills.push(selectedSkill);
    }

    // 2. Fetch all student portfolios with verified skills
    const students = await prisma.user.findMany({
      where: {
        role: "STUDENT"
      },
      include: {
        portfolio: {
          include: {
            skills: {
              where: { isVerified: true }
            },
            projects: true
          }
        }
      }
    });

    const results = students
      .filter(student => student.portfolio) // Must have portfolio
      .map(student => {
        const portfolio = student.portfolio!;
        const skills = portfolio.skills || [];

        let matchScore = 0;
        const skillGaps: string[] = [];
        const matchedSkillsDetail: any[] = [];

        // If specific criteria are defined
        let meetsFilters = true;
        if (selectedSkill) {
          const studentSkill = skills.find(s => s.name.toLowerCase() === selectedSkill.toLowerCase());
          if (!studentSkill) {
            meetsFilters = false;
          } else {
            if (minLevel && studentSkill.level < minLevel) meetsFilters = false;
            if (minScore && (studentSkill.testScore || 0) < minScore) meetsFilters = false;
          }
        }

        if (requiredSkills.length > 0) {
          let totalScore = 0;
          requiredSkills.forEach(reqName => {
            const hasSkill = skills.find(s => s.name.toLowerCase() === reqName.toLowerCase());
            
            if (hasSkill) {
              const skillLevelScore = (hasSkill.level / 5) * 100;
              const skillTestScore = hasSkill.testScore || 0;
              const averageSkillScore = (skillLevelScore + skillTestScore) / 2;
              
              totalScore += averageSkillScore;
              matchedSkillsDetail.push({
                name: reqName,
                level: hasSkill.level,
                score: hasSkill.testScore,
                status: "Strong"
              });

              if (hasSkill.level < 3) {
                skillGaps.push(`ระดับทักษะ ${reqName} ยังต่ำกว่ามาตรฐานสำหรับงานนี้ (ระดับปัจจุบัน: ${hasSkill.level}, ต้องการ: 3)`);
              }
            } else {
              skillGaps.push(`ต้องการทักษะ ${reqName} แต่แฟ้มสะสมงานนี้ยังไม่ได้รับการประเมิน/รับรอง`);
            }
          });

          matchScore = Math.round(totalScore / requiredSkills.length);
        } else {
          // Default match score if no JD provided
          if (skills.length > 0) {
            const total = skills.reduce((sum, s) => sum + ((s.level / 5) * 100 + (s.testScore || 0)) / 2, 0);
            matchScore = Math.round(total / skills.length);
          } else {
            matchScore = 0;
          }
        }

        return {
          id: student.id,
          name: student.name,
          email: student.email,
          image: student.image,
          bio: portfolio.bio,
          gpa: portfolio.gpa,
          isPublic: portfolio.isPublic,
          skills: skills,
          projectsCount: portfolio.projects?.length || 0,
          matchScore,
          skillGaps,
          matchedSkillsDetail,
          meetsFilters
        };
      })
      .filter(item => item.meetsFilters) // Filter by explicit selections
      .sort((a, b) => b.matchScore - a.matchScore); // Rank by Match Score

    return NextResponse.json({
      success: true,
      requiredSkills,
      candidates: results
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
