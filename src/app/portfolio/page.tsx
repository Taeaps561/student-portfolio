import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function PublicPortfolioPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions);
  const resolvedParams = await searchParams;
  const targetId = resolvedParams.id;

  // If no target ID and not logged in, redirect to login
  if (!targetId && (!session || !session.user)) {
    redirect("/login");
  }

  const userId = targetId || (session?.user?.id as string);
  const isSelf = session?.user?.id === userId;

  // Fetch target portfolio
  const portfolio = await prisma.portfolio.findUnique({
    where: { userId },
    include: {
      user: true,
      skills: true,
      projects: true,
      certificates: true,
    },
  });

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-[#f4f2ee] flex items-center justify-center pt-[85px] px-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center border border-slate-200 shadow-sm">
          <div className="text-4xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">ไม่พบแฟ้มสะสมผลงาน</h2>
          <p className="text-slate-600 mb-6 text-sm">ผู้ใช้นี้ยังไม่ได้สร้าง Portfolio หรือไม่มีอยู่ในระบบ</p>
          <Link href="/dashboard" className="inline-block px-6 py-2.5 rounded-full bg-[#0a66c2] hover:bg-[#004182] text-white font-bold text-xs transition">
            กลับไปยัง Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Security check: If not self and portfolio is private, block access
  if (!isSelf && !portfolio.isPublic) {
    return (
      <div className="min-h-screen bg-[#f4f2ee] flex items-center justify-center pt-[85px] px-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center border border-slate-200 shadow-sm">
          <div className="text-4xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">แฟ้มสะสมผลงานนี้เป็นส่วนตัว</h2>
          <p className="text-slate-600 mb-6 text-sm">เจ้าของพอร์ตโฟลิโอปิดการเข้าถึงแบบสาธารณะชั่วคราว</p>
          <Link href="/explore" className="inline-block px-6 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition border border-slate-300">
            ไปหน้าสำรวจพอร์ต
          </Link>
        </div>
      </div>
    );
  }

  const verifiedSkillsCount = portfolio.skills.filter(s => s.isVerified).length;

  return (
    <div className="min-h-screen bg-[#f4f2ee] pt-[85px] px-4 pb-16">
      <div className="max-w-[1128px] mx-auto space-y-6">
        
        {/* Profile Card / Passport Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-6 sm:gap-8">
          <div className="relative">
            <img 
              src={portfolio.user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(portfolio.user.name || "User")}&background=002d62&color=fff`} 
              alt="Profile" 
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-slate-100 object-cover shadow-md"
            />
            {portfolio.isPublic && (
              <span className="absolute bottom-0 right-0 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 text-xs font-bold shadow-sm">
                🌎 Public
              </span>
            )}
          </div>

          <div className="flex-grow text-center md:text-left space-y-2">
            <div className="flex flex-col md:flex-row md:items-center gap-2.5 justify-center md:justify-start">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {portfolio.user.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0a66c2] border border-blue-200 text-xs font-bold self-center">
                🎓 Verified ID Passport
              </span>
            </div>
            <p className="text-slate-600 text-xs font-medium">{portfolio.user.email} • มหาวิทยาลัยสวนดุสิต</p>
            <p className="text-slate-700 max-w-2xl leading-relaxed text-sm pt-1">
              "{portfolio.bio || "ไม่มีคำแนะนำตัวปัจจุบัน"}"
            </p>
            
            {/* Masked Sensitive info */}
            <div className="flex flex-wrap gap-2.5 pt-2 text-xs justify-center md:justify-start">
              <span className="px-3 py-1 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                📊 GPA: <span className={isSelf ? "text-slate-900 font-bold" : "text-amber-700 font-semibold"}>
                  {isSelf ? (portfolio.gpa?.toFixed(2) || "ไม่ได้ระบุ") : "⭐⭐ (Masked)"}
                </span>
              </span>
              <span className="px-3 py-1 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                📞 โทรศัพท์: <span className={isSelf ? "text-slate-900 font-bold" : "text-amber-700 font-semibold"}>
                  {isSelf ? (portfolio.phoneNumber || "ไม่ได้ระบุ") : "08x-xxx-xxxx"}
                </span>
              </span>
            </div>

            {isSelf && (
              <div className="pt-2 flex justify-center md:justify-start gap-2">
                <Link 
                  href="/resume"
                  className="px-4 py-2 rounded-full bg-[#0a66c2] hover:bg-[#004182] text-white text-xs font-bold transition shadow-sm flex items-center gap-1.5"
                >
                  📄 ดูเรซูเม่ (Resume)
                </Link>
                <Link 
                  href={`/u/${userId}`}
                  className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-bold transition flex items-center gap-1.5"
                >
                  🔗 หน้าโปรไฟล์สาธารณะ (LinkedIn View)
                </Link>
              </div>
            )}
          </div>

          {/* Quick Passport Statistics Badge */}
          <div className="flex gap-4 md:flex-col min-w-[170px] bg-slate-50 p-4 rounded-xl border border-slate-200 text-center w-full md:w-auto">
            <div className="flex-1 md:flex-none">
              <p className="text-2xl font-black text-slate-900">
                {portfolio.skills.length}
              </p>
              <p className="text-[11px] text-slate-500 uppercase tracking-wider font-bold">ทักษะทั้งหมด</p>
            </div>
            <div className="border-l md:border-l-0 md:border-t border-slate-200 h-8 md:h-0 my-auto md:my-1.5"></div>
            <div className="flex-1 md:flex-none">
              <p className="text-2xl font-black text-emerald-600">
                {verifiedSkillsCount}
              </p>
              <p className="text-[11px] text-slate-500 uppercase tracking-wider font-bold">รับรองแล้ว</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Portfolio Details (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Skills grid */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <span>⚡</span> ทักษะและความเชี่ยวชาญ (Skills & Expertises)
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {portfolio.skills.length > 0 ? (
                  portfolio.skills.map((skill) => (
                    <div key={skill.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between group hover:bg-white hover:border-blue-300 transition">
                      <div>
                        <p className="text-slate-900 font-bold text-sm flex items-center gap-1.5">
                          {skill.name}
                          {skill.isVerified && (
                            <span className="text-emerald-600 text-xs" title="Verified Skill">✓</span>
                          )}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">{skill.category} Skill</p>
                      </div>
                      
                      {/* Rating bars */}
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((lvl) => (
                          <div 
                            key={lvl} 
                            className={`w-1.5 h-6 rounded-full transition-all ${
                              lvl <= skill.level 
                                ? "bg-[#0a66c2]" 
                                : "bg-slate-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-xs col-span-2 text-center py-4">ไม่มีข้อมูลทักษะ</p>
                )}
              </div>
            </div>

            {/* Projects section */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <span>📂</span> ผลงานเด่น (Featured Projects)
              </h2>
              <div className="space-y-3.5">
                {portfolio.projects.length > 0 ? (
                  portfolio.projects.map((proj) => (
                    <div key={proj.id} className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 hover:bg-white hover:border-slate-300 transition">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">{proj.title}</h3>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">{proj.description}</p>
                        </div>
                        {proj.githubUrl && (
                          <a
                            href={proj.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 rounded-full border border-slate-300 bg-white hover:bg-slate-100 text-xs font-bold text-slate-800 transition shrink-0 shadow-sm"
                          >
                            GitHub ↗
                          </a>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-xs text-center py-4">ไม่มีผลงานโปรเจกต์</p>
                )}
              </div>
            </div>

          </div>

          {/* Right Sidebar: Certificates (1 col) */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <span>🏆</span> ใบรับรอง (Certifications)
              </h2>
              <div className="space-y-3">
                {portfolio.certificates.length > 0 ? (
                  portfolio.certificates.map((cert) => (
                    <div key={cert.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-xs font-bold text-slate-900">{cert.name}</h3>
                          <p className="text-[11px] text-slate-500">{cert.issuer}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            ออกเมื่อ: {new Date(cert.issueDate).toLocaleDateString("th-TH")}
                          </p>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 shrink-0">
                          ✓ Verified
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-xs text-center py-4">ไม่มีใบรับรอง</p>
                )}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
