import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ResumeClientPage from "./ResumeClientPage";

export default async function ResumePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  // Fetch full student portfolio
  const portfolio = await prisma.portfolio.findUnique({
    where: { userId: session.user.id as string },
    include: {
      user: true,
      skills: true,
      projects: true,
      certificates: true,
    },
  });

  if (!portfolio) {
    redirect("/dashboard");
  }

  // Pass to client component for the print button logic
  return (
    <div className="min-h-screen pt-24 px-4 pb-12 print:pt-0 print:pb-0 print:px-0">
      <div className="max-w-4xl mx-auto space-y-6 relative z-10 print:space-y-0 print:max-w-full">
        
        {/* Actions header (Hidden when printing) */}
        <div className="glass rounded-3xl p-6 border-white/10 flex justify-between items-center print:hidden">
          <div>
            <h1 className="text-2xl font-bold text-white">ส่งออก Resume ดิจิทัล</h1>
            <p className="text-gray-400 text-xs mt-1">พิมพ์ใบประวัติย่อแบบจัดรูปแบบมาตรฐาน (ขนาด A4) หรือบันทึกเป็นไฟล์ PDF</p>
          </div>
          
          <ResumeClientPage />
        </div>

        {/* Print Layout Sheet */}
        <div className="bg-white text-slate-800 p-8 sm:p-12 rounded-3xl shadow-2xl border border-white/10 max-w-4xl mx-auto font-sans print:rounded-none print:shadow-none print:border-none print:p-4 print:bg-white print:text-black">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 pb-8 border-b-2 border-slate-200">
            <div>
              <h2 className="text-3xl font-black text-slate-900">{portfolio.user.name}</h2>
              <p className="text-slate-500 font-medium text-sm mt-1">นักศึกษาสาขาเทคโนโลยีสารสนเทศ • นักพัฒนาเว็บแอปพลิเคชัน</p>
              <p className="text-slate-600 text-sm mt-3 leading-relaxed max-w-xl italic">
                "{portfolio.bio || "ไม่มีคำแนะนำตัวปัจจุบัน"}"
              </p>
            </div>
            
            <div className="text-left sm:text-right text-xs text-slate-600 space-y-1.5 min-w-[200px] border-l-2 sm:border-l-0 sm:border-r-0 border-slate-200 pl-4 sm:pl-0">
              <p><span className="font-bold">Email:</span> {portfolio.user.email}</p>
              <p><span className="font-bold">GPA:</span> {portfolio.gpa?.toFixed(2) || "ไม่ได้ระบุ"}</p>
              <p><span className="font-bold">Tel:</span> {portfolio.phoneNumber || "ไม่ได้ระบุ"}</p>
              <p><span className="font-bold">Skill Passport:</span> Verified ✓</p>
            </div>
          </div>

          {/* Main Body Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 print:grid-cols-3">
            
            {/* Left Column (Skills & Certs) */}
            <div className="md:col-span-1 space-y-6">
              <div>
                <h3 className="text-xs uppercase tracking-wider text-slate-400 font-bold border-b border-slate-200 pb-2 mb-3">
                  Technical Skills
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {portfolio.skills.filter(s => s.category === "Tech").map(skill => (
                    <span key={skill.id} className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-md text-xs font-semibold">
                      {skill.name} {skill.isVerified ? "✓" : ""}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs uppercase tracking-wider text-slate-400 font-bold border-b border-slate-200 pb-2 mb-3">
                  Soft Skills
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {portfolio.skills.filter(s => s.category === "Soft").map(skill => (
                    <span key={skill.id} className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-md text-xs font-semibold">
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs uppercase tracking-wider text-slate-400 font-bold border-b border-slate-200 pb-2 mb-3">
                  Certificates
                </h3>
                <div className="space-y-3">
                  {portfolio.certificates.map(cert => (
                    <div key={cert.id} className="text-xs">
                      <p className="font-bold text-slate-800">{cert.name}</p>
                      <p className="text-slate-500">{cert.issuer} • {new Date(cert.issueDate).toLocaleDateString()}</p>
                      <p className="text-[10px] text-slate-400 font-mono select-none">ID: {cert.hashValue.substring(0, 16)}...</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column (Projects) */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <h3 className="text-xs uppercase tracking-wider text-slate-400 font-bold border-b border-slate-200 pb-2 mb-4">
                  Highlighted Projects
                </h3>
                
                <div className="space-y-6">
                  {portfolio.projects.length > 0 ? (
                    portfolio.projects.map(project => (
                      <div key={project.id} className="space-y-1">
                        <div className="flex justify-between items-baseline">
                          <h4 className="font-bold text-slate-900 text-sm">{project.title}</h4>
                          {project.githubUrl && (
                            <span className="text-[10px] text-slate-400 font-mono print:inline hidden">
                              {project.githubUrl}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed pt-1">
                          {project.description}
                        </p>
                        {project.githubUrl && (
                          <a 
                            href={project.githubUrl} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="inline-block text-xs text-indigo-600 hover:underline pt-1 print:hidden"
                          >
                            GitHub Repository ↗
                          </a>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400">ยังไม่มีการเพิ่มโครงการ</p>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 text-[10px] text-slate-400 leading-relaxed">
                <p>ใบประวัติย่อดิจิทัล (Digital Resume) นี้ สร้างขึ้นโดยใช้ข้อมูลยืนยันความสามารถจากระบบ **SkillPassport Registry** ข้อมูลทักษะและใบรับรองที่มีเครื่องหมาย (✓) ได้รับการตรวจสอบและลงนามดิจิทัลโดยสถาบันแล้ว</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
