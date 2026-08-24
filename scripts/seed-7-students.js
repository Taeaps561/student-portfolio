const { PrismaClient } = require("@prisma/client");
const crypto = require("crypto");

const prisma = new PrismaClient();

const STUDENTS = [
  {
    name: "นักศึกษา ทดสอบ",
    email: "test@example.com",
    image: "https://ui-avatars.com/api/?name=Student+Test&background=0a66c2&color=fff",
    bio: "นักศึกษาภาควิชาวิทยาการคอมพิวเตอร์ มหาวิทยาลัยสวนดุสิต สนใจด้าน Full-Stack Dev & DevSecOps",
    skills: [
      { name: "Next.js", category: "Framework", level: 5, isVerified: true, testScore: 95 },
      { name: "React", category: "Frontend", level: 4, isVerified: true, testScore: 88 },
      { name: "DevSecOps", category: "Security", level: 5, isVerified: true, testScore: 92 },
      { name: "TypeScript", category: "Language", level: 4, isVerified: true, testScore: 85 },
      { name: "Docker", category: "DevOps", level: 4, isVerified: false, testScore: 78 },
    ],
    projects: [
      {
        title: "Student Portfolio & SkillPassport System",
        description: "ระบบพอร์ตโฟลิโอและโครงข่ายทักษะดิจิทัลสำหรับนักศึกษา มสด.",
        githubUrl: "https://github.com/Taeaps561/student-portfolio",
      },
    ],
    certs: [
      {
        name: "SDU DevSecOps & Cloud Security Specialist",
        issuer: "Suan Dusit University (มหาวิทยาลัยสวนดุสิต)",
        issueDate: new Date("2026-03-01"),
      },
      {
        name: "CCNA (Cisco Certified Network Associate)",
        issuer: "Cisco Systems",
        issueDate: new Date("2025-11-20"),
      },
      {
        name: "CompTIA Security+ (Sec+)",
        issuer: "CompTIA",
        issueDate: new Date("2026-01-10"),
      },
      {
        name: "CEH (Certified Ethical Hacker)",
        issuer: "EC-Council",
        issueDate: new Date("2026-02-15"),
      },
    ],
  },
  {
    name: "สมชาย ยอดนักโค้ด",
    email: "somchai@example.com",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    bio: "นักพัฒนา Full-stack ภาควิชาวิทยาการคอมพิวเตอร์ มหาวิทยาลัยสวนดุสิต เชี่ยวชาญ Next.js และ Cloud",
    skills: [
      { name: "Node.js", category: "Backend", level: 5, isVerified: true, testScore: 92 },
      { name: "Docker", category: "DevOps", level: 4, isVerified: true, testScore: 85 },
      { name: "PostgreSQL", category: "Database", level: 4, isVerified: true, testScore: 88 },
      { name: "AWS Cloud", category: "Cloud", level: 4, isVerified: false, testScore: 80 },
    ],
    projects: [
      {
        title: "Suan Dusit Smart Campus API & Microservices",
        description: "ระบบหลังบ้านและ API สำหรับเชื่อมโยงบริการของมหาวิทยาลัยสวนดุสิต",
        githubUrl: "https://github.com/somchai-dev/sdu-smart-api",
      },
    ],
    certs: [
      {
        name: "วุฒิบัตรการพัฒนาเว็บแอปพลิเคชันขั้นสูง (SDU Advanced Web Engineering)",
        issuer: "Suan Dusit University (มหาวิทยาลัยสวนดุสิต)",
        issueDate: new Date("2026-08-20"),
      },
      {
        name: "AWS Certified Solutions Architect - Associate",
        issuer: "Amazon Web Services (AWS)",
        issueDate: new Date("2026-04-12"),
      },
    ],
  },
  {
    name: "สายฟ้า แฮกเกอร์",
    email: "saifah@example.com",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    bio: "นักศึกษาที่หลงใหลในความปลอดภัยไซเบอร์, SOC Analysis และ Penetration Testing",
    skills: [
      { name: "Cyber Security", category: "Security", level: 5, isVerified: true, testScore: 95 },
      { name: "Network Security", category: "Security", level: 5, isVerified: true, testScore: 90 },
      { name: "Python", category: "Language", level: 4, isVerified: true, testScore: 84 },
      { name: "SIEM & SOC", category: "Security", level: 4, isVerified: false, testScore: 82 },
    ],
    projects: [
      {
        title: "SDU SOC Log Analyzer & Threat Detection",
        description: "ระบบเฝ้าระวังและวิเคราะห์ทราฟฟิกเครือข่ายสำหรับตรวจจับความผิดปกติ",
        githubUrl: "https://github.com/saifah-cyber/sdu-soc-analyzer",
      },
    ],
    certs: [
      {
        name: "วุฒิบัตรความปลอดภัยสารสนเทศและโครงข่าย มสด. (SDU Cyber Defense Practicum)",
        issuer: "Suan Dusit University (มหาวิทยาลัยสวนดุสิต)",
        issueDate: new Date("2026-08-18"),
      },
      {
        name: "CompTIA Security+ (Sec+)",
        issuer: "CompTIA",
        issueDate: new Date("2026-01-10"),
      },
    ],
  },
  {
    name: "เจนจิรา ดีไซเนอร์",
    email: "janejira@example.com",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
    bio: "นักออกแบบ UI/UX ที่เชื่อว่าดีไซน์ที่ดีต้องมาพร้อมกับประสบการณ์ใช้งานที่ยอดเยี่ยม",
    skills: [
      { name: "Figma", category: "Design", level: 5, isVerified: true, testScore: 96 },
      { name: "UI/UX", category: "Design", level: 5, isVerified: true, testScore: 92 },
      { name: "Design Systems", category: "Design", level: 4, isVerified: true, testScore: 88 },
      { name: "Tailwind CSS", category: "Frontend", level: 4, isVerified: false, testScore: 80 },
    ],
    projects: [
      {
        title: "Suan Dusit Design System & UI Kit",
        description: "ชุดแม่แบบ UI และ Design Tokens มาตรฐานสำหรับแอปพลิเคชัน มสด.",
        githubUrl: "https://github.com/janejira/sdu-design-system",
      },
    ],
    certs: [
      {
        name: "วุฒิบัตรการออกแบบประสบการณ์ผู้ใช้และระบบดิจิทัล (SDU UI/UX & Design Systems)",
        issuer: "Suan Dusit University (มหาวิทยาลัยสวนดุสิต)",
        issueDate: new Date("2026-08-15"),
      },
      {
        name: "Google UX Design Professional Certificate",
        issuer: "Google Career Certificates",
        issueDate: new Date("2026-05-10"),
      },
    ],
  },
  {
    name: "กานต์พิชชา ดาต้าไซน์",
    email: "karnpitcha@example.com",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
    bio: "นักศึกษาที่มุ่งเน้นการวิเคราะห์ข้อมูลขนาดใหญ่และ Machine Learning เพื่อธุรกิจ",
    skills: [
      { name: "Python", category: "Language", level: 5, isVerified: true, testScore: 94 },
      { name: "SQL & Analytics", category: "Data", level: 5, isVerified: true, testScore: 90 },
      { name: "PowerBI", category: "Data", level: 4, isVerified: true, testScore: 86 },
    ],
    projects: [
      {
        title: "Student Academic Performance Prediction Model",
        description: "โมเดลคาดการณ์ผลการเรียนและความเสี่ยงของนักศึกษาด้วย Machine Learning",
        githubUrl: "https://github.com/karnpitcha/sdu-data-model",
      },
    ],
    certs: [
      {
        name: "IBM Data Science Professional Certificate",
        issuer: "IBM Skills Network",
        issueDate: new Date("2026-06-15"),
      },
    ],
  },
  {
    name: "ธีรเดช คลาวด์เดฟ",
    email: "theeradech@example.com",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    bio: "มุ่งมั่นในการออกแบบ Cloud Infrastructure, Kubernetes และ Automated CI/CD Pipelines",
    skills: [
      { name: "Docker", category: "DevOps", level: 5, isVerified: true, testScore: 92 },
      { name: "Kubernetes", category: "DevOps", level: 4, isVerified: true, testScore: 85 },
      { name: "Linux Server", category: "System", level: 5, isVerified: true, testScore: 89 },
    ],
    projects: [
      {
        title: "Automated GitOps & Kubernetes Deployments",
        description: "โครงสร้างพื้นฐาน CI/CD บน Kubernetes Cluster",
        githubUrl: "https://github.com/theeradech/sdu-k8s-infra",
      },
    ],
    certs: [
      {
        name: "Certified Kubernetes Administrator (CKA)",
        issuer: "Cloud Native Computing Foundation (CNCF)",
        issueDate: new Date("2026-07-20"),
      },
    ],
  },
  {
    name: "ปิยวัฒน์ ซอฟต์แวร์",
    email: "piyawat@example.com",
    image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80",
    bio: "นักพัฒนา Mobile Application และ Cross-platform ด้วย Flutter & React Native",
    skills: [
      { name: "React Native", category: "Mobile", level: 5, isVerified: true, testScore: 91 },
      { name: "TypeScript", category: "Language", level: 4, isVerified: true, testScore: 86 },
      { name: "REST API", category: "Backend", level: 4, isVerified: true, testScore: 88 },
    ],
    projects: [
      {
        title: "SDU Student Life Mobile App",
        description: "แอปพลิเคชันมือถือสำหรับจัดการตารางเรียนและกิจกรรมนักศึกษา มสด.",
        githubUrl: "https://github.com/piyawat/sdu-life-app",
      },
    ],
    certs: [
      {
        name: "Meta React Native Specialization",
        issuer: "Meta & Coursera",
        issueDate: new Date("2026-05-30"),
      },
    ],
  },
];

