"use client";

import Link from "next/link";

export default function ProgressPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] pt-[85px] px-4 pb-16 text-slate-900">
      <div className="max-w-[1080px] mx-auto space-y-6">
        
        {/* HEADER HERO */}
        <div className="bg-gradient-to-br from-[#002d62] via-[#0a4b9c] to-[#0284c7] text-white rounded-2xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-extrabold border border-white/20 mb-3">
            🛡️ รายวิชา การพัฒนาเว็บแอปพลิเคชันให้มีความมั่นคงปลอดภัย • สัปดาห์ที่ 11
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
            Student Portfolio & Skill Passport
          </h1>
          <p className="text-sm text-slate-200 font-medium max-w-3xl">
            ระบบแฟ้มสะสมผลงานดิจิทัลและเครือข่ายวิชาชีพนักศึกษา มหาวิทยาลัยสวนดุสิต (กลุ่มที่ 3)
          </p>

          <div className="mt-5 pt-4 border-t border-white/20 flex flex-wrap gap-4 text-xs font-semibold text-slate-100">
            <div className="flex items-center gap-1.5">
              <span>👥</span> กลุ่มที่: <strong>3 (Student Portfolio & Skill Passport)</strong>
            </div>
            <div className="flex items-center gap-1.5">
              <span>🎓</span> สถาบัน: <strong>มหาวิทยาลัยสวนดุสิต (SDU)</strong>
            </div>
            <div className="flex items-center gap-1.5">
              <span>🔗</span> Git Repo: <a href="https://github.com/Taeaps561/student-portfolio" target="_blank" rel="noreferrer" className="underline hover:text-white">github.com/Taeaps561/student-portfolio</a>
            </div>
          </div>
        </div>

        {/* 1. TEAM MEMBERS */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-black text-[#002d62] flex items-center gap-2 border-b border-slate-100 pb-3">
            <span>👥</span> 1. ข้อมูลโครงงานและรายชื่อสมาชิก (3 คน)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Member 1 */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#002d62] text-white flex items-center justify-center font-black text-sm shrink-0">
                  010
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">นายอภิสิทธิ์ ศรีพัฒน์</h3>
                  <span className="inline-block text-[11px] font-extrabold bg-blue-100 text-[#0369a1] px-2 py-0.5 rounded-md mt-0.5">
                    Backend, Database & Security
                  </span>
                </div>
              </div>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4 leading-relaxed">
                <li>พัฒนาระบบ Authentication & Multi-Role Registration (NextAuth.js, Credentials + Session Guards)</li>
                <li>ออกแบบ Prisma Schema & SQLite/PostgreSQL Database (User, Portfolio, Project, Certificate, AuditLog, Skill)</li>
                <li>พัฒนาระบบ Data Masking (ปิดบัง GPA / ข้อมูลสำคัญ) และ Cryptographic Digital Signature (SHA-256 Hashing)</li>
              </ul>
            </div>

            {/* Member 2 */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#059669] text-white flex items-center justify-center font-black text-sm shrink-0">
                  008
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">นายปภังกร ทองเจริญ</h3>
                  <span className="inline-block text-[11px] font-extrabold bg-emerald-100 text-[#15803d] px-2 py-0.5 rounded-md mt-0.5">
                    GitHub Integration & API
                  </span>
                </div>
              </div>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4 leading-relaxed">
                <li>พัฒนา Backend Service เชื่อมต่อ GitHub REST API (<code className="text-[11px] bg-slate-200 px-1 rounded">/api/github</code>) ดึง Repos, ภาษา และประวัติ Commit</li>
                <li>พัฒนาระบบ Audit Logging บันทึกเหตุการณ์ความปลอดภัย (Security Event Logs) ลงฐานข้อมูล</li>
                <li>จัดการ API Endpoints สำหรับระบบโพสต์ฟีด (<code className="text-[11px] bg-slate-200 px-1 rounded">/api/posts</code>), ทักษะ และใบรับรอง</li>
              </ul>
            </div>

            {/* Member 3 */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#0284c7] text-white flex items-center justify-center font-black text-sm shrink-0">
                  009
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">นายปวีณวัชร์ เหลืองอุทัย</h3>
                  <span className="inline-block text-[11px] font-extrabold bg-sky-100 text-[#0369a1] px-2 py-0.5 rounded-md mt-0.5">
                    Frontend, UX/UI & QA Lead
                  </span>
                </div>
              </div>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4 leading-relaxed">
                <li>พัฒนาหน้าจอ Responsive UI: หน้าแรกฟีด (<code className="text-[11px] bg-slate-200 px-1 rounded">/feed</code>), ศูนย์อาจารย์ (<code className="text-[11px] bg-slate-200 px-1 rounded">/teacher</code>), และสรรหาบุคลากร (<code className="text-[11px] bg-slate-200 px-1 rounded">/employer/jobs</code>)</li>
                <li>ออกแบบพรีวิวใบประกาศนียบัตรดิจิทัล มหาวิทยาลัยสวนดุสิต (Printable SDU Diploma Modal)</li>
                <li>ดูแล Flow การใช้งานโดยรวม และทำ System Testing ตรวจสอบสิทธิ์การเข้าถึงตามหลัก DevSecOps</li>
              </ul>
            </div>

          </div>
        </div>

        {/* 2. OVERALL PROGRESS */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-[#002d62] flex items-center gap-2">
                <span>📈</span> 2. เปอร์เซ็นต์ความสำเร็จโดยรวม (Overall Progress)
              </h2>
              <p className="text-xs text-slate-500 font-medium">คำนวณจากสถานะงาน Backend, Security, UI และ Database</p>
            </div>
            <span className="text-3xl font-black text-emerald-600 font-sans">85%</span>
          </div>

          <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="w-[85%] h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-1000"></div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs font-bold">
              <span>⚙️ Backend & Database</span>
              <span className="text-emerald-600">90%</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs font-bold">
              <span>🛡️ Auth & DevSecOps</span>
              <span className="text-emerald-600">90%</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs font-bold">
              <span>📜 Core CRUD & Certs</span>
              <span className="text-emerald-600">90%</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs font-bold">
              <span>🚀 Advanced (AI / CI-CD)</span>
              <span className="text-amber-600">50%</span>
            </div>
          </div>
        </div>

        {/* 3. TASK STATUS */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-black text-[#002d62] flex items-center gap-2 border-b border-slate-100 pb-3">
            <span>📊</span> 3. สถานะความคืบหน้าของงาน (Task Progress)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 space-y-2.5">
              <h3 className="text-sm font-black text-emerald-900 flex items-center gap-1.5">
                <span>✅</span> ส่วนหลักที่พัฒนาเสร็จแล้ว (5 ข้อ)
              </h3>
              <ul className="text-xs text-emerald-950 space-y-2 leading-relaxed">
                <li><strong>🔐 1. Authentication:</strong> ระบบสามารถ Login และ Logout ได้ รวมถึงมีการจัดการ Session ของผู้ใช้งาน</li>
                <li><strong>🛡️ 2. RBAC:</strong> ระบบแบ่งสิทธิ์ออกเป็น Student, Teacher และ Employer และแต่ละ Role สามารถเข้าถึง Feature ที่แตกต่างกัน</li>
                <li><strong>🗄️ 3. Database:</strong> ระบบมี Backend เชื่อมต่อกับ SQLite ผ่าน Prisma และสามารถอ่านและเขียนข้อมูลจริงได้</li>
                <li><strong>📜 4. Digital Certificate:</strong> ระบบสามารถออก Certificate และสร้าง SHA-256 Hash สำหรับใช้ตรวจสอบความถูกต้องของข้อมูล</li>
                <li><strong>🚫 5. Route Protection:</strong> ระบบมีการป้องกัน Route ที่ต้อง Login และตรวจสอบ Role ก่อนอนุญาตให้เข้าถึง Resource ที่สำคัญ</li>
              </ul>
            </div>

            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 space-y-2.5">
              <h3 className="text-sm font-black text-amber-900 flex items-center gap-1.5">
                <span>🔄</span> แผนงานสัปดาห์ที่ 12
              </h3>
              <ul className="text-xs text-amber-950 space-y-2 leading-relaxed">
                <li><strong>🔍 Automated SAST:</strong> ติดตั้ง Static Application Security Testing เพื่อตรวจสอบ Source Code และค้นหาประเด็น Security อัตโนมัติ</li>
                <li><strong>🛡️ Security Hardening:</strong> ปรับแต่ง Security Headers และตรวจสอบสิทธิ์การเข้าถึงข้อมูล</li>
              </ul>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
              <h3 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                <span>⏳</span> แผนงานสัปดาห์ที่ 13
              </h3>
              <ul className="text-xs text-slate-700 space-y-2 leading-relaxed">
                <li><strong>☁️ Production Deployment:</strong> เตรียมระบบสำหรับ Production Deployment ขึ้น Cloud</li>
                <li><strong>🧪 Final System Testing:</strong> ทดสอบระบบความปลอดภัยอีกครั้งก่อนส่งมอบ</li>
              </ul>
            </div>

          </div>
        </div>

        {/* 4. ISSUES & RESOLUTIONS */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-black text-[#002d62] flex items-center gap-2 border-b border-slate-100 pb-3">
            <span>⚠️</span> 4. ปัญหาที่พบและแนวทางแก้ไข (Issues & Resolutions)
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 border-b-2 border-slate-200">
                  <th className="p-3 font-extrabold w-[30%]">ปัญหาที่พบ (Issue)</th>
                  <th className="p-3 font-extrabold w-[30%]">สาเหตุ (Root Cause)</th>
                  <th className="p-3 font-extrabold w-[40%]">แนวทางแก้ไข (Resolution)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-3 font-bold text-slate-900">
                    1. การเปิด URL ข้ามสิทธิ์<br />
                    <span className="text-[11px] text-slate-500 font-normal">ผู้ใช้สามารถพิมพ์ URL เข้าหน้า Dashboard หรือหน้าอาจารย์ได้โดยตรง</span>
                  </td>
                  <td className="p-3 text-slate-600">การตรวจสอบสิทธิ์เดิมทำเพียงฝั่ง Client-side ผ่าน React State</td>
                  <td className="p-3 text-emerald-800 font-medium">
                    <strong className="text-emerald-700 font-bold">✓ เพิ่ม Server-side Validation:</strong> เช็ค <code className="text-[11px] bg-slate-100 px-1 rounded">session.user.role</code> ทุกครั้ง หากไม่มีสิทธิ์จะดีดกลับหน้า <code className="text-[11px] bg-slate-100 px-1 rounded">/login</code> ทันที
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-900">
                    2. ข้อมูล Mock ไม่สะท้อนบริบท<br />
                    <span className="text-[11px] text-slate-500 font-normal">ข้อมูลเริ่มต้นเป็น Placeholder ทั่วไป</span>
                  </td>
                  <td className="p-3 text-slate-600">ใช้ข้อมูลตั้งต้นที่ไม่เชื่อมโยงกับหลักสูตรคอมพิวเตอร์และความปลอดภัย</td>
                  <td className="p-3 text-emerald-800 font-medium">
                    <strong className="text-emerald-700 font-bold">✓ ปรับ Database Seeding:</strong> สร้างข้อมูลนักศึกษาจริง 7 คน พร้อมทักษะ CCNA, CEH ตรงตามบริบท มสด.
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-900">
                    3. ความเป็นส่วนตัวของข้อมูล (PDPA)<br />
                    <span className="text-[11px] text-slate-500 font-normal">การเปิดเผยเกรดเฉลี่ยหรือเบอร์โทรสู่สาธารณะ</span>
                  </td>
                  <td className="p-3 text-slate-600">ไม่มีกลไก Data Masking สำหรับบุคคลภายนอก</td>
                  <td className="p-3 text-emerald-800 font-medium">
                    <strong className="text-emerald-700 font-bold">✓ ทำ Data Masking:</strong> ซ่อนข้อมูลส่วนบุคคลที่อ่อนไหว และเปิดเผยเฉพาะบทบาทที่ได้รับอนุญาต
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. FUTURE ROADMAP */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-black text-[#002d62] flex items-center gap-2 border-b border-slate-100 pb-3">
            <span>🗓️</span> 5. แผนการพัฒนาในสัปดาห์ที่ 12–13 (Future Roadmap)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border-l-4 border-[#002d62] bg-slate-50 p-4 rounded-r-xl space-y-2">
              <h3 className="text-sm font-black text-[#002d62]">สัปดาห์ที่ 12: Security Testing (Automated SAST)</h3>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
                <li>ติดตั้ง Automated SAST (Static Application Security Testing) เพื่อตรวจสอบ Source Code และค้นหาประเด็นด้าน Security แบบอัตโนมัติก่อนนำระบบขึ้น Production</li>
                <li>ทำ Security Code Review และทดสอบการจัดการสิทธิ์ความปลอดภัย</li>
              </ul>
            </div>

            <div className="border-l-4 border-emerald-600 bg-slate-50 p-4 rounded-r-xl space-y-2">
              <h3 className="text-sm font-black text-emerald-800">สัปดาห์ที่ 13: Production Deployment & Final Testing</h3>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
                <li>เตรียมระบบสำหรับ Production Deployment (Vercel / Supabase Cloud)</li>
                <li>ทดสอบระบบความปลอดภัยและฟังก์ชันทั้งหมดอีกครั้งอย่างละเอียดก่อนส่งมอบ</li>
                <li>จัดทำเอกสารและคู่มือการส่งมอบโปรเจกต์ฉบับสมบูรณ์</li>
              </ul>
            </div>
          </div>
        </div>

        {/* QUICK NAVIGATION BUTTONS */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/feed"
            className="px-5 py-2.5 rounded-full bg-[#002d62] hover:bg-[#0a4b9c] text-white text-xs font-bold transition shadow-sm"
          >
            🚀 เปิดหน้าเว็บหลัก (Feed)
          </Link>
          <a
            href="http://localhost:5555"
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 rounded-full bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold transition shadow-sm"
          >
            🗄️ เปิดดูฐานข้อมูล Prisma Studio (localhost:5555)
          </a>
          <a
            href="https://github.com/Taeaps561/student-portfolio"
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 rounded-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-bold transition"
          >
            🐙 GitHub Repository
          </a>
        </div>

      </div>
    </div>
  );
}
