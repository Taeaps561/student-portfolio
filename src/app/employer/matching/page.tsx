"use client";

import { useState } from "react";
import Link from "next/link";

interface Candidate {
  id: string;
  name: string;
  major: string;
  avatar: string;
  matchScore: number;
  verifiedSkills: string[];
  bio: string;
  experienceLevel: string;
  isOpenToWork: boolean;
}

const CANDIDATES_DATA: Candidate[] = [
  {
    id: "mock-somchai",
    name: "สมชาย ยอดนักโค้ด",
    major: "สาขาวิทยาการคอมพิวเตอร์ • มหาวิทยาลัยสวนดุสิต",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    matchScore: 98,
    verifiedSkills: ["React", "Next.js", "TypeScript", "Node.js", "Tailwind CSS"],
    bio: "นักพัฒนา Full-stack เชี่ยวชาญ Next.js App Router, TypeScript, REST API มีประสบการณ์ทำโปรเจกต์ระบบคลาวด์และงานสเกลใหญ่",
    experienceLevel: "ระดับสูง (5/5 ใน Next.js & React)",
    isOpenToWork: true,
  },
  {
    id: "mock-saifah",
    name: "สายฟ้า แฮกเกอร์",
    major: "สาขาวิทยาการคอมพิวเตอร์ • มหาวิทยาลัยสวนดุสิต",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    matchScore: 95,
    verifiedSkills: ["Cyber Security", "Python", "Networking", "SOC Analysis"],
    bio: "เน้นการทดสอบเจาะระบบ (Penetration Testing) และวิเคราะห์ Log การโจมตีใน Security Operations Center ผ่านการรับรองทักษะด้านความปลอดภัย",
    experienceLevel: "ระดับสูง (5/5 ใน Security & Python)",
    isOpenToWork: true,
  },
  {
    id: "mock-jane",
    name: "เจนจิรา ดีไซเนอร์",
    major: "สาขาวิทยาการคอมพิวเตอร์ • มหาวิทยาลัยสวนดุสิต",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
    matchScore: 96,
    verifiedSkills: ["Figma", "UI/UX", "Design Systems", "Prototyping"],
    bio: "นักออกแบบ UI/UX ที่มุ่งเน้นการสร้าง Design Systems, Wireframe และทดสอบความพึงพอใจการใช้งาน มีพอร์ตโฟลิโอแอปพลิเคชันการเงินและการศึกษา",
    experienceLevel: "ระดับสูง (5/5 ใน Figma & UI/UX)",
    isOpenToWork: true,
  },
];

export default function TalentMatchingPage() {
  const [selectedSkillFilter, setSelectedSkillFilter] = useState("ALL");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("ALL");
  const [invitedIds, setInvitedIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState("");

  const handleInvite = (id: string, name: string) => {
    if (!invitedIds.includes(id)) {
      setInvitedIds([...invitedIds, id]);
      setToastMessage(`ส่งคำเชิญสัมภาษณ์ไปยัง ${name} เรียบร้อยแล้ว 📩`);
      setTimeout(() => setToastMessage(""), 3500);
    }
  };

  const filteredCandidates = CANDIDATES_DATA.filter((c) => {
    const matchesSkill =
      selectedSkillFilter === "ALL" ||
      c.verifiedSkills.some((s) => s.toLowerCase().includes(selectedSkillFilter.toLowerCase()));
    return matchesSkill;
  });

  return (
    <div className="min-h-screen bg-[#f4f2ee] pt-[85px] px-4 pb-16">
      <div className="max-w-[1128px] mx-auto space-y-5">
        
        {/* TOAST */}
        {toastMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl shadow-xs animate-in fade-in">
            {toastMessage}
          </div>
        )}

        {/* TOP HERO */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold mb-1.5">
                🎯 SDU AI Talent Matching Engine
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                ระบบค้นหาและจับคู่ผู้มีความสามารถตามทักษะ (AI Talent Matching)
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
                คัดกรองนักศึกษา มสด. ที่มีคะแนนและหลักฐานทักษะดิจิทัลผ่านการรับรองจากคณาจารย์ประจำหลักสูตร
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/employer/jobs"
                className="px-4 py-2 rounded-full border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition"
              >
                💼 ตำแหน่งงานที่เปิดรับ
              </Link>
            </div>
          </div>

          {/* Quick Skill Filters */}
          <div className="pt-3 border-t border-slate-100 flex items-center gap-2 flex-wrap text-xs">
            <span className="text-slate-500 font-bold mr-1">กรองตามทักษะที่ต้องการ:</span>
            {["ALL", "React", "Next.js", "TypeScript", "Cyber Security", "Python", "Figma", "UI/UX"].map((sk) => (
              <button
                key={sk}
                onClick={() => setSelectedSkillFilter(sk)}
                className={`px-3 py-1.5 rounded-full font-bold transition border ${
                  selectedSkillFilter === sk
                    ? "bg-[#059669] text-white border-[#059669] shadow-xs"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {sk === "ALL" ? "ทุกทักษะ" : `#${sk}`}
              </button>
            ))}
          </div>
        </div>

        {/* CANDIDATES GRID */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-extrabold text-slate-900">
              รายชื่อผู้สมัครที่แนะนำตามเกณฑ์ ({filteredCandidates.length} คน)
            </h2>
            <span className="text-xs text-slate-500">เรียงตามคะแนนความตรงกับตำแหน่งงาน</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCandidates.map((cand) => {
              const isInvited = invitedIds.includes(cand.id);

              return (
                <div
                  key={cand.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={cand.avatar}
                          alt={cand.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-slate-200"
                        />
                        <div>
                          <Link
                            href={`/u/${cand.id}`}
                            className="text-xs sm:text-sm font-extrabold text-slate-900 hover:text-[#0a66c2] hover:underline flex items-center gap-1.5"
                          >
                            <span>{cand.name}</span>
                            <span className="text-[#057642] text-xs font-bold" title="Verified SkillPassport">✓</span>
                          </Link>
                          <p className="text-[11px] text-slate-500 font-medium line-clamp-1">
                            {cand.major}
                          </p>
                        </div>
                      </div>

                      {/* Match Badge */}
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black shrink-0">
                        {cand.matchScore}%
                      </span>
                    </div>

                    {/* Bio */}
                    <p className="text-xs text-slate-600 font-medium leading-relaxed line-clamp-3">
                      {cand.bio}
                    </p>

                    {/* Verified Skills */}
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-400 font-bold">ทักษะที่ผ่านการรับรองโดย มสด.:</p>
                      <div className="flex flex-wrap gap-1">
                        {cand.verifiedSkills.map((sk, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-slate-800 text-[10px] font-bold"
                          >
                            ✓ {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-slate-100 flex gap-2">
                    <Link
                      href={`/u/${cand.id}`}
                      className="flex-1 py-1.5 text-center rounded-full border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold transition"
                    >
                      ดูพอร์ตโฟลิโอ 🔗
                    </Link>

                    <button
                      onClick={() => handleInvite(cand.id, cand.name)}
                      disabled={isInvited}
                      className={`flex-1 py-1.5 rounded-full text-xs font-bold transition shadow-xs ${
                        isInvited
                          ? "bg-slate-100 text-slate-500 cursor-not-allowed border border-slate-200"
                          : "bg-[#059669] hover:bg-[#047857] text-white"
                      }`}
                    >
                      {isInvited ? "✓ เชิญแล้ว" : "📩 เชิญสัมภาษณ์"}
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