async function seed() {
  console.log("Seeding 7 authentic student accounts into SQLite DB...");

  for (const st of STUDENTS) {
    let user = await prisma.user.findUnique({
      where: { email: st.email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: st.name,
          email: st.email,
          image: st.image,
          role: "STUDENT",
        },
      });
      console.log(`Created user: ${st.name} (${st.email})`);
    } else {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          name: st.name,
          image: st.image,
          role: "STUDENT",
        },
      });
      console.log(`Updated user: ${st.name} (${st.email})`);
    }

    // Ensure Portfolio
    let portfolio = await prisma.portfolio.findUnique({
      where: { userId: user.id },
      include: { skills: true, projects: true, certificates: true },
    });

    if (!portfolio) {
      portfolio = await prisma.portfolio.create({
        data: {
          userId: user.id,
          bio: st.bio,
          isPublic: true,
        },
        include: { skills: true, projects: true, certificates: true },
      });
    }

    // Seed Skills
    for (const sk of st.skills) {
      const exists = portfolio.skills.some((s) => s.name.toLowerCase() === sk.name.toLowerCase());
      if (!exists) {
        await prisma.skill.create({
          data: {
            portfolioId: portfolio.id,
            name: sk.name,
            category: sk.category,
            level: sk.level,
            isVerified: sk.isVerified,
            testScore: sk.testScore,
            status: sk.isVerified ? "VERIFIED" : "PENDING",
          },
        });
      }
    }

    // Seed Projects
    for (const pr of st.projects) {
      const exists = portfolio.projects.some((p) => p.title === pr.title);
      if (!exists) {
        await prisma.project.create({
          data: {
            portfolioId: portfolio.id,
            title: pr.title,
            description: pr.description,
            githubUrl: pr.githubUrl,
          },
        });
      }
    }

    // Seed Certs
    for (const cr of st.certs) {
      const exists = portfolio.certificates.some((c) => c.name.includes(cr.name.split(" ")[0]));
      if (!exists) {
        const hash = `cert_hash_${crypto.createHash("sha256").update(`${cr.name}-${cr.issuer}-${user.id}`).digest("hex").substring(0, 32)}`;
        await prisma.certificate.create({
          data: {
            portfolioId: portfolio.id,
            name: cr.name,
            issuer: cr.issuer,
            issueDate: cr.issueDate,
            fileUrl: "https://example.com/certificate.pdf",
            hashValue: hash,
          },
        });
      }
    }
  }

  console.log("Successfully seeded 7 student accounts with complete portfolios!");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
