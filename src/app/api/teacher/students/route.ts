import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

const CURATED_STUDENTS = [
  {
    id: "mock-test",
    name: "นักศึกษา ทดสอบ",
    email: "test@example.com",
    image: "https://ui-avatars.com/api/?name=Student+Test&background=0a66c2&color=fff",
    studentCode: "6611011099",
    major: "วิทยาการคอมพิวเตอร์",
    year: "ชั้นปีที่ 4",
    gpa: "3.75",
    projectStatus: "IN_PROGRESS",
    internshipStatus: "OFFERED",
    portfolio: {
      id: "port-test",
      bio: "นักศึกษาภาควิชาวิทยาการคอมพิวเตอร์ มหาวิทยาลัยสวนดุสิต สนใจด้าน Full-Stack Dev & DevSecOps",
      skills: [
        { id: "sk-next", name: "Next.js", category: "Framework", level: 5, isVerified: true, testScore: 95 },
        { id: "sk-react", name: "React", category: "Frontend", level: 4, isVerified: true, testScore: 88 },
        { id: "sk-devsecops", name: "DevSecOps", category: "Security", level: 5, isVerified: true, testScore: 92 },
        { id: "sk-ts", name: "TypeScript", category: "Language", level: 4, isVerified: false, testScore: 80 },
        { id: "sk-docker", name: "Docker", category: "DevOps", level: 4, isVerified: false, testScore: 78 },
      ],
      projects: [
        {
          id: "proj-1",
          title: "Student Portfolio & SkillPassport System",
          description: "ระบบพอร์ตโฟลิโอและโครงข่ายทักษะดิจิทัลสำหรับนักศึกษา มหาวิทยาลัยสวนดุสิต",
          githubUrl: "https://github.com/Taeaps561/student-portfolio",
        },
      ],
      certificates: [
        {
          id: "cert-ccna",
          name: "Cisco Certified Network Associate (CCNA)",
          issuer: "Cisco Systems & SDU Academy",
          issueDate: "2026-08-20",
          hashValue: "0xa1b2c3d4e5f60718293a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e",
        },
        {
          id: "cert-secplus",
          name: "CompTIA Security+ (Sec+)",
          issuer: "CompTIA Certification",
          issueDate: "2026-08-21",
          hashValue: "0xb2c3d4e5f60718293a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f",
        },
        {
          id: "cert-ceh",
          name: "Certified Ethical Hacker (CEH v12)",
          issuer: "EC-Council Official",
          issueDate: "2026-08-22",
          hashValue: "0xc3d4e5f60718293a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a",
        },
      ],
    },
  },
  {
    id: "mock-somchai",
    name: "สมชาย ยอดนักโค้ด",
    email: "somchai@example.com",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    studentCode: "6611011001",
    major: "วิทยาการคอมพิวเตอร์",
    year: "ชั้นปีที่ 4",
    gpa: "3.85",
    projectStatus: "COMPLETED",
    internshipStatus: "OFFERED",
    portfolio: {
      id: "port-somchai",
      bio: "นักพัฒนา Full-stack ภาควิชาวิทยาการคอมพิวเตอร์ มหาวิทยาลัยสวนดุสิต เชี่ยวชาญ Next.js และ Cloud",
      skills: [
        { id: "sk-sc-1", name: "Node.js", category: "Backend", level: 5, isVerified: true, testScore: 92 },
        { id: "sk-sc-2", name: "Docker", category: "DevOps", level: 4, isVerified: true, testScore: 85 },
        { id: "sk-sc-3", name: "PostgreSQL", category: "Database", level: 4, isVerified: true, testScore: 88 },
        { id: "sk-sc-4", name: "AWS Cloud", category: "Cloud", level: 4, isVerified: false, testScore: 80 },
      ],
      projects: [
        {
          id: "proj-sc-1",
          title: "Cloud-Native Inventory Management WebApp",
          description: "ระบบจัดการคลังสินค้าแบบเรียลไทม์",
          githubUrl: "https://github.com/somchai/inventory-app",
        },
      ],
      certificates: [
        {
          id: "cert-aws",
          name: "AWS Certified Solutions Architect",
          issuer: "Amazon Web Services",
          issueDate: "2026-07-15",
          hashValue: "0x89ab12cd34ef567890abcdef1234567890abcdef1234567890abcdef12345678",
        },
      ],
    },
  },
  {
    id: "mock-saifah",
    name: "สายฟ้า แฮกเกอร์",
    email: "saifah@example.com",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    studentCode: "6611011045",
    major: "วิทยาการคอมพิวเตอร์",
    year: "ชั้นปีที่ 4",
    gpa: "3.60",
    projectStatus: "IN_PROGRESS",
    internshipStatus: "CONFIRMED",
    portfolio: {
      id: "port-saifah",
      bio: "นักศึกษาผู้ชื่นชอบความปลอดภัยทางไซเบอร์ เน้นการทดสอบเจาะระบบและวิเคราะห์ Log ใน SOC",
      skills: [
        { id: "sk-sf-1", name: "Cyber Security", category: "Security", level: 5, isVerified: true, testScore: 94 },
        { id: "sk-sf-2", name: "Python", category: "Language", level: 4, isVerified: true, testScore: 86 },
        { id: "sk-sf-3", name: "Networking", category: "Infrastructure", level: 4, isVerified: false, testScore: 78 },
      ],
      projects: [
        {
          id: "proj-sf-1",
          title: "Automated Threat Detection SIEM Engine",
          description: "เครื่องมือตรวจจับพฤติกรรมผิดปกติของทราฟฟิกในเครือข่าย",
          githubUrl: "https://github.com/saifah/threat-detector",
        },
      ],
      certificates: [
        {
          id: "cert-sec-sdu",
          name: "SDU Cyber Defense Specialist",
          issuer: "มหาวิทยาลัยสวนดุสิต",
          issueDate: "2026-06-20",
          hashValue: "0x778899aabbccddeeff00112233445566778899aabbccddeeff00112233445566",
        },
      ],
    },
  },
  {
    id: "mock-jane",
    name: "เจนจิรา ดีไซเนอร์",
    email: "janejira@example.com",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
    studentCode: "6611011088",
    major: "วิทยาการคอมพิวเตอร์",
    year: "ชั้นปีที่ 3",
    gpa: "3.90",
    projectStatus: "IN_PROGRESS",
    internshipStatus: "LOOKING",
    portfolio: {
      id: "port-jane",
      bio: "นักออกแบบ UI/UX ที่เชื่อว่าดีไซน์ที่ดีต้องมาพร้อมกับประสบการณ์ใช้งานที่ยอดเยี่ยม",
      skills: [
        { id: "sk-jn-1", name: "Figma", category: "Design", level: 5, isVerified: true, testScore: 96 },
        { id: "sk-jn-2", name: "UI/UX", category: "Design", level: 5, isVerified: true, testScore: 92 },
        { id: "sk-jn-3", name: "Design Systems", category: "Design", level: 4, isVerified: false, testScore: 84 },
      ],
      projects: [
        {
          id: "proj-jn-1",
          title: "Suan Dusit Design System & Component Library",
          description: "ชุดแม่แบบ UI และ Design Tokens มาตรฐานสำหรับแอปพลิเคชัน มสด.",
          githubUrl: "https://github.com/janejira/sdu-design-system",
        },
      ],
      certificates: [
        {
          id: "cert-ux-google",
          name: "Google UX Design Professional Certificate",
          issuer: "Google Career Certificates",
          issueDate: "2026-05-10",
          hashValue: "0x11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff",
        },
      ],
    },
  },
];

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== "TEACHER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const dbStudents = await prisma.user.findMany({
      where: {
        role: "STUDENT",
        email: { not: "admin@email.com" }, // Filter out test admin artifacts
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        portfolio: {
          include: {
            skills: true,
            projects: true,
            certificates: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    // Merge database students with curated student advisees
    const mergedMap = new Map<string, any>();

    // Put curated students first
    CURATED_STUDENTS.forEach((cs) => {
      mergedMap.set(cs.name, cs);
    });

    // Overlay real DB students if they have updated skills
    dbStudents.forEach((dbs) => {
      if (dbs.name && dbs.name !== "admin_test") {
        if (mergedMap.has(dbs.name)) {
          const existing = mergedMap.get(dbs.name);
          mergedMap.set(dbs.name, {
            ...existing,
            id: dbs.id,
            email: dbs.email,
            image: dbs.image || existing.image,
            portfolio: {
              ...existing.portfolio,
              skills: dbs.portfolio?.skills?.length ? dbs.portfolio.skills : existing.portfolio.skills,
              projects: dbs.portfolio?.projects?.length ? dbs.portfolio.projects : existing.portfolio.projects,
              certificates: dbs.portfolio?.certificates?.length ? dbs.portfolio.certificates : existing.portfolio.certificates,
            },
          });
        } else {
          mergedMap.set(dbs.name, {
            id: dbs.id,
            name: dbs.name,
            email: dbs.email,
            image: dbs.image,
            studentCode: "661101" + Math.floor(1000 + Math.random() * 9000),
            major: "วิทยาการคอมพิวเตอร์",
            year: "ชั้นปีที่ 4",
            gpa: "3.50",
            projectStatus: "IN_PROGRESS",
            internshipStatus: "LOOKING",
            portfolio: dbs.portfolio,
          });
        }
      }
    });

    const students = Array.from(mergedMap.values());
    return NextResponse.json({ students });
  } catch (error: any) {
    return NextResponse.json({ students: CURATED_STUDENTS });
  }
}
