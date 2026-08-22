"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface PortfolioItem {
  id: string;
  userId: string;
  bio: string | null;
  user: {
    id: string;
    name: string | null;
    image: string | null;
    role: string;
  };
  skills: {
    id?: string;
    name: string;
    level?: number;
    isVerified?: boolean;
  }[];
}

const DEFAULT_PROFILES: PortfolioItem[] = [
  {
    id: "mock-1",
    userId: "mock-somchai",
    bio: "นักพัฒนา Full-stack ภาควิชาวิทยาการคอมพิวเตอร์ มหาวิทยาลัยสวนดุสิต เชี่ยวชาญ Next.js, TypeScript และ Node.js",
    user: {
      id: "mock-somchai",
      name: "สมชาย ยอดนักโค้ด",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      role: "STUDENT",
    },
    skills: [
      { name: "React", isVerified: true, level: 5 },
      { name: "Next.js", isVerified: true, level: 5 },
      { name: "TypeScript", isVerified: true, level: 4 },
      { name: "Tailwind CSS", isVerified: true, level: 4 },
    ],
  },
  {
    id: "mock-2",
    userId: "mock-saifah",
    bio: "นักศึกษาผู้ชื่นชอบความปลอดภัยทางไซเบอร์ เน้นการทดสอบเจาะระบบและวิเคราะห์ Log ใน Security Operations Center",
    user: {
      id: "mock-saifah",
      name: "สายฟ้า แฮกเกอร์",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
      role: "STUDENT",
    },
    skills: [
      { name: "Cyber Security", isVerified: true, level: 5 },
      { name: "Python", isVerified: true, level: 4 },
      { name: "Networking", isVerified: true, level: 4 },
    ],
  },
  {
    id: "mock-3",
    userId: "mock-jane",
    bio: "นักออกแบบ UI/UX ที่เชื่อว่าดีไซน์ที่ดีต้องมาพร้อมกับประสบการณ์ใช้งานที่ยอดเยี่ยมและเข้าถึงได้ทุกคน",
    user: {
      id: "mock-jane",
      name: "เจนจิรา ดีไซเนอร์",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
      role: "STUDENT",
    },
    skills: [
      { name: "Figma", isVerified: true, level: 5 },
      { name: "UI/UX", isVerified: true, level: 5 },
      { name: "Design Systems", isVerified: true, level: 4 },
    ],
  },
  {
    id: "mock-4",
    userId: "mock-teacher",
    bio: "อาจารย์ประจำหลักสูตรวิทยาการคอมพิวเตอร์ มหาวิทยาลัยสวนดุสิต ผู้เชี่ยวชาญด้าน Cloud Architecture และการประเมินทักษะวิชาชีพ",
    user: {
      id: "mock-teacher",
      name: "ศ.ดร.สมชาย ใจดี",
      image: "https://ui-avatars.com/api/?name=Somchai+Jaidee&background=002d62&color=fff",
      role: "TEACHER",
    },
    skills: [
      { name: "Cloud Architecture", isVerified: true, level: 5 },
      { name: "Curriculum Design", isVerified: true, level: 5 },
      { name: "Next.js", isVerified: true, level: 5 },
    ],
  },
];

