"use client";

import { useState } from "react";
import Link from "next/link";

export default function CompanyProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [companyName, setCompanyName] = useState("บมจ. เทคโนโลยีดีไลท์ (Delight Technology PCL.)");
  const [headline, setHeadline] = useState("ผู้นำด้านการพัฒนานวัตกรรมซอฟต์แวร์ คลาวด์ และโซลูชันความปลอดภัยทางไซเบอร์");
  const [website, setWebsite] = useState("https://delight-tech.example.com");
  const [location, setLocation] = useState("กรุงเทพมหานคร, ประเทศไทย");
  const [employees, setEmployees] = useState("100-250 คน");
  const [aboutText, setAboutText] = useState(
    "บมจ. เทคโนโลยีดีไลท์ เป็นองค์กรพันธมิตรอย่างเป็นทางการกับ มหาวิทยาลัยสวนดุสิต มุ่งเน้นการพัฒนาระบบ Enterprise และ Cybersecurity โซลูชันระดับสากล เราเปิดรับนักศึกษาและบัณฑิตใหม่ที่มีทักษะผ่านการรับรองจาก SkillPassport เข้าร่วมทีมพัฒนาที่มีวัฒนธรรมการทำงานแบบ Agile และ Hybrid Working"
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#f4f2ee] pt-[85px] px-4 pb-16">
      <div className="max-w-[1128px] mx-auto space-y-5">
        
        {/* SUCCESS TOAST */}
        {savedSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl shadow-xs animate-in fade-in">
            บันทึกข้อมูลโปรไฟล์องค์กรเรียบร้อยแล้ว ✓
          </div>
        )}

        {/* TOP COMPANY HERO CARD */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative">
          {/* Banner */}
          <div className="h-44 sm:h-56 w-full bg-gradient-to-r from-[#002d62] via-[#059669] to-slate-900 relative">
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80"
              alt="Office Banner"
              className="w-full h-full object-cover opacity-50"
            />
            <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-emerald-800 text-xs font-black shadow-sm flex items-center gap-1.5">
              <span>🏛️</span> พันธมิตรทางการ มสด. (SDU Certified Partner)
            </span>
          </div>

          {/* Profile Details */}
          <div className="p-6 sm:p-8 -mt-16 sm:-mt-20 relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
              <div className="flex items-end gap-4">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white border-4 border-white shadow-md flex items-center justify-center p-2 text-2xl font-black text-emerald-700 bg-gradient-to-br from-emerald-50 to-slate-100">
                  🏢 DT
                </div>
                <div className="space-y-1">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                    <span>{companyName}</span>
                    <span className="text-emerald-600 text-base" title="Verified Enterprise Partner">✓</span>
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium">
                    {headline}
                  </p>
                  <p className="text-xs text-slate-500 font-normal">
                    {location} • {employees} • <a href={website} target="_blank" rel="noreferrer" className="text-[#0a66c2] hover:underline font-semibold">{website}</a>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 w-full sm:w-auto pt-2 sm:pt-0">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 rounded-full border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition shadow-xs flex-1 sm:flex-initial text-center"
                >
                  {isEditing ? "ยกเลิกแก้ไข" : "✏️ แก้ไขโปรไฟล์องค์กร"}
                </button>
                <Link
                  href="/employer/jobs"
                  className="px-5 py-2 rounded-full bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold transition shadow-xs flex-1 sm:flex-initial text-center"
                >
                  + ประกาศงานใหม่
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* EDIT MODAL / FORM */}
        {isEditing && (
          <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 border-2 border-emerald-200 shadow-md space-y-4 animate-in fade-in">
            <h3 className="text-sm font-extrabold text-slate-900">แก้ไขข้อมูลโปรไฟล์องค์กร</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ชื่อองค์กร / บริษัท</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">เว็บไซต์</label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">สโลแกน / Headline</label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">เกี่ยวกับองค์กร (About Company)</label>
              <textarea
                rows={4}
                value={aboutText}
                onChange={(e) => setAboutText(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-full border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold shadow-xs"
              >
                บันทึกข้อมูล ✓
              </button>
            </div>
          </form>
        )}

        {/* 2-COLUMN DETAILS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Left Column: About & Benefits (8 Cols) */}
          <div className="lg:col-span-8 space-y-5">
            
            {/* About Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
              <h2 className="text-sm font-extrabold text-slate-900">
                เกี่ยวกับองค์กร (About Company)
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium whitespace-pre-line">
                {aboutText}
              </p>
            </div>

            {/* Workplace Benefits & Culture */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-sm font-extrabold text-slate-900">
                สิทธิประโยชน์และวัฒนธรรมองค์กร (Benefits & Culture)
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-medium text-slate-700">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                  <span className="text-xl">💻</span>
                  <div>
                    <h4 className="font-bold text-slate-900">MacBook Pro & อุปกรณ์ครบชุด</h4>
                    <p className="text-[11px] text-slate-500">สำหรับสายงาน Developer & Designer</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                  <span className="text-xl">🏠</span>
                  <div>
                    <h4 className="font-bold text-slate-900">Hybrid & Flexible Hours</h4>
                    <p className="text-[11px] text-slate-500">เข้าออฟฟิศ 2 วัน/สัปดาห์</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                  <span className="text-xl">🎓</span>
                  <div>
                    <h4 className="font-bold text-slate-900">ทุนสนับสนุนการสอบ Cert</h4>
                    <p className="text-[11px] text-slate-500">AWS, Next.js, CompTIA, CEH</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                  <span className="text-xl">🩺</span>
                  <div>
                    <h4 className="font-bold text-slate-900">ประกันสุขภาพและทันตกรรม</h4>
                    <p className="text-[11px] text-slate-500">พร้อมเบี้ยเลี้ยงสำหรับสหกิจศึกษา</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Job Openings Preview */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-extrabold text-slate-900">
                  ตำแหน่งงานที่กำลังเปิดรับสมัคร (3 ตำแหน่ง)
                </h2>
                <Link href="/employer/jobs" className="text-xs text-[#0a66c2] hover:underline font-bold">
                  จัดการทั้งหมด →
                </Link>
              </div>

              <div className="space-y-3">
                {[
                  { title: "Full-Stack Developer (Next.js & TypeScript)", type: "งานประจำ / สหกิจศึกษา", exp: "นักศึกษาจบใหม่ หรือ ปี 4", salary: "฿28,000 - ฿42,000 /เดือน" },
                  { title: "Cybersecurity SOC Analyst", type: "งานประจำ", exp: "ผ่านการรับรอง Security มสด.", salary: "฿32,000 - ฿48,000 /เดือน" },
                  { title: "UI/UX Product Designer", type: "ฝึกงาน / สหกิจศึกษา", exp: "มีพอร์ตโฟลิโอ Figma", salary: "฿12,000 - ฿18,000 /เดือน" },
                ].map((j, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition flex items-center justify-between gap-3">
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">{j.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{j.type} • {j.exp} • <strong className="text-emerald-700">{j.salary}</strong></p>
                    </div>
                    <Link href="/employer/matching" className="px-3.5 py-1.5 rounded-full bg-slate-900 text-white text-xs font-bold shrink-0 hover:bg-slate-800 transition">
                      ค้นหา Talent 🎯
                    </Link>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: SDU Verification & Quick Nav (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* SDU Partnership Box */}
            <div className="bg-gradient-to-br from-[#002d62] via-[#059669] to-slate-900 rounded-2xl p-5 text-white shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏛️</span>
                <div>
                  <h4 className="text-xs font-extrabold">เครือข่ายความร่วมมือ มสด.</h4>
                  <p className="text-[10px] text-emerald-200">Suan Dusit SkillPassport Partner</p>
                </div>
              </div>
              <p className="text-xs text-slate-100 font-medium leading-relaxed">
                บริษัทสามารถตรวจสอบประวัติการรับรองทักษะวิชาชีพของนักศึกษาที่ผ่านการทดสอบมาตรฐานจากหลักสูตรได้โดยตรง
              </p>
              <Link
                href="/employer/matching"
                className="inline-block w-full py-2 text-center rounded-full bg-white text-[#002d62] hover:bg-slate-100 font-bold text-xs transition"
              >
                ระบบ AI Talent Matching 🎯
              </Link>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2 text-xs font-bold text-slate-800">
              <h3 className="text-xs font-extrabold text-slate-900 px-2 py-1">เมนูด่วนสำหรับผู้ประกอบการ</h3>
              <Link href="/employer/jobs" className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50">
                <span>💼 จัดการประกาศงานและใบสมัคร</span>
                <span>→</span>
              </Link>
              <Link href="/employer/matching" className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50">
                <span>🎯 ค้นหาผู้สมัครตามทักษะ</span>
                <span>→</span>
              </Link>
              <Link href="/explore" className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50">
                <span>👥 ทำเนียบบุคลากรและนักศึกษา</span>
                <span>→</span>
              </Link>
              <Link href="/settings" className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50">
                <span>⚙️ ตั้งค่าบัญชีองค์กร</span>
                <span>→</span>
              </Link>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
