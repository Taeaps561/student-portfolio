import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PublicShareButton } from "./ShareButton";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Predefined mock profiles mapping for showcase and guest demonstration
const mockProfilesDirectory: Record<string, any> = {
  "mock-somchai": {
    name: "สมชาย ยอดนักโค้ด",
    role: "STUDENT",
    headline: "Full-Stack Developer | Next.js, TypeScript & Cloud Architecture",
    bio: "นักพัฒนา Full-stack ภาควิชาวิทยาการคอมพิวเตอร์ มหาวิทยาลัยสวนดุสิต เชี่ยวชาญ Next.js, TypeScript และ Node.js มุ่งมั่นสร้างสรรค์ซอฟต์แวร์ที่มีประสิทธิภาพ ปลอดภัย และตอบโจทย์ผู้ใช้งานจริง",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    skills: [
      { id: "s1", name: "React & Next.js 15", level: 5, isVerified: true },
      { id: "s2", name: "TypeScript", level: 5, isVerified: true },
      { id: "s3", name: "Node.js & REST API", level: 4, isVerified: true },
      { id: "s4", name: "Tailwind CSS & UI Design", level: 4, isVerified: true },
    ],
    projects: [
      {
        id: "p1",
        title: "Suan Dusit SkillPassport & Portfolio Platform",
        description: "ระบบโครงข่ายทักษะดิจิทัลสไตล์ LinkedIn สำหรับนักศึกษาและบุคลากรมหาวิทยาลัยสวนดุสิต",
        githubUrl: "https://github.com",
      },
      {
        id: "p2",
        title: "Enterprise Inventory & Analytics WebApp",
        description: "ระบบบริหารจัดการคลังสินค้าแบบเรียลไทม์ พร้อมแดชบอร์ดสรุปสถิติ",
        githubUrl: "https://github.com",
      },
    ],
    certificates: [
      {
        id: "c1",
        name: "Certified Full-Stack Web Developer",
        issuer: "มหาวิทยาลัยสวนดุสิต & SkillPassport",
        issueDate: new Date(),
        hashValue: "0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
      },
    ],
  },
  "mock-saifah": {
    name: "สายฟ้า แฮกเกอร์",
    role: "STUDENT",
    headline: "Cybersecurity Analyst | Penetration Testing & SOC Specialist",
    bio: "นักศึกษาผู้ชื่นชอบความปลอดภัยทางไซเบอร์ ภาควิชาวิทยาการคอมพิวเตอร์ มหาวิทยาลัยสวนดุสิต เน้นการทดสอบเจาะระบบ (Penetration Testing) และวิเคราะห์ภัยคุกคามในระบบสารสนเทศ",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    skills: [
      { id: "s1", name: "Cyber Security & SOC", level: 5, isVerified: true },
      { id: "s2", name: "Python for Security", level: 4, isVerified: true },
      { id: "s3", name: "Network Infrastructure", level: 4, isVerified: false },
    ],
    projects: [
      {
        id: "p1",
        title: "SOC Threat Analysis Playbook",
        description: "คู่มือและเครื่องมือจำลองการสืบสวนและรับมือการโจมตีทางไซเบอร์ตามมาตรฐานสากล",
        githubUrl: "https://github.com",
      },
    ],
    certificates: [
      {
        id: "c1",
        name: "Certified Ethical Security Practitioner",
        issuer: "มหาวิทยาลัยสวนดุสิต",
        issueDate: new Date(),
        hashValue: "0x4b1fa3d677284addd200126d90697f83b1657ff1fc53b92dc18148a1d65dfc2d",
      },
    ],
  },
  "mock-jane": {
    name: "เจนจิรา ดีไซเนอร์",
    role: "STUDENT",
    headline: "Product & UI/UX Designer | Design Systems Specialist",
    bio: "นักออกแบบ UI/UX ที่มุ่งเน้นการสร้างประสบการณ์ที่เข้าถึงง่าย สวยงาม และตอบสนองความต้องการของผู้ใช้งานอย่างแท้จริง",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
    skills: [
      { id: "s1", name: "Figma & Wireframing", level: 5, isVerified: true },
      { id: "s2", name: "UI/UX Design Systems", level: 5, isVerified: true },
      { id: "s3", name: "User Experience Research", level: 4, isVerified: true },
    ],
    projects: [
      {
        id: "p1",
        title: "Mobile Banking & Investment UI Kit",
        description: "ชุดแม่แบบการออกแบบแอปพลิเคชันการเงินที่ผ่านการทดสอบ User Usability 100%",
        githubUrl: "https://github.com",
      },
    ],
    certificates: [
      {
        id: "c1",
        name: "Certified UI/UX Professional",
        issuer: "มหาวิทยาลัยสวนดุสิต",
        issueDate: new Date(),
        hashValue: "0x1d65dfc2d4b1fa3d677284addd200126d90697f83b1657ff1fc53b92dc18148a",
      },
    ],
  },
  "mock-teacher": {
    name: "ศ.ดร.สมชาย ใจดี",
    role: "TEACHER",
    headline: "อาจารย์ประจำภาควิชาวิทยาการคอมพิวเตอร์ | Faculty Advisor",
    bio: "อาจารย์ที่ปรึกษาและผู้เชี่ยวชาญด้านวิทยาการคอมพิวเตอร์ สถาปัตยกรรมคลาวด์ และการประเมินทักษะมาตรฐานวิชาชีพ มหาวิทยาลัยสวนดุสิต",
    image: "https://ui-avatars.com/api/?name=Somchai+Jaidee&background=002d62&color=fff",
    skills: [
      { id: "s1", name: "Curriculum Design", level: 5, isVerified: true },
      { id: "s2", name: "Cloud Architecture", level: 5, isVerified: true },
      { id: "s3", name: "Cybersecurity Governance", level: 5, isVerified: true },
    ],
    projects: [
      {
        id: "p1",
        title: "Computer Science Skill Verification Standard",
        description: "กรอบมาตรฐานการรับรองทักษะวิชาชีพคอมพิวเตอร์และการประเมินผลการเรียนรู้",
        githubUrl: "https://github.com",
      },
    ],
    certificates: [
      {
        id: "c1",
        name: "Distinguished Academic Fellow",
        issuer: "มหาวิทยาลัยสวนดุสิต",
        issueDate: new Date(),
        hashValue: "0x90697f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d",
      },
    ],
  },
};

