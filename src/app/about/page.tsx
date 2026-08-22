"use client";

import { useState } from "react";
import Link from "next/link";

export default function AboutPage() {
  const [activeRoleTab, setActiveRoleTab] = useState<"student" | "teacher" | "employer">("student");

  return (
    <div className="min-h-screen bg-[#f4f2ee] pt-[85px] px-4 pb-16">
      <div className="max-w-[1128px] mx-auto space-y-6">
        
        {/* HERO BANNER */}
        <div className="bg-white rounded-2xl p-8 sm:p-12 border border-slate-200 shadow-sm text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto shadow-xs p-1">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/e/ee/Logo_of_Suan_Dusit_University.svg?utm_source=th.wikipedia.org&utm_campaign=index&utm_content=original"
              alt="Suan Dusit University Logo"
              className="w-12 h-12 object-contain"
            />
          </div>
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold mb-2">
              🏛️ มหาวิทยาลัยสวนดุสิต (Suan Dusit University)
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              เกี่ยวกับระบบ SkillPassport & Professional Network
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-2xl mx-auto mt-2 leading-relaxed">
              แพลตฟอร์มแฟ้มสะสมผลงานดิจิทัลและการรับรองสมรรถนะทักษะวิชาชีพ เชื่อมโยงนักศึกษา อาจารย์ผู้ประเมิน และองค์กรพันธมิตรเพื่อสร้างโอกาสการทำงานอย่างแท้จริง
            </p>
          </div>
        </div>

        {/* 3 ROLES ECOSYSTEM (ROLE-BASED TABS) */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-lg sm:text-xl font-black text-slate-900">
              ระบบที่ออกแบบมาให้ตอบโจทย์ทุกบทบาท (Role Ecosystem)
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              เลือกดูฟังก์ชันและสิทธิประโยชน์ตามบทบาทของคุณ
            </p>
          </div>

          {/* Role Tab Buttons */}
          <div className="flex items-center justify-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
            <button
              onClick={() => setActiveRoleTab("student")}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                activeRoleTab === "student"
                  ? "bg-[#0a66c2] text-white shadow-sm"
                  : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              <span>🎓</span>
              <span>สำหรับนักศึกษา (Students)</span>
            </button>

            <button
              onClick={() => setActiveRoleTab("teacher")}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                activeRoleTab === "teacher"
                  ? "bg-[#c2410c] text-white shadow-sm"
                  : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              <span>👨‍🏫</span>
              <span>สำหรับอาจารย์ผู้ประเมิน (Faculty)</span>
            </button>

            <button
              onClick={() => setActiveRoleTab("employer")}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                activeRoleTab === "employer"
                  ? "bg-[#059669] text-white shadow-sm"
                  : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              <span>💼</span>
              <span>สำหรับผู้ประกอบการ (Employers)</span>
            </button>
          </div>

          {/* Role Tab Contents */}
          <div className="pt-2">
            
            {/* 1. STUDENT ROLE */}
            {activeRoleTab === "student" && (
              <div className="space-y-6 animate-in fade-in">
                <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-extrabold text-blue-900 flex items-center gap-2">
                      <span>🎓 บัญชีนักศึกษา: รวบรวมทักษะ ผลงาน และเชื่อมโยงโอกาสการทำงาน</span>
                    </h3>
                    <p className="text-xs text-blue-800 font-medium mt-1 leading-relaxed">
                      สร้างหนังสือเดินทางทักษะดิจิทัลที่น่าเชื่อถือ มีการรับรองจากอาจารย์สถาบัน และเปิดรับข้อเสนองานจากบริษัทพันธมิตร
                    </p>
                  </div>
                  <Link
                    href="/portfolio"
                    className="shrink-0 px-5 py-2 rounded-full bg-[#0a66c2] hover:bg-[#004182] text-white text-xs font-bold transition shadow-xs"
                  >
                    จัดการพอร์ตโฟลิโอ →
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="text-2xl">⚡</div>
                    <h4 className="text-xs font-extrabold text-slate-900">ทดสอบและรับรองทักษะดิจิทัล</h4>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      ทำแบบทดสอบวัดระดับสมรรถนะและส่งหลักฐานผลงาน (Proof of Work) ให้อาจารย์ประจำหลักสูตรตรวจรับรอง
                    </p>
                  </div>

                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="text-2xl">🐙</div>
                    <h4 className="text-xs font-extrabold text-slate-900">เชื่อมต่อ GitHub & Projects</h4>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      ดึงประวัติการพัฒนาโค้ดและโครงงานมาแสดงบนพอร์ตโฟลิโอสาธารณะได้อัตโนมัติ
                    </p>
                  </div>

                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="text-2xl">🎯</div>
                    <h4 className="text-xs font-extrabold text-slate-900">เปิดรับงาน (#OpenToWork)</h4>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      ส่งสัญญาณให้นายจ้างทราบว่าพร้อมรับงาน สหกิจศึกษา หรือฝึกงาน โดยซ่อนข้อมูลส่วนตัวที่ละเอียดอ่อน
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 2. TEACHER ROLE */}
            {activeRoleTab === "teacher" && (
              <div className="space-y-6 animate-in fade-in">
                <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-extrabold text-amber-900 flex items-center gap-2">
                      <span>👨‍🏫 บัญชีอาจารย์ผู้ประเมิน: ตรวจรับรองทักษะและออกวุฒิบัตรดิจิทัล</span>
                    </h3>
                    <p className="text-xs text-amber-800 font-medium mt-1 leading-relaxed">
                      ระบบตรวจประเมินผลงานนักศึกษาตามเกณฑ์มาตรฐาน (Rubrics) ออกใบรับรองสมรรถนะ และติดตามนักศึกษาในที่ปรึกษา
                    </p>
                  </div>
                  <Link
                    href="/teacher"
                    className="shrink-0 px-5 py-2 rounded-full bg-[#c2410c] hover:bg-[#9a3412] text-white text-xs font-bold transition shadow-xs"
                  >
                    เข้าสู่ระบบอาจารย์ →
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="text-2xl">📜</div>
                    <h4 className="text-xs font-extrabold text-slate-900">ตรวจรับรองทักษะ (Skill Verification)</h4>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      ตรวจสอบชิ้นงาน โค้ด และหลักฐานที่นักศึกษาส่งมา พร้อมประเมินเกณฑ์สมรรถนะ 4 มิติ
                    </p>
                  </div>

                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="text-2xl">🎓</div>
                    <h4 className="text-xs font-extrabold text-slate-900">ออกวุฒิบัตรดิจิทัลสถาบัน</h4>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      ออกหนังสือรับรองและตราสัญลักษณ์ดิจิทัลของมหาวิทยาลัยสวนดุสิต พร้อมลายมือชื่ออิเล็กทรอนิกส์
                    </p>
                  </div>

                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="text-2xl">👥</div>
                    <h4 className="text-xs font-extrabold text-slate-900">ดูแลนักศึกษาในที่ปรึกษา</h4>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      ติดตามความพร้อมของนักศึกษาก่อนออกไปสหกิจศึกษาและเชื่อมโยงกับสถานประกอบการ
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 3. EMPLOYER ROLE */}
            {activeRoleTab === "employer" && (
              <div className="space-y-6 animate-in fade-in">
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-extrabold text-emerald-900 flex items-center gap-2">
                      <span>💼 บัญชีผู้ประกอบการ: ค้นหาบุคลากรคุณภาพและประกาศตำแหน่งงาน</span>
                    </h3>
                    <p className="text-xs text-emerald-800 font-medium mt-1 leading-relaxed">
                      เข้าถึงฐานข้อมูลนักศึกษา มสด. ที่มีทักษะผ่านการรับรองจริงจากสถาบัน และระบบ AI Talent Matching
                    </p>
                  </div>
                  <Link
                    href="/employer"
                    className="shrink-0 px-5 py-2 rounded-full bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold transition shadow-xs"
                  >
                    พอร์ทัลผู้ประกอบการ →
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="text-2xl">🎯</div>
                    <h4 className="text-xs font-extrabold text-slate-900">AI Talent Matching</h4>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      ค้นหานักศึกษาที่มีทักษะตรงกับความต้องการของตำแหน่งงานได้อย่างแม่นยำ พร้อมระดับความพร้อม
                    </p>
                  </div>

                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="text-2xl">💼</div>
                    <h4 className="text-xs font-extrabold text-slate-900">ประกาศรับสมัครงาน & สหกิจ</h4>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      โพสต์ตำแหน่งงานว่าง โครงการฝึกงาน และสหกิจศึกษาให้นักศึกษา มสด. สมัครได้ในคลิกเดียว (Easy Apply)
                    </p>
                  </div>

                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="text-2xl">✓</div>
                    <h4 className="text-xs font-extrabold text-slate-900">ทักษะที่รับรองโดยสถาบัน (Verified)</h4>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      มั่นใจในคุณภาพของผู้สมัคร ด้วยผลงานจริงและคะแนนประเมินที่รับรองโดยคณาจารย์มหาวิทยาลัย
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* SECURITY & INSTITUTIONAL TRUST */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
            <span className="text-2xl">🔒</span>
            <h3 className="text-xs font-extrabold text-slate-900">ความปลอดภัยของข้อมูล (Data Security)</h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              ปกป้องข้อมูลส่วนตัวด้วยระบบการยืนยันตัวตนสองขั้นตอน (2FA) และจำกัดสิทธิ์การเข้าถึงข้อมูลตามบทบาท (RBAC)
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
            <span className="text-2xl">🏛️</span>
            <h3 className="text-xs font-extrabold text-slate-900">มาตรฐานสถาบัน (Academic Standards)</h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              กำกับดูแลโดยหลักสูตรและคณาจารย์ มหาวิทยาลัยสวนดุสิต สอดคล้องกับกรอบมาตรฐานสมรรถนะดิจิทัล
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
            <span className="text-2xl">🤝</span>
            <h3 className="text-xs font-extrabold text-slate-900">เครือข่ายพันธมิตร (Industry Network)</h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              เชื่อมต่อกับบริษัทและองค์กรเทคโนโลยีชั้นนำ เพื่อเปิดรับนักศึกษาเข้าฝึกงาน สหกิจศึกษา และทำงานจริง
            </p>
          </div>
        </div>

        {/* QUICK ACCESS CTA */}
        <div className="bg-gradient-to-br from-[#002d62] via-[#004182] to-slate-900 rounded-2xl p-8 text-white shadow-sm text-center space-y-4">
          <h2 className="text-xl sm:text-2xl font-black">
            เริ่มต้นใช้งาน SkillPassport มหาวิทยาลัยสวนดุสิต
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 font-medium max-w-xl mx-auto leading-relaxed">
            เลือกเข้าสู่ระบบตามบทบาทของคุณเพื่อเริ่มต้นสำรวจเครือข่ายวิชาชีพและจัดการสมรรถนะทักษะดิจิทัล
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap pt-2">
            <Link
              href="/login"
              className="px-6 py-2.5 rounded-full bg-white text-[#002d62] hover:bg-blue-50 font-bold text-xs transition shadow-sm"
            >
              เข้าสู่ระบบ SkillPassport 🚀
            </Link>
            <Link
              href="/feed"
              className="px-6 py-2.5 rounded-full border border-white/40 hover:bg-white/10 text-white font-bold text-xs transition"
            >
              สำรวจหน้าฟีดข่าวสาร 🏠
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
