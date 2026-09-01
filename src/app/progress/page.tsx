"use client";

import { useState } from "react";
import Link from "next/link";

export default function ProgressPage() {
  const [activeWeek, setActiveWeek] = useState<12 | 11>(12);

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-[85px] px-4 pb-16 text-slate-900 font-sans">
      <div className="max-w-[1120px] mx-auto space-y-6">
        
        {/* HEADER HERO */}
        <div className="bg-gradient-to-br from-[#002d62] via-[#0a4b9c] to-[#0284c7] text-white rounded-2xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-extrabold border border-white/20">
              🛡️ การพัฒนาเว็บแอปพลิเคชันให้มีความมั่นคงปลอดภัย • รายงานความก้าวหน้า
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 px-2.5 py-0.5 rounded-full">
                {activeWeek === 12 ? "Week 12 • 95% Completed" : "Week 11 • 85% Completed"}
              </span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
            Student Portfolio & Skill Passport
          </h1>
          <p className="text-sm text-slate-200 font-medium max-w-3xl">
            ระบบแฟ้มสะสมผลงานดิจิทัลและเครือข่ายวิชาชีพนักศึกษา มหาวิทยาลัยสวนดุสิต (กลุ่มที่ 3)
          </p>

          {/* TAB SWITCHER */}
          <div className="mt-6 pt-4 border-t border-white/20 flex flex-wrap items-center justify-between gap-4">
            <div className="flex bg-black/25 p-1 rounded-xl backdrop-blur-md border border-white/15">
              <button
                onClick={() => setActiveWeek(12)}
                className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${
                  activeWeek === 12
                    ? "bg-white text-[#002d62] shadow-md scale-100"
                    : "text-slate-200 hover:text-white"
                }`}
              >
                🌟 สัปดาห์ที่ 12 (ความคืบหน้าล่าสุด)
              </button>
              <button
                onClick={() => setActiveWeek(11)}
                className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${
                  activeWeek === 11
                    ? "bg-white text-[#002d62] shadow-md scale-100"
                    : "text-slate-200 hover:text-white"
                }`}
              >
                📋 สัปดาห์ที่ 11 (ย้อนหลัง)
              </button>
            </div>

            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              <a
                href="/PROGRESS_WEEK12.pdf"
                download="PROGRESS_WEEK12.pdf"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-white px-3.5 py-2 rounded-lg font-black transition shadow-sm"
              >
                <span>📄</span> ดาวน์โหลดรายงาน PDF
              </a>
              <a
                href={activeWeek === 12 ? "/progress_week12.html" : "/progress_week11.html"}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 px-3.5 py-2 rounded-lg font-black transition shadow-sm"
              >
                <span>📽️</span> เปิดสไลด์นำเสนอ Interactive
              </a>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* WEEK 12 CONTENT */}
        {/* ============================================================== */}
        {activeWeek === 12 && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* 1. TEAM MEMBERS & ROLES */}
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
                    <li>ออกแบบ Prisma Schema รองรับ Dual Engine (SQLite Local + PostgreSQL Cloud)</li>
                    <li>พัฒนาระบบ Digital Signature (SHA-256 Hashing) สำหรับตรวจสอบใบประกาศนียบัตร</li>
                    <li>ดูแลกลไก Data Masking ซ่อนข้อมูลส่วนบุคคล (GPA, Phone Number) ตามมาตรฐาน PDPA</li>
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
                        DevSecOps Pipeline & API
                      </span>
                    </div>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4 leading-relaxed">
                    <li>ติดตั้ง Automated SAST Pipeline ผ่าน GitHub Actions (<code className="text-[11px] bg-slate-200 px-1 rounded">sast-security.yml</code>)</li>
                    <li>พัฒนาระบบ Audit Logging บันทึกเหตุการณ์ความปลอดภัย (Security Event Logs) ลงฐานข้อมูล</li>
                    <li>จัดการ API Service และ Real Dataset Integration เชื่อมโยง GitHub REST API</li>
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
                        Frontend, UX/UI & Deployment
                      </span>
                    </div>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4 leading-relaxed">
                    <li>พัฒนาหน้าจอ Responsive UI: Student Feed, Teacher Portal, Employer Matching, SDU Diploma Modal</li>
                    <li>เตรียมความพร้อมและกำหนดค่า Production Deployment บน Cloud Hosting (Vercel & Supabase/Neon)</li>
                    <li>จัดทำชุดข้อมูลจริง (Real Dataset) ของนักศึกษา มสด. 7 บัญชี และเตรียมบทคลิปวิดีโอสาธิต</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 2. TOPIC 1: DATABASE (DB ?) */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <h2 className="text-lg font-black text-[#002d62] flex items-center gap-2">
                  <span>🗄️</span> 2. โครงสร้างฐานข้อมูล (Database Architecture — DB ?)
                </h2>
                <span className="text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-md">
                  Prisma ORM • Dual SQLite/PostgreSQL
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <h3 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                    <span>🔐</span> User, Auth & Roles
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    รองรับ Multi-Role RBAC (<code className="bg-slate-200 px-1 rounded">STUDENT</code>, <code className="bg-slate-200 px-1 rounded">TEACHER</code>, <code className="bg-slate-200 px-1 rounded">EMPLOYER</code>), ระบบ MFA (<code className="bg-slate-200 px-1 rounded">mfaEnabled</code>, <code className="bg-slate-200 px-1 rounded">mfaSecret</code>), และตาราง Account/Session สำหรับ NextAuth
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <h3 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                    <span>📜</span> Portfolio & Diplomas
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    โมเดล <code className="bg-slate-200 px-1 rounded">Portfolio</code> มีฟิลด์ Data Masking (GPA, Phone Number), โมเดล <code className="bg-slate-200 px-1 rounded">Certificate</code> จัดเก็บ SHA-256 Hash เพื่อสแกน QR Code ตรวจสอบความถูกต้อง
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <h3 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                    <span>📊</span> Skills, Courses & Feed
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    โมเดล <code className="bg-slate-200 px-1 rounded">Skill</code> (เกณฑ์รูบริกส์ + ลิงก์ตรวจผลงาน), โมเดล <code className="bg-slate-200 px-1 rounded">Course/Enrollment</code> (วิชาและการออกใบเซอร์), และ Social Feed สไตล์ LinkedIn
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-900 text-sky-300 font-mono text-[11px] rounded-xl overflow-x-auto">
                {"// Prisma Dual Database Configuration\n"}
                {"datasource db {\n"}
                {"  provider = \"sqlite\" // Production ready with @prisma/adapter-pg for PostgreSQL Cloud (Supabase/Neon)\n"}
                {"  url      = env(\"DATABASE_URL\")\n"}
                {"}"}
              </div>
            </div>

            {/* 3. TOPIC 2: TOOLS & TECH STACK (Tools ?) */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <h2 className="text-lg font-black text-[#002d62] flex items-center gap-2">
                  <span>🛠️</span> 3. เครื่องมือและเทคโนโลยีที่ใช้ (Tools & Tech Stack — Tools ?)
                </h2>
                <span className="text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1 rounded-md">
                  DevSecOps Architecture
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <span className="font-black text-blue-700 text-[13px]">⚡ Core & UI</span>
                  <ul className="text-slate-600 space-y-1 list-disc pl-4">
                    <li>Next.js 16 (App Router)</li>
                    <li>React 19 & TypeScript 5</li>
                    <li>Tailwind CSS v4</li>
                    <li>Prompt & Outfit Fonts</li>
                  </ul>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <span className="font-black text-emerald-700 text-[13px]">🗄️ Database & ORM</span>
                  <ul className="text-slate-600 space-y-1 list-disc pl-4">
                    <li>Prisma ORM 5/7</li>
                    <li>Parameterized Queries</li>
                    <li>SQLite (Dev)</li>
                    <li>PostgreSQL (Cloud)</li>
                  </ul>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <span className="font-black text-amber-700 text-[13px]">🔐 Security & Auth</span>
                  <ul className="text-slate-600 space-y-1 list-disc pl-4">
                    <li>NextAuth.js 4 (JWT)</li>
                    <li>Server-side RBAC Guards</li>
                    <li>Node Crypto SHA-256</li>
                    <li>PDPA Data Masking</li>
                  </ul>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <span className="font-black text-purple-700 text-[13px]">🔍 DevSecOps & SAST</span>
                  <ul className="text-slate-600 space-y-1 list-disc pl-4">
                    <li>GitHub Actions Pipeline</li>
                    <li>Semgrep SAST Engine</li>
                    <li>ESLint 9 Security Rules</li>
                    <li>npm audit Vulnerability</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 4. TOPIC 3: REAL DATASET (Insert Real Data Set) */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <h2 className="text-lg font-black text-[#002d62] flex items-center gap-2">
                  <span>📂</span> 4. การนำเข้าชุดข้อมูลจริง (Real Data Set — 7 นักศึกษา มสด.)
                </h2>
                <span className="text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-md">
                  7 Authentic Seeded Accounts
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <strong className="text-slate-900 block font-bold">1. สมชาย ยอดนักโค้ด</strong>
                  <span className="text-[11px] text-emerald-700 font-semibold">Full-Stack Developer</span>
                  <p className="text-slate-500 mt-1">Skills: Next.js, Node.js, Docker, PostgreSQL</p>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <strong className="text-slate-900 block font-bold">2. สายฟ้า แฮกเกอร์</strong>
                  <span className="text-[11px] text-amber-700 font-semibold">Cybersecurity & Pentest</span>
                  <p className="text-slate-500 mt-1">Certs: CEH, CompTIA Security+</p>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <strong className="text-slate-900 block font-bold">3. เจนจิรา ดีไซเนอร์</strong>
                  <span className="text-[11px] text-purple-700 font-semibold">UI/UX & Frontend Lead</span>
                  <p className="text-slate-500 mt-1">Skills: Figma UI, Tailwind CSS, Next.js</p>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <strong className="text-slate-900 block font-bold">4. กานต์พิชชา ดาต้าไซน์</strong>
                  <span className="text-[11px] text-sky-700 font-semibold">Data Science & AI</span>
                  <p className="text-slate-500 mt-1">Skills: Python, PyTorch, SQL Data Modeling</p>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <strong className="text-slate-900 block font-bold">5. ธีรเดช คลาวด์เดฟ</strong>
                  <span className="text-[11px] text-indigo-700 font-semibold">Cloud DevOps Engineer</span>
                  <p className="text-slate-500 mt-1">Skills: AWS Cloud, Docker, CI/CD Pipeline</p>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <strong className="text-slate-900 block font-bold">6-7. ปิยวัฒน์ & บัญชีทดสอบ</strong>
                  <span className="text-[11px] text-blue-700 font-semibold">QA & Student Test</span>
                  <p className="text-slate-500 mt-1">Skills: Cypress, Jest, SDU Diploma, CCNA</p>
                </div>
              </div>
            </div>

            {/* 5. TOPIC 4: CLOUD DEPLOYMENT (Deploy on Host, Cloud) */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <h2 className="text-lg font-black text-[#002d62] flex items-center gap-2">
                  <span>☁️</span> 5. การขึ้นระบบบนโฮสต์และคลาวด์ (Host & Cloud Deployment)
                </h2>
                <span className="text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-md">
                  Vercel + Supabase/Neon PostgreSQL
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                  <h3 className="font-bold text-slate-900 text-sm">สถาปัตยกรรม Cloud Production</h3>
                  <ul className="text-slate-600 space-y-1.5 list-disc pl-4 leading-relaxed">
                    <li><strong>Hosting Platform:</strong> Vercel (Edge Serverless Runtime รองรับ Next.js 16 เต็มรูปแบบ)</li>
                    <li><strong>Cloud Database:</strong> Supabase PostgreSQL หรือ Neon Serverless Postgres พร้อม Connection Pooling</li>
                    <li><strong>Automated CI/CD:</strong> ทำงานร่วมกับ GitHub เมื่อ Push โค้ดเข้า <code className="bg-slate-200 px-1 rounded">main</code> จะทำการ Build & Deploy อัตโนมัติ</li>
                  </ul>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                  <h3 className="font-bold text-slate-900 text-sm">การตั้งค่า Environment Variables ปลอดภัย</h3>
                  <ul className="text-slate-600 space-y-1.5 list-disc pl-4 leading-relaxed">
                    <li><code className="bg-slate-200 px-1 rounded">DATABASE_URL</code>: PostgreSQL connection string จาก Cloud Provider</li>
                    <li><code className="bg-slate-200 px-1 rounded">NEXTAUTH_SECRET</code>: กุญแจเข้ารหัสลับ 32+ ตัวอักษรสำหรับ Session Cookie</li>
                    <li><code className="bg-slate-200 px-1 rounded">NEXTAUTH_URL</code>: Domain Name หลักของระบบ (HTTPS)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 6. TOPIC 5: FOLLOW PROGRESS WEEK 11 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <h2 className="text-lg font-black text-[#002d62] flex items-center gap-2">
                  <span>🔄</span> 6. การติดตามความก้าวหน้าจากสัปดาห์ที่ 11 สู่สัปดาห์ที่ 12
                </h2>
                <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  ความก้าวหน้า 85% ➔ 95%
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 border-b border-slate-200">
                      <th className="p-3 font-extrabold">เป้าหมายงานจาก Week 11</th>
                      <th className="p-3 font-extrabold">สถานะใน Week 12</th>
                      <th className="p-3 font-extrabold">ผลลัพธ์และการพัฒนา</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-3 font-bold text-slate-900">1. ติดตั้ง Automated SAST</td>
                      <td className="p-3"><span className="text-emerald-700 font-extrabold bg-emerald-50 px-2 py-0.5 rounded">✓ เสร็จสมบูรณ์ 100%</span></td>
                      <td className="p-3 text-slate-600">สร้าง GitHub Actions Pipeline (<code className="bg-slate-100 px-1 rounded">sast-security.yml</code>) สแกน Semgrep และ ESLint อัตโนมัติ</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">2. Security Hardening & Session</td>
                      <td className="p-3"><span className="text-emerald-700 font-extrabold bg-emerald-50 px-2 py-0.5 rounded">✓ เสร็จสมบูรณ์ 100%</span></td>
                      <td className="p-3 text-slate-600">ตั้งค่า Cookie HttpOnly, Server-side Guards และ Data Masking ข้อมูลอ่อนไหว</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">3. Real Dataset & Cloud Ready</td>
                      <td className="p-3"><span className="text-emerald-700 font-extrabold bg-emerald-50 px-2 py-0.5 rounded">✓ เสร็จสมบูรณ์ 95%</span></td>
                      <td className="p-3 text-slate-600">นำเข้าข้อมูลนักศึกษา มสด. 7 บัญชี และคอนฟิก Prisma รองรับ Cloud PostgreSQL</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 7. TOPIC 6: VIDEO CLIP SCRIPT (Send Clip) */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <h2 className="text-lg font-black text-[#002d62] flex items-center gap-2">
                  <span>🎥</span> 7. บทและโครงสร้างการอัดคลิปวิดีโอสาธิตระบบ (Send Clip)
                </h2>
                <span className="text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-md">
                  ความยาวคลิป 3 - 5 นาที
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                  <h3 className="font-bold text-slate-900 text-sm">⏱️ ลำดับการพูดในคลิป (Demo Flow)</h3>
                  <ul className="text-slate-600 space-y-1.5 list-disc pl-4 leading-relaxed">
                    <li><strong>0:00 - 0:45:</strong> แนะนำตัวกลุ่ม 3 และภาพรวมระบบ Skill Passport</li>
                    <li><strong>0:45 - 1:30:</strong> อธิบายสถาปัตยกรรม DB (Prisma Schema) & Tech Stack</li>
                    <li><strong>1:30 - 2:30:</strong> สาธิตข้อมูลนักศึกษาจริง 7 บัญชี และฟีเจอร์ Data Masking</li>
                    <li><strong>2:30 - 3:45:</strong> สาธิตการออกใบเซอร์อาจารย์ และการตรวจ QR ด้วย SHA-256</li>
                    <li><strong>3:45 - 4:30:</strong> แสดง GitHub Actions SAST Workflow และสรุปความพร้อมสู่ Cloud</li>
                  </ul>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                  <h3 className="font-bold text-slate-900 text-sm">🎯 จุดเด่นที่ต้องไฮไลท์ในคลิป</h3>
                  <ul className="text-slate-600 space-y-1.5 list-disc pl-4 leading-relaxed">
                    <li><strong>Multi-Role RBAC:</strong> การแยกสิทธิ์ Student / Teacher / Employer</li>
                    <li><strong>Data Integrity:</strong> การใช้ SHA-256 Hash ป้องกันการปลอมแปลงใบประกาศ</li>
                    <li><strong>DevSecOps Standard:</strong> การตรวจ SAST อัตโนมัติใน CI/CD Pipeline</li>
                    <li><strong>PDPA Privacy:</strong> การปกป้องข้อมูลส่วนบุคคลของนักศึกษาด้วย Data Masking</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* WEEK 11 CONTENT (HISTORICAL ARCHIVE) */}
        {/* ============================================================== */}
        {activeWeek === 11 && (
          <div className="space-y-6 animate-fadeIn">
            {/* OVERALL PROGRESS WEEK 11 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-[#002d62] flex items-center gap-2">
                    <span>📈</span> สถานะความสำเร็จสัปดาห์ที่ 11
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">บันทึกประวัติความคืบหน้าเดิม ณ สัปดาห์ที่ 11</p>
                </div>
                <span className="text-3xl font-black text-emerald-600 font-sans">85%</span>
              </div>

              <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="w-[85%] h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"></div>
              </div>
            </div>

            {/* TASK STATUS WEEK 11 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-black text-[#002d62] flex items-center gap-2 border-b border-slate-100 pb-3">
                <span>📊</span> รายละเอียดความคืบหน้าสัปดาห์ที่ 11
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 space-y-2.5">
                  <h3 className="text-sm font-black text-emerald-900 flex items-center gap-1.5">
                    <span>✅</span> ส่วนหลักที่พัฒนาเสร็จแล้ว (85%)
                  </h3>
                  <ul className="text-xs text-emerald-950 space-y-2 leading-relaxed">
                    <li><strong>🔐 1. Authentication:</strong> Login/Logout และ Session Management</li>
                    <li><strong>🛡️ 2. RBAC:</strong> Student, Teacher, Employer Role Separation</li>
                    <li><strong>🗄️ 3. Database:</strong> เชื่อมต่อ SQLite ผ่าน Prisma ORM</li>
                    <li><strong>📜 4. Digital Certificate:</strong> SHA-256 Cryptographic Hash</li>
                    <li><strong>🚫 5. Route Protection:</strong> Server-Side Session Guarding</li>
                  </ul>
                </div>

                <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 space-y-2.5">
                  <h3 className="text-sm font-black text-amber-900 flex items-center gap-1.5">
                    <span>🔄</span> งานที่กำลังทำในสัปดาห์ที่ 11
                  </h3>
                  <ul className="text-xs text-amber-950 space-y-2 leading-relaxed">
                    <li><strong>🔍 Automated SAST:</strong> เตรียมติดตั้ง Static Security Testing</li>
                    <li><strong>🛡️ Security Hardening:</strong> ปรับปรุง Session และ Header</li>
                  </ul>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
                  <h3 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                    <span>⏳</span> งานที่วางแผนไว้
                  </h3>
                  <ul className="text-xs text-slate-700 space-y-2 leading-relaxed">
                    <li><strong>☁️ Production Deployment:</strong> นำระบบขึ้น Cloud Server</li>
                    <li><strong>🧪 Final Testing:</strong> ประเมินความปลอดภัยรอบสุดท้าย</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

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