export default function ExplorePage() {
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>(DEFAULT_PROFILES);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkill, setSelectedSkill] = useState<string>("ALL");
  const [selectedRole, setSelectedRole] = useState<string>("ALL");
  const [connectedIds, setConnectedIds] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/portfolio?publicOnly=true");
        const data = await res.json();
        if (data.success && data.portfolios && data.portfolios.length > 0) {
          // Merge real users with defaults
          const realUsers = data.portfolios.map((p: any) => ({
            id: p.id,
            userId: p.userId,
            bio: p.bio,
            user: p.user,
            skills: p.skills || [],
          }));
          
          // Filter out duplicates if any
          const combined = [...DEFAULT_PROFILES];
          realUsers.forEach((ru: any) => {
            if (!combined.some(c => c.userId === ru.userId)) {
              combined.push(ru);
            }
          });
          setPortfolios(combined);
        }
      } catch {
        setPortfolios(DEFAULT_PROFILES);
      }
    }
    loadData();
  }, []);

  const handleConnect = (uid: string) => {
    if (connectedIds.includes(uid)) {
      setConnectedIds(connectedIds.filter(id => id !== uid));
    } else {
      setConnectedIds([...connectedIds, uid]);
    }
  };

  const handleCopyLink = (uid: string) => {
    const url = `${window.location.origin}/u/${uid}`;
    navigator.clipboard.writeText(url);
    setCopiedId(uid);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = portfolios.filter((item) => {
    const nameMatch = item.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const bioMatch = item.bio?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const skillMatch = item.skills.some((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const textMatches = searchTerm === "" || nameMatch || bioMatch || skillMatch;

    const skillTagMatches =
      selectedSkill === "ALL" ||
      item.skills.some((s) => s.name.toLowerCase().includes(selectedSkill.toLowerCase()));

    const roleMatches =
      selectedRole === "ALL" ||
      (selectedRole === "STUDENT" && item.user.role === "STUDENT") ||
      (selectedRole === "TEACHER" && item.user.role === "TEACHER") ||
      (selectedRole === "EMPLOYER" && item.user.role === "EMPLOYER");

    return textMatches && skillTagMatches && roleMatches;
  });

  return (
    <div className="min-h-screen bg-[#f4f2ee] pt-[85px] px-4 pb-16">
      <div className="max-w-[1128px] mx-auto space-y-4">
        
        {/* TOP SEARCH & FILTER BAR */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ค้นหาตามชื่อ, ความเชี่ยวชาญ, หรือทักษะ (เช่น Next.js, Cyber Security, UI/UX)..."
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0a66c2] transition"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Role Filter Pills */}
            <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {[
                { id: "ALL", label: "ทั้งหมด" },
                { id: "STUDENT", label: "🎓 นักศึกษา" },
                { id: "TEACHER", label: "👨‍🏫 อาจารย์" },
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelectedRole(r.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition border whitespace-nowrap ${
                    selectedRole === r.id
                      ? "bg-[#0a66c2] text-white border-[#0a66c2] shadow-sm"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

          </div>

          {/* Quick Skill Tags */}
          <div className="flex items-center gap-1.5 flex-wrap text-xs pt-2 border-t border-slate-100">
            <span className="text-slate-500 font-bold mr-1">ทักษะยอดนิยม:</span>
            {["ALL", "React", "Next.js", "TypeScript", "Python", "Cyber Security", "Figma", "Cloud"].map((sk) => (
              <button
                key={sk}
                onClick={() => setSelectedSkill(sk)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition border ${
                  selectedSkill === sk
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {sk === "ALL" ? "ทุกทักษะ" : `#${sk}`}
              </button>
            ))}
          </div>
        </div>

        {/* 2-COLUMN MAIN CONTENT (1128px) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Left Column: Manage My Network Sidebar (3.5 Cols) */}
          <aside className="lg:col-span-4 space-y-3">
            
            {/* Manage Network Box */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2">
              <h3 className="text-sm font-extrabold text-slate-900 px-2 py-1">
                จัดการเครือข่ายของฉัน
              </h3>
              
              <div className="space-y-1 text-xs font-bold text-slate-700">
                <Link
                  href="/explore"
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 text-slate-900"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">👥</span>
                    <span>ผู้ติดต่อ / คนรู้จัก</span>
                  </div>
                  <span className="text-[#0a66c2] font-extrabold">{connectedIds.length + 18}</span>
                </Link>

                <Link
                  href="/explore"
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 text-slate-900"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">👨‍🏫</span>
                    <span>อาจารย์และที่ปรึกษา มสด.</span>
                  </div>
                  <span className="text-slate-500 font-semibold">12</span>
                </Link>

                <Link
                  href="/employer"
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 text-slate-900"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">💼</span>
                    <span>ผู้ประกอบการและองค์กร</span>
                  </div>
                  <span className="text-slate-500 font-semibold">45</span>
                </Link>

                <Link
                  href="/feed"
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 text-slate-900"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">📰</span>
                    <span>เพจและจดหมายข่าว</span>
                  </div>
                  <span className="text-slate-500 font-semibold">6</span>
                </Link>
              </div>
            </div>

            {/* SDU Verified Student Network Card */}
            <div className="bg-gradient-to-br from-[#002d62] via-[#004182] to-slate-900 rounded-2xl p-5 text-white shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏛️</span>
                <div>
                  <h4 className="text-xs font-extrabold">เครือข่ายนักศึกษา มสด.</h4>
                  <p className="text-[10px] text-blue-200">Suan Dusit Professional Talent</p>
                </div>
              </div>
              <p className="text-xs text-blue-100 leading-relaxed font-medium">
                ร่วมสร้างเครือข่ายวิชาชีพ แลกเปลี่ยนผลงาน และเชื่อมต่อโอกาสการทำงานกับบริษัทชั้นนำ
              </p>
              <div className="pt-1">
                <Link
                  href="/employer"
                  className="inline-block w-full py-2 text-center rounded-full bg-white text-[#002d62] hover:bg-blue-50 font-bold text-xs transition shadow-sm"
                >
                  สำรวจตำแหน่งงานว่าง 💼
                </Link>
              </div>
            </div>

          </aside>

          {/* Right Column: People Grid (8.5 Cols) */}
          <main className="lg:col-span-8 space-y-3">
            
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-extrabold text-slate-900">
                ผู้คนที่คุณอาจรู้จักใน มหาวิทยาลัยสวนดุสิต ({filtered.length})
              </h2>
              <span className="text-xs text-slate-500 font-medium">คัดสรรตามความเชี่ยวชาญ</span>
            </div>

            {filtered.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-500 text-xs">
                ไม่พบบุคคลที่ตรงกับการค้นหา
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {filtered.map((item) => {
                  const uid = item.user.id || item.userId;
                  const isConnected = connectedIds.includes(uid);
                  const isTeacher = item.user.role === "TEACHER";

                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md hover:border-slate-300 transition flex flex-col justify-between"
                    >
                      {/* Card Cover Banner */}
                      <div className="h-20 w-full bg-gradient-to-r from-[#002d62] via-[#004182] to-slate-800 relative">
                        {isTeacher && (
                          <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black shadow">
                            อาจารย์ที่ปรึกษา
                          </span>
                        )}
                      </div>

                      {/* Card Profile Info */}
                      <div className="px-4 pb-4 -mt-10 space-y-3 flex-1 flex flex-col justify-between">
                        
                        <div className="space-y-2">
                          {/* Avatar */}
                          <div className="flex items-end justify-between">
                            <Link href={`/u/${uid}`} className="relative inline-block group">
                              <img
                                src={
                                  item.user.image ||
                                  `https://ui-avatars.com/api/?name=${encodeURIComponent(item.user.name || "User")}&background=002d62&color=fff`
                                }
                                alt={item.user.name || "User"}
                                className="w-16 h-16 rounded-full border-4 border-white object-cover shadow-sm group-hover:scale-105 transition"
                              />
                            </Link>

                            <button
                              onClick={() => handleCopyLink(uid)}
                              className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium transition"
                              title="คัดลอกลิงก์โปรไฟล์"
                            >
                              {copiedId === uid ? "✓ คัดลอกแล้ว" : "🔗"}
                            </button>
                          </div>

                          {/* Name & Headline */}
                          <div>
                            <Link
                              href={`/u/${uid}`}
                              className="text-sm font-extrabold text-slate-900 hover:text-[#0a66c2] hover:underline flex items-center gap-1.5 line-clamp-1"
                            >
                              <span>{item.user.name}</span>
                              <span className="text-[#057642] text-xs font-bold" title="Verified Skill Passport">✓</span>
                            </Link>
                            <p className="text-xs text-slate-600 font-medium line-clamp-2 mt-0.5 leading-relaxed">
                              {item.bio || "นักศึกษา มหาวิทยาลัยสวนดุสิต"}
                            </p>
                          </div>

                          {/* Verified Skills */}
                          <div className="space-y-1 pt-1">
                            <div className="flex flex-wrap gap-1">
                              {item.skills.slice(0, 3).map((s, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[10px] font-bold border border-slate-200"
                                >
                                  ✓ {s.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-2 border-t border-slate-100 flex gap-2">
                          <Link
                            href={`/u/${uid}`}
                            className="flex-1 py-1.5 text-center rounded-full border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-bold transition"
                          >
                            ดูโปรไฟล์
                          </Link>

                          <button
                            onClick={() => handleConnect(uid)}
                            className={`flex-1 py-1.5 rounded-full text-xs font-bold transition shadow-sm ${
                              isConnected
                                ? "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300"
                                : "bg-[#0a66c2] hover:bg-[#004182] text-white"
                            }`}
                          >
                            {isConnected ? "✓ กำลังรอตอบรับ" : "+ เชื่อมต่อ"}
                          </button>
                        </div>

                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </main>

        </div>

      </div>
    </div>
  );
}