export default async function LinkedInProfilePage({ params }: PageProps) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  // 1. Check real user in database
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      portfolio: {
        include: {
          skills: true,
          projects: true,
          certificates: true,
        },
      },
      posts: {
        include: {
          likes: true,
          comments: true,
        },
        orderBy: { createdAt: "desc" },
        take: 3,
      },
    },
  });

  // 2. Check if it's one of our mock profile IDs
  const mockData = mockProfilesDirectory[id];

  // Resolve Profile Info
  const userName = user?.name || mockData?.name || (user?.role === "TEACHER" ? "ศ.ดร.สมชาย ใจดี" : user?.role === "EMPLOYER" ? "คุณวิชัย ปรีชา (บมจ. เทคโนโลยีดีไลท์)" : "นักศึกษา มหาวิทยาลัยสวนดุสิต");
  const userRole = user?.role || mockData?.role || "STUDENT";
  
  const userHeadline =
    mockData?.headline ||
    (userRole === "TEACHER"
      ? "อาจารย์ประจำหลักสูตรวิทยาการคอมพิวเตอร์ • คณะวิทยาศาสตร์และเทคโนโลยี มหาวิทยาลัยสวนดุสิต"
      : userRole === "EMPLOYER"
      ? "HR & Tech Talent Acquisition • บมจ. เทคโนโลยีดีไลท์"
      : "นักศึกษาภาควิชาวิทยาการคอมพิวเตอร์ • มหาวิทยาลัยสวนดุสิต");

  let rawBio = user?.portfolio?.bio || mockData?.bio || "";
  if (!rawBio || rawBio.includes("หลงใหลในการเขียนโค้ด")) {
    if (userRole === "TEACHER") {
      rawBio = "อาจารย์ประจำหลักสูตรวิทยาการคอมพิวเตอร์ คณะวิทยาศาสตร์และเทคโนโลยี มหาวิทยาลัยสวนดุสิต ผู้เชี่ยวชาญด้านสถาปัตยกรรมคลาวด์ ความปลอดภัยทางไซเบอร์ และการประเมินสมรรถนะทักษะวิชาชีพดิจิทัลมาตรฐานสากล";
    } else if (userRole === "EMPLOYER") {
      rawBio = "ฝ่ายบริหารทรัพยากรบุคคลและจัดหาบุคลากรทางด้านเทคโนโลยี บมจ. เทคโนโลยีดีไลท์ มุ่งเน้นการค้นหาและคัดสรรผู้มีความสามารถรุ่นใหม่จากมหาวิทยาลัยสวนดุสิต เข้าสู่ตำแหน่ง Full-Stack Developer, DevOps และ Cyber Security";
    } else {
      rawBio = "นักศึกษาภาควิชาวิทยาการคอมพิวเตอร์ มหาวิทยาลัยสวนดุสิต เชี่ยวชาญการพัฒนาเว็บแอปพลิเคชัน Full-Stack (Next.js, TypeScript, Tailwind CSS) และระบบความปลอดภัยสารสนเทศ พร้อมเปิดรับโอกาสการทำงานและสหกิจศึกษา";
    }
  }
  const userBio = rawBio;
  const userAvatar =
    user?.image ||
    mockData?.image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=002d62&color=fff`;

  const skills = user?.portfolio?.skills?.length
    ? user.portfolio.skills
    : mockData?.skills || [
        { id: "s1", name: "Next.js & React", level: 5, isVerified: true },
        { id: "s2", name: "TypeScript", level: 5, isVerified: true },
        { id: "s3", name: "Python", level: 4, isVerified: true },
      ];

  const projects = user?.portfolio?.projects?.length
    ? user.portfolio.projects
    : mockData?.projects || [
        {
          id: "p1",
          title: "SkillPassport Portfolio WebApp",
          description: "แพลตฟอร์มสะสมผลงานและรับรองทักษะดิจิทัล มหาวิทยาลัยสวนดุสิต",
          githubUrl: "https://github.com",
        },
      ];

  const certificates = user?.portfolio?.certificates?.length
    ? user.portfolio.certificates
    : mockData?.certificates || [
        {
          id: "c1",
          name: "Certified Technology Specialist",
          issuer: "มหาวิทยาลัยสวนดุสิต & SkillPassport",
          issueDate: new Date(),
          hashValue: "0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
        },
      ];

  const isSelf = session?.user?.id === user?.id;

  return (
    <div className="min-h-screen bg-[#f4f2ee] pt-[85px] pb-16 px-4">
      <div className="max-w-[1128px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Profile Column (8 Cols) */}
        <div className="lg:col-span-8 space-y-3">
          
          {/* TOP PROFILE CARD */}
          <div className="linkedin-card bg-white overflow-hidden relative shadow-sm">
            {/* Banner Cover */}
            <div className="h-44 sm:h-52 w-full bg-gradient-to-r from-[#002d62] via-[#004182] to-slate-900 relative">
              <img
                src="https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80"
                alt="Banner"
                className="w-full h-full object-cover opacity-60"
              />
            </div>

            {/* Avatar overlapping with #OpenToWork badge */}
            <div className="px-6 pb-6 relative">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-20 sm:-mt-24 mb-4 gap-4">
                <div className="relative inline-block">
                  <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-full p-1 bg-[#057642] ring-4 ring-white shadow-md">
                    <img
                      src={userAvatar}
                      alt={userName}
                      className="w-full h-full rounded-full object-cover bg-white"
                    />
                  </div>
                  <span className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-[#057642] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter shadow">
                    #OpenToWork
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <PublicShareButton userId={id} userName={userName} />
                  <Link
                    href="/explore"
                    className="px-4 py-1.5 rounded-full border-2 border-[#0a66c2] text-[#0a66c2] hover:bg-[#ebf4fd] font-bold text-xs transition"
                  >
                    สำรวจบุคคลอื่น
                  </Link>
                  {isSelf && (
                    <Link
                      href="/portfolio"
                      className="px-4 py-1.5 rounded-full bg-[#0a66c2] text-white hover:bg-[#004182] font-bold text-xs transition"
                    >
                      แก้ไขโปรไฟล์
                    </Link>
                  )}
                </div>
              </div>

              {/* Identity & Headline */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-black">{userName}</h1>
                  <span className="text-[#057642] text-base" title="Verified Credential">✓</span>
                </div>
                <p className="text-sm text-[#000000e6] font-normal">
                  {userHeadline}
                </p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#00000099] pt-1">
                  <span>กรุงเทพมหานคร, ประเทศไทย</span>
                  <span>•</span>
                  <Link href="/about" className="text-[#0a66c2] font-bold hover:underline">
                    ข้อมูลติดต่อ
                  </Link>
                  <span>•</span>
                  <span className="text-[#0a66c2] font-bold">500+ คนรู้จัก</span>
                </div>
              </div>

              {/* Institution Row */}
              <div className="mt-4 pt-3 border-t border-[#e0e0e0] flex items-center gap-2 text-xs font-semibold text-[#000000e6]">
                <span className="text-lg">🏛️</span>
                <span>มหาวิทยาลัยสวนดุสิต (Suan Dusit University)</span>
              </div>
            </div>
          </div>

          {/* ABOUT / เกี่ยวกับ */}
          <div className="linkedin-card p-6 bg-white space-y-3 shadow-sm">
            <h2 className="text-lg font-bold text-black">เกี่ยวกับ (About)</h2>
            <p className="text-sm text-[#000000e6] leading-relaxed whitespace-pre-line">
              {userBio}
            </p>
          </div>

          {/* VERIFIED SKILLS / ทักษะ */}
          <div className="linkedin-card p-6 bg-white space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#e0e0e0] pb-3">
              <h2 className="text-lg font-bold text-black">ทักษะที่ผ่านการรับรอง (Verified Skills)</h2>
              <span className="text-xs text-[#0a66c2] font-bold">{skills.length} ทักษะ</span>
            </div>

            <div className="space-y-3">
              {skills.map((skill: any) => (
                <div key={skill.id} className="p-3.5 rounded-lg border border-[#e0e0e0] bg-[#fafafa] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-black">{skill.name}</span>
                    <span className="text-xs font-bold text-[#057642] flex items-center gap-1">
                      <span>✓</span> รับรองแล้วโดยมหาวิทยาลัย
                    </span>
                  </div>
                  <p className="text-xs text-[#00000099]">
                    ระดับความชำนาญ: ระดับ {skill.level || 5}/5 • ตรวจสอบความถูกต้องสมบูรณ์แล้ว
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* FEATURED PROJECTS / ผลงาน */}
          <div className="linkedin-card p-6 bg-white space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#e0e0e0] pb-3">
              <h2 className="text-lg font-bold text-black">ผลงานเด่น (Featured Projects)</h2>
              <span className="text-xs text-[#0a66c2] font-bold">{projects.length} โปรเจกต์</span>
            </div>

            <div className="space-y-3">
              {projects.map((proj: any) => (
                <div key={proj.id} className="p-4 rounded-lg border border-[#e0e0e0] space-y-1.5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-bold text-black">{proj.title}</h3>
                      <p className="text-xs text-gray-700 mt-1">{proj.description}</p>
                    </div>
                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1 rounded-full border border-gray-300 hover:bg-gray-100 text-xs font-bold transition shrink-0"
                      >
                        GitHub ↗
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* LICENSES & CERTIFICATES / ใบรับรอง */}
          <div className="linkedin-card p-6 bg-white space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#e0e0e0] pb-3">
              <h2 className="text-lg font-bold text-black">ใบอนุญาตและใบรับรอง (Licenses & Certifications)</h2>
              <span className="text-xs text-[#057642] font-bold">Verified Credential</span>
            </div>

            <div className="space-y-3">
              {certificates.map((cert: any) => (
                <div key={cert.id} className="p-4 rounded-lg border border-[#e0e0e0] space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-bold text-black">{cert.name}</h3>
                      <p className="text-xs text-[#00000099]">{cert.issuer}</p>
                      <p className="text-[11px] text-[#00000099]">
                        ออกเมื่อ: {new Date(cert.issueDate).toLocaleDateString("th-TH")} • ไม่มีวันหมดอายุ
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-[#057642] text-xs font-bold border border-emerald-200">
                      ✓ ผ่านการตรวจสอบ
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column Profile Stats (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          
          <div className="linkedin-card p-4 bg-white space-y-3 shadow-sm">
            <h3 className="text-sm font-bold text-black">ภาษาในโปรไฟล์</h3>
            <p className="text-xs text-[#00000099]">ไทย (ค่าเริ่มต้น) • อังกฤษ</p>
          </div>

          <div className="linkedin-card p-4 bg-white space-y-3 shadow-sm">
            <h3 className="text-sm font-bold text-black">โปรไฟล์สาธารณะและ URL</h3>
            <p className="text-xs text-[#0a66c2] font-semibold truncate">
              {`http://localhost:3000/u/${id}`}
            </p>
          </div>

          <div className="linkedin-card p-4 bg-white space-y-3 shadow-sm">
            <h3 className="text-sm font-bold text-black">ผู้คนที่คุณอาจรู้จัก</h3>
            <div className="space-y-3 text-xs">
              {[
                { name: "ศ.ดร.สมชาย ใจดี", role: "อาจารย์ที่ปรึกษา", img: "https://ui-avatars.com/api/?name=Somchai+Jaidee&background=002d62&color=fff", id: "mock-teacher" },
                { name: "สายฟ้า แฮกเกอร์", role: "Cybersecurity Analyst", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80", id: "mock-saifah" },
                { name: "เจนจิรา ดีไซเนอร์", role: "UI/UX Designer", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80", id: "mock-jane" },
              ].map((person, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <Link href={`/u/${person.id}`} className="flex items-center gap-2 hover:opacity-80">
                    <img src={person.img} alt={person.name} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <p className="font-bold text-black hover:text-[#0a66c2] hover:underline">{person.name}</p>
                      <p className="text-[11px] text-[#00000099]">{person.role}</p>
                    </div>
                  </Link>
                  <button className="px-2.5 py-1 rounded-full border border-gray-400 text-gray-700 hover:border-black text-[11px] font-bold">
                    + เชื่อมต่อ
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
