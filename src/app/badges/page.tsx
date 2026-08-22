import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function BadgesPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  // Fetch student portfolio stats
  let portfolio = await prisma.portfolio.findUnique({
    where: { userId: session.user.id as string },
    include: { skills: true, projects: true, certificates: true },
  });

  const skillsCount = portfolio?.skills.length || 0;
  const projectsCount = portfolio?.projects.length || 0;
  const certsCount = portfolio?.certificates.length || 0;
  const verifiedSkillsCount = portfolio?.skills.filter((s) => s.isVerified).length || 0;

  // Badge unlock conditions
  const badgesList = [
    {
      id: "first_project",
      name: "ผู้สร้างสรรค์โครงการ (Project Creator)",
      description: "ลงทะเบียนโครงการในพาสปอร์ตอย่างน้อย 1 รายการ",
      icon: "🚀",
      unlocked: projectsCount >= 1,
      progress: Math.min(projectsCount, 1),
      target: 1,
      style: "from-blue-500 to-indigo-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]",
    },
    {
      id: "multi_skill",
      name: "นักพัฒนาสารพัดประโยชน์ (Multi-Skilled)",
      description: "บันทึกทักษะหลักของคุณมากกว่า 4 ทักษะในระบบ",
      icon: "🛡️",
      unlocked: skillsCount >= 4,
      progress: Math.min(skillsCount, 4),
      target: 4,
      style: "from-purple-500 to-pink-500 shadow-[0_0_20px_rgba(168,85,247,0.3)]",
    },
    {
      id: "verified_pro",
      name: "ดาวเด่นระดับการศึกษา (Verified Scholar)",
      description: "มีทักษะความสามารถหลักที่อาจารย์เซ็นยืนยันรับรองคุณภาพ",
      icon: "⭐",
      unlocked: verifiedSkillsCount >= 1,
      progress: Math.min(verifiedSkillsCount, 1),
      target: 1,
      style: "from-yellow-400 to-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)]",
    },
    {
      id: "cert_master",
      name: "ผู้เชี่ยวชาญรับรอง (Certificate Master)",
      description: "อัปโหลดใบรับรองทักษะวิชาการ/วิชาชีพอย่างน้อย 1 รายการ",
      icon: "📜",
      unlocked: certsCount >= 1,
      progress: Math.min(certsCount, 1),
      target: 1,
      style: "from-green-400 to-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]",
    },
    {
      id: "super_builder",
      name: "นักพัฒนาเต็มขั้น (Elite Builder)",
      description: "สร้างโครงการในระบบ 3 รายการขึ้นไป",
      icon: "🔥",
      unlocked: projectsCount >= 3,
      progress: Math.min(projectsCount, 3),
      target: 3,
      style: "from-orange-500 to-red-600 shadow-[0_0_20px_rgba(249,115,22,0.3)]",
    },
    {
      id: "audit_secure",
      name: "ใบเบิกทางปลอดภัย (Secure Passport)",
      description: "เปิดใช้งานสิทธิ์พอร์ตโฟลิโอและบันทึกประวัติการพัฒนาเรียบร้อย",
      icon: "🔒",
      unlocked: true, // Auto unlocked for setup
      progress: 1,
      target: 1,
      style: "from-cyan-400 to-blue-600 shadow-[0_0_20px_rgba(6,182,212,0.3)]",
    },
  ];

  const unlockedCount = badgesList.filter((b) => b.unlocked).length;

  return (
    <div className="min-h-screen pt-24 px-4 pb-12">
      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        
        {/* Header section with cumulative stats */}
        <div className="glass rounded-3xl p-8 border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              เหรียญเกียรติยศและตราสัญลักษณ์
            </h1>
            <p className="text-gray-400 mt-2">
              ตราสัญลักษณ์ความสำเร็จดิจิทัล ปลดล็อกตามระดับความรู้ โครงการ และใบรับรองที่สะสมไว้
            </p>
          </div>
          
          <div className="bg-black/20 px-6 py-4 rounded-2xl border border-white/5 text-center">
            <p className="text-sm text-gray-400 font-semibold mb-1">เหรียญตราที่ปลดล็อกแล้ว</p>
            <p className="text-3xl font-black text-white">
              <span className="text-purple-400">{unlockedCount}</span> / {badgesList.length}
            </p>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {badgesList.map((badge) => (
            <div 
              key={badge.id} 
              className={`glass rounded-3xl p-6 border-white/10 flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
                badge.unlocked 
                  ? "hover:border-purple-500/50" 
                  : "opacity-60 grayscale hover:opacity-85 hover:grayscale-50"
              }`}
            >
              {/* Decorative backglow on hover for unlocked badge */}
              {badge.unlocked && (
                <div className="absolute -top-12 -right-12 w-28 h-28 bg-gradient-to-br from-white/5 to-white/0 rounded-full blur-[40px] pointer-events-none"></div>
              )}

              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  {/* Badge Icon Circular wrapper */}
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${
                    badge.unlocked ? badge.style : "from-white/5 to-white/10 border border-white/10"
                  } flex items-center justify-center text-3xl transform hover:scale-110 transition duration-300`}>
                    {badge.icon}
                  </div>
                  
                  {badge.unlocked ? (
                    <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 border border-green-500/30 text-[10px] font-bold uppercase tracking-wider">
                      Unlocked
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-white/5 text-gray-500 border border-white/10 text-[10px] font-bold uppercase tracking-wider">
                      Locked
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-white font-bold text-lg leading-tight">{badge.name}</h3>
                  <p className="text-gray-400 text-xs mt-2 leading-relaxed">{badge.description}</p>
                </div>
              </div>

              {/* Progress Bar for the Badge */}
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-[10px] text-gray-500 font-semibold uppercase">
                  <span>ความสำเร็จ</span>
                  <span>{badge.progress} / {badge.target}</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className={`h-full rounded-full bg-gradient-to-r ${
                      badge.unlocked ? "from-blue-400 to-purple-500" : "from-gray-600 to-gray-500"
                    }`}
                    style={{ width: `${(badge.progress / badge.target) * 100}%` }}
                  ></div>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
