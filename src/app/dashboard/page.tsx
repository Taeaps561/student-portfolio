import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function PortfolioDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  // Fetch or create portfolio for user
  let portfolio = await prisma.portfolio.findUnique({
    where: { userId: session.user.id as string },
    include: { skills: true, projects: true, certificates: true },
  });

  if (!portfolio) {
    portfolio = await prisma.portfolio.create({
      data: {
        userId: session.user.id as string,
        bio: "สวัสดี! ฉันเป็นนักศึกษาที่หลงใหลในการเขียนโค้ดและสร้างสรรค์นวัตกรรมใหม่ๆ",
        isPublic: true,
        skills: {
          create: [
            { name: "React", category: "Tech", level: 4, isVerified: true },
            { name: "Next.js", category: "Tech", level: 3, isVerified: true },
            { name: "Tailwind CSS", category: "Tech", level: 5, isVerified: false },
            { name: "Problem Solving", category: "Soft", level: 4, isVerified: true }
          ]
        },
        projects: {
          create: [
            { title: "E-Commerce Web", description: "ระบบร้านค้าออนไลน์สร้างด้วย Next.js และ Stripe", githubUrl: "https://github.com/example/ecommerce" },
            { title: "Task Manager API", description: "แอปจัดการงานพร้อมระบบแจ้งเตือน สร้างด้วย Node.js", githubUrl: "https://github.com/example/task-manager" }
          ]
        },
        certificates: {
          create: [
            { name: "React Developer", issuer: "Meta", issueDate: new Date("2025-01-15"), fileUrl: "#", hashValue: `hash-react-cert-${session.user.id}` }
          ]
        }
      },
      include: { skills: true, projects: true, certificates: true },
    });
  }

  return (
    <div className="min-h-screen bg-[#f4f2ee] pt-[85px] px-4 pb-16">
      <div className="max-w-[1128px] mx-auto space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Digital Passport ของนักศึกษา
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              จัดการทักษะ, ผลงานโปรเจกต์ และใบรับรองดิจิทัลของคุณ
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/resume"
              className="px-5 py-2.5 rounded-full bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs transition shadow-sm flex items-center gap-1.5"
            >
              📄 ดูเรซูเม่ (Resume)
            </Link>
            <Link
              href={`/u/${session.user.id}`}
              className="px-5 py-2.5 rounded-full bg-[#0a66c2] hover:bg-[#004182] text-white font-bold text-xs transition shadow-sm"
            >
              🔗 ดูโปรไฟล์สาธารณะ
            </Link>
          </div>
        </div>

        {/* 1. Main Profile Banner Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-6 sm:gap-8">
          <div className="relative">
            <img 
              src={session.user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user.name || "User")}&background=002d62&color=fff`} 
              alt="Profile" 
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-slate-100 object-cover shadow-md"
            />
            <span className="absolute bottom-1 right-1 p-1 rounded-full bg-emerald-500 text-white text-xs" title="Verified">
              ✓
            </span>
          </div>

          <div className="flex-grow text-center md:text-left space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              {session.user.name}
            </h2>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs font-semibold text-slate-600">
              <span>{session.user.email}</span>
              <span>•</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {portfolio.isPublic ? "🌎 สาธารณะ (Public)" : "🔒 ส่วนตัว (Private)"}
              </span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed max-w-2xl pt-1">
              {portfolio.bio}
            </p>
          </div>

          <div className="flex flex-col gap-2.5 min-w-[200px] w-full md:w-auto">
             <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1.5">
                <p className="text-slate-600 font-medium">เกรดเฉลี่ย (GPA): <span className="text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded font-bold">Masked (ซ่อน)</span></p>
                <p className="text-slate-600 font-medium">เบอร์โทรศัพท์: <span className="text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded font-bold">Masked (ซ่อน)</span></p>
             </div>
          </div>
        </div>

        {/* 2-Column Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Left 2 Cols: Skills & Projects */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Skills Section */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span>⚡</span> ทักษะ (Skills)
                </h2>
                <Link href="/skills" className="text-xs font-bold text-[#0a66c2] hover:underline">
                  + จัดการทักษะ
                </Link>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {portfolio.skills.length > 0 ? (
                  portfolio.skills.map((skill) => (
                    <div
                      key={skill.id}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 ${
                        skill.isVerified
                          ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                          : "bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      {skill.isVerified && <span className="text-emerald-600 font-bold">✓</span>}
                      <span>{skill.name}</span>
                    </div>
                  ))
                ) : (
                  <div className="w-full text-center py-6 text-slate-500 text-xs border border-dashed border-slate-200 rounded-xl">
                    ยังไม่มีข้อมูลทักษะ
                  </div>
                )}
              </div>
            </div>

            {/* Projects Section */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span>📂</span> ผลงานและโปรเจกต์ (Projects)
                </h2>
                <Link href="/projects" className="text-xs font-bold text-[#0a66c2] hover:underline">
                  + เพิ่มผลงาน
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {portfolio.projects.length > 0 ? (
                  portfolio.projects.map((project) => (
                    <div
                      key={project.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-blue-400 transition flex flex-col justify-between h-36 group"
                    >
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 truncate group-hover:text-[#0a66c2] transition">
                          {project.title}
                        </h3>
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                          {project.description}
                        </p>
                      </div>
                      <a
                        href={project.githubUrl || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-[#0a66c2] hover:underline flex items-center gap-1 w-max pt-2"
                      >
                        <span>🐙</span> ดูโค้ดบน GitHub ↗
                      </a>
                    </div>
                  ))
                ) : (
                  <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-center items-center text-slate-500 text-xs border-dashed col-span-2">
                    ยังไม่มีโปรเจกต์
                  </div>
                )}
              </div>
            </div>

            {/* GitHub Integration Section */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span>🐙</span> GitHub Integration
                </h2>
                <Link href="/github" className="text-xs font-bold text-[#0a66c2] hover:underline">
                  จัดการการเชื่อมต่อ ↗
                </Link>
              </div>
              <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <p className="text-slate-900 font-bold text-sm">ซิงก์ข้อมูลประวัติโค้ดและ Repositories</p>
                  <p className="text-slate-600 text-xs mt-1">
                    ดึงข้อมูล Contribution Graph, สถิติภาษา และนำเข้าโครงการสู่ Portfolio แบบเรียลไทม์
                  </p>
                </div>
                <Link
                  href="/github"
                  className="px-5 py-2.5 bg-[#0a66c2] hover:bg-[#004182] rounded-full text-xs font-bold text-white transition shrink-0 shadow-sm"
                >
                  เปิดหน้า GitHub ⚡
                </Link>
              </div>
            </div>

          </div>

          {/* Right 1 Col: Certificates & Badges */}
          <div className="space-y-6">
            
            {/* Certificates Section */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span>🏆</span> ใบรับรอง (Certificates)
                </h2>
                <Link href="/certificates" className="text-xs font-bold text-[#0a66c2] hover:underline">
                  + อัปโหลด
                </Link>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                  <p className="text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    ระบบตรวจสอบพร้อมใช้งาน
                  </p>
                  <p className="text-emerald-700 text-[11px] mt-0.5 font-medium">
                    ใบรับรองมี Digital Signature (Hash) สำหรับตรวจสอบ
                  </p>
                </div>
                
                {portfolio.certificates.length > 0 ? (
                  portfolio.certificates.map((cert) => (
                    <div
                      key={cert.id}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300 transition flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-100 text-[#0a66c2] flex items-center justify-center text-lg font-bold">
                          📜
                        </div>
                        <div>
                          <p className="text-slate-900 text-xs font-bold">{cert.name}</p>
                          <p className="text-slate-500 text-[11px]">{cert.issuer}</p>
                        </div>
                      </div>
                      <span className="text-emerald-600 font-bold text-xs">
                        ✓ Verified
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center border-dashed text-slate-500 text-xs">
                    ยังไม่มีใบรับรอง
                  </div>
                )}
              </div>
            </div>

            {/* Badges Section */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <span>🏅</span> เหรียญรางวัล (Badges)
              </h2>

              <div className="grid grid-cols-3 gap-3">
                <div className="aspect-square rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-2xl shadow-sm hover:scale-105 transition" title="First Project">
                  🚀
                </div>
                <div className="aspect-square rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-2xl shadow-sm hover:scale-105 transition" title="100 Commits">
                  🔥
                </div>
                <div className="aspect-square rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-2xl shadow-sm hover:scale-105 transition" title="Verified Skill">
                  ⭐
                </div>
              </div>
              <p className="text-center text-xs text-slate-500 font-medium">คุณได้รับ 3 Badges จากการยืนยันทักษะและโปรเจกต์</p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
